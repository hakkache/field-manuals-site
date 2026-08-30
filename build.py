#!/usr/bin/env python3
"""
Databricks Field Manuals — static build step.

Reads data/catalogue.json and writes the rendered HTML back into the pages,
between <!--BUILD:name--> and <!--/BUILD:name--> markers.

Why this exists
---------------
The old site injected the catalogue with client-side JavaScript, so search
engines and social crawlers saw an empty page where 51 manual titles should
have been. This renders the same data to real HTML at build time, keeping one
source of truth without giving up crawlability.

Usage
-----
    python3 build.py

Run it after editing data/catalogue.json, then commit the result.
No dependencies. Python 3.8+.
"""

import html
import json
import pathlib
import re
import sys
from datetime import date

ROOT = pathlib.Path(__file__).parent
DATA = ROOT / "data" / "catalogue.json"

STATUS_LABEL = {
    "sale": "On sale",
    "created": "Written",
    "planned": "Not created",
    "deferred": "Deferred",
}
BUILT = ("sale", "created")
STARS = {3: "\u2605\u2605\u2605", 2: "\u2605\u2605", 1: "\u2605"}


def esc(text):
    return html.escape(str(text), quote=True)


# ── Renderers ────────────────────────────────────────────────────────────────

def render_stats(cat):
    built = [m for m in cat["manuals"] if m["status"] in BUILT]
    stats = [
        (len(built), "Guides written"),
        (sum(m["pages"] for m in built), "Pages created"),
        (len(built) * cat["site"]["failureModesPerManual"], "Failure modes documented"),
        (len([m for m in cat["manuals"] if m["status"] == "sale"]), "On sale now"),
        (len(cat["manuals"]) - len(built), "Topics remaining"),
    ]
    return "\n".join(
        f'      <div class="stat"><dt>{n}</dt><dd>{esc(label)}</dd></div>'
        for n, label in stats
    )


def render_author_stats(cat):
    built = [m for m in cat["manuals"] if m["status"] in BUILT]
    pairs = [
        (len(built), "Written"),
        (sum(m["pages"] for m in built), "Pages"),
        (len(cat["categories"]), "Categories"),
    ]
    return "\n".join(
        f"        <span><b>{n}</b><span>{esc(label)}</span></span>" for n, label in pairs
    )


def _summary_line(items):
    """Category roll-up line, mirroring the master catalogue sheet."""
    done = [m for m in items if m["status"] in BUILT]
    pages = sum(m["pages"] for m in done)
    if len(done) == len(items):
        return "complete", f"Complete \u00b7 {pages} pages"
    if not done:
        return "none", "Nothing written yet"
    top = [m for m in items if m["status"] == "planned" and m.get("priority") == 3]
    tail = "" if top else " \u00b7 no \u2605\u2605\u2605 left"
    return "partial", f"{len(done)} of {len(items)} written \u00b7 {pages} pages{tail}"


def _cta(m, base):
    """The action row inside an expanded catalogue entry."""
    out = []
    if m["status"] == "sale":
        free = m.get("priceValue") == "0"
        label = "Download free" if free else f"Buy \u2014 {m['price']}"
        meta = "PDF \u00b7 via Gumroad" if free else "PDF \u00b7 one-time \u00b7 via Gumroad"
        key = m.get("page", "").strip("/").split("/")[-1]
        out.append(
            f'              <a class="btn btn-primary btn-sm" data-buy="{esc(key)}" '
            f'href="{esc(m["url"])}" target="_blank" rel="noopener">'
            f'{esc(label)}<span class="btn-meta">{esc(meta)}</span></a>'
        )
        if m.get("page"):
            out.append(
                f'              <a class="btn btn-ghost btn-sm" href="{base}{esc(m["page"])}">'
                f'Read more first</a>'
            )
    elif m["status"] == "created":
        out.append(
            '              <a class="btn btn-ghost btn-sm" href="#notify">'
            'Tell me when it ships<span class="btn-meta">written \u00b7 not yet published</span></a>'
        )
    else:
        out.append(
            '              <a class="btn btn-ghost btn-sm" href="#notify">'
            'Ask for this one next</a>'
        )
    return "\n".join(out)


def render_catalogue(cat, base=""):
    by_cat = {c["id"]: [] for c in cat["categories"]}
    for m in cat["manuals"]:
        by_cat[m["cat"]].append(m)

    out = []
    for c in cat["categories"]:
        items = by_cat[c["id"]]
        state, summary = _summary_line(items)
        done = len([m for m in items if m["status"] in BUILT])

        out.append(
            f'    <section class="cat-block" data-cat-block '
            f'style="--cc:var(--{c["colour"]})">'
        )
        out.append('      <div class="cat-head">')
        out.append(f'        <span class="cat-n">{esc(c["n"])}</span>')
        out.append(f'        <h3 class="cat-name">{esc(c["name"])}</h3>')
        out.append(f'        <span class="cat-count">{done}/{len(items)}</span>')
        out.append("      </div>")
        out.append(f'      <p class="cat-desc">{esc(c["desc"])}</p>')
        out.append(f'      <p class="cat-sum cat-sum-{state}">{esc(summary)}</p>')
        if c.get("note"):
            out.append(f'      <p class="cat-note">{esc(c["note"])}</p>')

        out.append('      <div class="mans">')
        for m in items:
            st = m["status"]
            pages = f'{m["pages"]} pages' if m.get("pages") else "\u2014"
            fm = (
                f'{cat["site"]["failureModesPerManual"]} failure modes'
                if m.get("pages") else "not yet scoped"
            )
            prio = STARS.get(m.get("priority", 0), "")

            out.append(f'        <details class="man man-{st}" data-status="{st}">')
            out.append('          <summary class="man-head">')
            out.append(f'            <span class="man-n">{m["id"]:02d}</span>')
            out.append(f'            <span class="man-name">{esc(m["name"])}</span>')
            if st == "sale":
                out.append(f'            <span class="man-price">{esc(m["price"])}</span>')
            elif prio:
                out.append(
                    f'            <span class="man-prio" title="Priority">{prio}</span>'
                )
            out.append(f'            <span class="man-pages">{esc(pages)}</span>')
            out.append(
                f'            <span class="badge badge-{st}">{esc(STATUS_LABEL[st])}</span>'
            )
            out.append('            <span class="man-chev" aria-hidden="true"></span>')
            out.append("          </summary>")

            out.append('          <div class="man-body">')
            if m.get("idea"):
                out.append(f'            <p class="man-idea">{esc(m["idea"])}</p>')
            out.append(f'            <p class="man-blurb">{esc(m["blurb"])}</p>')
            out.append('            <dl class="man-meta">')
            out.append(f'              <div><dt>Length</dt><dd>{esc(pages)}</dd></div>')
            out.append(f'              <div><dt>Reference</dt><dd>{esc(fm)}</dd></div>')
            out.append(
                f'              <div><dt>Category</dt><dd>{esc(c["n"])} \u2014 {esc(c["name"])}</dd></div>'
            )
            out.append("            </dl>")
            out.append('            <div class="man-cta">')
            out.append(_cta(m, base))
            out.append("            </div>")
            out.append("          </div>")
            out.append("        </details>")
        out.append("      </div>")
        out.append("    </section>")
    return "\n".join(out)


def render_next(cat):
    index = {m["id"]: m for m in cat["manuals"]}
    out = []
    for pos, mid in enumerate(cat["nextReleases"], start=1):
        m = index[mid]
        label = "Out now" if m["status"] == "sale" else f"Next \u00b7 {pos:02d}"
        out.append('      <article class="nx rv">')
        out.append(f'        <p class="nx-q">{esc(label)}</p>')
        out.append(f'        <h3>{esc(m["name"])}</h3>')
        out.append(f'        <p>{esc(m["blurb"])}</p>')
        out.append(
            f'        <span class="badge badge-{m["status"]}">{esc(STATUS_LABEL[m["status"]])}</span>'
        )
        out.append("      </article>")
    return "\n".join(out)


def render_toc(cat, key):
    out = []
    for part in cat["tocs"][key]:
        out.append("        <li>")
        out.append(f'          <span class="toc-n">{esc(part["n"])}</span>')
        out.append("          <div>")
        out.append(f'            <h3>{esc(part["t"])}</h3>')
        out.append(f'            <p>{esc(part["d"])}</p>')
        out.append("          </div>")
        out.append(f'          <span class="toc-p">p.{esc(part["p"])}</span>')
        out.append("        </li>")
    return "\n".join(out)


def render_fm_chips(cat, key):
    out = []
    for i, fm in enumerate(cat["failureModes"][key]):
        sel = "true" if i == 0 else "false"
        tabindex = "0" if i == 0 else "-1"
        out.append(
            f'          <button class="chip" type="button" data-fm="{esc(fm["id"])}" '
            f'id="tab-{esc(fm["id"])}" role="tab" aria-controls="panel-{esc(fm["id"])}" '
            f'aria-selected="{sel}" tabindex="{tabindex}">{esc(fm["query"])}</button>'
        )
    return "\n".join(out)


def _fm_card(fm, manual, folio, indent, hidden=False):
    pad = " " * indent
    out = []
    out.append(
        f'{pad}<article class="fm-card" data-fm-card="{esc(fm["id"])}" '
        f'id="panel-{esc(fm["id"])}" role="tabpanel" '
        f'aria-labelledby="tab-{esc(fm["id"])}" tabindex="0">'
    )
    out.append(f'{pad}  <div class="fm-head">')
    out.append(f'{pad}    <span class="fm-fam">Failure family \u00b7 {esc(fm["family"])}</span>')
    out.append(f'{pad}    <span class="fm-folio">{esc(folio)}</span>')
    out.append(f"{pad}  </div>")
    out.append(f'{pad}  <div class="fm-rows">')
    for k, label in (("symptom", "Symptom"), ("cause", "Cause"), ("fix", "Fix")):
        out.append(f'{pad}    <div class="fm-row fm-row-{k}">')
        out.append(f'{pad}      <div class="fm-k">{label}</div>')
        out.append(f'{pad}      <div class="fm-v">{esc(fm[k])}</div>')
        out.append(f"{pad}    </div>")
    out.append(f"{pad}  </div>")
    out.append(f'{pad}  <p class="fm-foot"><b>Check first \u2014</b> {esc(fm["check"])}</p>')
    out.append(f"{pad}</article>")
    return "\n".join(out)


def render_fm_cards(cat, key, manual):
    return "\n".join(
        _fm_card(fm, manual, f'{manual} \u00b7 part 06 \u00b7 failure {fm["n"]} of 16', 8)
        for fm in cat["failureModes"][key]
    )


def render_fm_prose(cat, key, manual):
    return "\n".join(
        _fm_card(fm, manual, f'Failure {fm["n"]} of 16', 6)
        for fm in cat["failureModes"][key]
    )


def render_faq_schema(cat, faqs):
    payload = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in faqs
        ],
    }
    return json.dumps(payload, indent=2, ensure_ascii=False)


# ── Marker injection ─────────────────────────────────────────────────────────

def inject(path, name, content):
    if not path.exists():
        return False
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(
        r"(<!--BUILD:%s-->)(.*?)(<!--/BUILD:%s-->)" % (re.escape(name), re.escape(name)),
        re.DOTALL,
    )
    if not pattern.search(text):
        return False
    new = pattern.sub(lambda m: m.group(1) + "\n" + content + "\n" + m.group(3), text)
    if new != text:
        path.write_text(new, encoding="utf-8")
    return True


def build_sitemap(cat):
    base = cat["site"]["baseUrl"].rstrip("/")
    pages = [
        ("/", "1.0", "weekly"),
        ("/manuals/auto-loader/", "0.9", "monthly"),
        ("/manuals/lakeflow-connect/", "0.9", "monthly"),
        ("/library/", "0.8", "weekly"),
        ("/legal/", "0.3", "yearly"),
    ]
    today = date.today().isoformat()
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, priority, freq in pages:
        lines += [
            "  <url>",
            f"    <loc>{base}{loc}</loc>",
            f"    <lastmod>{today}</lastmod>",
            f"    <changefreq>{freq}</changefreq>",
            f"    <priority>{priority}</priority>",
            "  </url>",
        ]
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    if not DATA.exists():
        sys.exit("data/catalogue.json not found")
    cat = json.loads(DATA.read_text(encoding="utf-8"))

    targets = {
        "index.html": [
            ("stats", render_stats(cat)),
            ("authorstats", render_author_stats(cat)),
            ("catalogue", render_catalogue(cat, base="")),
            ("next", render_next(cat)),
            ("toc", render_toc(cat, "auto-loader")),
            ("fmchips", render_fm_chips(cat, "auto-loader")),
            ("fmcards", render_fm_cards(cat, "auto-loader", "Auto Loader")),
        ],
        "library/index.html": [
            ("catalogue", render_catalogue(cat, base="../")),
        ],
        "manuals/auto-loader/index.html": [
            ("toc", render_toc(cat, "auto-loader")),
            ("fmprose", render_fm_prose(cat, "auto-loader", "Auto Loader")),
        ],
        "manuals/lakeflow-connect/index.html": [
            ("toc", render_toc(cat, "lakeflow-connect")),
            ("fmprose", render_fm_prose(cat, "lakeflow-connect", "Lakeflow Connect")),
        ],
    }

    touched = 0
    for rel, jobs in targets.items():
        path = ROOT / rel
        for name, content in jobs:
            if inject(path, name, content):
                touched += 1

    build_sitemap(cat)

    built = [m for m in cat["manuals"] if m["status"] in BUILT]
    sale = [m for m in cat["manuals"] if m["status"] == "sale"]
    print(f"built {touched} blocks across {len(targets)} pages")
    print(
        f"  {len(built)} guides · {sum(m['pages'] for m in built)} pages · "
        f"{len(built) * cat['site']['failureModesPerManual']} failure modes · "
        f"{len(cat['manuals']) - len(built)} topics remaining"
    )
    print("  on sale: " + ", ".join(f"{m['name']} ({m['price']})" for m in sale))
    print("  sitemap.xml regenerated")


if __name__ == "__main__":
    main()
