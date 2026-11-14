/* ==========================================================================
   Tourism demo — travel assistant
   A rule-based demo chatbot: suggests tours, stays and cars from data.js,
   answers common questions and hands off to the trip builder or WhatsApp.
   No network calls. Swap `reply()` for an API call to make it a real assistant.
   ========================================================================== */
(() => {
  "use strict";

  const TV = window.TV;
  if (!TV) return;
  const { T, $, esc, icon, money, plural, store } = TV;

  const panel = $("#chat"), log = $("[data-chat-log]"), quick = $("[data-chat-quick]"), form = $("[data-chat-form]"), input = form.elements.q;
  const fab = $("[data-chat-toggle]"), badge = $("[data-chat-badge]"), nudge = $("[data-chat-nudge]");

  let session = 0, chain = Promise.resolve(), greeted = false, flow = null;

  /* ------------------------------------------------------------ output */
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const scroll = () => log.scrollTo({ top: log.scrollHeight, behavior: TV.reduced ? "auto" : "smooth" });

  function user(text) {
    const el = document.createElement("div");
    el.className = "msg msg--user";
    el.textContent = text;
    log.appendChild(el);
    quick.innerHTML = "";
    scroll();
  }
  /** Queue a bot message (HTML is built only from escaped data/user values). */
  function bot(html) {
    const mine = session;
    chain = chain.then(async () => {
      if (mine !== session) return;
      const tip = document.createElement("div");
      tip.className = "msg msg--bot msg--typing";
      tip.innerHTML = "<i></i><i></i><i></i>";
      log.appendChild(tip);
      scroll();
      await wait(TV.reduced ? 0 : Math.min(1000, 360 + html.replace(/<[^>]+>/g, "").length * 6));
      tip.remove();
      if (mine !== session) return;
      const el = document.createElement("div");
      el.className = "msg msg--bot";
      el.innerHTML = html;
      log.appendChild(el);
      scroll();
    });
  }
  function chips(list) {
    const mine = session;
    chain = chain.then(() => {
      if (mine !== session) return;
      quick.innerHTML = "";
      list.forEach((q, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "qr";
        b.textContent = q.label;
        b.style.animationDelay = i * 40 + "ms";
        b.addEventListener("click", () => { user(q.label); typeof q.go === "object" ? act(q.go) : reply(q.go || q.label); });
        quick.appendChild(b);
      });
      scroll();
    });
  }

  const mini = (href, img, title, sub, attr = "") => `<a class="mini" href="${esc(href)}" ${attr}><img src="assets/img/${esc(img)}" alt="" loading="lazy"><span><b>${esc(title)}</b><small>${esc(sub)}</small></span>${icon("arrow-up-right")}</a>`;
  const tourMini = (t) => mini(`#/tours/${t.id}`, t.img, t.name, `${t.days} days · from ${money(t.price)}`);
  const hotelMini = (h) => mini(`#/hotels/${h.id}`, h.img, h.name, `${h.area} · ${money(h.price)}/night`);
  const carMini = (c) => mini("#/cars", c.img, c.name, `${c.cls} · ${money(c.price)}/day`, `data-chat-car="${c.id}"`);
  const cards = (items) => `<div class="msg__cards">${items.join("")}</div>`;

  const MENU = () => [
    { label: "Find me a tour", go: { t: "tours" } },
    { label: "Find a place to stay", go: { t: "stays" } },
    { label: "Hire a car", go: { t: "cars" } },
    { label: "Build a custom trip", go: { t: "custom" } },
    { label: "My trips", go: { t: "trips" } },
    { label: "Talk to a human", go: { t: "human" } },
  ];

  /* ----------------------------------------------------------- answers */
  function greet() {
    greeted = true;
    const hr = new Date().getHours();
    bot(`${hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening"}! I'm <b>${esc(T.assistant)}</b>, the travel assistant at ${esc(T.name)}.`);
    bot("Tell me where you're dreaming of — or how you like to travel — and I'll suggest a few trips. I can also find stays, cars, or start a custom plan.");
    chips(MENU());
  }

  const answers = {
    menu() { bot("Here's what I can help with:"); chips(MENU()); },
    tours() {
      flow = { step: "region" };
      bot("Happy to. Which part of the world is calling?");
      chips([...T.regions.map((r) => ({ label: r, go: { t: "region", v: r } })), { label: "Surprise me", go: { t: "region", v: "" } }]);
    },
    region(v) {
      flow = { step: "style", region: v };
      bot(`${v ? `<b>${esc(v)}</b> — good choice.` : "Love it."} And what kind of trip?`);
      chips([...T.styles.map((s) => ({ label: s.name, go: { t: "style", v: s.id } })), { label: "Anything", go: { t: "style", v: "" } }]);
    },
    style(v) {
      const region = flow ? flow.region : "";
      flow = null;
      let list = T.tours.filter((t) => (!region || t.region === region) && (!v || t.styles.includes(v)));
      let note = "";
      if (!list.length) { list = T.tours.filter((t) => !v || t.styles.includes(v)); note = `Nothing with that mix in ${esc(region)} right now, but these are close: `; }
      list = list.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews).slice(0, 3);
      Object.assign(TV.state.tours, { region: region || "", style: v || "", q: "", length: "", max: 0, saved: false });
      bot(`${note || "These would suit you:"}${cards(list.map(tourMini))}`);
      chips([{ label: "See all matches", go: { t: "goto", hash: "#/tours" } }, { label: "Build my own instead", go: { t: "custom" } }, { label: "Start over", go: { t: "tours" } }]);
    },
    search(list, lead) {
      bot(`${lead}${cards(list.slice(0, 3).map(tourMini))}`);
      chips([{ label: "See all tours", go: { t: "goto", hash: "#/tours" } }, { label: "Build a custom trip", go: { t: "custom" } }]);
    },
    stays() {
      flow = { step: "stay" };
      bot("Where would you like to stay?");
      chips(T.destinations.slice(0, 8).map((d) => ({ label: d.name, go: { t: "stay", v: d.id } })));
    },
    stay(v) {
      flow = null;
      const d = TV.dest(v);
      const list = T.hotels.filter((h) => h.dest === v).sort((a, b) => b.rating - a.rating);
      if (!d || !list.length) return answers.stays();
      TV.state.hotels.dest = v;
      bot(`Our favourite ${list.length > 1 ? "places" : "place"} in <b>${esc(d.name)}</b> (best ${esc(d.best)}):${cards(list.slice(0, 3).map(hotelMini))}`);
      chips([{ label: `All stays in ${d.name}`, go: { t: "goto", hash: "#/hotels" } }, { label: "Another destination", go: { t: "stays" } }]);
    },
    cars() {
      flow = { step: "car" };
      bot("What sort of wheels?");
      chips(T.carTypes.map((c) => ({ label: c.name, go: { t: "car", v: c.id } })));
    },
    car(v) {
      flow = null;
      const list = T.cars.filter((c) => c.type === v).sort((a, b) => a.price - b.price);
      if (!list.length) return answers.cars();
      TV.state.cars.type = v;
      bot(`Here's what we have. Prices include unlimited mileage and free cancellation.${cards(list.slice(0, 3).map(carMini))}`);
      chips([{ label: "See the whole fleet", go: { t: "goto", hash: "#/cars" } }, { label: "Another type", go: { t: "cars" } }]);
    },
    custom() {
      flow = { step: "custom" };
      bot("My favourite. Pick a first stop and I'll open the trip builder with it ready — you can add up to two more there.");
      chips([...T.destinations.slice(0, 8).map((d) => ({ label: d.name, go: { t: "plan", v: d.id } })), { label: "I'll choose there", go: { t: "plan", v: "" } }]);
    },
    trips() {
      const n = store.trips.length;
      if (!n) { bot("You haven't lined anything up yet. Reserve a tour, stay or car — or save a custom plan — and it will appear in My trips."); return chips(MENU().slice(0, 4)); }
      bot(`You have <b>${plural(n, "item")}</b> lined up, worth about <b>${money(store.trips.reduce((s, t) => s + t.total, 0))}</b>.`);
      chips([{ label: "Open My trips", go: { t: "goto", hash: "#/trips" } }, { label: "Send them to a designer", go: { t: "human" } }]);
    },
    human() {
      bot(`Of course. A travel designer usually replies within a few minutes.<div class="msg__actions"><a class="btn btn--wa" href="${esc(TV.waLink())}" target="_blank" rel="noopener">${icon("whatsapp", "i--brand")}<span>Chat on WhatsApp</span></a><a class="btn btn--glass" href="tel:${esc(T.phone.replace(/[^\d+]/g, ""))}">${icon("phone")}<span>Call ${esc(T.phone)}</span></a></div>`);
      chips([{ label: "Back to menu", go: { t: "menu" } }]);
    },
    faq(i) {
      bot(esc(T.faqs[i].a));
      chips([{ label: "Find me a tour", go: { t: "tours" } }, { label: "Talk to a human", go: { t: "human" } }]);
    },
    season(d) {
      bot(`The best time for <b>${esc(d.name)}</b> is <b>${esc(d.best)}</b>. Outside those months it is quieter and cheaper, but some experiences may not run.`);
      chips([{ label: `Stays in ${d.name}`, go: { t: "stay", v: d.id } }, { label: `Plan a trip to ${d.name}`, go: { t: "plan", v: d.id } }]);
    },
    thanks() { bot("Any time! Anything else I can look up?"); chips(MENU().slice(0, 4)); },
    fallback() { bot("I didn't quite catch that — I'm a simple demo assistant. Here's what I can do:"); chips(MENU()); },
  };

  /* ------------------------------------------------------ understanding */
  const RE = {
    stop: /^(cancel|stop|never ?mind|start over|restart|reset|menu|back)\b/,
    human: /\b(human|real person|agent|designer|someone|call|phone|whatsapp|talk to|speak)\b/,
    trips: /\b(my trips?|my bookings?|my reservations?|saved|wishlist|cart)\b/,
    custom: /\b(custom|customi[sz]e|build|own trip|tailor|bespoke|plan (a|my)|planner|itinerary)\b/,
    cars: /\b(car|cars|rent|rental|hire|drive|suv|jeep|van|camper|chauffeur)\b/,
    stays: /\b(hotel|hotels|stay|stays|room|rooms|villa|resort|lodge|accommodation|sleep)\b/,
    tours: /\b(tour|tours|trip|trips|package|packages|holiday|vacation|journey|go somewhere|recommend|suggest|where should)\b/,
    season: /\b(best time|when to (go|visit)|season|weather|which month)\b/,
    hello: /^(hi|hello|hey|hiya|good (morning|afternoon|evening)|hola|namaste)\b/,
    thanks: /\b(thanks|thank you|thx|cheers|perfect|great|awesome)\b/,
  };
  const FAQ_RE = [/\b(includ|what do i get|covered)\b/, /\b(change|modify|shorten|extend|upgrade)\b/, /\b(pay|payment|deposit|instal|card)\b/, /\b(cancel|refund)\b/, /\b(visa|insurance|passport)\b/, /\b(group size|how many people|how big|solo|alone)\b/, /\b(support|emergency|help while|safe|safety)\b/];

  const destIn = (t) => T.destinations.find((d) => t.includes(d.name.toLowerCase()) || t.includes(d.country.toLowerCase()) || t.includes(d.id));
  const toursMatching = (t) => {
    const words = t.split(/[^a-zà-ÿ]+/).filter((w) => w.length > 3);
    return T.tours.filter((x) => { const hay = `${x.name} ${x.place} ${x.country}`.toLowerCase(); return words.some((w) => hay.includes(w)); });
  };

  function reply(raw) {
    const t = raw.toLowerCase().trim();
    if (!t) return;
    if (RE.stop.test(t)) { flow = null; return answers.menu(); }

    // budget: "under 2000", "below $1500"
    const budget = t.match(/\b(?:under|below|less than|max|up to|budget(?: of)?)\s*[^\d]{0,3}(\d[\d,]{2,})/);
    if (budget) {
      const max = +budget[1].replace(/,/g, "");
      const list = T.tours.filter((x) => x.price <= max).sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
      if (list.length) { Object.assign(TV.state.tours, { region: "", style: "", q: "", length: "", saved: false, max }); return answers.search(list, `${plural(list.length, "tour")} under ${money(max)} per person. The favourites:`); }
      return (bot(`Nothing under ${money(max)} as a set tour, but the trip builder can get close.`), chips([{ label: "Build a custom trip", go: { t: "custom" } }, { label: "See all tours", go: { t: "goto", hash: "#/tours" } }]));
    }

    const d = destIn(t);
    if (RE.season.test(t) && d) return answers.season(d);
    const faq = FAQ_RE.findIndex((re) => re.test(t));
    if (faq >= 0 && !RE.tours.test(t)) return answers.faq(faq);
    if (RE.human.test(t)) return answers.human();
    if (RE.trips.test(t)) return answers.trips();
    if (RE.custom.test(t)) return d ? act({ t: "plan", v: d.id }) : answers.custom();
    if (RE.cars.test(t)) { const type = T.carTypes.find((c) => t.includes(c.name.toLowerCase()) || t.includes(c.id)); return type ? answers.car(type.id) : answers.cars(); }
    if (RE.stays.test(t)) return d ? answers.stay(d.id) : answers.stays();

    const style = T.styles.find((s) => t.includes(s.name.toLowerCase().split(" ")[0]) || t.includes(s.id));
    const region = T.regions.find((r) => t.includes(r.toLowerCase().split(" ")[0]));
    const hits = toursMatching(t);
    if (hits.length) return answers.search(hits.sort((a, b) => b.reviews - a.reviews), hits.length === 1 ? "This one is made for you:" : "Here's what we run there:");
    if (style || region) { flow = { region: region || "" }; return style ? answers.style(style.id) : answers.region(region); }
    if (RE.tours.test(t)) return answers.tours();
    if (RE.hello.test(t)) return answers.menu();
    if (RE.thanks.test(t)) return answers.thanks();
    return answers.fallback();
  }

  function act(p) {
    switch (p.t) {
      case "region": return answers.region(p.v);
      case "style": return answers.style(p.v);
      case "stay": return answers.stay(p.v);
      case "car": return answers.car(p.v);
      case "plan":
        flow = null;
        TV.planner.startFrom(p.v ? [p.v] : []);
        bot(p.v ? `Opening the trip builder with <b>${esc(TV.dest(p.v).name)}</b> ready to go.` : "Opening the trip builder for you.");
        if (TV.isPhone()) setOpen(false);
        return TV.go("#/plan");
      case "goto":
        bot("Taking you there now.");
        if (TV.isPhone()) setOpen(false);
        return TV.go(p.hash);
      default: return (answers[p.t] || answers.fallback)();
    }
  }

  /* ------------------------------------------------------- open / close */
  function setOpen(open) {
    if (open === !panel.hidden && !panel.classList.contains("is-closing")) return;
    fab.setAttribute("aria-expanded", open);
    fab.setAttribute("aria-label", open ? "Close travel assistant" : "Open travel assistant");
    document.body.classList.toggle("chat-open", open);
    if (open) {
      panel.classList.remove("is-closing");
      panel.hidden = false;
      badge.classList.add("is-off");
      nudge.hidden = true;
      if (!greeted) greet();
      if (!TV.isPhone()) setTimeout(() => input.focus({ preventScroll: true }), 380);
    } else {
      panel.classList.add("is-closing");
      setTimeout(() => { panel.hidden = true; panel.classList.remove("is-closing"); }, TV.reduced ? 0 : 230);
    }
  }

  fab.addEventListener("click", () => setOpen(panel.hidden));
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-chat-open]")) return setOpen(true);
    if (e.target.closest("[data-chat-close]")) { setOpen(false); return fab.focus({ preventScroll: true }); }
    const carLink = e.target.closest("[data-chat-car]");
    if (carLink) { e.preventDefault(); if (TV.isPhone()) setOpen(false); return TV.openCar(carLink.dataset.chatCar); }
    if (e.target.closest(".chat .mini") && TV.isPhone()) setOpen(false);
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden && $("[data-sheet]").hidden && $("[data-pop]").hidden) { setOpen(false); fab.focus({ preventScroll: true }); } });

  $("[data-chat-reset]").addEventListener("click", () => { session++; chain = Promise.resolve(); flow = null; log.innerHTML = ""; quick.innerHTML = ""; greet(); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    user(text);
    reply(text);
  });

  /* -------------------------------------------------------------- nudge */
  const seen = () => { try { return sessionStorage.getItem("travel-nudge") === "1"; } catch (e) { return false; } };
  const markSeen = () => { try { sessionStorage.setItem("travel-nudge", "1"); } catch (e) { /* storage unavailable */ } };
  // only offer help on browsing pages, never over a booking card or the builder
  const busy = () => /^#\/(plan|trips)/.test(location.hash) || /^#\/(tours|hotels)\/.+/.test(location.hash) || !$("[data-sheet]").hidden;
  const offer = (tries) => {
    if (!panel.hidden || greeted || seen()) return;
    if (busy()) { if (tries > 0) setTimeout(() => offer(tries - 1), 8000); return; }
    nudge.hidden = false;
    markSeen();
    setTimeout(() => (nudge.hidden = true), 10000);
  };
  if (!seen()) setTimeout(() => offer(3), 10000);
  $("[data-nudge-close]").addEventListener("click", () => { nudge.hidden = true; markSeen(); });
  addEventListener("hashchange", () => (nudge.hidden = true));
})();
