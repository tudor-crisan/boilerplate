import { z } from "zod";

/**
 * Zod Schema for Logo SVG.
 */
export const LogoSvgSchema = z.object({
  path: z.array(z.string()).describe("Array of SVG path strings."),
  circle: z
    .array(z.string())
    .optional()
    .describe("Array of SVG circle strings."),
  rect: z.array(z.string()).optional().describe("Array of SVG rect strings."),
});

/**
 * Zod Schema for Logo Stroke settings.
 */
export const LogoStrokeSchema = z.object({
  width: z.number().describe("Stroke width."),
  linecap: z.string().describe("Stroke linecap."),
  linejoin: z.string().describe("Stroke linejoin."),
});

/**
 * Zod Schema for Logo configuration.
 */
export const LogoSchema = z.object({
  showLogo: z.boolean().describe("Whether to show the logo."),
  showText: z.boolean().describe("Whether to show the logo text."),
  svg: LogoSvgSchema,
  viewBox: z.string().describe("SVG viewBox attribute."),
  wrapperStyle: z.string().describe("CSS classes for logo wrapper."),
  svgStyle: z.string().describe("CSS classes for SVG element."),
  stroke: LogoStrokeSchema,
});

/**
 * Zod Schema for Favicon configuration.
 */
export const FaviconSchema = z.object({
  type: z.string().describe("Favicon mime type."),
  sizes: z.string().describe("Favicon sizes attribute."),
  href: z.string().describe("Favicon href path."),
});

/**
 * Zod Schema for Homepage configuration.
 */
export const HomepageSchema = z.object({
  sections: z
    .array(z.string())
    .describe("List of section component names to render."),
});

/**
 * Zod Schema for General configuration.
 */
export const GeneralSchema = z.object({
  language: z.string().describe("HTML lang attribute."),
  html: z.string().describe("CSS classes for html element."),
  body: z.string().describe("CSS classes for body element."),
  wrapper: z.string().describe("CSS classes for main wrapper."),
  spacing: z.string().describe("General spacing utility classes."),
  label: z.string().describe("CSS classes for labels."),
  headline: z.string().describe("CSS classes for headlines."),
});

/**
 * Zod Schema for SectionHero Image.
 */
export const HeroImageSchema = z.object({
  showImage: z.boolean().describe("Whether to show the hero image."),
  path: z.string().describe("Path to the image."),
  alt: z.string().describe("Alt text for the image."),
  width: z.number().describe("Image width."),
  height: z.number().describe("Image height."),
  wrapper: z.string().describe("CSS classes for image wrapper."),
  style: z.string().describe("Additional CSS styles."),
});

/**
 * Zod Schema for SectionHero Video.
 */
export const HeroVideoSchema = z.object({
  showVideo: z.boolean().describe("Whether to show the hero video."),
  path: z.string().describe("Path to the video."),
  alt: z.string().describe("Alt text for the video."),
  width: z.number().describe("Video width."),
  height: z.number().describe("Video height."),
  wrapper: z.string().describe("CSS classes for video wrapper."),
  style: z.string().describe("Additional CSS styles."),
});

/**
 * Zod Schema for SectionHero.
 */
export const SectionHeroSchema = z.object({
  headline: z.string().describe("CSS classes for hero headline."),
  paragraph: z.string().describe("CSS classes for hero paragraph."),
  positioning: z.string().describe("CSS classes for content positioning."),
  image: HeroImageSchema,
  video: HeroVideoSchema,
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
export const StylingSchema = z.object({
  theme: z.string().describe("DaisyUI theme name."),
  font: z.string().describe("Font family name."),
  roundness: z.array(z.string()).describe("Roundness utility classes."),
  shadows: z.array(z.string()).describe("Shadow utility classes."),
  borders: z.array(z.string()).describe("Border utility classes."),
  links: z.array(z.string()).describe("Link utility classes."),
  logo: LogoSchema,
  favicon: FaviconSchema,
  homepage: HomepageSchema,
  general: GeneralSchema,
  SectionHero: SectionHeroSchema,
  SectionFAQ: SectionFAQSchema,
});

// Export inferred Types for usage in TypeScript code
export type Styling = z.infer<typeof StylingSchema>;
export type Logo = z.infer<typeof LogoSchema>;
export type Favicon = z.infer<typeof FaviconSchema>;
export type Homepage = z.infer<typeof HomepageSchema>;
export type General = z.infer<typeof GeneralSchema>;
export type SectionHero = z.infer<typeof SectionHeroSchema>;
export type SectionFAQ = z.infer<typeof SectionFAQSchema>;
