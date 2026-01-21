# Routing and Modules

This project utilizes the Next.js App Router and a feature-based module architecture.

## Overview

Routing is handled within the `/app` directory. The project distinguishes between core application routes and module-specific routes.

## Core Routes

- `/app/page.js`: The main landing page.
- `/app/layout.js`: The root layout shared across all pages.
- `/app/dashboard`: Routes for the user dashboard.
- `/app/auth`: Authentication-related routes (SignIn, Verify Request, etc.).
- `/app/tos/help`: Help articles and knowledge base.
- `/app/tos/privacy` & `/app/tos/terms`: Legal documents.

## Module-Based Architecture

A unique pattern in this project is the `/app/modules` directory, which organizes features by domain:

- `billing/`: Stripe checkout and management.
- `boards/`: Core feature logic (e.g., feedback boards).
- `preview/`: Functionality for previewing content.

### Feature-Based Organization

Each module typically contains:

- `page.js`: The main entry point for the module's route.
- Sub-routes for specific module actions.
- Localized logic that might interact with `libs/` or `models/`.

## Dynamic Routing

The project frequently uses dynamic routes (e.g., `[id]/page.js`) for personalized or item-specific views, such as blog posts or feedback boards.

### Static Route Generation

- `sitemap.js`: Dynamically generates the sitemap based on defined routes and modules.
- `robots.js`: Configures search engine indexing.
