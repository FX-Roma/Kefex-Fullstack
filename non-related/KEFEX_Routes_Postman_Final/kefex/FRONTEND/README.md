# KEFEX Frontend

Angular standalone application with route-level lazy loading, JWT-aware functional guards, an HTTP interceptor, reactive forms, and responsive cyber-SaaS UI.

## Local setup

1. Install a Node.js version supported by the Angular 22 toolchain and run `npm ci`.
2. Confirm `src/app/enviroments/enviroment.ts` points to the backend API (`http://localhost:3005/api` by default).
3. Run `npm start` for local development or `npm run build` for a production build.

The root README documents the integration contract and known API limitations. The current environment did not complete an Angular production build; run the build and browser/SSR smoke tests after installing dependencies with a supported Node version.
