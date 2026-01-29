# Data and Models

This project uses MongoDB with Mongoose for data persistence and a JSON-based configuration system for application settings.

## Models (`/models`)

Data is modeled using Mongoose schemas. Key models include:

- `User.js`: Defines the user schema. Billing is handled solely via `hasAccess` (boolean) and `customerId` (Stripe coupling). The model does **not** include roles or specific billing status (handled by Stripe).
- `RateLimit.js`: Tracks API usage to prevent abuse.
- `modules/`: Feature-specific models (e.g., `boards/Board.js`) are nested to match the modular structure.

## Database Connection (`/libs/mongoose.js`)

The database connection is managed using a singleton pattern to ensure efficient use of MongoDB connections in the serverless Next.js environment.

## Configuration System (`/data`)

The application is highly configurable via JSON files:

- `/apps/`: Individual configuration for different white-labeled apps.
- `/data/`: Global configurations for specific features.
- `styling.json`: Design tokens and standard Tailwind classes, located in `/data/`.

## List Generation (`/lists`)

The `/lists` directory contains automatically generated files that serve as an index for various configurations.

- **Process**: Running `npm run lists` (which executes `scripts/generate-lists.mjs`) scans `apps` and `data` to create JavaScript imports and manifests.
- **Purpose**: This allows the application to dynamically load configurations and assets based on the active `APP` environment variable.
- **Metadata**: New lists can be generated from `package.json` to include additional files or metadata required by the modules.

## Detailed Module Specifications

For more detail on each configuration module, see the [Data and Modules](data_and_modules/) directory.
