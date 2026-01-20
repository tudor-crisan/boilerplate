# SEO and Metadata

The project uses a centralized and highly configurable SEO engine to ensure consistent search engine optimization and social media presence across all white-labeled applications.

## 1. The SEO Engine (`libs/seo.js`)

The heart of the system is the `getMetadata` function. It standardizes the generation of Next.js metadata objects.

### How it works:
1. **Targeting**: It looks up a template in the `settings.json` file's `metadata` block using a dot-notation path (e.g., `modules.blog.article`).
2. **Templating**: It performs dynamic placeholder replacement. Any variable passed in (like `appName` or a dynamic article `title`) replaces markers in the format `{variableName}` within the template.
3. **Defaults**: It automatically falls back to global SEO settings (`seo` block in `settings.json`) if specific values are missing.

## 2. Configuration (`settings.json`)

The `metadata` block in the global settings defines the structure for different page types:
- **`home`**: Global defaults for the landing page.
- **`modules.blog`**: Specific templates for the blog index, categories, and individual articles.
- **`modules.boards`**: Templates for feedback boards and dashboard pages.

## 3. Implementation in Pages

Every page that requires SEO uses the Next.js `generateMetadata` export to call the engine.

### Example: Blog Article (`app/blog/[articleId]/page.js`)
```javascript
export async function generateMetadata({ params }) {
  const article = // ... fetch article
  return getMetadata("modules.blog.article", {
    title: article.title,
    description: article.description,
    seoImage: article.image.urlRelative,
    canonicalUrlRelative: `/blog/${article.slug}`,
    ogType: "article",
    publishedTime: article.publishedAt,
    author: settings.business?.name || settings.appName,
  });
}
```

## 4. Standardized Output

The engine automatically generates a full suite of tags:
- **Basic Tags**: `title`, `description`, `canonical` URL.
- **OpenGraph (OG)**: Optimized for Facebook/LinkedIn sharing, including dynamic images and types (website vs. article).
- **Twitter Cards**: Standardized "summary_large_image" format.
- **Robots**: Default instructions for indexing and following links (configurable via variables if needed).
- **Structured Data**: When used with components like `BlogSchemaArticle`, it also injects JSON-LD to help search engines understand the content type (e.g., Article, FAQ, or SoftwareApplication).

## 5. Summary of SEO Features
- **Canonical URLs**: Automatically handled to prevent duplicate content issues across multiple domains.
- **Dynamic Images**: Supports relative or absolute image URLs for social sharing.
- **Automation**: Once templates are set in `settings.json`, developers only need to pass the data, and the engine handles the technical tag generation.
