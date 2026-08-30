/* ═══════════════════════════════════════════════════════════════
   Databricks Field Manuals — behaviour

   ┌─────────────────────────────────────────────────────────────┐
   │  THE ONLY LINE YOU MUST EDIT                                │
   │  Paste your Gumroad product URL below, then save.           │
   │  Every "Get the free guide" button on every page uses it.   │
   └─────────────────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════════ */

const PRODUCTS = {
  "auto-loader":     "https://hakkache.gumroad.com/l/auto-loader-field-manual",
  "lakeflow-connect": "https://hakkache.gumroad.com/l/lakeflow-connect-field-manual"
};

/* Where the "notify me" form posts. See README section 2.
   Default is your Gumroad subscribe page, which needs no extra account. */
const NOTIFY_URL = "https://hakkache.gumroad.com/subscribe";

/* Open Gumroad in an overlay instead of a new tab.
   Requires the Gumroad script tag; see README. */
const GUMROAD_OVERLAY = false;

/* ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var doc = document;
  doc.documentElement.classList.add("js");

  /* ── 1. Wire every download / buy CTA ────────────────────────
     Buttons ship with a real href in the HTML, so a JS failure
     still leaves a working link. Buttons carrying data-buy="key"
     are re-pointed from PRODUCTS above.

     Campaign pass-through: if someone arrives from LinkedIn on a
     tagged link, Gumroad would otherwise see the referrer as this
     site and the original source would be lost. So any utm_* on
     the page URL is carried across to the Gumroad link. When there
     is no campaign tag, the site identifies itself instead, so
     Gumroad can still tell site traffic from a direct visit.    */

  var pageParams = (function () {
    var out = {};
    var q = window.location.search.replace(/^\?/, "");
    if (!q) return out;
    var parts = q.split("&");
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split("=");
      var k = decodeURIComponent(kv[0] || "");
      if (k.indexOf("utm_") === 0 && kv[1]) {
        out[k] = decodeURIComponent(kv[1].replace(/\+/g, " "));
      }
    }
    return out;
  })();

  var pageSlug = (function () {
    var path = window.location.pathname.replace(/\/+$/, "");
    var last = path.split("/").pop();
    return last && last.indexOf(".") === -1 ? last : "home";
  })();

  var withCampaign = function (url) {
    var params = [];
    var has = false;
    for (var k in pageParams) {
      if (Object.prototype.hasOwnProperty.call(pageParams, k)) {
        has = true;
        params.push(encodeURIComponent(k) + "=" + encodeURIComponent(pageParams[k]));
      }
    }
    if (!has) {
      /* No campaign tag at all: identify the site as the source. */
      params.push("utm_source=website");
      params.push("utm_medium=referral");
      params.push("utm_campaign=" + encodeURIComponent(pageSlug));
    } else {
      /* Partially tagged link: fill the gaps so Gumroad always
         receives a complete source/medium/campaign triple. */
      if (!pageParams.utm_medium) params.push("utm_medium=referral");
      if (!pageParams.utm_campaign) {
        params.push("utm_campaign=" + encodeURIComponent(pageSlug));
      }
    }
    return url + (url.indexOf("?") === -1 ? "?" : "&") + params.join("&");
  };

  var buys = doc.querySelectorAll("[data-buy]");
  for (var i = 0; i < buys.length; i++) {
    var el = buys[i];
    var key = el.getAttribute("data-buy");
    var base = (key && PRODUCTS[key]) || el.getAttribute("href");
    if (base && base.indexOf("http") === 0) {
      el.setAttribute("href", withCampaign(base));
    }
    el.setAttribute("rel", "noopener");
    if (GUMROAD_OVERLAY) {
      el.classList.add("gumroad-button");
    } else {
      el.setAttribute("target", "_blank");
    }
  }

  /* ── 2. Sticky nav shadow ────────────────────────────────── */
  var nav = doc.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── 3. Mobile menu ──────────────────────────────────────── */
  var toggle = doc.querySelector(".nav-toggle");
  var links = doc.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ── 4. Reveal on scroll ─────────────────────────────────── */
  var rv = doc.querySelectorAll(".rv");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reduced) {
    for (var r = 0; r < rv.length; r++) rv[r].classList.add("in");
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    for (var k = 0; k < rv.length; k++) io.observe(rv[k]);
  }

  /* Safety net: if anything above throws, never leave content hidden. */
  window.setTimeout(function () {
    var hidden = doc.querySelectorAll(".rv:not(.in)");
    for (var h = 0; h < hidden.length; h++) {
      var box = hidden[h].getBoundingClientRect();
      if (box.top < window.innerHeight) hidden[h].classList.add("in");
    }
  }, 1200);

  /* ── 5. Catalogue filters ────────────────────────────────── */
  var filters = doc.querySelectorAll("[data-filter]");
  var blocks = doc.querySelectorAll("[data-cat-block]");
  var rows = doc.querySelectorAll("[data-status]");

  if (filters.length && rows.length) {
    var applyFilter = function (mode) {
      for (var a = 0; a < rows.length; a++) {
        var show = mode === "all" || rows[a].getAttribute("data-status") === mode;
        rows[a].hidden = !show;
      }
      /* Hide category blocks that ended up empty */
      for (var b = 0; b < blocks.length; b++) {
        var visible = blocks[b].querySelectorAll("[data-status]:not([hidden])").length;
        blocks[b].hidden = visible === 0;
      }
      for (var c = 0; c < filters.length; c++) {
        var on = filters[c].getAttribute("data-filter") === mode;
        filters[c].setAttribute("aria-pressed", on ? "true" : "false");
      }
    };

    for (var f = 0; f < filters.length; f++) {
      filters[f].addEventListener("click", function () {
        applyFilter(this.getAttribute("data-filter"));
      });
    }
  }

  /* ── 6. The 3am lookup ───────────────────────────────────────
     Failure-mode cards are pre-rendered in the HTML so they are
     indexable and readable without JS. This only toggles them.  */
  var chips = doc.querySelectorAll("[data-fm]");
  var cards = doc.querySelectorAll("[data-fm-card]");

  if (chips.length && cards.length) {
    var showCard = function (id) {
      for (var m = 0; m < cards.length; m++) {
        cards[m].hidden = cards[m].getAttribute("data-fm-card") !== id;
      }
      for (var n = 0; n < chips.length; n++) {
        var sel = chips[n].getAttribute("data-fm") === id;
        chips[n].setAttribute("aria-selected", sel ? "true" : "false");
        chips[n].setAttribute("tabindex", sel ? "0" : "-1");
      }
    };

    /* Collapse to the first card once JS is available. */
    showCard(chips[0].getAttribute("data-fm"));

    for (var p = 0; p < chips.length; p++) {
      chips[p].addEventListener("click", function () {
        showCard(this.getAttribute("data-fm"));
      });
      chips[p].addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        var list = Array.prototype.slice.call(chips);
        var idx = list.indexOf(this);
        var next = e.key === "ArrowRight" ? idx + 1 : idx - 1;
        if (next < 0) next = list.length - 1;
        if (next >= list.length) next = 0;
        list[next].focus();
        showCard(list[next].getAttribute("data-fm"));
      });
    }
  }

  /* ── 7. Notify form ──────────────────────────────────────── */
  var forms = doc.querySelectorAll(".notify-form");
  for (var q = 0; q < forms.length; q++) {
    (function (form) {
      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ID") !== -1 && NOTIFY_URL) {
        form.setAttribute("action", NOTIFY_URL);
        action = NOTIFY_URL;
      }
      /* Gumroad's subscribe page is a destination, not a POST endpoint,
         so send people there with their address prefilled. */
      if (action.indexOf("gumroad.com/subscribe") !== -1) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var field = form.querySelector('input[type="email"]');
          var value = field && field.value ? field.value : "";
          window.open(
            action + (value ? "?email=" + encodeURIComponent(value) : ""),
            "_blank",
            "noopener"
          );
          var msg = form.parentNode.querySelector(".notify-msg");
          if (msg) {
            msg.textContent =
              "Opening the subscribe page \u2014 confirm there and you're on the list.";
            msg.hidden = false;
          }
        });
      }
    })(forms[q]);
  }

  /* ── 8. Hero cover swap ──────────────────────────────────────
     Hovering or focusing a product CTA previews that manual's
     cover. Pointer, keyboard and touch are all handled; on a
     touch device the cover simply stays on the default.       */
  var stack = doc.getElementById("cover-stack");
  var hovers = doc.querySelectorAll("[data-cover-hover]");

  if (stack && hovers.length) {
    var DEFAULT_COVER = stack.getAttribute("data-active") || "auto-loader";

    var covers = stack.querySelectorAll("[data-cover]");
    var flags = stack.querySelectorAll("[data-flag]");

    var showCover = function (which) {
      if (stack.getAttribute("data-active") === which) return;
      stack.setAttribute("data-active", which);

      for (var c = 0; c < covers.length; c++) {
        var on = covers[c].getAttribute("data-cover") === which;
        covers[c].classList.toggle("is-on", on);
        if (on) {
          covers[c].removeAttribute("aria-hidden");
        } else {
          covers[c].setAttribute("aria-hidden", "true");
        }
      }
      for (var g = 0; g < flags.length; g++) {
        flags[g].classList.toggle(
          "is-on",
          flags[g].getAttribute("data-flag") === which
        );
      }
    };

    /* Paint the initial state, since CSS now defaults everything to
       hidden once .js is present. */
    stack.removeAttribute("data-active");
    showCover(DEFAULT_COVER);

    for (var v = 0; v < hovers.length; v++) {
      (function (el) {
        var which = el.getAttribute("data-cover-hover");
        el.addEventListener("mouseenter", function () { showCover(which); });
        el.addEventListener("focus", function () { showCover(which); });
        el.addEventListener("mouseleave", function () { showCover(DEFAULT_COVER); });
        el.addEventListener("blur", function () { showCover(DEFAULT_COVER); });
      })(hovers[v]);
    }
  }

  /* ── 9. Footer year ──────────────────────────────────────── */
  var year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
