# AGENTS.md — Developer & Agent Guide for Hungriee

This document is the primary reference for AI coding agents and developers working on the **Hungriee** repository. It outlines the project architecture, tech stack, data contracts, design system, and key conventions.

---

## 1. Project Overview

**Hungriee** is a full-stack Indian food delivery web application offering authentic dishes (biryani, curries, tandoori, street food, desserts), interactive menus, cart & checkout with coupon validation, live Indian PIN-code verification & address autocomplete, and customer accounts (authentication, saved addresses, order history & tracking).

- **Primary URL**: `http://localhost:3000` (or configured `PORT`)
- **App Type**: Server-rendered static front-end + custom Node.js REST API + MongoDB.

---

## 2. Technology Stack

- **Front-End**: Vanilla HTML5, Vanilla CSS3 (Custom design system; **no** Tailwind, Bootstrap, or utility frameworks), Vanilla JavaScript (ES6+ modules / scripts; **no** React, Vue, or build-step bundlers).
- **Back-End**: Node.js standard library (`node:http`, `node:fs`, `node:path`). **No Express** or heavy server framework is used; routing and JSON body parsing are implemented directly.
- **Database**: MongoDB with Mongoose (`mongoose`, `bcryptjs`, `uuid`).
- **External Services**:
  - OpenStreetMap / Photon (`photon.komoot.io`) for geocoding and address auto-completion.
  - Indian Postal Directories (`api.pincodeapi.in`, `pincodez.info`) for 6-digit PIN validation and coordinates.
- **Deployment**: Ubuntu Linux systemd service + Nginx reverse proxy configurations located in `deploy/`.

---

## 3. Directory & File Structure

```text
├── .env                          # Local environment variables (MONGO_URI, PORT, HOST)
├── package.json                  # Dependencies (mongoose, bcryptjs, uuid) & scripts
├── db.js                         # Mongoose connection, User, Address, and Order schemas
├── server.js                     # HTTP server, REST API handlers, clean routing, static file server
├── index.html                    # Homepage (Hero, dish showcase, statistics, reviews, pincode dialog)
├── menu.html                     # Full interactive menu with category tabs, filters, sorting & search
├── profile.html                  # Auth (Sign In / Register), User dashboard, addresses, order history
├── style.css                     # Core stylesheet: tokens, animations, navbar, footer, cart drawer, modals
├── pages.css                     # Page-specific styling for menu pages
├── profile.css                   # Profile dashboard, glassmorphic auth cards, and order lists
├── script.js                     # Main client logic: dishes catalog, cart, checkout, PIN lookup, animations
├── profile.js                    # Account logic: session validation, profile forms, address CRUD, orders
├── images/                       # SVG brand marks, dish photography, and UI assets
└── deploy/
    ├── hungriee.ihooman.ai.nginx.conf  # Nginx reverse proxy configuration
    └── setup-ubuntu.sh                 # Production provisioning script
```

---

## 4. Key Architectural Patterns & Constraints

### ⚠️ Strict Static Asset Whitelist in `server.js`
`server.js` includes an explicit security whitelist in `serveStatic()` for public file serving.
**CRITICAL**: If you create a new public `.html`, `.css`, or `.js` file, you **must** add it to `isPublicAsset` in `server.js` (around line 710), otherwise requests will return a `404 Not Found`.

### Clean URL Routing
`server.js` serves clean URLs without file extensions:
- `/` or `/home` → `index.html`
- `/menu` → `menu.html`
- `/profile`, `/account`, `/login`, `/register` → `profile.html`

Requests to legacy `.html` URLs (e.g., `/menu.html`) receive an automatic `301 Moved Permanently` redirect to clean URLs. All navigation links (`<a href="...">`) must use clean paths.

### Cache Busting Convention
Since there is no asset pipeline or bundler, stylesheets and scripts include query parameters for cache-busting:
```html
<link rel="stylesheet" href="style.css?v=20261016-profile-nav-1">
```
When making noticeable style or script changes, bump the version query parameter across the HTML templates.

### Database Connection & Resilience
- Connection string is loaded from `.env` via `process.loadEnvFile()` (Node.js 20+) or defaults to `mongodb://127.0.0.1:27017/hungriee`.
- In `server.js:start()`, if MongoDB is unreachable, the server continues running in graceful fallback mode so static pages can still be viewed, while database-dependent endpoints return error responses.

---

## 5. API Endpoints Reference

All API routes communicate using JSON (`Content-Type: application/json; charset=utf-8`). Authenticated routes require the `x-session` header containing the user's UUID session token.

### Authentication (`/api/auth/*`)
- `POST /api/auth/register` — Body: `{ name, email, password, phone, isPhoneVerified }` → Returns `{ ok, sessionToken, user }`
- `POST /api/auth/login` — Body: `{ email, password }` → Returns `{ ok, sessionToken, user }`
- `POST /api/auth/logout` — Requires `x-session` header → Returns `{ ok: true }`
- `POST /api/auth/me` — Requires `x-session` header → Returns `{ ok: true, user }`
- `POST /api/auth/update-profile` — Requires `x-session`, Body: `{ name }` → Returns `{ ok: true, user }`
- `POST /api/auth/verify-phone` — Requires `x-session`, Body: `{ phone }` → Returns `{ ok: true, user }`
- `POST /api/auth/change-password` — Requires `x-session`, Body: `{ currentPassword, newPassword }` → Returns `{ ok: true, sessionToken }`

### Address Book (`/api/addresses/*`)
- `POST /api/addresses/list` — Requires `x-session` → Returns `{ ok: true, addresses: [...] }`
- `POST /api/addresses/add` — Body: `{ label, line1, line2, city, state, pinCode, isDefault }`
- `POST /api/addresses/update` — Body: `{ addressId, ... }`
- `POST /api/addresses/delete` — Body: `{ addressId }`

### Orders (`/api/orders/*`)
- `POST /api/orders/place` — Requires `x-session`, Body: `{ items: [{ dishId, name, price, qty, image }], subtotal, delivery, discount, total, coupon, address }` → Returns `{ ok: true, order: { orderNumber, _id } }`
- `POST /api/orders/list` — Requires `x-session` → Returns `{ ok: true, orders: [...] }`

### Location & Verification
- `POST /api/lookup-pin` or `/api/check-coverage` — Body: `{ pinCode }` (6 digits) → Returns `{ valid: true, district, state, latitude, longitude, ... }`
- `POST /api/address-suggestions` — Body: `{ query, pinCode, district, state, latitude, longitude }` → Returns OpenStreetMap suggestions.

---

## 6. Client-Side State Management

### LocalStorage Keys
- `hungrieeSession`: Stores user UUID session token string.
- `hungrieeUser`: Stores sanitized user JSON object (`{ id, name, email, phone }`).
- `hungrieeCart`: Stores active cart items array (`[{ id, name, price, qty, image, ... }]`).
- `hungrieeDeliveryLocation`: Stores currently selected PIN and location details.

### Navbar Buttons & Icons Standard
The top navigation bar icons (`.location-btn`, `.cart-btn`, `.profile-nav-btn`) follow a unified pattern:
- Size: `40px` × `40px`
- Background: `transparent` (hover: `rgba(242, 107, 58, 0.12)`)
- Border: `0` / none (no circular borders or badges)
- Radius: `var(--radius-md)`
- SVG dimensions: `24px` × `24px` with `stroke-width="1.8"` or `2`
- Logged-in profile state uses a green dot indicator `::after` rather than a wrapper border.

---

## 7. Running & Testing Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   node server.js
   # or
   npm start
   ```

3. **Database Setup**:
   Ensure MongoDB Atlas URI or local instance is configured in `.env`:
   ```ini
   MONGO_URI=mongodb://127.0.0.1:27017/hungriee
   PORT=3000
   ```
