## New app set-up

Creating and setting-up a new app from the boilerplate

```bash
- Create new app in lists/app.js (create files needed)
- Adjust the copywriting / styling / visuals
- Adjust the sections / headline / paragraph / cta
- Choose logo / screenshot favicon
- Choose hero image or hero video
```

Creating and setting-up 3rd party

```bash
- Create a new database "appName-dev" and "-prod"
- Create a new AUTH_SECRET in env - with "npx auth secret"
- Create a new OAuth at https://console.cloud.google.com/auth/overview
- Save AUTH_SECRET | GOOGLE_CLIENT_ID | GOOGLE_CLIENT_SECRET inside docs-v3.rtf
```

## Deploy on vercel

Copy all folders / files

```bash
Except for
- .next
- node_modules
```

Change .env / package.json:

```bash
Change the .env variables
- NEXT_PUBLIC_APP="appName" (eg. loyalboards)
- MONGO_DB="appName-prod" (eg. LoyalBoards-rprod)
- RESEND_EMAIL_FROM="appName@" (eg. LoyalBoards@email.tudorcrisan.dev)

Change the package.json
-"name":"appName" (eg. loyalboards)
-"version": from "0.0.1" to "0.0.2" (for example)

Remove from package.json
- scripts: lint, typescript
- dependencies: zod
- devDependencies: eslint, eslint-config-next
```

Remove all unused files:

```bash
keep only the "appName" from lists/apps.js (rest delete)
lists/apps.js
components/shuffle
components/wrapper/WrapperShuffle.js

keep only what's used in "apps.js"
lists/copywritings.js
lists/stylings.js
lists/visuals.js
lists/fonts.js
lists/logos.js
lists/themes.js

keep only what's in apps.js (rest files delete)
data/copywriting
data/styling
data/visual

keep only what's in public/apps/"appName" (rest delete all)
notes/
public/assets/
scripts/
sensitive/
types/
README.md
.env.example
```

Test locally:

```bash
- have the .env.local variables
- run "npm install" then "npm run dev"
- test in browser at localhost:3000
```

Git / Vercel deploy

```bash
* Initialize a new git repository
* Add all files / commit / push private
* Vercel - new project, click import
* Set-up the environment variables
* Domain - register a $1-2 domain (.my)
* Basic DNS - set-up the email forwarding (alias tudor.crisan)
* Advanced DNS - set-up the CNAME / A records (from vercel)
```

## Deploy 3rd party

Publish app in Google OAuth

```bash
- Go to https://console.cloud.google.com/auth/audience?project=<appName>
- Select "Audience" on the left
- Click "Publish app"
```
