# Databricks Field Manuals — website

Static site for the Databricks Guide Series. No framework, no npm, no build dependencies.
One optional Python step regenerates the catalogue from a single data file.

**Ready to deploy as-is.** Everything is wired: both Gumroad products, your email, your
Cloudflare analytics, and your real credentials.

```
index.html                      home
manuals/auto-loader/            free manual (47pp) — own indexable URL
manuals/lakeflow-connect/       $7.99 manual (42pp) — own indexable URL
library/                        full 51-topic catalogue
legal/                          privacy & terms
404.html
robots.txt · sitemap.xml · .nojekyll

data/catalogue.json             ALL content — edit this, not the HTML
build.py                        renders catalogue.json into the HTML
utm.py                          builds tagged campaign links
DEPLOY.md                       how to push this to GitHub
LINKS.md                        ready-to-paste LinkedIn links
assets/css/style.css            design system
assets/js/app.js                behaviour + product URLs (top of file)
assets/img/                     favicon, apple touch icon, social preview
```

**19 guides · 813 pages · 304 failure modes · 32 topics remaining · 2 on sale.**

---

## 1. Deploy

See **`DEPLOY.md`** for the full walkthrough — terminal and browser-only versions, a safety
branch so you can roll back, and the post-launch checks.

The short version:

```bash
git branch backup-old-site && git push origin backup-old-site   # rollback insurance
# replace the repo contents with these files, then:
git add -A
git commit -m "Rebuild site"
git push origin main
```

Then **Settings → Pages → Deploy from a branch → `main` / root**.
`.nojekyll` is included so GitHub doesn't run Jekyll over the folder.

No configuration is needed before going live.

### After deploying, do these four

1. Click both buy buttons and confirm Gumroad opens the right product.
2. Submit the notify form once yourself.
3. [Google Search Console](https://search.google.com/search-console) — verify, submit `sitemap.xml`.
4. Paste the URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   to confirm the preview card renders. This audience lives on LinkedIn.

---

## 2. What's already configured

| Thing | Value |
| --- | --- |
| Auto Loader product | `hakkache.gumroad.com/l/auto-loader-field-manual` |
| Lakeflow Connect product | `hakkache.gumroad.com/l/lakeflow-connect-field-manual` |
| Notify form | `hakkache.gumroad.com/subscribe` |
| Contact email | `hakkache.mohamed@gmail.com` |
| Analytics | Cloudflare Web Analytics, token `b52138e1…5469`, on all 6 pages |
| Author links | GitHub, LinkedIn |

Product URLs live in one place — `assets/js/app.js`, top of file:

```js
const PRODUCTS = {
  "auto-loader":      "https://hakkache.gumroad.com/l/auto-loader-field-manual",
  "lakeflow-connect": "https://hakkache.gumroad.com/l/lakeflow-connect-field-manual"
};
```

Every button also carries a real `href` in the HTML as a fallback, so checkout still works
if the JavaScript fails to load.

### Sending a release email

Gumroad → **Emails** → **New email** → **Published** → pick your audience → send.
Subscribers and buyers are in the same place, which is why the form points there.

---

## 3. Editing content

Everything is in `data/catalogue.json`. After editing:

```bash
python3 build.py
```

That regenerates the 51 catalogue entries, the stats bar, the release cards, both tables of
contents, the failure-mode cards, and `sitemap.xml`. Commit the result.

### Publishing manual number three

```json
{ "id": 3, "name": "Structured Streaming",
  "status": "sale", "pages": 43,
  "price": "$7.99", "priceValue": "7.99",
  "url": "https://hakkache.gumroad.com/l/structured-streaming-field-manual",
  "page": "manuals/structured-streaming/",
  "idea": "The one sentence that makes the rest predictable.",
  "blurb": "..." }
```

Add the URL to `PRODUCTS` in `app.js`, keyed `"structured-streaming"`, then run `build.py`.
The entry turns green, gains a Buy button, and every count recalculates.

For a full product page, copy `manuals/lakeflow-connect/` to `manuals/<slug>/`, update the
title, description and canonical URL, add a `tocs` and `failureModes` entry keyed by the same
slug in `catalogue.json`, then add the page to `targets` and `build_sitemap()` in `build.py`.

### Status values

| Status | Badge | Catalogue behaviour |
| --- | --- | --- |
| `sale` | green | **Download free** or **Buy — $price** button |
| `created` | amber | "Tell me when it ships" |
| `planned` | grey | ★ priority, "Ask for this one next" |
| `deferred` | faint | Listed, marked deferred |

Category roll-ups ("Complete · 174 pages", "4 of 8 written") and all five headline numbers
are computed, never typed.

---

## 4. What changed in this revision

**From your uploaded PDFs.** Having the actual manuals meant replacing guesswork with fact:

- **Both tables of contents are now the real ones** — nine parts each, with real page numbers.
  The site previously claimed a "seven-part spine". That was wrong.
- **All twelve sample failure modes are now real**, taken from part 06 of each manual — the
  STRING inference trap, the deleted checkpoint, the six silent discovery causes, the gateway
  racing log retention, the reused column name that breaks a pipeline months later.
  I had previously written plausible ones. These are yours.
- **Lakeflow Connect's organising idea corrected** to "You configure it. You do not control
  it." I had invented a different one.
- **The Lakeflow page now has sample failure modes**, which was the gap I flagged last time.
  It's the page people pay from, so proof matters more there.
- Auto Loader's three consequences (file-based, append-only, storage-only) added to its page.

**Fixed**

- The hero cover swap showed an empty frame when hovering the Lakeflow Connect button.
  Two attribute selectors had been padded with spaces to line up visually, and in CSS a space
  between selectors is a descendant combinator — so the "show this cover" rule matched nothing.
  Both states are now driven by a plain `.is-on` class from JavaScript, which cannot break the
  same way. There is a comment in `style.css` warning not to re-align those selectors.

**Requested changes**

- Hovering or focusing the Lakeflow Connect button in the hero **swaps the cover art** to the
  Lakeflow Connect cover, with the price flag changing too. Keyboard focus works the same way;
  touch devices just keep the default cover.
- About section rewritten with your real background — 8+ years, Allianz, the Mainframe/SAS to
  Databricks migration, multi-cloud, OpenLakehouse, Databricks certification. All placeholder
  brackets removed.
- Cloudflare Web Analytics added to all six pages, using your exact snippet.

**Legal page — what I added and why**

- **Cloudflare Web Analytics disclosed**, with the reason no cookie banner is needed: no
  cookies, no localStorage, no fingerprinting. If you ever swap to something cookie-based,
  this section has to change and a banner becomes necessary.
- **Gumroad named** as merchant of record, and noted as responsible for sales tax and VAT.
  Refunds are not covered on the site by choice — Gumroad's own policy applies to every sale,
  and buyers can raise a request through Gumroad directly.
- **Team and classroom licensing** invited rather than silently forbidden — it converts.
- Removed the placeholder note, the bracketed fields, and the vague "[YOUR EMAIL PROVIDER]".

---

## 5. Two things still worth doing

**Add real page images.** Your covers and interior spreads are genuinely good — the diagrams
in both PDFs especially. Three or four screenshots on each product page would convert better
than any copy I can write, because right now the site describes the design instead of showing it.

**Publish failure modes as individual pages.** You have 304 of them. Each one targets an error
message someone is pasting into Google at 3am — "UnknownFieldException", "ConcurrentAppendException",
"INCOMPATIBLE_SCHEMA_CHANGE", "auto loader skipping files". One URL per failure mode is how this
site gets found for anything other than your own name. Twelve are already written and on the site;
the pattern is established.

---

Independent educational publication. Not affiliated with or endorsed by Databricks.
