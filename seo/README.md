# SEO / GEO Implementation Notes

## Primary entity
Daisy Cafe & Eatery is a cafe and eatery in Debra bazar, Paschim Medinipur, West Bengal, India 721149.

## Verified entity signals used in the website
- Website: https://www.daisycafeneatery.com/
- Phone: +91 92422 62036
- Address: Debra bazar, Paschim Medinipur, West Bengal, India 721149
- Coordinates: 22.393884579619385, 87.56485627520422
- Instagram and Facebook links are included in Organization/LocalBusiness structured data.
- Menu URL is exposed to the LocalBusiness entity.

## Local / GEO intent
Content naturally references Debra, Paschim Medinipur, NH16 and the Kolkata–Kharagpur route where relevant. It does not create doorway pages for individual nearby locations. Approximate route references are explicitly described as approximate.

## Search intent coverage
The site covers coffee, cafe, restaurant, food, dine-in, delivery, desserts, custom cakes, celebrations, birthdays, anniversaries, dates and route-stop intent where supported by the business content.

## Canonical strategy
The production domain is centralized at https://www.daisycafeneatery.com. Directory indexes use trailing-slash canonicals (`/menu/` and `/services/`). Standalone pages use their `.html` URLs. `/index.html` is not used as the homepage canonical.

## Indexing
Indexable commercial/content pages are included in `sitemap.xml`. `404.html`, `thank-you.html`, `privacy-policy.html` and `terms.html` are excluded from the sitemap; the utility/legal pages are marked `noindex,follow`.

## Structured data
- `CafeOrCoffeeShop` entity with address, geo, telephone, social profiles, cuisines and menu URL.
- `WebSite` and `WebPage` on the homepage.
- `BreadcrumbList` on inner pages.
- `Service` on service landing pages.
- `Menu` on the food menu page.
- `FAQPage` on the FAQ page, matching the visible FAQ content.
- `AboutPage` and `ContactPage` where appropriate.
- No fabricated reviews, ratings, awards, opening hours or certifications.

## Social metadata
Major pages have unique title/description, canonical, Open Graph and Twitter metadata, including image alt text and `en_IN` locale.

## GEO metadata
Indexable pages include regional metadata for `IN-WB` and the verified Debra/Paschim Medinipur coordinates. Structured data remains the primary machine-readable location signal.

## AI / entity-readable content
`/llms.txt` provides a concise factual entity summary and important URLs. It is supplementary and does not replace sitemap submission or Search Console.

## Google launch workflow
1. Deploy the production package.
2. Verify `https://www.daisycafeneatery.com/robots.txt`.
3. Verify `https://www.daisycafeneatery.com/sitemap.xml`.
4. Add the sitemap in Google Search Console.
5. Inspect the homepage and the most important service/menu URLs.
6. Request indexing for the highest-priority URLs after deployment.
7. Validate structured data with Google's Rich Results Test.
