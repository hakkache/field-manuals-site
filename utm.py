#!/usr/bin/env python3
"""
UTM link builder for the Databricks Guide Series.

    python3 utm.py                                        interactive
    python3 utm.py autoloader linkedin post my-post-slug   one-liner
    python3 utm.py --list                                  show destinations

No dependencies. Python 3.8+.

A note on where these actually work: Gumroad reads UTM parameters and will show
them in its analytics. Cloudflare Web Analytics does not log query strings, so
UTMs on the site pages are recorded for the future rather than for today — vary
the destination page instead, since Cloudflare does log paths. See LINKS.md.
"""

import sys
from urllib.parse import urlencode

SITE = "https://hakkache.github.io/field-manuals-site"
GUM = "https://hakkache.gumroad.com"

DESTINATIONS = {
    # key            (url,                                          tracked?, default campaign)
    "autoloader":    (f"{GUM}/l/auto-loader-field-manual",           True,  "autoloader-free"),
    "lakeflow":      (f"{GUM}/l/lakeflow-connect-field-manual",      True,  "lakeflow-launch"),
    "subscribe":     (f"{GUM}/subscribe",                            True,  "notify-list"),
    "home":          (f"{SITE}/",                                    False, "series-intro"),
    "autoloader-page": (f"{SITE}/manuals/auto-loader/",              False, "autoloader-free"),
    "lakeflow-page": (f"{SITE}/manuals/lakeflow-connect/",           False, "lakeflow-launch"),
    "catalogue":     (f"{SITE}/library/",                            False, "roadmap"),
}

MEDIUMS = ["post", "comment", "profile", "dm", "newsletter", "article", "signature"]


def build(dest, source, medium, content, campaign=None):
    if dest not in DESTINATIONS:
        raise KeyError(dest)
    url, tracked, default_campaign = DESTINATIONS[dest]
    params = {
        "utm_source": source.strip().lower(),
        "utm_medium": medium.strip().lower(),
        "utm_campaign": (campaign or default_campaign).strip().lower(),
    }
    if content:
        params["utm_content"] = content.strip().lower().replace(" ", "-")
    return f"{url}?{urlencode(params)}", tracked


def show_list():
    print("\nDestinations:\n")
    for key, (url, tracked, campaign) in DESTINATIONS.items():
        mark = "tracked" if tracked else "not tracked yet"
        print(f"  {key:18} {mark:16} {url}")
    print("\n  'tracked'        = Gumroad reports the UTM values back to you.")
    print("  'not tracked yet'= Cloudflare drops query strings; vary the page instead.")
    print(f"\nCommon mediums: {', '.join(MEDIUMS)}\n")


def interactive():
    show_list()
    dest = input("Destination [autoloader]: ").strip() or "autoloader"
    while dest not in DESTINATIONS:
        print(f"  '{dest}' is not a destination. Pick one from the list above.")
        dest = input("Destination [autoloader]: ").strip() or "autoloader"
    source = input("Source [linkedin]: ").strip() or "linkedin"
    medium = input("Medium [post]: ").strip() or "post"
    content = input("Content slug (which post? e.g. checkpoint-duplicates): ").strip()
    campaign = input(f"Campaign [{DESTINATIONS[dest][2]}]: ").strip() or None
    return build(dest, source, medium, content, campaign)


def main():
    args = sys.argv[1:]

    if args and args[0] in ("--list", "-l"):
        show_list()
        return

    if args and args[0] in ("--help", "-h"):
        print(__doc__)
        return

    if len(args) >= 2:
        dest = args[0]
        if dest not in DESTINATIONS:
            print(f"Unknown destination '{dest}'. Run: python3 utm.py --list")
            sys.exit(1)
        source = args[1]
        medium = args[2] if len(args) > 2 else "post"
        content = args[3] if len(args) > 3 else ""
        campaign = args[4] if len(args) > 4 else None
        link, tracked = build(dest, source, medium, content, campaign)
    else:
        link, tracked = interactive()

    print("\n" + link + "\n")
    if not tracked:
        print("Note: this is a site page, so Cloudflare will not report the UTM values.")
        print("      The page path is your signal — use a different page per campaign.\n")


if __name__ == "__main__":
    main()
