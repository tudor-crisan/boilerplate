## New app marketing

Preparing the SLC (simple-lovable-complete)

```bash
- Check "ideas-list" folder, which might be next
- Create a new text file inside the "notes" folder
- Name it "appName.txt" - write here the headline, paragraph, cta
- Describe the hero image / video of the app demonstration
- Write the pricing / features for the product
- Write the FAQ to handle all objections about the product
- Prepare the launch tweet, hacker new, product hunt taglines
- Prepare the story behind how this product was borned
```

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
- Create a new database "appName-dev" and "-prod" with collection "users"
- Create a new AUTH_SECRET in env - with "npx auth secret"
- Create a new OAuth at https://console.cloud.google.com/auth/overview
- Save AUTH_SECRET | GOOGLE_CLIENT_ID | GOOGLE_CLIENT_SECRET inside docs-v3.rtf
```

## Deploy staging

Copy all folders / files in new folder

```bash
Except for
- .next
- node_modules
```

Arange folder / files and deploy

```bash
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

Publish app in Google OAuth

```bash
- Modify the "Environment Variables" on Vercel - MONGO_DB="appName-prod" (eg. LoyalBoards-prod)
- Go to https://console.cloud.google.com/auth/audience?project=<appName>
- Select "Audience" on the left
- Click "Publish app"
```

## Publish to TudorCrisan.dev (+socials)

Go to the tudorcrisan.dev repository and add it there

```bash
- Add there the logo / headline / paragraph and link to the app
- Write there the story behind it, from the notes/<appName>.txt
```

Publish on twitter / reddit / ph / directories

```bash
- Prepare the launch from the notes writen on notes/<appName>.txt
- Polish there the launch details - get it ready to publish
- Upload data to the "publishing chrome extension", that uploads to different directories
- Keep track in notes/<appName>.txt of where it's launched and when
```
