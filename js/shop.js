/* SMARAGD — shop logic shared by every page.
   - product data (concept: TODO replace with real assortment, prices, stones and certificates)
   - basket & favourites, kept in localStorage
   - shared header / footer for inner pages
   - page controllers, picked by <body data-page="…"> */
(() => {
  'use strict';

  /* ---------- catalogue ---------- */
  const CATS = {
    rings: 'Rings', earrings: 'Earrings', necklaces: 'Necklaces & Pendants', bracelets: 'Bracelets', brooches: 'Brooches',
  };
  // pieces at or above this price show "Price on request" and are sold through a private viewing only
  const ON_REQUEST = 10000;   // pieces from $10,000 show "Price on request"

  const CARE = 'Store each piece separately in its SMARAGD case so the diamonds do not scratch the gold. Emeralds are traditionally oiled: avoid ultrasonic cleaners, steam, heat and household chemicals. Wipe with a soft dry cloth and bring the piece to us once a year for a complimentary check of the settings.';
  const Y = '18k yellow gold (750)';

  // TODO: concept data — replace with the real assortment, prices, stock, stone parameters and certificates
  // emerald: { ct, shape, origin } or null (diamond pieces)  ·  diamonds: { count, ct, clarity, color } or null
  const PRODUCTS = [
    { id: 'halo-ring', name: 'Emerald Halo Ring', cat: 'rings', price: 4800, left: 1, sizes: ['15', '16', '17', '18', '19'],
      imgs: ['img/products/halo-ring-light.jpg', 'img/products/halo-ring-2-light.jpg', 'img/products/halo-ring-detail-light.jpg', 'img/products/worn-halo-ring.jpg'], metal: Y,
      emerald: { ct: 4.12, shape: 'Emerald cut', origin: 'Colombia, Muzo' }, diamonds: { count: 32, ct: 0.64, clarity: 'VVS2', color: 'F' },
      cert: 'GRS emerald report, GIA diamond grading', size: 'Centre stone 11.8 × 9.6 mm',
      desc: 'A Colombian emerald of deep, velvety green framed by a single row of brilliant diamonds. The basket is open at the sides so light can reach the stone from every angle.' },
    { id: 'toi-et-moi-ring', name: 'Toi et Moi Ring', cat: 'rings', price: 2900, left: 2, sizes: ['15', '16', '17', '18', '19'],
      imgs: ['img/products/toi-et-moi-ring-light.jpg', 'img/products/toi-et-moi-ring-detail-light.jpg', 'img/products/worn-toi-et-moi.jpg'], metal: Y,
      emerald: { ct: 1.35, shape: 'Pear', origin: 'Zambia' }, diamonds: { count: 1, ct: 1.02, clarity: 'VS1', color: 'E' },
      cert: 'GRS emerald report, GIA diamond grading', size: 'Each stone approx. 8 × 6 mm',
      desc: 'Two pears meeting in the middle of a fine gold band: an emerald and a diamond of nearly the same weight. A ring for two people, or for two sides of one.' },
    { id: 'eternity-band', name: 'Channel Band', cat: 'rings', price: 2400, left: 3, sizes: ['15', '16', '17', '18', '19'],
      imgs: ['img/products/eternity-band-light.jpg', 'img/products/eternity-band-detail-light.jpg'], metal: Y,
      emerald: { ct: 1.80, shape: 'Carré, 10 stones', origin: 'Colombia' }, diamonds: { count: 10, ct: 1.10, clarity: 'VS1', color: 'F' },
      cert: 'SMARAGD certificate of authenticity', size: 'Band width 3.4 mm',
      desc: 'Square emeralds and diamonds alternate all the way around, held flush in a gold channel. Smooth to the touch and made to be worn every day, alone or stacked.' },
    { id: 'bezel-diamond-ring', name: 'Bezel Ring', cat: 'rings', price: 3900, left: 1, sizes: ['15', '16', '17', '18', '19'],
      imgs: ['img/products/bezel-diamond-ring-light.jpg'], metal: Y,
      emerald: null, diamonds: { count: 1, ct: 1.50, clarity: 'VS1', color: 'F' },
      cert: 'GIA diamond grading', size: 'Centre stone Ø 7.4 mm, band of three wires',
      desc: 'A round brilliant diamond sunk into a smooth gold bezel, on three fine gold wires that read as one wide band. Our first piece without an emerald: the same quiet setting, white fire instead of green.' },
    { id: 'solitaire-bridal-set', name: 'Solitaire Bridal Set', cat: 'rings', price: 3600, left: 2, sizes: ['15', '16', '17', '18', '19'],
      imgs: ['img/products/solitaire-bridal-set-light.jpg', 'img/products/solitaire-bridal-set-2-light.jpg', 'img/products/solitaire-bridal-set-detail-light.jpg'], metal: Y,
      emerald: null, diamonds: { count: 34, ct: 1.40, clarity: 'VS1', color: 'F' },
      cert: 'GIA diamond grading', size: 'Centre stone Ø 6.5 mm, two stacking bands',
      desc: 'A round brilliant in four claws with a hidden halo under the stone, paired with a plain gold band and a half-eternity band of small diamonds. Worn together or one at a time.' },
    { id: 'mixed-eternity-ring', name: 'Duet Band', cat: 'rings', price: 2600, left: 2, sizes: ['15', '16', '17', '18', '19'],
      imgs: ['img/products/mixed-eternity-ring-light.jpg', 'img/products/mixed-eternity-ring-detail-light.jpg', 'img/products/worn-mixed-set.jpg'], metal: Y,
      emerald: { ct: 1.40, shape: 'Round, 9 stones', origin: 'Zambia' }, diamonds: { count: 9, ct: 0.90, clarity: 'VS1', color: 'F' },
      cert: 'SMARAGD certificate of authenticity', size: 'Each stone Ø 3 mm',
      desc: 'Round emeralds and diamonds take turns all the way around a slim gold band. Pairs with the matching hoops.' },

    { id: 'solitaire-studs', name: 'Emerald Studs', cat: 'earrings', price: 1900, left: 3,
      imgs: ['img/products/solitaire-studs-light.jpg'], metal: Y,
      emerald: { ct: 3.20, shape: 'Round brilliant, pair', origin: 'Zambia' }, diamonds: null,
      cert: 'GRS emerald report', size: 'Each stone Ø 8.5 mm',
      desc: 'A matched pair of round emeralds in four slender claws. Nothing around them, so all that is left is colour.' },
    { id: 'pear-drops', name: 'Pear Toi et Moi Drops', cat: 'earrings', price: 2700, left: 2,
      imgs: ['img/products/pear-drops-light.jpg'], metal: Y,
      emerald: { ct: 2.10, shape: 'Pear, pair', origin: 'Zambia' }, diamonds: { count: 2, ct: 1.60, clarity: 'VS1', color: 'F' },
      cert: 'GRS emerald report, GIA diamond grading', size: 'Drop 24 mm',
      desc: 'An emerald pear and a diamond pear on each ear, turned towards each other like a conversation.' },
    { id: 'pear-huggies', name: 'Pear Drop Huggies', cat: 'earrings', price: 1200, left: 4,
      imgs: ['img/products/pear-huggies-light.jpg', 'img/products/worn-pear-set.jpg'], metal: Y,
      emerald: { ct: 1.20, shape: 'Pear, pair', origin: 'Zambia' }, diamonds: { count: 36, ct: 0.22, clarity: 'VS2', color: 'G' },
      cert: 'SMARAGD certificate of authenticity', size: 'Drop 22 mm',
      desc: 'Small diamond hoops with a pear emerald that swings free. The easiest way to wear an emerald from morning to night.' },
    { id: 'diamond-bezel-studs', name: 'Bezel Studs', cat: 'earrings', price: 1300, left: 4,
      imgs: ['img/products/diamond-bezel-studs-light.jpg', 'img/products/diamond-bezel-studs-detail-light.jpg', 'img/products/diamond-bezel-set-travertine.jpg'], metal: Y,
      emerald: null, diamonds: { count: 2, ct: 0.80, clarity: 'VS1', color: 'F' },
      cert: 'GIA diamond grading', size: 'Each stone Ø 4.8 mm',
      desc: 'Two round brilliants in smooth gold bezels, close to the ear. Made as a pair with the bezel pendant.' },
    { id: 'mixed-hoops', name: 'Duet Hoops', cat: 'earrings', price: 2200, left: 2,
      imgs: ['img/products/mixed-hoops-light.jpg', 'img/products/mixed-hoops-2-light.jpg', 'img/products/worn-mixed-set.jpg'], metal: Y,
      emerald: { ct: 1.10, shape: 'Round, 12 stones', origin: 'Zambia' }, diamonds: { count: 12, ct: 0.70, clarity: 'VS1', color: 'F' },
      cert: 'SMARAGD certificate of authenticity', size: 'Hoop Ø 18 mm',
      desc: 'Hoops set all round with emeralds and diamonds in turn, so they sparkle from the front and from the side. Made as a pair with the eternity ring.' },

    { id: 'emerald-cut-pendant', name: 'Emerald-Cut Pendant', cat: 'necklaces', price: 1900, left: 2,
      imgs: ['img/products/emerald-cut-pendant-light.jpg', 'img/products/emerald-cut-pendant-detail-light.jpg'], metal: Y,
      emerald: { ct: 2.45, shape: 'Emerald cut', origin: 'Colombia' }, diamonds: null,
      cert: 'GRS emerald report', size: 'Chain 42 cm with a ring at 40 cm',
      desc: 'A single emerald-cut stone set east to west on a fine gold chain. Quiet enough for the day, deep enough for the evening.' },
    { id: 'pear-pendant', name: 'Pear Drop Pendant', cat: 'necklaces', price: 980, left: 4,
      imgs: ['img/products/pear-pendant-light.jpg', 'img/products/worn-pear-set.jpg'], metal: Y,
      emerald: { ct: 1.15, shape: 'Pear', origin: 'Zambia' }, diamonds: null,
      cert: 'SMARAGD certificate of authenticity', size: 'Chain 45 cm',
      desc: 'A pear emerald on a gold chain, the first SMARAGD piece for many of our clients.' },
    { id: 'diamond-bezel-pendant', name: 'Bezel Pendant', cat: 'necklaces', price: 1150, left: 4,
      imgs: ['img/products/diamond-bezel-pendant-light.jpg', 'img/products/diamond-bezel-pendant-2-light.jpg', 'img/products/diamond-bezel-pendant-detail-light.jpg', 'img/products/diamond-bezel-pendant-travertine.jpg'], metal: Y,
      emerald: null, diamonds: { count: 1, ct: 0.50, clarity: 'VS1', color: 'F' },
      cert: 'GIA diamond grading', size: 'Stone Ø 5.1 mm, chain 42 cm with a ring at 40 cm',
      desc: 'A single round diamond in a smooth gold bezel on a fine cable chain. Pairs with the bezel studs.' },
    { id: 'lariat', name: 'Emerald Lariat', cat: 'necklaces', price: 1450, left: 3,
      imgs: ['img/products/lariat-light.jpg', 'img/products/lariat-detail-light.jpg', 'img/products/worn-lariat.jpg'], metal: Y,
      emerald: { ct: 1.40, shape: 'Carré, 2 stones', origin: 'Colombia' }, diamonds: { count: 48, ct: 0.30, clarity: 'VS2', color: 'G' },
      cert: 'SMARAGD certificate of authenticity', size: 'Length 42 cm + 9 cm drop',
      desc: 'A Y-shaped lariat with a carré emerald at the throat and a second one at the end of a diamond-set drop. Best worn with an open collar.' },

    { id: 'emerald-station-bracelet', name: 'Station Bracelet', cat: 'bracelets', price: 1650, left: 3,
      imgs: ['img/products/emerald-station-bracelet-light.jpg', 'img/products/emerald-station-bracelet-detail-light.jpg', 'img/products/worn-evening-set.jpg'], metal: Y,
      emerald: { ct: 0.90, shape: 'Round, 7 stones', origin: 'Zambia' }, diamonds: { count: 6, ct: 0.12, clarity: 'VS2', color: 'G' },
      cert: 'SMARAGD certificate of authenticity', size: 'Length 16–18 cm, adjustable',
      desc: 'Seven small emeralds in round bezels spaced along a fine gold chain, with a tiny diamond between each. Light enough to forget you are wearing it.' },
    { id: 'emerald-tennis-bracelet', name: 'Emerald Tennis', cat: 'bracelets', price: 7400, left: 1, sizes: ['S', 'M', 'L'],
      imgs: ['img/products/emerald-tennis-bracelet-light.jpg', 'img/products/emerald-tennis-bracelet-detail-light.jpg'], metal: Y,
      emerald: { ct: 6.80, shape: 'Round, 42 stones', origin: 'Colombia' }, diamonds: null,
      cert: 'GRS emerald report', size: 'Length 17 cm (M), box clasp with safety catch',
      desc: 'A full line of matched round emeralds, each in its own four-claw basket. Forty-two stones of the same green, sorted by eye over a whole season.' },
    { id: 'diamond-tennis-bracelet', name: 'Diamond Tennis', cat: 'bracelets', price: 6800, left: 2, sizes: ['S', 'M', 'L'],
      imgs: ['img/products/diamond-tennis-bracelet-light.jpg', 'img/products/diamond-tennis-bracelet-detail-light.jpg'], metal: Y,
      emerald: null, diamonds: { count: 38, ct: 5.20, clarity: 'VS1', color: 'F' },
      cert: 'GIA diamond grading', size: 'Length 17 cm (M), box clasp with safety catch',
      desc: 'Round brilliants in four claws, linked so the line moves like fabric. The white companion to our emerald tennis bracelet.' },
    { id: 'diamond-nail-cuff', name: 'Diamond Nail Cuff', cat: 'bracelets', price: 3400, left: 2, sizes: ['S', 'M', 'L'],
      imgs: ['img/products/diamond-nail-cuff-light.jpg', 'img/products/diamond-nail-cuff-detail-light.jpg', 'img/products/worn-diamond-nail-cuff.jpg'], metal: Y,
      emerald: null, diamonds: { count: 62, ct: 0.48, clarity: 'VS2', color: 'G' },
      cert: 'GIA diamond grading', size: 'Open cuff, inner diameter 58 mm (M)',
      desc: 'A gold nail bent around the wrist, its head and point set with pavé diamonds.' },
    { id: 'emerald-nail-cuff', name: 'Emerald Nail Cuff', cat: 'bracelets', price: 3700, left: 2, sizes: ['S', 'M', 'L'],
      imgs: ['img/products/emerald-nail-cuff-light.jpg', 'img/products/emerald-nail-cuff-detail-light.jpg'], metal: Y,
      emerald: { ct: 0.85, shape: 'Round pavé, 62 stones', origin: 'Zambia' }, diamonds: null,
      cert: 'SMARAGD certificate of authenticity', size: 'Open cuff, inner diameter 58 mm (M)',
      desc: 'The same gold nail, with its head and point paved in tiny emeralds instead of diamonds.' },
    { id: 'pear-chain-bracelet', name: 'Pear Chain Bracelet', cat: 'bracelets', price: 690, left: 6,
      imgs: ['img/products/pear-chain-bracelet-light.jpg'], metal: Y,
      emerald: { ct: 0.45, shape: 'Pear', origin: 'Zambia' }, diamonds: null,
      cert: 'SMARAGD certificate of authenticity', size: 'Length 16–18 cm, adjustable',
      desc: 'A fine cable chain with one small pear emerald. Made to stay on.' },
    { id: 'pave-cable-cuff', name: 'Pavé Cable Cuff', cat: 'bracelets', price: 4200, left: 2, sizes: ['S', 'M', 'L'],
      imgs: ['img/products/pave-cable-cuff-light.jpg', 'img/products/pave-cable-cuff-2-light.jpg', 'img/products/pave-cable-cuff-detail-light.jpg', 'img/products/worn-pave-cuff.jpg'], metal: Y,
      emerald: null, diamonds: { count: 280, ct: 2.40, clarity: 'VS1', color: 'F' },
      cert: 'GIA diamond grading', size: 'Open cuff, inner diameter 58 mm (M)',
      desc: 'A twisted gold cable that opens at the wrist, finished with two spheres of pavé diamonds. Slips on from the side and keeps its shape.' },
  ];
  const byId = id => PRODUCTS.find(p => p.id === id);
  const money = n => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const onRequest = p => p.price >= ON_REQUEST;
  const priceLabel = p => (onRequest(p) ? 'Price on request' : money(p.price));
  const viewingUrl = p => `contact.html?topic=viewing&piece=${p.id}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- storage (basket & favourites) ---------- */
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  // pieces on request never sit in the basket: they have no price to pay online
  // stock: the edition size minus what was ordered on this device (concept: TODO real stock from the shop backend)
  let sold = read('smaragd-sold', {});                      // { id: qty }
  const stock = p => Math.max(0, p.left - (sold[p.id] || 0));
  const inCart = id => cart.filter(l => l.id === id).reduce((n, l) => n + l.qty, 0);
  // the basket never holds more of a piece than there is, across all its sizes
  const cleanCart = list => {
    const out = [];
    list.forEach(l => {
      const p = byId(l.id);
      if (!p || onRequest(p)) return;
      const room = stock(p) - out.filter(o => o.id === l.id).reduce((n, o) => n + o.qty, 0);
      if (room > 0) out.push({ ...l, qty: Math.min(l.qty, room) });
    });
    return out;
  };
  let cart = cleanCart(read('smaragd-cart', []));          // [{ id, size, qty }]
  let favs = read('smaragd-favs', []).filter(byId);         // [id]

  const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = () => cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
  function saveCart() { write('smaragd-cart', cart); updateCounters(); }
  function saveFavs() { write('smaragd-favs', favs); updateCounters(); }
  // returns how many were actually added (0 when the whole edition is already in the basket)
  function addToCart(id, size, qty) {
    const add = Math.min(qty, stock(byId(id)) - inCart(id));
    if (add <= 0) return 0;
    const line = cart.find(l => l.id === id && l.size === size);
    if (line) line.qty += add; else cart.push({ id, size, qty: add });
    saveCart();
    return add;
  }
  function toggleFav(id) {
    favs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    saveFavs();
    return favs.includes(id);
  }
  // replays a short CSS animation on an element (the number pops, the button nudges…)
  const flash = (el, cls = 'bump') => { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  function updateCounters() {
    // the counters in the header pop whenever their number changes
    const set = (sel, n) => document.querySelectorAll(sel).forEach(el => {
      if (el.textContent !== '' && el.textContent !== String(n)) flash(el);
      el.textContent = n;
    });
    set('[data-cart-count]', cartCount());
    set('[data-fav-count]', favs.length);
    document.querySelectorAll('.fav[data-fav]').forEach(b => {
      const on = favs.includes(b.dataset.fav);
      b.setAttribute('aria-pressed', on); b.textContent = on ? '♥' : '♡';
      b.setAttribute('aria-label', on ? 'Remove from favourites' : 'Add to favourites');
    });
  }

  // heart buttons inside product cards (event delegation, works for any rendered card)
  document.addEventListener('click', e => {
    const b = e.target.closest('.fav[data-fav]');
    if (!b) return;
    e.preventDefault();
    toggleFav(b.dataset.fav);
    flash(b, 'pop');
    if (document.body.dataset.page === 'favourites') pages.favourites();
  });

  /* ---------- shared pieces ---------- */
  // cut-outs on a transparent backdrop are shown whole instead of cropped to fill the tile
  const fit = p => (p.contain ? ' class="contain"' : '');
  // product photos are used exactly as delivered (already sized and compressed): one file, no smaller copies
  const small = src => src;
  const pic = src => `src="${src}"`;
  const CARD_SIZES = '(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw';
  const leftLabel = p => (!stock(p) ? 'sold' : stock(p) === 1 ? 'one left' : `${stock(p)} left`);
  // the same count on the product page, in the house's words
  const stockLine = p => (!stock(p) ? 'Sold · can be made again to order in our atelier'
    : p.left === 1 ? 'One of a kind' : stock(p) === 1 ? 'The last one of the edition' : `Edition of ${stock(p)} remaining`);
  // the photo a card fades to on hover (desktop): the macro shot of the same piece (a "-detail" file);
  // pieces without one keep the slow zoom instead
  const hoverImg = p => p.imgs.slice(1).find(s => /-detail/.test(s));
  const altPic = (p, sizes) => (hoverImg(p) ? `<img class="alt" ${pic(hoverImg(p), sizes)} alt="" loading="lazy" decoding="async">` : '');
  const card = p => `
    <a class="pcard${hoverImg(p) ? ' has-alt' : ''}" href="product.html?id=${p.id}">
      <button class="fav" type="button" data-fav="${p.id}" aria-pressed="false" aria-label="Add to favourites">♡</button>
      <div class="ph"><img ${pic(p.imgs[0], CARD_SIZES)}${fit(p)} alt="${esc(p.name)}" loading="lazy" decoding="async">${altPic(p, CARD_SIZES)}</div>
      <div class="cap">
        <span class="cat">${CATS[p.cat]}</span>
        <span class="name">${esc(p.name)}</span>
        <span class="price">${priceLabel(p)}<span class="left">· ${leftLabel(p)}</span></span>
      </div>
    </a>`;

  // the footer, the same on every page as on the home: a call to subscribe, the house + four link columns, a legal row,
  // and the wordmark from edge to edge with its foot cut off
  const footerHtml = `
      <div class="wrap">
        <!-- the call to subscribe in the section-title face, the field on the right guide -->
        <div class="f-top g12">
          <h2 class="f-cta">Be the first to see new stones <em>and private viewings.</em></h2>
          <div class="f-news">
            <!-- TODO: connect to a mailing service -->
            <form class="news-form" action="#" novalidate>
              <input id="f-email" type="email" aria-label="Email" name="email" placeholder="Your email address" required>
              <button type="submit">Subscribe</button>
            </form>
            <p class="f-msg" aria-live="polite"></p>
          </div>
        </div>
    
        <!-- the house in a few words, then four link columns -->
        <div class="f-mid g12">
          <div class="f-brand">
            <p class="f-logo">SMARAGD</p>
            <p class="f-about">A Kyiv house of emerald jewelry. Every stone chosen by eye, every piece set by hand in 18k gold.</p>
          </div>
          <nav class="f-col f-shop" aria-label="Shop">
            <h4>Shop</h4>
            <ul>
              <li><a href="catalog.html?cat=rings">Rings</a></li>
              <li><a href="catalog.html?cat=earrings">Earrings</a></li>
              <li><a href="catalog.html?cat=necklaces">Necklaces &amp; Pendants</a></li>
              <li><a href="catalog.html?cat=bracelets">Bracelets</a></li>
              <li><a href="catalog.html">All pieces</a></li>
            </ul>
          </nav>
          <nav class="f-col f-house" aria-label="About">
            <h4>About</h4>
            <ul>
              <li><a href="about.html">Our story</a></li>
              <li><a href="index.html#atelier">Craftsmanship</a></li>
              <li><a href="index.html#bestsellers">Bestsellers</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </nav>
          <nav class="f-col f-care" aria-label="Client care">
            <h4>Client care</h4>
            <ul>
              <li><a href="customers.html">Shipping &amp; Returns</a></li>
              <li><a href="customers.html">Ring Size Guide</a></li>
              <li><a href="customers.html">Jewelry Care</a></li>
              <li><a href="contact.html?topic=viewing">Private Viewing</a></li>
            </ul>
          </nav>
          <div class="f-col f-social">
            <h4>Social media</h4>
            <!-- TODO: real social links and contacts -->
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Pinterest</a></li>
              <li><a href="tel:+380443371852">+380 44 337 18 52</a></li>
              <li><a href="mailto:salon@smaragd.jewelry">salon@smaragd.jewelry</a></li>
            </ul>
          </div>
        </div>
    
        <div class="f-bottom">
          <p>Est. 2014 · Kyiv</p>
          <p>© 2026 Smaragd. All rights reserved.</p>
          <p class="f-legal"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Service</a></p>
        </div>
      </div>
      <!-- the wordmark from edge to edge, its foot cut off by the bottom of the page — as on the first screen -->
      <div class="f-mark" aria-hidden="true"><span>SMARAGD</span></div>`;

  function header() {
    const el = document.getElementById('hdr');
    if (!el) return;
    const here = location.pathname.split('/').pop() || 'index.html';
    const cur = f => (here === f ? ' aria-current="page"' : '');
    el.className = 'hdr';
    el.innerHTML = `
      <div class="wrap hdr-in">
        <nav class="hdr-nav" aria-label="Main">
          <a href="catalog.html"${cur('catalog.html')}>Catalog</a>
          <a href="about.html"${cur('about.html')}>About us</a>
          <a href="customers.html"${cur('customers.html')}>To customers</a>
          <a href="contact.html"${cur('contact.html')}>Contact</a>
        </nav>
        <button class="hdr-burger" type="button" aria-expanded="false">Menu</button>
        <a class="hdr-logo" href="index.html">SMARAGD</a>
        <div class="hdr-tools">
          <a class="hide-sm" href="catalog.html#search">Search</a>
          <a class="hide-sm" href="favourites.html"${cur('favourites.html')}>Favourites (<span data-fav-count>0</span>)</a>
          <a class="keep" href="cart.html"${cur('cart.html')}>Basket (<span data-cart-count>0</span>)</a>
        </div>
      </div>
      <nav class="hdr-menu" aria-label="Mobile">
        <div class="mm-links">
          <a href="catalog.html">Catalog</a>
          <a href="about.html">About us</a>
          <a href="customers.html">To customers</a>
          <a href="contact.html">Contact</a>
          <a href="favourites.html">Favourites (<span data-fav-count>0</span>)</a>
          <a href="catalog.html#search">Search</a>
        </div>
        <div class="mm-foot">
          <a class="mm-cta" href="contact.html?topic=viewing">Book a private viewing</a>
          <div class="mm-contacts">
            <a href="tel:+380443371852">+380 44 337 18 52</a>
            <a href="mailto:salon@smaragd.jewelry">salon@smaragd.jewelry</a>
          </div>
          <p class="mm-small"><a href="#">Instagram</a> · <a href="#">Telegram</a><br>17 Velyka Zhytomyrska St, Kyiv</p>
        </div>
      </nav>`;
    const burger = el.querySelector('.hdr-burger');
    const setMenu = open => {
      el.classList.toggle('open', open);
      document.documentElement.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.textContent = open ? 'Close' : 'Menu';
    };
    burger.addEventListener('click', () => setMenu(!el.classList.contains('open')));
    addEventListener('keydown', e => { if (e.key === 'Escape' && el.classList.contains('open')) setMenu(false); });
  }

  function footer() {
    const el = document.getElementById('ftr');
    if (!el) return;
    el.className = 'site-footer';
    el.id = 'contact-footer';
    el.innerHTML = footerHtml;
    // newsletter (no backend yet)
    const form = el.querySelector('.news-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input'), msg = el.querySelector('.f-msg');
      if (!input.value || !input.checkValidity()) { input.focus(); msg.textContent = 'Please enter a valid email.'; return; }
      msg.textContent = 'Thank you. We will write when something rare arrives.'; input.value = '';
    });
    // the wordmark: the ink of the letters from edge to edge, a fifth of the capitals cut off (the same cut as the first screen)
    const mark = el.querySelector('.f-mark'), span = mark.firstElementChild;
    const ctx = document.createElement('canvas').getContext('2d');
    const fit = () => {
      const W = mark.clientWidth;
      if (!W) return;
      const cs = getComputedStyle(span);
      ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '-2px';   // = -.02em at 100px
      const m = ctx.measureText(span.textContent);
      const inkL = -m.actualBoundingBoxLeft, ink = m.actualBoundingBoxRight - inkL;
      if (!(ink > 0)) return;
      const k = W / ink, fa = m.fontBoundingBoxAscent || 92, fd = m.fontBoundingBoxDescent || 29;
      mark.style.fontSize = 100 * k + 'px';
      span.style.marginLeft = (-inkL * k) + 'px';
      mark.style.height = (((100 - fa - fd) / 2 + fa) * k - m.actualBoundingBoxAscent * k * 0.22) + 'px';
    };
    fit();
    addEventListener('resize', fit);
    if (document.fonts) document.fonts.ready.then(fit);
  }
  /* ---------- pages ---------- */
  const qs = new URLSearchParams(location.search);
  const pages = {};

  // CATALOG — ?cat=<category>, ?q=search
  pages.catalog = () => {
    const root = document.getElementById('catalog');
    const state = { cat: qs.get('cat') || '', q: qs.get('q') || '', sort: 'featured' };
    if (state.cat && !CATS[state.cat]) state.cat = '';

    const title = root.querySelector('[data-title]');
    const crumb = root.querySelector('[data-crumb]');
    const count = root.querySelector('[data-count]');
    const groupsEl = root.querySelector('.groups');
    const grid = root.querySelector('.grid-cards');
    const search = root.querySelector('#search');
    const sort = root.querySelector('#sort');
    search.value = state.q;

    const n = c => PRODUCTS.filter(p => !c || p.cat === c).length;

    function render() {
      const label = state.cat ? CATS[state.cat] : 'Catalog';
      title.textContent = label;
      document.title = `${label} — SMARAGD`;
      crumb.innerHTML = state.cat
        ? `<a href="catalog.html">Catalog</a><span>/</span><span>${label}</span>`
        : `<span>Catalog</span>`;

      groupsEl.innerHTML = [['', 'All'], ...Object.keys(CATS).map(c => [c, CATS[c]])]
        .map(([k, l]) => `<button type="button" data-cat="${k}" aria-pressed="${k === state.cat}">${l}<sup>(${n(k) || 'soon'})</sup></button>`).join('');

      const q = state.q.trim().toLowerCase();
      let list = PRODUCTS.filter(p => !state.cat || p.cat === state.cat)
        .filter(p => !q || (p.name + ' ' + CATS[p.cat] + ' ' + p.desc + ' ' + (p.emerald ? p.emerald.origin : 'diamond')).toLowerCase().includes(q));
      if (state.sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
      if (state.sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
      count.textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
      let empty = `<div class="empty"><p class="h3">Nothing found</p><button class="ulink" type="button" data-reset>Show all pieces</button></div>`;
      if (!q && state.cat && !n(state.cat)) {
        empty = `<div class="empty"><p class="h3">New ${CATS[state.cat].toLowerCase()} are coming soon</p>
          <p class="lead" style="max-width:420px;margin:0 auto 20px">The first pieces are being set in our atelier. Leave a request and we will show them to you before anyone else.</p>
          <a class="ulink" href="contact.html?topic=viewing">Ask for a private preview</a></div>`;
      }
      grid.innerHTML = list.length ? list.map(card).join('') : empty;
      updateCounters();

      const url = new URL(location.href);
      state.cat ? url.searchParams.set('cat', state.cat) : url.searchParams.delete('cat');      state.q ? url.searchParams.set('q', state.q) : url.searchParams.delete('q');
      history.replaceState(null, '', url);
    }

    root.addEventListener('click', e => {
      const b = e.target.closest('[data-cat]');
      if (b) { state.cat = b.dataset.cat; render(); }
      if (e.target.closest('[data-reset]')) { state.cat = ''; state.q = ''; search.value = ''; render(); }
    });
    search.addEventListener('input', () => { state.q = search.value; render(); });
    sort.addEventListener('change', () => { state.sort = sort.value; render(); });
    render();
    if (location.hash === '#search') search.focus();
  };

  // PRODUCT — ?id=
  pages.product = () => {
    const root = document.getElementById('product');
    const p = byId(qs.get('id'));
    if (!p) {
      root.innerHTML = `<div class="empty"><p class="h3">This piece was not found</p><a class="ulink" href="catalog.html">Back to the catalog</a></div>`;
      return;
    }
    const req = onRequest(p);
    const out = !req && !stock(p);   // the whole edition has been ordered: it can be made again on request
    document.title = `${p.name} — SMARAGD`;
    const sizeGuide = p.cat === 'rings'
      ? `<table><tr><th>Size</th><th>Inner circumference</th></tr><tr><td>15</td><td>47.1 mm</td></tr><tr><td>16</td><td>50.3 mm</td></tr><tr><td>17</td><td>53.4 mm</td></tr><tr><td>18</td><td>56.5 mm</td></tr><tr><td>19</td><td>59.7 mm</td></tr></table>`
      : `<table><tr><th>Size</th><th>Wrist</th></tr><tr><td>S</td><td>14–15.5 cm</td></tr><tr><td>M</td><td>15.5–17 cm</td></tr><tr><td>L</td><td>17–18.5 cm</td></tr></table>`;
    const d = p.diamonds;
    const specs = [
      ['Metal', p.metal],
      // diamond pieces have no emerald row
      p.emerald ? ['Emerald', `${p.emerald.ct.toFixed(2)} ct · ${p.emerald.shape}<br><span>Origin: ${p.emerald.origin}</span>`] : null,
      ['Diamonds', d ? `${d.count} ${d.count === 1 ? 'stone' : 'stones'} · ${d.ct.toFixed(2)} ct total<br><span>Clarity ${d.clarity} · Colour ${d.color}</span>` : 'None — the emerald stands alone'],
      ['Certificate', p.cert],
      ['Size', p.size],
    ].filter(Boolean);

    root.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumbs">
        <a href="index.html">Main</a><span>/</span><a href="catalog.html">Catalog</a><span>/</span>
        <a href="catalog.html?cat=${p.cat}">${CATS[p.cat]}</a><span>/</span><span>${esc(p.name)}</span>
      </nav>
      <div class="pp g12">
        <div class="pp-thumbs">${p.imgs.map((src, i) => `<button type="button" data-img="${src}" aria-pressed="${i === 0}" aria-label="Photo ${i + 1}"><img src="${small(src)}"${fit(p)} alt="" decoding="async"></button>`).join('')}</div>
        <div class="pp-main"><img ${pic(p.imgs[0], '(max-width: 1023px) 100vw, 42vw')}${fit(p)} alt="${esc(p.name)}"></div>
        <div class="pp-info">
          <h1 class="pt">${esc(p.name)}</h1>
          <p class="pp-price${req ? ' req' : ''}">${priceLabel(p)}</p>
          <p class="pp-stock">${stockLine(p)}${out ? '' : ' · made in our atelier'}</p>
          <dl class="specs">${specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
          ${p.sizes && !out ? `<div class="pp-block"><span class="label">Size</span><div class="sizes" role="group" aria-label="Size">${p.sizes.map(s => `<button type="button" data-size="${s}" aria-pressed="false">${s}</button>`).join('')}</div></div>` : ''}
          ${req || out ? '' : `<div class="pp-block"><span class="label">Quantity</span>
            <div class="qty"><button type="button" data-q="-1" aria-label="Less">−</button><span data-qty>1</span><button type="button" data-q="1" aria-label="More">+</button></div>
          </div>`}
          <div class="pp-buy${req || out ? ' one' : ''}">
            ${req || out ? '' : `<button class="btn" type="button" data-add>Add to basket</button>`}
            <a class="btn ${req || out ? '' : 'ghost'}" href="${out ? `contact.html?topic=bespoke&piece=${p.id}` : viewingUrl(p)}">${out ? 'Ask us to make it again' : 'Book a private viewing'}</a>
          </div>
          <p class="note pp-msg" aria-live="polite">${req ? 'This piece is presented privately, in our salon or by video call. We will confirm the price and the details in person.'
            : out ? 'This edition has found its owners. We can set a new one around a stone of the same character: your advisor will tell you the timing.' : ''}</p>
          <button class="pp-fav" type="button" data-favtoggle></button>
          ${p.sizes ? `<details class="acc"><summary>Size guide</summary><div class="acc-body">${sizeGuide}</div></details>` : ''}
          <details class="acc" open><summary>Description</summary><div class="acc-body">${esc(p.desc)}</div></details>
          <details class="acc"><summary>Care</summary><div class="acc-body">${CARE}</div></details>
          <details class="acc"><summary>Delivery &amp; returns</summary><div class="acc-body">Free insured delivery by armoured courier in Ukraine, worldwide in 5–10 working days. Each piece arrives in a SMARAGD case with its gemological reports. Returns within 14 days, except bespoke pieces. <a class="ulink" href="customers.html">More</a></div></details>
        </div>
      </div>
      <section class="related" aria-label="Related pieces">
        <div class="g12"><h2 class="h2">You may also like</h2></div>
        <div class="rel-grid g12">${[
          ...PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat),
          ...PRODUCTS.filter(x => x.cat !== p.cat),
        ].slice(0, 3).map(card).join('')}</div>
      </section>`;

    // phones: the price and the main button stay at hand in a bar at the bottom until the real ones scroll into view
    const bar = document.createElement('div');
    bar.className = 'pp-bar';
    bar.innerHTML = `<span class="pp-bar-price">${priceLabel(p)}</span>${req || out
      ? `<a class="btn" href="${out ? `contact.html?topic=bespoke&piece=${p.id}` : viewingUrl(p)}">${out ? 'Ask to make it again' : 'Book a viewing'}</a>`
      : `<button class="btn" type="button" data-bar-add>Add to basket</button>`}`;
    document.body.appendChild(bar);
    new IntersectionObserver(([e]) => bar.classList.toggle('hide', e.isIntersecting || e.boundingClientRect.top < 0))
      .observe(root.querySelector('.pp-buy'));
    bar.addEventListener('click', e => {
      if (!e.target.closest('[data-bar-add]')) return;
      // without a size the bar takes you to the sizes; otherwise it adds exactly as the main button does
      if (p.sizes && !size) {
        root.querySelector('.sizes').scrollIntoView({ behavior: 'smooth', block: 'center' });
        msg.textContent = 'Please choose a size.';
        return;
      }
      const main = root.querySelector('[data-add]');
      main.click();
      const b = e.target.closest('[data-bar-add]');
      if (main.classList.contains('is-added')) {
        b.classList.add('is-added'); b.textContent = 'Added ✓';
        clearTimeout(b._reset);
        b._reset = setTimeout(() => { b.classList.remove('is-added'); b.textContent = 'Add to basket'; }, 1800);
      } else flash(b, 'is-full');
    });

    let size = null, qty = 1;
    const main = root.querySelector('.pp-main img');
    const msg = root.querySelector('.pp-msg');
    const favBtn = root.querySelector('[data-favtoggle]');
    const paintFav = () => { favBtn.textContent = favs.includes(p.id) ? '♥ In favourites' : '♡ Add to favourites'; };
    paintFav();

    root.addEventListener('click', e => {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.img) {
        main.src = t.dataset.img;
        root.querySelectorAll('.pp-thumbs button').forEach(b => b.setAttribute('aria-pressed', b === t));
      } else if (t.dataset.size) {
        size = t.dataset.size;
        root.querySelectorAll('.sizes button').forEach(b => b.setAttribute('aria-pressed', b === t));
        if (!req) msg.textContent = '';
      } else if (t.dataset.q) {
        const before = qty;
        qty = Math.max(1, Math.min(Math.max(1, stock(p) - inCart(p.id)), qty + Number(t.dataset.q)));
        const num = root.querySelector('[data-qty]');
        num.textContent = qty;
        if (qty !== before) flash(num);
        else {
          flash(t, 'limit');   // at the edge: a small shake instead of a change
          if (Number(t.dataset.q) > 0) msg.textContent = stock(p) - inCart(p.id) <= 1 && stock(p) === 1 ? 'This is the only one.' : `That is all that is left: ${Math.max(1, stock(p) - inCart(p.id))}.`;
        }
      } else if ('add' in t.dataset) {
        if (p.sizes && !size) {
          msg.textContent = 'Please choose a size.';
          flash(root.querySelector('.sizes'), 'is-full');
          return;
        }
        const added = addToCart(p.id, size, qty);
        msg.innerHTML = added
          ? `Added to your basket${added < qty ? ` (${added}: that is all that is left)` : ''}. <a class="ulink" href="cart.html">View basket</a>`
          : `${stock(p) === 1 ? 'The only one is' : `All ${stock(p)} are`} already in your basket. <a class="ulink" href="cart.html">View basket</a>`;
        // the button itself confirms for a moment, the basket count in the header pops
        if (added) {
          t.classList.add('is-added'); t.textContent = 'Added ✓';
          clearTimeout(t._reset);
          t._reset = setTimeout(() => { t.classList.remove('is-added'); t.textContent = 'Add to basket'; }, 1800);
        } else flash(t, 'is-full');
        qty = 1; root.querySelector('[data-qty]').textContent = qty;
      } else if ('favtoggle' in t.dataset) {
        toggleFav(p.id); paintFav(); flash(t, 'pop');
      }
    });
    updateCounters();
  };

  // BASKET
  pages.cart = () => {
    const root = document.getElementById('cart');
    const render = () => {
      if (!cart.length) {
        root.innerHTML = `<div class="empty"><p class="h3">Your basket is empty</p><a class="btn" href="catalog.html">Go to the catalog</a></div>`;
        return;
      }
      root.innerHTML = `
        <div class="two g12">
          <div class="main">${cart.map((l, i) => {
            const p = byId(l.id);
            return `<div class="line-item">
              <a class="thumb" href="product.html?id=${p.id}"><img src="${small(p.imgs[0])}"${fit(p)} alt="${esc(p.name)}" decoding="async"></a>
              <div>
                <a class="name" href="product.html?id=${p.id}">${esc(p.name)}</a>
                <p class="meta">${CATS[p.cat]}${l.size ? ' · size ' + esc(l.size) : ''} · ${money(p.price)} · ${stockLine(p).toLowerCase()}</p>
                <div class="qty"><button type="button" data-i="${i}" data-q="-1" aria-label="Less">−</button><span>${l.qty}</span><button type="button" data-i="${i}" data-q="1" aria-label="More">+</button></div>
                <button class="rm" type="button" data-rm="${i}">Remove</button>
              </div>
              <p class="sum">${money(p.price * l.qty)}</p>
            </div>`;
          }).join('')}</div>
          <aside class="side">
            <h2 class="h3">Summary</h2>
            <div class="totals">
              <div><span>Your order</span><span>${money(cartTotal())}</span></div>
              <div><span>Insured delivery</span><span>Calculated at checkout</span></div>
              <div class="grand"><span>Total</span><span>${money(cartTotal())}</span></div>
            </div>
            <a class="btn wide" style="margin-top:24px" href="checkout.html">Checkout</a>
            <p class="note" style="margin-top:14px">Every piece arrives in a SMARAGD case with its gemological reports.</p>
          </aside>
        </div>`;
    };
    root.addEventListener('click', e => {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.rm !== undefined) {
        // the line fades out before it goes
        const li = t.closest('.line-item');
        li.style.transition = 'opacity .3s, transform .3s'; li.style.opacity = '0'; li.style.transform = 'translateX(12px)';
        setTimeout(() => { cart.splice(+t.dataset.rm, 1); saveCart(); render(); }, 280);
        return;
      }
      if (t.dataset.q) {
        const i = +t.dataset.i, l = cart[i], before = l.qty;
        // other sizes of the same piece take from the same edition
        const room = stock(byId(l.id)) - (inCart(l.id) - l.qty);
        l.qty = Math.max(1, Math.min(room, l.qty + Number(t.dataset.q)));
        if (l.qty === before) { flash(t, 'limit'); return; }
        saveCart(); render();
        // the new number, the line sum and the totals pop
        const li = root.querySelectorAll('.line-item')[i];
        flash(li.querySelector('.qty span'));
        flash(li, 'flash');
        root.querySelectorAll('.totals span:last-child').forEach(s => flash(s));
      }
    });
    render();
  };

  // CHECKOUT
  pages.checkout = () => {
    const root = document.getElementById('checkout');
    if (!cart.length) {
      root.innerHTML = `<div class="empty"><p class="h3">Your basket is empty</p><a class="btn" href="catalog.html">Go to the catalog</a></div>`;
      return;
    }
    const form = root.querySelector('form');
    const summary = root.querySelector('[data-summary]');
    // TODO: real delivery rates
    const shipping = () => (form.elements.shipping.value === 'world' ? 150 : 0);
    const renderSummary = () => {
      const sub = cartTotal(), ship = shipping();
      summary.innerHTML = cart.map(l => {
        const p = byId(l.id);
        return `<div class="line-item">
          <div class="thumb"><img src="${small(p.imgs[0])}"${fit(p)} alt="" decoding="async"></div>
          <div><p class="name">${esc(p.name)}</p><p class="meta">${l.size ? 'Size ' + esc(l.size) + ' · ' : ''}Quantity ${l.qty}</p></div>
          <p class="sum">${money(p.price * l.qty)}</p>
        </div>`;
      }).join('') + `
        <div class="totals">
          <div><span>Your order</span><span>${money(sub)}</span></div>
          <div><span>Insured delivery</span><span>${ship ? money(ship) : 'Free'}</span></div>
          <div class="grand"><span>Total</span><span>${money(sub + ship)}</span></div>
        </div>`;
    };
    // the country decides the delivery: the armoured courier runs in Ukraine only; abroad it is insured
    // worldwide delivery (collection at the Kyiv salon stays possible for everyone)
    const syncCountry = () => {
      const ua = form.elements.country.value === 'UA';
      const local = form.querySelector('[name="shipping"][value="ua"]');
      local.disabled = !ua;
      local.closest('.opt').style.opacity = ua ? '' : '.4';
      if (!ua && local.checked) form.querySelector('[name="shipping"][value="world"]').checked = true;
      if (ua && form.elements.shipping.value === 'world') local.checked = true;
    };
    form.addEventListener('change', e => {
      if (e.target.name === 'country') syncCountry();
      if (e.target.name === 'shipping' || e.target.name === 'country') renderSummary();
    });
    syncCountry();
    // one order number per checkout: it stays the same through every payment attempt
    const SHIP = { ua: 'Armoured insured courier in Ukraine', world: 'Worldwide insured delivery', salon: 'Collection at the Kyiv salon' };
    let order = null;

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const f = form.elements;
      // the order is frozen here: lines, prices and totals do not change during payment
      order = order || { no: 'SM-' + Math.floor(100000 + Math.random() * 900000) };
      Object.assign(order, {
        lines: cart.map(l => ({ ...l, name: byId(l.id).name, price: byId(l.id).price })),
        sub: cartTotal(), ship: shipping(), total: cartTotal() + shipping(),
        first: f.first.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(),
        address: [f.street.value, f.apt.value, f.city.value, f.zip.value, f.country.selectedOptions[0].text].map(s => s.trim()).filter(Boolean).join(', '),
        shipping: f.shipping.value, payment: f.payment.value,
      });
      if (order.payment === 'card') pay(); else finish('transfer');
    });

    // DEMO payment: a stand-in for the provider's secure page (TODO: real provider, e.g. monobank or Stripe)
    function pay(error = '', attempt = 0) {
      form.hidden = true;
      let box = root.querySelector('.paybox');
      if (!box) { box = document.createElement('div'); box.className = 'main paybox'; form.after(box); }
      box.innerHTML = `
        <h2 class="h2 sec-title">Payment</h2>
        <p class="pay-sum">Order ${order.no} · <strong>${money(order.total)}</strong></p>
        <p class="pay-demo">Demo payment: no money is charged. Card <b>4242 4242 4242 4242</b> pays successfully,
          <b>4000 0000 0000 0002</b> is declined. Any future date and any three digits.</p>
        ${error ? `<p class="pay-err" role="alert">${error}</p>` : ''}
        <form class="pay-form" novalidate>
          <div class="fields">
            <label class="field full"><span>Card number *</span><input name="card" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" required></label>
            <label class="field"><span>Expiry *</span><input name="exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" required></label>
            <label class="field"><span>CVC *</span><input name="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4" required></label>
            <label class="field full"><span>Name on the card *</span><input name="holder" autocomplete="cc-name" required></label>
          </div>
          <button class="btn wide" type="submit">Pay ${money(order.total)}</button>
          <button class="pay-back ulink" type="button">Back to the order details</button>
        </form>`;
      const pf = box.querySelector('.pay-form');
      pf.card.addEventListener('input', () => { pf.card.value = pf.card.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); });
      pf.exp.addEventListener('input', () => { const d = pf.exp.value.replace(/\D/g, '').slice(0, 4); pf.exp.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; });
      box.querySelector('.pay-back').addEventListener('click', () => { box.remove(); form.hidden = false; });
      pf.addEventListener('submit', ev => {
        ev.preventDefault();
        const num = pf.card.value.replace(/\s/g, ''), [mm, yy] = pf.exp.value.split('/').map(s => parseInt(s, 10));
        const now = new Date(), expOk = mm >= 1 && mm <= 12 && (2000 + yy > now.getFullYear() || (2000 + yy === now.getFullYear() && mm >= now.getMonth() + 1));
        const bad = num.length !== 16 ? 'Please enter all 16 digits of the card number.'
          : !expOk ? 'Please check the expiry date: the card must still be valid.'
          : !/^\d{3,4}$/.test(pf.cvc.value) ? 'Please enter the three digits from the back of the card.'
          : !pf.holder.value.trim() ? 'Please enter the name as it is written on the card.' : '';
        if (bad) { pay(bad, attempt); return; }
        const btn = pf.querySelector('[type="submit"]');
        btn.disabled = true; btn.textContent = 'Processing…';
        setTimeout(() => {
          if (num === '4242424242424242') finish('paid', num.slice(-4));
          else pay(`Payment declined by the bank${attempt ? ` (attempt ${attempt + 1})` : ''}. No money was taken. Please check the details or use another card; your order ${order.no} is kept.`, attempt + 1);
        }, 1200);
      });
      scrollTo(0, 0);
    }

    // CONFIRMATION: the same order number, lines and totals as the payment, and the email the client receives
    function finish(status, last4) {
      // the pieces leave the stock and the basket
      order.lines.forEach(l => { sold[l.id] = (sold[l.id] || 0) + l.qty; });
      write('smaragd-sold', sold);
      cart = []; saveCart();
      const paid = status === 'paid';
      const statusLine = paid ? `Paid by card ending ${last4}` : 'Awaiting bank transfer: your advisor will send the invoice';
      const lines = order.lines.map(l => `<div><span>${esc(l.name)}${l.size ? ` · size ${esc(l.size)}` : ''} × ${l.qty}</span><span>${money(l.price * l.qty)}</span></div>`).join('');
      const totals = `${lines}
        <div><span>Insured delivery</span><span>${order.ship ? money(order.ship) : 'Free'}</span></div>
        <div class="grand"><span>Total</span><span>${money(order.total)}</span></div>`;
      const mail = [
        `Subject: Your SMARAGD order ${order.no}`, '',
        `Dear ${order.first},`, '',
        `thank you for your order ${order.no}. ${paid ? `We have received your payment of ${money(order.total)} (card ending ${last4}).` : `Your advisor will send the invoice for ${money(order.total)} within one working day.`}`, '',
        ...order.lines.map(l => `${l.name}${l.size ? `, size ${l.size}` : ''} × ${l.qty} — ${money(l.price * l.qty)}`),
        `Insured delivery — ${order.ship ? money(order.ship) : 'free'}`,
        `Total — ${money(order.total)}`, '',
        `${SHIP[order.shipping]}${order.shipping === 'salon' ? ': 17 Velyka Zhytomyrska St, 2nd floor, Kyiv' : `: ${order.address}`}`, '',
        'Your personal advisor will call you within one working day to confirm the details.',
        `Questions: +380 44 337 18 52 · salon@smaragd.jewelry · please quote ${order.no}`, '',
        'SMARAGD · 17 Velyka Zhytomyrska St, Kyiv',
      ].join('\n');
      root.innerHTML = `<div class="done">
        <h1 class="pt">Thank you, ${esc(order.first)}</h1>
        <p class="lead" style="max-width:560px;margin-bottom:28px">Your order <strong>${order.no}</strong> is with us. A confirmation has been sent to <strong>${esc(order.email)}</strong>.
          Your personal advisor will call you on ${esc(order.phone)} within one working day to confirm the details and arrange insured delivery.</p>
        <div class="order-card">
          <p class="label">${statusLine}</p>
          <div class="totals">${totals}</div>
          <p class="note">${SHIP[order.shipping]}${order.shipping === 'salon' ? ' · 17 Velyka Zhytomyrska St, Kyiv, by appointment' : ` · ${esc(order.address)}`}</p>
          <p class="note">Questions? <a class="ulink" href="tel:+380443371852">+380 44 337 18 52</a> · <a class="ulink" href="mailto:salon@smaragd.jewelry?subject=${encodeURIComponent('Order ' + order.no)}">salon@smaragd.jewelry</a></p>
          <details class="acc"><summary>The confirmation email</summary><pre class="mail">${esc(mail)}</pre></details>
        </div>
        <a class="btn" href="catalog.html">Back to the catalog</a>
      </div>`;
      scrollTo(0, 0);
    }
    renderSummary();
  };

  // FAVOURITES
  pages.favourites = () => {
    const grid = document.querySelector('#favourites .grid-cards');
    grid.innerHTML = favs.length ? favs.map(id => card(byId(id))).join('') :
      `<div class="empty"><p class="h3">No favourites yet</p><a class="btn" href="catalog.html">Go to the catalog</a></div>`;
    updateCounters();
  };

  // CONTACT — ?topic=viewing&piece=<id> prefills a private viewing request
  pages.contact = () => {
    const form = document.querySelector('#contact-form');
    const note = form.querySelector('.note');
    const sel = form.elements.topic;
    const t = qs.get('topic');
    if (t && [...sel.options].some(o => o.value === t)) sel.value = t;
    const p = byId(qs.get('piece'));
    if (p) {
      form.elements.message.value = sel.value === 'bespoke'
        ? `I would like a new ${p.name} to be made for me.`
        : `I would like to book a private viewing of the ${p.name}.`;
      if (form.elements.piece) form.elements.piece.value = p.id;
    }
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      // TODO: connect to email / CRM
      note.textContent = sel.value === 'viewing'
        ? 'Thank you. Your advisor will contact you within one working day to arrange the viewing.'
        : 'Thank you. We will reply within one working day.';
      form.reset();
    });
  };

  /* ---------- home page hooks ---------- */
  function home() {
    // category counters on the home page: <sup data-count-cat="rings">
    document.querySelectorAll('[data-count-cat]').forEach(el => {
      const c = el.dataset.countCat;
      const k = PRODUCTS.filter(p => !c || p.cat === c).length;
      el.textContent = k ? `(${k})` : '(soon)';
    });
    // the same count written out, e.g. on About us: <span data-count-pieces="rings"> → "4 pieces"
    document.querySelectorAll('[data-count-pieces]').forEach(el => {
      const k = PRODUCTS.filter(p => p.cat === el.dataset.countPieces).length;
      el.textContent = k ? `${k} ${k === 1 ? 'piece' : 'pieces'}` : 'Coming soon';
    });
    // prices on the home page: <span data-price="id">
    document.querySelectorAll('[data-price]').forEach(el => {
      const p = byId(el.dataset.price);
      if (p) el.textContent = priceLabel(p);
    });
    // the small product tiles on the home page get the same second photo as the catalogue cards
    document.querySelectorAll('.prod.t-s').forEach(a => {
      const p = byId(((a.getAttribute('href') || '').match(/[?&]id=([^&]+)/) || [])[1]);
      const ph = a.querySelector('.ph');
      if (p && ph && hoverImg(p) && !ph.querySelector('img.alt')) {
        ph.insertAdjacentHTML('beforeend', altPic(p, '24vw'));
        a.classList.add('has-alt');
      }
    });
  }

  /* ---------- boot ---------- */
  header();
  footer();
  home();
  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();
  updateCounters();
  addEventListener('storage', () => { cart = cleanCart(read('smaragd-cart', [])); favs = read('smaragd-favs', []).filter(byId); updateCounters(); });
})();
