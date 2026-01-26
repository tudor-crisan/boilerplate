import { z } from "zod";

/**
 * Zod Schema for Logo SVG.
 */
export const LogoSvgSchema = z.object({
  classname: z.string().describe("CSS classes for SVG element."),
  viewbox: z.string().describe("SVG viewBox attribute."),
  fill: z.string().describe("SVG fill attribute."),
  stroke: z.string().describe("SVG stroke attribute."),
  strokewidth: z.number().describe("SVG stroke-width attribute."),
  strokelinecap: z.string().describe("SVG stroke-linecap attribute."),
  strokelinejoin: z.string().describe("SVG stroke-linejoin attribute."),
});

/**
 * Zod Schema for Logo configuration.
 */
export const LogoSchema = z.object({
  shape: z.string().describe("Shape of the logo container."),
  container: z.string().describe("CSS classes for logo container."),
  svg: LogoSvgSchema,
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
 * Zod Schema for Hero Image.
 */
export const HeroImageInfoSchema = z.object({
  src: z.string().describe("Image source path."),
  alt: z.string().describe("Image alt text."),
  width: z.number().describe("Image width."),
  height: z.number().describe("Image height."),
  classname: z.string().describe("CSS classes for the image."),
});

export const HeroImageSchema = z.object({
  show: z.boolean().describe("Whether to show the hero image."),
  container: z.string().describe("CSS classes for image container."),
  image: HeroImageInfoSchema,
});

/**
 * Zod Schema for Hero Video.
 */
export const HeroVideoInfoSchema = z.object({
  arialabel: z.string().describe("Aria label for the video.").optional(),
  width: z.number().describe("Video width."),
  height: z.number().describe("Video height."),
  classname: z.string().describe("CSS classes for the video."),
});

export const HeroVideoSourceSchema = z.object({
  src: z.string().describe("Video source path."),
  type: z.string().describe("Video mime type."),
});

export const HeroVideoSchema = z.object({
  show: z.boolean().describe("Whether to show the hero video."),
  container: z.string().describe("CSS classes for video container."),
  video: HeroVideoInfoSchema,
  source: HeroVideoSourceSchema,
});

/**
 * Zod Schema for Show toggle configuration.
 */
export const ShowSchema = z.object({
  SectionHeader: z
    .object({
      top: z.boolean(),
      logo: z.boolean(),
      appName: z.boolean(),
      menu: z.boolean(),
      button: z.boolean(),
    })
    .partial()
    .describe("Toggle visibility for SectionHeader components."),
  SectionHero: z
    .object({
      headline: z.boolean(),
      paragraph: z.boolean(),
      button: z.boolean(),
      image: z.boolean(),
      video: z.boolean(),
    })
    .partial()
    .describe("Toggle visibility for SectionHero components."),
});

/**
 * Main Visual Config Schema.
 */
export const VisualSchema = z.object({
  show: ShowSchema.partial(),
  logo: LogoSchema.partial(),
  favicon: FaviconSchema.partial(),
  homepage: HomepageSchema.partial(),
  HeroImage: HeroImageSchema.partial(),
  HeroVideo: HeroVideoSchema.partial(),
});

// Export inferred Types for usage in TypeScript code
export type Visual = z.infer<typeof VisualSchema>;
export type Logo = z.infer<typeof LogoSchema>;
export type Favicon = z.infer<typeof FaviconSchema>;
export type Homepage = z.infer<typeof HomepageSchema>;
export type HeroImage = z.infer<typeof HeroImageSchema>;
export type HeroVideo = z.infer<typeof HeroVideoSchema>;
