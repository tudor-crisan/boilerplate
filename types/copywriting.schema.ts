import { z } from "zod";

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
  appName: z
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
export const CopywritingSchema = z.object({
  SectionHeader: SectionHeaderSchema,
  SectionHero: SectionHeroSchema,
  SectionPricing: SectionPricingSchema,
  SectionFAQ: SectionFAQSchema,
});

// Export inferred Types for usage in TypeScript code
export type Copywriting = z.infer<typeof CopywritingSchema>;
export type SectionHeader = z.infer<typeof SectionHeaderSchema>;
export type SectionHero = z.infer<typeof SectionHeroSchema>;
export type SectionPricing = z.infer<typeof SectionPricingSchema>;
export type SectionFAQ = z.infer<typeof SectionFAQSchema>;
