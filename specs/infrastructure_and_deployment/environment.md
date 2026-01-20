# Environment Management

This project uses a custom multi-tenant environment variable strategy to support multiple white-labeled applications from a single boilerplate.

## 1. Directory Structure (`/env`)
- **`env/env-dev/`**: Contains development-specific variable files.
  - Naming Convention: `.env.dev.[appName]` (e.g., `.env.dev.loyalboards`).
- **`env/env-prod/`**: Template files for production environments (actual values are typically managed in the deployment platform's dashboard).

## 2. Dynamic Loading Logic
The loading of these variables is centralized in `next.config.mjs` and shared by server-side libraries like `libs/auth.js`.

### How it works:
1. The `APP` or `NEXT_PUBLIC_APP` environment variable is detected.
2. The script constructs a path: `env/env-dev/.env.dev.${appName}`.
3. If the file exists, `dotenv` loads the variables into `process.env`.

## 3. Critical Variables
Refer to `.env.example` in the root directory for a full list of required variables, including:
- `AUTH_SECRET`: NextAuth encryption key.
- `MONGO_URI`: Connection string for the database.
- `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`: For payment processing.
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For OAuth integration.
- `RESEND_API_KEY`: For transactional emails.
