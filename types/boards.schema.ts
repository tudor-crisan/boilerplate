import { FormSchema, PagePathSchema } from "@/types/setting.schema";
import { z } from "zod";

/**
 * Zod Schema for Board Path Configuration.
 */
export const BoardsPathsSchema = z.record(z.string(), PagePathSchema);

/**
 * Zod Schema for Board Metadata.
 */
export const BoardsMetadataSchema = z.object({
  modules: z.object({
    board: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

/**
 * Zod Schema for Rate Limits.
 */
export const RateLimitSchema = z.object({
  limit: z.number(),
  window: z.number(),
});

export const BoardsRateLimitsSchema = z.record(z.string(), RateLimitSchema);

/**
 * Zod Schema for Extra Settings (specific to boards).
 */
export const DefaultExtraSettingsSchema = z.object({
  form: z.object({
    title: z.string(),
    button: z.string(),
    inputs: z.record(
      z.string(),
      z.object({
        label: z.string(),
        placeholder: z.string(),
        maxlength: z.number().optional(),
        showCharacterCount: z.boolean().optional(),
        rows: z.number().optional(),
      }),
    ),
  }),
  emptyState: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

/**
 * Main Boards Config Schema.
 */
export const BoardsSchema = z.object({
  paths: BoardsPathsSchema,
  metadata: BoardsMetadataSchema,
  rateLimits: BoardsRateLimitsSchema,
  forms: z.record(z.string(), FormSchema),
  defaultExtraSettings: DefaultExtraSettingsSchema,
});

// Export inferred Types
export type Boards = z.infer<typeof BoardsSchema>;
export type BoardsPaths = z.infer<typeof BoardsPathsSchema>;
export type BoardsMetadata = z.infer<typeof BoardsMetadataSchema>;
export type RateLimit = z.infer<typeof RateLimitSchema>;
