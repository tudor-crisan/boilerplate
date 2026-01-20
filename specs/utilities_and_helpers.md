# Utilities and Helpers

The `/libs` directory contains the project's shared logic, providing a foundation of consistent behavior for all white-labeled applications.

## 1. Server-Side Utilities (`utils.server.js`)

- **Standard Responses**: `responseSuccess` and `responseError` ensure the frontend always receives data in the same JSON format.
- **Security**:
  - `validateEmail`: Specialized Zod-based validation that blocks disposable email domains and "+" aliases.
  - `generateSlug`: Sanitizes and turns strings into URL-safe slugs.
- **Mongoose Support**: `cleanObject` handles the conversion of Mongoose documents into plain JSON to avoid serialization issues in Next.js Server Components.
- **Mocking Strategy**: `responseMock` uses the configuration in `settings.json` to simulate real API responses during prototyping.

## 2. Client-Side Utilities (`utils.client.js`)

- **Styling**: `cn` (Classname utility) merges Tailwind classes using `clsx` and `twMerge` to prevent utility collisions.
- **Formatting**:
  - `getNameInitials`: Smart extraction of initials for profile avatars.
  - `formatCommentDate`: Standardizes date/time strings for the UI.
- **Identity**: `getClientId` generates a temporary, persistence-optional ID to track guest interactions (like votes) without requiring a full login.

## 3. SEO and Metadata (`seo.js`)

The `getMetadata` function is the project's "SEO Engine":

- **Templating**: It supports dynamic placeholders (e.g., `{appName}`, `{seoTagline}`) defined in the global settings.
- **Automatic Tags**: Generates the complete suite of Meta, OpenGraph (OG), and Twitter tags based on the current context (e.g., individual blog posts or board pages).

## 4. Graphics and Assets (`image.js`)

- **Image Manipulation**: `getCroppedImg` provides a robust, canvas-based solution for user-uploaded profile pictures and logos.
- **Dynamic Logos**: `generateLogoBase64` (in `utils.server.js`) uses the `logos.js` lists and the active `styling.json` configuration to generate application logos on-the-fly. This allows the primary brand color to be changed in configuration and reflected instantly in the logo.
