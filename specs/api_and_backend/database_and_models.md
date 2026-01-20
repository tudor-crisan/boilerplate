# Database and Models

The project uses MongoDB as its primary data store, with Mongoose providing a structured, schema-based layer for data interaction.

## 1. Connection Management (`/libs/mongoose.js`)
The `connectMongo` utility handles:
- Connection pooling for Next.js.
- Buffering control.
- Event logging for connection state.

## 2. Model Structure (`/models`)
Models are organized into shared and module-specific categories:
- **Shared Models**: `User.js` (authentication and billing) and `Activity.js` (audit logs).
- **Module Models (`/models/modules`)**: House resources like `Board`, `Post`, and `Comment`.

## 3. Schema Strategy
Schemas utilize `zod` for build-time validation, but Mongoose enforces the data structure in the database.
- **`userSchemaConfig`**: Defined in `libs/model.js` to share the common user schema across the authentication adapter and the custom User model.
- **HasAccess**: A critical field on the `User` model, updated by Stripe webhooks and checked by the `withApiHandler` to gate premium features.

## 4. Analytics and Aggregation
The backend frequently uses MongoDB Aggregation Pipelines to perform high-performance queries (e.g., calculating vote counts and comment counts in a single fetch) instead of multiple database hits.
