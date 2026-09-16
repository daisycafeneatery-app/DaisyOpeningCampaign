# QA Report

Validation performed before packaging:

- 19 HTML pages generated.
- All HTML pages have exactly one H1.
- All HTML pages have title, meta description, viewport and canonical tags.
- All pages have `lang="en"`.
- Open Graph and Twitter metadata are present.
- JSON-LD blocks parse as valid JSON.
- Sitemap parses as valid XML.
- Web manifest parses as valid JSON.
- `js/config.js` and `js/app.js` pass Node syntax validation.
- Duplicate HTML IDs: none detected.
- Relative local `href` / `src` references: all resolve to existing project files.
- Image assets: all open successfully; supplied raster images were converted to WebP for web delivery.
- Static HTTP smoke test: all 28 tested project text/static files returned HTTP 200 from a local static server.
- No `example.com` or unrelated real-estate/Kangroos content remains in the project.
- Sitemap excludes non-indexable thank-you/404 pages.
- No aggregateRating, fabricated testimonials, awards, certifications or other unsupported structured-data claims were added.

## Manual launch checks still required

- Verify live domain and DNS.
- Verify menu/pricing against the latest printed menu.
- Test WhatsApp on mobile and desktop.
- Test browser geolocation on HTTPS and confirm the 8 km service boundary.
- Test the configured form endpoint if one is connected.
- Run Lighthouse/PageSpeed and WCAG checks on the deployed URL.
- Test with real devices at the target breakpoints.
