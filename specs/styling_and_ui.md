# Styling and UI

The UI is built using a combination of utility-first CSS and a robust component library.

## Design System
- **Tailwind CSS (v4)**: The core styling engine. Configured directly in `app/globals.css` using `@import "tailwindcss"` and `@plugin`. This project utilizes newer Tailwind features like direct CSS variables and improved nesting.
- **DaisyUI (v5.5.8)**: Provides a set of semantic UI components (e.g., buttons, cards, modals) that are styled with Tailwind.
- **`styling.json`**: Located in `/data/modules/`, this file contains project-specific design tokens and utility class groups (e.g., flex patterns) to ensure visual consistency.

## Component Structure (`/components`)
Components are organized logically:
- `ui/`: Fundamental building blocks (Buttons, Inputs, Icons).
- `layout/`: Structural elements (Header, Footer, Navigation).
- `blog/`, `dashboard/`, `modules/`: Target specific feature areas.

## Best Practices
- **Flexbox Utilities**: Often sourced from `styling.json` to maintain consistent spacing and alignment.
- **Conditional Classes**: Handled using the `clsx` and `twMerge` utility functions from `/libs/utils.client.js`.
- **Animations**: Framer Motion is used for subtle transitions and interactive elements.
- **Responsiveness**: Mobile-first approach using responsive Tailwind utilities.

## Custom Icons
SVG icons are centralized in `/components/svg/` to avoid heavy icon dependencies and ensure customizability.
