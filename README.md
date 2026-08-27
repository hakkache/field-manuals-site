# Databricks Field Manuals — storefront

A static site for selling the guide series. No build step, no dependencies.
Drop it in a repo, turn on GitHub Pages, done.

```
index.html
assets/
  css/style.css      design system, derived from the guide covers
  js/catalogue.js    all product data — edit this, not the HTML
  js/app.js          rendering and behaviour
.nojekyll            stops GitHub Pages ignoring the assets folder
```

---

## 1 · Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Field Manuals storefront"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `root` → Save.**

The site goes live at `https://YOUR-USERNAME.github.io/YOUR-REPO/` in about a minute.

**For a `username.github.io` root site**, name the repo exactly `YOUR-USERNAME.github.io`
and it serves from `https://YOUR-USERNAME.github.io/`.

### Custom domain

Add a file called `CNAME` containing just your domain (`fieldmanuals.dev`), then point
a `CNAME` DNS record at `YOUR-USERNAME.github.io`. Enable **Enforce HTTPS** in Pages settings.

---

## 2 · Wire up Gumroad

Everything is driven by `assets/js/catalogue.js`.

**Step one — set your Gumroad username**, at the top of the file:

```js
const GUMROAD_USER = "hakkache";   // from https://hakkache.gumroad.com
```

**Step two — add the product slug** to anything you've published. The slug is the bit
after `/l/` in your Gumroad product URL.

```js
// A product with a slug gets a working buy button.
{ id: 1, cat: "ingestion", name: "Auto Loader", price: 0, status: "free",
  pages: 47, slug: "autoloader", ... }

// A product with no slug renders as "Coming soon".
{ id: 2, cat: "ingestion", name: "Lakeflow Connect", price: 9.99, status: "soon", ... }
```

Do the same for the three tiers in `COLLECTIONS` and the nine `BUNDLES`.

That's the whole integration. No API keys, no embed script.

---

## 3 · Releasing a guide

Three edits in `catalogue.js`:

1. Change `status: "soon"` → `status: "ready"`
2. Add the `slug`
3. Add `pages`, plus an `idea` and `hook` if you want it to show its organising idea

The coverage board, the category counts and the bundle "written" numbers all
recalculate on their own — they're derived from the data, not hard-coded.

### Making something free

Set `price: 0` and `status: "free"`. It moves to the top of the catalogue and
gets the teal "Get it free" treatment.

---

## 4 · Editing content

| What | Where |
|---|---|
| Prices, guides, bundles, tiers | `assets/js/catalogue.js` |
| Hero headline, FAQ, section copy | `index.html` |
| Colours, type, spacing | `:root` in `assets/css/style.css` |
| Stats in the hero | `index.html`, `.hero-stats` |

### The palette

Taken from the guide covers, so the site and the PDFs match:

```css
--ink-700:#0B1F2A   /* cover ground        */
--signal:#DC4B33    /* the accent dot      */
--gate:#7FB3C6      /* labels, hairlines   */
--flow:#3FBFA9      /* free / shipped      */
--gold:#E0A22E      /* warnings            */
--iris:#7C88E0      /* bundles             */
```

Each category carries one of these as its accent. Change `accent` on a category in
`catalogue.js` and its board card, catalogue rows and bundle card all follow.

---

## Author links

The portfolio URL appears in four places, all pointing at
`https://hakkache.github.io/hakkache-Med` and opening in a new tab:

| Where | What it is |
|---|---|
| `#author` section | "Visit my portfolio" button, and the whole profile card |
| Footer byline | "Written and designed by Hakkache Mohamed ↗" |
| Footer About column | "Portfolio ↗" |

To change it, search `index.html` for `hakkache-Med` and replace all four.

---

## Notes

- **The hero cover is HTML, not an image.** It renders live in the same visual language
  as the real covers. To feature a different guide, edit the `.cover` block in `index.html`.
- **Responsive** down to 390px. The catalogue table becomes cards on mobile.
- **Accessible**: keyboard focus is visible, `prefers-reduced-motion` is respected,
  and the nav collapses to a labelled toggle.
- **No tracking, no cookies, no dependencies.** Two fonts from Google, nothing else.
