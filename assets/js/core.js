/* ==========================================================================
   Tourism demo — core
   Helpers, saved state, overlays (popover, date picker, guest picker, sheet),
   the shared "reserve" flow, the hash router and page motion.
   Views register themselves on TV.routes (see views.js and planner.js).
   ========================================================================== */
(() => {
  "use strict";

  const T = window.TRAVEL;
  const TV = (window.TV = {});
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const icon = (name, cls = "") => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isPhone = () => matchMedia("(max-width: 720px)").matches;

  /* ------------------------------------------------------------- format */
  const DAY3 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MON3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const today = () => iso(new Date());
  const plusDays = (n) => iso(addDays(new Date(), n));
  const nightsBetween = (a, b) => Math.max(1, Math.round((fromIso(b) - fromIso(a)) / 86400000));
  const yr = (d) => (d.getFullYear() === new Date().getFullYear() ? "" : ` ${d.getFullYear()}`); // only shown when it isn't this year
  const fmtDate = (s) => { const d = fromIso(s); return `${DAY3[d.getDay()]}, ${d.getDate()} ${MON3[d.getMonth()]}${yr(d)}`; };
  const fmtShort = (s) => { const d = fromIso(s); return `${d.getDate()} ${MON3[d.getMonth()]}${yr(d)}`; };
  const fmtRange = (a, b) => {
    const x = fromIso(a), y = fromIso(b);
    const sameMonth = x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear();
    return sameMonth ? `${x.getDate()} – ${y.getDate()} ${MON3[y.getMonth()]}${yr(y)}` : `${x.getDate()} ${MON3[x.getMonth()]}${x.getFullYear() === y.getFullYear() ? "" : yr(x)} – ${fmtShort(b)}`;
  };
  const money = (n) => `${T.currency}${Math.round(n).toLocaleString("en")}`;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many || one + "s"}`;
  const stars = (n) => `<span class="stars" role="img" aria-label="${n} out of 5 stars">${Array.from({ length: 5 }, (_, i) => icon("star", `i--fill${i < n ? "" : " is-off"}`)).join("")}</span>`;
  const uid = () => Math.random().toString(36).slice(2, 9);
  const refCode = () => `${T.name.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase() || "TRP"}-${Math.floor(10000 + Math.random() * 90000)}`;
  /* deterministic pseudo-random, so "seats left" and similar stay stable */
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };

  const find = (list) => (id) => list.find((x) => x.id === id);
  const tour = find(T.tours), hotel = find(T.hotels), car = find(T.cars), dest = find(T.destinations), style = find(T.styles);
  const waLink = (text) => `https://wa.me/${T.whatsapp}?text=${encodeURIComponent(text || `Hi ${T.name}, I'd like help planning a trip.`)}`;

  /* -------------------------------------------------------------- state */
  const KEY = "travel-demo-v1";
  const store = { trips: [], wish: [], draft: null, profile: { name: "", phone: "" } };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") {
      if (Array.isArray(saved.trips)) store.trips = saved.trips.filter((t) => t && t.id && t.kind && t.title);
      if (Array.isArray(saved.wish)) store.wish = saved.wish.filter((id) => tour(id));
      if (saved.draft && typeof saved.draft === "object") store.draft = saved.draft;
      if (saved.profile && typeof saved.profile === "object") store.profile = { name: String(saved.profile.name || ""), phone: String(saved.profile.phone || "") };
    }
  } catch (e) { /* storage unavailable or corrupt — start fresh */ }
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* private mode: keep in memory only */ }
    badges();
  };
  const badges = () => $$("[data-trip-count]").forEach((el) => { el.textContent = store.trips.length; el.hidden = !store.trips.length; });

  /* search criteria shared between the home finder and the listing pages */
  const state = {
    tours: { q: "", region: "", style: "", dest: "", length: "", max: 0, sort: "top", saved: false },
    hotels: { dest: "", from: plusDays(21), to: plusDays(25), adults: 2, kids: 0, rooms: 1, stars: 0, amen: [], max: 0, sort: "top" },
    cars: { pickup: T.pickups[0], from: plusDays(21), to: plusDays(26), type: "", auto: false, seats: 0, sort: "price" },
  };

  /* -------------------------------------------------------------- toast */
  function toast(msg) {
    const el = $("[data-toast]");
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove("is-on"), 2600);
  }

  /* ------------------------------------------------------------ popover */
  const popEl = $("[data-pop]");
  let popAnchor = null;
  function closePop() {
    if (popEl.hidden) return;
    popEl.hidden = true;
    popEl.innerHTML = "";
    if (popAnchor) popAnchor.setAttribute("aria-expanded", "false");
    popAnchor = null;
  }
  function openPop(anchor, html, onMount) {
    const same = popAnchor === anchor;
    closePop();
    if (same) return null; // second click on the same field closes it
    popEl.innerHTML = `<div class="pop__panel" role="dialog">${html}</div>`;
    popEl.hidden = false;
    popAnchor = anchor;
    anchor.setAttribute("aria-expanded", "true");
    const panel = popEl.firstElementChild;
    place(panel);
    if (onMount) onMount(panel);
    return panel;
  }
  function place(panel) {
    if (!popAnchor || isPhone()) { popEl.style.left = popEl.style.top = ""; return; }
    const r = popAnchor.getBoundingClientRect();
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const left = Math.max(12, Math.min(r.left, innerWidth - w - 12));
    const below = r.bottom + 8 + h <= innerHeight || r.top - 8 - h < 0;
    popEl.style.left = left + scrollX + "px";
    popEl.style.top = (below ? r.bottom + 8 : r.top - h - 8) + scrollY + "px";
    panel.style.transformOrigin = below ? "20% 0" : "20% 100%";
  }
  document.addEventListener("pointerdown", (e) => {
    if (popEl.hidden) return;
    if (e.target === popEl) return closePop(); // phone backdrop
    if (popEl.contains(e.target) || (popAnchor && popAnchor.contains(e.target))) return;
    closePop();
  });
  addEventListener("resize", closePop);

  /** Option list. options: [{ value, label, sub?, img?, icon? }] */
  function pickList(anchor, { title, options, value, onPick }) {
    const html = `${title ? `<p class="pop__title">${esc(title)}</p>` : ""}<div class="plist" role="listbox">${options
      .map((o, i) => `<button type="button" class="plist__item${o.value === value ? " is-active" : ""}" role="option" aria-selected="${o.value === value}" data-i="${i}">${o.img ? `<img src="assets/img/${esc(o.img)}" alt="" loading="lazy">` : o.icon ? `<span class="plist__ico">${icon(o.icon)}</span>` : ""}<span><b>${esc(o.label)}</b>${o.sub ? `<small>${esc(o.sub)}</small>` : ""}</span></button>`)
      .join("")}</div>`;
    openPop(anchor, html, (panel) => {
      panel.addEventListener("click", (e) => {
        const b = e.target.closest("[data-i]");
        if (!b) return;
        const o = options[+b.dataset.i];
        closePop();
        onPick(o.value, o);
      });
      const active = $(".is-active", panel);
      if (active) active.scrollIntoView({ block: "nearest" });
    });
  }

  /** Date picker. range=true picks start + end; otherwise a single day. */
  function pickDates(anchor, { start, end, range = true, min = today(), labels = ["Start", "End"], onPick }) {
    let s = start || null, e = range ? end || null : null;
    const first = fromIso(s || min);
    let view = new Date(first.getFullYear(), first.getMonth(), 1);
    const months = () => (isPhone() ? 1 : range ? 2 : 1);

    const month = (base) => {
      const y = base.getFullYear(), m = base.getMonth();
      const lead = (new Date(y, m, 1).getDay() + 6) % 7; // Monday first
      const count = new Date(y, m + 1, 0).getDate();
      let cells = "MTWTFSS".split("").map((d) => `<span class="cal__dow">${d}</span>`).join("") + "<span></span>".repeat(lead);
      for (let d = 1; d <= count; d++) {
        const v = `${y}-${pad(m + 1)}-${pad(d)}`;
        const cls = [v === s ? "is-start" : "", v === e ? "is-end" : "", s && e && v > s && v < e ? "is-in" : "", v === today() ? "is-today" : ""].filter(Boolean).join(" ");
        cells += `<button type="button" class="cal__day ${cls}" data-d="${v}"${v < min ? " disabled" : ""} aria-label="${d} ${MONTH[m]} ${y}">${d}</button>`;
      }
      return `<div><p class="cal__title">${MONTH[m]} ${y}</p><div class="cal__grid">${cells}</div></div>`;
    };
    const body = () => {
      const canBack = view > new Date(fromIso(min).getFullYear(), fromIso(min).getMonth(), 1);
      const info = !range ? (s ? fmtDate(s) : "Pick a day") : s && e ? `${fmtRange(s, e)} · ${plural(nightsBetween(s, e), "night")}` : s ? `${labels[0]}: ${fmtShort(s)} — now pick the ${labels[1].toLowerCase()}` : `Pick the ${labels[0].toLowerCase()}`;
      return `<div class="cal__head"><button type="button" class="icon-btn icon-btn--sm" data-cal="-1" aria-label="Previous month"${canBack ? "" : " disabled style=\"opacity:.3\""}>${icon("chevron-left")}</button><span>${range ? `${labels[0]} → ${labels[1]}` : "Select a date"}</span><button type="button" class="icon-btn icon-btn--sm" data-cal="1" aria-label="Next month">${icon("chevron-right")}</button></div>
        <div class="cal__months" style="grid-template-columns:repeat(${months()},auto)">${Array.from({ length: months() }, (_, i) => month(new Date(view.getFullYear(), view.getMonth() + i, 1))).join("")}</div>
        <div class="cal__foot"><span>${esc(info)}</span><button type="button" class="btn btn--dark btn--sm" data-done${(range ? s && e : s) ? "" : " disabled style=\"opacity:.4\""}>Done</button></div>`;
    };
    openPop(anchor, `<div class="cal">${body()}</div>`, (panel) => {
      const cal = $(".cal", panel);
      const paint = () => { cal.innerHTML = body(); place(panel); };
      const finish = () => { closePop(); onPick(s, e); };
      panel.addEventListener("click", (ev) => {
        const nav = ev.target.closest("[data-cal]"), day = ev.target.closest("[data-d]"), done = ev.target.closest("[data-done]");
        if (nav && !nav.disabled) { view = new Date(view.getFullYear(), view.getMonth() + +nav.dataset.cal, 1); paint(); }
        else if (day && !day.disabled) {
          const v = day.dataset.d;
          if (!range) { s = v; return finish(); }
          if (!s || e || v <= s) { s = v; e = null; paint(); }
          else { e = v; paint(); setTimeout(finish, 220); }
        } else if (done && !done.disabled) finish();
      });
    });
  }

  /** Guest / room steppers. */
  function pickGuests(anchor, { adults, kids, rooms, withRooms = true, onChange }) {
    const v = { adults, kids, rooms: rooms || 1 };
    const row = (key, label, note, minVal, maxVal) => `<div class="guests__row"><span><b>${label}</b><small>${note}</small></span><span class="stepper" data-key="${key}" data-min="${minVal}" data-max="${maxVal}"><button type="button" data-step="-1" aria-label="Fewer ${label.toLowerCase()}">${icon("minus")}</button><b>${v[key]}</b><button type="button" data-step="1" aria-label="More ${label.toLowerCase()}">${icon("plus")}</button></span></div>`;
    openPop(anchor, `<div class="guests">${row("adults", "Adults", "Ages 13 and over", 1, 12)}${row("kids", "Children", "Ages 2 to 12", 0, 8)}${withRooms ? row("rooms", "Rooms", "Two guests per room is typical", 1, 6) : ""}<button type="button" class="btn btn--dark btn--sm btn--block" data-done><span>Done</span></button></div>`, (panel) => {
      const sync = () => $$(".stepper", panel).forEach((st) => {
        const k = st.dataset.key;
        $("b", st).textContent = v[k];
        $('[data-step="-1"]', st).disabled = v[k] <= +st.dataset.min;
        $('[data-step="1"]', st).disabled = v[k] >= +st.dataset.max;
      });
      sync();
      panel.addEventListener("click", (e) => {
        const b = e.target.closest("[data-step]");
        if (e.target.closest("[data-done]")) return closePop();
        if (!b || b.disabled) return;
        const st = b.closest(".stepper");
        v[st.dataset.key] += +b.dataset.step;
        sync();
        onChange({ ...v });
      });
    });
  }

  /* -------------------------------------------------------------- sheet */
  const sheetEl = $("[data-sheet]");
  let sheetReturn = null;
  let sheetCtl = null;
  function openSheet(html, onMount) {
    closePop();
    if (sheetCtl) sheetCtl.abort();
    sheetCtl = new AbortController();
    if (sheetEl.hidden) sheetReturn = document.activeElement;
    $("[data-sheet-body]", sheetEl).innerHTML = html;
    sheetEl.hidden = false;
    document.documentElement.style.overflow = "hidden";
    const panel = $(".sheet__panel", sheetEl);
    panel.scrollTop = 0;
    panel.focus({ preventScroll: true });
    if (onMount) onMount($("[data-sheet-body]", sheetEl), sheetCtl.signal);
  }
  function closeSheet() {
    if (sheetEl.hidden) return;
    if (sheetCtl) sheetCtl.abort();
    sheetEl.hidden = true;
    $("[data-sheet-body]", sheetEl).innerHTML = "";
    document.documentElement.style.overflow = "";
    if (sheetReturn && document.contains(sheetReturn)) sheetReturn.focus({ preventScroll: true });
    sheetReturn = null;
  }
  sheetEl.addEventListener("click", (e) => { if (e.target.closest("[data-sheet-close]")) closeSheet(); });
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || (popEl.hidden && sheetEl.hidden)) return;
    if (!popEl.hidden) closePop(); else closeSheet();
    e.stopImmediatePropagation();
  });

  /* ------------------------------------------------------ reserve flow */
  const tripMessage = (t) =>
    [`Hi ${T.name}! I'd like to confirm this booking.`, "", `• ${t.title}`, ...t.lines.map(([k, v]) => `• ${k}: ${v}`), `• Total: ${money(t.total)}`, t.name ? `• Name: ${t.name}` : null, t.phone ? `• Phone: ${t.phone}` : null, "", `Ref: ${t.ref}`].filter((l) => l !== null).join("\n");

  /**
   * Shared confirmation step for tours, stays, cars and custom plans.
   * item: { kind, label, title, img, when, total, lines: [[label, value]], data }
   */
  function reserve(item, onSaved) {
    const html = `<div class="rsv">
      <div class="rsv__head"><img src="assets/img/${esc(item.img)}" alt=""><span><small>${esc(item.label)}</small><b>${esc(item.title)}</b></span></div>
      <div class="rsv__box"><dl class="rows">${item.lines.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl><div class="total"><span>Total</span><b>${money(item.total)}</b></div></div>
      <form novalidate data-rsv>
        <div class="fields">
          <label class="field"><span>Lead traveller</span><input type="text" name="name" autocomplete="name" placeholder="Full name" value="${esc(store.profile.name)}" required><em class="field__err">Please enter a name</em></label>
          <label class="field"><span>Mobile number</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="Include country code" value="${esc(store.profile.phone)}" required><em class="field__err">Please enter a valid number</em></label>
        </div>
        <p class="fineprint">${icon("lock")}Demo — nothing is charged or sent. Details stay in this browser only.</p>
        <button class="btn btn--dark btn--block" type="submit"><span>Confirm reservation</span><span class="btn__arrow">${icon("arrow-right")}</span></button>
      </form></div>`;
    openSheet(html, (body, signal) => {
      const form = $("[data-rsv]", body);
      form.addEventListener("input", (e) => { const f = e.target.closest(".field"); if (f) f.classList.remove("is-invalid"); }, { signal });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.elements.name.value.trim(), phone = form.elements.phone.value.trim();
        const okName = name.length >= 2, okPhone = phone.replace(/\D/g, "").length >= 7;
        form.elements.name.closest(".field").classList.toggle("is-invalid", !okName);
        form.elements.phone.closest(".field").classList.toggle("is-invalid", !okPhone);
        if (!okName || !okPhone) return (okName ? form.elements.phone : form.elements.name).focus();
        store.profile = { name, phone };
        const trip = { ...item, id: item.id || uid(), ref: item.ref || refCode(), name, phone, status: "Reserved", created: Date.now() };
        const at = store.trips.findIndex((t) => t.id === trip.id);
        if (at >= 0) store.trips[at] = trip; else store.trips.unshift(trip);
        save();
        if (onSaved) onSaved(trip);
        body.innerHTML = `<div class="done">
          <span class="done__badge">${icon("check")}</span>
          <h2>You're reserved, ${esc(name.split(" ")[0])}.</h2>
          <p>Send it on WhatsApp and a travel designer will confirm everything within one working day.</p>
          <span class="done__ref">${icon("ticket")}${esc(trip.ref)}</span>
          <div class="done__actions">
            <a class="btn btn--wa" href="${esc(waLink(tripMessage(trip)))}" target="_blank" rel="noopener">${icon("whatsapp", "i--brand")}<span>Confirm on WhatsApp</span></a>
            <a class="btn btn--dark" href="#/trips" data-sheet-close><span>View my trips</span></a>
            <button class="btn btn--ghost" type="button" data-sheet-close>Keep exploring</button>
          </div></div>`;
      }, { signal });
    });
  }

  function removeTrip(id) { store.trips = store.trips.filter((t) => t.id !== id); save(); }
  function toggleWish(id) {
    const at = store.wish.indexOf(id);
    if (at >= 0) store.wish.splice(at, 1); else store.wish.push(id);
    save();
    $$(`[data-wish="${CSS.escape(id)}"]`).forEach((b) => { b.classList.toggle("is-on", at < 0); b.setAttribute("aria-pressed", at < 0); });
    toast(at < 0 ? "Saved to your wishlist" : "Removed from your wishlist");
  }
  const wishBtn = (id) => `<button class="wish${store.wish.includes(id) ? " is-on" : ""}" type="button" data-wish="${esc(id)}" aria-pressed="${store.wish.includes(id)}" aria-label="Save to wishlist">${icon("heart")}</button>`;

  /* ------------------------------------------------------------- router */
  const routes = (TV.routes = {});
  const root = $("#view");
  let ctl = null;
  let observers = [];

  const parse = () => {
    const raw = location.hash.replace(/^#\/?/, "");
    const [path, qs = ""] = raw.split("?");
    const segs = path.split("/").filter(Boolean).map((s) => { try { return decodeURIComponent(s); } catch (e) { return s; } });
    return { key: segs[0] || "home", id: segs[1] || null, query: Object.fromEntries(new URLSearchParams(qs)) };
  };

  function render(first) {
    const r = parse();
    const view = routes[r.key] || routes.home;
    const swap = () => {
      if (ctl) ctl.abort();
      ctl = new AbortController();
      observers.forEach((o) => o.disconnect());
      observers = [];
      closePop();
      closeSheet();
      document.body.classList.remove("is-loaded");
      root.innerHTML = view.render(r);
      document.title = view.title ? `${view.title(r)} — ${T.name}` : `${T.name} — ${T.tagline}`;
      setNav(view.nav);
      if (view.mount) view.mount(root, r, ctl.signal);
      hydrate(root);
      motion(root);
      if (!first) { scrollTo({ top: 0, behavior: "instant" }); root.focus({ preventScroll: true }); }
    };
    transition(swap, !first);
  }
  const go = (hash) => { if (location.hash === hash) render(false); else location.hash = hash; };

  /* fill in contact links and bound text inside freshly rendered markup */
  function hydrate(scope) {
    const values = { name: T.name, phone: T.phone, email: T.email, assistant: T.assistant };
    $$("[data-bind]", scope).forEach((el) => {
      const k = el.dataset.bind;
      if (k === "address-lines") el.innerHTML = T.address.map(esc).join("<br>");
      else if (k in values) el.textContent = values[k];
    });
    $$("[data-tel]", scope).forEach((a) => (a.href = "tel:" + T.phone.replace(/[^\d+]/g, "")));
    $$("[data-mail]", scope).forEach((a) => (a.href = "mailto:" + T.email));
    $$("[data-wa]", scope).forEach((a) => (a.href = waLink(a.dataset.waText)));
    $$("[data-year]", scope).forEach((el) => (el.textContent = new Date().getFullYear()));
    badges();
  }

  /* ------------------------------------------------------------- motion */
  function motion(scope) {
    // staged entrance for [data-load]
    $$("[data-load]", scope).forEach((el) => el.style.setProperty("--i", el.dataset.load));
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("is-loaded")));

    const done = (el) => { el.classList.remove("reveal", "is-in"); el.style.removeProperty("--d"); };
    const items = $$(".reveal", scope);
    if (reduced || !("IntersectionObserver" in window)) items.forEach(done);
    else {
      const io = new IntersectionObserver((entries) => {
        entries.filter((e) => e.isIntersecting).forEach((e, i) => {
          const el = e.target;
          io.unobserve(el);
          const delay = Math.min(i, 6) * 80;
          el.style.setProperty("--d", delay + "ms");
          el.classList.add("is-in");
          setTimeout(() => el.classList.contains("is-in") && done(el), delay + 1100);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
      items.forEach((el) => io.observe(el));
      observers.push(io);
    }

    const run = (el) => {
      const target = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), suffix = el.dataset.suffix || "";
      const paint = (v) => (el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en")) + suffix);
      if (reduced) return paint(target);
      const t0 = performance.now();
      const frame = (t) => { const k = Math.min(1, (t - t0) / 1500); paint(target * (1 - Math.pow(1 - k, 4))); if (k < 1) requestAnimationFrame(frame); };
      requestAnimationFrame(frame);
    };
    if ("IntersectionObserver" in window) {
      const co = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { co.unobserve(e.target); run(e.target); } }), { threshold: 0.5 });
      $$("[data-count]", scope).forEach((el) => co.observe(el));
      observers.push(co);
    }
  }

  /** Run a DOM update inside a cross-fade where the browser supports it. */
  function transition(update, animate = true) {
    if (!animate || reduced || !document.startViewTransition) return void update();
    const vt = document.startViewTransition(update);
    // the browser may skip a transition (for example if the window resizes); the update still runs
    [vt.ready, vt.finished, vt.updateCallbackDone].forEach((p) => p && p.catch(() => {}));
  }

  /** Smoothly tween a displayed price when it changes. */
  function tweenMoney(el, to) {
    const from = +el.dataset.v || 0;
    el.dataset.v = to;
    if (reduced || from === to) { el.textContent = money(to); return; }
    const t0 = performance.now();
    const frame = (t) => {
      if (+el.dataset.v !== to) return; // superseded by a newer value
      const k = Math.min(1, (t - t0) / 450);
      el.textContent = money(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------- nav */
  const nav = $("#nav"), seg = $(".seg"), pill = $(".seg__pill");
  function movePill() {
    const a = $("a.is-active", seg);
    pill.style.setProperty("--x", (a ? a.offsetLeft : 0) + "px");
    pill.style.setProperty("--w", (a ? a.offsetWidth : 0) + "px");
    pill.style.opacity = a ? 1 : 0;
  }
  function setNav(key) {
    $$("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === key));
    movePill();
  }

  function initShell() {
    const bar = $(".progress span");
    let ticking = false;
    const onScroll = () => {
      ticking = false;
      nav.classList.toggle("is-stuck", scrollY > 24);
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--p", max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
      const img = $(".cta > img");
      if (img && !reduced) {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) img.style.setProperty("--py", ((r.top + r.height / 2 - innerHeight / 2) * -0.07).toFixed(1) + "px");
      }
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    addEventListener("resize", movePill);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);
    onScroll();

    const burger = $(".nav__burger"), menu = $("#menu");
    const setMenu = (open) => {
      menu.hidden = !open;
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      burger.innerHTML = icon(open ? "x" : "menu");
      document.documentElement.style.overflow = open ? "hidden" : "";
      document.body.classList.toggle("menu-open", open);
    };
    burger.addEventListener("click", () => setMenu(menu.hidden));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setMenu(false); burger.focus(); } });
    matchMedia("(min-width: 1101px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

    // global delegated actions
    document.addEventListener("click", (e) => {
      const w = e.target.closest("[data-wish]");
      if (w) { e.preventDefault(); e.stopPropagation(); return toggleWish(w.dataset.wish); }
      const sc = e.target.closest("[data-scroll]");
      if (sc) { const to = document.getElementById(sc.dataset.scroll); if (to) to.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }
    });

    // pointer spotlight on cards
    if (matchMedia("(hover: hover)").matches) {
      let raf = 0;
      addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const card = e.target.closest && e.target.closest(".card");
          if (!card) return;
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", e.clientX - r.left + "px");
          card.style.setProperty("--my", e.clientY - r.top + "px");
        });
      }, { passive: true });
    }

    const foot = $("[data-footer-tours]");
    if (foot) foot.insertAdjacentHTML("beforeend", [...T.tours].sort((a, b) => b.reviews - a.reviews).slice(0, 5).map((t) => `<a href="#/tours/${t.id}">${esc(t.name)}</a>`).join(""));
    $$(".brand").forEach((a) => a.setAttribute("aria-label", `${T.name} — home`));
    hydrate(document);
  }

  /* ------------------------------------------------------------- export */
  Object.assign(TV, {
    T, $, $$, esc, icon, reduced, isPhone,
    DAY3, MON3, iso, fromIso, addDays, today, plusDays, nightsBetween, fmtDate, fmtShort, fmtRange, money, plural, stars, uid, refCode, hash,
    tour, hotel, car, dest, style, waLink,
    store, save, state, toast,
    openPop, closePop, pickList, pickDates, pickGuests, openSheet, closeSheet,
    reserve, removeTrip, toggleWish, wishBtn, tripMessage, tweenMoney, transition,
    go, render, hydrate, motion,
    start() { initShell(); addEventListener("hashchange", () => render(false)); render(true); },
  });
})();
