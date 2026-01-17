import { z } from "zod";

/**
 * Shared Zod Schema for an Image.
 */
export const ImageSchema = z.object({
  src: z.string().describe("Image source URL or path."),
  urlRelative: z.string().optional().describe("Relative URL path for linking."),
  alt: z.string().describe("Alt text for the image."),
  width: z.number().optional().describe("Image width."),
  height: z.number().optional().describe("Image height."),
  classname: z.string().optional().describe("CSS classes for the image."),
});

/**
 * Shared Zod Schema for a Link.
 */
export const LinkSchema = z.object({
  label: z.string().describe("Link label text."),
  href: z.string().describe("Link URL or path."),
});

/**
 * Shared Zod Schema for a Button.
 */
export const ButtonSchema = z.object({
  label: z.string().describe("Button label text."),
  href: z.string().optional().describe("Button link URL."),
  classname: z.string().optional().describe("CSS classes for the button."),
});

/**
 * Shared Zod Schema for Menu Item.
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

// Inferred Types
export type Image = z.infer<typeof ImageSchema>;
export type Link = z.infer<typeof LinkSchema>;
export type Button = z.infer<typeof ButtonSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
