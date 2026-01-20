# Component Architecture

The project's component architecture is designed for a multi-tenant, white-labeled environment, where the same UI code can change its appearance and behavior based on configuration.

## 1. Components Hierarchy
UI components are organized into a strict hierarchy:
1. **Wrappers (`/components/wrapper`)**: Global context providers that inject styling, authentication, and layout rules.
2. **Common Primitives (`/components/common`)**: Shared, design-consistent building blocks (Flex, Grid, Title, Modal).
3. **Module-Specific UI**: Feature-specific components (`/components/blog`, `/components/dashboard`).
4. **App-Specific Overrides (`/components/apps`)**: Components that are unique to a single application in the boilerplate.

## 2. Core Patterns

### The Wrapper Chain
The application is wrapped in a chain of providers that coordinate the "look and feel":
- **`WrapperStyling`**: Injects the design tokens from `styling.json` into a React context.
- **`WrapperAuth`**: Manages the user session and handles optimistic profile updates (including real-time styling changes).
- **`WrapperBody`**: Ensures standard responsive padding and alignment across all pages.

### Design Consistency
Instead of hardcoding Tailwind classes, "Common" components often source their defaults from the `styling` context:
```javascript
// Example: Flex.js sources its alignment from the config
const { styling } = useStyling();
return <div className={styling.flex.center}>{children}</div>;
```

## 3. Detailed Documentation
- [Wrappers and Context](component_architecture/wrappers_and_context.md): Deep dive into the state management layer.
- [Common UI Primitives](component_architecture/common_primitives.md): Guide to the shared design-system components.
- [Input Primitive System](component_architecture/input_system.md): Detailed guide to decorated input components.
- [Form Development](component_architecture/form_development.md): How configuration-driven forms work.
- [Page Composition](component_architecture/page_composition.md): Standardizing layouts with page wrappers.
- [Module-Specific UI](component_architecture/module_specific_ui.md): Organization of complex features.
- [SVG and Icons](component_architecture/svg_and_icons.md): How icons are handled without external libraries.
