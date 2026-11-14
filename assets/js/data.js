/* ==========================================================================
   TOURISM DEMO — SITE DATA
   --------------------------------------------------------------------------
   Everything a travel company would change lives here: brand, contact,
   colour, tours, hotels, cars, activities, reviews and FAQs.

   QUICK RE-SKIN FOR A PITCH (no editing needed) — add URL parameters:
     index.html?name=Blue Horizon Travels&hue=205&wa=15550100177&currency=$
       name      company name shown everywhere
       hue       accent colour, 0–360 (22 = sunset coral, 205 = ocean blue,
                 165 = lagoon teal, 265 = violet, 345 = rose)
       wa        WhatsApp number, digits only, with country code
       phone     phone number as it should be displayed
       currency  currency symbol for all prices
   ========================================================================== */

window.TRAVEL = {
  /* ---- Identity -------------------------------------------------------- */
  name: "Terravia",
  tagline: "Tours, stays and journeys made yours",
  hue: 22,
  assistant: "Kai",

  /* ---- Contact (PLACEHOLDERS — replace before showing a real client) --- */
  phone: "+1 (555) 010-0177",
  whatsapp: "15550100177", // digits only, with country code, no "+"
  email: "hello@terravia.example",
  address: ["18 Harbour Lane", "Seaview, SV 40210"],
  currency: "$",

  stats: { travellers: 12400, rating: 4.9, countries: 21, years: 14 },

  /* ---- Filters ---------------------------------------------------------- */
  regions: ["Europe", "Asia", "Africa & Middle East", "Americas", "Oceania"],
  styles: [
    { id: "mountains", name: "Mountains", icon: "mountain-snow" },
    { id: "beach", name: "Beach & islands", icon: "tree-palm" },
    { id: "culture", name: "Culture", icon: "landmark" },
    { id: "adventure", name: "Adventure", icon: "compass" },
    { id: "wildlife", name: "Wildlife", icon: "binoculars" },
    { id: "romance", name: "Honeymoon", icon: "heart" },
    { id: "roadtrip", name: "Road trips", icon: "route" },
    { id: "family", name: "Family", icon: "users" },
  ],

  /* ---- Destinations ------------------------------------------------------
     Used by the trip builder, hotel search and the home page.
     nightly = typical room rate per night for each comfort tier.
     acts    = bookable experiences (price is per person). */
  destinations: [
    {
      id: "swiss", name: "Swiss Alps", country: "Switzerland", region: "Europe", img: "t-swiss.jpg", tagline: "Cogwheel trains and cowbell meadows", best: "Jun – Sep",
      nightly: { comfort: 180, premium: 320, luxury: 640 },
      acts: [
        { id: "jungfraujoch", name: "Jungfraujoch — Top of Europe", hrs: 7, price: 210, tag: "Iconic" },
        { id: "gornergrat", name: "Gornergrat sunrise railway", hrs: 4, price: 120 },
        { id: "paraglide", name: "Tandem paragliding over Interlaken", hrs: 2, price: 190, tag: "Thrill" },
        { id: "fondue", name: "Fondue & chocolate workshop", hrs: 3, price: 85, tag: "Food" },
        { id: "steamboat", name: "Lake Lucerne steamboat cruise", hrs: 3, price: 60 },
        { id: "five-lakes", name: "Guided Five Lakes hike", hrs: 5, price: 95 },
      ],
    },
    {
      id: "dolomites", name: "Dolomites", country: "Italy", region: "Europe", img: "t-dolomites.jpg", tagline: "Pale peaks and emerald lakes", best: "Jun – Oct",
      nightly: { comfort: 140, premium: 250, luxury: 480 },
      acts: [
        { id: "braies-boat", name: "Dawn rowboat on Lago di Braies", hrs: 2, price: 55, tag: "Iconic" },
        { id: "tre-cime", name: "Tre Cime di Lavaredo guided loop", hrs: 6, price: 110 },
        { id: "via-ferrata", name: "Beginner via ferrata with a guide", hrs: 5, price: 160, tag: "Thrill" },
        { id: "seceda", name: "Seceda ridgeline & rifugio lunch", hrs: 5, price: 90 },
        { id: "ebike", name: "Alpe di Siusi meadows by e-bike", hrs: 4, price: 75 },
        { id: "dumplings", name: "South Tyrolean dumpling class", hrs: 3, price: 70, tag: "Food" },
      ],
    },
    {
      id: "santorini", name: "Santorini", country: "Greece", region: "Europe", img: "t-santorini.jpg", tagline: "Blue domes over a drowned volcano", best: "May – Oct",
      nightly: { comfort: 150, premium: 290, luxury: 620 },
      acts: [
        { id: "catamaran", name: "Sunset catamaran cruise with dinner", hrs: 5, price: 165, tag: "Iconic" },
        { id: "caldera-walk", name: "Fira to Oia caldera walk", hrs: 4, price: 45 },
        { id: "wine", name: "Volcanic vineyard tasting", hrs: 3, price: 95, tag: "Food" },
        { id: "akrotiri", name: "Akrotiri ruins with an archaeologist", hrs: 3, price: 70 },
        { id: "photo-walk", name: "Blue-dome photo walk at dawn", hrs: 2, price: 80 },
        { id: "greek-kitchen", name: "Greek island cooking class", hrs: 4, price: 110, tag: "Food" },
      ],
    },
    {
      id: "iceland", name: "Iceland", country: "Iceland", region: "Europe", img: "t-iceland.jpg", tagline: "Waterfalls, glaciers and midnight sun", best: "May – Sep",
      nightly: { comfort: 170, premium: 280, luxury: 520 },
      acts: [
        { id: "glacier-hike", name: "Glacier hike on Sólheimajökull", hrs: 4, price: 130, tag: "Thrill" },
        { id: "zodiac", name: "Jökulsárlón zodiac among icebergs", hrs: 2, price: 115, tag: "Iconic" },
        { id: "whales", name: "Whale watching from Húsavík", hrs: 3, price: 105 },
        { id: "blue-lagoon", name: "Blue Lagoon premium entry", hrs: 3, price: 120 },
        { id: "ice-cave", name: "Katla ice cave by super-jeep", hrs: 4, price: 190 },
        { id: "horses", name: "Icelandic horse ride on lava fields", hrs: 2, price: 95 },
      ],
    },
    {
      id: "italy", name: "Rome & Tuscany", country: "Italy", region: "Europe", img: "t-italy.jpg", tagline: "Two thousand years, one long lunch", best: "Mar – Nov",
      nightly: { comfort: 130, premium: 240, luxury: 520 },
      acts: [
        { id: "colosseum", name: "Colosseum arena floor & Forum", hrs: 3, price: 85, tag: "Iconic" },
        { id: "vatican", name: "Early-access Vatican & Sistine Chapel", hrs: 3, price: 110 },
        { id: "trastevere", name: "Trastevere food walk", hrs: 3, price: 90, tag: "Food" },
        { id: "vespa", name: "Rome by vintage Vespa", hrs: 3, price: 130, tag: "Thrill" },
        { id: "chianti", name: "Chianti vineyard lunch", hrs: 6, price: 140, tag: "Food" },
        { id: "pasta", name: "Hand-rolled pasta class", hrs: 3, price: 80 },
      ],
    },
    {
      id: "bali", name: "Bali", country: "Indonesia", region: "Asia", img: "t-bali.jpg", tagline: "Water temples and emerald terraces", best: "Apr – Oct",
      nightly: { comfort: 70, premium: 150, luxury: 380 },
      acts: [
        { id: "bratan", name: "Sunrise at Ulun Danu Bratan temple", hrs: 5, price: 65, tag: "Iconic" },
        { id: "terraces", name: "Tegallalang terraces with a farmer", hrs: 3, price: 40 },
        { id: "batur", name: "Mount Batur sunrise trek", hrs: 7, price: 75, tag: "Thrill" },
        { id: "bali-kitchen", name: "Cooking class in a family compound", hrs: 4, price: 55, tag: "Food" },
        { id: "manta", name: "Nusa Penida snorkel with manta rays", hrs: 8, price: 120 },
        { id: "spa-ritual", name: "Two-hour Balinese spa ritual", hrs: 2, price: 60 },
      ],
    },
    {
      id: "maldives", name: "Maldives", country: "Maldives", region: "Asia", img: "t-maldives.jpg", tagline: "Villas on stilts, lagoons like glass", best: "Nov – Apr",
      nightly: { comfort: 320, premium: 620, luxury: 1250 },
      acts: [
        { id: "sandbank", name: "Private sandbank picnic", hrs: 3, price: 180, tag: "Iconic" },
        { id: "turtles", name: "Turtle & reef-shark snorkel safari", hrs: 3, price: 95 },
        { id: "dolphins", name: "Sunset dolphin cruise", hrs: 2, price: 85 },
        { id: "scuba", name: "Discover scuba dive", hrs: 3, price: 160, tag: "Thrill" },
        { id: "overwater-spa", name: "Overwater spa treatment", hrs: 2, price: 150 },
        { id: "fishing", name: "Sunset fishing & beach barbecue", hrs: 3, price: 90, tag: "Food" },
      ],
    },
    {
      id: "japan", name: "Japan", country: "Japan", region: "Asia", img: "t-japan.jpg", tagline: "Lantern lanes and bullet trains", best: "Mar – May · Oct – Nov",
      nightly: { comfort: 120, premium: 230, luxury: 520 },
      acts: [
        { id: "tea", name: "Tea ceremony in a Gion townhouse", hrs: 2, price: 70, tag: "Iconic" },
        { id: "inari", name: "Fushimi Inari at dawn with a guide", hrs: 3, price: 60 },
        { id: "sushi", name: "Sushi-making with a Tokyo chef", hrs: 3, price: 115, tag: "Food" },
        { id: "fuji", name: "Mt Fuji & Hakone day trip", hrs: 9, price: 150 },
        { id: "sumo", name: "Morning sumo stable visit", hrs: 3, price: 95 },
        { id: "kyoto-bike", name: "Kyoto backstreets by bicycle", hrs: 4, price: 65 },
      ],
    },
    {
      id: "thailand", name: "Thai Islands", country: "Thailand", region: "Asia", img: "t-thailand.jpg", tagline: "Longtails, limestone and warm seas", best: "Nov – Apr",
      nightly: { comfort: 65, premium: 140, luxury: 340 },
      acts: [
        { id: "phi-phi", name: "Phi Phi & Maya Bay by speedboat", hrs: 8, price: 95, tag: "Iconic" },
        { id: "railay", name: "Railay beaches by longtail", hrs: 5, price: 55 },
        { id: "sea-canoe", name: "Phang Nga Bay sea canoe", hrs: 7, price: 110 },
        { id: "thai-kitchen", name: "Thai cooking class & market visit", hrs: 4, price: 50, tag: "Food" },
        { id: "elephants", name: "Ethical elephant sanctuary visit", hrs: 5, price: 85 },
        { id: "climb", name: "Beginner rock climbing at Railay", hrs: 4, price: 70, tag: "Thrill" },
      ],
    },
    {
      id: "morocco", name: "Morocco", country: "Morocco", region: "Africa & Middle East", img: "t-morocco.jpg", tagline: "Kasbahs, souks and Saharan nights", best: "Mar – May · Sep – Nov",
      nightly: { comfort: 70, premium: 150, luxury: 360 },
      acts: [
        { id: "camels", name: "Sunset camel trek over the dunes", hrs: 3, price: 60, tag: "Iconic" },
        { id: "souk", name: "Medina & souk walk with a local", hrs: 3, price: 35 },
        { id: "hammam", name: "Traditional hammam & massage", hrs: 2, price: 55 },
        { id: "atlas", name: "Atlas Mountains & Berber village day", hrs: 8, price: 90 },
        { id: "tagine", name: "Tagine class in a riad kitchen", hrs: 4, price: 65, tag: "Food" },
        { id: "balloon", name: "Hot-air balloon over the palm groves", hrs: 4, price: 210, tag: "Thrill" },
      ],
    },
    {
      id: "rockies", name: "Canadian Rockies", country: "Canada", region: "Americas", img: "t-rockies.jpg", tagline: "Glacier lakes the colour of gemstones", best: "Jun – Sep",
      nightly: { comfort: 160, premium: 270, luxury: 540 },
      acts: [
        { id: "moraine", name: "Sunrise canoe on Moraine Lake", hrs: 2, price: 95, tag: "Iconic" },
        { id: "ice-walk", name: "Athabasca Glacier ice walk", hrs: 3, price: 110 },
        { id: "gondola", name: "Banff gondola & hot springs", hrs: 4, price: 80 },
        { id: "wildlife", name: "Dusk wildlife drive with a naturalist", hrs: 3, price: 85 },
        { id: "rafting", name: "Kicking Horse river rafting", hrs: 5, price: 140, tag: "Thrill" },
        { id: "maligne", name: "Maligne Lake cruise to Spirit Island", hrs: 3, price: 90 },
      ],
    },
    {
      id: "kenya", name: "Kenya", country: "Kenya", region: "Africa & Middle East", img: "t-kenya.jpg", tagline: "Big skies and bigger neighbours", best: "Jul – Oct",
      nightly: { comfort: 220, premium: 420, luxury: 880 },
      acts: [
        { id: "mara-balloon", name: "Balloon safari over the Mara", hrs: 4, price: 480, tag: "Iconic" },
        { id: "game-drive", name: "Full-day game drive with picnic", hrs: 9, price: 160 },
        { id: "maasai", name: "Maasai village visit", hrs: 2, price: 40 },
        { id: "bush-walk", name: "Guided bush walk at dawn", hrs: 3, price: 75, tag: "Thrill" },
        { id: "naivasha", name: "Lake Naivasha boat safari", hrs: 2, price: 60 },
        { id: "bush-dinner", name: "Bush dinner under the stars", hrs: 3, price: 120, tag: "Food" },
      ],
    },
  ],

  /* ---- Tours -------------------------------------------------------------
     price = per adult. route nights must add up to days − 1.
     dest  = matching destination id (enables "Customise this trip"). */
  tours: [
    {
      id: "swiss-alps", name: "Swiss Alps by Rail & Trail", place: "Lucerne · Lauterbrunnen · Zermatt", country: "Switzerland", region: "Europe", dest: "swiss",
      styles: ["mountains", "family"], days: 8, price: 2890, rating: 4.9, reviews: 412, img: "t-swiss.jpg", alt: "Chalets in the Lauterbrunnen valley beneath cliffs and snowy peaks",
      badge: "Bestseller", group: "Max 12", level: "Easy", season: "Jun – Sep",
      blurb: "Cogwheel trains, wildflower trails and three of the Alps' great valleys — with your bags always one step ahead of you.",
      highlights: ["First-class Swiss Travel Pass included", "Jungfraujoch, the Top of Europe", "Sunrise over the Matterhorn from Gornergrat", "Lake Lucerne steamboat & fondue evening"],
      route: [
        { place: "Lucerne", nights: 2, do: ["Old town & Chapel Bridge walk", "Mount Pilatus golden round trip"] },
        { place: "Lauterbrunnen", nights: 3, do: ["Staubbach & Trümmelbach falls", "Jungfraujoch by cogwheel train", "Mürren to Gimmelwald panorama trail"] },
        { place: "Zermatt", nights: 2, do: ["Scenic rail journey to Zermatt", "Gornergrat sunrise & Five Lakes walk"] },
      ],
    },
    {
      id: "dolomites", name: "Dolomites Lakes & Peaks", place: "Cortina · Braies · Val Gardena", country: "Italy", region: "Europe", dest: "dolomites",
      styles: ["mountains", "adventure"], days: 7, price: 1640, rating: 4.8, reviews: 286, img: "t-dolomites.jpg", alt: "A wooden rowing boat on the turquoise Lago di Braies",
      badge: "Small group", group: "Max 10", level: "Moderate", season: "Jun – Oct",
      blurb: "Row an emerald lake at dawn, circle the Tre Cime and eat lunch on a ridge — a week of big days and soft beds.",
      highlights: ["Dawn rowboat on Lago di Braies", "Tre Cime di Lavaredo loop hike", "Rifugio lunch on the Seceda ridgeline", "Luggage transferred between hotels"],
      route: [
        { place: "Cortina d'Ampezzo", nights: 2, do: ["Cinque Torri open-air museum walk", "Lagazuoi cable car & wartime tunnels"] },
        { place: "Braies", nights: 2, do: ["Dawn rowboat on Lago di Braies", "Tre Cime di Lavaredo circuit"] },
        { place: "Val Gardena", nights: 2, do: ["Seceda ridgeline hike", "Alpe di Siusi meadows by e-bike"] },
      ],
    },
    {
      id: "santorini", name: "Santorini & the Cyclades", place: "Santorini · Naxos · Paros", country: "Greece", region: "Europe", dest: "santorini",
      styles: ["beach", "romance"], days: 9, price: 2150, rating: 4.8, reviews: 367, img: "t-santorini.jpg", alt: "Blue-domed churches above the Santorini caldera",
      badge: "Honeymoon favourite", group: "Max 14", level: "Easy", season: "May – Oct",
      blurb: "Three islands at island pace: caldera sunsets, mountain villages and long lunches with your feet in the sand.",
      highlights: ["Sunset catamaran cruise on the caldera", "Oia's blue domes before the crowds", "Naxos mountain-village food trail", "Fast ferries and port transfers included"],
      route: [
        { place: "Santorini", nights: 3, do: ["Fira to Oia caldera walk", "Sunset catamaran with dinner on board", "Akrotiri ruins & volcanic wine tasting"] },
        { place: "Naxos", nights: 3, do: ["Old town & the Portara at golden hour", "Mountain villages food trail", "Free beach day at Plaka"] },
        { place: "Paros", nights: 2, do: ["Naoussa harbour & fishing-boat lunch", "Antiparos by bike"] },
      ],
    },
    {
      id: "cinque-terre", name: "Cinque Terre & Tuscan Hills", place: "Florence · Chianti · Cinque Terre", country: "Italy", region: "Europe", dest: "italy",
      styles: ["culture", "romance"], days: 7, price: 1980, rating: 4.7, reviews: 241, img: "t-cinque.jpg", alt: "The colourful cliffside village of Manarola in Cinque Terre",
      group: "Max 12", level: "Easy", season: "Apr – Oct",
      blurb: "Renaissance mornings, vineyard lunches and a coastline of villages stacked like paint tins above the sea.",
      highlights: ["Coastal trail between the five villages", "Chianti vineyard lunch and tasting", "Skip-the-line Uffizi with an art historian", "Pesto-making class in Manarola"],
      route: [
        { place: "Florence", nights: 2, do: ["Uffizi & Duomo with a local guide", "Oltrarno artisans & sunset at Piazzale Michelangelo"] },
        { place: "Chianti", nights: 2, do: ["Vineyard lunch & cellar tasting", "Siena & San Gimignano day"] },
        { place: "Cinque Terre", nights: 2, do: ["Vernazza to Monterosso coastal hike", "Boat hop & pesto class in Manarola"] },
      ],
    },
    {
      id: "iceland", name: "Iceland Ring Road Explorer", place: "Reykjavík · Vík · Mývatn · Akureyri", country: "Iceland", region: "Europe", dest: "iceland",
      styles: ["roadtrip", "adventure"], days: 10, price: 3250, rating: 4.9, reviews: 329, img: "t-iceland.jpg", alt: "Seljalandsfoss waterfall pouring over a green cliff at sunset",
      badge: "Road trip", group: "Max 12", level: "Easy", season: "May – Sep",
      blurb: "The full circle: waterfalls you can walk behind, icebergs on black sand, and a hot pool waiting most evenings.",
      highlights: ["Walk behind Seljalandsfoss waterfall", "Zodiac among icebergs at Jökulsárlón", "Whale watching from Húsavík", "Geothermal soak at Mývatn Nature Baths"],
      route: [
        { place: "Reykjavík", nights: 1, do: ["Arrival & Sky Lagoon soak"] },
        { place: "Vík", nights: 2, do: ["Golden Circle: Þingvellir, Geysir & Gullfoss", "Seljalandsfoss, Skógafoss & black-sand Reynisfjara"] },
        { place: "Höfn", nights: 1, do: ["Jökulsárlón glacier lagoon by zodiac"] },
        { place: "Eastfjords", nights: 1, do: ["Fjord road & Seyðisfjörður village"] },
        { place: "Mývatn", nights: 2, do: ["Dettifoss & the lava fields", "Húsavík whale watching"] },
        { place: "Akureyri", nights: 1, do: ["Goðafoss & the northern capital"] },
        { place: "Reykjavík", nights: 1, do: ["Snæfellsnes peninsula on the way back"] },
      ],
    },
    {
      id: "lofoten", name: "Lofoten & the Northern Lights", place: "Tromsø · Svolvær · Reine", country: "Norway", region: "Europe", dest: null,
      styles: ["adventure", "romance"], days: 7, price: 2760, rating: 4.8, reviews: 198, img: "t-lofoten.jpg", alt: "Red fishermen's cabins beneath a jagged peak at Hamnøy, Lofoten",
      group: "Max 10", level: "Easy", season: "Sep – Mar",
      blurb: "Sleep in a red fisherman's cabin, cruise a silent fjord and chase the aurora with someone who knows where to look.",
      highlights: ["Stay in a traditional rorbu cabin", "Aurora chase with a photo guide", "Silent electric cruise into Trollfjord", "Arctic beach walk at Haukland"],
      route: [
        { place: "Tromsø", nights: 2, do: ["Cable car & Arctic Cathedral", "Northern lights chase by minibus"] },
        { place: "Svolvær", nights: 2, do: ["Trollfjord silent cruise", "Henningsvær harbour & galleries"] },
        { place: "Reine", nights: 2, do: ["Hamnøy bridge at sunrise", "Kvalvika beach hike"] },
      ],
    },
    {
      id: "classic-italy", name: "Classic Italy: Rome, Florence & Venice", place: "Rome · Florence · Venice", country: "Italy", region: "Europe", dest: "italy",
      styles: ["culture", "family"], days: 8, price: 2340, rating: 4.7, reviews: 503, img: "t-italy.jpg", alt: "The Colosseum in Rome lit up at dusk",
      badge: "First-timer pick", group: "Max 16", level: "Easy", season: "Mar – Nov",
      blurb: "The three cities everyone should see once, linked by fast trains and guided by people who live there.",
      highlights: ["Colosseum arena-floor access", "Vatican Museums before opening hours", "High-speed trains between cities", "Private gondola ride at dusk"],
      route: [
        { place: "Rome", nights: 3, do: ["Colosseum, Forum & Palatine with an archaeologist", "Early-access Vatican & Sistine Chapel", "Trastevere food walk"] },
        { place: "Florence", nights: 2, do: ["Accademia & Duomo climb", "Tuscan countryside day"] },
        { place: "Venice", nights: 2, do: ["St Mark's & the Doge's Palace", "Murano & Burano by boat, gondola at dusk"] },
      ],
    },
    {
      id: "bali", name: "Bali: Temples, Terraces & Tides", place: "Ubud · Munduk · Uluwatu", country: "Indonesia", region: "Asia", dest: "bali",
      styles: ["culture", "beach"], days: 8, price: 1290, rating: 4.8, reviews: 641, img: "t-bali.jpg", alt: "Ulun Danu Bratan water temple reflected in a still lake",
      badge: "Great value", group: "Max 12", level: "Easy", season: "Apr – Oct",
      blurb: "Highland temples in the morning mist, rice terraces at lunch and a clifftop fire dance to finish.",
      highlights: ["Sunrise at Ulun Danu Bratan water temple", "Tegallalang rice terraces with a farmer", "Cooking class in a family compound", "Clifftop Kecak fire dance at Uluwatu"],
      route: [
        { place: "Ubud", nights: 3, do: ["Monkey Forest & craft villages", "Tegallalang terraces & Tirta Empul", "Cooking class in a family compound"] },
        { place: "Munduk", nights: 2, do: ["Ulun Danu Bratan at sunrise", "Twin lakes & waterfall trek"] },
        { place: "Uluwatu", nights: 2, do: ["Uluwatu temple & Kecak dance", "Free beach day at Padang Padang"] },
      ],
    },
    {
      id: "maldives", name: "Maldives Overwater Escape", place: "South Malé Atoll", country: "Maldives", region: "Asia", dest: "maldives",
      styles: ["beach", "romance"], days: 6, price: 3480, rating: 4.9, reviews: 278, img: "t-maldives.jpg", alt: "Aerial view of overwater villas curving across a turquoise lagoon",
      badge: "Luxury", group: "Private", level: "Easy", season: "Nov – Apr",
      blurb: "Five nights above the lagoon, with a seaplane to get you there and almost nothing on the schedule.",
      highlights: ["Five nights in an overwater villa", "Seaplane transfer over the atolls", "Private sandbank picnic for two", "Snorkel with turtles and reef sharks"],
      route: [
        { place: "South Malé Atoll", nights: 5, do: ["Seaplane arrival & lagoon swim", "House-reef snorkel with a marine biologist", "Sandbank picnic & sunset dolphin cruise", "Spa morning & free afternoon", "Sunrise paddle & farewell dinner on the beach"] },
      ],
    },
    {
      id: "japan", name: "Japan Golden Route", place: "Tokyo · Hakone · Kyoto · Osaka", country: "Japan", region: "Asia", dest: "japan",
      styles: ["culture", "family"], days: 10, price: 3120, rating: 4.9, reviews: 455, img: "t-japan.jpg", alt: "A lantern-lit Kyoto lane leading to Yasaka Pagoda at dusk",
      badge: "Bestseller", group: "Max 14", level: "Easy", season: "Mar – May · Oct – Nov",
      blurb: "Neon to moss gardens in ten days: bullet trains, a ryokan night and Kyoto before the city wakes.",
      highlights: ["Bullet train with reserved seats", "Ryokan night with onsen and kaiseki dinner", "Fushimi Inari at dawn", "Tea ceremony in a Gion townhouse"],
      route: [
        { place: "Tokyo", nights: 3, do: ["Asakusa, Senso-ji & the Sumida river", "Market breakfast & digital art museum", "Shibuya, Harajuku & Meiji shrine"] },
        { place: "Hakone", nights: 1, do: ["Ryokan stay, onsen & Mt Fuji views"] },
        { place: "Kyoto", nights: 3, do: ["Fushimi Inari at dawn & Nishiki market", "Arashiyama bamboo grove & Kinkaku-ji", "Gion tea ceremony"] },
        { place: "Osaka", nights: 2, do: ["Nara's deer park & Todai-ji", "Dotonbori street-food night"] },
      ],
    },
    {
      id: "nepal", name: "Nepal: Everest View Trek", place: "Kathmandu · Namche · Tengboche", country: "Nepal", region: "Asia", dest: null,
      styles: ["mountains", "adventure"], days: 12, price: 1850, rating: 4.8, reviews: 173, img: "t-nepal.jpg", alt: "A white stupa on a ridge beneath the snow peaks of the Everest region",
      badge: "Trek", group: "Max 10", level: "Challenging", season: "Mar – May · Oct – Nov",
      blurb: "Walk the Sherpa heartland to Tengboche monastery, where Everest, Lhotse and Ama Dablam fill the skyline.",
      highlights: ["Mountain flight into Lukla", "Everest, Lhotse and Ama Dablam from Tengboche", "Licensed Sherpa guide and porters", "Acclimatisation days built in"],
      route: [
        { place: "Kathmandu", nights: 2, do: ["Boudhanath & Pashupatinath", "Trek briefing & gear check"] },
        { place: "Phakding", nights: 1, do: ["Lukla flight & first trail day"] },
        { place: "Namche Bazaar", nights: 3, do: ["Climb to the Sherpa capital", "Acclimatisation hike to the Everest viewpoint", "Khumjung village & Hillary school"] },
        { place: "Tengboche", nights: 2, do: ["Monastery & Everest panorama", "Rest day with Ama Dablam views"] },
        { place: "Monjo", nights: 1, do: ["Descent through rhododendron forest"] },
        { place: "Lukla", nights: 1, do: ["Final trail day & farewell with the crew"] },
        { place: "Kathmandu", nights: 1, do: ["Return flight & Thamel dinner"] },
      ],
    },
    {
      id: "golden-triangle", name: "India's Golden Triangle", place: "Delhi · Agra · Jaipur", country: "India", region: "Asia", dest: null,
      styles: ["culture", "family"], days: 7, price: 1180, rating: 4.7, reviews: 389, img: "t-india.jpg", alt: "The Taj Mahal reflected in its long garden pool",
      group: "Max 14", level: "Easy", season: "Oct – Mar",
      blurb: "Mughal marble, pink-walled palaces and Old Delhi by rickshaw — India's essential first chapter.",
      highlights: ["Taj Mahal at sunrise", "Amber Fort and the Pink City bazaars", "Old Delhi by rickshaw with a food guide", "Private air-conditioned vehicle throughout"],
      route: [
        { place: "Delhi", nights: 2, do: ["Old Delhi rickshaw & street-food trail", "Humayun's Tomb, Qutub Minar & Lodhi art district"] },
        { place: "Agra", nights: 2, do: ["Agra Fort & Mehtab Bagh at sunset", "Taj Mahal at sunrise & marble-inlay workshop"] },
        { place: "Jaipur", nights: 2, do: ["Amber Fort & Hawa Mahal", "City Palace, Jantar Mantar & block-printing class"] },
      ],
    },
    {
      id: "kerala", name: "Kerala Backwaters & Tea Hills", place: "Kochi · Munnar · Alleppey", country: "India", region: "Asia", dest: null,
      styles: ["culture", "romance"], days: 7, price: 1150, rating: 4.8, reviews: 224, img: "t-kerala.jpg", alt: "A thatched houseboat gliding along palm-lined Kerala backwaters",
      group: "Max 12", level: "Easy", season: "Sep – Mar",
      blurb: "Slow travel at its best: tea estates above the clouds, then a private houseboat drifting through the palms.",
      highlights: ["Overnight on a private houseboat", "Tea estate walk in Munnar", "Kathakali performance in Fort Kochi", "Ayurvedic massage included"],
      route: [
        { place: "Kochi", nights: 2, do: ["Fort Kochi heritage walk & Chinese fishing nets", "Kathakali evening"] },
        { place: "Munnar", nights: 2, do: ["Tea estate walk & factory tasting", "Eravikulam National Park"] },
        { place: "Alleppey", nights: 1, do: ["Private houseboat cruise with an onboard chef"] },
        { place: "Kumarakom", nights: 1, do: ["Village canoe ride & Ayurvedic massage"] },
      ],
    },
    {
      id: "vietnam", name: "Vietnam: Hanoi to Ha Long Bay", place: "Hanoi · Ninh Binh · Ha Long", country: "Vietnam", region: "Asia", dest: null,
      styles: ["culture", "adventure"], days: 8, price: 1490, rating: 4.8, reviews: 312, img: "t-vietnam.jpg", alt: "Boats among the limestone islands of Ha Long Bay",
      group: "Max 14", level: "Easy", season: "Oct – Apr",
      blurb: "Scooter-buzzing Hanoi, rice-field caves by rowboat, and a night afloat among two thousand limestone islands.",
      highlights: ["Night on a junk boat among the karsts", "Kayak into hidden lagoons", "Street-food crawl through the Old Quarter", "Rowboat through Tam Coc's river caves"],
      route: [
        { place: "Hanoi", nights: 3, do: ["Old Quarter street-food crawl", "Temple of Literature & train-street coffee", "Cooking class & water puppets"] },
        { place: "Ninh Binh", nights: 2, do: ["Tam Coc rowboat & Bich Dong pagoda", "Cycle to the Hang Mua viewpoint"] },
        { place: "Ha Long Bay", nights: 2, do: ["Cruise, kayak & sunset on deck", "Tai chi at dawn & cave visit"] },
      ],
    },
    {
      id: "thailand", name: "Thailand Island Hopping", place: "Phuket · Phi Phi · Krabi", country: "Thailand", region: "Asia", dest: "thailand",
      styles: ["beach", "family"], days: 9, price: 1560, rating: 4.7, reviews: 458, img: "t-thailand.jpg", alt: "The twin bays of Phi Phi island seen from the viewpoint",
      badge: "Great value", group: "Max 14", level: "Easy", season: "Nov – Apr",
      blurb: "Longtail boats, limestone cliffs and three very different islands — with plenty of time to do nothing at all.",
      highlights: ["Phi Phi viewpoint at sunrise", "Longtail boat to Railay's limestone beaches", "Snorkelling in the Andaman Sea", "Thai cooking class with market visit"],
      route: [
        { place: "Phuket", nights: 3, do: ["Old Town Sino-Portuguese walk", "Phang Nga Bay by sea canoe", "Beach day & Thai cooking class"] },
        { place: "Phi Phi Islands", nights: 2, do: ["Viewpoint sunrise & Maya Bay", "Snorkel trip by longtail"] },
        { place: "Krabi", nights: 3, do: ["Railay beach & caves by longtail", "Four Islands day trip", "Emerald Pool & hot springs"] },
      ],
    },
    {
      id: "cappadocia", name: "Cappadocia & Istanbul", place: "Istanbul · Göreme", country: "Türkiye", region: "Africa & Middle East", dest: null,
      styles: ["culture", "romance"], days: 7, price: 1720, rating: 4.8, reviews: 344, img: "t-turkey.jpg", alt: "Hot-air balloons drifting over the rock valleys of Cappadocia",
      group: "Max 14", level: "Easy", season: "Apr – Jun · Sep – Nov",
      blurb: "Domes and bazaars on the Bosphorus, then a cave hotel and a sunrise balloon over the fairy chimneys.",
      highlights: ["Hot-air balloon flight at sunrise", "Sleep in a cave hotel", "Hagia Sophia and the Blue Mosque with a historian", "Bosphorus sunset cruise"],
      route: [
        { place: "Istanbul", nights: 3, do: ["Hagia Sophia, Blue Mosque & Basilica Cistern", "Grand Bazaar & spice-market tasting", "Bosphorus cruise & Galata evening"] },
        { place: "Cappadocia", nights: 3, do: ["Göreme open-air museum & fairy chimneys", "Sunrise balloon flight & Kaymaklı underground city", "Red Valley hike & pottery in Avanos"] },
      ],
    },
    {
      id: "morocco", name: "Morocco: Marrakech to the Sahara", place: "Marrakech · Dades · Merzouga", country: "Morocco", region: "Africa & Middle East", dest: "morocco",
      styles: ["culture", "adventure"], days: 8, price: 1390, rating: 4.8, reviews: 297, img: "t-morocco.jpg", alt: "A mud-brick kasbah above a palm oasis with mountains beyond",
      group: "Max 12", level: "Easy", season: "Mar – May · Sep – Nov",
      blurb: "From the souks over the High Atlas to a camp in the dunes, with a kasbah or two along the way.",
      highlights: ["Night in a desert camp under the stars", "Camel trek over the Erg Chebbi dunes", "Kasbahs and palm oases of the south", "Riad stay in the Marrakech medina"],
      route: [
        { place: "Marrakech", nights: 2, do: ["Medina, souks & Jemaa el-Fna by night", "Majorelle garden & hammam"] },
        { place: "Aït Benhaddou", nights: 1, do: ["High Atlas crossing via Tizi n'Tichka"] },
        { place: "Dades Valley", nights: 1, do: ["Kasbah route & palm oases"] },
        { place: "Merzouga", nights: 2, do: ["Camel trek to the desert camp", "Dune sunrise & nomad family visit"] },
        { place: "Ouarzazate", nights: 1, do: ["Draa Valley & film-studio stop"] },
      ],
    },
    {
      id: "kenya", name: "Kenya Classic Safari", place: "Nairobi · Amboseli · Maasai Mara", country: "Kenya", region: "Africa & Middle East", dest: "kenya",
      styles: ["wildlife", "family"], days: 7, price: 3950, rating: 4.9, reviews: 186, img: "t-kenya.jpg", alt: "An elephant walking across golden savanna grass",
      badge: "Wildlife", group: "Max 6 per vehicle", level: "Easy", season: "Jul – Oct",
      blurb: "Elephants under Kilimanjaro, hippos on Naivasha and big cats in the Mara, all from a pop-top 4x4.",
      highlights: ["Elephants below Kilimanjaro in Amboseli", "Big-cat country in the Maasai Mara", "Pop-top 4x4 with a guaranteed window seat", "Bush breakfast on the savanna"],
      route: [
        { place: "Nairobi", nights: 1, do: ["Giraffe Centre & elephant orphanage"] },
        { place: "Amboseli", nights: 2, do: ["Afternoon game drive below Kilimanjaro", "Full day with elephants & swamp birdlife"] },
        { place: "Lake Naivasha", nights: 1, do: ["Boat safari among hippos"] },
        { place: "Maasai Mara", nights: 2, do: ["Big-cat game drives", "Bush breakfast & Maasai village visit"] },
      ],
    },
    {
      id: "jordan", name: "Jordan: Petra & Wadi Rum", place: "Amman · Petra · Wadi Rum · Dead Sea", country: "Jordan", region: "Africa & Middle East", dest: null,
      styles: ["culture", "adventure"], days: 6, price: 1880, rating: 4.8, reviews: 207, img: "t-jordan.jpg", alt: "The rock-cut Monastery at Petra",
      group: "Max 12", level: "Moderate", season: "Mar – May · Sep – Nov",
      blurb: "A rose-red city carved from the cliffs, a night with the Bedouin, and a float in the lowest sea on Earth.",
      highlights: ["Petra by candlelight", "Climb to the Monastery, Ad Deir", "Jeep tour and Bedouin camp in Wadi Rum", "Float in the Dead Sea"],
      route: [
        { place: "Amman", nights: 1, do: ["Citadel & downtown falafel trail"] },
        { place: "Petra", nights: 2, do: ["The Siq, Treasury & Royal Tombs", "Monastery climb & Petra by night"] },
        { place: "Wadi Rum", nights: 1, do: ["Jeep tour, sunset & Bedouin camp"] },
        { place: "Dead Sea", nights: 1, do: ["Float, mud & spa afternoon"] },
      ],
    },
    {
      id: "patagonia", name: "Patagonia: Torres del Paine W Trek", place: "Punta Arenas · Torres del Paine", country: "Chile", region: "Americas", dest: null,
      styles: ["mountains", "adventure"], days: 9, price: 3390, rating: 4.9, reviews: 164, img: "t-patagonia.jpg", alt: "Turquoise Lake Pehoé beneath the peaks of Torres del Paine",
      badge: "Trek", group: "Max 10", level: "Challenging", season: "Nov – Mar",
      blurb: "Five trail days through the park that made Patagonia famous — granite towers, hanging glaciers and big skies.",
      highlights: ["Base of the Towers at sunrise", "The French Valley amphitheatre", "Boat to the face of Grey Glacier", "Refugio and eco-camp nights with hot showers"],
      route: [
        { place: "Punta Arenas", nights: 1, do: ["Arrival & Strait of Magellan walk"] },
        { place: "Puerto Natales", nights: 1, do: ["Gear check & fjord-side dinner"] },
        { place: "Torres del Paine", nights: 5, do: ["Hike to the Base of the Towers", "Los Cuernos lakeside trail", "The French Valley", "Grey Glacier trail & boat", "Lake Pehoé catamaran & rest"] },
        { place: "Puerto Natales", nights: 1, do: ["Celebration dinner"] },
      ],
    },
    {
      id: "peru", name: "Peru: Sacred Valley & Machu Picchu", place: "Lima · Cusco · Machu Picchu", country: "Peru", region: "Americas", dest: null,
      styles: ["culture", "adventure"], days: 8, price: 2240, rating: 4.8, reviews: 398, img: "t-peru.jpg", alt: "Machu Picchu's terraces beneath Huayna Picchu, wrapped in cloud",
      group: "Max 12", level: "Moderate", season: "Apr – Oct",
      blurb: "Ceviche in Lima, weavers in the Sacred Valley, then the Inca citadel at first light before the day-trippers arrive.",
      highlights: ["Guided Machu Picchu at first light", "Panoramic train through the Urubamba gorge", "Weaving cooperative in the Sacred Valley", "Lima food tour with a ceviche class"],
      route: [
        { place: "Lima", nights: 1, do: ["Barranco & ceviche class"] },
        { place: "Cusco", nights: 2, do: ["Acclimatise in San Blas & Qorikancha", "Sacsayhuamán & market tasting"] },
        { place: "Sacred Valley", nights: 2, do: ["Pisac ruins & weaving cooperative", "Moray terraces & Maras salt pans"] },
        { place: "Aguas Calientes", nights: 1, do: ["Panoramic train & hot springs"] },
        { place: "Cusco", nights: 1, do: ["Machu Picchu at first light, return to Cusco"] },
      ],
    },
    {
      id: "rockies", name: "Canadian Rockies: Banff to Jasper", place: "Banff · Lake Louise · Jasper", country: "Canada", region: "Americas", dest: "rockies",
      styles: ["mountains", "roadtrip"], days: 8, price: 2680, rating: 4.9, reviews: 263, img: "t-rockies.jpg", alt: "Moraine Lake mirroring the Valley of the Ten Peaks",
      group: "Max 12", level: "Easy", season: "Jun – Sep",
      blurb: "Gemstone lakes, a walk on a glacier and one of the world's great drives between two mountain towns.",
      highlights: ["Canoe on Moraine Lake", "The Icefields Parkway by road", "Walk on the Athabasca Glacier", "Dusk wildlife spotting with a naturalist"],
      route: [
        { place: "Banff", nights: 2, do: ["Gondola to Sulphur Mountain & hot springs", "Johnston Canyon catwalks"] },
        { place: "Lake Louise", nights: 2, do: ["Moraine Lake canoe at sunrise", "Plain of Six Glaciers teahouse hike"] },
        { place: "Jasper", nights: 3, do: ["Icefields Parkway & Athabasca Glacier walk", "Maligne Lake cruise to Spirit Island", "Dusk wildlife drive & dark-sky stargazing"] },
      ],
    },
    {
      id: "southwest", name: "American Southwest Road Trip", place: "Zion · Monument Valley · Grand Canyon", country: "United States", region: "Americas", dest: null,
      styles: ["roadtrip", "adventure"], days: 9, price: 2450, rating: 4.7, reviews: 231, img: "t-usa.jpg", alt: "A yellow camper van on a desert road between red rock towers",
      badge: "Road trip", group: "Max 12", level: "Easy", season: "Mar – May · Sep – Oct",
      blurb: "Red rock, big sky and the open road: five national parks and a jeep ride through Monument Valley.",
      highlights: ["Monument Valley with a Navajo guide", "Sunrise at the Grand Canyon's South Rim", "Slot-canyon walk near Page", "Scenic Highway 12 through red-rock country"],
      route: [
        { place: "Las Vegas", nights: 1, do: ["Pick-up & Valley of Fire drive"] },
        { place: "Zion", nights: 2, do: ["Riverside walk & canyon overlook", "Emerald Pools & scenic drive"] },
        { place: "Bryce Canyon", nights: 1, do: ["Hoodoo rim trail & stargazing"] },
        { place: "Page", nights: 1, do: ["Slot canyon & Horseshoe Bend"] },
        { place: "Monument Valley", nights: 1, do: ["Backcountry jeep tour with a Navajo guide"] },
        { place: "Grand Canyon", nights: 2, do: ["Desert View drive & sunset", "South Rim sunrise & rim trail"] },
      ],
    },
    {
      id: "new-zealand", name: "New Zealand South Island Journey", place: "Aoraki · Wānaka · Queenstown · Milford", country: "New Zealand", region: "Oceania", dest: null,
      styles: ["roadtrip", "mountains"], days: 12, price: 4150, rating: 4.9, reviews: 152, img: "t-nz.jpg", alt: "A blue lake beneath snow-dusted mountains on New Zealand's South Island",
      group: "Max 12", level: "Moderate", season: "Nov – Apr",
      blurb: "Glacier lakes, dark-sky nights and a fjord you sleep on — the South Island taken at a civilised pace.",
      highlights: ["Overnight cruise on Milford Sound", "Stargazing in the Aoraki dark-sky reserve", "Icebergs on the Tasman Glacier lake", "Queenstown: jet boat or bungy, your call"],
      route: [
        { place: "Christchurch", nights: 1, do: ["Arrival & riverside gardens"] },
        { place: "Lake Tekapo", nights: 1, do: ["Church of the Good Shepherd & dark-sky stargazing"] },
        { place: "Aoraki / Mt Cook", nights: 2, do: ["Hooker Valley track", "Tasman Glacier lake by boat"] },
        { place: "Wānaka", nights: 2, do: ["Roys Peak or lakefront cycle", "Blue Pools & Haast Pass"] },
        { place: "Queenstown", nights: 3, do: ["Skyline gondola & luge", "Jet boat or bungy day", "Arrowtown & Gibbston wine trail"] },
        { place: "Milford Sound", nights: 1, do: ["Overnight fjord cruise"] },
        { place: "Te Anau", nights: 1, do: ["Glow-worm caves"] },
      ],
    },
  ],

  /* Optional extras offered when booking any tour (price per person) */
  tourExtras: [
    { id: "transfer", name: "Airport transfers", note: "Private car both ways", price: 60, icon: "car" },
    { id: "cover", name: "Travel protection", note: "Cancel up to 48 hours before", price: 89, icon: "shield-check" },
    { id: "private-room", name: "Private room upgrade", note: "Your own room throughout", price: 320, icon: "bed-double" },
  ],

  /* ---- Hotels (price = per room per night) ------------------------------- */
  amenities: {
    pool: { name: "Pool", icon: "waves" },
    spa: { name: "Spa", icon: "sparkles" },
    breakfast: { name: "Breakfast included", icon: "coffee" },
    wifi: { name: "Free Wi-Fi", icon: "wifi" },
    beach: { name: "Beachfront", icon: "umbrella" },
    view: { name: "Great views", icon: "mountain" },
    transfer: { name: "Airport transfer", icon: "plane" },
    gym: { name: "Gym", icon: "dumbbell" },
    restaurant: { name: "Restaurant", icon: "utensils" },
    parking: { name: "Free parking", icon: "square-parking" },
    family: { name: "Family friendly", icon: "users" },
    fireplace: { name: "Fireplace", icon: "flame" },
    kitchen: { name: "Kitchenette", icon: "cooking-pot" },
  },
  hotels: [
    { id: "ubud-canopy", name: "Ubud Canopy Villas", dest: "bali", area: "Ubud, Bali", stars: 5, rating: 4.9, reviews: 318, price: 240, img: "h-ubud.jpg", alt: "A villa and stone pool surrounded by jungle", amen: ["pool", "spa", "breakfast", "wifi", "transfer"], blurb: "Private pool villas folded into the jungle, ten minutes from the centre of Ubud." },
    { id: "seminyak-tides", name: "Seminyak Tides Resort", dest: "bali", area: "Seminyak, Bali", stars: 4, rating: 4.6, reviews: 742, price: 135, img: "h-seminyak.jpg", alt: "Loungers around a pool beside a timber-roofed resort building", amen: ["pool", "beach", "breakfast", "restaurant", "wifi"], blurb: "A relaxed beach-club resort a short walk from Seminyak's sunset bars." },
    { id: "azure-atoll", name: "Azure Atoll Water Villas", dest: "maldives", area: "South Malé Atoll", stars: 5, rating: 4.9, reviews: 264, price: 690, img: "h-atoll.jpg", alt: "A wooden jetty leading to thatched overwater villas", amen: ["beach", "spa", "breakfast", "pool", "transfer", "restaurant"], blurb: "Overwater villas with steps straight into the lagoon and a reef a few fin-kicks away." },
    { id: "coral-sands", name: "Coral Sands Island Resort", dest: "maldives", area: "Baa Atoll", stars: 5, rating: 4.8, reviews: 198, price: 520, img: "h-coral.jpg", alt: "A thatched beach pavilion on white sand at the water's edge", amen: ["beach", "spa", "breakfast", "family", "restaurant"], blurb: "Barefoot beach villas on a small island you can walk around in twenty minutes." },
    { id: "lakeview-terrace", name: "Lakeview Terrace Suites", dest: "swiss", area: "Lake Lucerne", stars: 5, rating: 4.9, reviews: 211, price: 410, img: "h-lakeview.jpg", alt: "An open-air bed on a terrace overlooking a lake and mountains", amen: ["view", "spa", "breakfast", "wifi", "restaurant"], blurb: "Open-air terraces high above the lake, with the Alps for a headboard." },
    { id: "alpenglow", name: "Alpenglow Lodge", dest: "swiss", area: "Wengen, Jungfrau Region", stars: 4, rating: 4.7, reviews: 389, price: 260, img: "h-alpenglow.jpg", alt: "A double-height lodge lounge with sofas and tall windows", amen: ["view", "fireplace", "breakfast", "wifi", "spa"], blurb: "A car-free village lodge with a fire in the lounge and trails from the door." },
    { id: "caldera-white", name: "Caldera White Villas", dest: "santorini", area: "Imerovigli, Santorini", stars: 5, rating: 4.9, reviews: 342, price: 380, img: "h-caldera.jpg", alt: "A white cubic villa with a private pool", amen: ["pool", "view", "breakfast", "wifi", "transfer"], blurb: "Whitewashed villas with private plunge pools on the quiet side of the caldera." },
    { id: "braies-chalet", name: "Braies Lakeside Chalet", dest: "dolomites", area: "Lago di Braies", stars: 4, rating: 4.7, reviews: 156, price: 230, img: "h-braies.jpg", alt: "A timber boathouse on a misty mountain lake", amen: ["view", "breakfast", "fireplace", "restaurant", "parking"], blurb: "Wake before the day-trippers and have the most photographed lake in Italy to yourself." },
    { id: "emerald-pines", name: "Emerald Pines Lodge", dest: "rockies", area: "Near Lake Louise", stars: 4, rating: 4.8, reviews: 274, price: 290, img: "h-emerald.jpg", alt: "A lit log cabin beside a snowy lake and pine forest", amen: ["view", "fireplace", "restaurant", "parking", "wifi"], blurb: "Log cabins on a glacier lake, with wood stoves and a hot tub under the stars." },
    { id: "krabi-karst", name: "Krabi Karst Resort", dest: "thailand", area: "Ao Nang, Krabi", stars: 5, rating: 4.7, reviews: 512, price: 160, img: "h-krabi.jpg", alt: "A lagoon pool with pavilions beneath limestone hills", amen: ["pool", "spa", "breakfast", "beach", "family"], blurb: "Lagoon pools beneath the limestone cliffs, five minutes from the longtail pier." },
    { id: "phuket-horizon", name: "Phuket Horizon Resort", dest: "thailand", area: "Kata Noi, Phuket", stars: 4, rating: 4.6, reviews: 468, price: 125, img: "h-horizon.jpg", alt: "A curved infinity pool with palms above the sea", amen: ["pool", "beach", "breakfast", "gym", "restaurant"], blurb: "A hillside infinity pool over one of the island's calmer bays." },
    { id: "palmeraie", name: "Palmeraie Sunset Hotel", dest: "morocco", area: "La Palmeraie, Marrakech", stars: 4, rating: 4.6, reviews: 233, price: 145, img: "h-palmeraie.jpg", alt: "Palm trees and a pool terrace under a pink sunset sky", amen: ["pool", "spa", "breakfast", "restaurant", "transfer"], blurb: "A calm garden retreat among the palms, fifteen minutes from the medina." },
    { id: "red-cabin", name: "Northern Red Cabin", dest: "iceland", area: "Near Vík, South Coast", stars: 3, rating: 4.8, reviews: 129, price: 185, img: "h-redcabin.jpg", alt: "A small red cabin on a grassy hillside", amen: ["view", "kitchen", "parking", "wifi", "fireplace"], blurb: "A snug cabin for two with a hot tub and nothing but hills between you and the sea." },
    { id: "savanna-sky", name: "Savanna Sky Camp", dest: "kenya", area: "Maasai Mara", stars: 5, rating: 4.9, reviews: 141, price: 560, img: "h-savanna.jpg", alt: "A safari vehicle in tall grass at sunset", amen: ["view", "restaurant", "transfer", "family", "breakfast"], blurb: "Canvas suites on the edge of the reserve, with game drives starting at your tent." },
    { id: "gion-machiya", name: "Gion Machiya Hotel", dest: "japan", area: "Gion, Kyoto", stars: 4, rating: 4.8, reviews: 301, price: 210, img: "h-gion.jpg", alt: "A warm timber-lined bedroom opening onto a garden", amen: ["breakfast", "wifi", "spa", "restaurant"], blurb: "Timber rooms around a quiet garden, two lanes from Yasaka Pagoda." },
    { id: "meridian-grand", name: "The Meridian Grand", dest: "italy", area: "Centro Storico, Rome", stars: 5, rating: 4.8, reviews: 427, price: 340, img: "h-grand.jpg", alt: "A grand hotel entrance hall with marble and arched doors", amen: ["breakfast", "spa", "gym", "restaurant", "wifi"], blurb: "A restored palazzo with marble halls, ten minutes on foot from the Pantheon." },
  ],
  rooms: [
    { id: "deluxe", name: "Deluxe Room", mult: 1, sleeps: 2, size: "32 m²", bed: "King or twin beds", img: "r-deluxe.jpg", perks: ["Free cancellation", "Pay at the property"] },
    { id: "suite", name: "Junior Suite", mult: 1.45, sleeps: 3, size: "48 m²", bed: "King bed + sofa bed", img: "r-suite.jpg", perks: ["Free cancellation", "Late checkout", "Welcome drink"] },
    { id: "premier", name: "Premier Suite", mult: 2.1, sleeps: 4, size: "74 m²", bed: "King bed + lounge", img: "r-premier.jpg", perks: ["Free cancellation", "Airport transfer", "Daily breakfast for all"] },
  ],

  /* ---- Cars (price = per day) --------------------------------------------- */
  carTypes: [
    { id: "economy", name: "Economy" },
    { id: "sedan", name: "Saloon" },
    { id: "suv", name: "SUV" },
    { id: "4x4", name: "4x4" },
    { id: "electric", name: "Electric" },
    { id: "luxury", name: "Luxury" },
    { id: "camper", name: "Camper" },
  ],
  cars: [
    { id: "fiat-500", name: "Fiat 500", cls: "Economy", type: "economy", seats: 4, bags: 1, gear: "Manual", fuel: "Petrol", price: 34, img: "c-fiat.jpg", alt: "A pale blue Fiat 500 parked in front of a stone house", badge: "City favourite" },
    { id: "vw-polo", name: "VW Polo", cls: "Compact", type: "economy", seats: 5, bags: 2, gear: "Manual", fuel: "Petrol", price: 42, img: "c-polo.jpg", alt: "A blue Volkswagen hatchback" },
    { id: "camry", name: "Toyota Camry", cls: "Saloon", type: "sedan", seats: 5, bags: 3, gear: "Automatic", fuel: "Hybrid", price: 58, img: "c-camry.jpg", alt: "A grey Toyota saloon" },
    { id: "tesla-3", name: "Tesla Model 3", cls: "Electric saloon", type: "electric", seats: 5, bags: 2, gear: "Automatic", fuel: "Electric", price: 79, img: "c-tesla.jpg", alt: "A white Tesla on a coastal road", badge: "Zero emissions" },
    { id: "cr-v", name: "Honda CR-V", cls: "SUV · AWD", type: "suv", seats: 5, bags: 4, gear: "Automatic", fuel: "Petrol", price: 72, img: "c-crv.jpg", alt: "A white SUV on a wet road below snowy mountains", badge: "Most booked" },
    { id: "wrangler", name: "Jeep Wrangler", cls: "4x4", type: "4x4", seats: 5, bags: 3, gear: "Automatic", fuel: "Petrol", price: 96, img: "c-wrangler.jpg", alt: "A black Jeep Wrangler in desert hills at dusk" },
    { id: "expedition", name: "Ford Expedition", cls: "7-seat SUV", type: "suv", seats: 7, bags: 5, gear: "Automatic", fuel: "Petrol", price: 118, img: "c-expedition.jpg", alt: "A large white SUV on a road through red rock desert", badge: "Family size" },
    { id: "bmw-5", name: "BMW 5 Series", cls: "Premium saloon", type: "luxury", seats: 5, bags: 3, gear: "Automatic", fuel: "Petrol", price: 139, img: "c-bmw.jpg", alt: "A pale grey BMW saloon on a palm-lined street" },
    { id: "range-rover", name: "Range Rover Sport", cls: "Luxury SUV", type: "luxury", seats: 5, bags: 4, gear: "Automatic", fuel: "Hybrid", price: 189, img: "c-range.jpg", alt: "A black Range Rover in front of a dark garage door" },
    { id: "amg-gt", name: "Mercedes-AMG GT", cls: "Sports coupé", type: "luxury", seats: 2, bags: 1, gear: "Automatic", fuel: "Petrol", price: 320, img: "c-amg.jpg", alt: "A yellow Mercedes sports coupé on an open road", badge: "For the coast road" },
    { id: "vw-camper", name: "Classic VW Camper", cls: "Campervan · sleeps 2", type: "camper", seats: 4, bags: 4, gear: "Manual", fuel: "Petrol", price: 128, img: "c-camper.jpg", alt: "A cream vintage camper van with its roof popped by the sea", badge: "Sleeps 2" },
  ],
  carExtras: [
    { id: "cover", name: "Full protection", note: "Zero excess, tyres & glass", price: 19, icon: "shield-check" },
    { id: "gps", name: "GPS navigation", note: "Offline maps included", price: 6, icon: "navigation" },
    { id: "seat", name: "Child seat", note: "Fitted before pick-up", price: 8, icon: "baby" },
    { id: "driver2", name: "Additional driver", note: "Share the driving", price: 9, icon: "users" },
    { id: "chauffeur", name: "Private chauffeur", note: "Local driver, 10 hours a day", price: 95, icon: "key" },
  ],
  pickups: ["Zurich Airport", "Reykjavík Keflavík Airport", "Denpasar, Bali", "Marrakech Menara Airport", "Calgary Airport", "Athens Airport", "Rome Fiumicino Airport", "Phuket Airport", "Las Vegas Airport", "Queenstown Airport"],

  /* ---- Trip builder ------------------------------------------------------- */
  tiers: [
    { id: "comfort", name: "Comfort", note: "Hand-picked 3–4★ stays" },
    { id: "premium", name: "Premium", note: "Characterful 4–5★ stays" },
    { id: "luxury", name: "Luxury", note: "The best address in town" },
  ],
  paces: [
    { id: "relaxed", name: "Relaxed", note: "One thing a day", per: 1 },
    { id: "balanced", name: "Balanced", note: "Mornings out, afternoons free", per: 2 },
    { id: "packed", name: "Packed", note: "See as much as possible", per: 3 },
  ],
  transports: [
    { id: "driver", name: "Private driver", note: "Door to door, local knowledge", perDay: 140, icon: "key" },
    { id: "self", name: "Self-drive", note: "A car from our fleet", perDay: 0, icon: "car" },
    { id: "transfers", name: "Trains & transfers", note: "Tickets and pick-ups arranged", perDay: 60, icon: "train-front" },
  ],

  /* ---- Showcase clips: assets/video/<file>.mp4 + <file>.jpg poster -------- */
  reel: [
    { file: "reel-peaks", title: "High Alps", sub: "Above the cloud line", caption: "Ridge walks and cable cars to places where the only sound is your own boots." },
    { file: "reel-island", title: "Coral atolls", sub: "Lagoons like glass", caption: "Barefoot islands where the day's biggest decision is snorkel or hammock." },
    { file: "reel-bay", title: "Emerald bays", sub: "Karsts and junk boats", caption: "Drift between limestone islands and wake up somewhere with no roads at all." },
    { file: "reel-road", title: "Open roads", sub: "Your own schedule", caption: "Pick up the keys, pick a direction and stop wherever looks good." },
  ],

  /* ---- Reviews (sample content — replace with real ones) ------------------ */
  reviews: [
    { name: "Emma L.", trip: "Swiss Alps by Rail & Trail", stars: 5, text: "Every train connected, every hotel had a view, and our bags were always there before us. Effortless." },
    { name: "Rahul M.", trip: "Custom trip · Bali", stars: 5, text: "I built the trip myself on a Sunday night and had a real itinerary by Monday lunch. Nothing felt templated." },
    { name: "Chloé B.", trip: "Santorini & the Cyclades", stars: 5, text: "The catamaran sunset alone was worth it. Our guide knew every quiet corner the cruise crowds never find." },
    { name: "Daniel K.", trip: "Iceland Ring Road Explorer", stars: 5, text: "Ten days, zero stress. The pacing was perfect and there was a hot pool at the end of nearly every day." },
    { name: "Aiko T.", trip: "Japan Golden Route", stars: 5, text: "Fushimi Inari at dawn with nobody there. I still think about it. Worth every early alarm." },
    { name: "Sofia R.", trip: "Car hire · Canadian Rockies", stars: 5, text: "Picked up an SUV in Calgary in ten minutes flat. Clear price, no upsell at the desk, spotless car." },
    { name: "James O.", trip: "Kenya Classic Safari", stars: 5, text: "A window seat for everyone and a guide who could spot a leopard at half a mile. Unreal." },
    { name: "Leila N.", trip: "Morocco: Marrakech to the Sahara", stars: 5, text: "The desert camp was the highlight of my year. Small group, great people, and nothing felt rushed." },
    { name: "Marco P.", trip: "Hotel · Maldives", stars: 4, text: "The villa was exactly like the photos. Booking, seaplane and transfers all handled in one message." },
    { name: "Hannah W.", trip: "Patagonia W Trek", stars: 5, text: "Tough days, hot showers and the best guides I've walked with. The towers at sunrise made me cry." },
  ],

  /* ---- FAQs --------------------------------------------------------------- */
  faqs: [
    { q: "What is included in a tour price?", a: "Accommodation, the listed activities and entrance fees, transport between stops, an English-speaking guide and most breakfasts. International flights, visas and personal spending are not included unless the tour page says so." },
    { q: "Can I change a tour to suit me?", a: "Yes. Any tour can be shortened, extended or upgraded, and the trip builder lets you design one from scratch. Save your plan and a travel designer will refine it and send a firm quote within one working day." },
    { q: "How do payments and deposits work?", a: "Reserve with a 20% deposit and pay the balance 45 days before departure. Hotels and cars are usually pay-on-arrival with free cancellation. We accept cards, bank transfer and most mobile wallets." },
    { q: "What if I need to cancel?", a: "Tours can be cancelled for a full refund up to 45 days before departure, and for travel credit after that. Hotels and cars are free to cancel until 48 hours before check-in or pick-up." },
    { q: "Do you arrange visas and travel insurance?", a: "We tell you exactly what each destination requires and can add travel protection to any booking. Visa applications are made by the traveller, but we provide every supporting document you need." },
    { q: "How big are the groups?", a: "Small. Most departures are capped at 10 to 14 travellers, and safaris at six per vehicle. Every tour can also be booked as a private departure for your own party." },
    { q: "Is there support while I'm travelling?", a: "Always. You get a local contact in every destination and a 24/7 line on WhatsApp, so a missed connection or a change of plan is one message away from fixed." },
  ],

  highlights: ["Small groups, max 14", "Local guides everywhere", "Free cancellation on stays", "24/7 help on WhatsApp", "No hidden fees", "Carbon-balanced trips", "Private departures", "Pay in instalments"],
};

/* --------------------------------------------------------------------------
   URL overrides + early theme. Values from the URL are treated as untrusted:
   markup characters are stripped and lengths are capped.
   -------------------------------------------------------------------------- */
(function () {
  var T = window.TRAVEL;
  try {
    var p = new URLSearchParams(location.search);
    var clean = function (v, max) {
      return String(v).replace(/[<>&"'`\\]/g, "").trim().slice(0, max);
    };
    if (p.get("name")) T.name = clean(p.get("name"), 40) || T.name;
    if (p.get("hue") !== null && p.get("hue") !== "" && !isNaN(+p.get("hue"))) T.hue = Math.min(360, Math.max(0, +p.get("hue")));
    if (p.get("wa")) {
      var digits = p.get("wa").replace(/\D/g, "").slice(0, 15);
      if (digits.length >= 7) T.whatsapp = digits;
    }
    if (p.get("phone")) T.phone = clean(p.get("phone"), 24).replace(/[^\d+()\-.\s]/g, "") || T.phone;
    if (p.get("currency")) T.currency = clean(p.get("currency"), 4) || T.currency;
  } catch (e) {
    /* ignore malformed query strings */
  }
  document.documentElement.style.setProperty("--h", T.hue);
  document.documentElement.classList.add("js");
})();
