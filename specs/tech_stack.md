# Tech Stack

This document outlines the core technologies and versions used in the project.

## Core Frameworks
- **Next.js (v16.0.8)**: The primary framework for building the application, utilizing the App Router.
- **React (v19.2.1)**: The UI library for building components.

## UI & Styling
- **Tailwind CSS (v4)**: Utility-first CSS framework for styling.
- **DaisyUI (v5.5.8)**: Tailwind-based component library for rapid UI development.
- **Framer Motion (v12.23.26)**: For animations and transitions.
- **React Hot Toast**: For toast notifications.

## Database & ORM
- **MongoDB (v6.0.0)**: The primary database.
- **Mongoose (v9.0.1)**: ORM for MongoDB handling schemas and data modeling.
- **@auth/mongodb-adapter**: Adapter for connecting NextAuth to MongoDB.

## Authentication & Authorization
- **NextAuth (v5.0.0-beta.30)**: Handles authentication, including Google OAuth and Email (Magic Link) providers.

## Payments & Billing
- **Stripe (v20.1.0)**: Integration for payments, subscriptions, and billing management.
- **Svix**: Used for webhook handling and verification.

## Email
- **Resend (v6.6.0)**: Dedicated email service for transactional emails like magic links and notifications.

## Utilities
- **Axios**: For making HTTP requests.
- **Zod**: For schema validation (both client and server-side).
- **Clsx & Tailwind-merge**: For dynamic and clean CSS class management.
- **Cross-env**: For managing environment variables across different environments and apps.
