# Modular Backend Logic

The project's API logic follows the "Module" architecture, matching the structure of `/components/modules` and `data/modules`.

## 1. Structure (`/app/api/modules`)

Each module contains sub-directories for its resources, with a `route.js` file for each resource:

- **Example: Boards Module**
  - `/api/modules/boards/post/route.js`: Handles POST (create), DELETE, and GET for user posts.
  - `/api/modules/boards/comment/route.js`: Manages feedback comments and threading.
  - `/api/modules/boards/vote/route.js`: Handles logic for upvoting and guest participation.

## 2. Key Features

### Input Validation

Routes extract validation messages and error codes directly from `settings.json` based on their `TYPE`. This ensures that updating a validation message doesn't require touching code.

### Logic Isolation

Modules often import specialized helpers from `libs/modules/[moduleName]`.

- **Example**: `trackEvent` and `createNotification` are imported from the `analytics` helper to keep the route handler focused on request/response orchestration.

### Cross-App Filtering

Note that during deployment, the [Deployment Flow](../infrastructure_and_deployment/deployment_flow.md) may remove entire module API folders if they aren't used by the target application, keeping the production backend clean and isolated.
