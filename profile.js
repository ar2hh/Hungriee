/* ═══════════════════════════════════════════════
   HUNGRIEE — Profile Page Logic
   Auth, Dashboard, Orders, Addresses
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    const API = '';  // same-origin
        // ── Cloudflare Turnstile ──────────────────
    const TURNSTILE_SITE_KEY = '0x4AAAAAAFZe78xcb8xEtZHm'; // public site key (NOT the secret)
    const captchaWidgets = {};

    function renderCaptcha(which) {
        if (captchaWidgets[which] !== undefined) return; // already rendered
        if (!window.turnstile) { setTimeout(() => renderCaptcha(which), 150); return; }
        const el = document.getElementById(`${which}Captcha`);
        if (el) captchaWidgets[which] = turnstile.render(el, {
    sitekey: TURNSTILE_SITE_KEY,
    theme: 'dark',       // matches your dark UI ('light' | 'dark' | 'auto')
    size: 'flexible',    // stretches to the full form width ('normal' | 'flexible' | 'compact')
});
    }
    function getCaptchaToken(which) {
        return window.turnstile && captchaWidgets[which] !== undefined
            ? turnstile.getResponse(captchaWidgets[which]) : '';
    }
    function resetCaptcha(which) {
        if (window.turnstile && captchaWidgets[which] !== undefined) turnstile.reset(captchaWidgets[which]);
    }
    // ── Email OTP registration and optional phone verification ───────
    let pendingRegisterData = null;
    let otpTargetPhoneNumber = '';
    let otpTimerInterval = null;

    function formatIndianPhone(phone) {
        let digits = String(phone || '').replace(/\D/g, '');

        // Accept a 10-digit Indian mobile number, or the same number prefixed
        // with India's country code (91) or domestic trunk prefix (0).
        if (digits.length === 12 && digits.startsWith('91')) {
            digits = digits.slice(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
            digits = digits.slice(1);
        }

        // Indian mobile numbers must begin with 6, 7, 8, or 9.
        if (!/^[6-9]\d{9}$/.test(digits)) return null;
        return `+91${digits}`;
    }

    function openOtpModal(targetAddress, channel = 'email') {
        otpTargetPhoneNumber = targetAddress;
        const targetEl = document.getElementById('otpTargetPhone');
        if (targetEl) targetEl.textContent = targetAddress;
        const modalTitle = document.querySelector('#otpModal .otp-modal-header h3');
        if (modalTitle) modalTitle.textContent = channel === 'email' ? 'Verify Your Email' : 'Verify Phone Number';
        const subtitle = document.querySelector('#otpModal .otp-subtitle');
        if (subtitle) subtitle.innerHTML = channel === 'email'
            ? 'Enter the 6-digit code sent to <strong id="otpTargetPhone"></strong>'
            : 'Enter the 6-digit code for <strong id="otpTargetPhone"></strong>';
        const refreshedTarget = document.getElementById('otpTargetPhone');
        if (refreshedTarget) refreshedTarget.textContent = targetAddress;
        const displayBadge = document.getElementById('otpDisplayBadge');
        if (displayBadge) displayBadge.style.display = 'none';
        const digits = document.querySelectorAll('.otp-digit');
        digits.forEach(d => { d.value = ''; d.classList.remove('filled'); });
        const err = document.getElementById('otpError');
        if (err) { err.textContent = ''; err.classList.remove('visible'); }
        startOtpCountdown();
        document.getElementById('otpModal')?.showModal();
        setTimeout(() => digits[0]?.focus(), 150);
    }

    function closeOtpModal() {
        clearInterval(otpTimerInterval);
        document.getElementById('otpModal')?.close();
    }

    function startOtpCountdown() {
        clearInterval(otpTimerInterval);
        let seconds = 30;
        const countdownEl = document.getElementById('otpCountdown');
        const timerTextEl = document.getElementById('otpTimerText');
        const resendBtn = document.getElementById('otpResendBtn');

        if (timerTextEl) timerTextEl.style.display = '';
        if (resendBtn) resendBtn.style.display = 'none';
        if (countdownEl) countdownEl.textContent = `${seconds}s`;

        otpTimerInterval = setInterval(() => {
            seconds--;
            if (countdownEl) countdownEl.textContent = `${seconds}s`;
            if (seconds <= 0) {
                clearInterval(otpTimerInterval);
                if (timerTextEl) timerTextEl.style.display = 'none';
                if (resendBtn) resendBtn.style.display = 'inline-block';
            }
        }, 1000);
    }

    // ── Helpers ────────────────────────────────
    async function api(path, body) {
        const res = await fetch(`${API}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session': getSession(),
            },
            body: JSON.stringify(body),
        });
        return res.json();
    }
    function redirectAfterAuthentication() {
    const params = new URLSearchParams(window.location.search);

    if (
        params.get('redirect') === 'checkout' ||
        localStorage.getItem('hungrieeReturnToCheckout') === '1'
    ) {
        localStorage.removeItem('hungrieeReturnToCheckout');
        window.location.href = '/menu?checkout=1';
        return true;
    }

    return false;
    }
    function getSession() {
        return localStorage.getItem('hungrieeSession') || '';
    }
    function setSession(token, user) {
        localStorage.setItem('hungrieeSession', token);
        localStorage.setItem('hungrieeUser', JSON.stringify(user));
    }
    function clearSession() {
        localStorage.removeItem('hungrieeSession');
        localStorage.removeItem('hungrieeUser');
    }
    function getUser() {
        try { return JSON.parse(localStorage.getItem('hungrieeUser') || 'null'); } catch { return null; }
    }

    function showError(el, msg) {
        el.textContent = msg;
        el.classList.add('visible');
        setTimeout(() => { el.classList.remove('visible'); el.textContent = ''; }, 5000);
    }
    function showSuccess(el, msg) {
        el.textContent = msg;
        el.classList.add('visible');
        setTimeout(() => { el.classList.remove('visible'); el.textContent = ''; }, 4000);
    }
    function setLoading(btn, loading) {
        btn.classList.toggle('loading', loading);
        btn.disabled = loading;
    }

    function initials(name) {
        return (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }
    function formatDate(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    function formatDateTime(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // ── Page Elements ──────────────────────────
    const authSection = document.getElementById('authSection');
    const dashboard = document.getElementById('profileDashboard');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');

    if (!authSection || !dashboard) return; // not on profile page

    // ── Init: Check Auth State ────────────────
    async function initProfile() {
        const session = getSession();
        const cachedUser = getUser();

        if (!session) {
            document.documentElement.classList.remove('has-session');
            showAuth();
            return;
        }

        // Optimistically render dashboard immediately from cache (0ms flash)
        if (cachedUser) {
            document.documentElement.classList.add('has-session');
            authSection.style.display = 'none';
            dashboard.style.display = '';
            populateDashboard(cachedUser);
            tabsResetToOrders();
            requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
            updateNavProfileBtn(true);
            loadOrders();
            loadAddresses();
        }

        // Validate session with server in background
        try {
            const res = await api('/api/auth/me');
            if (res.ok) {
                setSession(session, res.user);
                document.documentElement.classList.add('has-session');
                populateDashboard(res.user);
                tabsResetToOrders();
                requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
                authSection.style.display = 'none';
                dashboard.style.display = '';
                updateNavProfileBtn(true);
                if (!cachedUser) {
                    loadOrders();
                    loadAddresses();
                }
            } else {
                document.documentElement.classList.remove('has-session');
                clearSession();
                showAuth();
            }
        } catch (err) {
            console.error('Session validation error:', err);
            if (!cachedUser) {
                document.documentElement.classList.remove('has-session');
                clearSession();
                showAuth();
            }
        }
    }

        function showAuth() {
        document.documentElement.classList.remove('has-session');
        authSection.style.display = '';
        dashboard.style.display = 'none';
        updateNavProfileBtn(false);
        renderCaptcha('login');
    }
    function showDashboard(user) {
        document.documentElement.classList.add('has-session');
        authSection.style.display = 'none';
        dashboard.style.display = '';
        // Always land at the top of the account dashboard after login/registration,
        // rather than keeping the scroll position from the authentication form.
        tabsResetToOrders();
        populateDashboard(user);
        loadOrders();
        loadAddresses();
        updateNavProfileBtn(true);
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
    }

    function tabsResetToOrders() {
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === 'orders');
        });
        const tabPanels = {
            orders: document.getElementById('panelOrders'),
            edit: document.getElementById('panelEdit'),
            addresses: document.getElementById('panelAddresses'),
            security: document.getElementById('panelSecurity')
        };
        Object.entries(tabPanels).forEach(([name, panel]) => {
            if (panel) panel.classList.toggle('active', name === 'orders');
        });
    }

    function updateNavProfileBtn(loggedIn) {
        const btn = document.getElementById('profileNavBtn');
        if (btn) btn.classList.toggle('logged-in', loggedIn);
    }

    // ── Auth Tab Switching ────────────────────
    document.querySelectorAll('.auth-switch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            if (target === 'register') {
                loginTab.classList.remove('active');
                registerTab.classList.add('active');
                renderCaptcha('register');
            } else {
                registerTab.classList.remove('active');
                loginTab.classList.add('active');
                renderCaptcha('login');
            }
        });
    });

    // ── Password Toggle ──────────────────────
    document.querySelectorAll('.auth-toggle-pw').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    });

    // ── Password Strength ────────────────────
    const registerPw = document.getElementById('registerPassword');
    const strengthWrap = document.getElementById('passwordStrength');
    if (registerPw && strengthWrap) {
        registerPw.addEventListener('input', () => {
            const val = registerPw.value;
            const bar = strengthWrap.querySelector('.strength-bar span');
            const text = strengthWrap.querySelector('.strength-text');
            if (!val) {
                strengthWrap.classList.remove('visible');
                return;
            }
            strengthWrap.classList.add('visible');
            let score = 0;
            if (val.length >= 6) score++;
            if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
            if (/\d/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;

            bar.className = '';
            text.className = 'strength-text';
            if (score <= 1) { bar.classList.add('weak'); text.classList.add('weak'); text.textContent = 'Weak'; }
            else if (score === 2) { bar.classList.add('medium'); text.classList.add('medium'); text.textContent = 'Medium'; }
            else { bar.classList.add('strong'); text.classList.add('strong'); text.textContent = 'Strong'; }
        });
    }

    // Inline required-field feedback (replaces transient toast guidance).
    function clearFieldError(input) {
        if (!input) return;
        input.classList.remove('field-invalid');
        input.removeAttribute('aria-invalid');
        const wrap = input.closest('.auth-input-wrap, .auth-field, .checkout-field, .co-field');
        wrap?.querySelector(':scope > .field-validation-message')?.remove();
        if (wrap?.classList.contains('auth-input-wrap') && wrap.nextElementSibling?.classList.contains('field-validation-message')) {
            wrap.nextElementSibling.remove();
        }
    }
    function markFieldError(input, message = 'This field is required.') {
        if (!input) return;
        clearFieldError(input);
        input.classList.add('field-invalid');
        input.setAttribute('aria-invalid', 'true');
        const wrap = input.closest('.auth-input-wrap, .auth-field, .checkout-field, .co-field');
        if (wrap) {
            const error = document.createElement('small');
            error.className = 'field-validation-message';
            error.textContent = message;
            if (wrap.classList.contains('auth-input-wrap')) wrap.insertAdjacentElement('afterend', error);
            else wrap.appendChild(error);
        }
    }
    function validateRequiredFields(form, customMessages = {}) {
        if (!form) return true;
        form.querySelectorAll('input, textarea, select').forEach(clearFieldError);
        const missing = [...form.querySelectorAll('input[required], textarea[required], select[required]')].filter(input => !String(input.value || '').trim());
        missing.forEach(input => markFieldError(input, customMessages[input.id] || 'Please fill out this field.'));
        if (missing.length) {
            missing[0].focus({ preventScroll: false });
            missing[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        return true;
    }
    document.addEventListener('input', event => {
        if (event.target.matches('.field-invalid')) clearFieldError(event.target);
    });

    // ── Login Form ───────────────────────────
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('loginSubmit');
        const errEl = document.getElementById('loginError');
        if (!validateRequiredFields(loginForm, { loginEmail: 'Enter your email address.', loginPassword: 'Enter your password.' })) return;
        const captchaToken = getCaptchaToken('login');
        if (!captchaToken) {
            showError(errEl, 'Please complete the captcha.');
            return;
        }
        setLoading(btn, true);

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        try {
            const res = await api('/api/auth/login', { email, password, 'cf-turnstile-response': captchaToken });
            if (res.ok) {
                setSession(res.sessionToken, res.user);
                 if (redirectAfterAuthentication()) return;
                showDashboard(res.user);
                if (typeof showToast === 'function') showToast(`Welcome back, ${res.user.name}! 👋`);
            } else {
                showError(errEl, res.error || 'Login failed.');
            }
        } catch {
            showError(errEl, 'Network error. Please try again.');
        } finally {
            setLoading(btn, false);
            resetCaptcha('login');
        }
    });

    // ── Forgot password: email OTP, verify, then reset ──
    const forgotDialog = document.getElementById('forgotPasswordDialog');
    const forgotEmail = document.getElementById('forgotPasswordEmail');
    const forgotOtp = document.getElementById('forgotPasswordOtp');
    const forgotMessage = document.getElementById('forgotPasswordMessage');
    let verifiedResetToken = '';
    let forgotStep = 'email';
    function forgotStatus(message, isError = false) {
        if (!forgotMessage) return;
        forgotMessage.textContent = message;
        forgotMessage.classList.toggle('is-error', isError);
        forgotMessage.classList.toggle('is-success', !isError && !!message);
    }
    function setForgotStep(step) {
        forgotStep = step;
        document.getElementById('forgotEmailStep').hidden = step !== 'email';
        document.getElementById('forgotOtpStep').hidden = step !== 'otp';
        document.getElementById('forgotNewPasswordStep').hidden = step !== 'password';
        const title = document.getElementById('forgotPasswordTitle');
        const intro = document.getElementById('forgotPasswordIntro');
        if (title) title.textContent = step === 'email' ? 'Reset your password' : step === 'otp' ? 'Verify your email' : 'Choose a new password';
        if (intro) intro.textContent = step === 'email' ? "Enter your account email and we'll send you a one-time verification code." : step === 'otp' ? 'Enter the 6-digit code sent to your email. The code expires in 5 minutes.' : 'Your email is verified. Choose a new password for your Hungriee account.';
    }
    document.getElementById('forgotPasswordOpen')?.addEventListener('click', () => {
        forgotEmail.value = document.getElementById('loginEmail')?.value.trim() || '';
        verifiedResetToken = '';
        forgotOtp.value = '';
        document.getElementById('forgotNewPassword').value = '';
        document.getElementById('forgotConfirmPassword').value = '';
        forgotStatus(''); setForgotStep('email'); forgotDialog?.showModal();
    });
    document.getElementById('forgotSendOtp')?.addEventListener('click', async () => {
        const email = forgotEmail.value.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return forgotStatus('Enter a valid email address.', true);
        const btn = document.getElementById('forgotSendOtp'); btn.disabled = true; forgotStatus('Sending verification code…');
        try {
            const res = await api('/api/auth/forgot-password/send-otp', { email });
            if (!res.ok) return forgotStatus(res.error || 'Could not send the code.', true);
            setForgotStep('otp'); forgotStatus(res.message || 'If the account exists, a code has been sent.'); forgotOtp.focus();
        } catch { forgotStatus('Network error. Please try again.', true); }
        finally { btn.disabled = false; }
    });
    document.getElementById('forgotVerifyOtp')?.addEventListener('click', async () => {
        const email = forgotEmail.value.trim().toLowerCase(), otp = forgotOtp.value.trim();
        if (!/^\d{6}$/.test(otp)) return forgotStatus('Enter the 6-digit code from your email.', true);
        const btn = document.getElementById('forgotVerifyOtp'); btn.disabled = true; forgotStatus('Verifying code…');
        try {
            const res = await api('/api/auth/forgot-password/verify-otp', { email, otp });
            if (!res.ok) return forgotStatus(res.error || 'Could not verify the code.', true);
            verifiedResetToken = res.resetToken; setForgotStep('password'); forgotStatus('Email verified successfully.');
        } catch { forgotStatus('Network error. Please try again.', true); }
        finally { btn.disabled = false; }
    });
    // Show/hide controls for the two forgot-password fields.
    document.querySelectorAll('.forgot-password-toggle[data-password-target]').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const field = document.getElementById(toggle.dataset.passwordTarget);
            if (!field) return;
            const reveal = field.type === 'password';
            field.type = reveal ? 'text' : 'password';
            toggle.textContent = reveal ? 'Hide' : 'Show';
            toggle.setAttribute('aria-label', `${reveal ? 'Hide' : 'Show'} ${field.id === 'forgotNewPassword' ? 'new password' : 'confirm new password'}`);
            toggle.setAttribute('aria-pressed', String(reveal));
            field.focus();
        });
    });

    // Enter advances the currently visible step in the forgot-password flow.
    [forgotEmail, forgotOtp, document.getElementById('forgotNewPassword'), document.getElementById('forgotConfirmPassword')]
        .filter(Boolean)
        .forEach((field) => field.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' || event.isComposing) return;
            event.preventDefault();
            if (forgotStep === 'email') document.getElementById('forgotSendOtp')?.click();
            else if (forgotStep === 'otp') document.getElementById('forgotVerifyOtp')?.click();
            else if (forgotStep === 'password' && field.id === 'forgotConfirmPassword') {
                document.getElementById('forgotResetPassword')?.click();
            } else if (forgotStep === 'password' && field.id === 'forgotNewPassword') {
                document.getElementById('forgotConfirmPassword')?.focus();
            }
        }));

    document.getElementById('forgotResetPassword')?.addEventListener('click', async () => {
        const newPassword = document.getElementById('forgotNewPassword').value;
        const confirmPassword = document.getElementById('forgotConfirmPassword').value;
        if (newPassword.length < 6) return forgotStatus('Use at least 6 characters for your password.', true);
        if (newPassword !== confirmPassword) return forgotStatus('The passwords do not match.', true);
        if (!verifiedResetToken) { setForgotStep('email'); return forgotStatus('Please verify your email first.', true); }
        const btn = document.getElementById('forgotResetPassword'); btn.disabled = true; forgotStatus('Updating password…');
        try {
            const res = await api('/api/auth/forgot-password/reset', { email: forgotEmail.value.trim().toLowerCase(), resetToken: verifiedResetToken, newPassword });
            if (!res.ok) return forgotStatus(res.error || 'Could not reset password.', true);
            document.getElementById('loginEmail').value = forgotEmail.value.trim().toLowerCase();
            document.getElementById('loginPassword').value = '';
            forgotStatus('Password reset successfully. You can now sign in.');
            verifiedResetToken = '';
            setTimeout(() => forgotDialog?.close(), 1300);
        } catch { forgotStatus('Network error. Please try again.', true); }
        finally { btn.disabled = false; }
    });

    // ── Register Form with Brevo Email OTP ──────
    const registerForm = document.getElementById('registerForm');
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('registerSubmit');
        const errEl = document.getElementById('registerError');
        if (!validateRequiredFields(registerForm, { registerName: 'Enter your name.', registerEmail: 'Enter your email address.', registerPhone: 'Enter your mobile number.', registerPassword: 'Create a password.' })) return;
        setLoading(btn, true);

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const password = document.getElementById('registerPassword').value;

        if (password.length < 6) {
            showError(errEl, 'Password must be at least 6 characters.');
            setLoading(btn, false);
            return;
        }

        const formattedPhone = formatIndianPhone(phone);
        if (!formattedPhone) {
            showError(errEl, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
            setLoading(btn, false);
            return;
        }

        const captchaToken = getCaptchaToken('register');
        if (!captchaToken) {
            showError(errEl, 'Please complete the captcha.');
            setLoading(btn, false);
            return;
        }

        pendingRegisterData = { name, email, phone: formattedPhone, password };
        try {
            const result = await api('/api/auth/send-otp', {
                phone: formattedPhone,
                email,
                purpose: 'register',
                'cf-turnstile-response': captchaToken,
            });
            if (!result.ok) {
                showError(errEl, result.error || 'Could not send the verification email.');
                pendingRegisterData = null;
                resetCaptcha('register');
                return;
            }
            resetCaptcha('register');
            openOtpModal(email);
            if (typeof showToast === 'function') showToast('Verification code sent by email.');
        } catch {
            showError(errEl, 'Network error while sending the email. Please try again.');
            pendingRegisterData = null;
            resetCaptcha('register');
        } finally {
            setLoading(btn, false);
        }
    });

    // ── OTP Digits Input Handling ───────────
    const otpDigits = document.querySelectorAll('.otp-digit');
    otpDigits.forEach((input, idx) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val ? val[val.length - 1] : '';
            e.target.classList.toggle('filled', Boolean(e.target.value));

            if (e.target.value && idx < otpDigits.length - 1) {
                otpDigits[idx + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && idx > 0) {
                otpDigits[idx - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
            if (!pasteData) return;
            otpDigits.forEach((digitInput, i) => {
                if (pasteData[i]) {
                    digitInput.value = pasteData[i];
                    digitInput.classList.add('filled');
                }
            });
            const lastFilledIdx = Math.min(pasteData.length - 1, otpDigits.length - 1);
            otpDigits[lastFilledIdx]?.focus();
        });
    });

    // ── OTP Modal Actions ───────────────────
    document.getElementById('otpCancelBtn')?.addEventListener('click', closeOtpModal);
    const otpModalEl = document.getElementById('otpModal');
    otpModalEl?.addEventListener('click', (e) => {
        if (e.target === otpModalEl) closeOtpModal();
    });

    document.getElementById('otpResendBtn')?.addEventListener('click', async () => {
        const errEl = document.getElementById('otpError');
        if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
        const user = getUser();
        const purpose = pendingRegisterData ? 'register' : 'verify-phone';
        // Tell the backend this is a resend so it reuses the active registration
        // challenge instead of treating the request as a fresh send requiring CAPTCHA.
        const payload = pendingRegisterData
            ? { phone: pendingRegisterData.phone, email: pendingRegisterData.email, purpose, resend: true }
            : { phone: otpTargetPhoneNumber, purpose };
        try {
            const result = await api('/api/auth/send-otp', payload);
            if (!result.ok) {
                showError(errEl, result.error || 'Could not resend the code.');
                return;
            }
            document.querySelectorAll('.otp-digit').forEach(d => { d.value = ''; d.classList.remove('filled'); });
            startOtpCountdown();
            if (typeof showToast === 'function') showToast(pendingRegisterData ? 'A new verification code was sent by email.' : 'A new verification code was sent by SMS.');
        } catch {
            showError(errEl, 'Network error while resending the SMS.');
        }
    });

    document.getElementById('otpForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('otpSubmitBtn');
        const errEl = document.getElementById('otpError');
        setLoading(btn, true);

        const code = Array.from(otpDigits).map(d => d.value).join('');
        if (code.length !== 6) {
            showError(errEl, 'Please enter all 6 digits of the code.');
            setLoading(btn, false);
            return;
        }

        try {
            let res;
            if (pendingRegisterData) {
                res = await api('/api/auth/complete-registration', { ...pendingRegisterData, otp: code });
                if (res.ok) {
                    closeOtpModal();
                    setSession(res.sessionToken, res.user);
                    if (redirectAfterAuthentication()) return;
                    showDashboard(res.user);
                    if (typeof showToast === 'function') showToast(`Email verified & account created! Welcome, ${res.user.name}! 🎉`);
                    pendingRegisterData = null;
                } else {
                    showError(errEl, res.error || 'Verification failed.');
                }
            } else {
                res = await api('/api/auth/verify-phone', { otp: code });
                if (res.ok) {
                    closeOtpModal();
                    setSession(getSession(), res.user);
                    populateDashboard(res.user);
                    if (typeof showToast === 'function') showToast('Phone number verified successfully! ✓');
                } else {
                    showError(errEl, res.error || 'Verification failed.');
                }
            }

        } catch (err) {
            console.error('OTP confirmation error:', err);
            showError(errEl, 'Verification failed. Please try again.');
        } finally {
            setLoading(btn, false);
        }
    });

    // ── Logout ───────────────────────────────
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        try { await api('/api/auth/logout'); } catch { /* ok */ }
        clearSession();
        showAuth();
        if (typeof showToast === 'function') showToast('Signed out successfully.');
    });

    // ── Dashboard Tabs ──────────────────────
    const tabs = document.querySelectorAll('.profile-tab');
    const panels = {
        orders: document.getElementById('panelOrders'),
        edit: document.getElementById('panelEdit'),
        addresses: document.getElementById('panelAddresses'),
        security: document.getElementById('panelSecurity'),
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            Object.values(panels).forEach(p => { if (p) p.classList.remove('active'); });
            if (panels[target]) panels[target].classList.add('active');

            // On mobile, keep the selected account tab centered in the horizontal tab strip.
            // Scroll only the tab strip (not the whole page) to avoid unwanted page jumps.
            const tabStrip = tab.closest('.profile-tabs');
            if (tabStrip && window.matchMedia('(max-width: 768px)').matches) {
                const stripRect = tabStrip.getBoundingClientRect();
                const tabRect = tab.getBoundingClientRect();
                const targetLeft = tabStrip.scrollLeft + (tabRect.left - stripRect.left)
                    - (tabStrip.clientWidth - tabRect.width) / 2;
                tabStrip.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
            }
        });
    });

    // ── Populate Dashboard ──────────────────
    function populateDashboard(user) {
        const el = (id) => document.getElementById(id);
        el('avatarInitials').textContent = initials(user.name);
        el('profileName').textContent = user.name;
        el('profileEmail').textContent = user.email;
        el('profileMemberSince').textContent = `Member since ${formatDate(user.createdAt)}`;

        // Populate edit form
        const editName = el('editName');
        const editEmail = el('editEmail');
        const editPhone = el('editPhone');
        if (editName) editName.value = user.name;
        if (editEmail) editEmail.value = user.email;
        if (editPhone) editPhone.value = user.phone || '';


    }

    // ── Edit Profile ────────────────────────
    document.getElementById('editProfileForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.auth-submit-btn');
        const errEl = document.getElementById('editProfileError');
        const successEl = document.getElementById('editProfileSuccess');
        setLoading(btn, true);

        const name = document.getElementById('editName').value.trim();

        try {
            const res = await api('/api/auth/update-profile', { name });
            if (res.ok) {
                setSession(getSession(), res.user);
                populateDashboard(res.user);
                showSuccess(successEl, 'Profile updated successfully! ✓');
            } else {
                showError(errEl, res.error || 'Update failed.');
            }
        } catch {
            showError(errEl, 'Network error. Please try again.');
        } finally {
            setLoading(btn, false);
        }
    });

    // ── Change Password ─────────────────────
    document.getElementById('changePasswordForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.auth-submit-btn');
        const errEl = document.getElementById('changePasswordError');
        const successEl = document.getElementById('changePasswordSuccess');
        setLoading(btn, true);

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword.length < 6) {
            showError(errEl, 'New password must be at least 6 characters.');
            setLoading(btn, false);
            return;
        }
        if (newPassword !== confirmPassword) {
            showError(errEl, 'New passwords do not match.');
            setLoading(btn, false);
            return;
        }

        try {
            const res = await api('/api/auth/change-password', { currentPassword, newPassword });
            if (res.ok) {
                showSuccess(successEl, 'Password changed successfully! ✓');
                e.target.reset();
            } else {
                showError(errEl, res.error || 'Password change failed.');
            }
        } catch {
            showError(errEl, 'Network error. Please try again.');
        } finally {
            setLoading(btn, false);
        }
    });

    // ── Load Orders ─────────────────────────
    let ordersLoadSequence = 0;
    async function loadOrders() {
        const list = document.getElementById('ordersList');
        const empty = document.getElementById('ordersEmpty');
        if (!list) return;

        // Never leave the previous account's orders visible while switching users.
        const requestSequence = ++ordersLoadSequence;
        const sessionAtRequest = getSession();
        list.replaceChildren();
        if (empty) empty.style.display = '';

        if (!sessionAtRequest) return;

        try {
            const res = await api('/api/orders/list');
            // Ignore a response that belongs to an earlier account/session.
            if (requestSequence !== ordersLoadSequence || sessionAtRequest !== getSession()) return;

            if (!res.ok || !Array.isArray(res.orders) || !res.orders.length) {
                list.replaceChildren();
                if (empty) empty.style.display = '';
                return;
            }
            if (empty) empty.style.display = 'none';

            list.innerHTML = res.orders.map((order, i) => {
                const statusClass = order.status.toLowerCase().replace(/\s+/g, '-');
                return `
                    <div class="order-card" style="animation-delay: ${i * 0.08}s">
                        <div class="order-card-header">
                            <div>
                                <span class="order-number">#${order.orderNumber}</span>
                                <span class="order-date">${formatDateTime(order.createdAt)}</span>
                            </div>
                            <span class="order-status ${statusClass}">${order.status}</span>
                        </div>
                        <div class="order-items-list">
                            ${order.items.map(item => `
                                <div class="order-item-row">
                                    <img src="${item.image || 'images/family_feast.jpg'}" alt="${item.name}" class="order-item-img" onerror="this.onerror=null;this.src='images/family_feast.jpg'">
                                    <span class="order-item-name">${item.name}</span>
                                    <span class="order-item-qty">×${item.qty}</span>
                                    <span class="order-item-price">₹${item.price * item.qty}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-card-footer">
                            <div>
                                <span class="order-total-label">Total${order.coupon ? ` (${order.coupon})` : ''}</span>
                                <span class="order-total-value">₹${order.total}</span>
                            </div>
                            <button class="order-reorder-btn" data-order-idx="${i}">Reorder</button>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach reorder listeners
            list.querySelectorAll('.order-reorder-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const idx = Number(btn.dataset.orderIdx);
                    const order = res.orders[idx];
                    if (!order?.items?.length) {
                        if (typeof showToast === 'function') showToast('No items found in this order.');
                        return;
                    }

                    if (typeof window.addItemsToCart === 'function') {
                        window.addItemsToCart(order.items);
                    } else {
                        const cartItems = order.items.map(it => ({
                            id: Number(it.dishId || it.id),
                            cartItemId: String(it.dishId || it.id),
                            name: it.name,
                            price: Number(it.price) || 0,
                            image: it.image || 'images/family_feast.jpg',
                            qty: Number(it.qty) || 1,
                        }));
                        localStorage.setItem('hungrieeCart', JSON.stringify(cartItems));
                        if (typeof window.reloadCartFromStorage === 'function') {
                            window.reloadCartFromStorage();
                        }
                        if (typeof window.openCartSidebar === 'function') {
                            window.openCartSidebar();
                        }
                    }

                    if (typeof showToast === 'function') {
                        showToast(`Reordered items from #${order.orderNumber}! 🛒`);
                    }
                });
            });
        } catch {
            // silently fail
        }
    }

    // ── Delivery Location Helper ────────────
    function getCurrentDeliveryLocation() {
        try {
            const loc = JSON.parse(localStorage.getItem('hungrieeDeliveryLocation') || 'null');
            return loc?.valid && /^[0-9]{6}$/.test(loc.pinCode || '') ? loc : null;
        } catch {
            return null;
        }
    }

    async function syncDeliveryLocation(pinCode, district, state) {
        if (!/^[0-9]{6}$/.test(pinCode)) return;
        try {
            const res = await fetch('/api/check-coverage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinCode }),
            });
            const data = await res.json();
            const locationData = {
                valid: true,
                pinCode,
                district: data.district || district || '',
                state: data.state || state || '',
                officeCount: data.officeCount || 1,
                latitude: Number.isFinite(data.latitude) ? data.latitude : null,
                longitude: Number.isFinite(data.longitude) ? data.longitude : null,
                coordinateSource: data.coordinateSource || 'Address sync',
            };
            localStorage.setItem('hungrieeDeliveryLocation', JSON.stringify(locationData));
            updateLocationUI(locationData);
        } catch {
            const locationData = {
                valid: true,
                pinCode,
                district: district || '',
                state: state || '',
            };
            localStorage.setItem('hungrieeDeliveryLocation', JSON.stringify(locationData));
            updateLocationUI(locationData);
        }
    }

    function updateLocationUI(loc) {
        const summary = document.getElementById('locationSummary');
        if (summary) {
            const name = loc?.district || loc?.state || loc?.pinCode;
            summary.textContent = name || '';
            summary.classList.toggle('visible', Boolean(name));
            if (name) {
                summary.title = `${loc.district || ''}${loc.district && loc.state ? ', ' : ''}${loc.state || ''} · ${loc.pinCode || ''}`;
            }
        }
        const currentLoc = document.getElementById('currentDeliveryLocation');
        if (currentLoc) {
            currentLoc.textContent = `${loc.district || loc.city || ''}, ${loc.state} · ${loc.pinCode}`;
        }
        const delPin = document.getElementById('deliveryPin');
        if (delPin) {
            delPin.value = loc.pinCode;
        }
        window.dispatchEvent(new Event('storage'));
        loadAddresses();
    }

    // ── Load Addresses ──────────────────────
    async function loadAddresses() {
        const grid = document.getElementById('addressesGrid');
        const empty = document.getElementById('addressesEmpty');
        if (!grid) return;

        try {
            const res = await api('/api/addresses/list');
            if (!res.ok || !res.addresses?.length) {
                grid.innerHTML = '';
                if (empty) { grid.appendChild(empty); empty.style.display = ''; }
                return;
            }
            if (empty) empty.style.display = 'none';

            const currentLoc = getCurrentDeliveryLocation();

            // Auto-sync if no active delivery location is set yet
            if (!currentLoc && res.addresses.length > 0) {
                const defaultAddr = res.addresses.find(a => a.isDefault) || res.addresses[0];
                if (defaultAddr?.pinCode) {
                    syncDeliveryLocation(defaultAddr.pinCode, defaultAddr.city, defaultAddr.state);
                }
            }

            grid.innerHTML = res.addresses.map(addr => {
                const isCurrentPin = currentLoc && currentLoc.pinCode === addr.pinCode;
                return `
                <div class="address-card ${addr.isDefault ? 'is-default' : ''} ${isCurrentPin ? 'is-active-delivery' : ''}" data-address-id="${addr._id}">
                    <div class="address-card-top">
                        <span class="address-label-tag">${labelIcon(addr.label)} ${addr.label}${addr.isDefault ? '<span class="address-default-badge">Default</span>' : ''}</span>
                        ${isCurrentPin ? '<span class="address-active-pin-badge">📍 Active Delivery PIN</span>' : ''}
                    </div>
                    <p class="address-text">${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}</p>
                    <p class="address-pin-city">${addr.city}, ${addr.state} — <strong>PIN ${addr.pinCode}</strong></p>
                    <div class="address-actions">
                        ${!isCurrentPin ? `<button class="address-action-btn set-delivery-btn" data-pin="${addr.pinCode}" data-city="${addr.city}" data-state="${addr.state}">Deliver Here</button>` : ''}
                        <button class="address-action-btn edit-addr-btn" data-id="${addr._id}">Edit</button>
                        <button class="address-action-btn delete delete-addr-btn" data-id="${addr._id}">Delete</button>
                    </div>
                </div>
            `;
            }).join('');

            // Attach listeners
            grid.querySelectorAll('.set-delivery-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const pin = btn.dataset.pin;
                    const city = btn.dataset.city;
                    const state = btn.dataset.state;
                    await syncDeliveryLocation(pin, city, state);
                    if (typeof showToast === 'function') {
                        showToast(`Delivery location set to PIN ${pin} (${city})! 🛵`);
                    }
                });
            });
            grid.querySelectorAll('.edit-addr-btn').forEach(btn => {
                btn.addEventListener('click', () => editAddress(btn.dataset.id, res.addresses));
            });
            grid.querySelectorAll('.delete-addr-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteAddress(btn.dataset.id));
            });
        } catch {
            // silently fail
        }
    }

    function labelIcon(label) {
        if (label === 'Home') return '🏠';
        if (label === 'Work') return '🏢';
        return '📌';
    }

    // ── Address Modal ───────────────────────
    const addrModal = document.getElementById('addressModal');
    const addrForm = document.getElementById('addressForm');
    const addBtn = document.getElementById('addAddressBtn');
    const closeBtn = document.getElementById('addressModalClose');
    const cancelBtn = document.getElementById('addressCancelBtn');

    function openAddressModal(address = null) {
        const title = document.getElementById('addressModalTitle');
        if (title) title.textContent = address ? 'Edit Address' : 'Add New Address';
        document.getElementById('addressId').value = address?._id || '';
        document.getElementById('addrLine1').value = address?.line1 || '';
        document.getElementById('addrLine2').value = address?.line2 || '';

        if (address) {
            document.getElementById('addrPin').value = address.pinCode || '';
            document.getElementById('addrCity').value = address.city || '';
            document.getElementById('addrState').value = address.state || '';
            document.getElementById('addrDefault').checked = address.isDefault || false;
        } else {
            // Auto-fill from current active delivery location
            const curLoc = getCurrentDeliveryLocation();
            document.getElementById('addrPin').value = curLoc?.pinCode || '';
            document.getElementById('addrCity').value = curLoc?.district || '';
            document.getElementById('addrState').value = curLoc?.state || '';
            document.getElementById('addrDefault').checked = false;
        }

        // Set label pill
        const label = address?.label || 'Home';
        document.querySelectorAll('.addr-label-pill').forEach(p => {
            p.classList.toggle('active', p.dataset.label === label);
        });

        addrModal?.showModal();
    }
    function closeAddressModal() { addrModal?.close(); }

    addBtn?.addEventListener('click', () => openAddressModal());
    closeBtn?.addEventListener('click', closeAddressModal);
    cancelBtn?.addEventListener('click', closeAddressModal);
    addrModal?.addEventListener('click', (e) => {
        if (e.target === addrModal) closeAddressModal();
    });

    // Auto-lookup city & state when 6-digit PIN is entered in address modal
    const addrPinInput = document.getElementById('addrPin');
    addrPinInput?.addEventListener('input', async () => {
        const pin = addrPinInput.value.trim();
        if (/^\d{6}$/.test(pin)) {
            try {
                const res = await fetch('/api/check-coverage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pinCode: pin }),
                });
                const data = await res.json();
                if (data.valid) {
                    if (data.district && !document.getElementById('addrCity').value) {
                        document.getElementById('addrCity').value = data.district;
                    }
                    if (data.state && !document.getElementById('addrState').value) {
                        document.getElementById('addrState').value = data.state;
                    }
                }
            } catch { /* silently ignore */ }
        }
    });

    // Label pills
    document.querySelectorAll('.addr-label-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.addr-label-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });

    // Save address
    addrForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = addrForm.querySelector('.auth-submit-btn');
        const errEl = document.getElementById('addressError');
        setLoading(btn, true);

        const addressId = document.getElementById('addressId').value;
        const label = document.querySelector('.addr-label-pill.active')?.dataset.label || 'Home';
        const isDefault = document.getElementById('addrDefault').checked;
        const pinCode = document.getElementById('addrPin').value.trim();
        const city = document.getElementById('addrCity').value.trim();
        const state = document.getElementById('addrState').value.trim();

        const data = {
            addressId: addressId || undefined,
            label,
            line1: document.getElementById('addrLine1').value.trim(),
            line2: document.getElementById('addrLine2').value.trim(),
            city,
            state,
            pinCode,
            isDefault,
        };

        try {
            const endpoint = addressId ? '/api/addresses/update' : '/api/addresses/add';
            const res = await api(endpoint, data);
            if (res.ok) {
                closeAddressModal();
                // If set as default or no current delivery location is set, sync location with this PIN!
                if (isDefault || !getCurrentDeliveryLocation()) {
                    await syncDeliveryLocation(pinCode, city, state);
                } else {
                    loadAddresses();
                }
                if (typeof showToast === 'function') showToast(addressId ? 'Address updated! ✓' : 'Address added! ✓');
            } else {
                showError(errEl, res.error || 'Failed to save address.');
            }
        } catch {
            showError(errEl, 'Network error. Please try again.');
        } finally {
            setLoading(btn, false);
        }
    });

    function editAddress(id, addresses) {
        const addr = addresses.find(a => a._id === id);
        if (addr) openAddressModal(addr);
    }

    async function deleteAddress(id) {
        if (!confirm('Delete this address?')) return;
        try {
            const res = await api('/api/addresses/delete', { addressId: id });
            if (res.ok) {
                loadAddresses();
                if (typeof showToast === 'function') showToast('Address deleted.');
            }
        } catch { /* silently fail */ }
    }

    // Keep address cards updated if delivery location changes in navbar or other tabs
    window.addEventListener('storage', (e) => {
        if (!e.key || e.key === 'hungrieeDeliveryLocation') {
            loadAddresses();
        }
    });

    // ── Place Order (hook into checkout) ────
    window.placeOrder = async function () {
        const session = getSession();
        if (!session) {
            if (typeof showToast === 'function') showToast('Please sign in to place an order.');
            window.location.href = '/profile';
            return { ok: false };
        }

        const cartRaw = JSON.parse(localStorage.getItem('hungrieeCart') || '[]');
        if (!cartRaw.length) return { ok: false };

        const savedLocation = getCurrentDeliveryLocation();
        let orderAddress = {
            line1: savedLocation?.district || '',
            city: savedLocation?.district || '',
            state: savedLocation?.state || '',
            pinCode: savedLocation?.pinCode || '',
        };

        // If user has a saved address matching this location or a default address, use full street address
        try {
            const addrRes = await api('/api/addresses/list');
            if (addrRes.ok && addrRes.addresses?.length) {
                const match = (savedLocation?.pinCode ? addrRes.addresses.find(a => a.pinCode === savedLocation.pinCode) : null)
                    || addrRes.addresses.find(a => a.isDefault)
                    || addrRes.addresses[0];
                if (match) {
                    orderAddress = {
                        line1: `${match.line1}${match.line2 ? ', ' + match.line2 : ''}`,
                        city: match.city,
                        state: match.state,
                        pinCode: match.pinCode,
                    };
                }
            }
        } catch {}

        const items = cartRaw.map(item => ({
            dishId: Number(item.id),
            name: item.name,
            image: item.image,
            price: item.price,
            qty: item.qty,
        }));

        const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
        const delivery = subtotal >= 299 ? 0 : 40;
        const total = subtotal + delivery;

        const res = await api('/api/orders/place', {
            items,
            subtotal,
            delivery,
            discount: 0,
            total,
            coupon: '',
            address: orderAddress,
        });

        if (res.ok) {
            if (typeof window.clearCart === 'function') {
                window.clearCart();
            } else {
                localStorage.setItem('hungrieeCart', '[]');
                if (typeof updateCart === 'function') updateCart();
            }
            if (typeof showToast === 'function') showToast(`Order #${res.order.orderNumber} placed! 🎉`);
        }
        return res;
    };

    // ── Init ────────────────────────────────
    initProfile();

})();
const otpModal = document.getElementById('otpModal');

if (otpModal) {
    otpModal.addEventListener('close', () => {
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('position');
        document.body.style.removeProperty('top');
        document.body.style.removeProperty('width');
    });
}