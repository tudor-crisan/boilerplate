## New App Marketing

**Goal:** Prepare the SLC (Simple · Lovable · Complete)

#### 1. Idea

- Check the `ideaslist/` folder
- Create a new file in `notes/`
- Name it `appName.txt`
- Write:

  - Headline
  - Short description
  - Call to action (CTA)

#### 2. Product

- Define the hero image or demo video
- Write pricing and feature tiers
- Write an FAQ to address objections

#### 3. YouTube

- Prepare launch YouTube Shorts:

  - Video
  - Title
  - Description

- Write the story of how the product was born
- Create a new YouTube channel and warm it up

## New App Tech Stack

### App Setup (from boilerplate)

- Create new app in `lists/app.js` (and required files)
- Adjust:

  - Copywriting
  - Styling
  - Visuals

- Update:

  - Sections
  - Headlines
  - Paragraphs
  - CTAs

- Choose:

  - Logo
  - Screenshots
  - Favicon
  - Hero image or video

- Prepare third-party environment variables

---

### Third-Party Setup

#### Database & Auth

- Create databases:

  - `appName-dev`
  - `appName-prod`

- Create `users` collection
- Generate auth secret:

  ```bash
  npx auth secret
  ```

#### Resend

- Configure domain (testing: `email.tudorcrisan.dev`)
- Generate API key (from `tudor.crisan.webdev@gmail.com`)

#### Google OAuth

- Create OAuth client:

  - [https://console.cloud.google.com/auth/overview](https://console.cloud.google.com/auth/overview)

- Allowed origins:

  - `http://localhost:3000`
  - `https://localhost:3000`

- Redirect URIs:

  - `/api/auth/callback/google`

- Repeat setup for production domain
- Save credentials:

  - `AUTH_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

- Store in `docs-v3.rtf`

#### Stripe (Dev / Sandbox)

- Create sandbox account
- Enable customer billing portal (test mode)
- Create product and pricing
- Save:

  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_ID`
  - `STRIPE_WEBHOOK_SECRET`

---

## Deploy – Staging

### Prepare Files

- Copy project into a new folder
- Exclude:

  - `.next`
  - `node_modules`

### Cleanup

- Remove unused fonts from `lists/fonts.js`
- Keep only:

  - `public/apps/appName/`

- Remove unused `.env.*` files

### Deploy

- Initialize Git:

  ```bash
  git init
  ```

- Commit and push to a private repo
- Create new Vercel project
- Copy environment variables

### Domain (Namecheap)

- Register low-cost domain (`.my`)
- Configure DNS:

  - CNAME / A records (from Vercel)

- Mail settings:

  - No Email Service

---

## Deploy – Production

### Environment Variables

- Copy:

  - `env-dev/.env.dev.appName`
    → `env-prod/.env.prod.appName`

- Update values
- Sync with Vercel env settings

### Database

- Update Vercel env:

  ```text
  MONGO_DB=appName-prod
  ```

### Google OAuth

- Publish OAuth app:

  - [https://console.cloud.google.com/auth/audience](https://console.cloud.google.com/auth/audience)

- Switch Stripe keys from sandbox to live
- Add Vercel `<Analytics />`

### Stripe (Live)

- Copy product from test → live mode
- Update:

  - Live price ID
  - Live API keys

- Configure webhooks:

  - `checkout.session.completed`
  - `customer.subscription.deleted`

- Save live webhook signing secret
- Enable customer portal and cancellation reasons

### Vercel

- Redeploy latest build with updated env variables

---

### Optional (After Traction)

- Create separate Stripe account with branding
- Add Resend domain (`email.domain.com`)
- Add advanced tracking (`datafa.st`)

---

## Publish & Launch

### Portfolio

- Update `tudorcrisan.dev`
- Add:

  - Logo
  - Headline
  - Description
  - App link

- Publish the product story
- Embed YouTube Shorts

### YouTube Shorts

- Use notes from `notes/appName.txt`
- Polish launch copy
- Publish consistently at different times
