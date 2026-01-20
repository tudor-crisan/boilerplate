# Auth and Billing

Documentation on the core business logic: identifying users and handling payments.

## Authentication (NextAuth)
Managed in `/libs/auth.js` using NextAuth (v5 beta).
- **Secret**: The application uses the `AUTH_SECRET` environment variable for session encryption.
- **Providers**:
  - **Google**: Uses `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
  - **Email (Magic Link)**: Uses the `Resend` provider. It requires `RESEND_API_KEY` and `RESEND_EMAIL_FROM`.
- **Flow**: When a user requests a magic link, the `QuickLinkEmail` function in `libs/email.js` generates the email content, which is then sent via the Resend API using the `sendEmail` utility.
- **Database Integration**: NextAuth uses the `MongoDBAdapter` (from `@auth/mongodb-adapter`) to persist user and session data.

## Billing (Stripe)
The billing integration is handled directly via Stripe's API within specific routes in `app/api/billing/`.

### Key Components
- **Stripe SDK**: The `stripe` library is used directly in server-side routes to interact with the Stripe API.
- **Checkout**: The `/api/billing/create-checkout/route.js` creates a Stripe Checkout session. It supports `monthly` (subscription mode) and `lifetime` (payment mode) options.
- **Customer Portal**: The `/api/billing/create-portal/route.js` generates a session for the Stripe Customer Portal, allowing users to manage their subscriptions or payments.
- **Webhooks**: The `/api/billing/webhook/route.js` handles asynchronous events from Stripe. It verifies the signature using `STRIPE_WEBHOOK_SECRET`.

### Workflow
1. User initiates checkout via the `ButtonCheckout` component.
2. The server creates a Checkout Session using `STRIPE_PRICE_ID` (for monthly) or `STRIPE_PRICE_ID_LIFETIME` (for lifetime).
3. Upon success, Stripe sends webhooks:
   - `checkout.session.completed`: Updates the user's `hasAccess` to `true` and stores their Stripe `customerId` in the database.
   - `customer.subscription.deleted`: Revokes access by setting `hasAccess` to `false`.

## Database (User Model)
The `User` schema (defined in `libs/model.js` and used in `models/User.js`) includes the following billing-related fields:
- `hasAccess`: Boolean indicating if the user has active access to the service.
- `customerId`: The Stripe Customer ID (used to link the user to their Stripe profile).
- `planId`: Optional field to track the specific plan the user is on.

## Emails (Resend)
Used for authentication and periodic updates via `libs/email.js`:
- **Auth Magic Links**: Sent via `QuickLinkEmail`.
- **Weekly Digests**: Sent via `WeeklyDigestEmail` (e.g., for board stats).
- **Note**: This boilerplate does not currently include built-in welcome or payment confirmation emails; these are typically handled via Stripe's automatic customer emails or custom implementations.
