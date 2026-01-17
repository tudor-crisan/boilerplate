import { defaultBlog, defaultSetting as settings } from "@/libs/defaults";

export default function sitemap() {
  const baseUrl = `https://${settings.website}`;

  // Base routes
  const routes = ["", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  // Article routes
  const articleRoutes = defaultBlog.articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.publishedAt,
  }));

  // Category routes
  const categoryRoutes = defaultBlog.categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...articleRoutes, ...categoryRoutes];
}
