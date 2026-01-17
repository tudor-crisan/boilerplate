import { z } from "zod";
import { ImageSchema } from "./common.schema";

/**
 * Zod Schema for Blog Category.
 */
export const BlogCategorySchema = z.object({
  slug: z.string().min(1, "Slug is required").describe("URL slug for the category."),
  title: z.string().describe("Full title of the category."),
  titleShort: z.string().describe("Short title for navigation/badges."),
  description: z.string().describe("Description of the category."),
  descriptionShort: z.string().describe("Short description for cards."),
});

/**
 * Zod Schema for Blog Article.
 */
export const BlogArticleSchema = z.object({
  slug: z.string().min(1, "Slug is required").describe("URL slug for the article."),
  title: z.string().describe("Title of the article."),
  description: z.string().describe("Brief description/excerpt of the article."),
  categorySlugs: z
    .array(z.string())
    .describe("List of category slugs this article belongs to."),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.")
    .describe("Publication date."),
  image: ImageSchema.describe("Article feature image."),
  content: z.string().describe("HTML content of the article."),
});

/**
 * Main Blog Config Schema.
 */
export const BlogSchema = z.object({
  title: z.string().describe("Blog main title."),
  description: z.string().describe("Blog main description."),
  image: z.string().optional().describe("Blog cover image path."),
  categories: z.array(BlogCategorySchema).describe("List of blog categories."),
  articles: z.array(BlogArticleSchema).describe("List of blog articles."),
});

// Export inferred Types for usage in TypeScript code
export type Blog = z.infer<typeof BlogSchema>;
export type BlogCategory = z.infer<typeof BlogCategorySchema>;
export type BlogArticle = z.infer<typeof BlogArticleSchema>;
