## New app marketing

Preparing the SLC (simple-lovable-complete)

```bash
Idea
- Check "ideaslist" folder, which might be next
- Create a new text file inside the "notes" folder
- Name it "appName.txt" - write here the headline, paragraph, cta

Product
- Describe the hero image / video of the app demonstration
- Write the pricing / features for the product
- Write the FAQ to handle all objections about the product

YouTube
- Prepare the launch youtube shorts, with movie/title/description
- Prepare the story behind how this product was borned
- Prepare a new channel to warm it up, under the youtube.com/account
```

## New app tech-stack

Creating and setting-up a new app from the boilerplate

```bash
- Create new app in lists/app.js (create files needed)
- Adjust the copywriting / styling / visuals
- Adjust the sections / headline / paragraph / cta
- Choose logo / screenshot favicon
- Choose hero image or hero video
- Prepare the 3rd party env variables
- Test everything, do "rm -fR .next" in case it breaks
```

Creating and setting-up 3rd party

```bash
Database & Auth
- Create a new database "appName-dev" and "-prod" with collection "users"
- Create a new AUTH_SECRET in env - with "npx auth secret"

Resend
- Prepare the domain, for testing use tudorcrisan.dev
- Prepare the api_key also, the one from tudor.crisan.webdev@gmail.com
- Prepare the webhook, to point to https://www.tudorcrisan.dev/api/resend/webhook with "email.received" event
- Prepare the RESEND_WEBHOOK_SECRET which is the signing secret received after creating the webhook

Google OAuth
- Create a new OAuth at https://console.cloud.google.com/auth/overview
- ORIGINS - http://localhost:3000 - https://localhost:3000
- REDIRECT URIs - http://localhost:3000/api/auth/callback/google - https://localhost:3000/api/auth/callback/google
- SAME FOR DOMAIN - as the above, but put the actual domain there
- Save AUTH_SECRET | GOOGLE_CLIENT_ID | GOOGLE_CLIENT_SECRET inside docs-v3.rtf

Stripe
- Stripe - Sandbox account - set everything up
- Stripe - Billing - Customer portal - "Activate test link"
- Stripe - Product catalog (create product)
- Stripe - Copy the STRIPE_SECRET_KEY , STRIPE_PRICE_ID, STRIPE_WEBHOOK_SECRET
```

## Deploy staging

Copy all folders / files in new folder

```bash
Except for
- .next
- node_modules
```

Arange folder / files and deploy

```
Create a new github repo / deploy
-Open in that folder git bash - git init / code .

Remove all unused files: (for speed)
- delete fonts that are not used from - lists/fonts.js
- keep only what's in public/apps/"appName" (rest delete all)
- delete the env/.env.<appName> variables, keep only the one of the app

Deploy on github and vercel
- Git add all files / commit / publish private branch
- Open vercel new project, and copy-paste the variables

Namecheap domain registration
- Add Domain - after the build is complete
- Domain - register a $1-2 domain (.my)
- Advanced DNS - set-up the CNAME / A records (from vercel)
- Mail Settings - "No Email Service"
```

## Deploy production

Publish app in production

```bash
Env-prod
- Copy the env-dev/.env.dev.appName to env-prod/.env.prod.appName
- Modify accordingly and update also the vercel environment variables as well

Database
- Modify the "Environment Variables" on Vercel - MONGO_DB="appName-prod" (eg. LoyalBoards-prod)

Google OAuth Client
- Go to https://console.cloud.google.com/auth/audience?project=<appName>
- Select "Audience" on the left - Click "Publish app"
- Modify API key from sandbox to live for stripe (set-up the products / prices also)
- Add the "<Analytics />" from vercel to track events

Stripe
- Go to "Sandbox" - find the prodcut - select it - right click on top right "Copy to live mode"
- Click on the product - "Copy price id" - Put it on the env/env-prod variables
- Put the STRIPE_SECRET_KEY from docs-v3.rtf here on vercel
- Go to "Developers" > "Webhook" > "Create" > "Your account" > "checkout.session.completed" and "customer.subscription.deleted"
- Select "Webhook endpoint" - Destination name = "Domain" | https://www.domain/api/billing/webhook > Click on "Create destination"
- IMPORTANT: Add www. before the domain so it doesn't redirect the webhook
- Signing secret - copy that one for the live .env variables on env/env-prod/.env.prod.appName and on Vercel
- Search for "Customer portal" and click on the "Activate link" - Go to "Cancellations" and click "Edit reasons" and select all - Click save
- Search for "Bradning" and customize the colors, icons, texts, domain, TOS etc.
- Search for "Settings > Business > Customer Emails" and send "successfull payments" and "refunds"
- Visit "Billing settings" link and select all emails on "Customer emails" and "Use your own custom link "https://domain/dashboard as we as "Subscription management"
- On the left - "Balances" > "Manage payouts" - input the schedule (a day per month for better accounting) - and Bank Accounts where money is sent

Additional (when having traction):
- "Create new stripe" for the domain, with branding and everything
- Resend: "Add domain" add the email.domain.com to send from it
- Tracking: "Add google analytics" for advanced tracking of the apps
- Mongo: daily backups of all databases in case something goes wrong
```

Deploy, testing, logs

```bash
Vercel
- Go to vercel latest deployment
- Click on "Redeploy" with the new .env variables

Testing
- Go to app, login with email, then with oauth
- Modify hasAccess to true for the user in database
- Make sure all endpoints and everything is working

Logs
- Go to "Mongo Compass" - check all data is being store correctly
- Go to "Vercel Logs" - check the warnings / errors for debug
- Go to "Stripe Developers" - check all the events / logs emitted
- Go to "Resend Emails" - check all email send / received
- Go to "Google OAuth" - check all logs of new sign-ins
```

## Publish and launch

Update the tudorcrisan.dev portfolio

```bash
- Add there the logo / headline / paragraph and link to the app
- Write there the story behind it, from the notes/<appName>.txt
- Embed a few of the popular youtube ads for the app
```

Publish on YouTube Shorts

```bash
- Prepare the launch from the notes writen on notes/<appName>.txt
- Polish there the launch details - get it ready to publish
- Upload consistently at different times of the day the shorts
```
