# KEFEX Backend API — Postman Test Suite

This collection is organized by user workflow and by authorization level. Request names and descriptions explain what each request does, which token it uses, and when an ID must be supplied.

## Prerequisites

- Start the KEFEX backend. The default base URL is `http://localhost:3005`.
- Confirm `GET /api/health` returns HTTP 200.
- Ensure the backend has connected to MongoDB before testing database-backed routes.
- Use a dedicated development/test database. Several requests create, update, or delete persistent records.
- Create one normal account and prepare one administrator account in MongoDB. **Public registration always assigns the `user` role**; do not attempt to create an administrator through public registration.

## Collection variables

| Variable | Purpose |
|---|---|
| `baseUrl` | API origin, default `http://localhost:3005` |
| `userEmail`, `userPassword` | Credentials for a normal test account |
| `adminEmail`, `adminPassword` | Credentials for a pre-existing administrator |
| `userToken`, `adminToken` | JWTs captured automatically by the corresponding login requests |
| `userId` | User ObjectId captured during login/register |
| `publicationId`, `productId`, `cartItemId`, `favoriteId`, `opinionId`, `commentId`, `siteId` | Resource identifiers used in subsequent requests |
| `searchTerm` | Search query / category |

Replace the sample credentials with your own local test credentials. Do not commit real passwords or tokens.

## Recommended execution order

1. **`00 — Server & Health`**: run `API root` and `Health check`.
2. **`01 — Authentication · USER`**: register a normal account if needed, then run `Login user`. The response script saves the JWT to `userToken` and the account ID to `userId`.
3. **`02 — Authentication · ADMIN`**: set `adminEmail` and `adminPassword`, then run `Login admin`. The response script saves the JWT to `adminToken` and asserts the returned role is `admin`.
4. **`03 — User Profile`**: confirm user profile access; run the admin-only list-users request with `adminToken`.
5. Run the public, store, cart, forum, search and favorites folders as needed. Create resources before using their IDs in later requests.
6. Run **`09 — Administration · Users & Moderation`** only with the administrator token and test data.

## Folder map

- `00 — Server & Health`: verifies HTTP reachability.
- `01 — Authentication · USER`: public registration and login for a regular account.
- `02 — Authentication · ADMIN`: login for an administrator that already exists.
- `03 — User Profile`: profile read/update and admin-only user listing.
- `04 — Publications & Explore`: list, search, create, read, update and delete publications.
- `05 — Store · Products & Sites`: product CRUD and review-site routes.
- `06 — Cart`: read/create cart, add items, change quantity, remove items and clear cart.
- `07 — Forum · Opinions & Comments`: discussion and comment endpoints.
- `08 — Search & Favorites`: global search, trending/category search and favorite management.
- `09 — Administration · Users & Moderation`: admin-only user management.

## Important API behavior

- Auth routes are mounted at `/api/auth`. Both English and Spanish aliases exist: `/register` and `/registro`, `/login` and `/inicio-sesion`.
- User profile routes are mounted at `/api/usuario`.
- User management routes are mounted at `/api/usuarios`; those require the `admin` role.
- Publications are mounted at `/api/publicaciones`. List requests support `page`, `limit`, `categoria`, and `q`.
- Publication creation uses `multipart/form-data`: `contenido`, `categoria`, and optional file field `imagen`. Let Postman set the multipart `Content-Type` boundary automatically.
- Cart routes are mounted at `/api/carrito`. The cart belongs to the authenticated user; `usuarioId` must match the current user unless the caller is an admin.
- Opinions are mounted at `/api/opinions`; comments are mounted at `/api/comments`.
- Favorites are mounted at `/api/favoritos`; the body must include `publicacionId` or `productoId`.
- Product and review-site mutations require an admin token.
- The API's health route confirms the HTTP server responds; use startup logs or a database-backed request to verify MongoDB connectivity as well.

## Safety notes

Requests named `Delete`, `Clear`, `Update`, or `Create` mutate database records. Use test data and a development database. Never run destructive requests against production data without explicit authorization.

This collection was generated from the KEFEX route/controller definitions and the prior collection supplied for this project. It has been JSON-validated, but it has **not** been executed against your live local server; response schemas and any controller-specific required fields should be confirmed during your test run.
