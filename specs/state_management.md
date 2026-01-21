# State Management and Data Lifecycle

Understanding how data flows through the boilerplate is essential for mastering the multi-tenant architecture.

## 1. The Data Hierarchy

State is managed in layers, starting from static files and moving into real-time React context:

1. **Static Source (`/data/modules/*.json`)**: The base configuration for each app instance.
2. **Registry (`/lists/*.js`)**: Global registry of possible themes, fonts, and application targets.
3. **Defaults Layer (`/libs/defaults.js`)**: Merges the JSON config with hardcoded defaults to ensure the app never breaks if a config field is missing.
4. **Context Layer (`/context`)**: The final destination for the merged configuration.

## 2. Core Contexts

### `ContextStyling`

Injects design tokens (colors, rounding, fonts) into the entire component tree. It is the primary consumer of `styling.json`.

### `ContextAuth`

Broadened by `WrapperAuth`, it holds the current user session and the `user` document from MongoDB. It also manages "Optimistic Updates"—if a user changes their profile theme, this context updates instantly to refresh the UI without a page reload.

### `ContextVisual` and `ContextCopywriting`

Specialized contexts that hold the visibility flags (`visual.json`) and text content (`copywriting.json`). This allows components to "ask" the context if they should be visible or what text they should display.

## 3. Data Flow Example: Branding

1. A developer changes the `primaryColor` in `styling.json`.
2. The `WrapperStyling` detects the change (or reloads the config).
3. The `ContextStyling` updates the CSS variables in the DOM.
4. The [Input System](component_architecture/input_system.md) and [Common Primitives](component_architecture/common_primitives.md) instantly change their appearance because they consume these CSS variables.

## 4. Client vs. Server State

- **Server State**: Managed primarily via Next.js Server Components and direct database fetches in `layout.js` or `page.js`.
- **Client State**: Used for interactivity (forms, modals, real-time shuffling) and managed via the hooks in `/hooks`.
