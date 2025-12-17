import { z } from "zod";



/**
 * Zod Schema for General configuration.
 */
export const GeneralSchema = z.object({
  language: z.string().describe("HTML lang attribute."),
  html: z.string().describe("CSS classes for html element."),
  body: z.string().describe("CSS classes for body element."),
  container: z.string().describe("CSS classes for main container."),
  wrapper: z.string().optional().describe("CSS classes for main wrapper."), // Keeping optional if used elsewhere or legacy
  spacing: z.string().describe("General spacing utility classes."),
  label: z.string().describe("CSS classes for labels."),
  headline: z.string().optional().describe("CSS classes for headlines."), // Legacy? styling0 has 'title'
  title: z.string().describe("CSS classes for titles."),
});

/**
 * Zod Schema for SectionHero.
 */
export const SectionHeroSchema = z.object({
  headline: z.string().describe("CSS classes for hero headline."),
  paragraph: z.string().describe("CSS classes for hero paragraph."),
  textalign: z.string().describe("CSS classes for text alignment."),
});

/**
 * Zod Schema for SectionFAQ.
 */
export const SectionFAQSchema = z.object({
  positioning: z.string().describe("CSS classes for FAQ positioning."),
});

/**
 * Main Styling Config Schema.
 */
/**
 * Zod Schema for SectionHeader.
 */
export const SectionHeaderSchema = z.object({
  spacing: z.string().describe("CSS classes for header spacing."),
});

/**
 * Main Styling Config Schema.
 */
export const StylingSchema = z.object({
  theme: z.string().describe("DaisyUI theme name."),
  font: z.string().describe("Font family name."),
  roundness: z.array(z.string()).describe("Roundness utility classes."),
  shadows: z.array(z.string()).describe("Shadow utility classes."),
  borders: z.array(z.string()).describe("Border utility classes."),
  links: z.array(z.string()).describe("Link utility classes."),
  general: GeneralSchema,
  SectionHeader: SectionHeaderSchema,
  SectionHero: SectionHeroSchema,
  SectionFAQ: SectionFAQSchema,
});

// Export inferred Types for usage in TypeScript code
export type Styling = z.infer<typeof StylingSchema>;

export type General = z.infer<typeof GeneralSchema>;
export type SectionHero = z.infer<typeof SectionHeroSchema>;
export type SectionFAQ = z.infer<typeof SectionFAQSchema>;
