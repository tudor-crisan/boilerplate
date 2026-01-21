# Page Composition

Page components in `/components/pages` serve as the layout standardizers for the application's different functional areas.

## 1. The Composition Pattern

Instead of repeating boilerplate layouts in every Next.js route, the project uses a "Page Wrapper" pattern.

- **Standardized Elements**: Most page wrappers include the `SectionHeader`, `SectionFooter`, and a `Main` container.
- **Inheritance**: They ensure that the `WrapperStyling` context is active for the entire page subtree.

## 2. Common Page Types

- **`PagesHome.js`**: Standard landing page layout.
- **`PagesBlog.js`**: Specifically tuned for article readability and site navigation.
- **`PagesDashboard.js`**: Includes sidebar navigation and specialized dashboard headers/footers.
- **`PagesAuth.js`**: Minimalist layout centered on authentication forms.

## 3. SEO Integration

These components are designed to work seamlessly with the [SEO implementation](../seo_and_metadata.md). The page wrappers provide the structural skeleton, while the Next.js `generateMetadata` function (used in the routes) provides the individual page data.
