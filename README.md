# Hungriee 🍛

Authentic Indian Food Delivery Web Application.

> **For AI coding agents and developers**: Please see [AGENTS.md](file:///c:/Users/ARSHDEEP/Downloads/Project/AGENTS.md) for comprehensive architecture documentation, API schemas, routing rules, and coding conventions.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Ensure `.env` exists with your MongoDB URI and port:
```ini
MONGO_URI=mongodb://127.0.0.1:27017/hungriee
PORT=3000
```

### 3. Run Locally
```bash
npm start
# or
node server.js
```
Visit `http://localhost:3000` in your browser.

---

## Highlights

- **Pure Vanilla Stack**: Native HTML5, CSS3 design system, and ES6+ JavaScript. No front-end framework overhead.
- **Custom Native Node.js Server**: Built with `node:http`, clean routing (`/`, `/menu`, `/profile`), and built-in REST API.
- **Customer Accounts & Security**: User authentication with `bcryptjs` password hashing and UUID session tokens.
- **Location & Verification**: Real Indian PIN code lookup and OpenStreetMap/Photon address autocomplete.
- **Cart & Order System**: LocalStorage cart persistence, coupon codes, and order tracking.


## Brevo email OTP setup

Add these server-side variables to `.env` (never put secrets in browser JavaScript or commit real credentials):

```ini
BREVO_API_KEY=your_brevo_v3_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email@example.com
BREVO_SENDER_NAME=Hungriee
OTP_HASH_SECRET=replace_with_a_long_random_secret
```

Create a v3 API key in Brevo with Transactional email permissions and use a verified sender email. Registration codes are sent using the Brevo HTTP API, expire after five minutes, and allow at most five verification attempts. Registration and order placement use email verification. The optional existing-account phone-verification flow still uses TextBee and needs its separate configuration if you want to keep using it.
