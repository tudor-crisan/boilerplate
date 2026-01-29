# Lists and Constants

The `/lists` directory is a core architectural pillar. It acts as the centralized Registry for the entire multi-tenant system, decoupling the application logic from specific instance data.

## 1. Role in the Architecture

While `data` handles the _schema_ and _defaults_, the `lists/` folder provides the _options_ and _registry_:

- **Options**: Lists of available themes, fonts, and colors.
- **Registry**: The definitive list of all white-labeled applications and their domains.
- **Surgical Pruning**: During deployment, the [Deployment Flow](infrastructure_and_deployment/deployment_flow.md) uses these lists to determine exactly which files belong to which app, ensuring no data leaks between tenants.

## 2. Key Registry Files

- **`applications.mjs`**: The master list of all apps in the boilerplate. Defines their IDs, repo names, and Vercel project targets.
- **`domains.js`**: These are domains that can be purchased for future apps that might be white-labeled.
- **`directories.js`**: These are directories to submit and build backlinks and SEO traffic for each app.

## 3. Design Tokens and Assets

- **`themeColors.js`**: A massive registry of Oklch-based color tokens for all DaisyUI themes supported by the system.
- **`logos.js`**: A collection of SVG path data for all dynamic logos. This enables the [Dynamic Logo Generation](utilities_and_helpers.md) system.
- **`fonts.js`**: Registry of Google Fonts and their configurations to ensure consistent typography performance.

## 4. Security and Filtering

- **`blockedDomains.js`**: A curated list of disposable email providers used by the [Security Utilities](utilities_and_helpers.md) to prevent spam signups.
- **`classnames.js`**: These are tailwind interesting classes that can be used on different components to enhance their visuals.

## 5. Maintenance

When adding a new white-labeled application or a new design theme, these lists are usually the first place a developer makes changes. The scripts in `/scripts` automatically consume these lists to generate the final application bundles.
Riverside.
Riverside.
