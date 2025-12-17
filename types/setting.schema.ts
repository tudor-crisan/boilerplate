import { z } from "zod";

/**
 * Zod Schema for Form Configuration.
 */
export const FormConfigSchema = z.object({
    title: z.string().describe("Title of the form."),
    button: z.string().describe("Button text."),
    apiUrl: z.string().describe("API endpoint URL."),
    className: z.string().describe("CSS classes for the form container."),
});

/**
 * Zod Schema for Input Field Configuration.
 */
export const InputConfigSchema = z.object({
    type: z.string().describe("Input type (e.g., text, email)."),
    required: z.boolean().describe("Whether the field is required."),
    value: z.string().describe("Default value."),
    label: z.string().describe("Label text."),
    placeholder: z.string().describe("Placeholder text."),
});

/**
 * Zod Schema for Backend Response Configuration.
 */
export const BackendResponseSchema = z.object({
    message: z.string().optional(),
    status: z.number().describe("HTTP status code."),
    inputErrors: z.record(z.string(), z.string()).optional().describe("Validation errors mapped by field name."),
});

/**
 * Zod Schema for Backend Configuration.
 */
export const BackendConfigSchema = z.object({
    responses: z.record(z.string(), BackendResponseSchema).describe("Map of backend responses."),
});

/**
 * Zod Schema for Mock Response Configuration.
 */
export const MockResponseSchema = z.object({
    error: z.string().optional().describe("Error message."),
    message: z.string().optional().describe("Success message."),
    inputErrors: z.record(z.string(), z.string()).optional().describe("Validation errors mapped by field name."),
    data: z.any().optional().describe("Mock data payload."),
    status: z.number().describe("HTTP status code."),
});

/**
 * Zod Schema for Mock Configuration.
 */
export const MockConfigSchema = z.object({
    isEnabled: z.boolean().describe("Whether mock mode is enabled."),
    isError: z.boolean().describe("Whether to simulate an error."),
    isSuccess: z.boolean().describe("Whether to simulate success."),
    responses: z.record(z.string(), MockResponseSchema).describe("Map of mock responses."),
});

/**
 * Zod Schema for a specific Form (e.g. Board).
 */
export const FormSchema = z.object({
    formConfig: FormConfigSchema,
    inputsConfig: z.record(z.string(), InputConfigSchema).describe("Map of input field configurations."),
    backend: BackendConfigSchema,
    mockConfig: MockConfigSchema,
});

/**
 * Main Setting Config Schema.
 */
export const SettingSchema = z.object({
    forms: z.record(z.string(), FormSchema).describe("Map of form configurations."),
});

// Export inferred Types for usage in TypeScript code
export type Setting = z.infer<typeof SettingSchema>;
export type FormConfig = z.infer<typeof FormConfigSchema>;
export type InputConfig = z.infer<typeof InputConfigSchema>;
export type BackendConfig = z.infer<typeof BackendConfigSchema>;
export type MockConfig = z.infer<typeof MockConfigSchema>;
