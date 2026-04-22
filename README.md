# Canopée Arboriculture Website

Modern bilingual (French/English) static website for an arborist company, ready for Cloudflare Pages.

## Run locally

Because this is a static site, you can open `index.html` directly in your browser.

If you want a local server:

```bash
npx serve .
```

## Deploy to Cloudflare Pages (UI)

1. Push this folder to a GitHub repository.
2. In Cloudflare dashboard, go to **Workers & Pages** > **Create** > **Pages** > **Connect to Git**.
3. Select the repository.
4. Build settings:
   - Framework preset: `None`
   - Build command: *(leave empty)*
   - Build output directory: `/`
5. Click **Save and Deploy**.

### Optional: enable Zoho ticket creation

The contact form posts to `functions/api/contact.js`.

Set these Cloudflare Pages environment variables to create tickets in Zoho Desk:

- `ZOHO_DESK_ACCESS_TOKEN` (OAuth access token for Zoho Desk API)
- `ZOHO_DESK_ORG_ID` (your Zoho Desk organization ID)
- `ZOHO_DESK_DEPARTMENT_ID` (optional, if you want ticket routing to a specific department)

If these values are not set, submissions are still accepted and logged in Cloudflare logs.

## Deploy with Wrangler CLI

```bash
npm install -g wrangler
wrangler pages deploy . --project-name canopee-arboriculture
```

## Customize content

- Main content: `index.html`
- Styling: `styles.css`
- French/English translations and language toggle: `script.js`
