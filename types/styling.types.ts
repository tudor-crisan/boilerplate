import { z } from "zod";
import {
    StylingSchema,
    LogoSchema,
    FaviconSchema,
    HomepageSchema,
    GeneralSchema,
    SectionHeroSchema,
    SectionFAQSchema,
} from "./styling.schema";

// Export inferred Types for usage in TypeScript code
export type Styling = z.infer<typeof StylingSchema>;
export type Logo = z.infer<typeof LogoSchema>;
export type Favicon = z.infer<typeof FaviconSchema>;
export type Homepage = z.infer<typeof HomepageSchema>;
export type General = z.infer<typeof GeneralSchema>;
export type SectionHero = z.infer<typeof SectionHeroSchema>;
export type SectionFAQ = z.infer<typeof SectionFAQSchema>;
