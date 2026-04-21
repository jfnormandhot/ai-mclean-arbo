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

### Optional: enable contact email delivery

The contact form posts to `functions/api/contact.js`.

Set these Cloudflare Pages environment variables to send email via Resend:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (where requests are received)
- `CONTACT_FROM_EMAIL` (verified sender in Resend)

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
