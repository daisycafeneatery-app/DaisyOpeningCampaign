# Daisy Cafe & Eatery — Production Static Website

A mobile-first, build-free HTML5/CSS3/Vanilla JavaScript website for Daisy Cafe & Eatery, Debra, Paschim Medinipur, West Bengal.

## 1. Project overview

The site is designed around a premium editorial cafe aesthetic using white, dark espresso, deep green and restrained bronze/copper accents. It includes the supplied Daisy logo, supplied celebration/dining imagery, supplied coffee/espresso reference and menu information from the supplied drinks and food PDFs.

No Node.js, npm, React, Vue, Angular, Vite, Webpack or runtime build step is required.

## 2. Folder structure

```text
/
├── index.html
├── 404.html
├── about.html
├── contact.html
├── faq.html
├── privacy-policy.html
├── terms.html
├── thank-you.html
├── favicon.svg
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── _headers
├── .htaccess
├── .nojekyll
├── CONFIG.md
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   └── app.js
├── Coffee/
│   └── daisy-coffee.html
├── menu/
│   ├── index.html
│   ├── food.html
│   ├── desserts-cakes.html
│   └── order.html
├── services/
│   ├── index.html
│   ├── dine-in.html
│   ├── food-delivery.html
│   ├── celebration-and-custom-cake.html
│   ├── facilities.html
│   └── coffee-and-drinks.html
├── assets/images/logo/
├── assets/images/gallery/
├── assets/images/social/
└── seo/
    └── README.md
```

## 3. Replace the logo

Replace `assets/images/logo/logo.webp` with the production logo. Keep the filename for the easiest replacement. The header has a text fallback if the image cannot load.

## 4. Replace images

Replace files in `assets/images/` with your actual project photography while preserving filenames, or update the corresponding `<img>` paths. Current images are supplied Daisy Cafe & Eatery photographs/reference assets.

Do not replace supplied customer/celebration photographs with stock images presented as if they were Daisy photographs.

## 5. Update phone

Edit `js/config.js`:

```js
phone: '+91 92422 62036',
phoneHref: 'tel:+919242262036',
```

Update any WhatsApp number at the same time.

## 6. Update WhatsApp

Edit `whatsapp`, `whatsappNumber` in `js/config.js`. The WhatsApp number must contain digits only in `whatsappNumber`.

## 7. Update email

Edit `email` in `js/config.js` and update any static mailto links if the visible business address changes.

## 8. Update address

Edit `address`, `city`, `region`, `postalCode`, `latitude`, `longitude` and `mapsUrl` in `js/config.js` when the verified business details change.

## 9. Update domain

Edit `website` and `siteUrl` in `js/config.js`. Then update `sitemap.xml`, `robots.txt`, canonical tags and Open Graph URLs.

## 10. Configure form endpoint

Set `formEndpoint` in `js/config.js`. The frontend sends JSON with the form fields plus UTM attribution, landing page and referrer. The backend must validate and sanitise all data and enforce rate limiting and spam protection.

If the endpoint is blank, enquiry forms use WhatsApp as a graceful fallback.

## 11. Configure GA4

Set `ga4MeasurementId` in `js/config.js`. The website already exposes analytics hooks for page views, CTA clicks, calls, WhatsApp, map clicks and form submissions. Add the Google tag only when the business has approved analytics and the required privacy approach.

## 12. Update sitemap

`sitemap.xml` uses the production domain `https://www.daisycafeneatery.com`. If the domain changes, update every `<loc>` value and the robots sitemap line.

## 13. Deploy

### GitHub Pages
1. Create/open the repository.
2. Upload the extracted project files, not the ZIP itself.
3. Keep `index.html` at the repository root.
4. Enable Pages from the repository's Pages settings.
5. If using a custom domain, configure the repository Pages domain and DNS at the domain registrar.
6. `.nojekyll` is included so static assets are served without Jekyll processing.

### Netlify / Cloudflare Pages / Vercel static hosting
Upload the folder or connect the repository. No build command is required. Publish the project root.

### Apache / Nginx / shared hosting
Upload the contents of the project directory to the public web root. `.htaccess` is optional and not required for the site to function.

## 14. Test

Test at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 px widths.

Check:
- navigation and mobile menu
- reservation modal
- reservation WhatsApp handoff
- food delivery location check
- cart quantity controls
- delivery checkout and WhatsApp handoff
- forms and validation
- every internal link
- all images and alt text
- keyboard focus
- reduced-motion behavior
- sitemap and robots
- canonical URLs
- JSON-LD validity

## 15. SEO checklist

- One H1 per page
- Unique titles and descriptions
- Canonical URL on every HTML page
- Open Graph and Twitter metadata
- Breadcrumbs on inner pages
- Page-specific JSON-LD
- No fabricated testimonials or statistics
- Natural local relevance for Debra, Balichak, Kharagpur, Medinipur, Kolaghat and the Kolkata–Kharagpur route
- No doorway pages
- Contextual internal links
- Sitemap and robots.txt

## 16. Core Web Vitals checklist

Target LCP ≤ 2.5s, INP < 200ms and CLS < 0.1.

The hero image is eager-loaded; below-fold images are lazy-loaded with dimensions; JavaScript is deferred; maps are represented as lightweight previews and only linked out to Google Maps.

## 17. Production launch checklist

- [ ] Verify phone, WhatsApp and email
- [ ] Verify business address and coordinates
- [ ] Replace/approve production photography
- [ ] Replace/approve logo asset
- [ ] Confirm menu and pricing are current
- [ ] Connect and test form endpoint if required
- [ ] Configure GA4 if required
- [ ] Verify domain and canonical URLs
- [ ] Submit sitemap in Google Search Console
- [ ] Test WhatsApp reservation and ordering messages
- [ ] Test delivery-radius behavior
- [ ] Run Lighthouse/PageSpeed and accessibility checks
- [ ] Test on real mobile devices

## Supplied source basis

Business contact information and menu/brand claims in this project were taken from the supplied Daisy Cafe & Eatery reference materials. The supplied drinks menu provides the coffee, tea, cold brew, frappe, iced tea, soft drink, shake and dessert items/prices; the supplied food menu provides the food categories and pricing. The supplied loyalty card states a 50% off benefit on the 10th coffee and references Italian Astoria Espresso Technology.
