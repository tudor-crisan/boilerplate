# Types and Data Validation

The project uses Zod to enforce strict data integrity across all configuration files and API interactions.

## 1. Schema Definitions (`/types`)

Schemas are organized by module to match the `data` structure:

- **`common.schema.ts`**: Shared primitives like URL patterns, button configurations, and standardized response objects.
- **`setting.schema.ts`**: Validates the global application settings.
- **`styling.schema.ts`**: Ensures design tokens follow the correct CSS utility patterns.
- **`visual.schema.ts`**: Validates visibility toggles and layout order.
- **`blog.schema.ts`** & **`boards.schema.ts`**: Domain-specific schemas for articles and feedback systems.

## 2. Validation Strategy

The project performs validation at multiple stages:

### Build-Time Validation

Running `npm run typescript` executes the validation scripts in `/scripts`. This ensures that any manual changes to JSON files in `data/` conform to the expected types before deployment.

### Runtime Validation

Zod's `.parse()` or `.safeParse()` methods are frequently used in the backend (API routes and libs) to validate incoming request bodies and configuration merges at execution time.

## 3. Benefits

- **AI-Friendly**: The schemas provide clear boundaries for AI models when generating or modifying configuration data.
- **Scalability**: New modules can be added by creating a new `.schema.ts` file and updating the central mapping in `scripts/validate-data.ts`.
