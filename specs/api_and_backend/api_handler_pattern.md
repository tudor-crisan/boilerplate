# API Handler Pattern

The `withApiHandler` function (located in `libs/apiHandler.js`) is the primary guard for the project's backend. It wraps standard Next.js route handlers with cross-cutting concerns.

## 1. Parameters
The HOF accepts a `handler` function and an `options` object:
- `type`: Links the route to a specific form configuration in `settings.json` for validation and mocks.
- `needAuth`: Boolean. If true, the route is protected by NextAuth session checks.
- `needAccess`: Boolean. If true, the route requires the user to have a valid subscription (`hasAccess: true`).
- `rateLimitKey`: Identifies which bucket to use in the rate-limiting engine.

## 2. Execution Flow
1. **Mock Check**: If `isResponseMock(type)` is true, it immediately returns the mock response defined in the configuration, bypassing the database and custom logic.
2. **Rate Limit**: Checks the request against the MongoDB-based rate limiter (tracked by IP and action type) using the `rateLimitKey`.
3. **Database**: Establishes a Mongoose connection.
4. **Auth & Session**: 
   - Fetches the session. 
   - If `needAuth` is true and no session exists, returns a 401.
   - Fetches the user from the database.
   - If `needAccess` is true and `user.hasAccess` is false, returns a 403.
5. **Logic**: Executes the provided `handler`, passing in the `req`, `session`, and `user` for easy consumption.
6. **Error Handling**: Catches all unhandled exceptions and returns a standardized 500 error response.

## 3. Benefits
This pattern keeps the actual business logic in the route handlers clean and focused, as all "boilerplate" security and infrastructure logic is abstracted away.
