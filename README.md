# Databricks Guide Series — website

Static site for the Field Manuals publishing series.
No build step, no dependencies, no framework.

```
index.html
assets/css/style.css     design system
assets/js/catalogue.js   ALL content — edit this, not the HTML
assets/js/app.js         rendering and behaviour
.nojekyll
```

---

## Deploy to GitHub Pages

Upload all of it (keep the `assets` folder structure intact), then
**Settings → Pages → Deploy from a branch → `main` / root → Save.**

A single-file `index.html` is also provided if the folder structure
causes trouble — it has the CSS and JS inlined and needs nothing else.

---

## Connect the Auto Loader download

In `assets/js/catalogue.js`:

```js
const GUMROAD_USER = "hakkache";        // line 1 of the config block
```

Then find the Auto Loader entry and fill in its slug:

```js
{ id:1, cat:"ingestion", name:"Auto Loader", pages:47,
  status:"available", free:true, slug:"autoloader",  // <- the bit after /l/
  ...
```

Every "Get the free guide" button on the page then points at Gumroad.

---

## Releasing a manual

Everything on the page is derived from the data, so publishing is one edit:

```js
status:"planned"  ->  "soon"  ->  "available"
```

Add `slug` when it goes live, and `pages` once it's written.

The category totals, the "pages written" counts and the status badges
all recalculate themselves. **No prices appear anywhere on the site** —
add them only when you're ready, and only where a product is live.

| Status | Badge | Behaviour |
|---|---|---|
| `available` | green | Working CTA, row highlighted |
| `soon` | amber | No CTA |
| `planned` | grey | No CTA |

---

## Content locations

| What | Where |
|---|---|
| Manuals, categories, descriptions | `assets/js/catalogue.js` |
| Release order | `NEXT_RELEASES` at the bottom of that file |
| Hero copy, FAQ, About | `index.html` |
| "What's inside" grid | `INSIDE` array in `app.js` |
| Colours and type | `:root` in `style.css` |

### Statistics

The hero stats are hard-coded in `index.html` (`.stats-in`). Current values:
**16 written · 687 pages · 256 failure modes · 9 categories · 51 planned.**
Update them as the series grows.

---

## Notes

- Book covers are **CSS, not images** — they scale, stay sharp, and a new
  one is a few lines of markup.
- Responsive to 390px. Catalogue rows restack as cards.
- Keyboard focus visible, `prefers-reduced-motion` respected, semantic HTML.
- No tracking, no cookies. Two fonts from Google, nothing else.
- The footer carries the required independence disclaimer.
