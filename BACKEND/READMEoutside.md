# KEFEX — Backend and Postman refinement delivery

## Included

- `BACKEND/src/`: complete backend source tree, with descriptive Controller/Model/Routes filenames and updated imports.
- `BACKEND/package.json`: project check scripts.
- `BACKEND/.env.example`: environment variables, including the guarded local Postman bypass.
- `BACKEND/scripts/check-project.mjs`: recursive syntax and relative-import verification.
- `BACKEND/README.md`: backend setup, API mount map, security and Postman guide.
- `KEFEX_API_Resource_Catalog.postman_collection.json`: resource-oriented collection with 14 folders and 59 requests.

## Frontend status

The existing Angular frontend was reviewed as part of the supplied project, but no frontend source file needed modification for this backend/Postman task. The archive therefore does not duplicate or rewrite the untouched frontend. The root README documents the frontend integration boundary.

## Important security behavior

JWT verification has **not** been removed from the application. A local-only bypass is available via `POSTMAN_AUTH_BYPASS=true`, and is rejected when `NODE_ENV=production`. The bypass maps `X-Dev-Role` to a real active MongoDB account configured through `POSTMAN_DEV_USER_EMAIL` or `POSTMAN_DEV_ADMIN_EMAIL`; this keeps ownership and role checks meaningful. Set `POSTMAN_AUTH_BYPASS=false` to return to standard Bearer-token authentication.

## Validation performed

- `npm run check`: passes for all JavaScript files under `BACKEND/src`; verifies syntax and relative imports.
- Postman collection: valid JSON structure; 14 resource folders and 59 requests.
- No live request was made against the user's MongoDB Atlas/server, so runtime database integration remains to be exercised in the team's environment.
