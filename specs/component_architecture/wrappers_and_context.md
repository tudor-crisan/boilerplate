# Wrappers and Context

Wrappers are the structural heart of the project. They don't just provide layout; they orchestrate the entire multi-tenant configuration.

## 1. `WrapperStyling`
- **Role**: Entry point for the design system.
- **State**: Holds the `styling` object (merged from defaults and app-specific JSON).
- **Persistence**: Uses `localStorage` ("styling-config") as a client-side cache to prevent layout shifts during navigation.
- **Shuffle Support**: Listens for the "shuffle-styling" event to allow real-time theme swapping in development.

## 2. `WrapperAuth`
- **Role**: Bridge between NextAuth and the application state.
- **Client Side (`WrapperAuth.client.js`)**: 
  - Provides the `ContextAuth`.
  - Includes `updateProfile`, which handles optimistic UI updates. If a user changes their theme in the dashboard, this wrapper applies it instantly across the whole app.
- **Server Side (`WrapperAuth.server.js`)**: Fetches the initial session from the database and passes it down.

## 3. `WrapperBody` & `WrapperHtml`
- **`WrapperHtml`**: Sets the default DaisyUI theme and standardizes head metadata.
- **`WrapperBody`**: Wraps every page to ensure consistent typography and responsive behavior via global CSS classes.

## 4. `WrapperCopywriting`
- **Role**: Injects the text content into the UI.
- **Pattern**: Most landing page sections import their text directly from the `ContextCopywriting` provider, which is populated by `copywriting.json`.
