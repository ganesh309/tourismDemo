/* ==========================================================================
   Tourism demo — pages
   Home, tours (list + detail), stays (list + detail) and car hire.
   Each page registers { nav, title, render, mount } on TV.routes.
   ========================================================================== */
(() => {
  "use strict";

  const TV = window.TV;
  const { T, $, $$, esc, icon, money, plural, state, store } = TV;

  /* ------------------------------------------------------------- cards */
  const rate = (x) => `<span class="rate">${icon("star", "i--fill")}<b>${x.rating.toFixed(1)}</b> (${x.reviews})</span>`;
  const arrowBtn = `<span class="icon-btn icon-btn--dark" aria-hidden="true">${icon("arrow-up-right")}</span>`;

  const tourCard = (t, cls = "reveal") => `<article class="card tcard ${cls}">
    <span class="tcard__media"><img src="assets/img/${esc(t.img)}" alt="${esc(t.alt)}" width="1400" height="1000" loading="lazy">${t.badge ? `<span class="pill pill--glass tcard__badge">${esc(t.badge)}</span>` : ""}</span>
    ${TV.wishBtn(t.id)}
    <div class="tcard__body">
      <div class="tcard__meta"><span>${icon("map-pin")}${esc(t.country)}</span>${rate(t)}</div>
      <h3 class="tcard__title"><a href="#/tours/${t.id}">${esc(t.name)}</a></h3>
      <p class="tcard__place">${esc(t.place)}</p>
      <div class="tcard__foot"><div><div class="facts"><span>${icon("calendar-days")}${t.days} days</span><span>${icon("users")}${esc(t.group)}</span></div><div class="price"><small>from</small><b>${money(t.price)}</b> <span>per person</span></div></div>${arrowBtn}</div>
    </div></article>`;

  const hstars = (n) => `<span class="hstars" role="img" aria-label="${n}-star property">${icon("star").repeat(n)}</span>`;
  const amenTags = (h, max = 3) => h.amen.slice(0, max).map((a) => `<span class="tag">${icon(T.amenities[a].icon)}${esc(T.amenities[a].name)}</span>`).join("");

  const hotelCard = (h, cls = "reveal") => `<article class="card tcard ${cls}">
    <span class="tcard__media"><img src="assets/img/${esc(h.img)}" alt="${esc(h.alt)}" width="1200" height="860" loading="lazy"></span>
    <div class="tcard__body">
      <div class="tcard__meta"><span>${hstars(h.stars)}</span>${rate(h)}</div>
      <h3 class="tcard__title"><a href="#/hotels/${h.id}">${esc(h.name)}</a></h3>
      <p class="tcard__place">${esc(h.area)}</p>
      <div class="tcard__foot"><div class="price"><small>from</small><b>${money(h.price)}</b> <span>per night</span></div>${arrowBtn}</div>
    </div></article>`;

  const specs = (c) => `<ul class="specs"><li>${icon("users")}${c.seats} seats</li><li>${icon("briefcase")}${plural(c.bags, "bag")}</li><li>${icon("settings-2")}${esc(c.gear)}</li><li>${icon(c.fuel === "Electric" ? "zap" : "fuel")}${esc(c.fuel)}</li></ul>`;
  const carCard = (c, days, cls = "reveal") => `<article class="card ccard ${cls}">
    <div class="ccard__media"><img src="assets/img/${esc(c.img)}" alt="${esc(c.alt)}" width="1100" height="740" loading="lazy">${c.badge ? `<span class="pill pill--glass tcard__badge">${esc(c.badge)}</span>` : ""}</div>
    <div class="ccard__body">
      <div class="ccard__top"><h3>${esc(c.name)}</h3><small>or similar · ${esc(c.cls)}</small></div>
      ${specs(c)}
      <div class="ccard__foot"><div class="price"><small>${days ? `${money(c.price * days)} for ${plural(days, "day")}` : "from"}</small><b>${money(c.price)}</b> <span>per day</span></div><button class="icon-btn icon-btn--dark" type="button" data-car="${c.id}" aria-label="Select ${esc(c.name)}">${icon("arrow-up-right")}</button></div>
    </div></article>`;

  const head = (eyebrow, title, right) => `<div class="section__head reveal"><div><span class="eyebrow"><i></i>${eyebrow}</span><h2 class="h2">${title}</h2></div>${right || ""}</div>`;
  const more = (href, label) => `<a class="more" href="${href}">${label}<span>${icon("arrow-up-right")}</span></a>`;

  /* ------------------------------------------------------------ finder */
  const LENGTHS = [
    { value: "", label: "Any length" },
    { value: "short", label: "Up to 7 days", test: (d) => d <= 7 },
    { value: "mid", label: "8 – 9 days", test: (d) => d >= 8 && d <= 9 },
    { value: "long", label: "10 days or more", test: (d) => d >= 10 },
  ];
  const guestLabel = (h) => `${plural(h.adults + h.kids, "guest")} · ${plural(h.rooms, "room")}`;

  /**
   * Search widget used on the home hero (three tabs) and on the listing pages (one tab, live).
   * opts: { tab, tabs: bool, light: bool, live: fn | null }
   */
  function finderHTML(opts) {
    const tabs = [["tours", "map", "Tours"], ["hotels", "bed-double", "Stays"], ["cars", "car", "Cars"]];
    return `<div class="finder${opts.light ? " finder--light" : ""}" data-finder data-tab="${opts.tab}">
      ${opts.tabs ? `<div class="finder__tabs" role="tablist">${tabs.map(([id, ic, name]) => `<button class="finder__tab${id === opts.tab ? " is-active" : ""}" type="button" role="tab" aria-selected="${id === opts.tab}" data-ftab="${id}">${icon(ic)}${name}</button>`).join("")}<a class="finder__custom" href="#/plan">${icon("wand-sparkles")}Build my own trip${icon("arrow-right")}</a></div>` : ""}
      <div class="finder__row" data-frow></div></div>`;
  }

  function mountFinder(scope, opts, signal) {
    const el = $("[data-finder]", scope);
    if (!el) return;
    const row = $("[data-frow]", el);
    const fbtn = (key, ic, label, value) => `<button class="fbtn" type="button" data-f="${key}" aria-haspopup="dialog" aria-expanded="false"><span class="fbtn__ico">${icon(ic)}</span><span><small>${label}</small><b>${esc(value)}</b></span></button>`;
    const goBtn = (label) => `<button class="btn btn--dark finder__go" type="button" data-fgo><span>${label}</span><span class="btn__arrow">${icon(opts.live ? "search" : "arrow-right")}</span></button>`;
    const paint = () => {
      const tab = el.dataset.tab;
      const t = state.tours, h = state.hotels, c = state.cars;
      if (tab === "tours") row.innerHTML = fbtn("region", "map-pin", "Where to", t.region || "Anywhere") + fbtn("style", "compass", "Travel style", t.style ? TV.style(t.style).name : "Any style") + fbtn("length", "calendar-days", "Trip length", LENGTHS.find((l) => l.value === t.length).label) + goBtn("Find tours");
      if (tab === "hotels") row.innerHTML = fbtn("dest", "map-pin", "Destination", h.dest ? TV.dest(h.dest).name : "Any destination") + fbtn("hdates", "calendar-days", "Check-in — Check-out", TV.fmtRange(h.from, h.to)) + fbtn("guests", "users", "Guests", guestLabel(h)) + goBtn(opts.live ? "Update" : "Find stays");
      if (tab === "cars") row.innerHTML = fbtn("pickup", "map-pin", "Pick-up", c.pickup) + fbtn("cdates", "calendar-days", "Pick-up — Return", TV.fmtRange(c.from, c.to)) + fbtn("ctype", "car", "Car type", c.type ? T.carTypes.find((x) => x.id === c.type).name : "Any type") + goBtn(opts.live ? "Update" : "Find cars");
    };
    const changed = () => { paint(); if (opts.live) opts.live(); };

    el.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-ftab]"), f = e.target.closest("[data-f]"), goEl = e.target.closest("[data-fgo]");
      if (tab) {
        el.dataset.tab = tab.dataset.ftab;
        $$("[data-ftab]", el).forEach((b) => { const on = b === tab; b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on); });
        TV.closePop();
        return paint();
      }
      if (goEl) {
        TV.closePop();
        if (opts.live) return opts.live(true);
        return TV.go(`#/${el.dataset.tab}`);
      }
      if (!f) return;
      const t = state.tours, h = state.hotels, c = state.cars;
      const key = f.dataset.f;
      const pick = (title, options, value, set) => TV.pickList(f, { title, options, value, onPick: (v) => { set(v); changed(); } });
      if (key === "region") pick("Where to", [{ value: "", label: "Anywhere", sub: `${T.tours.length} tours`, icon: "globe" }, ...T.regions.map((r) => ({ value: r, label: r, sub: plural(T.tours.filter((x) => x.region === r).length, "tour"), icon: "map-pin" }))], t.region, (v) => { t.region = v; t.dest = ""; });
      if (key === "style") pick("Travel style", [{ value: "", label: "Any style", icon: "sparkles" }, ...T.styles.map((s) => ({ value: s.id, label: s.name, icon: s.icon }))], t.style, (v) => (t.style = v));
      if (key === "length") pick("Trip length", LENGTHS.map((l) => ({ value: l.value, label: l.label, icon: "calendar-days" })), t.length, (v) => (t.length = v));
      if (key === "dest") pick("Destination", [{ value: "", label: "Any destination", sub: `${T.hotels.length} places to stay`, icon: "globe" }, ...T.destinations.map((d) => ({ value: d.id, label: d.name, sub: d.country, img: d.img }))], h.dest, (v) => (h.dest = v));
      if (key === "hdates") TV.pickDates(f, { start: h.from, end: h.to, labels: ["Check-in", "Check-out"], onPick: (a, b) => { h.from = a; h.to = b; changed(); } });
      if (key === "guests") TV.pickGuests(f, { adults: h.adults, kids: h.kids, rooms: h.rooms, onChange: (v) => { Object.assign(h, v); $("b", f).textContent = guestLabel(h); if (opts.live) opts.live(); } });
      if (key === "pickup") pick("Pick-up location", T.pickups.map((p) => ({ value: p, label: p, icon: "map-pin" })), c.pickup, (v) => (c.pickup = v));
      if (key === "cdates") TV.pickDates(f, { start: c.from, end: c.to, labels: ["Pick-up", "Return"], onPick: (a, b) => { c.from = a; c.to = b; changed(); } });
      if (key === "ctype") pick("Car type", [{ value: "", label: "Any type", icon: "car" }, ...T.carTypes.map((x) => ({ value: x.id, label: x.name, icon: "car" }))], c.type, (v) => (c.type = v));
    }, { signal });
    paint();
    return paint;
  }

  /* -------------------------------------------------------------- home */
  const FEATURED = ["swiss-alps", "japan", "santorini", "bali", "iceland", "kenya"];
  const DEST_TOURS = ["swiss-alps", "santorini", "bali", "maldives", "japan"];

  /** Months a tour runs in, read from its season text ("Jun – Sep", "Mar – May · Oct – Nov"). */
  function seasonMonths(season) {
    const set = new Set();
    String(season).split("·").forEach((part) => {
      const m = part.match(/([A-Za-z]{3})\s*–\s*([A-Za-z]{3})/);
      const a = m ? TV.MON3.indexOf(m[1]) : -1, b = m ? TV.MON3.indexOf(m[2]) : -1;
      if (a < 0 || b < 0) return;
      for (let i = a; ; i = (i + 1) % 12) { set.add(i); if (i === b) break; }
    });
    return set.size ? set : new Set(Array.from({ length: 12 }, (_, i) => i));
  }

  /** Fortnightly Saturday departures, starting about three weeks out and only inside the tour's season. */
  function departuresFor(t, count = 4) {
    const months = seasonMonths(t.season);
    let d = TV.addDays(new Date(), 24);
    while (d.getDay() !== 6) d = TV.addDays(d, 1);
    const out = [];
    for (let guard = 0; out.length < count && guard < 160; guard++) {
      if (!months.has(d.getMonth())) { d = TV.addDays(d, 7); continue; }
      out.push({ start: TV.iso(d), end: TV.iso(TV.addDays(d, t.days - 1)), left: 2 + Math.floor(TV.hash(t.id + TV.iso(d)) * 9) });
      d = TV.addDays(d, 14);
    }
    return out;
  }

  function reelHTML() {
    return `<section class="section"><div class="wrap"><div class="tour">
      <div class="reel reveal" data-reel>
        <video class="reel__video" muted playsinline preload="none" aria-label="Short clips from our destinations"></video>
        <div class="reel__shade" aria-hidden="true"></div>
        <div class="reel__top"><span class="pill pill--glass">${icon("play")}Postcards in motion</span><button class="icon-btn icon-btn--glass" type="button" data-reel-toggle aria-label="Pause video">${icon("pause")}</button></div>
        <div class="reel__copy"><h2 class="h2">See where you <em>could be.</em></h2><p data-reel-caption></p></div>
        <div class="reel__chapters" role="tablist" aria-label="Clips" data-reel-chapters></div>
      </div>
      <aside class="tour__side">
        <article class="card card--photo reveal"><img src="assets/img/x-friends.jpg" alt="Four friends laughing on a mountain hike" width="1400" height="1000" loading="lazy"><div class="card__caption"><div><strong>Small groups, good company</strong><span>Never more than 14, usually fewer</span></div></div></article>
        <article class="card reveal"><h3 class="card__title">Why travellers come back</h3>
          <ul class="facts-list">
            <li><span class="facts-list__ico">${icon("users")}</span><div><b>Local guides</b><small>Born there, not flown in</small></div></li>
            <li><span class="facts-list__ico">${icon("shield-check")}</span><div><b>Flexible by default</b><small>Free changes up to 45 days out</small></div></li>
            <li><span class="facts-list__ico">${icon("headset")}</span><div><b>Someone always on call</b><small>24/7 on WhatsApp while you travel</small></div></li>
          </ul></article>
      </aside></div></div></section>`;
  }

  function mountReel(scope, signal) {
    const box = $("[data-reel]", scope);
    const clips = T.reel || [];
    if (!box || !clips.length) return;
    const video = $("video", box), caption = $("[data-reel-caption]", box), toggle = $("[data-reel-toggle]", box), chapBox = $("[data-reel-chapters]", box);
    const MAX = 9;
    let idx = 0, started = false, inView = false, paused = TV.reduced;
    chapBox.innerHTML = clips.map((c, i) => `<button class="reel__chap" type="button" role="tab" aria-selected="false" data-clip="${i}"><span class="reel__bar"><i></i></span><b>${esc(c.title)}</b><small>${esc(c.sub)}</small></button>`).join("");
    const chaps = $$(".reel__chap", chapBox);
    const paintToggle = () => { toggle.innerHTML = icon(paused ? "play" : "pause"); toggle.setAttribute("aria-label", paused ? "Play video" : "Pause video"); };
    const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    const load = (i) => {
      idx = (i + clips.length) % clips.length;
      const c = clips[idx];
      box.style.backgroundImage = `url("assets/video/${c.file}.jpg")`;
      video.classList.remove("is-on");
      video.poster = `assets/video/${c.file}.jpg`;
      video.src = `assets/video/${c.file}.mp4`;
      video.load();
      caption.textContent = c.caption;
      chaps.forEach((b, j) => { b.classList.toggle("is-active", j === idx); b.classList.toggle("is-done", j < idx); b.setAttribute("aria-selected", j === idx); b.style.setProperty("--p", 0); });
      if (!paused && inView) play();
    };
    video.addEventListener("playing", () => video.classList.add("is-on"), { signal });
    video.addEventListener("timeupdate", () => {
      const len = Math.min(video.duration || MAX, MAX);
      chaps[idx].style.setProperty("--p", Math.min(100, (video.currentTime / len) * 100).toFixed(1));
      if (video.currentTime >= len) load(idx + 1);
    }, { signal });
    video.addEventListener("ended", () => load(idx + 1), { signal });
    toggle.addEventListener("click", () => { paused = !paused; paintToggle(); if (paused) video.pause(); else if (!started) { started = true; load(0); } else play(); }, { signal });
    chapBox.addEventListener("click", (e) => { const b = e.target.closest("[data-clip]"); if (!b) return; paused = false; started = true; paintToggle(); load(+b.dataset.clip); }, { signal });
    const io = new IntersectionObserver(([en]) => {
      inView = en.isIntersecting;
      if (!inView) return video.pause();
      if (paused) return;
      if (!started) { started = true; load(0); } else play();
    }, { threshold: 0.35 });
    io.observe(box);
    signal.addEventListener("abort", () => { io.disconnect(); video.pause(); });
    box.style.backgroundImage = `url("assets/video/${clips[0].file}.jpg")`;
    caption.textContent = clips[0].caption;
    chaps[0].classList.add("is-active");
    paintToggle();
  }

  function mountAccordions(scope, signal) {
    scope.addEventListener("click", (e) => {
      const btn = e.target.closest(".acc__item > button");
      if (!btn) return;
      const item = btn.parentElement, acc = item.parentElement;
      const willOpen = !item.classList.contains("is-open");
      $$(".acc__item.is-open", acc).forEach((it) => { it.classList.remove("is-open"); $("button", it).setAttribute("aria-expanded", "false"); });
      if (willOpen) { item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
    }, { signal });
  }

  const quote = (r, hidden) => {
    const initials = r.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    return `<figure class="card quote"${hidden ? ' aria-hidden="true"' : ""}>${TV.stars(r.stars)}<blockquote>“${esc(r.text)}”</blockquote><figcaption><span class="quote__av">${esc(initials)}</span><span><b>${esc(r.name)}</b><small>${esc(r.trip)}</small></span></figcaption></figure>`;
  };
  function quotesHTML() {
    const half = Math.ceil(T.reviews.length / 2);
    return [T.reviews.slice(0, half), T.reviews.slice(half)].filter((r) => r.length).map((list, i) => {
      const times = Math.max(1, Math.ceil((Math.max(screen.width, innerWidth) + 420) / (list.length * 404)));
      const set = (hidden) => Array.from({ length: times }, (_, k) => list.map((r) => quote(r, hidden || k > 0)).join("")).join("");
      return `<div class="quotes__row${i ? " quotes__row--rev" : ""}">${set(false)}${set(true)}</div>`;
    }).join("");
  }

  TV.routes.home = {
    nav: "home",
    render() {
      // the two tours that really do leave next, from different parts of the world
      const next = T.tours.map((t) => ({ t, d: departuresFor(t, 1)[0] })).filter((x) => x.d).sort((a, b) => (a.d.start < b.d.start ? -1 : a.d.start > b.d.start ? 1 : b.t.reviews - a.t.reviews));
      const soon = next.length ? [next[0], next.find((x) => x.t.region !== next[0].t.region) || next[1]].filter(Boolean) : [];
      const ticker = T.highlights.map((h) => `<span class="ticker__item"><i>${icon("check")}</i>${esc(h)}</span>`).join("");
      return `
      <section class="hero"><div class="wrap">
        <div class="hero__stage" data-load="0" style="background-image:url('assets/video/hero.jpg')">
          <video class="hero__video" muted loop playsinline autoplay preload="metadata" poster="assets/video/hero.jpg"><source src="assets/video/hero.mp4" type="video/mp4"></video>
          <div class="hero__shade" aria-hidden="true"></div>
          <div class="hero__top" data-load="2">
            <span class="pill pill--glass"><span class="dot dot--live"></span>New season departures are open</span>
            <span class="pill pill--glass hero__rate">${icon("star", "i--fill")}${T.stats.rating} · ${T.stats.travellers.toLocaleString("en")} travellers</span>
          </div>
          <div class="hero__copy">
            <h1 class="hero__title" data-load="3">Find your next <em>horizon.</em></h1>
            <p class="hero__lead" data-load="4">Small-group tours, handpicked stays and car hire in ${T.tours.length} destinations — or build a journey that is entirely yours.</p>
          </div>
          <aside class="hero__card" data-load="5" aria-label="Departing soon">
            <h2>Departing soon<a href="#/tours" aria-label="All tours">${icon("arrow-up-right")}</a></h2>
            ${soon.map(({ t, d }) => `<a class="dep" href="#/tours/${t.id}"><img src="assets/img/${esc(t.img)}" alt="" loading="lazy"><span><b>${esc(t.name)}</b><small>${TV.fmtShort(d.start)} · ${t.days} days</small></span><span class="dep__left">${d.left} left</span></a>`).join("")}
          </aside>
          <div data-load="6" style="grid-column:1/-1">${finderHTML({ tab: "tours", tabs: true })}</div>
        </div>
        <dl class="hero__stats reveal">
          <div><dd><span data-count="${T.stats.travellers}">${T.stats.travellers.toLocaleString("en")}</span></dd><dt>travellers sent on their way</dt></div>
          <div><dd><span data-count="${T.tours.length}">${T.tours.length}</span></dd><dt>small-group tours</dt></div>
          <div><dd><span data-count="${T.stats.countries}">${T.stats.countries}</span></dd><dt>countries, all with local guides</dt></div>
          <div><dd><span data-count="${T.stats.rating}" data-decimals="1">${T.stats.rating}</span></dd><dt>average traveller rating</dt></div>
        </dl>
      </div></section>

      <div class="ticker" aria-hidden="true"><div class="ticker__track">${ticker}${ticker}</div></div>

      <section class="section"><div class="wrap">
        ${head("Destinations", "Places worth the <em>long way round.</em>", `<p class="lead">From cowbell valleys to coral atolls — start with the places travellers ask us for most.</p>`)}
        <div class="dbento">${DEST_TOURS.map(TV.tour).map((t) => { const d = TV.dest(t.dest); return `<a class="card card--photo dcard reveal" href="#/tours/${t.id}"><img src="assets/img/${esc(t.img)}" alt="${esc(t.alt)}" width="1400" height="1000" loading="lazy"><span class="pill pill--glass card__tl">${icon("calendar-days")}${t.days} days from ${money(t.price)}</span><div class="card__caption"><div><strong>${esc(d.name)}</strong><span>${esc(d.tagline)}</span></div><span class="dcard__go">${icon("arrow-up-right")}</span></div></a>`; }).join("")}</div>
      </div></section>

      <section class="section"><div class="wrap">
        ${head("Signature tours", "Our most-loved <em>journeys.</em>", more("#/tours", `All ${T.tours.length} tours`))}
        <div class="tgrid">${FEATURED.map(TV.tour).map((t) => tourCard(t)).join("")}</div>
      </div></section>

      <section class="section"><div class="wrap">
        ${head("Travel your way", "Pick a mood, <em>not a map.</em>", `<p class="lead">Not sure where yet? Start with how you like to travel and we'll show you what fits.</p>`)}
        <div class="sgrid">${T.styles.map((s) => `<a class="card scard reveal" href="#/tours?style=${s.id}"><span class="scard__ico">${icon(s.icon)}</span><span><b>${esc(s.name)}</b><small>${plural(T.tours.filter((t) => t.styles.includes(s.id)).length, "tour")}</small></span>${icon("arrow-up-right")}</a>`).join("")}</div>
      </div></section>

      <section class="section"><div class="wrap">
        <div class="card promo reveal">
          <div class="promo__copy">
            <span class="eyebrow"><i></i>Trip builder</span>
            <h2 class="h2">Can't find the one? <em>Build it.</em></h2>
            <p class="lead">Choose where, how long and how you like to travel. Add the experiences you want, shuffle the days around and watch the price update as you go.</p>
            <ol class="promo__steps">
              <li>Pick up to three destinations<small>1 min</small></li>
              <li>Choose your stays and how you get around<small>1 min</small></li>
              <li>Add experiences and arrange your days<small>2 min</small></li>
              <li>Save it, share it, or ask for a firm quote<small>instant</small></li>
            </ol>
            <div class="promo__cta"><a class="btn btn--dark" href="#/plan"><span>Start building</span><span class="btn__arrow">${icon("arrow-up-right")}</span></a><a class="link-btn" href="#/trips">See my saved trips</a></div>
          </div>
          <div class="promo__media">
            <img src="assets/img/x-plan.jpg" alt="A map, camera and notebook laid out for trip planning" width="1400" height="1000" loading="lazy">
            <div class="mock" aria-hidden="true">
              <div class="mock__head"><b>Bali &amp; Thai Islands · 10 days</b><span>${money(2480)}</span></div>
              <div class="mock__row"><i>D1</i>Arrive in Ubud<small>Private driver</small></div>
              <div class="mock__row"><i>D2</i>Sunrise at Ulun Danu Bratan<small>${money(65)}</small></div>
              <div class="mock__row"><i>D6</i>Phi Phi &amp; Maya Bay by speedboat<small>${money(95)}</small></div>
            </div>
          </div>
        </div>
      </div></section>

      <section class="section"><div class="wrap">
        ${head("Stays", "Rooms with a <em>reason.</em>", more("#/hotels", "All stays"))}
        <div class="hgrid">${["ubud-canopy", "azure-atoll", "lakeview-terrace", "caldera-white"].map(TV.hotel).map((h) => hotelCard(h)).join("")}</div>
      </div></section>

      <section class="section"><div class="wrap">
        <div class="wheels reveal">
          ${head("Car hire", "Keys, please. <em>Any road.</em>", more("#/cars", "See the fleet")).replace(" reveal", "")}
          <div class="cgrid">${["cr-v", "tesla-3", "vw-camper"].map(TV.car).map((c) => carCard(c, 0, "")).join("")}</div>
        </div>
      </div></section>

      ${reelHTML()}

      <section class="section"><div class="wrap">
        ${head("How it works", "Three steps to <em>out of office.</em>", `<p class="lead">Book a ready-made tour in minutes, or have a travel designer shape one around you.</p>`)}
        <ol class="steps-row">
          <li class="card step reveal"><span class="step__n">01</span><span class="step__ico">${icon("compass")}</span><h3>Choose or build</h3><p>Pick a small-group tour, or use the trip builder to shape your own route, stays and pace.</p></li>
          <li class="card step reveal"><span class="step__n">02</span><span class="step__ico">${icon("message-circle")}</span><h3>We fine-tune it</h3><p>A travel designer checks every detail and sends a firm quote within one working day.</p></li>
          <li class="card step reveal"><span class="step__n">03</span><span class="step__ico">${icon("plane")}</span><h3>Go, with backup</h3><p>Everything lands in one itinerary on your phone, with a local contact in every stop.</p></li>
        </ol>
        <dl class="numbers reveal">
          <div><dd><span data-count="${T.stats.years}" data-suffix=" yrs">${T.stats.years} yrs</span></dd><dt>designing trips</dt></div>
          <div><dd><span data-count="96" data-suffix="%">96%</span></dd><dt>would travel with us again</dt></div>
          <div><dd><span data-count="14">14</span></dd><dt>travellers at most per group</dt></div>
          <div><dd><span data-count="24" data-suffix="/7">24/7</span></dd><dt>support on WhatsApp</dt></div>
        </dl>
      </div></section>

      <section class="section">
        <div class="wrap">${head("Traveller stories", "Told by the people <em>who went.</em>", `<div class="rating"><strong>${T.stats.rating}</strong><div>${TV.stars(5)}<small>from ${T.stats.travellers.toLocaleString("en")}+ travellers</small></div></div>`)}</div>
        <div class="quotes reveal">${quotesHTML()}</div>
      </section>

      <section class="section" id="faq"><div class="wrap"><div class="faq">
        <div class="faq__intro reveal">
          <span class="eyebrow"><i></i>Good to know</span>
          <h2 class="h2">Questions, <em>answered.</em></h2>
          <p class="lead">Still deciding? Ask ${esc(T.assistant)}, our assistant, or message a travel designer directly.</p>
          <div class="faq__cta"><button class="btn btn--dark" type="button" data-chat-open>${icon("bot")}<span>Ask ${esc(T.assistant)}</span></button><a class="btn btn--glass" data-wa href="#" target="_blank" rel="noopener">${icon("whatsapp", "i--brand")}<span>WhatsApp us</span></a></div>
        </div>
        <div class="acc card reveal">${T.faqs.map((f, i) => `<div class="acc__item${i === 0 ? " is-open" : ""}"><button type="button" aria-expanded="${i === 0}">${esc(f.q)}${icon("plus", "acc__plus")}</button><div class="acc__panel"><div><p>${esc(f.a)}</p></div></div></div>`).join("")}</div>
      </div></div></section>

      <section class="section section--tight"><div class="wrap">
        <div class="cta reveal">
          <img src="assets/img/x-stars.jpg" alt="" width="1800" height="1000" loading="lazy">
          <div class="cta__inner">
            <h2 class="h2">The best trips start with <em>“what if?”</em></h2>
            <p>Tell us where, when and who with. We'll come back with a route, a price and a few ideas you hadn't thought of.</p>
            <div class="cta__actions"><a class="btn btn--light" href="#/plan"><span>Plan my trip</span><span class="btn__arrow">${icon("arrow-up-right")}</span></a><a class="btn btn--glass-dark" data-wa href="#" target="_blank" rel="noopener">${icon("whatsapp", "i--brand")}<span>Chat on WhatsApp</span></a></div>
          </div>
        </div>
      </div></section>`;
    },
    mount(root, r, signal) {
      mountFinder(root, { tab: "tours", tabs: true }, signal);
      mountReel(root, signal);
      mountAccordions(root, signal);
      root.addEventListener("click", (e) => { const b = e.target.closest("[data-car]"); if (b) openCar(b.dataset.car); }, { signal });
      const v = $(".hero__video", root);
      if (v) { if (TV.reduced) { v.removeAttribute("autoplay"); v.pause(); } else { const p = v.play(); if (p && p.catch) p.catch(() => {}); } }
    },
  };

  /* ------------------------------------------------------------- tours */
  const SORTS = [
    { value: "top", label: "Recommended", fn: (a, b) => b.reviews * b.rating - a.reviews * a.rating },
    { value: "price", label: "Price: low to high", fn: (a, b) => a.price - b.price },
    { value: "price-desc", label: "Price: high to low", fn: (a, b) => b.price - a.price },
    { value: "days", label: "Shortest first", fn: (a, b) => a.days - b.days },
    { value: "rating", label: "Top rated", fn: (a, b) => b.rating - a.rating || b.reviews - a.reviews },
  ];
  const TOUR_MAX = Math.ceil(Math.max(...T.tours.map((t) => t.price)) / 100) * 100;

  function tourResults() {
    const f = state.tours;
    const q = f.q.trim().toLowerCase();
    const len = LENGTHS.find((l) => l.value === f.length);
    return T.tours
      .filter((t) => (!f.region || t.region === f.region) && (!f.style || t.styles.includes(f.style)) && (!len.test || len.test(t.days)) && (!f.max || t.price <= f.max) && (!f.saved || store.wish.includes(t.id)) && (!q || `${t.name} ${t.place} ${t.country} ${t.region}`.toLowerCase().includes(q)))
      .sort(SORTS.find((s) => s.value === f.sort).fn);
  }

  TV.routes.tours = {
    nav: "tours",
    title: (r) => (r.id && TV.tour(r.id) ? TV.tour(r.id).name : "Tours"),
    render(r) {
      if (r.id) return TV.tour(r.id) ? tourDetail(TV.tour(r.id)) : notFound("That tour has moved on", "#/tours", "Browse all tours");
      const f = state.tours;
      if ("style" in r.query || "region" in r.query) Object.assign(f, { q: "", length: "", max: 0, saved: false, style: TV.style(r.query.style) ? r.query.style : "", region: T.regions.includes(r.query.region) ? r.query.region : "" });
      if (r.query.saved) f.saved = true;
      return `<section class="page"><div class="wrap">
        <header class="page__head" data-load="0"><div><span class="eyebrow"><i></i>Tours</span><h1 class="h1">${T.tours.length} journeys, <em>zero filler.</em></h1></div><p class="lead">Small groups, local guides and routes we have walked ourselves. Filter by where, how and how long.</p></header>
        <div class="card filters" data-load="1">
          <div class="filters__row">
            <label class="search">${icon("search")}<input type="search" placeholder="Search a country, city or tour" value="${esc(f.q)}" data-q aria-label="Search tours"></label>
            <label class="range"><span>Budget per person<b data-max-label></b></span><input type="range" min="1000" max="${TOUR_MAX}" step="100" value="${f.max || TOUR_MAX}" data-max aria-label="Maximum price"></label>
            <button class="select" type="button" data-sort aria-haspopup="dialog" aria-expanded="false"><small>Sort</small><span data-sort-label></span>${icon("chevron-down")}</button>
          </div>
          <div class="filters__row"><div class="chips" data-regions role="group" aria-label="Region"></div></div>
          <div class="filters__row"><div class="chips" data-styles role="group" aria-label="Travel style"></div></div>
          <div class="filters__row"><span class="filters__label">Length</span><div class="chips" data-lengths role="group" aria-label="Trip length"></div></div>
        </div>
        <div class="results__bar"><span><b data-count-label></b></span><span><button class="linkish" type="button" data-saved></button> · <button class="linkish" type="button" data-reset>Reset filters</button></span></div>
        <div class="tgrid" data-results></div>
      </div></section>`;
    },
    mount(root, r, signal) {
      if (r.id) return mountTourDetail(root, TV.tour(r.id), signal);
      const f = state.tours;
      const chip = (attr, value, label, on, ic) => `<button class="chip${on ? " is-active" : ""}" type="button" aria-pressed="${on}" data-${attr}="${esc(value)}">${ic ? icon(ic) : ""}${esc(label)}</button>`;
      const paint = (animate) => {
        $("[data-regions]", root).innerHTML = chip("region", "", "All regions", !f.region) + T.regions.map((x) => chip("region", x, x, f.region === x)).join("");
        $("[data-styles]", root).innerHTML = chip("style", "", "Any style", !f.style) + T.styles.map((s) => chip("style", s.id, s.name, f.style === s.id, s.icon)).join("");
        $("[data-lengths]", root).innerHTML = LENGTHS.map((l) => chip("length", l.value, l.label, f.length === l.value)).join("");
        $("[data-max-label]", root).textContent = !f.max || f.max >= TOUR_MAX ? "Any" : `up to ${money(f.max)}`;
        $("[data-sort-label]", root).textContent = SORTS.find((s) => s.value === f.sort).label;
        $("[data-saved]", root).textContent = f.saved ? "Show all tours" : `Saved only (${store.wish.length})`;
        const list = tourResults();
        $("[data-count-label]", root).textContent = `${plural(list.length, "tour")} found`;
        const html = list.length ? list.map((t) => tourCard(t, "")).join("") : `<div class="card empty" style="grid-column:1/-1"><span class="empty__ico">${icon("compass")}</span><h3>Nothing matches — yet</h3><p>Try widening the budget or clearing a filter. Or build exactly the trip you have in mind.</p><a class="btn btn--dark" href="#/plan"><span>Open the trip builder</span><span class="btn__arrow">${icon("arrow-up-right")}</span></a></div>`;
        const box = $("[data-results]", root);
        const swap = () => (box.innerHTML = html);
        TV.transition(swap, animate);
      };
      root.addEventListener("click", (e) => {
        const b = e.target.closest("[data-region],[data-style],[data-length]");
        if (b) { if ("region" in b.dataset) f.region = b.dataset.region; if ("style" in b.dataset) f.style = b.dataset.style; if ("length" in b.dataset) f.length = b.dataset.length; return paint(true); }
        if (e.target.closest("[data-reset]")) { Object.assign(f, { q: "", region: "", style: "", length: "", max: 0, sort: "top", saved: false }); $("[data-q]", root).value = ""; $("[data-max]", root).value = TOUR_MAX; return paint(true); }
        if (e.target.closest("[data-saved]")) { f.saved = !f.saved; return paint(true); }
        const s = e.target.closest("[data-sort]");
        if (s) TV.pickList(s, { title: "Sort by", options: SORTS.map((x) => ({ value: x.value, label: x.label })), value: f.sort, onPick: (v) => { f.sort = v; paint(true); } });
      }, { signal });
      $("[data-q]", root).addEventListener("input", (e) => { f.q = e.target.value; paint(false); }, { signal });
      $("[data-max]", root).addEventListener("input", (e) => { const v = +e.target.value; f.max = v >= TOUR_MAX ? 0 : v; paint(false); }, { signal });
      paint(false);
    },
  };

  const notFound = (title, href, label) => `<section class="page"><div class="wrap"><div class="card empty"><span class="empty__ico">${icon("map")}</span><h3>${title}</h3><p>The link may be out of date. Everything we currently offer is one tap away.</p><a class="btn btn--dark" href="${href}"><span>${label}</span><span class="btn__arrow">${icon("arrow-up-right")}</span></a></div></div></section>`;

  function itinerary(t) {
    const days = [];
    let n = 1;
    t.route.forEach((stop, si) => {
      for (let k = 0; k < stop.nights; k++) days.push({ n: n++, place: stop.place, title: stop.do[k] || "Free day to explore at your own pace", move: k === 0, first: si === 0 && k === 0 });
    });
    days.push({ n, place: t.route[t.route.length - 1].place, title: "Farewell breakfast and onward travel", last: true });
    return days;
  }

  function tourDetail(t) {
    const days = itinerary(t);
    const similar = T.tours.filter((x) => x.id !== t.id && (x.region === t.region || x.styles.some((s) => t.styles.includes(s)))).sort((a, b) => (b.region === t.region) - (a.region === t.region) || b.reviews - a.reviews).slice(0, 3);
    const included = [`${t.days - 1} nights in hand-picked hotels`, "Daily breakfast, plus selected lunches and dinners", "Every activity and entrance fee listed", "Transport between all stops", "English-speaking local guide", "24/7 support on WhatsApp"];
    const excluded = ["International flights", "Visas and travel insurance", "Tips and personal spending", "Optional extras"];
    return `<section class="page"><div class="wrap">
      <a class="back" href="#/tours">${icon("chevron-left")}All tours</a>
      <div class="card card--photo dhero" data-load="0">
        <img src="assets/img/${esc(t.img)}" alt="${esc(t.alt)}" width="1400" height="1000" fetchpriority="high">
        <div class="dhero__top"><span class="pill pill--glass">${icon("map-pin")}${esc(t.country)} · ${esc(t.region)}</span>${TV.wishBtn(t.id)}</div>
        <div class="dhero__body">
          <h1 class="h1">${esc(t.name)}</h1>
          <p class="dhero__place">${esc(t.place)}</p>
          <div class="dhero__facts">
            <span class="pill pill--glass">${icon("calendar-days")}${t.days} days</span>
            <span class="pill pill--glass">${icon("users")}${esc(t.group)}</span>
            <span class="pill pill--glass">${icon("footprints")}${esc(t.level)}</span>
            <span class="pill pill--glass">${icon("sun")}${esc(t.season)}</span>
            <span class="pill pill--glass">${icon("star", "i--fill")}${t.rating.toFixed(1)} (${t.reviews})</span>
          </div>
        </div>
      </div>
      <div class="detail__grid">
        <div class="detail__main">
          <article class="card block reveal"><h2>The trip in a sentence</h2><p>${esc(t.blurb)}</p><ul class="ticks">${t.highlights.map((h) => `<li>${icon("check")}${esc(h)}</li>`).join("")}</ul></article>
          <article class="card block reveal"><h2>Day by day</h2>
            <div class="routechips">${t.route.map((s, i) => `${i ? icon("arrow-right") : ""}<span><b>${esc(s.place)}</b><small>${plural(s.nights, "night")}</small></span>`).join("")}</div>
            <div class="tl">${days.map((d) => `<div class="tl__item${d.move || d.last ? " is-move" : ""}"><span class="tl__day">Day ${d.n}</span><div class="tl__body"><b>${esc(d.title)}</b><small>${esc(d.place)}${d.first ? " · arrival day" : d.last ? " · departure" : d.move ? " · travel day" : ""}</small></div></div>`).join("")}</div>
          </article>
          <article class="card block reveal"><h2>What's included</h2>
            <div class="incl"><div><h3>Included</h3><ul>${included.map((x) => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul></div><div><h3>Not included</h3><ul>${excluded.map((x) => `<li class="is-not">${icon("minus")}${esc(x)}</li>`).join("")}</ul></div></div>
          </article>
        </div>
        <aside class="card bookcard" data-book></aside>
      </div>
      ${similar.length ? `<div class="section section--tight">${head("Keep looking", "You might also <em>like.</em>", more("#/tours", "All tours"))}<div class="tgrid">${similar.map((x) => tourCard(x)).join("")}</div></div>` : ""}
    </div></section>`;
  }

  function mountTourDetail(root, t, signal) {
    if (!t) return;
    const box = $("[data-book]", root);
    const deps = departuresFor(t).slice(0, 3);
    const b = { dep: 0, adults: 2, kids: 0, extras: new Set() };
    const calc = () => {
      const people = b.adults + b.kids;
      const base = b.adults * t.price + b.kids * t.price * 0.7;
      const extras = T.tourExtras.filter((x) => b.extras.has(x.id)).map((x) => ({ ...x, total: x.price * (x.id === "private-room" ? b.adults : people) }));
      return { people, base, extras, total: base + extras.reduce((s, x) => s + x.total, 0) };
    };
    const paint = () => {
      const c = calc();
      box.innerHTML = `
        <div class="bookcard__price"><div class="price"><small>from</small><b>${money(t.price)}</b> <span>per adult</span></div>${rate(t)}</div>
        <div><h3>Departure</h3><div class="opts">${deps.map((d, i) => `<button class="opt${i === b.dep ? " is-active" : ""}" type="button" data-dep="${i}"><b>${TV.fmtRange(d.start, d.end)}</b><small class="${d.left <= 4 ? "is-low" : ""}">${d.left} spots left</small></button>`).join("")}</div></div>
        <div><h3>Travellers</h3><div class="who">
          <div><span><b>Adults</b><small>${money(t.price)} each</small></span><span class="stepper"><button type="button" data-step="adults:-1" aria-label="Fewer adults"${b.adults <= 1 ? " disabled" : ""}>${icon("minus")}</button><b>${b.adults}</b><button type="button" data-step="adults:1" aria-label="More adults"${b.adults >= 10 ? " disabled" : ""}>${icon("plus")}</button></span></div>
          <div><span><b>Children</b><small>Ages 6–12 · ${money(t.price * 0.7)} each</small></span><span class="stepper"><button type="button" data-step="kids:-1" aria-label="Fewer children"${b.kids <= 0 ? " disabled" : ""}>${icon("minus")}</button><b>${b.kids}</b><button type="button" data-step="kids:1" aria-label="More children"${b.kids >= 6 ? " disabled" : ""}>${icon("plus")}</button></span></div>
        </div></div>
        <div><h3>Add to your trip</h3><div class="checks">${T.tourExtras.map((x) => `<button class="check" type="button" role="checkbox" aria-checked="${b.extras.has(x.id)}" data-extra="${x.id}"><span class="check__ico">${icon(x.icon)}</span><span><b>${esc(x.name)}</b><small>${esc(x.note)}</small></span><em>+${money(x.price)}</em><span class="check__box">${icon("check")}</span></button>`).join("")}</div></div>
        <dl class="breakdown">
          <div><dt>${plural(b.adults, "adult")}${b.kids ? ` + ${plural(b.kids, "child", "children")}` : ""}</dt><dd>${money(c.base)}</dd></div>
          ${c.extras.map((x) => `<div><dt>${esc(x.name)}</dt><dd>${money(x.total)}</dd></div>`).join("")}
        </dl>
        <div class="bookcard__end"><div class="total"><span>Total for ${plural(c.people, "traveller")}</span><b data-total>${money(c.total)}</b></div>
        <div class="bookcard__actions">
          <button class="btn btn--dark btn--block" type="button" data-reserve><span>Reserve this tour</span><span class="btn__arrow">${icon("arrow-right")}</span></button>
          ${t.dest ? `<a class="btn btn--glass btn--block" href="#/plan?from=${t.id}">${icon("wand-sparkles")}<span>Customise this trip</span></a>` : `<a class="btn btn--glass btn--block" href="${esc(TV.waLink(`Hi ${T.name}, could you tailor the "${t.name}" tour for me?`))}" target="_blank" rel="noopener">${icon("whatsapp", "i--brand")}<span>Ask for a tailored version</span></a>`}
        </div>
        <p class="bookcard__note">${icon("shield-check")}Free cancellation up to 45 days before</p></div>`;
    };
    box.addEventListener("click", (e) => {
      const dep = e.target.closest("[data-dep]"), step = e.target.closest("[data-step]"), extra = e.target.closest("[data-extra]");
      if (dep) { b.dep = +dep.dataset.dep; return paint(); }
      if (step && !step.disabled) { const [k, d] = step.dataset.step.split(":"); b[k] += +d; return paint(); }
      if (extra) { const id = extra.dataset.extra; if (b.extras.has(id)) b.extras.delete(id); else b.extras.add(id); return paint(); }
      if (e.target.closest("[data-reserve]")) {
        const c = calc(), d = deps[b.dep];
        TV.reserve({
          kind: "tour", label: "Small-group tour", title: t.name, img: t.img, link: `#/tours/${t.id}`, total: c.total,
          when: TV.fmtRange(d.start, d.end), sub: `${t.place}`,
          lines: [["Departure", `${TV.fmtDate(d.start)} · ${t.days} days`], ["Travellers", `${plural(b.adults, "adult")}${b.kids ? `, ${plural(b.kids, "child", "children")}` : ""}`], ...(c.extras.length ? [["Extras", c.extras.map((x) => x.name).join(", ")]] : [])],
        });
      }
    }, { signal });
    paint();
  }

  /* ------------------------------------------------------------ hotels */
  const HSORTS = [
    { value: "top", label: "Recommended", fn: (a, b) => b.rating * 100 + b.stars - (a.rating * 100 + a.stars) },
    { value: "price", label: "Price: low to high", fn: (a, b) => a.price - b.price },
    { value: "price-desc", label: "Price: high to low", fn: (a, b) => b.price - a.price },
    { value: "rating", label: "Guest rating", fn: (a, b) => b.rating - a.rating || b.reviews - a.reviews },
  ];
  const HOTEL_MAX = Math.ceil(Math.max(...T.hotels.map((h) => h.price)) / 50) * 50;
  const AMEN_FILTERS = ["pool", "spa", "beach", "breakfast", "view", "family"];

  const hotelResults = () => {
    const f = state.hotels;
    return T.hotels.filter((h) => (!f.dest || h.dest === f.dest) && (!f.stars || h.stars >= f.stars) && (!f.max || h.price <= f.max) && f.amen.every((a) => h.amen.includes(a))).sort(HSORTS.find((s) => s.value === f.sort).fn);
  };

  const hotelRow = (h, nights, rooms) => `<article class="card hrow">
    <span class="hrow__media"><img src="assets/img/${esc(h.img)}" alt="${esc(h.alt)}" width="1200" height="860" loading="lazy"></span>
    <div class="hrow__body">
      <div class="tcard__meta"><span>${hstars(h.stars)}&nbsp; ${icon("map-pin")}${esc(h.area)}</span>${rate(h)}</div>
      <h3><a href="#/hotels/${h.id}">${esc(h.name)}</a></h3>
      <p>${esc(h.blurb)}</p>
      <div class="tags">${amenTags(h, 4)}<span class="tag tag--good">${icon("check")}Free cancellation</span></div>
    </div>
    <div class="hrow__side"><div class="price"><small>per night</small><b>${money(h.price)}</b><small>${money(h.price * nights * rooms)} for ${plural(nights, "night")}${rooms > 1 ? ` · ${rooms} rooms` : ""}</small></div><span class="btn btn--dark btn--sm" aria-hidden="true">See rooms</span></div>
  </article>`;

  TV.routes.hotels = {
    nav: "hotels",
    title: (r) => (r.id && TV.hotel(r.id) ? TV.hotel(r.id).name : "Stays"),
    render(r) {
      if (r.id) return TV.hotel(r.id) ? hotelDetail(TV.hotel(r.id)) : notFound("That stay is no longer listed", "#/hotels", "Browse all stays");
      if (r.query.dest && TV.dest(r.query.dest)) state.hotels.dest = r.query.dest;
      return `<section class="page"><div class="wrap">
        <header class="page__head" data-load="0"><div><span class="eyebrow"><i></i>Stays</span><h1 class="h1">Rooms with a <em>reason.</em></h1></div><p class="lead">Villas, lodges and small hotels we have slept in ourselves. Free cancellation on almost all of them.</p></header>
        <div data-load="1">${finderHTML({ tab: "hotels", light: true })}</div>
        <div class="card filters" data-load="2" style="margin-top:12px">
          <div class="filters__row">
            <span class="filters__label">Class</span><div class="chips" data-stars role="group" aria-label="Star rating"></div>
            <label class="range" style="margin-left:auto"><span>Price per night<b data-max-label></b></span><input type="range" min="100" max="${HOTEL_MAX}" step="10" value="${state.hotels.max || HOTEL_MAX}" data-max aria-label="Maximum price per night"></label>
            <button class="select" type="button" data-sort aria-haspopup="dialog" aria-expanded="false"><small>Sort</small><span data-sort-label></span>${icon("chevron-down")}</button>
          </div>
          <div class="filters__row"><span class="filters__label">Must have</span><div class="chips" data-amen role="group" aria-label="Amenities"></div></div>
        </div>
        <div class="results__bar"><span><b data-count-label></b> <span data-context></span></span><button class="linkish" type="button" data-reset>Reset filters</button></div>
        <div class="hlist" data-results></div>
      </div></section>`;
    },
    mount(root, r, signal) {
      if (r.id) return mountHotelDetail(root, TV.hotel(r.id), signal);
      const f = state.hotels;
      let repaintFinder = () => {};
      const paint = (animate) => {
        const nights = TV.nightsBetween(f.from, f.to);
        $("[data-stars]", root).innerHTML = [[0, "Any"], [4, "4★ and up"], [5, "5★ only"]].map(([v, l]) => `<button class="chip${f.stars === v ? " is-active" : ""}" type="button" aria-pressed="${f.stars === v}" data-star="${v}">${l}</button>`).join("");
        $("[data-amen]", root).innerHTML = AMEN_FILTERS.map((a) => `<button class="chip${f.amen.includes(a) ? " is-active" : ""}" type="button" aria-pressed="${f.amen.includes(a)}" data-amen-id="${a}">${icon(T.amenities[a].icon)}${esc(T.amenities[a].name)}</button>`).join("");
        $("[data-max-label]", root).textContent = !f.max || f.max >= HOTEL_MAX ? "Any" : `up to ${money(f.max)}`;
        $("[data-sort-label]", root).textContent = HSORTS.find((s) => s.value === f.sort).label;
        const list = hotelResults();
        $("[data-count-label]", root).textContent = plural(list.length, "stay");
        $("[data-context]", root).textContent = `${f.dest ? `in ${TV.dest(f.dest).name} ` : ""}· ${TV.fmtRange(f.from, f.to)} · ${plural(nights, "night")}`;
        const html = list.length ? list.map((h) => hotelRow(h, nights, f.rooms)).join("") : `<div class="card empty"><span class="empty__ico">${icon("bed-double")}</span><h3>No stays match those filters</h3><p>Try another destination or loosen a filter — or ask us to find somewhere special.</p><a class="btn btn--dark" data-wa href="#" target="_blank" rel="noopener">${icon("whatsapp", "i--brand")}<span>Ask a travel designer</span></a></div>`;
        const box = $("[data-results]", root);
        const swap = () => { box.innerHTML = html; TV.hydrate(box); };
        TV.transition(swap, animate);
      };
      repaintFinder = mountFinder(root, { tab: "hotels", light: true, live: () => paint(true) }, signal);
      root.addEventListener("click", (e) => {
        const star = e.target.closest("[data-star]"), am = e.target.closest("[data-amen-id]"), s = e.target.closest("[data-sort]");
        if (star) { f.stars = +star.dataset.star; return paint(true); }
        if (am) { const id = am.dataset.amenId; f.amen = f.amen.includes(id) ? f.amen.filter((x) => x !== id) : [...f.amen, id]; return paint(true); }
        if (e.target.closest("[data-reset]")) { Object.assign(f, { dest: "", stars: 0, amen: [], max: 0, sort: "top" }); $("[data-max]", root).value = HOTEL_MAX; repaintFinder(); return paint(true); }
        if (s) TV.pickList(s, { title: "Sort by", options: HSORTS.map((x) => ({ value: x.value, label: x.label })), value: f.sort, onPick: (v) => { f.sort = v; paint(true); } });
      }, { signal });
      $("[data-max]", root).addEventListener("input", (e) => { const v = +e.target.value; f.max = v >= HOTEL_MAX ? 0 : v; paint(false); }, { signal });
      paint(false);
    },
  };

  function hotelDetail(h) {
    const d = TV.dest(h.dest);
    const others = T.hotels.filter((x) => x.id !== h.id && x.dest === h.dest).concat(T.hotels.filter((x) => x.id !== h.id && x.dest !== h.dest && x.stars === h.stars)).slice(0, 4);
    return `<section class="page"><div class="wrap">
      <a class="back" href="#/hotels">${icon("chevron-left")}All stays</a>
      <div class="card card--photo dhero" data-load="0">
        <img src="assets/img/${esc(h.img)}" alt="${esc(h.alt)}" width="1200" height="860" fetchpriority="high">
        <div class="dhero__top"><span class="pill pill--glass">${icon("map-pin")}${esc(h.area)}</span></div>
        <div class="dhero__body"><h1 class="h1">${esc(h.name)}</h1>
          <div class="dhero__facts"><span class="pill pill--glass">${hstars(h.stars)}</span><span class="pill pill--glass">${icon("star", "i--fill")}${h.rating.toFixed(1)} (${h.reviews} reviews)</span><span class="pill pill--glass">${icon("sun")}Best ${esc(d.best)}</span></div>
        </div>
      </div>
      <div class="detail__grid">
        <div class="detail__main">
          <article class="card block reveal"><h2>Why we like it</h2><p>${esc(h.blurb)} Rates include taxes and can be cancelled free of charge until 48 hours before check-in.</p>
            <ul class="amen">${h.amen.map((a) => `<li>${icon(T.amenities[a].icon)}${esc(T.amenities[a].name)}</li>`).join("")}</ul></article>
          <article class="card block reveal"><h2>Choose your room</h2><div class="rooms" data-rooms></div></article>
        </div>
        <aside class="card bookcard" data-book></aside>
      </div>
      ${others.length ? `<div class="section section--tight">${head("More stays", "Others you might <em>like.</em>", more("#/hotels", "All stays"))}<div class="hgrid">${others.map((x) => hotelCard(x)).join("")}</div></div>` : ""}
    </div></section>`;
  }

  function mountHotelDetail(root, h, signal) {
    if (!h) return;
    const f = state.hotels;
    const box = $("[data-book]", root), roomsBox = $("[data-rooms]", root);
    let room = T.rooms[0].id;
    const calc = () => {
      const rm = T.rooms.find((x) => x.id === room);
      const nights = TV.nightsBetween(f.from, f.to);
      const nightly = Math.round(h.price * rm.mult);
      const stay = nightly * nights * f.rooms;
      const tax = Math.round(stay * 0.12);
      return { rm, nights, nightly, stay, tax, total: stay + tax };
    };
    const paint = () => {
      const c = calc();
      roomsBox.innerHTML = T.rooms.map((r) => `<button class="room${r.id === room ? " is-active" : ""}" type="button" role="radio" aria-checked="${r.id === room}" data-room="${r.id}"><img src="assets/img/${esc(r.img)}" alt="" loading="lazy"><span><b>${esc(r.name)}</b><span class="facts"><span>${icon("users")}Sleeps ${r.sleeps}</span><span>${icon("maximize")}${esc(r.size)}</span><span>${icon("bed-double")}${esc(r.bed)}</span></span><span class="tags">${r.perks.map((p) => `<span class="tag tag--good">${icon("check")}${esc(p)}</span>`).join("")}</span></span><span class="room__price price"><b>${money(h.price * r.mult)}</b><small>per night</small></span></button>`).join("");
      box.innerHTML = `
        <div class="bookcard__price"><div class="price"><small>${esc(c.rm.name)}</small><b>${money(c.nightly)}</b> <span>per night</span></div>${rate(h)}</div>
        <div><h3>Your stay</h3><div class="opts">
          <button class="opt" type="button" data-dates aria-haspopup="dialog" aria-expanded="false"><b>${TV.fmtRange(f.from, f.to)}</b><small>${plural(c.nights, "night")}</small></button>
          <button class="opt" type="button" data-guests aria-haspopup="dialog" aria-expanded="false"><b>${guestLabel(f)}</b><small>Change</small></button>
        </div></div>
        <dl class="breakdown">
          <div><dt>${money(c.nightly)} × ${plural(c.nights, "night")}${f.rooms > 1 ? ` × ${f.rooms} rooms` : ""}</dt><dd>${money(c.stay)}</dd></div>
          <div><dt>Taxes and fees</dt><dd>${money(c.tax)}</dd></div>
        </dl>
        <div class="bookcard__end"><div class="total"><span>Total</span><b>${money(c.total)}</b></div>
        <div class="bookcard__actions">
          <button class="btn btn--dark btn--block" type="button" data-reserve><span>Reserve this room</span><span class="btn__arrow">${icon("arrow-right")}</span></button>
          <a class="btn btn--glass btn--block" href="${esc(TV.waLink(`Hi ${T.name}, I have a question about ${h.name}.`))}" target="_blank" rel="noopener">${icon("whatsapp", "i--brand")}<span>Ask about this stay</span></a>
        </div>
        <p class="bookcard__note">${icon("shield-check")}Free cancellation · pay at the property</p></div>`;
    };
    root.addEventListener("click", (e) => {
      const r = e.target.closest("[data-room]"), dates = e.target.closest("[data-dates]"), guests = e.target.closest("[data-guests]");
      if (r) { room = r.dataset.room; return paint(); }
      if (dates) return TV.pickDates(dates, { start: f.from, end: f.to, labels: ["Check-in", "Check-out"], onPick: (a, b) => { f.from = a; f.to = b; paint(); } });
      if (guests) return TV.pickGuests(guests, { adults: f.adults, kids: f.kids, rooms: f.rooms, onChange: (v) => { Object.assign(f, v); paint(); } });
      if (e.target.closest("[data-reserve]")) {
        const c = calc();
        TV.reserve({
          kind: "hotel", label: "Stay", title: h.name, img: h.img, link: `#/hotels/${h.id}`, total: c.total, when: TV.fmtRange(f.from, f.to), sub: h.area,
          lines: [["Room", `${c.rm.name}${f.rooms > 1 ? ` × ${f.rooms}` : ""}`], ["Dates", `${TV.fmtDate(f.from)} → ${TV.fmtDate(f.to)} · ${plural(c.nights, "night")}`], ["Guests", `${plural(f.adults, "adult")}${f.kids ? `, ${plural(f.kids, "child", "children")}` : ""}`]],
        });
      }
    }, { signal });
    paint();
  }

  /* -------------------------------------------------------------- cars */
  const carResults = () => {
    const f = state.cars;
    return T.cars.filter((c) => (!f.type || c.type === f.type) && (!f.auto || c.gear === "Automatic") && (!f.seats || c.seats >= f.seats)).sort((a, b) => (f.sort === "price-desc" ? b.price - a.price : a.price - b.price));
  };

  function openCar(id) {
    const c = TV.car(id);
    if (!c) return;
    const f = state.cars;
    const picked = new Set();
    const body = () => {
      const days = TV.nightsBetween(f.from, f.to);
      const extras = T.carExtras.filter((x) => picked.has(x.id));
      const perDay = c.price + extras.reduce((s, x) => s + x.price, 0);
      const total = perDay * days;
      return { days, extras, total, html: `<div class="rsv">
        <div class="rsv__head"><img src="assets/img/${esc(c.img)}" alt=""><span><small>${esc(c.cls)}</small><b>${esc(c.name)} <span style="font-weight:400;color:var(--ink-3);font-size:14px">or similar</span></b></span></div>
        ${specs(c)}
        <div class="opts" style="margin:14px 0">
          <button class="opt" type="button" data-pickup aria-haspopup="dialog" aria-expanded="false"><b>${esc(f.pickup)}</b><small>Pick-up &amp; return</small></button>
          <button class="opt" type="button" data-dates aria-haspopup="dialog" aria-expanded="false"><b>${TV.fmtRange(f.from, f.to)}</b><small>${plural(days, "day")}</small></button>
        </div>
        <div class="checks">${T.carExtras.map((x) => `<button class="check" type="button" role="checkbox" aria-checked="${picked.has(x.id)}" data-extra="${x.id}"><span class="check__ico">${icon(x.icon)}</span><span><b>${esc(x.name)}</b><small>${esc(x.note)}</small></span><em>+${money(x.price)}/day</em><span class="check__box">${icon("check")}</span></button>`).join("")}</div>
        <div class="total"><span>${money(perDay)} × ${plural(days, "day")}<small style="text-align:left">Unlimited mileage · free cancellation</small></span><b>${money(total)}</b></div>
        <button class="btn btn--dark btn--block" type="button" data-reserve><span>Continue</span><span class="btn__arrow">${icon("arrow-right")}</span></button>
      </div>` };
    };
    TV.openSheet(body().html, (el, signal) => {
      const paint = () => (el.innerHTML = body().html);
      el.addEventListener("click", (e) => {
        const ex = e.target.closest("[data-extra]"), pk = e.target.closest("[data-pickup]"), dt = e.target.closest("[data-dates]");
        if (ex) { const k = ex.dataset.extra; if (picked.has(k)) picked.delete(k); else picked.add(k); return paint(); }
        if (pk) return TV.pickList(pk, { title: "Pick-up location", options: T.pickups.map((p) => ({ value: p, label: p, icon: "map-pin" })), value: f.pickup, onPick: (v) => { f.pickup = v; paint(); } });
        if (dt) return TV.pickDates(dt, { start: f.from, end: f.to, labels: ["Pick-up", "Return"], onPick: (a, b) => { f.from = a; f.to = b; paint(); } });
        if (e.target.closest("[data-reserve]")) {
          const r = body();
          TV.reserve({
            kind: "car", label: "Car hire", title: `${c.name} or similar`, img: c.img, link: "#/cars", total: r.total, when: TV.fmtRange(f.from, f.to), sub: f.pickup,
            lines: [["Pick-up", f.pickup], ["Dates", `${TV.fmtDate(f.from)} → ${TV.fmtDate(f.to)} · ${plural(r.days, "day")}`], ...(r.extras.length ? [["Extras", r.extras.map((x) => x.name).join(", ")]] : [])],
          });
        }
      }, { signal });
    });
  }

  TV.routes.cars = {
    nav: "cars",
    title: () => "Car hire",
    render() {
      return `<section class="page"><div class="wrap">
        <header class="page__head" data-load="0"><div><span class="eyebrow"><i></i>Car hire</span><h1 class="h1">Keys, please. <em>Any road.</em></h1></div><p class="lead">Clear prices with unlimited mileage and free cancellation. Add a chauffeur if you would rather watch the view.</p></header>
        <div data-load="1">${finderHTML({ tab: "cars", light: true })}</div>
        <div class="card filters" data-load="2" style="margin-top:12px">
          <div class="filters__row"><div class="chips" data-types role="group" aria-label="Car type"></div></div>
          <div class="filters__row"><span class="filters__label">Must have</span><div class="chips" data-needs role="group" aria-label="Requirements"></div>
            <button class="select" type="button" data-sort style="margin-left:auto" aria-haspopup="dialog" aria-expanded="false"><small>Sort</small><span data-sort-label></span>${icon("chevron-down")}</button></div>
        </div>
        <div class="results__bar"><span><b data-count-label></b> <span data-context></span></span><button class="linkish" type="button" data-reset>Reset filters</button></div>
        <div class="cgrid" data-results></div>
      </div></section>`;
    },
    mount(root, r, signal) {
      const f = state.cars;
      let repaintFinder = () => {};
      const chip = (attr, value, label, on, ic) => `<button class="chip${on ? " is-active" : ""}" type="button" aria-pressed="${on}" data-${attr}="${value}">${ic ? icon(ic) : ""}${label}</button>`;
      const paint = (animate) => {
        const days = TV.nightsBetween(f.from, f.to);
        $("[data-types]", root).innerHTML = chip("type", "", "All cars", !f.type) + T.carTypes.map((t) => chip("type", t.id, t.name, f.type === t.id)).join("");
        $("[data-needs]", root).innerHTML = chip("auto", "1", "Automatic", f.auto, "settings-2") + chip("seats", "5", "5+ seats", f.seats === 5, "users") + chip("seats", "7", "7 seats", f.seats === 7, "users");
        $("[data-sort-label]", root).textContent = f.sort === "price-desc" ? "Price: high to low" : "Price: low to high";
        const list = carResults();
        $("[data-count-label]", root).textContent = plural(list.length, "car");
        $("[data-context]", root).textContent = `· ${f.pickup} · ${TV.fmtRange(f.from, f.to)} · ${plural(days, "day")}`;
        const html = list.length ? list.map((c) => carCard(c, days, "")).join("") : `<div class="card empty" style="grid-column:1/-1"><span class="empty__ico">${icon("car")}</span><h3>No cars match those filters</h3><p>Loosen a filter or tell us what you need — we can usually source it.</p><button class="btn btn--dark" type="button" data-reset><span>Reset filters</span></button></div>`;
        const box = $("[data-results]", root);
        const swap = () => (box.innerHTML = html);
        TV.transition(swap, animate);
      };
      repaintFinder = mountFinder(root, { tab: "cars", light: true, live: () => paint(true) }, signal);
      root.addEventListener("click", (e) => {
        const type = e.target.closest("[data-type]"), au = e.target.closest("[data-auto]"), se = e.target.closest("[data-seats]"), s = e.target.closest("[data-sort]"), pick = e.target.closest("[data-car]");
        if (pick) return openCar(pick.dataset.car);
        if (type) { f.type = type.dataset.type; repaintFinder(); return paint(true); }
        if (au) { f.auto = !f.auto; return paint(true); }
        if (se) { const v = +se.dataset.seats; f.seats = f.seats === v ? 0 : v; return paint(true); }
        if (e.target.closest("[data-reset]")) { Object.assign(f, { type: "", auto: false, seats: 0, sort: "price" }); repaintFinder(); return paint(true); }
        if (s) TV.pickList(s, { title: "Sort by", options: [{ value: "price", label: "Price: low to high" }, { value: "price-desc", label: "Price: high to low" }], value: f.sort, onPick: (v) => { f.sort = v; paint(true); } });
      }, { signal });
      paint(false);
    },
  };

  Object.assign(TV, { tourCard, hotelCard, carCard, openCar, departuresFor, itinerary, head, more, notFound, mountAccordions });
})();
