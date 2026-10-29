# KEFEX Backend

Node.js + Express + Mongoose API. The backend uses ES modules and connects to MongoDB before opening the HTTP listener.

## Quick start

1. Install dependencies: `npm ci`.
2. Copy `.env.example` to `.env` and set `KEFEX` and a random `JWT_SECRET` (at least 32 characters). Never share or commit `.env`.
3. Start the API: `npm run dev` or `npm start`.
4. API base URL defaults to `http://localhost:3005`; `GET /api/health` confirms the process is responding but does not independently prove database health.
5. Run `npm run check` for JavaScript syntax and relative-import checks.

## Token-free Postman development mode (local only)

Authentication remains enforced by default. For local team development, a narrowly gated bypass is available so protected requests can be sent without `Authorization: Bearer ...`:

- Set `NODE_ENV=development`.
- Set `POSTMAN_AUTH_BYPASS=true`.
- Set `POSTMAN_DEV_USER_EMAIL` and `POSTMAN_DEV_ADMIN_EMAIL` to existing, active MongoDB accounts with matching `user` and `admin` roles.
- In Postman protected requests, send `X-Dev-Role: user` or `X-Dev-Role: admin`. The bypass is activated only when this header is explicitly present.
- Requests from Angular that do not send `X-Dev-Role` continue to authenticate with their normal Bearer JWT, even while the local bypass is enabled.
- Configure different active MongoDB accounts for the user and admin email variables.
- Restart the API after changing environment variables.

The middleware looks up the configured account in MongoDB and assigns its real ID and role to the request, so user-owned resources continue to behave consistently. This bypass is rejected when `NODE_ENV=production`. Do not enable it on a shared/staging/production server. If the bypass is disabled, use the normal login endpoint and a valid JWT.

## API mount points

| Mount | Purpose | Typical access |
|---|---|---|
| `/api/auth` | Registration and login | Public |
| `/api/usuario` | Current profile and admin user listing | Authenticated; admin listing requires admin |
| `/api/usuarios` | User management CRUD | Admin |
| `/api/publicaciones` | Publication CRUD | Public reads; mutations protected |
| `/api/productos` | Product CRUD | Public reads; mutations admin |
| `/api/sites` | Site directory CRUD | Public reads; mutations admin |
| `/api/opinions` | Forum opinions | Public reads; mutations protected |
| `/api/comments` | Opinion comments | Public reads; mutations protected and ownership checked |
| `/api/comments-for-you` | Feed comments | Public reads; mutations protected and ownership checked |
| `/api/carrito` | Current user's cart | Authenticated |
| `/api/favoritos` | Favorites | Authenticated |
| `/api/search` | Global search, trending, category filter | Public read-only query API |
| `/api/health` | Process health | Public |

## Source layout

- `src/Routes/`: Express route declarations; names identify resource and access role.
- `src/Controller/`: request validation, domain logic, and response handling.
- `src/Models/`: Mongoose schemas and model definitions.
- `src/middleware/`: authentication, role checks, and upload handling.
- `src/connection.js`: MongoDB connection.
- `src/server.js`: middleware and API mount points.
- `src/index.js`: validates required configuration, awaits MongoDB, then starts listening.

## CRUD scope

Resource controllers expose Create/Read-all/Read-by-ID/Update/Delete where that operation is meaningful and implemented. Authentication, profile, cart, favorites, and search are domain-specific: profile updates the already-authenticated account rather than creating a profile; cart uses add/update/remove/clear operations; favorites are add/read/remove; search is query-oriented. CRUD should not be added artificially where it would violate domain behavior.

## Frontend

The Angular frontend is in the sibling `FRONTEND/` directory in the project bundle. This delivery does not change frontend source files; its API services should continue to use the mount points above. When the local Postman bypass is enabled, it does not automatically bypass Angular route guards or frontend HTTP interceptor behavior.

## Postman

Import `KEFEX_API_Resource_Catalog.postman_collection.json`. Each folder maps to a resource/controller naming convention, with request descriptions and ID variables. Use disposable test data for create/update/delete requests. Replace placeholder IDs with real MongoDB ObjectIds. For free local Postman requests, enable the local bypass described above and use `X-Dev-Role` headers on protected requests.

## Security notes

- Public registration always creates `user`; the public request body cannot assign `admin`.
- User management routes are protected by admin role middleware.
- Passwords are hashed using bcrypt and excluded from query results by default.
- Never commit `.env` or enable the Postman bypass in production.
