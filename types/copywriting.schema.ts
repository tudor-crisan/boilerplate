import { z } from "zod";
import { MenuItemSchema, ButtonSchema, LinkSchema } from "./common.schema";

/**
 * Zod Schema for Section Header.
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
 * Zod Schema for Pricing Plan details.
 */
export const PricingPlanSchema = z.object({
  price: z.string().describe("Price display string, e.g. '$19'"),
  period: z.string().describe("Billing period, e.g. '/month'"),
  label: z.string().describe("Plan label, e.g. 'Monthly'"),
  benefits: z.string().optional().describe("Short benefits text."),
});

/**
 * Zod Schema for Pricing Section.
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
  formattedPlans: z.object({
    monthly: PricingPlanSchema.optional(),
    lifetime: PricingPlanSchema.optional(),
  }).describe("Configured pricing plans."),
  button: ButtonSchema.optional().describe("Call to action button."),
  features: z
    .array(z.string())
    .min(1, "At least one feature is required.")
    .describe("List of features included (general or shared).")
    .optional(),
});

/**
 * Zod Schema for Blog Section (Landing Page).
 */
export const SectionBlogSchema = z.object({
  label: z.string().describe("Section label."),
  headline: z.string().describe("Section headline."),
  description: z.string().optional().describe("Supporting text for the blog section."),
  button: ButtonSchema.optional().describe("Link to the full blog."),
});

/**
 * Zod Schema for Question Item.
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
 * Zod Schema for Footer Menu Column.
 */
export const FooterMenuSchema = z.object({
  title: z.string().describe("Menu column title."),
  links: z.array(LinkSchema).describe("List of links in the column."),
});

/**
 * Zod Schema for Footer Section.
 */
export const SectionFooterSchema = z.object({
  brand: z
    .object({
      rights: z.string().describe("Copyright text."),
    })
    .optional(),
  menus: z.array(FooterMenuSchema).describe("Footer navigation menus."),
  socials: z
    .object({
      label: z.string().describe("Label for social links section."),
    })
    .optional(),
});

/**
 * Main Landing Page Config Schema.
 */
export const CopywritingSchema = z.object({
  SectionHeader: SectionHeaderSchema.partial(),
  SectionHero: SectionHeroSchema.partial(),
  SectionPricing: SectionPricingSchema.partial(),
  SectionBlog: SectionBlogSchema.partial(),
  SectionFAQ: SectionFAQSchema.partial(),
  SectionFooter: SectionFooterSchema.partial(),
});

// Export inferred Types for usage in TypeScript code
export type Copywriting = z.infer<typeof CopywritingSchema>;
export type SectionHeader = z.infer<typeof SectionHeaderSchema>;
export type SectionHero = z.infer<typeof SectionHeroSchema>;
export type SectionPricing = z.infer<typeof SectionPricingSchema>;
export type SectionBlog = z.infer<typeof SectionBlogSchema>;
export type SectionFAQ = z.infer<typeof SectionFAQSchema>;
export type PricingPlan = z.infer<typeof PricingPlanSchema>;
