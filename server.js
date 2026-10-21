try { if (typeof process.loadEnvFile === 'function') process.loadEnvFile(); } catch {}
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const db = require('./db');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const pinLookupCache = new Map();
const addressSuggestionCache = new Map();

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

function sendJson(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
}

// ── Read JSON body ──────────────────────────────────────────
async function readJsonBody(req) {
    let body = '';
    for await (const chunk of req) {
        body += chunk;
        if (body.length > 10_000) throw new Error('Request body is too large.');
    }
    return JSON.parse(body || '{}');
}
// ── Rate limiter (in-memory, per IP) ────────────────────────
const rateBuckets = new Map();

function getClientIp(req) {
    return req.headers['cf-connecting-ip']
        || (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
        || req.socket.remoteAddress
        || 'unknown';
}

// Returns true if the request is allowed, false if it was blocked (response already sent).
function rateLimit(req, res, { name, max, windowMs }) {
    const key = `${name}:${getClientIp(req)}`;
    const now = Date.now();

    let bucket = rateBuckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        bucket = { count: 0, resetAt: now + windowMs };
        rateBuckets.set(key, bucket);
    }

    bucket.count++;
    if (bucket.count > max) {
        const retrySeconds = Math.ceil((bucket.resetAt - now) / 1000);
        const retryMinutes = Math.max(1, Math.ceil(retrySeconds / 60));
        res.writeHead(429, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'Retry-After': String(retrySeconds),
        });
        res.end(JSON.stringify({
            ok: false,
            error: `Too many attempts. Please try again in ${retryMinutes} minute${retryMinutes > 1 ? 's' : ''}.`,
        }));
        return false;
    }
    return true;
}

// Clean up expired entries so the Map doesn't grow forever
setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateBuckets) {
        if (bucket.resetAt <= now) rateBuckets.delete(key);
    }
}, 10 * 60 * 1000).unref();
// ── Cloudflare Turnstile captcha verification ───────────────
async function verifyTurnstile(token, req) {
    if (!token || typeof token !== 'string' || !process.env.TURNSTILE_SECRET) return false;
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET,
                response: token,
                remoteip: req.headers['cf-connecting-ip'] || req.socket.remoteAddress || '',
            }),
            signal: AbortSignal.timeout(8000),
        });
        const data = await response.json();
        return data.success === true;
    } catch (err) {
        console.error('Turnstile error:', err.message);
        return false; // fail closed: no verification, no login
    }
}
// ── Auth Middleware: extract user from session header ────────
async function authenticateRequest(req) {
    const sessionToken = req.headers['x-session'];
    if (!sessionToken) return null;
    try {
        const user = await db.User.findOne({ sessionToken });
        return user;
    } catch {
        return null;
    }
}

// ══════════════════════════════════════════════════════════════
//  AUTH API ROUTES
// ══════════════════════════════════════════════════════════════

async function handleRegister(req, res) {
    // Registration must go through the server-verified OTP flow below.
    return sendJson(res, 400, { ok: false, error: 'Please register using email OTP verification.' });
}

function normalizeIndianPhone(value) {
    let digits = String(value || '').replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
    if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);
    return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

function otpDigest(recipient, purpose, otp) {
    const secret = process.env.OTP_HASH_SECRET || process.env.BREVO_API_KEY || process.env.TURNSTILE_SECRET;
    if (!secret) throw new Error('OTP_HASH_SECRET must be configured.');
    return crypto.createHmac('sha256', secret).update(`${String(recipient).toLowerCase()}|${purpose}|${otp}`).digest('hex');
}

async function sendBrevoOtp(email, otp, purpose = 'register') {
    const apiKey = (process.env.BREVO_API_KEY || '').trim();
    const senderEmail = (process.env.BREVO_SENDER_EMAIL || '').trim();
    const senderName = (process.env.BREVO_SENDER_NAME || 'Hungriee').trim();
    if (!apiKey) throw new Error('BREVO_API_KEY is missing.');
    if (!senderEmail) throw new Error('BREVO_SENDER_EMAIL is missing.');

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
        body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email }],
            subject: purpose === 'forgot-password' ? 'Your Hungriee password reset code' : 'Your Hungriee verification code',
            textContent: purpose === 'forgot-password'
                ? `Hi there,

We received a request to reset the password for your Hungriee account.

Your password reset code is: ${otp}

Enter this code on the Hungriee password reset screen to verify your email and choose a new password. This code expires in 5 minutes and can only be used once.

If you didn't request a password reset, you can safely ignore this email. Your password will not change unless the code is verified and a new password is saved.

For your security, never share this code with anyone.

Hungriee Support
Good food. Closer to you.`
                : `Welcome to Hungriee!

Use this verification code to complete your account registration: ${otp}

This code expires in 5 minutes. Never share it with anyone. If you didn't request this email, you can safely ignore it.

Hungriee — Good food. Closer to you.`,
            htmlContent: `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${purpose === 'forgot-password' ? 'Your Hungriee password reset code' : 'Your Hungriee verification code'}</title></head>
<body style="margin:0;padding:0;background:#fff8f1;font-family:Arial,Helvetica,sans-serif;color:#242424;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${purpose === 'forgot-password' ? 'Your Hungriee password reset code is inside. It expires in 5 minutes.' : 'Your Hungriee verification code is inside. It expires in 5 minutes.'}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fff8f1;width:100%;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #f2e5d9;border-radius:20px;overflow:hidden;">
        <tr><td align="center" style="padding:30px 24px 24px;background:#fff1e4;border-bottom:1px solid #f5e2d1;">
          <img src="https://hungriee.ihooman.ai/images/hungriee-mark.png" width="54" height="54" alt="Hungriee logo" style="display:block;width:54px;height:54px;margin:0 auto 10px;border:0;">
          <div style="font-size:30px;line-height:36px;font-weight:800;letter-spacing:-1px;color:#242424;">Hungriee<span style="color:#f47721;">.</span></div>
          <div style="margin-top:6px;font-size:11px;line-height:16px;letter-spacing:2px;font-weight:700;color:#8b7564;">GOOD FOOD. CLOSER TO YOU.</div>
        </td></tr>
        <tr><td align="center" style="padding:34px 28px 12px;">
          <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:#fff0e4;color:#d85c0b;font-size:11px;line-height:14px;font-weight:800;letter-spacing:1.5px;">${purpose === 'forgot-password' ? 'PASSWORD RESET' : 'VERIFY YOUR ACCOUNT'}</div>
          <h1 style="margin:18px 0 12px;font-size:28px;line-height:35px;letter-spacing:-.6px;color:#242424;">${purpose === 'forgot-password' ? 'Reset your password' : 'Here’s your verification code'}</h1>
          <p style="margin:0 auto;max-width:410px;font-size:15px;line-height:24px;color:#746b65;">${purpose === 'forgot-password' ? 'Use this one-time code to verify your email before choosing a new password for your Hungriee account.' : 'Use the code below to complete your Hungriee account registration and get ready to discover your next favourite meal.'}</p>
        </td></tr>
        <tr><td align="center" style="padding:20px 28px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:420px;background:#fff8f2;border:1px dashed #f2a56d;border-radius:14px;">
            <tr><td align="center" style="padding:22px 12px 8px;font-size:10px;line-height:14px;font-weight:800;letter-spacing:2px;color:#9b7860;">${purpose === 'forgot-password' ? 'YOUR PASSWORD RESET CODE' : 'YOUR ONE-TIME PASSWORD'}</td></tr>
            <tr><td align="center" style="padding:2px 8px 22px;font-size:36px;line-height:44px;font-weight:800;letter-spacing:9px;color:#ef6c16;">${otp}</td></tr>
          </table>
          <p style="margin:14px 0 0;font-size:12px;line-height:19px;color:#8a817b;">${purpose === 'forgot-password' ? 'Your password will not change until you verify this code and save a new password.' : 'For your security, this code can only be used once.'}</p>
        </td></tr>
        <tr><td style="padding:0 24px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fbfaf8;border-radius:12px;">
            <tr>
              <td width="50%" valign="top" style="padding:17px 12px;text-align:center;border-right:1px solid #eee5dd;">
                <div style="font-size:20px;line-height:26px;">⏱</div>
                <div style="margin-top:5px;font-size:12px;line-height:18px;color:#83766d;">Code expires in</div>
                <div style="font-size:14px;line-height:20px;font-weight:700;color:#302a26;">5 minutes</div>
              </td>
              <td width="50%" valign="top" style="padding:17px 12px;text-align:center;">
                <div style="font-size:20px;line-height:26px;">🔒</div>
                <div style="margin-top:5px;font-size:12px;line-height:18px;color:#83766d;">Keep it private</div>
                <div style="font-size:14px;line-height:20px;font-weight:700;color:#302a26;">Never share your code</div>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 28px 28px;">
          ${purpose === 'forgot-password' ? '' : `<div style="padding:18px 20px;background:#fff4e9;border-radius:12px;border-left:4px solid #f47721;">
            <div style="font-size:15px;line-height:22px;font-weight:700;color:#3b3029;">Welcome to Hungriee!</div>
            <p style="margin:6px 0 0;font-size:13px;line-height:21px;color:#75685e;">Once your email is verified, you can explore restaurants, order your favourite food, and enjoy a simpler way to satisfy your cravings.</p>
          </div>`}
          <p style="margin:20px 0 0;text-align:center;font-size:12px;line-height:19px;color:#8a817b;">${purpose === 'forgot-password' ? "Didn't request a password reset? You can safely ignore this email." : "Didn't request this code? No worries — you can safely ignore this email."}</p>
        </td></tr>
        <tr><td style="padding:20px 24px;background:#faf7f3;border-top:1px solid #f0e6dd;text-align:center;">
          <div style="font-size:15px;line-height:22px;font-weight:800;color:#ef6c16;">Hungriee<span style="color:#242424;">.</span></div>
          <div style="margin-top:5px;font-size:11px;line-height:18px;color:#8a817b;">Good food. Closer to you.</div>
          <div style="margin-top:10px;font-size:11px;line-height:18px;color:#9b9189;">This is an automated account-security email.</div>
        </td></tr>
      </table>
      <div style="max-width:560px;padding:16px 8px 0;font-size:10px;line-height:16px;text-align:center;color:#a1968d;">Please don’t reply directly to this message.</div>
    </td></tr>
  </table>
</body>
</html>`,
        }),
        signal: AbortSignal.timeout(12000),
    });
    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok) {
        console.error('[Brevo] email API rejected request:', response.status, data?.message || data?.code || 'unknown error');
        throw new Error('Brevo could not send the verification email.');
    }
    return data;
}

async function handleSendOtp(req, res) {
    if (!rateLimit(req, res, { name: 'send-otp', max: 5, windowMs: 15 * 60 * 1000 })) return;
    let input;
    try { input = await readJsonBody(req); } catch {
        return sendJson(res, 400, { ok: false, error: 'Invalid request.' });
    }
    const purpose = input.purpose === 'verify-phone' ? 'verify-phone' : 'register';
    const phone = normalizeIndianPhone(input.phone);
    let email = String(input.email || '').toLowerCase().trim();
    let user = null;

    if (purpose === 'register') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return sendJson(res, 400, { ok: false, error: 'Please enter a valid email address.' });
        }
        if (!phone) return sendJson(res, 400, { ok: false, error: 'Enter a valid 10-digit Indian mobile number.' });
        const isResend = input.resend === true;
        if (isResend) {
            const existingChallenge = await db.OtpChallenge.findOne({ email, purpose: 'register', userId: null });
            if (!existingChallenge || existingChallenge.expiresAt.getTime() <= Date.now()) {
                return sendJson(res, 400, { ok: false, error: 'Your verification session expired. Please submit the registration form again.' });
            }
        } else if (!(await verifyTurnstile(input['cf-turnstile-response'], req))) {
            return sendJson(res, 400, { ok: false, error: 'Captcha verification failed. Please try again.' });
        }
        if (await db.User.findOne({ email })) return sendJson(res, 409, { ok: false, error: 'An account with this email already exists.' });
    } else {
        user = await authenticateRequest(req);
        if (!user) return sendJson(res, 401, { ok: false, error: 'Please sign in first.' });
        if (!phone || normalizeIndianPhone(user.phone) !== phone) return sendJson(res, 400, { ok: false, error: 'Verify the phone number saved on your account.' });
        if (user.isPhoneVerified) return sendJson(res, 200, { ok: true, message: 'This phone number is already verified.' });
    }

    try {
        const otp = String(crypto.randomInt(100000, 1000000));
        const recipient = purpose === 'register' ? email : phone;
        const otpHash = otpDigest(recipient, purpose, otp);
        await db.OtpChallenge.deleteMany(purpose === 'register' ? { email, purpose } : { phone, purpose });
        if (purpose === 'register') await sendBrevoOtp(email, otp);
        else await sendTextBeeOtp(phone, otp);
        await db.OtpChallenge.create({
            phone: phone || '', email: purpose === 'register' ? email : '', purpose,
            userId: user?._id || null, otpHash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), attempts: 0,
        });
        return sendJson(res, 200, { ok: true, message: purpose === 'register' ? 'Verification code sent by email.' : 'Verification code sent by SMS.' });
    } catch (err) {
        console.error('OTP send failed:', err.message);
        return sendJson(res, 502, { ok: false, error: purpose === 'register' ? 'Could not send the email. Check Brevo API key and verified sender settings, then try again.' : 'Could not send the SMS. Check TextBee device status and server configuration, then try again.' });
    }
}

async function consumeOtp(recipient, purpose, otp, userId = null) {
    if (!/^\d{6}$/.test(String(otp || ''))) return { ok: false, error: 'Enter the 6-digit code.' };
    const query = purpose === 'register' ? { email: String(recipient).toLowerCase(), purpose, ...(userId ? { userId } : { userId: null }) } : { phone: recipient, purpose, ...(userId ? { userId } : { userId: null }) };
    const challenge = await db.OtpChallenge.findOne(query).sort({ createdAt: -1 });
    if (!challenge || challenge.expiresAt.getTime() <= Date.now()) {
        if (challenge) await challenge.deleteOne();
        return { ok: false, error: 'That code has expired. Request a new one.' };
    }
    if (challenge.attempts >= 5) {
        await challenge.deleteOne();
        return { ok: false, error: 'Too many incorrect attempts. Request a new code.' };
    }
    const candidate = otpDigest(recipient, purpose, String(otp));
    const a = Buffer.from(candidate, 'hex');
    const b = Buffer.from(challenge.otpHash, 'hex');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        challenge.attempts += 1;
        await challenge.save();
        return { ok: false, error: 'Incorrect code. Please try again.' };
    }
    await challenge.deleteOne();
    return { ok: true };
}

async function handleCompleteRegistration(req, res) {
    if (!rateLimit(req, res, { name: 'complete-register', max: 10, windowMs: 15 * 60 * 1000 })) return;
    let input;
    try { input = await readJsonBody(req); } catch { return sendJson(res, 400, { ok: false, error: 'Invalid request.' }); }
    const name = String(input.name || '').trim();
    const email = String(input.email || '').toLowerCase().trim();
    const password = String(input.password || '');
    const phone = normalizeIndianPhone(input.phone);
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6 || !phone) {
        return sendJson(res, 400, { ok: false, error: 'Please check your name, email, phone number and password.' });
    }
    try {
        const checked = await consumeOtp(email, 'register', input.otp);
        if (!checked.ok) return sendJson(res, 400, { ok: false, error: checked.error });
        if (await db.User.findOne({ email })) return sendJson(res, 409, { ok: false, error: 'An account with this email already exists.' });
        const user = new db.User({ name, email, phone, isEmailVerified: true, isPhoneVerified: false, password });
        const token = user.generateSession();
        await user.save();
        return sendJson(res, 201, { ok: true, sessionToken: token, user: sanitizeUser(user) });
    } catch (err) {
        console.error('Complete registration error:', err.message);
        return sendJson(res, 500, { ok: false, error: 'Could not create your account. Please try again.' });
    }
}


async function handleForgotPasswordSendOtp(req, res) {
    if (!rateLimit(req, res, { name: 'forgot-send', max: 5, windowMs: 15 * 60 * 1000 })) return;
    let input;
    try { input = await readJsonBody(req); } catch { return sendJson(res, 400, { ok: false, error: 'Invalid request.' }); }
    const email = String(input.email || '').toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return sendJson(res, 400, { ok: false, error: 'Enter a valid email address.' });
    try {
        const user = await db.User.findOne({ email });
        // Always return the same message whether or not the account exists.
        if (user) {
            const otp = String(crypto.randomInt(100000, 1000000));
            await db.OtpChallenge.deleteMany({ email, purpose: 'forgot-password' });
            await sendBrevoOtp(email, otp, 'forgot-password');
            await db.OtpChallenge.create({ email, purpose: 'forgot-password', userId: user._id, otpHash: otpDigest(email, 'forgot-password', otp), expiresAt: new Date(Date.now() + 5 * 60 * 1000), attempts: 0 });
        }
        return sendJson(res, 200, { ok: true, message: 'If an account exists for that email, a verification code has been sent.' });
    } catch (err) {
        console.error('Forgot password OTP error:', err.message);
        return sendJson(res, 500, { ok: false, error: 'Could not send the code right now. Please try again.' });
    }
}

async function handleForgotPasswordVerifyOtp(req, res) {
    if (!rateLimit(req, res, { name: 'forgot-verify', max: 10, windowMs: 15 * 60 * 1000 })) return;
    let input;
    try { input = await readJsonBody(req); } catch { return sendJson(res, 400, { ok: false, error: 'Invalid request.' }); }
    const email = String(input.email || '').toLowerCase().trim();
    const otp = String(input.otp || '');
    if (!/^\d{6}$/.test(otp)) return sendJson(res, 400, { ok: false, error: 'Enter the 6-digit code.' });
    try {
        const challenge = await db.OtpChallenge.findOne({ email, purpose: 'forgot-password' }).sort({ createdAt: -1 });
        if (!challenge || challenge.expiresAt.getTime() <= Date.now()) return sendJson(res, 400, { ok: false, error: 'That code has expired. Request a new one.' });
        if (challenge.attempts >= 5) { await challenge.deleteOne(); return sendJson(res, 429, { ok: false, error: 'Too many incorrect attempts. Request a new code.' }); }
        const candidate = otpDigest(email, 'forgot-password', otp);
        const a = Buffer.from(candidate, 'hex'), b = Buffer.from(challenge.otpHash, 'hex');
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) { challenge.attempts += 1; await challenge.save(); return sendJson(res, 400, { ok: false, error: 'Incorrect code. Please try again.' }); }
        await challenge.deleteOne();
        const resetToken = crypto.randomBytes(32).toString('hex');
        await db.OtpChallenge.deleteMany({ email, purpose: 'password-reset' });
        await db.OtpChallenge.create({ email, purpose: 'password-reset', userId: challenge.userId, otpHash: otpDigest(email, 'password-reset', resetToken), expiresAt: new Date(Date.now() + 10 * 60 * 1000), attempts: 0 });
        return sendJson(res, 200, { ok: true, resetToken, message: 'Email verified. You can now choose a new password.' });
    } catch (err) { console.error('Forgot password verification error:', err.message); return sendJson(res, 500, { ok: false, error: 'Verification failed. Please try again.' }); }
}

async function handleForgotPasswordReset(req, res) {
    if (!rateLimit(req, res, { name: 'forgot-reset', max: 5, windowMs: 15 * 60 * 1000 })) return;
    let input;
    try { input = await readJsonBody(req); } catch { return sendJson(res, 400, { ok: false, error: 'Invalid request.' }); }
    const email = String(input.email || '').toLowerCase().trim();
    const resetToken = String(input.resetToken || '');
    const newPassword = String(input.newPassword || '');
    if (newPassword.length < 6) return sendJson(res, 400, { ok: false, error: 'Password must be at least 6 characters.' });
    if (!resetToken) return sendJson(res, 400, { ok: false, error: 'Verify your email first.' });
    try {
        const challenge = await db.OtpChallenge.findOne({ email, purpose: 'password-reset' }).sort({ createdAt: -1 });
        if (!challenge || challenge.expiresAt.getTime() <= Date.now()) return sendJson(res, 400, { ok: false, error: 'Your verification expired. Start again.' });
        const candidate = otpDigest(email, 'password-reset', resetToken);
        const a = Buffer.from(candidate, 'hex'), b = Buffer.from(challenge.otpHash, 'hex');
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return sendJson(res, 400, { ok: false, error: 'Please verify your email again.' });
        const user = await db.User.findOne({ _id: challenge.userId, email });
        if (!user) { await challenge.deleteOne(); return sendJson(res, 400, { ok: false, error: 'Account not found. Please start again.' }); }
        user.password = newPassword;
        user.sessionToken = ''; // invalidate existing sessions after a password reset
        await user.save();
        await challenge.deleteOne();
        await db.OtpChallenge.deleteMany({ email, purpose: 'forgot-password' });
        return sendJson(res, 200, { ok: true, message: 'Password reset successfully. Please sign in.' });
    } catch (err) { console.error('Password reset error:', err.message); return sendJson(res, 500, { ok: false, error: 'Could not reset your password. Please try again.' }); }
}

async function handleLogin(req, res) {
    if (!rateLimit(req, res, { name: 'login', max: 10, windowMs: 15 * 60 * 1000 })) return;

    let input;
    try { input = await readJsonBody(req); } catch {
        return sendJson(res, 400, { ok: false, error: 'Invalid request.' });
    }

    if (!(await verifyTurnstile(input['cf-turnstile-response'], req))) {
        return sendJson(res, 400, { ok: false, error: 'Captcha verification failed. Please try again.' });
    }

    const { email, password } = input;
    if (!email || !password) {
        return sendJson(res, 400, { ok: false, error: 'Email and password are required.' });
    }

    try {
        const user = await db.User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return sendJson(res, 401, { ok: false, error: 'Invalid email or password.' });
        }

        const valid = await user.comparePassword(password);
        if (!valid) {
            return sendJson(res, 401, { ok: false, error: 'Invalid email or password.' });
        }

        const token = user.generateSession();
        await user.save();

        return sendJson(res, 200, {
            ok: true,
            sessionToken: token,
            user: sanitizeUser(user),
        });
    } catch (err) {
        console.error('Login error:', err.message);
        return sendJson(res, 500, { ok: false, error: 'Something went wrong. Please try again.' });
    }
}

async function handleLogout(req, res) {
    const user = await authenticateRequest(req);
    if (user) {
        user.sessionToken = '';
        await user.save();
    }
    return sendJson(res, 200, { ok: true });
}

async function handleMe(req, res) {
    const user = await authenticateRequest(req);
    if (!user) {
        return sendJson(res, 401, { ok: false, error: 'Not authenticated.' });
    }
    return sendJson(res, 200, { ok: true, user: sanitizeUser(user) });
}

async function handleUpdateProfile(req, res) {
    const user = await authenticateRequest(req);
    if (!user) return sendJson(res, 401, { ok: false, error: 'Not authenticated.' });

    let input;
    try { input = await readJsonBody(req); } catch {
        return sendJson(res, 400, { ok: false, error: 'Invalid request.' });
    }

    if (input.name !== undefined) {
        const cleanName = String(input.name).trim();
        if (cleanName.length < 2) {
            return sendJson(res, 400, { ok: false, error: 'Name must be at least 2 characters.' });
        }
        user.name = cleanName;
    }

    try {
        await user.save();
        return sendJson(res, 200, { ok: true, user: sanitizeUser(user) });
    } catch (err) {
        console.error('Update profile error:', err.message);
        return sendJson(res, 500, { ok: false, error: 'Update failed.' });
    }
}

async function handleChangePassword(req, res) {
    if (!rateLimit(req, res, { name: 'chpw', max: 5, windowMs: 15 * 60 * 1000 })) return;
    const user = await authenticateRequest(req);
    if (!user) return sendJson(res, 401, { ok: false, error: 'Not authenticated.' });

    let input;
    try { input = await readJsonBody(req); } catch {
        return sendJson(res, 400, { ok: false, error: 'Invalid request.' });
    }

    const { currentPassword, newPassword } = input;
    if (!currentPassword || !newPassword) {
        return sendJson(res, 400, { ok: false, error: 'Both current and new passwords are required.' });
    }
    if (newPassword.length < 6) {
        return sendJson(res, 400, { ok: false, error: 'New password must be at least 6 characters.' });
    }

    const valid = await user.comparePassword(currentPassword);
    if (!valid) {
        return sendJson(res, 401, { ok: false, error: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    const token = user.generateSession(); // re-generate session for security
    await user.save();

    return sendJson(res, 200, { ok: true, sessionToken: token });
}

function sanitizeUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isPhoneVerified: !!user.isPhoneVerified,
        isEmailVerified: !!user.isEmailVerified,
        createdAt: user.createdAt,
    };
}

async function handleVerifyPhone(req, res) {
    const user = await authenticateRequest(req);
    if (!user) return sendJson(res, 401, { ok: false, error: 'Please sign in first.' });
    let input;
    try { input = await readJsonBody(req); } catch { return sendJson(res, 400, { ok: false, error: 'Invalid request.' }); }
    const phone = normalizeIndianPhone(user.phone);
    if (!phone) return sendJson(res, 400, { ok: false, error: 'Save a valid Indian mobile number to your profile first.' });
    try {
        const checked = await consumeOtp(phone, 'verify-phone', input.otp, user._id);
        if (!checked.ok) return sendJson(res, 400, { ok: false, error: checked.error });
        user.isPhoneVerified = true;
        await user.save();
        return sendJson(res, 200, { ok: true, user: sanitizeUser(user) });
    } catch (err) {
        console.error('Phone verification failed:', err.message);
        return sendJson(res, 500, { ok: false, error: 'Could not verify the phone number.' });
    }
}

// ══════════════════════════════════════════════════════════════
//  ADDRESS API ROUTES
// ══════════════════════════════════════════════════════════════

async function handleAddAddress(req, res) {
    const user = await authenticateRequest(req);
    if (!user) return sendJson(res, 401, { ok: false, error: 'Not authenticated.' });

    let input;
    try { input = await readJsonBody(req); } catch {
        return sendJson(res, 400, { ok: false, error: 'Invalid request.' });
    }

    const { label, line1, line2, city, state, pinCode, phone, isDefault } = input;
    const cleanPin = String(pinCode || '').trim();
    if (!line1?.trim() || !city?.trim() || !state?.trim() || !cleanPin) {
        return sendJson(res, 400, { ok: false, error: 'Address, city, state and PIN code are required.' });
    }
    if (!/^\d{6}$/.test(cleanPin)) {
        return sendJson(res, 400, { ok: false, error: 'Enter a valid 6-digit PIN code.' });
    }

    try {
        // If this is default, unset other defaults
        if (isDefault) {
            user.addresses.forEach(a => { a.isDefault = false; });
        }

        user.addresses.push({
            label: label || 'Home',
            line1: line1.trim(),
            line2: (line2 || '').trim(),
            city: city.trim(),
            state: state.trim(),
            pinCode: cleanPin,
            phone: (phone || '').trim(),
            isDefault: !!isDefault
        });
        await user.save();

        return sendJson(res, 201, { ok: true, addresses: user.addresses });
    } catch (err) {
        console.error('Add address error:', err.message);
        return sendJson(res, 500, { ok: false, error: 'Failed to save address.' });
    }
}

async function handleUpdateAddress(req, res) {
    const user = await authenticateRequest(req);
    if (!user) return sendJson(res, 401, { ok: false, error: 'Not authenticated.' });

    let input;
    try { input = await readJsonBody(req); } catch {
        return sendJson(res, 400, { ok: false, error: 'Invalid request.' });
    }

    const addr = user.addresses.id(input.addressId);
    if (!addr) return sendJson(res, 404, { ok: false, error: 'Address not found.' });

    try {
        if (input.isDefault) {
            user.addresses.forEach(a => { a.isDefault = false; });
        }

        if (input.label) addr.label = input.label;
        if (input.line1) addr.line1 = input.line1.trim();
        if (typeof input.line2 === 'string') addr.line2 = input.line2.trim();
        if (input.city) addr.city = input.city.trim();
        if (input.state) addr.state = input.state.trim();
        if (input.pinCode) {
            const cleanPin = String(input.pinCode).trim();
            if (!/^\d{6}$/.test(cleanPin)) {
                return sendJson(res, 400, { ok: false, error: 'Enter a valid 6-digit PIN code.' });
            }
            addr.pinCode = cleanPin;
        }
        if (typeof input.phone === 'string') addr.phone = input.phone.trim();
        addr.isDefault = !!input.isDefault;

        await user.save();
        return sendJson(res, 200, { ok: true, addresses: user.addresses });
    } catch (err) {
        console.error('Update address error:', err.message);
        return sendJson(res, 500, { ok: false, error: 'Failed to update address.' });
    }
}

async function handleDeleteAddress(req, res) {
    const user = await authenticateRequest(req);
    if (!user) return sendJson(res, 401, { ok: false, error: 'Not authenticated.' });

    let input;
    try { input = await readJsonBody(req); } catch {
        return sendJson(res, 400, { ok: false, error: 'Invalid request.' });
    }

    const addr = user.addresses.id(input.addressId);
    if (!addr) return sendJson(res, 404, { ok: false, error: 'Address not found.' });

    try {
        addr.deleteOne();
        await user.save();
        return sendJson(res, 200, { ok: true, addresses: user.addresses });
    } catch (err) {
        console.error('Delete address error:', err.message);
        return sendJson(res, 500, { ok: false, error: 'Failed to delete address.' });
    }
}

async function handleListAddresses(req, res) {
    const user = await authenticateRequest(req);
    if (!user) return sendJson(res, 401, { ok: false, error: 'Not authenticated.' });
    return sendJson(res, 200, { ok: true, addresses: user.addresses });
}

// ══════════════════════════════════════════════════════════════
//  ORDER API ROUTES
// ══════════════════════════════════════════════════════════════

function generateOrderNumber() {
    const prefix = 'HUN';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

async function handlePlaceOrder(req, res) {
    const user = await authenticateRequest(req);
    if (!user) return sendJson(res, 401, { ok: false, error: 'Please sign in to place an order.' });
    if (user.isEmailVerified === false) return sendJson(res, 403, { ok: false, error: 'Verify your email address before placing an order.' });

    let input;
    try { input = await readJsonBody(req); } catch {
        return sendJson(res, 400, { ok: false, error: 'Invalid request.' });
    }

    const { items, subtotal, delivery, discount, total, coupon, address } = input;
    if (!Array.isArray(items) || !items.length) {
        return sendJson(res, 400, { ok: false, error: 'Cart is empty.' });
    }

    try {
        const sanitizedItems = items.map(item => ({
            dishId: Number(item.dishId || item.id) || 1,
            name: String(item.name || 'Dish').slice(0, 100),
            image: String(item.image || ''),
            price: Math.max(0, Number(item.price) || 0),
            qty: Math.max(1, Number(item.qty) || 1),
        }));

        const order = new db.Order({
            user: user._id,
            orderNumber: generateOrderNumber(),
            items: sanitizedItems,
            subtotal: Math.max(0, Number(subtotal) || 0),
            delivery: Math.max(0, Number(delivery) || 0),
            discount: Math.max(0, Number(discount) || 0),
            total: Math.max(0, Number(total) || 0),
            coupon: String(coupon || '').slice(0, 30),
            address: address || {},
            status: 'Confirmed',
            estimatedDelivery: '30-40 min',
        });
        await order.save();

        return sendJson(res, 201, { ok: true, order: { orderNumber: order.orderNumber, _id: order._id } });
    } catch (err) {
        console.error('Order error:', err.message);
        if (err.name === 'ValidationError') {
            return sendJson(res, 400, { ok: false, error: err.message });
        }
        return sendJson(res, 500, { ok: false, error: 'Failed to place order.' });
    }
}

async function handleListOrders(req, res) {
    const user = await authenticateRequest(req);
    if (!user) return sendJson(res, 401, { ok: false, error: 'Not authenticated.' });

    try {
        const orders = await db.Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(50).lean();
        return sendJson(res, 200, { ok: true, orders });
    } catch {
        return sendJson(res, 500, { ok: false, error: 'Failed to load orders.' });
    }
}

// ══════════════════════════════════════════════════════════════
//  PIN LOOKUP (existing)
// ══════════════════════════════════════════════════════════════

async function lookupPhotonCoordinates(pinCode, district = '', state = '') {
    const requests = [
        {
            url: `https://photon.komoot.io/structured?${new URLSearchParams({ postcode: pinCode, countrycode: 'IN', limit: '5' })}`,
            exactPin: true,
        },
    ];

    const areaQuery = [district, state, 'India'].filter(Boolean).join(', ');
    if (district || state) {
        requests.push({
            url: `https://photon.komoot.io/api/?${new URLSearchParams({ q: areaQuery, countrycode: 'IN', limit: '5' })}`,
            exactPin: false,
        });
    }

    for (const request of requests) {
        try {
            const response = await fetch(request.url, {
                headers: { Accept: 'application/geo+json, application/json' },
                signal: AbortSignal.timeout(8000),
            });
            if (!response.ok) continue;

            const payload = await response.json();
            const feature = (payload?.features || []).find(item => {
                const coordinates = item?.geometry?.coordinates;
                const properties = item?.properties || {};
                const validPoint = Array.isArray(coordinates) && coordinates.length >= 2
                    && Number.isFinite(Number(coordinates[0])) && Number.isFinite(Number(coordinates[1]));
                const countryMatches = !properties.countrycode || properties.countrycode.toUpperCase() === 'IN';
                if (!validPoint || !countryMatches) return false;
                if (!request.exactPin) return true;
                const returnedPins = String(properties.postcode || '').match(/\d{6}/g) || [];
                return returnedPins.includes(pinCode);
            });

            if (feature) {
                const [longitude, latitude] = feature.geometry.coordinates;
                if (latitude < 6 || latitude > 38 || longitude < 68 || longitude > 98) continue;
                return {
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                    district: feature.properties?.county || district,
                    state: feature.properties?.state || state,
                    coordinateSource: request.exactPin ? 'OpenStreetMap/Photon PIN lookup' : 'OpenStreetMap/Photon area lookup',
                };
            }
        } catch {
            // Continue to the next real-map lookup strategy.
        }
    }
    return null;
}

async function lookupIndianPin(pinCode) {
    const cached = pinLookupCache.get(pinCode);
    if (cached && cached.expiresAt > Date.now()) return cached.result;

    let result = null;
    let primaryError = null;

    try {
        const response = await fetch(`https://api.pincodeapi.in/api/v1/pincode/${pinCode}`, {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout(8000),
        });
        if (response.status !== 404) {
            if (!response.ok) throw new Error(`PIN lookup returned ${response.status}.`);

            const payload = await response.json();
            const offices = payload?.success && Array.isArray(payload.data?.post_offices)
                ? payload.data.post_offices
                : [];
            const coordinateOffice = offices.find(office =>
                office.latitude !== null && office.latitude !== undefined && office.latitude !== ''
                && office.longitude !== null && office.longitude !== undefined && office.longitude !== ''
                && Number.isFinite(Number(office.latitude)) && Number.isFinite(Number(office.longitude))
            );
            result = offices.length ? {
                district: offices.find(office => office.district)?.district || '',
                state: offices.find(office => office.state)?.state || '',
                officeCount: offices.length,
                latitude: coordinateOffice ? Number(coordinateOffice.latitude) : null,
                longitude: coordinateOffice ? Number(coordinateOffice.longitude) : null,
                coordinateSource: coordinateOffice ? 'Pincode API' : null,
            } : null;
        }
    } catch (error) {
        primaryError = error;
    }

    const hasCoordinates = value => Number.isFinite(value?.latitude) && Number.isFinite(value?.longitude)
        && value.latitude >= 6 && value.latitude <= 38
        && value.longitude >= 68 && value.longitude <= 98;

    // Some PINs have no office coordinates in the primary lookup, so request its
    // documented postal-area centroid from the alternate India PIN directory.
    if (!hasCoordinates(result)) {
        try {
            const response = await fetch(`https://pincodez.info/api/v1/pincodes/${pinCode}`, {
                headers: { Accept: 'application/json' },
                signal: AbortSignal.timeout(8000),
            });
            if (response.ok) {
                const payload = await response.json();
                const data = payload?.data || payload;
                const latitude = Number(data?.centroid?.latitude ?? data?.latitude);
                const longitude = Number(data?.centroid?.longitude ?? data?.longitude);
                const returnedPin = String(data?.pincode ?? payload?.pincode ?? '');
                if (hasCoordinates({ latitude, longitude }) && returnedPin === pinCode) {
                    const district = typeof data?.district === 'string' ? data.district : data?.district?.name;
                    const state = typeof data?.state === 'string' ? data.state : data?.state?.name;
                    result = {
                        ...result,
                        district: result?.district || district || '',
                        state: result?.state || state || '',
                        officeCount: result?.officeCount || data?.total_post_offices || 0,
                        latitude,
                        longitude,
                        coordinateSource: 'Pincodez',
                    };
                }
            }
        } catch {
            // Keep postal validation available if the coordinate provider is down.
        }
    }

    if (!hasCoordinates(result)) {
        const photonPoint = await lookupPhotonCoordinates(pinCode, result?.district || '', result?.state || '');
        if (photonPoint) {
            result = {
                ...result,
                district: result?.district || photonPoint.district,
                state: result?.state || photonPoint.state,
                officeCount: result?.officeCount || 0,
                ...photonPoint,
            };
        }
    }

    if (!result && primaryError) throw primaryError;

    // Cache valid and invalid lookups for 24 hours to avoid unnecessary API calls.
    pinLookupCache.set(pinCode, { result, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
    return result;
}

async function lookupAddressSuggestions(input) {
    const query = input.query.trim().replace(/\s+/g, ' ');
    const pinCode = input.pinCode.trim();
    if (query.length < 3 || query.length > 100 || !/^\d{6}$/.test(pinCode)) return [];

    const district = typeof input.district === 'string' ? input.district.trim().slice(0, 80) : '';
    const state = typeof input.state === 'string' ? input.state.trim().slice(0, 80) : '';
    let latitude = Number(input.latitude);
    let longitude = Number(input.longitude);
    let hasAnchor = Number.isFinite(latitude) && Number.isFinite(longitude)
        && latitude >= 6 && latitude <= 38 && longitude >= 68 && longitude <= 98;
    if (!hasAnchor) {
        try {
            const postalLocation = await lookupIndianPin(pinCode);
            latitude = Number(postalLocation?.latitude);
            longitude = Number(postalLocation?.longitude);
            hasAnchor = Number.isFinite(latitude) && Number.isFinite(longitude)
                && latitude >= 6 && latitude <= 38 && longitude >= 68 && longitude <= 98;
        } catch {
            // The place search can still use the typed area and PIN context.
        }
    }
    const cacheKey = `${pinCode}:${query.toLowerCase()}`;
    const cached = addressSuggestionCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.results;

    // Photon expects the typed place name as q; the PIN-area coordinates bias
    // nearby results. Appending the whole district to q often suppresses matches.
    const searchText = hasAnchor ? query : [query, pinCode, district, state, 'India'].filter(Boolean).join(', ');
    const params = new URLSearchParams({ q: searchText, countrycode: 'IN', limit: '6' });
    if (hasAnchor) {
        params.set('lat', String(latitude));
        params.set('lon', String(longitude));
        params.set('location_bias_scale', '0.15');
    }

    const response = await fetch(`https://photon.komoot.io/api/?${params}`, {
        headers: { Accept: 'application/geo+json, application/json' },
        signal: AbortSignal.timeout(6500),
    });
    if (!response.ok) throw new Error(`Address lookup returned ${response.status}.`);

    const payload = await response.json();
    const results = (payload?.features || []).flatMap(feature => {
        const coordinates = feature?.geometry?.coordinates;
        const properties = feature?.properties || {};
        if (!Array.isArray(coordinates) || coordinates.length < 2) return [];
        const [placeLongitude, placeLatitude] = coordinates.map(Number);
        if (!Number.isFinite(placeLatitude) || !Number.isFinite(placeLongitude)
            || placeLatitude < 6 || placeLatitude > 38 || placeLongitude < 68 || placeLongitude > 98) return [];
        if (properties.countrycode && properties.countrycode.toUpperCase() !== 'IN') return [];

        const title = properties.name || properties.street || properties.city || properties.county;
        if (!title) return [];
        const detail = [properties.street && properties.street !== title ? properties.street : '',
            properties.city, properties.county, properties.state]
            .filter((value, index, values) => value && values.indexOf(value) === index && value !== title)
            .join(', ');
        return [{
            title: String(title),
            detail: String(detail || 'India'),
            latitude: placeLatitude,
            longitude: placeLongitude,
            city: String(properties.city || properties.county || district || ''),
            state: String(properties.state || state || ''),
        }];
    });

    addressSuggestionCache.set(cacheKey, { results, expiresAt: Date.now() + 5 * 60 * 1000 });
    return results;
}

async function suggestAddress(req, res) {
    let input;
    try {
        input = await readJsonBody(req);
    } catch {
        return sendJson(res, 400, { error: 'Please enter a place to search.' });
    }
    if (typeof input.query !== 'string' || typeof input.pinCode !== 'string') {
        return sendJson(res, 400, { error: 'A search and delivery PIN are required.' });
    }
    try {
        const suggestions = await lookupAddressSuggestions(input);
        return sendJson(res, 200, { suggestions, source: 'Photon / OpenStreetMap' });
    } catch {
        return sendJson(res, 502, { error: 'Nearby address search is temporarily unavailable.' });
    }
}

async function lookupPin(req, res) {
    let input;
    try {
        input = await readJsonBody(req);
    } catch {
        return sendJson(res, 400, { error: 'Please send a valid PIN code.' });
    }

    if (typeof input.pinCode === 'string' && input.pinCode.trim()) {
        const pinCode = input.pinCode.trim();
        if (!/^\d{6}$/.test(pinCode)) {
            return sendJson(res, 400, { error: 'Enter a valid 6-digit PIN code.' });
        }

        let postalDetails;
        try {
            postalDetails = await lookupIndianPin(pinCode);
        } catch {
            return sendJson(res, 502, { error: 'The PIN-code lookup is temporarily unavailable. Please try again shortly.' });
        }

        if (!postalDetails) {
            return sendJson(res, 200, {
                valid: false,
                pinCode,
                message: `${pinCode} was not found in the Indian PIN-code directory. Check the number and try again.`,
            });
        }

        return sendJson(res, 200, {
            valid: true,
            pinCode,
            district: postalDetails.district,
            state: postalDetails.state,
            officeCount: postalDetails.officeCount,
            latitude: postalDetails.latitude,
            longitude: postalDetails.longitude,
            coordinateSource: postalDetails.coordinateSource,
            message: `Location verified: ${postalDetails.district}, ${postalDetails.state}.`,
        });
    }

    return sendJson(res, 400, { error: 'Enter a 6-digit Indian PIN code.' });
}

// ══════════════════════════════════════════════════════════════
//  STATIC FILE SERVING
// ══════════════════════════════════════════════════════════════

async function serveStatic(req, res, pathname) {
    let decodedPath;
    try {
        decodedPath = decodeURIComponent(pathname);
    } catch {
        res.writeHead(400).end('Bad request');
        return;
    }

    const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
    const pathParts = relativePath.split(/[\\/]+/);
    const isPublicAsset = relativePath === 'index.html'
        || relativePath === 'menu.html'
        || relativePath === 'profile.html'
        || relativePath === 'style.css'
        || relativePath === 'pages.css'
        || relativePath === 'profile.css'
        || relativePath === 'script.js'
        || relativePath === 'profile.js'
        || (pathParts.length === 2 && pathParts[0] === 'images' && pathParts[1] !== ''
            && !pathParts[1].startsWith('.'));

    if (!isPublicAsset || pathParts.some(part => part === '.' || part === '..' || part === '')) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
        return;
    }

    const filePath = path.resolve(ROOT, relativePath);
    if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
        res.writeHead(403).end('Forbidden');
        return;
    }

    try {
        const stat = await fs.promises.stat(filePath);
        if (!stat.isFile()) throw new Error('Not a file');
        res.writeHead(200, {
            'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
            'X-Content-Type-Options': 'nosniff',
        });
        if (req.method === 'HEAD') return res.end();
        fs.createReadStream(filePath).pipe(res);
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    }
}

// ══════════════════════════════════════════════════════════════
//  HTTP SERVER & ROUTING
// ══════════════════════════════════════════════════════════════

const server = http.createServer(async (req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        // ── API Routes ──────────────────────────
        if (url.pathname === '/api/address-suggestions' && req.method === 'POST') {
            return suggestAddress(req, res);
        }
        if ((url.pathname === '/api/lookup-pin' || url.pathname === '/api/check-coverage') && req.method === 'POST') {
            return lookupPin(req, res);
        }

        // Auth routes
        if (url.pathname === '/api/auth/register' && req.method === 'POST') return handleRegister(req, res);
        if (url.pathname === '/api/auth/send-otp' && req.method === 'POST') return handleSendOtp(req, res);
        if (url.pathname === '/api/auth/complete-registration' && req.method === 'POST') return handleCompleteRegistration(req, res);
        if (url.pathname === '/api/auth/login' && req.method === 'POST') return handleLogin(req, res);
        if (url.pathname === '/api/auth/forgot-password/send-otp' && req.method === 'POST') return handleForgotPasswordSendOtp(req, res);
        if (url.pathname === '/api/auth/forgot-password/verify-otp' && req.method === 'POST') return handleForgotPasswordVerifyOtp(req, res);
        if (url.pathname === '/api/auth/forgot-password/reset' && req.method === 'POST') return handleForgotPasswordReset(req, res);
        if (url.pathname === '/api/auth/logout' && req.method === 'POST') return handleLogout(req, res);
        if (url.pathname === '/api/auth/me' && req.method === 'POST') return handleMe(req, res);
        if (url.pathname === '/api/auth/update-profile' && req.method === 'POST') return handleUpdateProfile(req, res);
        if (url.pathname === '/api/auth/verify-phone' && req.method === 'POST') return handleVerifyPhone(req, res);
        if (url.pathname === '/api/auth/change-password' && req.method === 'POST') return handleChangePassword(req, res);

        // Address routes
        if (url.pathname === '/api/addresses/list' && req.method === 'POST') return handleListAddresses(req, res);
        if (url.pathname === '/api/addresses/add' && req.method === 'POST') return handleAddAddress(req, res);
        if (url.pathname === '/api/addresses/update' && req.method === 'POST') return handleUpdateAddress(req, res);
        if (url.pathname === '/api/addresses/delete' && req.method === 'POST') return handleDeleteAddress(req, res);

        // Order routes
        if (url.pathname === '/api/orders/place' && req.method === 'POST') return handlePlaceOrder(req, res);
        if (url.pathname === '/api/orders/list' && req.method === 'POST') return handleListOrders(req, res);

        if (url.pathname.startsWith('/api/')) {
            return sendJson(res, 404, { error: 'API route not found.' });
        }
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return sendJson(res, 405, { error: 'Method not allowed.' });
        }

        // ── Clean URL Routes ────────────────────
        const cleanRoutes = {
            '/': 'index.html',
            '/home': 'index.html',
            '/menu': 'menu.html',
            '/profile': 'profile.html',
            '/account': 'profile.html',
            '/login': 'profile.html',
            '/register': 'profile.html',
        };
        const legacyRoutes = {
            '/index.html': '/',
            '/menu.html': '/menu',
            '/contact': '/',
            '/contact.html': '/',
            '/profile.html': '/profile',
        };

        if (legacyRoutes[url.pathname]) {
            res.writeHead(301, { Location: `${legacyRoutes[url.pathname]}${url.search}` });
            return res.end();
        }

        return serveStatic(req, res, cleanRoutes[url.pathname] || url.pathname);
    } catch (err) {
        console.error('Unhandled server error:', err);
        try {
            sendJson(res, 500, { error: 'Internal Server Error' });
        } catch {
            res.writeHead(500).end('Internal Server Error');
        }
    }
});

// ── Start Server with MongoDB ───────────────────────────────
async function start() {
    try {
        await db.connect();
    } catch (err) {
        console.error('⚠ Starting without database — auth features will not work.');
        console.error('  Set MONGO_URI environment variable or run MongoDB locally.');
    }

    server.listen(PORT, HOST, () => {
        console.log(`Hungriee is running at http://${HOST}:${PORT}`);
    });
}

start();