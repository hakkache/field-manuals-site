#!/usr/bin/env python3
"""
Generates one indexable page per documented failure mode, plus an index at
/failures/.

Why this exists
---------------
The product pages target "Databricks Auto Loader field manual", which nobody
searches for. Engineers search for the error in front of them:
"UnknownFieldException", "auto loader skipping files", "row count doubled".
Each failure mode is a page that can rank for one of those.

Called automatically by build.py. No dependencies.
"""

import html
import json
import pathlib

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "failures"


def esc(t):
    return html.escape(str(t), quote=True)


def head(title, desc, canonical, depth=2):
    up = "../" * depth
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{esc(canonical)}">

<meta property="og:type" content="article">
<meta property="og:site_name" content="Databricks Field Manuals">
<meta property="og:url" content="{esc(canonical)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="https://hakkache.github.io/field-manuals-site/assets/img/og-cover.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="https://hakkache.github.io/field-manuals-site/assets/img/og-cover.png">

<meta name="theme-color" content="#0A0D10">
<link rel="icon" href="{up}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{up}assets/img/apple-touch-icon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{up}assets/css/style.css">
"""


def nav(depth=2):
    up = "../" * depth
    return f"""</head>

<body>
<a class="skip" href="#main">Skip to content</a>

<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a class="brand" href="{up}">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-txt">
        <span class="brand-a">Databricks Guide Series</span>
        <span class="brand-b">Field Manuals</span>
      </span>
    </a>
    <nav class="nav-links" id="nav-links" aria-label="Main">
      <a href="{up}">Home</a>
      <a href="{up}failures/">Failure index</a>
      <a href="{up}library/">Catalogue</a>
      <a href="{up}manuals/auto-loader/">Auto Loader</a>
      <a href="{up}manuals/lakeflow-connect/">Lakeflow Connect</a>
    </nav>
    <a class="btn btn-sm btn-primary nav-cta" data-buy="auto-loader" href="https://hakkache.gumroad.com/l/auto-loader-field-manual">Free manual</a>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-controls="nav-links" aria-expanded="false">
      <span></span><span></span>
    </button>
  </div>
</header>
"""


def notify_block(depth=2):
    up = "../" * depth
    return f"""
<section class="sec">
  <div class="wrap wrap-narrow">
    <div class="signup">
      <h2>Seventeen more manuals are written<span class="dot">.</span></h2>
      <p>One short email per release — what it covers and what it costs. One click to stop.</p>
      <form class="signup-form notify-form" method="POST" action="https://hakkache.gumroad.com/subscribe">
        <label class="sr-only" for="notify-email">Email address</label>
        <input id="notify-email" name="email" type="email" required autocomplete="email" placeholder="you@company.com">
        <input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn btn-primary" type="submit">Notify me</button>
      </form>
      <p class="signup-fine notify-msg" hidden></p>
      <p class="signup-fine">No sharing, no selling. <a href="{up}legal/">How your data is handled</a>.</p>
    </div>
  </div>
</section>
"""


def footer(depth=2):
    up = "../" * depth
    return f"""
<footer class="foot">
  <div class="wrap foot-legal">
    <p class="disc">Independent educational publication. Not affiliated with or endorsed by Databricks.</p>
    <p>Databricks is a trademark of Databricks, Inc. Runtime behaviour changes — verify against your own workspace.</p>
    <p>&copy; <span id="year">2026</span> Mohamed Hakkache &middot; <a href="{up}" style="color:var(--fg-2)">Field Manuals</a> &middot; <a href="{up}failures/" style="color:var(--fg-2)">Failure index</a> &middot; <a href="{up}legal/" style="color:var(--fg-2)">Privacy &amp; terms</a></p>
  </div>
</footer>

<script src="{up}assets/js/app.js" defer></script>
<!-- Cloudflare Web Analytics -->
<script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{{"token": "b52138e1d6cd45bcb4fa471087975469"}}'></script>
<!-- End Cloudflare Web Analytics -->
</body>
</html>
"""


def build_failure_page(fm, siblings, cat):
    base = "https://hakkache.github.io/field-manuals-site"
    url = f"{base}/failures/{fm['slug']}/"
    manual = fm["manualName"]
    manual_url = f"../../manuals/{fm['manual']}/"

    product = next(m for m in cat["manuals"] if m["name"] == manual)
    price = product["price"]
    pages = product["pages"]
    buy_label = "Download it free" if price == "Free" else f"Get the manual — {price}"

    desc = (fm["symptom"][:150].rsplit(" ", 1)[0] + "… Cause, fix, and what to check first.")

    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "TechArticle",
                "headline": fm["title"],
                "description": desc,
                "url": url,
                "inLanguage": "en",
                "author": {"@type": "Person", "name": "Mohamed Hakkache",
                           "url": "https://github.com/hakkache"},
                "about": f"Databricks {manual}",
                "articleSection": f"{fm['family']} failures",
                "isPartOf": {"@type": "Book", "name": f"{manual} Field Manual",
                             "url": f"{base}/manuals/{fm['manual']}/"},
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Field Manuals", "item": f"{base}/"},
                    {"@type": "ListItem", "position": 2, "name": "Failure index", "item": f"{base}/failures/"},
                    {"@type": "ListItem", "position": 3, "name": fm["h1"], "item": url},
                ],
            },
        ],
    }

    related = "\n".join(
        f'        <li class="row-rel"><a href="../{esc(s["slug"])}/">{esc(s["h1"])}</a>'
        f'<span class="rel-fam">{esc(s["family"])}</span></li>'
        for s in siblings if s["id"] != fm["id"]
    )

    out = head(fm["title"], desc, url)
    out += f'\n<script type="application/ld+json">\n{json.dumps(schema, indent=2, ensure_ascii=False)}\n</script>\n'
    out += nav()
    out += f"""
<main id="main">

<section class="page-head">
  <div class="grid-bg grid-fade" aria-hidden="true"></div>
  <div class="wrap">
    <p class="crumb"><a href="../../">Field Manuals</a><span>/</span><a href="../">Failure index</a><span>/</span>{esc(manual)}</p>
    <p class="eyebrow"><span>{esc(manual)} · {esc(fm['family'])} · failure {esc(fm['n'])} of 16</span></p>
    <h1 class="sec-title">{esc(fm['h1'])}<span class="dot">.</span></h1>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <article class="fm-card" style="max-width:900px">
      <div class="fm-head">
        <span class="fm-fam">Failure family · {esc(fm['family'])}</span>
        <span class="fm-folio">{esc(manual)} · part 06 · failure {esc(fm['n'])} of 16</span>
      </div>
      <div class="fm-rows">
        <div class="fm-row fm-row-symptom">
          <div class="fm-k">Symptom</div><div class="fm-v">{esc(fm['symptom'])}</div>
        </div>
        <div class="fm-row fm-row-cause">
          <div class="fm-k">Cause</div><div class="fm-v">{esc(fm['cause'])}</div>
        </div>
        <div class="fm-row fm-row-fix">
          <div class="fm-k">Fix</div><div class="fm-v">{esc(fm['fix'])}</div>
        </div>
      </div>
      <p class="fm-foot"><b>Check first —</b> {esc(fm['check'])}</p>
    </article>

    <div class="prose" style="margin-top:40px">
      <h2>Where this comes from</h2>
      <p>
        This is failure {esc(fm['n'])} of sixteen documented in the
        <a href="{manual_url}">{esc(manual)} Field Manual</a> — {pages} pages covering
        architecture, all sixteen failure modes with fixes, production patterns, every
        documented limit, a pre-production checklist and a cheat sheet.
      </p>
      <div class="hero-cta" style="margin-top:24px">
        <a class="btn btn-primary" data-buy="{esc(fm['manual'])}" href="{esc(product['url'])}">
          {esc(buy_label)}
          <span class="btn-meta">{pages} pages · PDF · via Gumroad</span>
        </a>
        <a class="btn btn-ghost" href="{manual_url}">See what's in it</a>
      </div>
    </div>
  </div>
</section>

<section class="sec sec-alt">
  <div class="wrap">
    <header class="sec-head">
      <p class="eyebrow"><span>Related</span></p>
      <h2 class="sec-title">Other {esc(manual)} failures<span class="dot">.</span></h2>
    </header>
    <ul class="rel-list">
{related}
    </ul>
    <p style="margin-top:24px"><a href="../" style="color:var(--teal)">All documented failures →</a></p>
  </div>
</section>
{notify_block()}
</main>
{footer()}"""
    return out


def build_index(all_modes, cat):
    base = "https://hakkache.github.io/field-manuals-site"
    url = f"{base}/failures/"
    title = "Databricks Failure Modes — Symptom, Cause and Fix"
    desc = ("Documented Databricks failure modes with symptom, cause and fix — Auto Loader "
            "schema and discovery failures, Lakeflow Connect gateway and CDC failures.")

    schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": desc,
        "url": url,
        "hasPart": [
            {"@type": "TechArticle", "headline": fm["title"],
             "url": f"{base}/failures/{fm['slug']}/"}
            for fm in all_modes
        ],
    }

    groups = {}
    for fm in all_modes:
        groups.setdefault(fm["manualName"], []).append(fm)

    body = []
    for manual, modes in groups.items():
        body.append('    <section class="cat-block">')
        body.append('      <div class="cat-head">')
        body.append(f'        <h3 class="cat-name">{esc(manual)}</h3>')
        body.append(f'        <span class="cat-count">{len(modes)} of 16 published</span>')
        body.append("      </div>")
        body.append('      <ul class="rel-list">')
        for fm in modes:
            body.append(
                f'        <li class="row-rel"><a href="{esc(fm["slug"])}/">{esc(fm["h1"])}</a>'
                f'<span class="rel-fam">{esc(fm["family"])}</span></li>'
            )
        body.append("      </ul>")
        body.append("    </section>")

    out = head(title, desc, url, depth=1)
    out += f'\n<script type="application/ld+json">\n{json.dumps(schema, indent=2, ensure_ascii=False)}\n</script>\n'
    out += nav(depth=1)
    out += f"""
<main id="main">

<section class="page-head">
  <div class="grid-bg grid-fade" aria-hidden="true"></div>
  <div class="wrap">
    <p class="crumb"><a href="../">Field Manuals</a><span>/</span>Failure index</p>
    <p class="eyebrow"><span>Diagnostic index</span></p>
    <h1 class="sec-title">Databricks failures,<br>by symptom<span class="dot">.</span></h1>
    <p class="sec-lead">
      Every entry follows the same shape: the symptom you actually see, the cause, the fix,
      and the one thing to check first. Taken from part 06 of the field manuals, where each
      topic documents sixteen of them.
    </p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
{chr(10).join(body)}
  </div>
</section>
{notify_block(depth=1)}
</main>
{footer(depth=1)}"""
    return out


def generate(cat):
    OUT.mkdir(exist_ok=True)
    all_modes = []
    written = []

    for key, modes in cat["failureModes"].items():
        for fm in modes:
            page_dir = OUT / fm["slug"]
            page_dir.mkdir(exist_ok=True)
            (page_dir / "index.html").write_text(
                build_failure_page(fm, modes, cat), encoding="utf-8"
            )
            written.append(f"/failures/{fm['slug']}/")
            all_modes.append(fm)

    (OUT / "index.html").write_text(build_index(all_modes, cat), encoding="utf-8")
    written.append("/failures/")
    return written
