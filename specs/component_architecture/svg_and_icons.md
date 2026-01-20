# SVG and Icons

The project avoids heavy icon libraries (like FontAwesome or Lucide dependencies) to keep the bundle size minimal and the design fully customizable.

## 1. Implementation (`/components/svg`)
Icons are stored as simple React functional components that return an optimized SVG path. They accept standard props like `className` for easy sizing and coloring via Tailwind.

## 2. The `Icon.js` Component
A centralized wrapper in `/components/icon` handles:
- Proper `viewBox` settings.
- Standardized `strokeWidth` and `lineCap`.
- Dynamic color application via CSS variables.

## 3. Source Strategy
- **Lucide Inspiration**: Most icons are sourced from Lucide.
- **Optimized Storage**: The `scripts/svglogos.js` utility can be used to convert raw SVG code into the structured format required for these components.
- **Customization**: Icons used for branding or unique features are stored in `components/apps/[appName]/` when they aren't part of the shared library.
