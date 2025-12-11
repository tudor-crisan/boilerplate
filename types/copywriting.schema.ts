import { z } from "zod";

/**
 * Zod Schema for Metadata.
 * Validation rules:
 * - title: min 10, max 60 characters.
 * - description: min 50, max 160 characters.
 */
export const MetadataSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters long for SEO.")
    .max(60, "Title must be at most 60 characters long for SEO.")
    .describe("The primary title of the page."),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters.")
    .max(160, "Description must be at most 160 characters for SEO meta tags.")
    .describe("A short description of the page content."),
});

/**
 * Zod Schema for Product Hunt content.
 * Validation rules:
 * - taglines: non-empty array, max 5 items.
 */
export const ProductHuntSchema = z.object({
  taglines: z
    .array(z.string().min(1, "Tagline cannot be empty."))
    .min(1, "At least one tagline is required.")
    .max(5, "Maximum of 5 taglines allowed.")
    .describe("A list of catchy taglines to display."),
});

/**
 * Zod Schema for Menu Item.
 * Validation rules:
 * - label: max 20 characters.
 * - path: must start with /, #, or http.
 */
export const MenuItemSchema = z.object({
  label: z
    .string()
    .max(20, "Menu label must be 20 characters or less.")
    .describe("Text to display for the link."),
  path: z
    .string()
    .regex(/^(\/|#|http)/, "Path must start with '/', '#', or 'http'.")
    .describe('URL or anchor path (e.g., "#pricing").'),
});

/**
 * Zod Schema for Section Header.
 * Validation rules:
 * - name: max 30 characters.
 * - menus: max 7 items.
 */
export const SectionHeaderSchema = z.object({
  name: z
    .string()
    .max(30, "App name must be 30 characters or less.")
    .describe("The name of the application displayed in the header."),
  menus: z
    .array(MenuItemSchema)
    .max(7, "Maximum of 7 menu items allowed to keep navigation simple.")
    .describe("Navigation menu items."),
});

/**
 * Zod Schema for Section Hero.
 * Validation rules:
 * - headline: max 80 characters.
 * - paragraph: max 300 characters.
 */
export const SectionHeroSchema = z.object({
  headline: z
    .string()
    .max(80, "Headline must be 80 characters or less.")
    .describe("The main H1 headline."),
  paragraph: z
    .string()
    .max(300, "Paragraph must be 300 characters or less.")
    .describe("Supporting paragraph text."),
});

/**
 * Zod Schema for Pricing Section.
 * Validation rules:
 * - label: max 20 characters.
 * - headline: max 60 characters.
 * - features: at least 1 feature.
 */
export const SectionPricingSchema = z.object({
  label: z
    .string()
    .max(20, "Label must be 20 characters or less.")
    .describe("Section label or small eyebrow text."),
  headline: z
    .string()
    .max(60, "Headline must be 60 characters or less.")
    .describe("Main headline for pricing."),
  price: z.string().describe("Price display string, e.g. '$19'"),
  period: z.string().describe("Billing period, e.g. '/month'"),
  features: z
    .array(z.string())
    .min(1, "At least one feature is required.")
    .describe("List of features included in the plan."),
});

/**
 * Zod Schema for Question Item.
 * Validation rules:
 * - question: max 100 characters.
 * - answer: max 500 characters.
 */
export const QuestionItemSchema = z.object({
  question: z
    .string()
    .max(100, "Question must be 100 characters or less.")
    .describe("The question being asked."),
  answer: z
    .string()
    .max(500, "Answer must be 500 characters or less.")
    .describe("The answer to the question."),
});

/**
 * Zod Schema for FAQ Section.
 * Validation rules:
 * - questions: at least 1 question.
 */
export const SectionFAQSchema = z.object({
  label: z.string().describe("Section label."),
  headline: z.string().describe("Section headline."),
  questions: z
    .array(QuestionItemSchema)
    .min(1, "At least one question is required.")
    .describe("List of questions and answers."),
});

/**
 * Main Landing Page Config Schema.
 * Combines all section schemas.
 */
export const LandingPageConfigSchema = z.object({
  Metadata: MetadataSchema,
  ProductHunt: ProductHuntSchema,
  SectionHeader: SectionHeaderSchema,
  SectionHero: SectionHeroSchema,
  SectionPricing: SectionPricingSchema,
  SectionFAQ: SectionFAQSchema,
});

// Export inferred Types for usage in TypeScript code
export type LandingPageConfig = z.infer<typeof LandingPageConfigSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type ProductHunt = z.infer<typeof ProductHuntSchema>;
export type SectionHeader = z.infer<typeof SectionHeaderSchema>;
export type SectionHero = z.infer<typeof SectionHeroSchema>;
export type SectionPricing = z.infer<typeof SectionPricingSchema>;
export type SectionFAQ = z.infer<typeof SectionFAQSchema>;
