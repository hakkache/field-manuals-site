/* ============================================================
   Databricks Guide Series — site behaviour
   ============================================================ */

(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c =>
    ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  const ACCENT = {
    teal:"var(--teal)", cyan:"var(--cyan)", iris:"var(--iris)",
    amber:"var(--amber)", orange:"var(--orange)",
  };

  const catById   = id => CATEGORIES.find(c => c.id === id);
  const inCat     = id => GUIDES.filter(g => g.cat === id);
  const writtenIn = id => inCat(id).filter(g => g.pages).length;
  const pagesIn   = id => inCat(id).reduce((s, g) => s + (g.pages || 0), 0);

  const STATUS = {
    available:{ cls:"badge-available", label:"Available now" },
    soon:     { cls:"badge-soon",      label:"Coming soon"  },
    planned:  { cls:"badge-planned",   label:"Planned"      },
  };

  /* ---------- What's inside grid ------------------------ */

  const INSIDE = [
    ["Architecture diagrams","Custom vector diagrams showing how components actually connect."],
    ["Failure scenarios","Sixteen per manual, grouped into families, with symptom and cause."],
    ["Production patterns","The arrangements that hold up, and the trade-offs each one carries."],
    ["Troubleshooting logic","First thing to check, second thing to check — in order."],
    ["Checklists","Pre-production checklists you can actually work through."],
    ["Cheat sheets","One page. “To do this, use that.” Built to be printed."],
    ["Technical explanations","Why the system behaves the way it does, not just that it does."],
    ["Practical examples","SQL and Python you can adapt, not pseudo-code."],
  ];

  function renderInside() {
    const el = $("#inside-grid");
    if (!el) return;
    el.innerHTML = INSIDE.map(([t, d], i) => `
      <article class="ins rv">
        <svg class="ins-i" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.4" aria-hidden="true">${ICONS[i]}</svg>
        <h3>${esc(t)}</h3>
        <p>${esc(d)}</p>
      </article>`).join("");
  }

  const ICONS = [
    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M6.5 10v4h11"/>',
    '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4"/><circle cx="12" cy="17.5" r=".6" fill="currentColor"/>',
    '<rect x="3" y="4" width="18" height="6"/><rect x="3" y="14" width="8" height="6"/><rect x="15" y="14" width="6" height="6"/>',
    '<path d="M12 3v4"/><path d="M12 11v4"/><path d="M12 19v2"/><circle cx="12" cy="9" r="2"/><circle cx="12" cy="17" r="2"/>',
    '<path d="M4 6h16M4 12h16M4 18h10"/><path d="M17.5 17l1.5 1.5 3-3"/>',
    '<rect x="3" y="3" width="18" height="18"/><path d="M7 8h10M7 12h10M7 16h6"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16" r=".6" fill="currentColor"/>',
    '<path d="M8 4H5v16h14V9"/><path d="M14 4h5v5"/><path d="M11 14l2 2 4-4"/>',
  ];

  /* ---------- Catalogue --------------------------------- */

  const priceLabel = g => g.free ? "Free" : (typeof g.price === "number" ? "$" + g.price.toFixed(2) : null);

  function manualHTML(g, accent) {
    const st = STATUS[g.status] || STATUS.planned;
    const url = g.status === "available" ? gumroadURL(g.slug) : null;
    const price = priceLabel(g);

    const ctaLabel = g.free ? "Get the free guide →" : (price ? `Buy the guide — ${price} →` : "Get the guide →");

    const cta = g.status === "available"
      ? `<a class="btn btn-primary btn-sm" data-buy="${g.id}" href="${url || "#"}"
            style="align-self:flex-start;margin-top:4px">${ctaLabel}</a>`
      : "";

    const covers = (g.covers || []).map(t => `<li>${esc(t)}</li>`).join("");

    return `
      <article class="grow rv${g.status === "available" ? " is-available" : ""}"
               style="--cc:${accent}">
        <button class="grow-head" aria-expanded="false">
          <span class="grow-name">
            <span class="grow-t">${esc(g.name)}</span>
            ${g.idea ? `<span class="grow-i">${esc(g.idea)}</span>` : ""}
          </span>
          <span class="grow-p">${g.pages ? g.pages + " pages" : `<span class="na">—</span>`}</span>
          <span class="grow-badge">
            ${price ? `<span class="grow-price">${price}</span>` : ""}
            <span class="badge ${st.cls}">${st.label}</span>
          </span>
          <span class="grow-c" aria-hidden="true"></span>
        </button>
        <div class="grow-body"><div class="grow-in">
          <div>
            <p class="grow-lbl">What's inside</p>
            <p class="grow-d">${esc(g.desc || "")}</p>
            ${cta}
          </div>
          ${covers ? `<div class="grow-cov">
            <p class="grow-lbl">Topics covered</p><ul>${covers}</ul></div>` : ""}
        </div></div>
      </article>`;
  }

  function renderCatalogue() {
    const el = $("#catalogue-body");
    if (!el) return;

    el.innerHTML = CATEGORIES.map(c => {
      const guides = inCat(c.id);
      const accent = ACCENT[c.accent];
      const pages  = pagesIn(c.id);

      return `
        <section class="cat-blk" id="cat-${c.id}" style="--cc:${accent}">
          <header class="cat-head">
            <span class="cat-n">${c.n}</span>
            <h3 class="cat-name">${esc(c.name)}</h3>
            <p class="cat-blurb">${esc(c.blurb)}</p>
            <span class="cat-tot">${guides.length} guides${pages ? " · " + pages + " pages written" : ""}</span>
          </header>
          <div class="cat-rows">
            ${guides.map(g => manualHTML(g, accent)).join("")}
          </div>
        </section>`;
    }).join("");
  }

  /* ---------- Next releases ----------------------------- */

  function renderNext() {
    const el = $("#next-grid");
    if (!el) return;

    el.innerHTML = NEXT_RELEASES.map((id, i) => {
      const g = GUIDES.find(x => x.id === id);
      if (!g) return "";
      const c = catById(g.cat);
      return `
        <article class="nx rv" style="--nc:${ACCENT[c.accent]}">
          <p class="nx-n">${String(i + 1).padStart(2, "0")} · ${esc(c.name.split(" ")[0])}</p>
          <h3 class="nx-t">${esc(g.name)}</h3>
          <p class="nx-s">Coming soon</p>
        </article>`;
    }).join("");
  }

  /* ---------- Interaction ------------------------------- */

  function wireExpand() {
    const el = $("#catalogue-body");
    if (!el) return;
    el.addEventListener("click", e => {
      const head = e.target.closest(".grow-head");
      if (!head) return;
      const row  = head.closest(".grow");
      const open = row.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
    });
  }

  function wireCheckout() {
    document.addEventListener("click", e => {
      const el = e.target.closest("[data-buy]");
      if (!el) return;

      const buyId = el.getAttribute("data-buy");
      const g = GUIDES.find(x => String(x.id) === String(buyId)) ||
                GUIDES.find(x => x.status === "available");
      const url = g ? gumroadURL(g.slug) : null;

      if (url) {
        e.preventDefault();
        window.open(url, "_blank", "noopener");
      } else if (el.getAttribute("href") === "#") {
        e.preventDefault();
        notify("The download link isn't connected yet. Set GUMROAD_USER and this guide's slug in assets/js/catalogue.js.");
      }
    });
  }

  /* ---------- Hero slider ---------------------------------
     The hero cover card rotates through the 5 most recently
     released (status:"available") guides, auto-advancing.
     You only see a given guide there by it sliding into view.
  ---------------------------------------------------------- */

  const HERO_SLIDER_INTERVAL = 4200;

  function latestGuides(max = 5) {
    return GUIDES.filter(g => g.status === "available").slice(-max);
  }

  function heroCoverHTML(g) {
    const c = catById(g.cat);
    const accent = ACCENT[c.accent];
    const covers = (g.covers || []).slice(0, 4);
    const nameParts = esc(g.name).split(" ");
    const nameHTML = nameParts.length > 1
      ? nameParts.join("<br>")
      : esc(g.name);

    return `
      <article class="cover hero-cover-in" style="--cc:${accent}" aria-label="${esc(g.name)} Field Manual cover">
        <div class="grid-bg" aria-hidden="true"></div>
        <p class="cover-series">Databricks Guide Series</p>
        <p class="cover-kind">Field Manual</p>
        <div class="cover-bar" aria-hidden="true"></div>
        <h2 class="cover-name">${nameHTML}</h2>
        <p class="cover-cat">${esc(c.n)} — ${esc(c.name)}</p>
        <div class="cover-mid">
          <div class="cover-spine">
            ${covers.map(t => `<span>${esc(t)}</span>`).join("")}
          </div>
        </div>
        <div class="cover-foot">
          <p class="cover-pages">${g.pages || "—"}<small>Pages</small></p>
          <p class="cover-wm">HAKKACHE MOHAMED</p>
        </div>
      </article>`;
  }

  function renderHeroSlider() {
    const slot = $("#hero-cover-slot");
    const flag = $("#hero-flag");
    const dots = $("#hero-dots");
    if (!slot) return;

    const guides = latestGuides(5);
    if (!guides.length) return;

    let index = 0;
    let timer = null;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (dots) {
      dots.innerHTML = guides.map((_, i) =>
        `<button class="hero-sl-dot" aria-label="Show guide ${i + 1}" data-i="${i}"></button>`).join("");
    }
    const dotEls = dots ? $$(".hero-sl-dot", dots) : [];

    function paint() {
      const g = guides[index];
      const price = priceLabel(g);
      const c = catById(g.cat);
      const url = gumroadURL(g.slug);

      slot.innerHTML = heroCoverHTML(g);
      if (flag) flag.textContent = price || "Available now";
      dotEls.forEach((d, di) => d.classList.toggle("is-on", di === index));

      const btn = $("#hero-buy-btn");
      const btnLabel = $("#hero-buy-label");
      const btnMeta = $("#hero-buy-meta");
      const noteMeta = $("#hero-note-meta");

      if (btn) {
        btn.setAttribute("data-buy", g.id);
        btn.setAttribute("href", url || "#");
      }
      if (btnLabel) {
        btnLabel.textContent = g.free
          ? `Get ${g.name} — Free`
          : `Buy ${g.name}${price ? " — " + price : ""}`;
      }
      if (btnMeta) {
        btnMeta.textContent = (g.pages ? g.pages + " pages · " : "") +
          (g.free ? "complete manual" : "complete manual");
      }
      if (noteMeta) {
        noteMeta.textContent = (g.pages ? g.pages + " pages · " : "") +
          (g.free ? "Free" : (price || ""));
      }
    }

    function go(i) {
      index = (i + guides.length) % guides.length;
      paint();
    }

    function start() {
      if (reduce || guides.length < 2) return;
      stop();
      timer = setInterval(() => go(index + 1), HERO_SLIDER_INTERVAL);
    }
    function stop() { clearInterval(timer); timer = null; }

    dots?.addEventListener("click", e => {
      const b = e.target.closest(".hero-sl-dot");
      if (!b) return;
      go(Number(b.dataset.i));
      start();
    });

    const prevBtn = $("#hero-prev");
    const nextBtn = $("#hero-next");
    if (guides.length < 2) {
      prevBtn?.setAttribute("hidden", "");
      nextBtn?.setAttribute("hidden", "");
    } else {
      prevBtn?.addEventListener("click", () => { go(index - 1); start(); });
      nextBtn?.addEventListener("click", () => { go(index + 1); start(); });
    }

    const stack = $("#hero-slider");
    stack?.addEventListener("mouseenter", stop);
    stack?.addEventListener("mouseleave", start);
    stack?.addEventListener("focusin", stop);
    stack?.addEventListener("focusout", start);

    paint();
    start();
  }

  function notify(msg) {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.setAttribute("role", "status");
      Object.assign(t.style, {
        position:"fixed", left:"50%", bottom:"26px",
        transform:"translateX(-50%) translateY(14px)",
        background:"var(--bg-600)", color:"var(--tx-hi)",
        border:"1px solid var(--line-hi)", padding:"14px 22px",
        fontSize:"14px", zIndex:"300", maxWidth:"min(90vw,470px)",
        textAlign:"center", boxShadow:"0 18px 44px -16px rgba(0,0,0,.9)",
        opacity:"0", transition:"opacity .25s, transform .25s",
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "translateX(-50%) translateY(0)";
    });
    clearTimeout(t._h);
    t._h = setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateX(-50%) translateY(14px)";
    }, 4600);
  }

  function wireNav() {
    const nav = $("#nav"), toggle = $(".nav-toggle"), links = $(".nav-links");
    const onScroll = () => nav.classList.toggle("stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });

    toggle?.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links?.addEventListener("click", e => {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle?.setAttribute("aria-expanded", "false");
      }
    });
  }

  function wireReveal() {
    const items = $$(".rv");
    if (!("IntersectionObserver" in window) ||
        matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(i => i.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach((en, i) => {
        if (!en.isIntersecting) return;
        setTimeout(() => en.target.classList.add("in"), Math.min(i * 50, 240));
        io.unobserve(en.target);
      });
    }, { rootMargin:"0px 0px -6% 0px", threshold:0.05 });
    items.forEach(i => io.observe(i));
  }

  /* ---------- Boot -------------------------------------- */

  function init() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();

    renderInside();
    renderCatalogue();
    renderNext();
    renderHeroSlider();
    wireExpand();
    wireCheckout();
    wireNav();
    wireReveal();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
