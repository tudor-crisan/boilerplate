# Global Settings Configuration (Deep Dive)

The `setting.json` file in `data/modules/` is the core configuration "brain" of the application. It defines how the app identifies itself, how it communicates with users, and how it maps routes to features.

## 1. App Identity & SEO

- **`appName` & `website`**: Primary branding strings used across the app and in automated emails.
- **`seo` Block**: Defines the global default title, description, and tagline. These are often used as fallback values in metadata templates.
- **`availableApps`**: A registry of verified white-label app identifiers (e.g., `["loyalboards"]`).

## 2. Business Entity Details (`business`)

Comprehensive contact and legal information used for generating Terms of Service, Privacy Policies, and footer contact details:

- **Contact**: Support and incoming email addresses, phone numbers (with specific display formatting), and physical address.
- **Branding**: Links to the primary logo asset and a list of social media profiles (Twitter, YouTube, etc.).
- **Metadata**: `last_updated` field to track when legal or business terms were last modified.

## 3. Authentication & Rate Limiting

- **`auth`**:
  - `providers`: Enabled login methods (e.g., `["resend", "google"]`).
  - `hasThemePages`/`hasThemeEmails`: Toggles that determine if the app should use custom styled auth pages and emails or fall back to defaults.
- **`rateLimits`**: Critical security configuration. Defines execution limits (`limit`) and time windows (`window` in seconds) for sensitive actions like:
  - Magic link requests (`auth-quick-link`)
  - Google sign-in attempts (`auth-google-signin`)
  - Billing action creation (`billing-create-checkout`, `billing-create-portal`)

## 4. Routing Registry (`paths`)

The `paths` object acts as a centralized router for the entire application, mapping user-friendly "source" URLs to their internal Next.js "destination" paths:

- **Pages**: Maps routes like `/help`, `/terms`, and `/dashboard` to their respective locations in `/tos/` or `/modules/`.
- **Dynamic Routes**: Handles parameter mapping, such as `/help/:articleId`.
- **API Endpoints**: Centralizes the internal URLs for backend services (Billing, Resend Testing) used by client-side hooks and components.

## 5. Metadata Templating (`metadata`)

Defines page-specific SEO strategies using string interpolation:

- **Templates**: Uses placeholders like `{appName}`, `{seoTitle}`, and `{seoTagline}` which are dynamically replaced by the app's core settings at runtime.
- **Coverage**: Includes specific metadata for Home, Dashboard, Auth, and all Legal/Support pages.

## 6. Standardized Form Responses (`forms`)

This section centralizes the communication strategy for user interactions:

- **`general.backend`**: Global error/success states like `notAuthorized` (401), `noAccess` (403), and `serverError` (500).
- **Domain Specific**:
  - `Billing`: Success messages for checkout and portal redirection.
  - `User`: Confirmation for profile updates.
  - `MockData`: An example of `inputsConfig` used for testing or demonstrating form builders, featuring select fields with option arrays and textareas.

## 7. Third-Party Integrations

- **`integrations`**: Stores base URLs for API-driven services (Resend) and asset CDNs (Google Fonts), allowing the app to switch service providers or regions via configuration.
