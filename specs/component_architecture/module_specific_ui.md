# Module-Specific UI

The project follows a modular UI architecture located in `/components/modules`. This organizes complex features into self-contained directories.

## 1. Example: Boards Module
The feedback boards module demonstrates the recursive complexity of this pattern:
- **`PublicClient.js`**: The main entry point for end-users, coordinating the public list of posts and voting logic.
- **`/dashboard`**: Components for the administrator's view of a board (analytics, management).
- **`/settings`**: A collection of modular forms for configuring board-specific behavior (domain, privacy, appearance).
- **`/ui`**: Small, reusable fragments unique to this module (e.g., Post cards, Vote buttons).

## 2. Shared Principles
- **Isolation**: Components in a module only import from `/libs/modules/[moduleName]` or global primitives.
- **Configuration Aware**: Module components check the `settings.json` object to determine visibility and behavior (e.g., whether to show a "Guest Voting" button).
- **State Management**: Complex modules often have their own internal contexts (if needed) but primarily rely on the global `WrapperAuth` and `WrapperStyling` for core state.
