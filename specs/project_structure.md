# Project Structure

Overview of the project's directory hierarchy and the purpose of each major folder.

## Root Directory

- `/app`: The heart of the application, containing all routes, layouts, and feature modules.
- `/components`: Reusable UI components organized by category (e.g., UI elements, layout components, module-specific components).
- `/context`: React Context providers for global state management (e.g., Theme, Auth).
- `/data`: Configuration-driven data, including app-specific settings, modules, and pricing plans.
- `/hooks`: Custom React hooks for shared logic.
- `/libs`: Server-side libraries, utility functions, and third-party service wrappers (e.g., Stripe, MongoDB, Resend).
- `/models`: Mongoose schemas and models for database interactions.
- `/public`: Static assets like images, icons, and logos.
- `/scripts`: Automation and deployment scripts (e.g., for bundling, deploying to Vercel).
- `/types`: TypeScript type definitions (if applicable) or JSDoc-based type documentation.
- `/specs`: (This folder) Documentation for AI and developers to understand the codebase.

## Key Files

- `package.json`: Dependency and script management.
- `next.config.mjs`: Next.js specific configuration.
- `app/globals.css`: Tailwind CSS v4 and DaisyUI v5 configuration entry point.
- `vercel.json`: Deployment configuration for Vercel.
- `todo.notes.txt`: Ongoing tasks and project notes.
