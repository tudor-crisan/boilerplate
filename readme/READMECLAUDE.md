# App Deployment Guide

Complete workflow for launching new applications from ideation to production.

---

## Phase 1: Marketing & Product Planning

### Pre-Launch Preparation (SLC Framework)

**Ideation & Documentation**

- Review `ideaslist/` folder for next project
- Create `notes/appName.txt` with:
  - Compelling headline
  - Value proposition paragraph
  - Call-to-action copy

**Product Positioning**

- Design hero image/video concept
- Define pricing tiers and feature breakdown
- Write comprehensive FAQ addressing:
  - Common objections
  - Value justification
  - Use case scenarios

**Content Strategy**

- Prepare 3-5 YouTube Shorts for launch week
- Document product origin story
- Set up dedicated YouTube channel under `youtube.com/account`

---

## Phase 2: Technical Setup

### Application Configuration

**Initial Setup**

1. Register app in `lists/app.js`
2. Customize branding elements:
   - Logo, favicon, screenshots
   - Hero image or video
   - Color scheme and typography
3. Update content:
   - Headlines and copy
   - Section layouts
   - CTAs and navigation
4. Configure fonts (remove unused entries from `lists/fonts.js`)
5. Clean `public/apps/` directory (keep only relevant app assets)

### Third-Party Integrations

#### MongoDB & Authentication

```bash
# Create databases
- appName-dev
- appName-prod

# Collections
- users

# Generate auth secret
npx auth secret
```

Save `AUTH_SECRET` to environment variables.

#### Email (Resend)

- **Testing domain**: `email.tudorcrisan.dev`
- **Account**: `tudor.crisan.webdev@gmail.com`
- Configure API key in environment

#### Google OAuth

**Console**: https://console.cloud.google.com/auth/overview

**Development Configuration**

- Authorized JavaScript origins:
  - `http://localhost:3000`
  - `https://localhost:3000`
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://localhost:3000/api/auth/callback/google`

**Production Configuration**

- Replace localhost with production domain
- Save credentials: `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

#### Stripe (Sandbox)

1. Activate test Customer Portal (Billing → Customer Portal)
2. Create product in Product Catalog
3. Configure webhook endpoint
4. Save keys:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET`

---

## Phase 3: Staging Deployment

### Prepare Repository

**Clean Build**

```bash
# Exclude from staging
.next/
node_modules/

# Remove unused assets
- Unused fonts from lists/fonts.js
- Other apps from public/apps/
- Non-relevant .env files
```

**Initialize Git**

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Vercel Deployment

1. Create new project on Vercel
2. Link GitHub repository
3. Copy environment variables to Vercel dashboard
4. Deploy and verify build

### Domain Configuration

**Namecheap Setup**

1. Register domain (budget: $1-2 .my domain)
2. Configure DNS (Advanced DNS):
   - Add CNAME records from Vercel
   - Add A records from Vercel
3. Disable email service (Mail Settings → "No Email Service")
4. Add custom domain to Vercel project

---

## Phase 4: Production Launch

### Environment Configuration

**Production Variables**

1. Duplicate `env-dev/.env.dev.appName` to `env-prod/.env.prod.appName`
2. Update all sandbox credentials to production
3. Update Vercel environment variables:
   - Set `MONGO_DB=appName-prod`
   - Update all API keys to production values

### Google OAuth Production

**Publishing**

1. Navigate to Google Cloud Console → Audience
2. Click "Publish app"
3. Update OAuth credentials with production domain
4. Verify redirect URIs

### Stripe Production Setup

**Product Migration**

1. Navigate to product in Sandbox mode
2. Right-click → "Copy to live mode"
3. Copy production price ID
4. Update environment variables:
   - `STRIPE_SECRET_KEY`

**Webhook Configuration**

1. Go to Developers → Webhooks → Create
2. Configure endpoint:
   - Type: Your account
   - URL: `https://domain.com/api/billing/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`
3. Copy signing secret to production environment
4. Update Vercel environment variables

**Customer Portal**

1. Activate live Customer Portal
2. Configure cancellation reasons (enable all)
3. Save settings

**Branding & Settings**

1. Search "Branding": Customize colors, icons, texts, domain, TOS
2. Settings > Business > Customer Emails: Enable "successful payments" and "refunds"
3. Billing Settings:
   - Select all "Customer emails"
   - toggle "Use your own custom link" -> `https://domain/dashboard`
   - Enable "Subscription management"
4. Balances > Manage payouts:
   - Set schedule (monthly for accounting)
   - Add Bank Accounts

### Analytics & Monitoring

**Essential Setup**

- Add Vercel Analytics component
- Monitor error logs
- Track conversion events

**Future Enhancements** (at scale)

- Dedicated Stripe account with custom branding
- Custom email domain via Resend (`email.domain.com`)
- Advanced analytics with datafa.st

---

## Phase 5: Testing & Validation

### Deployment Verification

**Redeploy with Production Config**

1. Navigate to latest Vercel deployment
2. Click "Redeploy" to apply new environment variables

**Functional Testing**

- [ ] Email authentication flow
- [ ] Google OAuth login
- [ ] Check DB: manually set `hasAccess: true` for user
- [ ] Verify all endpoints are functional
- [ ] Payment processing & Webhooks

### Log Monitoring

**Database - Mongo Compass**

- Verify data storage and structure integrity

**Vercel Logs**

- Check for warnings/errors
- Debug if necessary

**Stripe Developers**

- Verify events emitted
- Check logs for failures

**Resend**

- Check "Emails" tab for sent/delivered statuses

**Google OAuth**

- Monitor sign-in logs

---

## Phase 6: Marketing Launch

### Portfolio Update

**tudorcrisan.dev additions**

- App logo and branding
- Headline and value proposition
- Link to live application
- Origin story from `notes/appName.txt`
- Embedded YouTube promotional content

### YouTube Content Strategy

**Launch Plan**

1. Review and finalize shorts from `notes/appName.txt`
2. Schedule uploads throughout launch week
3. Vary posting times for maximum reach
4. Monitor engagement and iterate

**Content Mix**

- Product demonstrations
- Feature highlights
- User testimonials
- Behind-the-scenes content

---

## Quick Reference

### Common Commands

```bash
# Generate auth secret
npx auth secret

# Initialize Git repository
git init && git add . && git commit -m "Initial commit"
```

### Key URLs

- Google OAuth Console: https://console.cloud.google.com/auth/overview
- Vercel Dashboard: https://vercel.com/dashboard
- Stripe Dashboard: https://dashboard.stripe.com

### Environment Variables Checklist

- [ ] `AUTH_SECRET`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_PRICE_ID`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `MONGO_DB`
- [ ] `RESEND_API_KEY`

---

## Troubleshooting

**Build Failures**

- Verify all environment variables are set
- Check for missing dependencies
- Review Vercel build logs

**Authentication Issues**

- Confirm OAuth redirect URIs match exactly
- Verify domain configuration in Google Console
- Check auth secret consistency

**Payment Problems**

- Confirm webhook endpoint is accessible
- Verify Stripe keys are for correct environment
- Check webhook event subscriptions

---

_Last updated: December 2024_
