/* ==========================================================================
   Tourism demo — trip builder and "My trips"
   The builder keeps one draft plan (saved as you go) and prices it live.
   Saved plans, tours, stays and cars all live in TV.store.trips.
   ========================================================================== */
(() => {
  "use strict";

  const TV = window.TV;
  const { T, $, $$, esc, icon, money, plural, store } = TV;

  const STEPS = ["Where & when", "Style & pace", "Stays & transport", "Experiences", "Review"];
  const MAX_DESTS = 3;

  const blank = () => ({ id: null, name: "", dests: [], start: TV.plusDays(35), days: 8, adults: 2, kids: 0, styles: [], pace: "balanced", tier: "premium", transport: "driver", car: "cr-v", acts: [], step: 1 });
  /* accept only known ids from storage so a stale draft can never break the page */
  const clean = (p) => {
    const b = blank();
    const out = { ...b, ...p };
    out.dests = (Array.isArray(p.dests) ? p.dests : []).filter((d) => TV.dest(d)).slice(0, MAX_DESTS);
    out.days = Math.min(21, Math.max(3, +out.days || b.days));
    out.adults = Math.min(10, Math.max(1, +out.adults || 2));
    out.kids = Math.min(6, Math.max(0, +out.kids || 0));
    out.styles = (Array.isArray(p.styles) ? p.styles : []).filter((s) => TV.style(s));
    if (!T.paces.some((x) => x.id === out.pace)) out.pace = b.pace;
    if (!T.tiers.some((x) => x.id === out.tier)) out.tier = b.tier;
    if (!T.transports.some((x) => x.id === out.transport)) out.transport = b.transport;
    if (!TV.car(out.car)) out.car = b.car;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(out.start) || out.start < TV.today()) out.start = b.start;
    out.acts = (Array.isArray(p.acts) ? p.acts : []).filter((a) => a && out.dests.includes(a.dest) && actOf(a));
    out.step = Math.min(STEPS.length, Math.max(1, +out.step || 1));
    out.name = String(out.name || "").slice(0, 60);
    return out;
  };
  const actOf = (a) => { const d = TV.dest(a.dest); return d ? d.acts.find((x) => x.id === a.id) : null; };

  let P = blank();

  /* ------------------------------------------------------------ derived */
  /** Split the nights across the chosen destinations, in order. */
  function legs(p = P) {
    const nights = p.days - 1, k = p.dests.length;
    let day = 1;
    return p.dests.map((id, i) => {
      const n = Math.floor(nights / k) + (i < nights % k ? 1 : 0);
      const leg = { dest: id, nights: n, from: day, to: i === k - 1 ? p.days : day + n - 1 };
      day += n;
      return leg;
    });
  }
  const legFor = (destId, p = P) => legs(p).find((l) => l.dest === destId);
  const perDay = (p = P) => T.paces.find((x) => x.id === p.pace).per;

  /**
   * Give every chosen experience a day inside its destination's dates.
   * Each one goes to the emptiest day (fewest hours) that is still under the pace limit,
   * so a trip only doubles up once every day has something.
   */
  function reflow(keepDays) {
    const count = {}, hours = {};
    const book = (a) => { count[a.day] = (count[a.day] || 0) + 1; hours[a.day] = (hours[a.day] || 0) + actOf(a).hrs; };
    legs().forEach((leg) => {
      const mine = P.acts.filter((a) => a.dest === leg.dest);
      const first = leg.from === 1 && leg.to > leg.from ? leg.from + 1 : leg.from; // keep the arrival day light
      const last = leg.to === P.days && leg.to > first ? leg.to - 1 : leg.to; // and the departure day free
      const fixed = mine.filter((a) => keepDays && a.day >= leg.from && a.day <= leg.to);
      fixed.forEach(book);
      mine.filter((a) => !fixed.includes(a)).forEach((a) => {
        const days = [];
        for (let d = first; d <= last; d++) days.push(d);
        const open = days.filter((d) => (count[d] || 0) < perDay());
        a.day = (open.length ? open : days).reduce((best, d) => ((hours[d] || 0) < (hours[best] || 0) ? d : best));
        book(a);
      });
    });
  }

  function quote(p = P) {
    const people = p.adults + p.kids;
    const rooms = Math.max(1, Math.ceil(p.adults / 2));
    const stays = legs(p).reduce((s, l) => s + l.nights * TV.dest(l.dest).nightly[p.tier] * rooms, 0);
    const tr = T.transports.find((x) => x.id === p.transport);
    const transport = (p.transport === "self" ? TV.car(p.car).price : tr.perDay) * (p.dests.length ? p.days : 0);
    const exp = p.acts.reduce((s, a) => s + actOf(a).price, 0) * (p.adults + p.kids * 0.6);
    const sub = stays + transport + exp;
    const fee = Math.round(sub * 0.06);
    return { people, rooms, stays, transport, exp, fee, total: sub + fee, pp: people ? (sub + fee) / people : 0 };
  }

  const autoName = (p = P) => (p.dests.length ? `${p.dests.map((d) => TV.dest(d).name).join(" & ")} · ${p.days} days` : "Your custom trip");
  const endDate = (p = P) => TV.iso(TV.addDays(TV.fromIso(p.start), p.days - 1));
  const suggestedStay = (destId, tier) => {
    const list = T.hotels.filter((h) => h.dest === destId).sort((a, b) => a.price - b.price);
    return list.length ? (tier === "comfort" ? list[0] : list[list.length - 1]) : null;
  };
  const transportLabel = (p = P) => (p.transport === "self" ? `Self-drive · ${TV.car(p.car).name}` : T.transports.find((x) => x.id === p.transport).name);
  const persist = () => { store.draft = JSON.parse(JSON.stringify(P)); TV.save(); };

  function asTrip(p = P) {
    const q = quote(p);
    const id = p.id || TV.uid();
    return {
      id, kind: "plan", label: "Custom trip", title: p.name.trim() || autoName(p), img: TV.dest(p.dests[0]).img, link: `#/plan?edit=${id}`, total: q.total,
      when: TV.fmtRange(p.start, endDate(p)), sub: legs(p).map((l) => `${TV.dest(l.dest).name} (${plural(l.nights, "night")})`).join(" → "),
      lines: [
        ["Route", legs(p).map((l) => `${TV.dest(l.dest).name} ${l.nights}n`).join(" → ")],
        ["Dates", `${TV.fmtDate(p.start)} → ${TV.fmtDate(endDate(p))} · ${p.days} days`],
        ["Travellers", `${plural(p.adults, "adult")}${p.kids ? `, ${plural(p.kids, "child", "children")}` : ""}`],
        ["Stays", `${T.tiers.find((x) => x.id === p.tier).name} · ${plural(q.rooms, "room")}`],
        ["Getting around", transportLabel(p)],
        ["Experiences", p.acts.length ? p.acts.map((a) => actOf(a).name).join("; ") : "None yet"],
      ],
      data: JSON.parse(JSON.stringify({ ...p, id })),
    };
  }

  /* ---------------------------------------------------------- step views */
  const stepper = (key, value, min, max, label) => `<span class="stepper"><button type="button" data-step="${key}:-1" aria-label="Fewer ${label}"${value <= min ? " disabled" : ""}>${icon("minus")}</button><b>${value}</b><button type="button" data-step="${key}:1" aria-label="More ${label}"${value >= max ? " disabled" : ""}>${icon("plus")}</button></span>`;
  const tile = (attr, x, on, extra = "", ic = "") => `<button class="otile${on ? " is-on" : ""}" type="button" role="radio" aria-checked="${on}" data-${attr}="${x.id}">${ic ? icon(ic) : ""}<span><b>${esc(x.name)}</b><small>${esc(x.note)}</small></span>${extra ? `<em>${extra}</em>` : ""}</button>`;

  function dayPlanHTML(editable) {
    const ls = legs();
    const rows = [];
    for (let d = 1; d <= P.days; d++) {
      const leg = ls.find((l) => d >= l.from && d <= l.to);
      const date = TV.iso(TV.addDays(TV.fromIso(P.start), d - 1));
      const acts = P.acts.filter((a) => a.day === d);
      const note = d === 1 ? "Arrival" : d === P.days ? "Departure" : d === leg.from ? "Travel day" : "";
      rows.push(`<div class="dayrow"><div class="dayrow__n"><b>Day ${d}</b><small>${TV.fmtShort(date)}</small></div><div class="dayrow__body"><span class="dayrow__where">${esc(TV.dest(leg.dest).name)}${note ? ` · ${note}` : ""}</span>${
        acts.length
          ? acts.map((a) => `<div class="actchip"><span>${esc(actOf(a).name)}</span>${editable ? `<button type="button" data-move="${a.dest}:${a.id}:-1" aria-label="Move a day earlier"${d <= leg.from ? " disabled" : ""}>${icon("chevron-up")}</button><button type="button" data-move="${a.dest}:${a.id}:1" aria-label="Move a day later"${d >= leg.to ? " disabled" : ""}>${icon("chevron-down")}</button><button type="button" data-act="${a.dest}:${a.id}" aria-label="Remove">${icon("x")}</button>` : `<small style="color:var(--ink-3);padding-right:8px">${actOf(a).hrs}h</small>`}</div>`).join("")
          : `<span class="dayrow__free">${d === P.days ? "Breakfast, then onward travel" : d === 1 ? "Settle in — nothing planned" : "Free time"}</span>`
      }</div></div>`);
    }
    return `<div class="dayplan">${rows.join("")}</div>`;
  }

  const stepHTML = {
    1: () => `<h2>Where would you like to go?</h2><p class="pstep__sub">Choose up to three destinations. We'll split your nights between them and you can fine-tune everything later.</p>
      <h3>Destinations <small>${P.dests.length} of ${MAX_DESTS} chosen</small></h3>
      <div class="ocards">${T.destinations.map((d) => { const on = P.dests.includes(d.id); return `<button class="ocard${on ? " is-on" : ""}" type="button" role="checkbox" aria-checked="${on}" data-dest="${d.id}"><img src="assets/img/${esc(d.img)}" alt="" loading="lazy"><span><b>${esc(d.name)}</b><small>${esc(d.country)} · best ${esc(d.best)}</small></span><span class="ocard__tick">${icon("check")}</span></button>`; }).join("")}</div>
      <h3>When, and for how long?</h3>
      <div class="prow"><div><label>Start date</label><button class="select" type="button" data-start aria-haspopup="dialog" aria-expanded="false">${icon("calendar-days")}<span>${TV.fmtDate(P.start)}</span>${icon("chevron-down")}</button></div></div>
      <div class="dayslider" style="margin-top:14px"><input type="range" min="${Math.max(3, P.dests.length * 2 + 1)}" max="21" step="1" value="${P.days}" data-days aria-label="Trip length in days"><output data-days-out>${P.days} days</output></div>
      <h3>Who's travelling?</h3>
      <div class="prow"><div><label>Adults</label>${stepper("adults", P.adults, 1, 10, "adults")}</div><div><label>Children (2–12)</label>${stepper("kids", P.kids, 0, 6, "children")}</div></div>`,

    2: () => `<h2>How do you like to travel?</h2><p class="pstep__sub">This shapes what we suggest and how full each day feels.</p>
      <h3>What do you love? <small>choose any</small></h3>
      <div class="chips">${T.styles.map((s) => `<button class="chip${P.styles.includes(s.id) ? " is-active" : ""}" type="button" aria-pressed="${P.styles.includes(s.id)}" data-style="${s.id}">${icon(s.icon)}${esc(s.name)}</button>`).join("")}</div>
      <h3>Pace</h3>
      <div class="otiles" role="radiogroup" aria-label="Pace">${T.paces.map((x) => tile("pace", x, P.pace === x.id)).join("")}</div>
      <h3>Comfort level</h3>
      <div class="otiles" role="radiogroup" aria-label="Comfort level">${T.tiers.map((x) => tile("tier", x, P.tier === x.id, `from ${money(Math.min(...P.dests.map((d) => TV.dest(d).nightly[x.id])))}/night`)).join("")}</div>`,

    3: () => `<h2>Where you'll sleep, how you'll move</h2><p class="pstep__sub">Based on your ${esc(T.tiers.find((x) => x.id === P.tier).name.toLowerCase())} comfort level, these are the stays we would hold for you.</p>
      <h3>Stays</h3>
      <div class="dayplan">${legs().map((l) => { const d = TV.dest(l.dest), h = suggestedStay(l.dest, P.tier); return `<div class="dayrow" style="grid-template-columns:96px minmax(0,1fr)"><img src="assets/img/${esc(h ? h.img : d.img)}" alt="" loading="lazy" style="width:96px;height:76px;border-radius:14px;object-fit:cover"><div class="dayrow__body"><span class="dayrow__where">${esc(d.name)} · ${plural(l.nights, "night")} · day ${l.from}–${l.from + l.nights}</span><b style="font-weight:500;font-size:16.5px">${esc(h ? h.name : `${T.tiers.find((x) => x.id === P.tier).name} hotel`)} <span style="font-weight:400;color:var(--ink-3);font-size:13.5px">or similar</span></b><span class="dayrow__free">${money(d.nightly[P.tier])} per room per night</span></div></div>`; }).join("")}</div>
      <h3>Getting around</h3>
      <div class="otiles" role="radiogroup" aria-label="Transport">${T.transports.map((x) => tile("transport", x, P.transport === x.id, x.id === "self" ? `${money(TV.car(P.car).price)}/day` : `${money(x.perDay)}/day`, x.icon)).join("")}</div>
      ${P.transport === "self" ? `<div class="prow" style="margin-top:12px"><div><label>Your car</label><button class="select" type="button" data-carpick aria-haspopup="dialog" aria-expanded="false">${icon("car")}<span>${esc(TV.car(P.car).name)} · ${esc(TV.car(P.car).cls)}</span>${icon("chevron-down")}</button></div></div>` : ""}`,

    4: () => {
      const want = { Thrill: ["adventure", "mountains", "roadtrip"], Food: ["culture", "romance", "family"], Iconic: T.styles.map((s) => s.id) };
      const recommended = (a) => !!a.tag && P.styles.some((s) => (want[a.tag] || []).includes(s));
      return `<h2>Add the good stuff</h2><p class="pstep__sub">Tap to add an experience and we'll slot it into a sensible day. Prices are per adult.</p>
      ${legs().map((l) => { const d = TV.dest(l.dest); return `<h3>${esc(d.name)} <small>${plural(l.nights, "night")} · day ${l.from}–${l.to}</small></h3>
        <div class="acts">${[...d.acts].sort((a, b) => recommended(b) - recommended(a)).map((a) => { const on = P.acts.some((x) => x.dest === d.id && x.id === a.id); return `<button class="act${on ? " is-on" : ""}" type="button" role="checkbox" aria-checked="${on}" data-act="${d.id}:${a.id}"><span><b>${esc(a.name)}</b><small>${a.hrs} hours${a.tag ? ` · ${esc(a.tag)}` : ""}${recommended(a) ? " · suits your style" : ""}</small></span><em>${money(a.price)}</em><span class="act__add">${icon("plus")}</span></button>`; }).join("")}</div>`; }).join("")}
      <h3>Your days <small>use the arrows to move things around</small></h3>
      ${dayPlanHTML(true)}`;
    },

    5: () => `<h2>Looking good. Give it a name.</h2><p class="pstep__sub">Save it to come back later, or request a firm quote — a travel designer will check availability and reply within one working day.</p>
      <input class="review-name" type="text" maxlength="60" placeholder="${esc(autoName())}" value="${esc(P.name)}" data-name aria-label="Trip name">
      <h3>Your itinerary</h3>
      ${dayPlanHTML(false)}`,
  };

  /* -------------------------------------------------------------- render */
  TV.routes.plan = {
    nav: "plan",
    title: () => "Trip builder",
    render(r) {
      // entry points: edit a saved plan, start from a tour, or resume the draft
      const saved = r.query.edit && store.trips.find((t) => t.id === r.query.edit && t.kind === "plan");
      const from = r.query.from && TV.tour(r.query.from);
      if (saved) P = clean(saved.data);
      else if (from && from.dest) {
        P = clean({ dests: [from.dest], days: from.days, name: `${from.name} — my version` });
        P.acts = TV.dest(from.dest).acts.slice(0, 3).map((a) => ({ dest: from.dest, id: a.id, day: 0 }));
      } else if (r.query.new) P = blank();
      else if (store.draft) P = clean(store.draft);
      if (!saved && !from && !P.dests.length) P.step = 1;
      reflow(true);
      return `<section class="page"><div class="wrap">
        <header class="page__head" data-load="0"><div><span class="eyebrow"><i></i>Trip builder</span><h1 class="h1">A journey that is <em>entirely yours.</em></h1></div><p class="lead">Five short steps. The price updates as you go, and nothing is final until you say so.</p></header>
        <div class="wsteps" data-wsteps data-load="1"></div>
        <div class="plan" data-load="2">
          <div class="card pstep"><div data-step-body></div>
            <div class="plan__foot"><button class="btn btn--ghost" type="button" data-back>${icon("chevron-left")}<span>Back</span></button><span class="plan__hint" data-hint></span><span data-next-wrap></span></div>
          </div>
          <aside class="psum" data-sum aria-label="Trip summary"></aside>
        </div>
      </div></section>`;
    },
    mount(root, r, signal) {
      const body = $("[data-step-body]", root), sum = $("[data-sum]", root), hintEl = $("[data-hint]", root);
      const hint = (msg, warn) => { hintEl.textContent = msg; hintEl.classList.remove("is-warn"); if (warn) { void hintEl.offsetWidth; hintEl.classList.add("is-warn"); if (getComputedStyle(hintEl).display === "none") TV.toast(msg); } };

      const paintSum = () => {
        const q = quote();
        const has = P.dests.length > 0;
        const lines = [["Stays", q.stays, `${plural(q.rooms, "room")} · ${P.days - 1} nights`], ["Getting around", q.transport, transportLabel()], [`Experiences (${P.acts.length})`, q.exp, ""], ["Planning & support", q.fee, ""]];
        if (!sum.dataset.ready) {
          sum.dataset.ready = "1";
          sum.innerHTML = `<div class="psum__top"><small>Your trip</small><b data-s-title></b></div><div class="psum__route" data-s-route></div><div class="psum__meta" data-s-meta></div><dl class="psum__lines" data-s-lines></dl>
            <div class="psum__total"><div><span>Estimated total</span><b data-s-total data-v="0">${money(0)}</b></div><small data-s-pp></small></div>
            <div class="psum__bar"><i></i></div><p class="psum__note">Estimate only — your designer confirms the final price.</p>`;
        }
        $("[data-s-title]", sum).textContent = P.name.trim() || autoName();
        $("[data-s-route]", sum).innerHTML = has ? legs().map((l) => `<span>${esc(TV.dest(l.dest).name)}<small>${l.nights}n</small></span>`).join("") : `<span><small>No destinations yet</small></span>`;
        $("[data-s-meta]", sum).innerHTML = [["Dates", TV.fmtRange(P.start, endDate())], ["Travellers", `${P.adults + P.kids} · ${plural(q.rooms, "room")}`], ["Comfort", T.tiers.find((x) => x.id === P.tier).name], ["Pace", T.paces.find((x) => x.id === P.pace).name]].map(([k, v]) => `<div><small>${k}</small><b>${esc(v)}</b></div>`).join("");
        $("[data-s-lines]", sum).innerHTML = lines.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${has ? money(v) : "—"}</dd></div>`).join("");
        TV.tweenMoney($("[data-s-total]", sum), has ? q.total : 0);
        $("[data-s-pp]", sum).textContent = has ? `${money(q.pp)} per person` : "";
        $(".psum__bar", sum).style.setProperty("--p", (P.step / STEPS.length) * 100);
      };

      const paintSteps = () => {
        $("[data-wsteps]", root).innerHTML = STEPS.map((name, i) => { const n = i + 1; return `<button class="wstep${n === P.step ? " is-active" : n < P.step ? " is-done" : ""}" type="button" data-goto="${n}"${n === P.step ? ' aria-current="step"' : ""}><span>${n < P.step ? icon("check") : n}</span>${name}</button>`; }).join("");
        $("[data-back]", root).style.visibility = P.step === 1 ? "hidden" : "";
        $("[data-next-wrap]", root).innerHTML = P.step < STEPS.length
          ? `<button class="btn btn--dark" type="button" data-next><span>Continue</span><span class="btn__arrow">${icon("arrow-right")}</span></button>`
          : `<span style="display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end"><button class="btn btn--glass" type="button" data-save>${icon("bookmark")}<span>Save to my trips</span></button><button class="btn btn--dark" type="button" data-quote><span>Request a quote</span><span class="btn__arrow">${icon("arrow-right")}</span></button></span>`;
      };

      const paintBody = (animate) => {
        body.innerHTML = `<div class="${animate ? "pstep__in" : ""}">${stepHTML[P.step]()}</div>`;
      };
      const paint = (animate) => { paintSteps(); paintBody(animate); paintSum(); persist(); };

      const canLeave = (to) => {
        if (to <= 1) return true;
        if (!P.dests.length) { hint("Choose at least one destination first", true); return false; }
        return true;
      };
      const goStep = (n) => {
        if (n === P.step) return;
        if (n > P.step && !canLeave(n)) { if (P.step !== 1) { P.step = 1; paint(true); } return; }
        P.step = n;
        hint("");
        paint(true);
        const top = $(".wsteps", root).getBoundingClientRect().top + scrollY - 96;
        if (scrollY > top) scrollTo({ top, behavior: TV.reduced ? "auto" : "smooth" });
      };

      root.addEventListener("click", (e) => {
        const t = (sel) => e.target.closest(sel);
        const goto = t("[data-goto]"), d = t("[data-dest]"), step = t("[data-step]"), st = t("[data-style]"), pace = t("[data-pace]"), tier = t("[data-tier]"), tr = t("[data-transport]"), mv = t("[data-move]"), act = t("[data-act]");
        if (goto) return goStep(+goto.dataset.goto);
        if (t("[data-next]")) return goStep(P.step + 1);
        if (t("[data-back]")) return goStep(Math.max(1, P.step - 1));
        if (d) {
          const id = d.dataset.dest;
          if (P.dests.includes(id)) { P.dests = P.dests.filter((x) => x !== id); P.acts = P.acts.filter((a) => a.dest !== id); }
          else if (P.dests.length >= MAX_DESTS) return hint(`Up to ${MAX_DESTS} destinations — remove one to add another`, true);
          else { P.dests.push(id); P.days = Math.max(P.days, P.dests.length * 2 + 1); }
          reflow(false); hint("");
          return paint(false);
        }
        if (step && !step.disabled) { const [k, v] = step.dataset.step.split(":"); P[k] += +v; return paint(false); }
        if (t("[data-start]")) return TV.pickDates(t("[data-start]"), { start: P.start, range: false, min: TV.plusDays(3), onPick: (s) => { P.start = s; paint(false); } });
        if (st) { const id = st.dataset.style; P.styles = P.styles.includes(id) ? P.styles.filter((x) => x !== id) : [...P.styles, id]; return paint(false); }
        if (pace) { P.pace = pace.dataset.pace; reflow(false); return paint(false); }
        if (tier) { P.tier = tier.dataset.tier; return paint(false); }
        if (tr) { P.transport = tr.dataset.transport; return paint(false); }
        if (t("[data-carpick]")) return TV.pickList(t("[data-carpick]"), { title: "Choose a car", options: T.cars.map((c) => ({ value: c.id, label: c.name, sub: `${c.cls} · ${money(c.price)}/day`, img: c.img })), value: P.car, onPick: (v) => { P.car = v; paint(false); } });
        if (mv) {
          const [dest, id, dir] = mv.dataset.move.split(":");
          const a = P.acts.find((x) => x.dest === dest && x.id === id), leg = legFor(dest);
          if (a && leg) { a.day = Math.min(leg.to, Math.max(leg.from, a.day + +dir)); paint(false); }
          return;
        }
        if (act) {
          const [dest, id] = act.dataset.act.split(":");
          const at = P.acts.findIndex((x) => x.dest === dest && x.id === id);
          if (at >= 0) P.acts.splice(at, 1); else { P.acts.push({ dest, id, day: 0 }); reflow(true); }
          return paint(false);
        }
        if (t("[data-save]")) {
          const trip = { ...asTrip(), status: "Saved plan", ref: P.ref || TV.refCode(), created: Date.now() };
          P.id = trip.id; P.ref = trip.ref;
          const at = store.trips.findIndex((x) => x.id === trip.id);
          if (at >= 0) store.trips[at] = { ...store.trips[at], ...trip }; else store.trips.unshift(trip);
          persist();
          TV.toast("Saved to your trips");
          return TV.go("#/trips");
        }
        if (t("[data-quote]")) {
          const trip = asTrip();
          P.id = trip.id;
          return TV.reserve({ ...trip, ref: P.ref }, (savedTrip) => { savedTrip.status = "Quote requested"; P.ref = savedTrip.ref; persist(); });
        }
      }, { signal });

      root.addEventListener("input", (e) => {
        if (e.target.matches("[data-days]")) {
          P.days = +e.target.value;
          $("[data-days-out]", root).textContent = `${P.days} days`;
          reflow(true); paintSum(); persist();
        }
        if (e.target.matches("[data-name]")) { P.name = e.target.value; paintSum(); persist(); }
      }, { signal });

      paint(false);
    },
  };

  /* ---------------------------------------------------------------- trips */
  const KINDS = [["all", "All"], ["tour", "Tours"], ["hotel", "Stays"], ["car", "Cars"], ["plan", "Custom trips"], ["wish", "Wishlist"]];
  const KIND_ICON = { tour: "map", hotel: "bed-double", car: "car", plan: "wand-sparkles" };
  let tab = "all";

  const tripCard = (t) => `<article class="card tripcard" data-trip="${esc(t.id)}">
    <div class="tripcard__media"><img src="assets/img/${esc(t.img)}" alt="" loading="lazy"><span class="pill pill--glass tripcard__kind">${icon(KIND_ICON[t.kind] || "map")}${esc(t.label)}</span></div>
    <div class="tripcard__body"><h3>${esc(t.title)}</h3><p>${esc(t.sub || "")}</p>
      <div class="facts"><span>${icon("calendar-days")}${esc(t.when || "")}</span><span>${icon("ticket")}${esc(t.ref || "")}</span><span class="tag tag--good">${icon("check")}${esc(t.status || "Reserved")}</span></div></div>
    <div class="tripcard__side"><div class="price"><small>${t.kind === "plan" ? "estimate" : "total"}</small><b>${money(t.total)}</b></div>
      <div class="tripcard__actions">
        ${t.kind === "plan" ? `<a class="icon-btn" href="#/plan?edit=${esc(t.id)}" aria-label="Edit this trip" title="Edit">${icon("pencil")}</a><button class="icon-btn" type="button" data-dup aria-label="Duplicate this trip" title="Duplicate">${icon("copy")}</button>` : t.link ? `<a class="icon-btn" href="${esc(t.link)}" aria-label="Open" title="Open">${icon("arrow-up-right")}</a>` : ""}
        <a class="icon-btn" href="${esc(TV.waLink(TV.tripMessage(t)))}" target="_blank" rel="noopener" aria-label="Send on WhatsApp" title="Send on WhatsApp">${icon("whatsapp", "i--brand")}</a>
        <button class="icon-btn" type="button" data-remove aria-label="Remove" title="Remove">${icon("trash-2")}</button>
      </div></div>
  </article>`;

  TV.routes.trips = {
    nav: "trips",
    title: () => "My trips",
    render() {
      return `<section class="page"><div class="wrap">
        <header class="page__head" data-load="0"><div><span class="eyebrow"><i></i>My trips</span><h1 class="h1">Everything you've <em>lined up.</em></h1></div><p class="lead">Reservations, saved plans and your wishlist, kept in this browser. Edit a custom trip any time or send the lot to a travel designer.</p></header>
        <div data-load="1"><div class="trips__bar"><div class="tabs" role="tablist" data-tabs></div><a class="btn btn--dark btn--sm" href="#/plan?new=1">${icon("plus")}<span>New custom trip</span></a></div>
        <div data-list></div></div>
      </div></section>`;
    },
    mount(root, r, signal) {
      const list = $("[data-list]", root);
      const paint = () => {
        const count = (k) => (k === "all" ? store.trips.length : k === "wish" ? store.wish.length : store.trips.filter((t) => t.kind === k).length);
        $("[data-tabs]", root).innerHTML = KINDS.map(([k, name]) => `<button type="button" role="tab" aria-selected="${k === tab}" class="${k === tab ? "is-active" : ""}" data-tab="${k}">${name}<small>${count(k)}</small></button>`).join("");
        if (tab === "wish") {
          const saved = store.wish.map(TV.tour).filter(Boolean);
          list.innerHTML = saved.length ? `<div class="tgrid">${saved.map((t) => TV.tourCard(t, "")).join("")}</div>` : `<div class="card empty"><span class="empty__ico">${icon("heart")}</span><h3>Your wishlist is empty</h3><p>Tap the heart on any tour to keep it here for later.</p><a class="btn btn--dark" href="#/tours"><span>Browse tours</span><span class="btn__arrow">${icon("arrow-up-right")}</span></a></div>`;
          return;
        }
        const items = store.trips.filter((t) => tab === "all" || t.kind === tab);
        if (!items.length) {
          list.innerHTML = `<div class="card empty"><span class="empty__ico">${icon("luggage")}</span><h3>${store.trips.length ? "Nothing in this category yet" : "No trips yet — let's fix that"}</h3><p>Reserve a tour, a stay or a car, or build a custom trip. Everything you line up appears here.</p><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center"><a class="btn btn--dark" href="#/tours"><span>Browse tours</span><span class="btn__arrow">${icon("arrow-up-right")}</span></a><a class="btn btn--glass" href="#/plan?new=1">${icon("wand-sparkles")}<span>Build a trip</span></a></div></div>`;
          return;
        }
        const total = items.reduce((s, t) => s + t.total, 0);
        const all = [`Hi ${T.name}! Here's everything on my list:`, "", ...items.map((t) => `• ${t.label}: ${t.title} — ${t.when} — ${money(t.total)} (${t.ref})`), "", `Total: ${money(total)}`].join("\n");
        list.innerHTML = `<div class="trips">${items.map(tripCard).join("")}</div>
          <div class="tripsum"><div><small>${plural(items.length, "item")} · estimated total</small><b>${money(total)}</b></div>
            <div class="tripsum__actions"><a class="btn btn--wa" href="${esc(TV.waLink(all))}" target="_blank" rel="noopener">${icon("whatsapp", "i--brand")}<span>Send all to a designer</span></a><button class="btn btn--glass-dark" type="button" data-clear>Clear list</button></div></div>`;
      };
      root.addEventListener("click", (e) => {
        const tb = e.target.closest("[data-tab]"), card = e.target.closest("[data-trip]");
        if (tb) { tab = tb.dataset.tab; return paint(); }
        if (e.target.closest("[data-clear]")) {
          const ids = store.trips.filter((t) => tab === "all" || t.kind === tab).map((t) => t.id);
          store.trips = store.trips.filter((t) => !ids.includes(t.id));
          TV.save(); TV.toast("List cleared");
          return paint();
        }
        if (!card) return;
        const id = card.dataset.trip;
        if (e.target.closest("[data-remove]")) { TV.removeTrip(id); TV.toast("Removed from your trips"); return paint(); }
        if (e.target.closest("[data-dup]")) {
          const src = store.trips.find((t) => t.id === id);
          if (!src) return;
          const copy = JSON.parse(JSON.stringify(src));
          copy.id = TV.uid(); copy.ref = TV.refCode(); copy.title = `${src.title} (copy)`; copy.status = "Saved plan"; copy.created = Date.now();
          copy.link = `#/plan?edit=${copy.id}`;
          if (copy.data) { copy.data.id = copy.id; copy.data.name = copy.title; copy.data.ref = copy.ref; }
          store.trips.unshift(copy);
          TV.save(); TV.toast("Trip duplicated");
          return paint();
        }
      }, { signal });
      // the wishlist heart lives in core; refresh this page when it changes
      document.addEventListener("click", (e) => { if (e.target.closest("[data-wish]") && tab === "wish") setTimeout(paint, 0); }, { signal });
      paint();
    },
  };

  /* shared with the assistant */
  TV.planner = { startFrom(destIds) { P = clean({ dests: destIds }); P.step = 1; reflow(false); persist(); } };

  TV.start();
})();
