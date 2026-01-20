# Automation Scripts

The `/scripts` directory contains essential automation tools for configuration management, deployment, and maintenance.

## 1. Configuration & Lists

- **`generate-lists.mjs`**:
  - **Purpose**: Regenerates the `/lists` directory.
  - **Function**: Scans `data/modules` and `data/apps` to create JavaScript barrel files. This allows the Next.js app to import configurations using standard `import` syntax rather than relative file reads.
  - **Executed by**: `npm run lists`.

## 2. Validation

- **`typescript.js`**:
  - **Purpose**: Fast, JS-based validation of generated lists.
  - **Function**: Imports the generated lists and parses them against the Zod schemas defined in `/types`.
- **`validate-data.ts`**:
  - **Purpose**: Type-safe validation of the raw JSON files.
  - **Function**: Iterates through `data/modules` and `data/apps`, matching each JSON file to its corresponding Zod schema for full structural verification.
  - **Executed by**: `npm run typescript`.

## 3. Deployment & Sync

- **`deploy.js`**:
  - **Purpose**: The primary deployment engine for white-labeled apps.
  - **Function**: Handles versioning, file copying, app-specific filtering, and targeting individual repositories. See [Deployment Flow](../infrastructure_and_deployment/deployment_flow.md) for details.
  - **Executed by**: `npm run deploy` or `npm run deploy:fix` (to not bump version).

## 4. Maintenance & Backups

- **`copy-to-stick.js`**:
  - **Purpose**: Creates mirrors of the project on external storage.
  - **Function**: Synchronizes the boilerplate and deployed folders to a specific backup path. See [Backup System](../infrastructure_and_deployment/backup_system.md) for details.
  - **Executed by**: `npm run stick`.
- **`svglogos.js`**:
  - **Purpose**: Utility for converting raw Lucide SVG code into the structured object format used by the project's custom SVG components.
