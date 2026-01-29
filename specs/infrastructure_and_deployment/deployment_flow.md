# Deployment Flow (Deep Dive)

The `scripts/deploy.js` script handles the complex task of synchronizing the main boilerplate with multiple live application repositories.

## 1. Initialization

- **Versioning**: The script reads `package.json` and increments the patch version. If `--no-bump` is passed, this step is skipped.
- **Source Sync**: It automatically adds, commits, and pushes the current state of the boilerplate repo to ensure the source is always up-to-date.

## 2. The Targeting System

The script uses `TARGET_FOLDERS` to determine which repositories in the local `DEPLOYED_ROOT` need updating (e.g., `loyalboards`, `tudorcrisan.dev`).

## 3. The "Filter & Clean" Process

For each target, the script performs a surgical update:

1. **Wipe Destination**: Cleans the target folder while preserving the `.git` directory.
2. **Selective Copy**: Copies files from the boilerplate, excluding build artifacts (`.next`, `node_modules`) and sensitive local files (`.env`, `todo.notes.txt`).
3. **App-Specific Pruning**:
   - Uses `cleanAppSpecificFiles` to remove any data, component, or public asset folders that belong to _other_ apps in the white-label suite.
4. **List Rewriting (Surgical Pruning)**:
   - The `/lists` directory contains indexes of all apps in the boilerplate. During deployment, we want to isolate the target app entirely.
   - `filterListFiles` parses the `.js` files in the target's `/lists` folder.
   - It identifies and **removes lines** that import data (`apps/...`) or components (`components/apps/...`) belonging to other apps.
   - It also performs "source-level tree shaking": if an import is removed, any reference to that imported variable (e.g., in a configuration object or export list) is also stripped out.
   - **Isolation**: This ensures that "App A" in production does not contain a single line of text or configuration from "App B".
   - **Bundle Size**: By removing these unused imports and objects before the Next.js build starts on Vercel, the final bundle is significantly smaller and cleaner.

## 4. Configuration Injection

The `configureVercelJson` function injects app-specific configurations into `vercel.json` at the time of deployment. This is primarily used for setting up domain-specific Cron jobs (e.g., the weekly digest cron for `loyalboards`).

## 5. Deployment Finalization

Once the target directory is filtered and configured, the script performs a `git push` from the target folder. This triggers the Vercel deployment pipeline for that specific application.
