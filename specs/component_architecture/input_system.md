# Input Primitive System

The `/components/input` (and related folders like `/select`, `/textarea`) directory contains heavily decorated input primitives that standardize the "look and feel" of data entry.

## 1. Core Decorators
The base `Input.js` component is more than a simple `<input>` tag. It provides several automated features:
- **Character Counting**: Automatically renders a counter if `maxLength` is provided.
- **Clear Actions**: Supports an optional "X" button to reset the field value instantly.
- **Icon Support**: Standardized slot for Svg components on the left side of the input.
- **Error States**: Dynamic application of `input-error` classes (from DaisyUI) based on backend feedback.

## 2. Specialized Primitives
- **`InputCopy.js`**: Includes a one-click "Copy to Clipboard" button (useful for API keys or share links).
- **`InputToggle.js` / `InputCheckbox.js`**: Styling wrappers for boolean inputs that match the project's design system.
- **`InputRange.js`**: Custom-styled slider for numeric configuration.

## 3. Integration with Styling
All inputs use the `cn` utility to merge:
- **Default Tokens**: Sourced from `styling.json` via the `useStyling` hook.
- **Ad-hoc Overrides**: Any className passed as a prop from higher-level components like `FormCreate`.
