const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Load .env file if present
try {
    if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile();
    }
} catch {
    // .env file not present or loaded externally
}

// ── Connect ────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hungriee';

let connected = false;
async function connect() {
    if (connected) return;
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        connected = true;
        console.log('✓ MongoDB Atlas connected successfully');
    } catch (err) {
        console.error('✗ MongoDB connection failed:', err.message);
        throw err;
    }
}

// ── Address Sub-schema ─────────────────────────────────────
const addressSchema = new mongoose.Schema({
    label:    { type: String, default: 'Home' },            // Home / Work / Other
    line1:    { type: String, required: true },
    line2:    { type: String, default: '' },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    pinCode:  { type: String, required: true, match: /^\d{6}$/ },
    phone:    { type: String, default: '' },
    isDefault:{ type: Boolean, default: false },
}, { _id: true, timestamps: true });

// ── User Schema ────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:     { type: String, default: '', trim: true },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    password:  { type: String, required: true },
    addresses: [addressSchema],
    sessionToken: { type: String, default: '', index: true },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Instance method: compare password
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

// Instance method: generate session token
userSchema.methods.generateSession = function () {
    this.sessionToken = uuidv4();
    return this.sessionToken;
};

const User = mongoose.model('User', userSchema);

// ── Order Item Sub-schema ──────────────────────────────────
const orderItemSchema = new mongoose.Schema({
    dishId:   { type: Number, required: true },
    name:     { type: String, required: true },
    image:    { type: String, default: '' },
    price:    { type: Number, required: true },
    qty:      { type: Number, required: true, min: 1 },
}, { _id: false });

// ── Order Schema ───────────────────────────────────────────
const orderSchema = new mongoose.Schema({
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    items:       [orderItemSchema],
    subtotal:    { type: Number, required: true },
    delivery:    { type: Number, default: 0 },
    discount:    { type: Number, default: 0 },
    total:       { type: Number, required: true },
    coupon:      { type: String, default: '' },
    status:      { type: String, default: 'Confirmed', enum: ['Confirmed', 'Preparing', 'On the way', 'Delivered', 'Cancelled'] },
    address: {
        line1:   String,
        line2:   String,
        city:    String,
        state:   String,
        pinCode: String,
        phone:   String,
    },
    estimatedDelivery: { type: String, default: '30-40 min' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);


// ── Short-lived OTP challenges ──────────────────────────────
const otpChallengeSchema = new mongoose.Schema({
    phone: { type: String, default: '', index: true },
    email: { type: String, default: '', lowercase: true, trim: true, index: true },
    purpose: { type: String, required: true, enum: ['register', 'verify-phone', 'forgot-password', 'password-reset'] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
}, { timestamps: true });
const OtpChallenge = mongoose.model('OtpChallenge', otpChallengeSchema);

module.exports = { connect, User, Order, OtpChallenge };
