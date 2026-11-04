/* SMARAGD — motion layer for every page. Runs after the page's own scripts (js/shop.js has already built the cards).
   Everything moves only transform and opacity; nothing is measured on frames where nothing scrolls. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const phone = matchMedia('(max-width: 767px)').matches;
  const curtain = document.querySelector('.m-curtain');
  const root = document.documentElement;

  if (reduce) { if (curtain) curtain.remove(); root.classList.add('m-go'); return; }

  /* 1. first screen: SMARAGD in letters (once the webfont is in, so the widths are the real ones) */
  const letters = () => {
    const word = document.querySelector('.dp-word > span[aria-hidden]');
    if (!word || word.querySelector('.m-ch')) return;
    // separate letters lose the font's kerning and come out a little wider: squeeze the word back to its own width
    const w0 = word.getBoundingClientRect().width;
    word.innerHTML = [...word.textContent].map((c, i) => `<span class="m-ch" style="animation-delay:${0.25 + i * 0.04}s">${c}</span>`).join('');
    const w1 = word.getBoundingClientRect().width;
    if (w0 && w1) { word.style.transformOrigin = '0 0'; word.style.transform = `scaleX(${(w0 / w1).toFixed(4)})`; }
  };

  /* 6. page transitions: the curtain lifts once the fonts are in and the first-screen photos are decoded
     (decoding a big photo while it animates is what makes a first screen stutter) */
  const lift = () => {
    letters();
    curtain.classList.remove('m-close', 'm-below');
    curtain.classList.add('m-show');
    curtain.getBoundingClientRect();   // commit the starting position, then let it slide (no frame callbacks needed)
    setTimeout(() => { curtain.classList.add('m-open'); root.classList.add('m-go'); }, 20);
  };
  let lifted = false;
  const liftOnce = () => { if (!lifted) { lifted = true; lift(); } };
  // the webfont stylesheet loads without blocking the page: wait for it, then for the faces themselves
  const fontSheet = document.querySelector('link[as="style"][href*="fonts.googleapis"]');
  const sheetIn = new Promise(res => {
    if (!fontSheet || fontSheet.rel === 'stylesheet') return res();
    fontSheet.addEventListener('load', () => setTimeout(res, 0)); fontSheet.addEventListener('error', res);
  });
  const fontsIn = sheetIn.then(() => (document.fonts ? Promise.all([
    document.fonts.load('500 100px "Cormorant Garamond"'), document.fonts.load('300 40px "Cormorant Garamond"'),
  ]).then(() => document.fonts.ready).catch(() => {}) : null));
  const heroImgs = [...document.querySelectorAll('.stage img')].filter(i => i.offsetParent !== null);
  Promise.all([fontsIn, ...heroImgs.map(i => (i.decode ? i.decode().catch(() => {}) : null))])
    .then(() => setTimeout(liftOnce, 60));
  setTimeout(liftOnce, 1800);   // never keep the page behind the curtain if something is slow
  addEventListener('pageshow', e => { if (e.persisted) { curtain.classList.remove('m-close'); curtain.classList.add('m-open'); } });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(a.href, location.href);
    if (a.target === '_blank' || url.origin !== location.origin || /^(mailto|tel):/.test(a.getAttribute('href'))) return;
    if (url.pathname === location.pathname && url.hash) return;   // in-page anchors scroll instead
    e.preventDefault();
    curtain.classList.remove('m-open');
    curtain.classList.add('m-below');
    curtain.getBoundingClientRect();
    setTimeout(() => {
      curtain.classList.remove('m-below');
      curtain.classList.add('m-close');
      setTimeout(() => { location.href = url.href; }, 560);
    }, 20);
  });

  /* 3 + 4. photos: the ivory cloth on every photo, parallax on the big ones */
  // home tiles and photos, catalogue cards, About tiles, the product photo
  const photos = [...document.querySelectorAll('.prod .ph, .media, .pcard .ph, .tile .ph, .pp-main')].filter(el => !el.closest('.stage'));
  photos.forEach(el => el.classList.add('m-img'));
  const parallax = [...document.querySelectorAll('.t-big .ph, .ins-grid .prod:nth-child(2) .ph, .philo-photo, .craft-photo')]
    .filter(el => !(phone && el.classList.contains('craft-photo')));
  parallax.forEach(el => el.classList.add('m-par'));
  const parImgs = parallax.map(el => el.querySelector('img'));

  /* 5. titles: each section title rises from its own mask; the philosophy lines one after another */
  const titles = '.h-sec, .f-cta, .pt, .h2';
  document.querySelectorAll(titles).forEach(h => {
    h.innerHTML = `<span class="m-mask"><span class="m-rise">${h.innerHTML}</span></span>`;
  });
  const philo = document.querySelector('.philo-title');
  if (philo) {
    philo.classList.add('m-lines');
    philo.querySelectorAll('.ln > span').forEach((s, i) => { s.style.transitionDelay = (i * 0.05) + 's'; });
  }

  // photos open by block: when a grid comes into view, all its cards, its big photo and their captions appear together
  const groups = [...new Set(photos.map(p => p.closest('.tiles, .ins-grid, .philo-body, .craft, .grid-cards, .rel-grid, .story, .make, .pp') || p))];
  groups.forEach(g => g.classList.add('m-group'));
  const open = g => {
    (g.matches('.m-img') ? [g] : [...g.querySelectorAll('.m-img')]).forEach(p => p.classList.add('m-in'));
    g.querySelectorAll('.reveal').forEach(r => r.classList.add('in'));
  };
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    if (el.classList.contains('m-group')) open(el); else el.classList.add('m-in');
    io.unobserve(el);
  }), { rootMargin: '0px 0px -8% 0px' });
  [...groups, ...document.querySelectorAll(titles), philo].filter(Boolean).forEach(el => io.observe(el));

  // parallax: positions are measured once (and on resize); while scrolling only arithmetic runs, then one translate per photo
  let boxes = [];
  const measure = () => {
    const y = scrollY;
    boxes = parallax.map(el => { const r = el.getBoundingClientRect(); return { top: r.top + y, h: r.height }; });
  };
  const drift = () => {
    const y = scrollY, vh = innerHeight;
    boxes.forEach((b, i) => {
      const top = b.top - y;
      if (top + b.h < -100 || top > vh + 100) return;
      // -1 … 1 across the screen, clamped: the drift never exceeds the photo's 6% spare edge
      const p = Math.max(-1, Math.min(1, (top + b.h / 2 - vh / 2) / (vh / 2 + b.h / 2)));
      parImgs[i].style.translate = `0 ${(p * b.h * 0.05).toFixed(1)}px`;
    });
  };
  const remeasure = () => { measure(); drift(); };
  addEventListener('load', remeasure);
  addEventListener('resize', remeasure);
  if (document.fonts) document.fonts.ready.then(remeasure);
  remeasure();

  /* 2. smooth scroll — the parallax rides on its scroll event, so it moves only when the page does */
  if (window.Lenis) {
    // lerp instead of a fixed duration: the page answers the wheel at once and glides to a stop
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    lenis.on('scroll', drift);
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    // the phone menu locks the page: stop the smooth scroll with it
    new MutationObserver(() => (root.classList.contains('menu-open') ? lenis.stop() : lenis.start()))
      .observe(root, { attributes: true, attributeFilter: ['class'] });
  } else {
    addEventListener('scroll', drift, { passive: true });
  }

  /* 7. cursor: an emerald dot that follows lightly; it softly grows into a haze over the pieces, a soft ring over links,
     ivory over the emerald footer */
  if (desktop) {
    const dot = document.createElement('div');
    dot.className = 'm-cursor is-hidden';
    document.body.appendChild(dot);
    root.classList.add('m-has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, moving = false;
    addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY; dot.classList.remove('is-hidden');
      if (!moving) { moving = true; requestAnimationFrame(follow); }
    }, { passive: true });
    document.addEventListener('mouseleave', () => dot.classList.add('is-hidden'));
    document.addEventListener('mouseover', e => {
      const view = e.target.closest('.prod:not(.rev), .pcard, .dp-ring');
      const link = !view && e.target.closest('a, button, label, summary');
      dot.classList.toggle('is-view', !!view);
      dot.classList.toggle('is-link', !!link);
      dot.classList.toggle('is-dark', !!e.target.closest('.site-footer, footer'));
    });
    // a light, frame-rate independent glide; it sleeps once the dot has caught up with the mouse
    let last = performance.now();
    function follow(now) {
      const k = 1 - Math.pow(1 - 0.35, Math.min(4, (now - last) / 16.7)); last = now;
      cx += (x - cx) * k; cy += (y - cy) * k;
      dot.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      if (Math.abs(x - cx) + Math.abs(y - cy) > 0.3) requestAnimationFrame(follow);
      else { moving = false; }
    }
  }
})();
