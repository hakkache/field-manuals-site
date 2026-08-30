# Launch checklist

Run this for every manual from the third one onward. It assumes the site is live and the first
two products are selling.

Nothing here is theory — each item exists because skipping it costs either a sale or a week.

---

## Before you even pick the next manual

**Wait for data.** Give the first two products at least two weeks of live traffic before
launching a third. You are not short of manuals — you have seventeen written. You are short of
audience. Publishing into silence uses up a launch and teaches you nothing.

Answer these three questions first. If you can't, you're launching blind:

- How many people visited the site, and which page did they land on? *(Cloudflare)*
- How many downloaded the free Auto Loader manual? *(Gumroad)*
- How many of those went on to buy Lakeflow Connect? *(Gumroad, `utm_source`)*

That last ratio is your **free-to-paid conversion rate**. It's the single number that predicts
what a third product will earn. Below ~2%, fix conversion before adding inventory.

---

## Fix these before the next launch

These are one-time jobs that improve every future launch.

- [ ] **Add a final page to the free Auto Loader PDF.** It currently ends with no call to
      action. That's the highest-intent moment you get — someone who just read 47 pages and
      liked it. Point them at the paid manual and the mailing list, with UTM-tagged links.
- [ ] **Set the Gumroad receipt email** on the free product to mention the paid one.
- [ ] **Turn on the Gumroad follow prompt** so downloaders join the list automatically.
- [ ] **Email everyone who downloaded the free manual.** Ask one question: did it help, and what
      was missing? Replies become testimonials and tell you which manual to publish next.
- [ ] **Get three testimonials on the site.** Zero social proof is the biggest single obstacle
      to a $7.99 sale from a stranger.
- [ ] **Add real interior page screenshots** to both product pages. Your diagrams are the
      strongest asset you have and the site currently describes them instead of showing them.

---

## Which manual to publish next

Don't publish in catalogue order. Publish by demand.

1. **Search Console → Performance → Queries.** After a few weeks this shows the exact phrases
   people used to find you. Whatever topic appears most is your next manual.
2. **Ask the list.** One email: "which of these five is most useful to you right now?" People
   who answer are people who buy.
3. **Watch the ★★★ priorities** in `data/catalogue.json` — SQL warehouses, MLflow 3, Asset
   Bundles, Cost management, Networking, Identity & access, Hive metastore → Unity Catalog.
4. **Prefer topics adjacent to what already sold.** Someone who bought Lakeflow Connect has an
   ingestion problem. Structured Streaming and COPY INTO are the natural next purchase; MLflow
   is not.

---

## Two weeks before launch

- [ ] Technical review pass against current Databricks behaviour. Check the runtime version
      notes and anything in preview.
- [ ] Add the final cross-sell page to the new PDF, tagged with UTM.
- [ ] Set the edition date on the cover.

## One week before

- [ ] Create the Gumroad product. Same price as the others unless you have a reason.
- [ ] Write the product description. Lead with the organising idea, not a feature list.
- [ ] Upload the PDF and buy it yourself with a 100% discount code to test the whole flow.
- [ ] Add a product page under `manuals/<slug>/` — copy an existing one.
- [ ] Add `tocs` and `failureModes` entries for it in `data/catalogue.json`, keyed by slug.
- [ ] Publish **at least four real failure modes** on that page. The Lakeflow page converts
      better than the catalogue because it shows real content. Proof sells; description doesn't.
- [ ] Change `status` to `sale` in `catalogue.json`, add `price`, `url`, `page`.
- [ ] Add the product URL to `PRODUCTS` in `assets/js/app.js`.
- [ ] Add the page to `targets` and `build_sitemap()` in `build.py`.
- [ ] Run `python3 build.py`, commit, push.

## Launch day

- [ ] Click the buy button on the live site. Actually complete a purchase.
- [ ] Search Console → inspect the new page URL → **Request indexing**.
- [ ] Generate campaign links: `python3 utm.py <slug> linkedin post launch-<slug>`
- [ ] Run the new page through the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
      before posting, so the preview card is correct.
- [ ] Email the list. Short: what it covers, what it costs, one link.
- [ ] LinkedIn post — see the playbook below.

## The week after

- [ ] Check Gumroad → Analytics → which `utm_content` produced sales.
- [ ] Check Cloudflare → which pages people actually read.
- [ ] Post two more times from the same manual's failure modes.
- [ ] Write down what worked. You'll do this seventeen more times.

---

# Growth playbook

## LinkedIn

**Your manuals are your content calendar.** Every failure mode is already shaped like a post:
symptom, cause, fix. You have 304 of them. At two posts a week, that is three years of material
you have already written.

**Post format that works for this material:**

```
[The symptom, stated as something that happened to someone]

[One line: the cause. Blunt.]

[Why it happens — 2–3 sentences of the actual mechanism]

[The fix, concretely]

[One line of hard-won judgement]

Full manual in the comments 👇
```

**Carousels beat text posts.** LinkedIn gives documents far more reach than plain text, and your
diagrams — the mailbox model, the two-architecture comparison, the failure-landscape grid — are
better than most of what circulates on the platform. Export 6–8 pages as images and post them as
a document. This is your highest-ceiling format.

**Mechanics:**

- Link goes in the **first comment**, not the post body. LinkedIn suppresses posts that send
  people away. Say "link in the comments" in the last line.
- Post Tuesday–Thursday morning European time. Your audience is at work.
- Reply to every comment in the first two hours. Early engagement decides reach.
- Comment substantively on posts from Databricks, and from people in the data engineering space
  with real audiences. A good comment on a big account reaches more people than your own post.
- Never post twice in one day. It splits your own reach.

**Cadence:** two or three posts a week, every week, indefinitely. Consistency beats brilliance
here — the algorithm rewards people who show up.

**What to post between launches:**

| Type | Source | Frequency |
| --- | --- | --- |
| A failure mode | Part 06 of any manual | Weekly |
| A diagram carousel | Any manual's architecture pages | Every 2 weeks |
| A strong opinion | The "myths" and "anti-pattern" sections | Monthly |
| A launch | New manual | When it happens |

The opinion posts are underrated. "Most tables should not be partitioned at all" and "if the same
bytes arrive at the same path, you have a snapshot problem, not an incremental problem" are the
kind of thing engineers argue about in comments — and arguments are reach.

## Website

**One page per failure mode.** This is the whole strategy, and it compounds.

Nobody searches "Databricks field manuals." They paste `UnknownFieldException`,
`_rescued_data null`, `INCOMPATIBLE_SCHEMA_CHANGE`, `ConcurrentAppendException` or
`auto loader skipping files` into Google at 3am. Each of those is a page you could rank for
tomorrow, because almost nobody writes about them properly.

You already have twelve on the site as samples. The pattern is established. Publish one a week:

- Title = the actual error message or symptom
- URL = `/failures/unknownfieldexception-auto-loader/`
- Structure = symptom, cause, fix, check first
- Ends with a link to the manual it came from

Twelve of these were enough to prove the format. Fifty would change the site's traffic entirely.

**Other things worth doing, roughly in order of value:**

- **A custom domain.** `hakkache.github.io/field-manuals-site/` reads as a hobby project to
  someone deciding whether to give you money. ~$12/year.
- **Cross-post to Medium** — you already have an account. Publish the failure-mode articles
  there with a canonical link back to your site. Different audience, no extra writing.
- **Answer questions where they're asked.** Stack Overflow, r/dataengineering, the Databricks
  community forum. Answer the question properly first; link only if it genuinely adds. This is
  slow, and it's how most technical products actually found their first hundred customers.
- **A bundle, once four or more manuals are live.** "Ingestion collection — all four, $19.99."
  Bundles raise average order value more reliably than raising individual prices.

## What to measure

| Question | Where |
| --- | --- |
| Are people arriving? | Cloudflare → page views |
| Where from? | Cloudflare → referrers |
| Which page? | Cloudflare → paths |
| What did they search? | Search Console → Performance → Queries |
| Which post produced a sale? | Gumroad → Analytics → `utm_content` |
| Is the list growing? | Gumroad → Audience |

**The two numbers that matter:** free downloads per week, and free-to-paid conversion rate.
Everything else is detail.

---

## The honest summary

You have seventeen manuals written and almost no audience. That ratio is the whole problem, and
it does not get better by writing an eighteenth.

Spend the next month building the audience with content you have already written, and launch the
third manual to people who are waiting for it rather than to nobody.
