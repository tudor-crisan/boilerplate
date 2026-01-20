# Common UI Primitives

The `/components/common` directory contains the project's building blocks. These components are designed to be extremely reusable and design-agnostic.

## 1. Layout Helpers
- **`Flex.js`**: Standardized flexbox container. Sourced from `styling.json` to ensure alignment consistency.
- **`Vertical.js`**: A vertical stack with consistent spacing defaults.
- **`Grid.js`**: Responsive grid wrapper.
- **`Columns.js`**: Multi-column layout helper for landing pages.

## 2. Dynamic Primitives
- **`Title.js`**: A polymorphic heading component. Accepts a `tag` prop (h1-h6) but maintains a consistent, bold design system appearance.
- **`Paragraph.js`**: Standardized text formatting for long-form content.
- **`Divider.js`**: Consistent spacing and border lines.

## 3. Interactive Primitives
- **`Modal.js`**: A robust, accessible modal wrapper that uses the browser's native `<dialog>` element where possible.
- **`Toaster.js`**: Centralized configuration for `react-hot-toast` notifications.
- **`Tooltip.js`**: Lightweight tooltip implementation.
- **`Accordion.js`**: FAQ and collapsible content patterns.

## 4. Complex Primitives
- **`Upload.js` & `ImageCropper.js`**: Standardized handles for file management and image manipulation with cropping and preview functionality.
- **`FilterBar.js`**: Reusable pattern for list filtering across different resource types (blog, posts, etc).
