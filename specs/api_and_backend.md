# API and Backend Logic

The project's backend is built on Next.js Route Handlers, utilizing a standardized middleware pattern to ensure security, rate limiting, and consistent data responses across all apps.

## 1. The Standardized Handler (`withApiHandler`)

Instead of raw route handlers, most API endpoints use the `withApiHandler` higher-order function. This ensures:

- **Mocking**: Routes can return mock data defined in `settings.json` during development.
- **Database**: Automatic connection to MongoDB before logic execution.
- **Security**: Centralized checks for authentication (`session`) and subscription status (`hasAccess`).
- **Rate Limiting**: Granular control over how often users can perform actions like creating posts or sending emails.

## 2. API Structure

Endpoints are organized by their feature area:

- **`/app/api/auth`**: NextAuth configuration and providers.
- **`/app/api/billing`**: Stripe checkout, webhooks, and customer portal logic.
- **`/app/api/modules`**: Domain-specific logic (e.g., feedback boards, posts, comments).
- **`/app/api/user`**: Profile updates and user-specific data management.

## 3. Communication Patterns

### Client-to-Server

The project uses `axios` for client-side API calls. A central `clientApi` instance handles:

- **Client Identity**: Automatically attaches an `x-client-id` header to track anonymous interactions (like guest votes).
- **Error Handling**: Standardized mapping of HTTP error codes to user-friendly toast notifications.

### Server-to-Client

Responses follow a strict format (handled by `responseSuccess` and `responseError` in `libs/utils.server`):

```json
{
  "message": "Human readable feedback",
  "data": { "foo": "bar" },
  "inputErrors": { "field": "Must be 5 chars" }
}
```

## 4. Detailed Documentation

- [API Handler Pattern](api_and_backend/api_handler_pattern.md): Deep dive into the `withApiHandler` HOF.
- [Modular Backend Logic](api_and_backend/modular_backend_logic.md): Guide to the modular structure in `/api/modules`.
- [Database and Models](api_and_backend/database_and_models.md): How MongoDB and Mongoose are integrated.
- [Streaming and Real-Time](api_and_backend/streaming_and_realtime.md): (NEW) Documentation for SSE and MongoDB Change Streams.
