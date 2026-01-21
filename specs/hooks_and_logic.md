# Hooks and Custom Logic

Custom hooks in `/hooks` abstract away complex, stateful logic, allowing UI components to remain declarative and focused on presentation.

## 1. Infrastructure Hooks

- **`useApiRequest.js`**: Orchestrates the standard `loading`/`request` lifecycle for server communication. Includes built-in error handling and success/error callbacks.
- **`useForm.js`**: Manages local input state, focus tracking, and acts as a bridge for backend validation errors. It's the engine behind the [Form Development](component_architecture/form_development.md) system.
- **`useLocalStorage.js`**: React-safe wrapper for persistent client-side storage, used heavily for caching user preferences and styling tokens.

## 2. Feature Hooks

- **`useSort.js`**: A generic sorting engine used across analytics and list views. It handles the logic of switching directions and keys independently of the data type.
- **`useAnalyticsRange.js`**: Manages the date-range state for charts and stats, syncing the UI selection with API query parameters.
- **`useUpload.js`**: Coordinates the file selection, preview, and server-upload process for images.

## 3. Specialized Logic

- **`useStylingRandomizer.js`**: A development-only hook (often triggered by a shuffle event) that rotates through design tokens to test the UI's resilience to different themes.
- **`useAuthError.js`**: Translates cryptic NextAuth error codes into human-readable messages defined in the global settings.

## 4. Module Hooks (`/hooks/modules`)

Domain-specific logic is isolated here. For example, the `boards` module has hooks for handling real-time voting state and guest identity verification.
