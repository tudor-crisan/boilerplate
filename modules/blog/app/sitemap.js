import {
  defaultBlog,
  defaultHelp,
  defaultSetting as settings,
} from "@/modules/general/libs/defaults";

export default function sitemap() {
  const baseUrl = `https://${settings.website}`;

  // Base routes
  const routes = ["", "/blog", "/help", "/privacy", "/support", "/terms"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString().split("T")[0],
    }),
  );

  // Article routes
  const articleRoutes = (defaultBlog?.articles || []).map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.publishedAt,
  }));

  // Category routes
  const categoryRoutes = (defaultBlog?.categories || []).map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  // Help routes
  const helpRoutes = (defaultHelp?.articles || []).map((article) => ({
    url: `${baseUrl}${settings.paths.help.source}/${article.id}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...articleRoutes, ...categoryRoutes, ...helpRoutes];
}
