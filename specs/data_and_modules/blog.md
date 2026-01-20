# Blog Module Configuration

The `blog.json` file in `data/modules/` defines the static content and structure for the application's blog.

## Structure
- `title` & `description`: General metadata for the blog landing page.
- `categories`: An array of category objects, each containing a `slug`, `title`, and `description`.
- `articles`: An array of article objects.

## Article Schema
- `slug`: Unique identifier for the article URL.
- `title` & `description`: For SEO and display.
- `categorySlugs`: Array of slugs linking the article to categories.
- `publishedAt`: Publication date.
- `image`: Object with `src` and `alt` text.
- `content`: HTML content for the article.
