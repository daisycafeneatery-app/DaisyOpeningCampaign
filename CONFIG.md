# Daisy Cafe & Eatery — Configuration

This project is a build-free static website. The main replaceable business settings are in `js/config.js`.

| Setting | Current Value | Replace With |
|---|---|---|
| Company | Daisy Cafe & Eatery | — |
| Phone | +91 92422 62036 | Verified business number |
| WhatsApp | +91 92422 62036 | Verified WhatsApp number |
| Email | hello@daisycafeneatery.com | Verified business email |
| Address | Debra bazar, Paschim Medinipur, West Bengal, India 721149 | Verified full address |
| Website | https://www.daisycafeneatery.com | Production domain |
| Logo | assets/images/logo/logo.webp | Replace asset; keep filename or update config |
| OG Image | assets/images/social/default-og.webp | Replace asset |
| Google Maps | supplied Daisy Maps link | Verified Maps link |
| Form Endpoint | blank | Supabase/CRM/server endpoint |
| GA4 ID | blank | `G-XXXXXXXXXX` if analytics is enabled |
| Delivery radius | 8 km | Business-approved radius |

## Important

- Never put API keys, private credentials or secrets in frontend files.
- If the domain changes, update `siteUrl`/`website` in `js/config.js`, then regenerate `robots.txt` and `sitemap.xml`.
- If a form endpoint is connected, implement server-side validation, sanitisation, rate limiting, spam prevention and CSRF protection where applicable.
