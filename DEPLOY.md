# Pushing this to GitHub

You already have `hakkache/field-manuals-site` with the old site in it. These steps replace the
contents, keeping the full history so nothing is lost and you can roll back.

Pick **Option A** if you're comfortable in the terminal. **Option B** does the same thing in the
browser. Both end in the same place.

---

## Option A — terminal

### 1. Clone the repo (or open your existing clone)

```bash
cd ~/Downloads
git clone https://github.com/hakkache/field-manuals-site.git
cd field-manuals-site
```

If you already have a clone, use it and pull first:

```bash
cd path/to/field-manuals-site
git checkout main
git pull
```

### 2. Take a safety branch first

One command, and it means you can always get the old site back.

```bash
git branch backup-old-site
git push origin backup-old-site
```

### 3. Clear the old files, keeping git's own folder

```bash
# macOS / Linux
find . -mindepth 1 -not -path './.git*' -delete

# Windows PowerShell
Get-ChildItem -Force -Exclude .git | Remove-Item -Recurse -Force
```

### 4. Copy the new site in

Unzip `field-manuals-site.zip` and copy everything from **inside** the
`field-manuals-site/` folder into your repo root — not the folder itself.

`index.html` must sit at the repo root. If you end up with
`field-manuals-site/field-manuals-site/index.html`, you've nested it one level too deep and
GitHub Pages will 404.

Check:

```bash
ls
# expected: index.html  404.html  robots.txt  sitemap.xml  README.md  LINKS.md
#           DEPLOY.md  build.py  utm.py  assets/  data/  library/  legal/  manuals/
```

### 5. Commit and push

```bash
git add -A
git status          # scan the list before committing
git commit -m "Rebuild site: real catalogue, two products, sample failure modes, analytics"
git push origin main
```

### 6. Turn on Pages

**Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save.**

First build takes a minute or two. Then open:
<https://hakkache.github.io/field-manuals-site/>

---

## Option B — browser only

1. Go to <https://github.com/hakkache/field-manuals-site>.
2. **Add file → Upload files.**
3. Unzip the archive locally, then drag everything from **inside** the `field-manuals-site`
   folder into the upload area. Include the `assets`, `data`, `library`, `legal` and `manuals`
   folders — GitHub preserves the structure.
4. Commit message: `Rebuild site`. Commit directly to `main`.
5. Delete any leftover files from the old version that the upload didn't overwrite.
6. **Settings → Pages → Deploy from a branch → `main` / root.**

One catch: browser uploads can't create the `.nojekyll` file, because GitHub's UI hides
dotfiles. Add it manually — **Add file → Create new file**, name it `.nojekyll`, leave it empty,
commit. Without it Jekyll may skip files beginning with an underscore.

---

## Checks after it goes live

Work through these in order. The first three take a minute.

- [ ] Open the site. The hero loads and the catalogue shows all 51 topics.
- [ ] Hover the **Lakeflow Connect — $7.99** button. The cover swaps and the badge turns amber.
- [ ] Click both buy buttons. Each opens the right Gumroad product.
- [ ] Open `/library/`, `/manuals/auto-loader/`, `/manuals/lakeflow-connect/`, `/legal/`.
- [ ] Visit a URL that doesn't exist — you should get the styled 404, not GitHub's.
- [ ] Submit the notify form once yourself.
- [ ] Check Cloudflare Web Analytics shows your own visit after a few minutes.

Then, once:

- [ ] [Google Search Console](https://search.google.com/search-console) — add the property,
      verify, submit `https://hakkache.github.io/field-manuals-site/sitemap.xml`.
- [ ] [Bing Webmaster Tools](https://www.bing.com/webmasters) — import from Search Console.
- [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) — paste the URL and
      confirm the preview card renders. Do this **before** your first post; LinkedIn caches
      previews for about a week.

---

## If something's wrong

**Page is 404 after enabling Pages.** Give it two minutes. If it persists, check that
`index.html` is at the repo root, not in a subfolder. Look at the repo's file list on GitHub —
you should see `index.html` immediately, no folder to open first.

**Site loads but has no styling.** The `assets` folder didn't upload. It should contain
`css/style.css`, `js/app.js` and four files in `img/`.

**Buttons don't open Gumroad.** Check `assets/js/app.js` loaded — open your browser's dev tools
(F12) and look at the Console tab for errors. Every button also has a plain `href` fallback, so
they should work even if the script fails.

**I want the old site back.**

```bash
git checkout backup-old-site
git push origin backup-old-site:main --force
```

That's what step 2 was for.

---

## Updating later

```bash
# edit data/catalogue.json, then:
python3 build.py
git add -A
git commit -m "Publish Structured Streaming manual"
git push
```

Pages redeploys automatically on push, usually within a minute.

---

## Before your first LinkedIn post

Use the tagged links in `LINKS.md` rather than the plain URLs. Gumroad will tell you which post
produced which sale, and that's the only way to learn what your audience actually responds to.

```bash
python3 utm.py autoloader linkedin post my-post-slug
```
