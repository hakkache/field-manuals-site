# Campaign links

Ready-to-paste URLs for LinkedIn and anywhere else you post.
Generate new ones with `python3 utm.py` — see the bottom of this file.

---

## Read this first: where UTMs actually show up

| Destination | Does UTM work? | Where you read it |
| --- | --- | --- |
| **Gumroad product pages** | ✅ Yes | Gumroad → Analytics. It creates the UTM link automatically the first time someone clicks it. |
| **Gumroad subscribe page** | ✅ Yes | Same place. |
| **Your site** (github.io) | ❌ Not today | Cloudflare Web Analytics does not log query strings, by design — it avoids collecting anything potentially sensitive. |

**What this means in practice.** Tagging a Gumroad link tells you which LinkedIn post produced a
sale. Tagging a site link tells you nothing *right now*, because Cloudflare throws the query
string away before it reports.

Two ways to handle site traffic:

1. **Send different posts to different pages.** Cloudflare logs the *path*, so if post A links to
   `/manuals/auto-loader/` and post B links to `/library/`, you can tell them apart. This works
   today with no extra setup and is why the tables below suggest a page per campaign.
2. **Tag them anyway.** The UTMs cost nothing, they don't affect SEO (every page has a
   `rel="canonical"` pointing at the clean URL, so Google won't index the tagged variants), and
   the day you add Plausible, Umami or GA4 the history starts working retroactively from that
   point forward.

---

## The naming scheme

```
utm_source    where it came from        linkedin
utm_medium    what kind of link         post · comment · profile · dm · newsletter
utm_campaign  what you're promoting     autoloader-free · lakeflow-launch · series-intro
utm_content   which specific post       a short slug, e.g. checkpoint-story
```

Keep everything lowercase with hyphens. `LinkedIn` and `linkedin` count as two different
sources in every analytics tool, and it's a mess to clean up later.

`utm_content` is the one that earns its keep. Source and medium will be the same on every
LinkedIn post you ever write — `utm_content` is what tells post-from-2-March apart from
post-from-9-March.

---

## Selling links — these are the ones that matter

Sales attribution works here. Use these whenever the call to action is "get the manual".

**Auto Loader (free) — from a LinkedIn post**
```
https://hakkache.gumroad.com/l/auto-loader-field-manual?utm_source=linkedin&utm_medium=post&utm_campaign=autoloader-free&utm_content=REPLACE-ME
```

**Auto Loader (free) — from a comment under your own post**
```
https://hakkache.gumroad.com/l/auto-loader-field-manual?utm_source=linkedin&utm_medium=comment&utm_campaign=autoloader-free&utm_content=REPLACE-ME
```

**Auto Loader (free) — from your LinkedIn featured section or profile**
```
https://hakkache.gumroad.com/l/auto-loader-field-manual?utm_source=linkedin&utm_medium=profile&utm_campaign=autoloader-free&utm_content=featured
```

**Lakeflow Connect ($7.99) — from a LinkedIn post**
```
https://hakkache.gumroad.com/l/lakeflow-connect-field-manual?utm_source=linkedin&utm_medium=post&utm_campaign=lakeflow-launch&utm_content=REPLACE-ME
```

**Lakeflow Connect ($7.99) — from a comment**
```
https://hakkache.gumroad.com/l/lakeflow-connect-field-manual?utm_source=linkedin&utm_medium=comment&utm_campaign=lakeflow-launch&utm_content=REPLACE-ME
```

**Mailing list**
```
https://hakkache.gumroad.com/subscribe?utm_source=linkedin&utm_medium=post&utm_campaign=notify-list&utm_content=REPLACE-ME
```

Swap `REPLACE-ME` for a slug describing that specific post — `checkpoint-duplicates`,
`rescued-data`, `gateway-retention`. You'll thank yourself in three months.

---

## Site links — pick a different page per campaign

Cloudflare won't show the UTM values, but it **does** log the page path — so vary the
destination, not just the tag, and the path tells you which post sent the visitor.

**The tag is not wasted.** `app.js` carries any `utm_*` on the page URL across to the Gumroad
button, so a LinkedIn visitor who lands on your site and then buys still shows up in Gumroad as
`utm_source=linkedin`. Without that, Gumroad would record the referrer as your own site and the
LinkedIn credit would vanish at the hop.

If someone arrives with no tag at all — organic search, a bare link — the buttons send
`utm_source=website&utm_medium=referral&utm_campaign=<page>` instead, so you can still separate
site-driven sales from people who went to Gumroad directly.

**Homepage — general "I published a series" post**
```
https://hakkache.github.io/field-manuals-site/?utm_source=linkedin&utm_medium=post&utm_campaign=series-intro&utm_content=REPLACE-ME
```

**Auto Loader page — a post about an ingestion failure**
```
https://hakkache.github.io/field-manuals-site/manuals/auto-loader/?utm_source=linkedin&utm_medium=post&utm_campaign=autoloader-free&utm_content=REPLACE-ME
```

**Lakeflow Connect page — a post about gateways or CDC**
```
https://hakkache.github.io/field-manuals-site/manuals/lakeflow-connect/?utm_source=linkedin&utm_medium=post&utm_campaign=lakeflow-launch&utm_content=REPLACE-ME
```

**Catalogue — a post about the roadmap or "what should I write next"**
```
https://hakkache.github.io/field-manuals-site/library/?utm_source=linkedin&utm_medium=post&utm_campaign=roadmap&utm_content=REPLACE-ME
```

---

## Other channels

**GitHub profile README**
```
https://hakkache.github.io/field-manuals-site/?utm_source=github&utm_medium=profile&utm_campaign=series-intro&utm_content=readme
```

**Medium article footer**
```
https://hakkache.gumroad.com/l/auto-loader-field-manual?utm_source=medium&utm_medium=article&utm_campaign=autoloader-free&utm_content=REPLACE-ME
```

**Email signature**
```
https://hakkache.github.io/field-manuals-site/?utm_source=email&utm_medium=signature&utm_campaign=series-intro&utm_content=sig
```

**Reddit / Discord / Slack communities** — change `utm_source` to the community name so you can
see which ones are worth your time:
```
https://hakkache.gumroad.com/l/auto-loader-field-manual?utm_source=reddit&utm_medium=comment&utm_campaign=autoloader-free&utm_content=r-dataengineering
```

---

## Two LinkedIn mechanics worth knowing

**Links in the post body get less reach.** LinkedIn's feed favours posts that keep people on
LinkedIn. The common workaround is to write the post with no link, then put the link in the first
comment and say so in the last line ("link in the comments"). That's why there's a
`utm_medium=comment` variant above — so you can measure whether it actually works for you rather
than taking the internet's word for it.

**The preview card is already handled.** Your `og:image` renders a proper 1200×630 card. If you
edit a page's title or description, run the URL through the
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to clear LinkedIn's cache —
it holds the old preview for about a week otherwise.

---

## Generating new links

```bash
python3 utm.py                          # interactive
python3 utm.py autoloader linkedin post checkpoint-duplicates
python3 utm.py --list                   # show all destination shortcuts
```

No dependencies. Run it, paste the result.
