import { z } from "zod";

/**
 * Zod Schema for General configuration.
 */
export const StylingGeneralSchema = z.object({
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
export const StylingSectionHeroSchema = z.object({
  headline: z.string().describe("CSS classes for hero headline."),
  paragraph: z.string().describe("CSS classes for hero paragraph."),
  textalign: z.string().describe("CSS classes for text alignment."),
});

/**
 * Zod Schema for SectionFAQ.
 */
export const StylingSectionFAQSchema = z.object({
  positioning: z
    .string()
    .optional()
    .describe("CSS classes for FAQ positioning."),
  spacing: z.string().describe("CSS classes for FAQ spacing."),
});

/**
 * Zod Schema for SectionFooter.
 */
export const StylingSectionFooterSchema = z.object({
  section: z.string().describe("CSS classes for footer section background/text."),
  container: z.string().describe("CSS classes for footer container."),
  spacing: z.string().describe("CSS classes for footer spacing."),
  textalign: z.string().describe("CSS classes for footer text alignment."),
});

/**
 * Main Styling Config Schema.
 */
/**
 * Zod Schema for SectionHeader.
 */
export const StylingSectionHeaderSchema = z.object({
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
  general: StylingGeneralSchema.partial(),
  SectionHeader: StylingSectionHeaderSchema.partial(),
  SectionHero: StylingSectionHeroSchema.partial(),
  SectionFAQ: StylingSectionFAQSchema.partial(),
  SectionFooter: StylingSectionFooterSchema.partial(),
});

// Export inferred Types for usage in TypeScript code
export type Styling = z.infer<typeof StylingSchema>;

export type StylingGeneral = z.infer<typeof StylingGeneralSchema>;
export type StylingSectionHero = z.infer<typeof StylingSectionHeroSchema>;
export type StylingSectionFAQ = z.infer<typeof StylingSectionFAQSchema>;
