# Form Development

The project uses a configuration-driven form system to minimize repetitive code and ensure consistent behavior for data submission.

## 1. `FormCreate.js`
This is a generic, high-level component that dynamically renders forms based on configuration.
- **Data-Driven**: It accepts a `type` prop which maps to a key in `settings.json` (e.g., `Post`, `Board`).
- **Dynamic Rendering**: It automatically maps field types (`select`, `textarea`, `text`) to the corresponding design primitives.
- **Handling State**: It utilizes the `useForm` hook for input management and `useApiRequest` for standardized server communication.

## 2. Configuration Pattern
Forms are defined in the `forms` object of `settings.json`:
```json
"Post": {
  "formConfig": {
    "title": "Create a Post",
    "apiUrl": "/api/modules/boards/post",
    "button": "Publish"
  },
  "inputsConfig": {
    "title": { "type": "text", "label": "Title", "placeholder": "Enter title...", "required": true },
    "description": { "type": "textarea", "label": "Details", "rows": 5 }
  }
}
```

## 3. Benefits of the System
- **Validation Sync**: Error messages returned by the backend (keyed to input names) are automatically mapped back to the UI fields.
- **Real-time Styling**: The form container and buttons automatically inherit the active design tokens from `styling.json`.
- **Prototyping**: The `MockForms` component integrated into `FormCreate` allows developers to test form submissions with fake data instantly.
