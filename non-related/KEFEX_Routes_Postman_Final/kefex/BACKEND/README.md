# KEFEX Backend API

Express 5 API using ES modules and MongoDB/Mongoose. The API waits for MongoDB before listening and requires `JWT_SECRET` (at least 32 characters).

## Local setup

1. Copy `.env.example` to `.env` and configure `KEFEX`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, and `FRONTEND_ORIGIN`.
2. Run `npm ci`.
3. Run `npm run dev` for development or `npm start` for the API.
4. Verify `GET http://localhost:3005/api/health`. This confirms HTTP availability, not database contents.
5. Import `postman/KEFEX_Backend_API_Organized.postman_collection.json` into Postman.

Never commit `.env` or real credentials. Public registration always creates `user`; it cannot assign `admin`. For first-time administrator provisioning, configure `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the environment and run `npm run admin:bootstrap`. The command refuses to create a second initial administrator. After bootstrap, use an authenticated admin account to manage roles via `/api/admin/users`. See `README_Postman_KEFEX.md` for the route map and Postman workflow.

## Canonical role namespaces

- `POST /api/auth/user/register` and `POST /api/auth/user/login`
- `POST /api/auth/admin/login`
- `/api/user/*`: requires a valid JWT with role `user`
- `/api/admin/*`: requires a valid JWT with role `admin`

Legacy endpoints used by the current app are retained where needed for compatibility.

## Scripts

- `npm run dev`: start with nodemon.
- `npm start`: start the API.
- `npm run admin:bootstrap`: create the initial administrator once.
- `npm run check`: syntax-check core API entrypoints and role-specific routers.
- `npm test`: validate the collection and role-separation contract.
