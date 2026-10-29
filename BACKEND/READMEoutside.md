# KEFEX Backend + Postman authentication fix

The auth middleware now enters the local Postman bypass only if the request explicitly includes `X-Dev-Role: user` or `X-Dev-Role: admin` and `POSTMAN_AUTH_BYPASS=true` in non-production. Requests without that header continue through standard Bearer JWT authentication, including Angular requests from the frontend interceptor.

See `README_AUTH_FIX.md` for root cause, setup and the required credential-rotation action. `.env` is deliberately excluded from this package; copy `BACKEND/.env.example` to `.env` and supply private values locally.
