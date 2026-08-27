/* ============================================================
   Databricks Field Manuals — site behaviour
   ============================================================ */

(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, c =>
    ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  const ACCENT = {
    flow:"var(--flow)", gate:"var(--gate)", iris:"var(--iris)",
    gold:"var(--gold)", signal:"var(--signal)",
  };

  const catById  = id => CATEGORIES.find(c => c.id === id);
  const money    = p => p === 0 ? "Free" : "$" + p.toFixed(2);
  const inCat    = id => GUIDES.filter(g => g.cat === id);
  const writtenIn= id => inCat(id).filter(g => g.pages).length;

  /* ---------- Coverage board ---------------------------- */

  function renderBoard() {
    const board = $("#board");
    if (!board) return;

    board.innerHTML = CATEGORIES.map(c => {
      const guides  = inCat(c.id);
      const done    = writtenIn(c.id);
      const total   = guides.length;
      const complete= done === total;

      const cells = guides.map(g =>
        `<i class="cell${g.pages ? " on" : ""}"></i>`).join("");

      return `
        <article class="bcard rv" role="listitem" style="--bc:${ACCENT[c.accent]}">
          <div class="bc-top">
            <span class="bc-n">${c.n}</span>
            <h3 class="bc-name">${esc(c.name)}</h3>
          </div>
          <p class="bc-blurb">${esc(c.blurb)}</p>
          <div class="bc-cells" aria-hidden="true">${cells}</div>
          <div class="bc-meta">
            <span class="bc-count"><b>${done}</b> of ${total} written</span>
            <span class="bc-state${complete ? " done" : ""}">${
              complete ? "Complete" : done ? "In progress" : "Planned"}</span>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- Collection tiers -------------------------- */

  function renderTiers() {
    const el = $("#tiers");
    if (!el) return;

    el.innerHTML = COLLECTIONS.map(t => {
      const free = t.status === "free";
      const label = free
        ? `Download free<span class="btn-meta">47 pages · no email</span>`
        : `Coming soon<span class="btn-meta">${esc(t.contents)}</span>`;

      return `
        <article class="tier tier-${t.tier} rv">
          <span class="t-kicker">${esc(t.kicker)}</span>
          <h3 class="t-name">${esc(t.name)}</h3>
          <p class="t-contents">${esc(t.contents)}</p>
          <p class="t-price">${
            SHOW_PRICES || free
              ? `<b>${esc(t.priceLabel)}</b><span>${free ? "always" : "one-time"}</span>`
              : `<b class="t-tbc">Pricing soon</b>`}</p>
          <ul class="t-points">${
            t.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
          <button class="btn ${free ? "btn-primary" : "btn-ghost"} t-btn"
                  data-buy="${t.id}"${free ? "" : " disabled"}>${label}</button>
        </article>`;
    }).join("");
  }

  /* ---------- Catalogue --------------------------------- */

  function renderFilters() {
    const bar = $(".filters");
    if (!bar) return;
    $("#count-all").textContent = GUIDES.length;

    bar.insertAdjacentHTML("beforeend", CATEGORIES.map(c =>
      `<button class="filter" data-filter="${c.id}" role="tab" aria-selected="false">${
        esc(c.name)}<span class="f-n">${inCat(c.id).length}</span></button>`).join(""));
  }

  function rowHTML(g) {
    const c = catById(g.cat);
    const free = g.status === "free";
    const url = free ? gumroadURL(g.slug) : null;

    const action = free
      ? `<a class="pill pill-get" data-buy="c-free" href="${url || "#"}">Get it free</a>`
      : `<span class="pill pill-soon">Coming soon</span>`;

    const priceCell = !SHOW_PRICES
      ? (free ? `<span class="is-free">Free</span>` : `<span class="none">&mdash;</span>`)
      : (free ? `<span class="is-free">Free</span>` : `<b>${money(g.price)}</b>`);

    const covers = (g.covers || []).map(t => `<li>${esc(t)}</li>`).join("");

    return `
      <article class="row rv" data-cat="${g.cat}" style="--rc:${ACCENT[c.accent]}">
        <button class="r-head" aria-expanded="false">
          <span class="r-name">
            <span class="r-title">${esc(g.name)}</span>
            ${g.idea ? `<span class="r-idea">${esc(g.idea)}</span>` : ""}
          </span>
          <span class="r-cat">${esc(c.name)}</span>
          <span class="r-pages">${g.pages ? g.pages + " pp" : `<span class="none">&mdash;</span>`}</span>
          <span class="r-price">${priceCell}</span>
          <span class="r-chev" aria-hidden="true"></span>
        </button>

        <div class="r-body">
          <div class="r-body-in">
            <div class="r-desc">
              <p class="r-desc-label">What's inside</p>
              <p class="r-desc-txt">${esc(g.desc || "")}</p>
              <span class="r-act">${action}</span>
            </div>
            ${covers ? `<div class="r-covers">
              <p class="r-desc-label">Topics covered</p>
              <ul>${covers}</ul>
            </div>` : ""}
          </div>
        </div>
      </article>`;
  }

  function renderRows() {
    const el = $("#rows");
    if (!el) return;
    // Free guide first, then catalogue order.
    const ordered = [...GUIDES].sort((a, b) =>
      (a.status === "free" ? -1 : 0) - (b.status === "free" ? -1 : 0));
    el.innerHTML = ordered.map(rowHTML).join("");
  }

  function wireRows() {
    const el = $("#rows");
    if (!el) return;
    el.addEventListener("click", e => {
      const head = e.target.closest(".r-head");
      if (!head) return;
      const row = head.closest(".row");
      const open = row.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
    });
  }

  function wireFilters() {
    const bar = $(".filters");
    if (!bar) return;

    bar.addEventListener("click", e => {
      const btn = e.target.closest(".filter");
      if (!btn) return;

      $$(".filter", bar).forEach(b => {
        const on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-selected", String(on));
      });

      const f = btn.dataset.filter;
      $$("#rows .row").forEach(r => {
        const show = f === "all" || r.dataset.cat === f;
        r.style.display = show ? "" : "none";
      });
    });
  }

  /* ---------- Bundles ----------------------------------- */

  function renderBundles() {
    const el = $("#bundles-grid");
    if (!el) return;

    el.innerHTML = BUNDLES.map(b => {
      const c = catById(b.cat);
      const listPrice = inCat(b.cat).reduce((s, g) => s + g.price, 0);
      const save = listPrice - b.price;

      const priceBlock = SHOW_PRICES
        ? `<div>
             <span class="bu-price">$${b.price.toFixed(2)}</span>
             ${save > 0 ? `<span class="bu-save">Save $${save.toFixed(2)}</span>` : ""}
           </div>`
        : `<div><span class="bu-count">${b.count} guides</span>
             <span class="bu-save">${writtenIn(b.cat)} written so far</span></div>`;

      return `
        <article class="bundle rv" style="--bc:${ACCENT[c.accent]}">
          <p class="bu-cat">${c.n} · ${esc(c.name)}</p>
          <h3 class="bu-name">${esc(b.name)}</h3>
          <p class="bu-desc">${esc(b.desc || "")}</p>
          <div class="bu-foot">
            ${priceBlock}
            <span class="pill pill-soon">Coming soon</span>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- Checkout ---------------------------------- */

  function wireCheckout() {
    document.addEventListener("click", e => {
      const el = e.target.closest("[data-buy]");
      if (!el) return;

      const id = el.dataset.buy;
      const item =
        COLLECTIONS.find(c => c.id === id) ||
        GUIDES.find(g => "c-" + g.id === id);
      if (!item) return;

      const url = gumroadURL(item.slug);
      if (url) {
        e.preventDefault();
        window.open(url, "_blank", "noopener");
      } else {
        // Not yet wired to Gumroad — tell the visitor plainly.
        e.preventDefault();
        notify(
          item.status === "free"
            ? "The download link isn't live yet. Set GUMROAD_USER and the product slug in assets/js/catalogue.js."
            : "This guide hasn't shipped yet."
        );
      }
    });
  }

  function notify(msg) {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.setAttribute("role", "status");
      Object.assign(t.style, {
        position: "fixed", left: "50%", bottom: "28px",
        transform: "translateX(-50%) translateY(14px)",
        background: "var(--ink-600)", color: "var(--tx-hi)",
        border: "1px solid var(--line-hi)", borderRadius: "5px",
        padding: "14px 22px", fontSize: "14px", zIndex: "300",
        maxWidth: "min(90vw,460px)", textAlign: "center",
        boxShadow: "0 18px 44px -16px rgba(0,0,0,.85)",
        opacity: "0", transition: "opacity .25s, transform .25s",
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
    }, 4200);
  }

  /* ---------- Chrome ------------------------------------ */

  function wireNav() {
    const nav = $("#nav");
    const toggle = $(".nav-toggle");
    const links = $(".nav-links");

    const onScroll = () => nav.classList.toggle("stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

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
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (!en.isIntersecting) return;
        const d = Math.min(i * 55, 260);
        setTimeout(() => en.target.classList.add("in"), d);
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    items.forEach(i => io.observe(i));
  }

  function duplicateMarquee() {
    const track = $(".marquee-track");
    if (track) track.innerHTML += track.innerHTML;
  }

  /* ---------- Boot -------------------------------------- */

  function init() {
    renderBoard();
    renderTiers();
    renderFilters();
    renderRows();
    renderBundles();
    wireRows();
    wireFilters();
    wireCheckout();
    wireNav();
    duplicateMarquee();
    wireReveal();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
