# KEFEX — Full-stack community commerce platform

KEFEX brings product discovery, community opinions, reviews, discussion threads and a storefront together. The application is split into an Angular standalone frontend and a Node.js/Express API backed by MongoDB/Mongoose.

## Design direction

The interface preserves the legacy KEFEX cyber-SaaS identity: neon cyan/violet accents, terminal typography, restrained glow, grid motifs and compact data surfaces. The visual system is now shared across the responsive page layouts, with consistent spacing, keyboard focus, readable contrast and clear loading/error/empty states.

## Repository map

- `Front/`: Angular standalone application, routing, auth, HTTP services and views.
- `Back/`: Express API, Mongoose models, controllers, routes, JWT middleware and Postman collection.
- `Back/.env.example`: required environment variable names. Create a private `.env` from this file; never commit credentials.
- `Front/public/assets/`: KEFEX logo and legacy visual assets reused by the Angular UI.
- `docs/INITIAL_TECHNICAL_AUDIT.md`: applied changes, contract boundaries and verification status.
- `fundamentos kefex.zip` (provided separately): legacy prototype/reference, not a production runtime dependency.

## Requirements and setup

Use a Node.js version supported by the installed Angular 22 toolchain and repository lockfiles.

1. In `Back/`, copy `.env.example` to `.env`, fill in a MongoDB Atlas URI and a cryptographically random `JWT_SECRET` of at least 32 characters, and run `npm ci`.
2. Start the API with `npm run dev` or `npm start`. It listens on `PORT` (default `3005`) only after MongoDB connects successfully.
3. In `Front/`, run `npm ci`, then `npm start`. Angular development server defaults to port `4200`.
4. Import `Back/src/non-related/KEFEX_Backend_API.postman_collection.json` into Postman. The default `baseUrl` is `http://localhost:3005`.

## Authentication and security

- Login accepts `{ "username": "email@example.com", "password": "..." }` and returns the JWT in `data`.
- Public registration always creates a `user`; a request body cannot grant administrator privileges.
- Protected API calls use `Authorization: Bearer <token>` through the Angular HTTP interceptor.
- `GET /api/usuario/profile` requires a valid JWT; `GET /api/usuario/admin/all` additionally requires `rol: admin`.
- User management and product mutations are admin-only. Cart and favorite routes require authentication; cart access is limited to the current user except for administrators.
- The frontend stores JWT in localStorage for compatibility with the existing project. This is vulnerable to token theft under XSS; a production deployment with a trusted origin should evaluate HttpOnly, Secure, SameSite cookies and CSRF controls.
- Public registration does not create admin accounts. For local administration, promote a trusted account through a controlled database operation or a future audited admin-provisioning workflow; never add an admin role selector to public registration.

## Implemented in this revision

- Fixed Angular SSR bootstrap signature with `BootstrapContext`.
- Standardized API base URL (`http://localhost:3005/api`), JWT interceptor, expiry-aware session state and functional route guards.
- Converted authentication model/controller/routes to ES modules and aligned the user model and controller contracts.
- Added protected profile read/update and admin-user-list endpoints; secured user management, product mutations, cart ownership and favorites.
- Made database startup fail fast and added JWT secret validation.
- Added multipart publication image upload with a 5 MB limit and image MIME allowlist.
- Completed responsive UI states for login, registration, profile, admin, explorer, forum, store, cart and favorites.
- Reused the legacy KEFEX logo/mascot assets in the Angular public assets folder.
- Added a 30-request Postman collection covering authentication, profile, admin, publications, products, cart, forum, comments, search and favorites.

## Known integration limits

The supplied source has multiple domain-model mismatches in the forum comments, voting and portions of the older services. Discussion creation, per-thread comments and 1–5 opinion ratings use the current forum models. Separate up/down voting is not implemented and is not presented as a working interaction. Checkout/payment is intentionally disabled; no payment provider is configured. The admin page only reports metrics supported by the API. Multipart publication upload requires the user to select an image file in Postman. Site-review payloads and older comments-for-you behavior still need end-to-end validation against a live MongoDB instance.

## Verification status

All backend JavaScript files passed `node --check`; the Postman collection is valid JSON. A full Angular production build, SSR browser run, live MongoDB/API integration test and browser-level UI tests have not been completed in this environment because frontend dependencies are not installed, the available Node runtime is below the Angular 22 toolchain requirement indicated by package engine warnings, and private database credentials are intentionally excluded. Do not interpret this handoff as a claim that end-to-end tests passed.
