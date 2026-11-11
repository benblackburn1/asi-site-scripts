/*!
 * ASI experience layer (Automation Services, Inc.), by Origin.
 * One file, loaded site-wide from the Webflow footer via jsDelivr pinned to a commit + SRI.
 * Every module is dormant until the Designer markup carries its data-asi-* hook, so deleting
 * this script returns the site to its designed, static state.
 *
 * CHANGELOG (newest first)
 * v1.3.0  2026-11-10  Review round, Phase 4: pinned scroll-scrubbed frame sequence (R-28, data-asi-sequence; test page only
 *                     until approved). Carousel loops skip hidden cards (R-07 hid the four old Home machine cards).
 * v1.2.0  2026-11-10  Review round, Phase 3 (live scenes, Aggregate). The hero rocks are the live visualizer scene, opened
 *                     on the still's frame, turning with page scroll and drag; the Basalt Rock chips ride their rocks
 *                     (R-20/21). A glass card follows the plant's selected item with its render and a drifting reading
 *                     (R-23). The Site Monitoring card follows the live plant and its arrows step it (R-27). Embeds
 *                     talk to the page over postMessage, origin-checked both ways.
 * v1.1.1  2026-11-10  Every carousel with visible arrows loops endlessly (Ben's answer to Q6), not just the two marked ones.
 * v1.1.0  2026-11-10  Review round, Phase 2 (motion on existing markup). New modules: nav hides on scroll down and
 *                     returns on scroll up (R-02); Services cards grow, sharpen and settle as you scroll (R-14,
 *                     data-asi-stack); Services statement pins and reads through word by word (R-16,
 *                     data-asi-readthrough); Aggregate help line traces green with scroll (R-24, data-asi-progress);
 *                     endless carousels (R-30, data-asi-loop); lists fall into place once (R-31/32/35,
 *                     data-asi-cascade); KPI hero chips orbit the ASI mark (R-34, data-asi-orbit); Partners diagram
 *                     dashes flow toward ASI and its readings drift (R-41, data-asi-diagram). Home selector panes
 *                     replay their chart when shown (R-09). Pinned and scrubbed modules run at 992 px and up; every
 *                     module skips under prefers-reduced-motion.
 * v1.0.8  2026-11-10  Card photo zoom no longer scales the arrow and call squares inside cards.
 * v1.0.7  2026-11-10  Review round, Phase 1: arrow buttons no longer nudge; on hover the square turns Go Green with a
 *                     dark arrow. Careers cards brighten their photo on hover (pointer devices only). Nav blur gets
 *                     the -webkit- prefix for Safari.
 * v1.0.6  2026-11-10  Reveals: cards inside a horizontal scroll row (phone/tablet carousels) reveal together when the
 *                     row enters view, instead of staying hidden until swiped. Carousel snap respects the track's
 *                     padding, so the first card sits on the page gutter.
 * v1.0.5  2026-11-09  Plant layouts on Services and Aggregate are the live plant visualizer (hover the pins). The
 *                     Aggregate rocks loop matches its new still. Machine cards stay as still renders.
 * v1.0.4  2026-11-09  Steppers carry their designed active look into every row (title weight, description shown).
 * v1.0.3  2026-11-09  Reveal animations clean up after themselves, so rows designed to look dimmed stay dimmed.
 * v1.0.2  2026-11-09  Carousel arrows only get a drawn chevron when they have no icon of their own. Selector rows keep their designed dimmed look as the selection moves; tab panes hidden
 *                     in the Designer now show when their tab is chosen.
 * v1.0.1  2026-11-09  Bars read their height from data-asi-value; loops limited to slots whose footage
 *                     matches the designed still (hero drone, cloud hero with the darker Figma grade).
 * v1.0.0  2026-11-09  First release for staging: nav menus, reveals, FAQ, carousels, selectors,
 *                     charts, counters, plant-diagram hotspots, video loops, tracked hero chips.
 */
(function () {
  'use strict';
  if (window.__asiExperience) return;
  window.__asiExperience = '1.3.0';

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH = 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;
  var EASE = 'cubic-bezier(.2,.7,.2,1)';
  var GREEN = '#8ae14d';
  var ARROW_HOVER = 'https://cdn.prod.website-files.com/6ae0b8e3255cc1be07d5b192/6af290e36fcffdb374e4df3d_btn-arrow-green.svg';

  /* Videos ride the same commit as this file (see selfBase). Slot name -> file. */
  var VIDEO = {
    'hero-drone': 'video/hero-drone.mp4',
    'agg-rocks': 'video/agg-rocks-3x2.mp4',
    'stacker': 'video/stacker-sway.mp4',
    'silo': 'video/silo-sway.mp4',
    'crusher': 'video/crusher.mp4',
    'container': 'video/container-push.mp4',
    'hmi-running': 'video/hmi-running.mp4',
    'hmi-autostart': 'video/hmi-autostart.mp4',
    'hmi-alarm': 'video/hmi-alarm.mp4',
    'conveyor-bitmap': 'video/conveyor-bitmap.mp4'
  };
  /* Page slot names -> library loops. Unmapped slots keep their still image. */
  var SLOT = {
    'hero-drone': { v: 'hero-drone' },
    'cloud-hero': { v: 'conveyor-bitmap', filter: 'brightness(.3) contrast(1.15)' },
    'agg-rocks': { v: 'agg-rocks' }
    /* Machine cards (machine-1..4) are still renders by design. Not mapped yet (still images stay): the
       same visualizer camera as their Figma stills; eh-container-1, kpi-dashboard, cloud-phone,
       plant-diagram and who-1..3 have no matching loop yet. Add a line here when one is rendered. */
  };

  function selfBase() {
    var s = document.currentScript;
    if (!s) { var all = document.getElementsByTagName('script'); for (var i = 0; i < all.length; i++) { if (/asi-experience(\.min)?\.js/.test(all[i].src)) s = all[i]; } }
    return s && s.src ? s.src.replace(/[^\/]*$/, '') : '';
  }
  var BASE = selfBase();

  /* ---------- one injected stylesheet ---------- */
  var css = [
    'html{scroll-behavior:smooth}',
    '[id]{scroll-margin-top:96px}',
    '.nav-dd-menu.asi-open{display:flex}',
    '.nav-mobile.asi-open{display:flex}',
    '.nav-dd-menu{opacity:0;transform:translateY(-6px);transition:opacity .2s ' + EASE + ',transform .2s ' + EASE + '}',
    '.nav-dd-menu.asi-show{opacity:1;transform:none}',
    /* v1.0.7 (R-01): arrow buttons. The square does not move; on hover it turns Go Green with a dark arrow.
       The hover art is the site's own btn-arrow-green.svg, painted behind the icon; object-position slides
       the icon's own art out of its box so the green one shows. Call buttons are not arrow icons and keep
       their brighten. Touch screens never get a stuck hover. */
    '.btn .btn-icon{transition:filter .25s}',
    '.btn img.btn-icon[src*="arrow"],.ptn-submit-row img.btn-icon{background:url(' + ARROW_HOVER + ') center/100% 100% no-repeat}',
    '@media (hover:hover){.btn:hover img.btn-icon[src*="arrow"],.ptn-submit-row:hover img.btn-icon{object-position:0 -999px}}',
    '.btn-call:hover .btn-icon{filter:brightness(1.12)}',
    /* v1.0.7 (R-10): careers cards rest dimmed; hover brings the photo to full strength (the "Field startups"
       look in Figma). Hover-capable pointers only, so touch keeps the resting state. */
    '.home-career-media-dim{transition:opacity .45s ' + EASE + '}',
    '@media (hover:hover){.home-career-card:hover .home-career-media-dim{opacity:1}}',
    /* v1.0.7 (R-03): Safari needs the prefixed blur; Webflow only writes the standard property. */
    '.nav{-webkit-backdrop-filter:blur(7.5px)}',
    /* v1.0.8: the card photo zoom skips button icons, so arrow and call squares never move (R-01). */
    '.card img:not(.btn-icon),[class*="-card"] img:not(.btn-icon){transition:transform .6s ' + EASE + '}',
    '.card:hover img:not(.btn-icon),[class*="-card"]:hover img:not(.btn-icon){transform:scale(1.03)}',
    '.carousel-arrow{transition:background-color .2s}',
    '.carousel-arrow:hover{background-color:' + GREEN + '}',
    '.carousel-arrow:empty::before{content:"";display:block;width:9px;height:9px;margin:auto;border-top:1.5px solid #171d22;border-left:1.5px solid #171d22;transform:rotate(-45deg) translate(1px,1px)}',
    '[data-asi-next]:empty::before{transform:rotate(135deg) translate(1px,1px)}',
    'html.asi-js .asi-rv{opacity:0;transform:translateY(16px);transition:opacity .6s ' + EASE + ',transform .6s ' + EASE + '}',
    'html.asi-js .asi-rv.asi-in{opacity:1;transform:none}',
    '.asi-w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}',
    '.asi-wi{display:inline-block;transform:translateY(105%);transition:transform .8s ' + EASE + '}',
    '.asi-split-in .asi-wi{transform:none}',
    '@keyframes asiPulse{0%{box-shadow:0 0 0 0 rgba(138,225,77,.7)}100%{box-shadow:0 0 0 10px rgba(138,225,77,0)}}',
    '.eyebrow-dot.asi-pulse{animation:asiPulse .9s ease-out 1}',
    '[data-asi-carousel]{overflow-x:auto!important;flex-wrap:nowrap!important;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;cursor:grab}',
    '[data-asi-carousel]::-webkit-scrollbar{display:none}',
    '[data-asi-carousel]>*{scroll-snap-align:start;flex-shrink:0}',
    '[data-asi-carousel].asi-drag{cursor:grabbing;scroll-snap-type:none}',
    '[data-asi-selector] [data-asi-item],[data-asi-accordion] [data-asi-item]{cursor:pointer;transition:opacity .35s,background-color .35s,color .35s}',
    '.asi-pane-off{position:absolute!important;left:0;top:0;width:100%;height:100%;opacity:0;pointer-events:none}',
    '[data-asi-pane]{transition:opacity .5s ' + EASE + '}',
    '[data-asi-bar]{transition:height .9s ' + EASE + '}',
    '[data-asi-hotspot]{cursor:pointer}',
    '@keyframes asiRing{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.8);opacity:0}}',
    '.asi-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid ' + GREEN + ';animation:asiRing 2.2s ease-out infinite;pointer-events:none}',
    '[data-asi-tag]{transition:left .45s ' + EASE + ',top .45s ' + EASE + ',opacity .3s}',
    '.asi-video{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s}',
    '.asi-video.asi-on{opacity:1}',
    '[data-asi-chips]>*{will-change:transform}',
    '.faq-a{transition:opacity .3s}',
    '.asi-live{position:absolute;left:0;top:0;width:100%;height:100%;border:0;opacity:0;transition:opacity .8s;background:transparent}',
    '.asi-live.asi-on{opacity:1}',
    '.asi-live-on [data-asi-hotspot],.asi-live-on [data-asi-tag]{display:none!important}',
    /* v1.1.0 */
    '[data-asi-cascade].asi-cas-wait>*{opacity:0;transform:translateY(-18px) scale(.94);filter:blur(10px)}',
    '[data-asi-cascade]>*{transition:opacity .7s ' + EASE + ',transform .8s ' + EASE + ',filter .8s ' + EASE + '}',
    '.asi-progress-fill{position:absolute;background:' + GREEN + ';pointer-events:none}',
    '[data-asi-progress] [class*="-marker"]{transition:background-color .25s}',
    '@keyframes asiFlow{to{stroke-dashoffset:-14}}',
    '.asi-flow{stroke-dasharray:7 7;animation:asiFlow 1.1s linear infinite}',
    '.asi-rt{transition:opacity .15s linear}',
    /* v1.3.0 */
    '[data-asi-seq-tick]{opacity:.35;transition:opacity .3s}', '[data-asi-seq-tick].asi-ticked{opacity:1}',
    '@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}html.asi-js .asi-rv{opacity:1;transform:none;transition:none}.asi-wi{transform:none;transition:none}.asi-ring{animation:none}}'
  ];
  var st = document.createElement('style');
  st.id = 'asi-experience-css';
  st.appendChild(document.createTextNode(css.join('\n')));
  (document.head || document.documentElement).appendChild(st);
  if (!RM) document.documentElement.className += ' asi-js';

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function onReady(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function safe(name, fn) { return function () { try { fn(); } catch (e) { if (window.console) console.warn('[asi] ' + name, e); } }; }
  function inView(el, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting, e, io); }); }, opts || { threshold: 0.15 });
    io.observe(el);
    return io;
  }
  function closestSection(el) { while (el && el !== document.body) { if (el.tagName === 'SECTION' || el.parentNode === document.body) return el; el = el.parentNode; } return document.body; }
  /* The active combo class is whatever class the initially active item has and its siblings do not. */
  function activeClassOf(items) {
    var marked = null, i, j;
    for (i = 0; i < items.length; i++) { if (/is-active|is-open|-active\b|-open\b/.test(items[i].className)) { marked = items[i]; break; } }
    if (!marked) return { idx: 0, cls: null };
    var cls = null, list = marked.className.split(/\s+/);
    for (i = 0; i < list.length; i++) {
      var c = list[i], unique = true;
      for (j = 0; j < items.length; j++) { if (items[j] !== marked && (' ' + items[j].className + ' ').indexOf(' ' + c + ' ') > -1) unique = false; }
      if (unique && c) cls = c;
    }
    return { idx: items.indexOf(marked), cls: cls };
  }

  /* v1.1.0: modules start from the last line of this file, so every variable below is set even when the
     script runs after the page has already loaded. */
  function boot() {
    [navMenus, navAutoHide, reveals, splitHeads, eyebrowPulse, faqs, loops, carousels, selectors, accordions, charts, counters, hotspots, videos, liveViews, liveChips, followers,
      cascades, stacks, readthroughs, progressLines, orbits, diagrams, sequences]
      .forEach(function (fn) { safe(fn.name, fn)(); });
  }

  /* ---------- 1. nav: services dropdown + mobile menu ---------- */
  function navMenus() {
    $$('[data-asi-dd]').forEach(function (dd) {
      var menu = $('.nav-dd-menu', dd); if (!menu) return;
      var t;
      function open() { clearTimeout(t); menu.classList.add('asi-open'); requestAnimationFrame(function () { menu.classList.add('asi-show'); }); }
      function close() { t = setTimeout(function () { menu.classList.remove('asi-show'); setTimeout(function () { if (!menu.classList.contains('asi-show')) menu.classList.remove('asi-open'); }, 200); }, 120); }
      dd.addEventListener('mouseenter', open); dd.addEventListener('mouseleave', close);
      dd.addEventListener('focusin', open); dd.addEventListener('focusout', close);
    });
    $$('[data-asi-menu]').forEach(function (btn) {
      var nav = btn.closest('.nav'), panel = nav && $('.nav-mobile', nav); if (!panel) return;
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        var on = panel.classList.toggle('asi-open');
        btn.setAttribute('aria-expanded', on ? 'true' : 'false');
        btn.textContent = on ? 'Close' : 'Menu';
      });
      $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { panel.classList.remove('asi-open'); btn.textContent = 'Menu'; }); });
    });
  }

  /* ---------- 2. scroll reveals (cards, headings, rows) ---------- */
  function hScroller(el) {
    for (var a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      var ox = getComputedStyle(a).overflowX;
      if ((ox === 'auto' || ox === 'scroll') && a.scrollWidth > a.clientWidth + 2) return a;
    }
    return null;
  }
  function reveals() {
    if (RM || !('IntersectionObserver' in window)) return;
    var first = document.body.querySelector('section, [class*="hero"]');
    var sel = 'h2, .btn-row, .faq-item, .card, [class*="-card"]:not(.glass-card), [class*="-row"]:not([data-asi-item])';
    var els = $$(sel).filter(function (el) {
      return !el.closest('.nav, .footer, .cta-band, [data-asi-chips], [data-asi-cascade], [data-asi-stack]') && !(first && first.contains(el)) && !el.closest('.asi-rv') && el.offsetParent !== null;
    });
    els.forEach(function (el) { el.classList.add('asi-rv'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        /* v1.0.6: items inside a horizontal scroll row (phone/tablet carousels) never cross the viewport
           vertically on their own, so the first one in view reveals the whole row. */
        var sc = hScroller(e.target);
        var group = sc ? $$('.asi-rv', sc).filter(function (x) { return !x.classList.contains('asi-in'); }) : [e.target];
        group.forEach(function (el, gi) {
          var sibs = el.parentNode ? $$(':scope > .asi-rv', el.parentNode) : [el];
          var i = sc ? gi : Math.max(0, sibs.indexOf(el));
          el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
          el.classList.add('asi-in');
          io.unobserve(el);
          /* v1.0.3: strip the reveal classes once done, so designed opacity (e.g. dimmed rows) comes back. */
          setTimeout(function () { el.style.transitionDelay = ''; el.classList.remove('asi-rv', 'asi-in'); }, 1400);
        });
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    /* hero: soft load-in */
    if (first) {
      var heroBits = $$('h1, .glass-card, .btn-row, [data-asi-chips] > *', first);
      heroBits.forEach(function (el, i) { el.classList.add('asi-rv'); setTimeout(function () { el.style.transitionDelay = (150 + i * 90) + 'ms'; el.classList.add('asi-in'); setTimeout(function () { el.style.transitionDelay = ''; el.classList.remove('asi-rv', 'asi-in'); }, 1600); }, 30); });
    }
  }

  /* ---------- 3. display headlines reveal word by word, line by line ---------- */
  function splitHeads() {
    if (RM) return;
    $$('[data-asi-split]').forEach(function (h) {
      if (h.querySelector('.asi-w')) return;
      var text = h.textContent.replace(/\s+/g, ' ').trim(); h.setAttribute('aria-label', text);
      h.innerHTML = text.split(' ').map(function (w) { return '<span class="asi-w" aria-hidden="true"><span class="asi-wi">' + w + '</span></span>'; }).join(' ');
      var words = $$('.asi-wi', h), top = null, line = -1;
      words.forEach(function (w) { var t = w.parentNode.offsetTop; if (t !== top) { top = t; line++; } w.style.transitionDelay = (line * 110 + 40) + 'ms'; });
      inView(h, function (on, e, io) { if (on) { h.classList.add('asi-split-in'); io.disconnect(); } }, { threshold: 0.3 });
    });
  }

  /* ---------- 4. eyebrow dot pulses once when its section arrives ---------- */
  function eyebrowPulse() {
    if (RM) return;
    $$('.eyebrow-dot').forEach(function (d) { inView(d, function (on, e, io) { if (on) { d.classList.add('asi-pulse'); io.disconnect(); } }, { threshold: 1 }); });
  }

  /* ---------- 5. FAQ: one open at a time ---------- */
  function faqs() {
    $$('[data-asi-faq]').forEach(function (list) {
      var items = $$('.faq-item', list);
      var plus = null, minus = null;
      items.forEach(function (it) { var ic = $('.faq-icon', it); if (!ic) return; if (/minus/.test(ic.src)) minus = minus || ic.src; else plus = plus || ic.src; });
      function set(it, open) {
        var a = $('.faq-a', it), ic = $('.faq-icon', it), q = $('.faq-q', it);
        if (a) { a.classList.toggle('u-hide', !open); a.style.opacity = open ? '' : '0'; if (open) requestAnimationFrame(function () { a.style.opacity = ''; }); }
        if (ic && plus && minus) ic.src = open ? minus : plus;
        if (q) q.setAttribute('aria-expanded', open ? 'true' : 'false');
        it.classList.toggle('asi-open', open);
      }
      items.forEach(function (it) {
        var q = $('.faq-q', it); if (!q) return;
        q.setAttribute('role', 'button'); q.setAttribute('tabindex', '0');
        set(it, !$('.faq-a', it) || !$('.faq-a', it).classList.contains('u-hide'));
        function toggle() { var opening = !it.classList.contains('asi-open'); items.forEach(function (o) { set(o, false); }); if (opening) set(it, true); }
        q.addEventListener('click', toggle);
        q.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      });
    });
  }

  /* ---------- 6. carousels: arrows + drag, snap to card ---------- */
  function carousels() {
    $$('[data-asi-carousel]').forEach(function (track) {
      var sec = closestSection(track);
      /* v1.0.6: snap respects the track's own padding (first card sits on the page gutter, not at x=0),
         unless the page set its own scroll-padding. */
      var ownPad = getComputedStyle(track).scrollPaddingLeft !== 'auto';
      function pad() { if (ownPad) return; var s = getComputedStyle(track); track.style.scrollPaddingLeft = s.paddingLeft; track.style.scrollPaddingRight = s.paddingRight; }
      pad(); window.addEventListener('resize', pad);
      function step() { var c = track.children[0]; if (!c) return track.clientWidth * 0.8; var gap = parseFloat(getComputedStyle(track).columnGap) || 20; return c.getBoundingClientRect().width + gap; }
      var prev = $('[data-asi-prev]', sec), next = $('[data-asi-next]', sec);
      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: RM ? 'auto' : 'smooth' }); });
      if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: RM ? 'auto' : 'smooth' }); });
      if (TOUCH) return;
      var down = false, x0 = 0, s0 = 0, moved = 0;
      track.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; down = true; moved = 0; x0 = e.clientX; s0 = track.scrollLeft; });
      window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - x0; moved = Math.max(moved, Math.abs(dx)); if (moved > 4) { track.classList.add('asi-drag'); track.scrollLeft = s0 - dx; } });
      window.addEventListener('pointerup', function () {
        if (!down) return; down = false;
        if (track.classList.contains('asi-drag')) { var w = step(), target = Math.round(track.scrollLeft / w) * w; track.classList.remove('asi-drag'); track.scrollTo({ left: target, behavior: 'smooth' }); }
      });
      track.addEventListener('click', function (e) { if (moved > 4) { e.preventDefault(); e.stopPropagation(); } }, true);
      $$('img', track).forEach(function (i) { i.setAttribute('draggable', 'false'); });
    });
  }

  /* ---------- 7. selectors / steppers / tabs with paired panes ---------- */
  function wireSet(root, opts) {
    var items = $$('[data-asi-item]', root).filter(function (it) { return it.closest(opts.scope) === root; });
    if (items.length < 2) return;
    var sec = closestSection(root);
    var panes = $$('[data-asi-pane]', opts.scope === '[data-asi-selector]' ? sec : root);
    var a = activeClassOf(items), cur = a.idx, timer = null, touched = false;
    if (panes.length === items.length) {
      var host = panes[0].parentNode; if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    }
    /* v1.0.4: the active vs inactive look is learned from the markup, for the row and every element inside it
       (e.g. a title that swaps t-step / t-step-active, a description hidden with u-hide). On each change the
       class differences move with the selection. */
    var other = a.idx === 0 ? 1 : 0;
    function nodes(el) { return [el].concat($$('*', el)); }
    function cls(n) { return typeof n.className === 'string' ? n.className.split(/\s+/) : []; }
    var tplA = nodes(items[a.idx]), tplI = nodes(items[other]), diffs = [];
    if (tplA.length === tplI.length) {
      tplA.forEach(function (n, k) {
        var ca = cls(n), ci = cls(tplI[k]);
        var onA = ca.filter(function (c) { return c && ci.indexOf(c) < 0; }), onI = ci.filter(function (c) { return c && ca.indexOf(c) < 0; });
        if (onA.length || onI.length) diffs.push({ k: k, a: onA, i: onI });
      });
    }
    function show(i) {
      cur = i;
      items.forEach(function (it, k) {
        var ns = nodes(it);
        if (diffs.length && ns.length === tplA.length) {
          diffs.forEach(function (d) { var n = ns[d.k]; d.a.concat(d.i).forEach(function (c) { n.classList.remove(c); }); (k === i ? d.a : d.i).forEach(function (c) { n.classList.add(c); }); });
        } else if (a.cls) it.classList.toggle(a.cls, k === i); else it.style.opacity = k === i ? '1' : '.45';
        it.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
      /* v1.0.2: panes hidden with u-hide in the Designer are handed to the crossfade instead. */
      if (panes.length === items.length) panes.forEach(function (p, k) { p.classList.remove('u-hide'); p.classList.toggle('asi-pane-off', k !== i); });
      /* v1.1.0 (R-09): a pane that holds a chart regrows its bars each time it is shown. */
      if (ready && panes[i]) { var ch = $('[data-asi-chart]', panes[i]); if (ch && ch.__asiGrow) ch.__asiGrow(); }
    }
    var ready = false;
    items.forEach(function (it, k) {
      it.setAttribute('tabindex', '0'); it.setAttribute('role', 'tab');
      it.addEventListener(opts.hover && !TOUCH ? 'mouseenter' : 'click', function (e) {
        if (it.tagName === 'A' && !opts.hover && cur !== k) e.preventDefault();
        touched = true; show(k);
      });
      it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); touched = true; show(k); } });
    });
    show(cur); ready = true;
    if (opts.auto && !RM) {
      var visible = false;
      inView(root, function (on) { visible = on; }, { threshold: 0.3 });
      timer = setInterval(function () { if (visible && !touched && !document.hidden) show((cur + 1) % items.length); }, opts.auto);
    }
  }
  function selectors() { $$('[data-asi-selector]').forEach(function (r) { wireSet(r, { scope: '[data-asi-selector]', auto: 6000 }); }); }
  function accordions() { $$('[data-asi-accordion]').forEach(function (r) { wireSet(r, { scope: '[data-asi-accordion]', hover: true }); }); }

  /* ---------- 8. bar charts grow in, then breathe ---------- */
  function charts() {
    $$('[data-asi-chart]').forEach(function (chart) {
      var bars = $$('[data-asi-bar]', chart);
      /* v1.0.1: Webflow cannot hold inline heights, so bars carry data-asi-value (percent) or a class height. */
      var targets = bars.map(function (b) { var dv = b.getAttribute('data-asi-value'); if (dv) return parseFloat(dv) + '%'; var h = b.style.height; if (h) return h; var ph = b.parentNode.getBoundingClientRect().height; return ph ? (b.getBoundingClientRect().height / ph * 100).toFixed(1) + '%' : getComputedStyle(b).height; });
      if (RM) return;
      bars.forEach(function (b) { b.style.transition = 'none'; b.style.height = '0%'; void b.offsetHeight; b.style.transition = ''; });
      chart.__asiGrow = function () {
        bars.forEach(function (b) { b.style.transition = 'none'; b.style.height = '0%'; void b.offsetHeight; b.style.transition = ''; });
        bars.forEach(function (b, i) { setTimeout(function () { b.style.height = targets[i]; }, 80 + i * 90); });
      };
      inView(chart, function (on, e, io) {
        if (!on) return; io.disconnect();
        bars.forEach(function (b, i) { setTimeout(function () { b.style.height = targets[i]; }, i * 90); });
        setTimeout(function () {
          setInterval(function () {
            if (document.hidden) return;
            bars.forEach(function (b, i) { var t = parseFloat(targets[i]); if (isNaN(t) || !/%$/.test(targets[i])) return; b.style.height = Math.max(4, Math.min(100, t * (0.96 + Math.random() * 0.08))).toFixed(1) + '%'; });
          }, 2600);
        }, 1600);
      }, { threshold: 0.35 });
    });
  }

  /* ---------- 9. counters count up to their printed value ---------- */
  function counters() {
    if (RM) return;
    $$('[data-asi-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-asi-count')); if (isNaN(target)) return;
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false), node = null, n;
      while ((n = walker.nextNode())) { if (/\d/.test(n.nodeValue)) { node = n; break; } }
      if (!node) return;
      var orig = node.nodeValue, m = orig.match(/[\d,]+(\.\d+)?/); if (!m) return;
      var dec = m[1] ? m[1].length - 1 : 0;
      function paint(v) { node.nodeValue = orig.replace(m[0], v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })); }
      paint(0);
      inView(el, function (on, e, io) {
        if (!on) return; io.disconnect();
        var t0 = performance.now(), dur = 1300;
        (function tick(now) { var p = Math.min(1, (now - t0) / dur); paint(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
      }, { threshold: 0.5 });
    });
  }

  /* ---------- 10. plant diagram hotspots: pulse, preview on hover, pin on click, idle advance ---------- */
  function hotspots() {
    var groups = {};
    $$('[data-asi-hotspot]').forEach(function (h) { var s = closestSection(h); (groups[s.__asiId || (s.__asiId = Math.random())] = groups[s.__asiId] || { sec: s, list: [] }).list.push(h); });
    Object.keys(groups).forEach(function (k) {
      var g = groups[k], tag = $('[data-asi-tag]', g.sec), cur = -1, pinned = false, last = Date.now();
      if (!tag) return;
      var host = tag.offsetParent || tag.parentNode;
      var labelEl = $('p, div', tag) || tag;
      g.list.forEach(function (h) { if (getComputedStyle(h).position === 'static') h.style.position = 'relative'; if (!RM) { var r = document.createElement('span'); r.className = 'asi-ring'; h.appendChild(r); } });
      function show(i) {
        cur = i; last = Date.now();
        var h = g.list[i], hr = h.getBoundingClientRect(), pr = host.getBoundingClientRect();
        var label = h.getAttribute('data-asi-label');
        if (label) { var parts = label.split('|'); var lines = $$('p', tag); if (lines.length >= 2 && parts.length >= 2) { lines[0].textContent = parts[0]; lines[1].textContent = parts[1]; } else if (lines.length) lines[0].textContent = parts[0]; else labelEl.textContent = parts[0]; }
        tag.style.position = 'absolute';
        tag.style.left = (hr.left - pr.left + hr.width / 2 + 14) + 'px';
        tag.style.top = (hr.top - pr.top - tag.offsetHeight - 10) + 'px';
      }
      g.list.forEach(function (h, i) {
        h.setAttribute('tabindex', '0'); h.setAttribute('role', 'button'); if (h.getAttribute('data-asi-label')) h.setAttribute('aria-label', h.getAttribute('data-asi-label').replace('|', ': '));
        if (!TOUCH) h.addEventListener('mouseenter', function () { if (!pinned) show(i); });
        h.addEventListener('click', function () { pinned = true; show(i); });
        h.addEventListener('focus', function () { show(i); });
      });
      window.addEventListener('resize', function () { if (cur > -1) show(cur); });
      if (!RM) setInterval(function () { if (!document.hidden && !pinned && Date.now() - last > 6800) show((cur + 1) % g.list.length); }, 1000);
    });
  }


  /* ---------- 12. live plant layouts: the ASI plant visualizer, embedded where data-asi-live is set ----------
     v1.0.5: the value is the visualizer link's query string. Loads when the slot nears the viewport, fades in
     over the still once it has had time to draw, and hides the page's static dots and tag. Scroll-zoom is off
     (orbit=0) so the page keeps scrolling. Phones and reduced-motion keep the still image. */
  var VIZ = 'https://asi-plant-visualizer.vercel.app/?';
  var VIZ_ORIGIN = 'https://asi-plant-visualizer.vercel.app';
  /* v1.2.0: true when this slot will get the live embed (so the video loop stays off there). */
  function liveAllowed() { return !RM && window.innerWidth >= 768; }
  var liveFrames = [];   /* { f, wrap, sec, on } */
  function postTo(rec, msg) { try { rec.f.contentWindow.postMessage(msg, VIZ_ORIGIN); } catch (e) {} }
  /* Messages from the visualizer: only its own origin, matched to the iframe that sent them. */
  var vizHandlers = {};
  function onViz(type, fn) { (vizHandlers[type] = vizHandlers[type] || []).push(fn); }
  window.addEventListener('message', function (e) {
    if (e.origin !== VIZ_ORIGIN || !e.data || typeof e.data !== 'object') return;
    var rec = null; for (var i = 0; i < liveFrames.length; i++) if (liveFrames[i].f.contentWindow === e.source) rec = liveFrames[i];
    if (!rec) return;
    (vizHandlers[e.data.type] || []).forEach(function (fn) { try { fn(e.data, rec); } catch (er) {} });
  });
  function liveViews() {
    if (!liveAllowed()) return;
    $$('[data-asi-live]').forEach(function (wrap) {
      var q = wrap.getAttribute('data-asi-live'); if (!q) return;
      if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
      var scene = /(^|&)scene=/.test(q);
      var started = false;
      inView(wrap, function (on, e, io) {
        if (!on || started) return; started = true; io.disconnect();
        var f = document.createElement('iframe');
        f.className = 'asi-live'; f.title = wrap.getAttribute('data-asi-live-title') || 'Live plant view';
        f.setAttribute('loading', 'lazy'); f.setAttribute('allow', 'fullscreen');
        f.src = VIZ + q + (/(^|&)bare(&|$)/.test(q) ? '' : '&bare') + '&ui=0&orbit=0';
        var still = $('img', wrap);
        if (still && still.nextSibling) wrap.insertBefore(f, still.nextSibling); else wrap.appendChild(f);
        var rec = { f: f, wrap: wrap, sec: closestSection(wrap), on: false, scene: scene };
        liveFrames.push(rec);
        if (scene) coverFrame(rec, still);
        f.addEventListener('load', function () {
          setTimeout(function () {
            f.classList.add('asi-on'); rec.on = true; if (rec.sec) rec.sec.classList.add('asi-live-on');
            postTo(rec, { type: 'asi:hello' });
            /* R-21: a scene opened frozen on the still's frame starts moving once it has faded in */
            if (scene) setTimeout(function () { postTo(rec, { type: 'asi:play' }); }, 850);
          }, 1800);
        });
      }, { rootMargin: '300px 0px', threshold: 0 });
    });
  }
  /* R-21: the rock scene is framed like its 3:2 still (object-fit: cover), so the iframe takes the still's
     cover box and the first frame lands on the picture. Page scroll through the hero adds a turn (?spin). */
  function coverFrame(rec, still) {
    var wrap = rec.wrap, f = rec.f;
    wrap.style.overflow = 'hidden';
    function fit() {
      var W = wrap.clientWidth, H = wrap.clientHeight, ar = 1.5;
      if (still && still.naturalWidth) ar = still.naturalWidth / still.naturalHeight;
      var k = Math.max(W / ar, H), bw = k * ar, bh = k;
      f.style.width = bw + 'px'; f.style.height = bh + 'px'; f.style.left = ((W - bw) / 2) + 'px'; f.style.top = ((H - bh) / 2) + 'px';
    }
    fit(); window.addEventListener('resize', fit);
    if (still && !still.complete) still.addEventListener('load', fit);
    var lastP = -1;
    onFrame(function () {
      if (!rec.on) return;
      var r = rec.sec.getBoundingClientRect(), z = zoomOf();
      var p = clamp(-r.top / Math.max(1, r.height), 0, 1); if (z && Math.abs(p - lastP) < 0.002) return;
      lastP = p; postTo(rec, { type: 'asi:scroll', p: p });
    });
  }

  /* R-20: the hero's "Basalt Rock" chips ride on the rocks. The embed posts each rock's card anchor (0..1 of the
     frame, largest rock first). Chips pair with rocks by their printed tonnage. */
  var ROCK_TONS = ['14.45', '10.23', '6.98', '4.52'];
  function liveChips() {
    var first = null;
    onViz('asi:anchors', function (m, rec) {
      if (!rec.scene || !m.pts) return;
      var layer = $('[data-asi-chips]', rec.sec); if (!layer) return;
      if (!rec.chips) {
        rec.chips = layer.__asiRocks || [];
        rec.chips.forEach(function (c) { if (c) c.style.transition = 'opacity .4s'; });
      }
      var f = rec.f, fw = f.offsetWidth, fh = f.offsetHeight, fx = f.offsetLeft, fy = f.offsetTop;
      if (!rec.a0) rec.a0 = m.pts.map(function (q) { return [q[0], q[1]]; });
      /* the scene starts from the still's frame with the chips where Figma put them; once the rocks move, each
         chip eases onto its rock (bottom-left corner just beside the rock's anchor) and then rides it */
      if (!rec.t0 && m.pts.some(function (q, i) { return Math.abs(q[0] - rec.a0[i][0]) + Math.abs(q[1] - rec.a0[i][1]) > 0.002; })) rec.t0 = performance.now();
      var k = rec.t0 ? clamp((performance.now() - rec.t0) / 1400, 0, 1) : 0; k = k * k * (3 - 2 * k);
      rec.chips.forEach(function (c, i) {
        var q = m.pts[i]; if (!c || !q) return;
        var tx = fx + q[0] * fw + 10 - c.offsetLeft, ty = fy + q[1] * fh - 6 - c.offsetHeight - c.offsetTop;
        c.style.transform = 'translate(' + (tx * k).toFixed(1) + 'px,' + (ty * k).toFixed(1) + 'px)';
        c.style.opacity = q[2] === 0 ? '0' : '';
      });
    });
    /* pair chips with rocks by their printed tonnage (before the readings start to drift), then let them drift */
    $$('[data-asi-chips]').forEach(function (layer) {
      if (RM || !$('[data-asi-live*="anchors"]', closestSection(layer))) return;
      layer.__asiRocks = ROCK_TONS.map(function (t) { return $$(':scope > *', layer).filter(function (c) { return c.textContent.indexOf(t) > -1; })[0] || null; });
      $$(':scope > *', layer).forEach(function (c) { driftNumber(c, 0.03, 0.012, 1500); });
    });
  }
  function driftNumber(el, range, step, every) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false), n, node = null;
    while ((n = walker.nextNode())) { if (/\d/.test(n.nodeValue)) { node = n; break; } }
    if (!node) return null;
    var st = { node: node, orig: node.nodeValue, timer: null };
    function arm() {
      var mm = st.orig.match(/\d[\d,]*(\.\d+)?/); if (!mm) return;
      var raw = mm[0].replace(/,/g, ''), bv = parseFloat(raw), dec = mm[1] ? mm[1].length - 1 : 0, v = bv;
      var lo = bv * (1 - range), hi = bv * (1 + range);
      if (dec === 0 && hi - lo < 2) { lo = Math.max(0, bv - 1); hi = bv + 1; }
      clearInterval(st.timer);
      st.timer = setInterval(function () {
        if (document.hidden) return;
        v = clamp(v + (Math.random() - 0.5) * bv * step * 2, lo, hi);
        var txt = dec ? v.toFixed(dec) : String(Math.round(v));
        if (/,/.test(mm[0])) txt = Number(txt).toLocaleString('en-US');
        st.node.nodeValue = st.orig.replace(mm[0], txt);
      }, every + Math.random() * 900);
    }
    st.reset = function (text) { st.orig = text; st.node.nodeValue = text; if (!RM) arm(); };
    if (!RM) arm();
    return st;
  }

  /* R-23 / R-27: cards that follow the live plant. Any [data-asi-follow-*] field in a section with a live plant
     shows the item the embed has selected (hover, click or idle advance there). Section arrows step the embed.
     Without the embed (phones, reduced motion) the card keeps its designed default item; arrows cycle the same
     items locally. Item copy and renders come from the plant visualizer (Site Tracking). */
  var VIZ_IMG = VIZ_ORIGIN + '/section/';
  var PLANT_ITEMS = [
    { id: 'hopper', label: 'Dump hopper', sub: 'Level-driven feed', body: 'Hopper level sets the feeder speed, so the primary runs choke-fed instead of starving and flooding.', metric: ['Dump hopper', 74, '% level'] },
    { id: 'jaw', label: 'Primary jaw', sub: 'Motor load, live', body: 'Motor load and chamber level stream to the control room, so the feeder backs off before a stall, not after.', metric: ['Primary jaw CR-1', 212, 'A'] },
    { id: 'pile', label: 'Surge pile', sub: 'Tonnage on hand', body: 'Belt scales keep a running tonnage for every pile, ready for the morning report without a walk round the yard.', metric: ['Surge pile', 1240, 'Tons'] },
    { id: 'screen', label: 'Screens', sub: 'Vibration and bearing heat', body: 'Vibration and temperature are trended on every deck, so wear shows up as a curve on a screen, not a shutdown.', metric: ['Screen SC-1', 71, 'A'] },
    { id: 'cone', label: 'Cone crushers', sub: 'Setting held to spec', body: 'Setting, power draw and cavity level are logged continuously, and the automation trims the setting to keep the product in spec.', metric: ['Secondary cone CR-2', 238, 'A'] },
    { id: 'stacker', label: 'Radial stackers', sub: 'Pile patterns, automated', body: 'Stackers swing and raise on a programmed pattern, so piles stay clean and segregation stays low.', metric: ['Stacker S-1', 22, 'A'] },
    { id: 'ehouse', label: 'E-House', sub: 'The plant in one room', body: 'Drives, controls and power distribution sit together in one prefabricated house, wired and tested before it ships.', metric: ['E-House', 412, 'kW'] }
  ];
  function fmtMetric(v, unit) { return (v >= 1000 ? Number(v).toLocaleString('en-US') : String(v)) + ' ' + unit; }
  function followers() {
    var groups = [];
    $$('[data-asi-follow-label],[data-asi-follow-body],[data-asi-follow-img],[data-asi-follow-metric]').forEach(function (el) {
      var sec = closestSection(el), g = null;
      for (var i = 0; i < groups.length; i++) if (groups[i].sec === sec) g = groups[i];
      if (!g) { g = { sec: sec, idx: 0, drift: null }; groups.push(g); }
    });
    groups.forEach(function (g) {
      var f = function (k) { return $$('[data-asi-follow-' + k + ']', g.sec); };
      var metricEl = f('metric')[0];
      if (metricEl) g.drift = driftNumber(metricEl, 0.03, 0.01, 1600);
      /* the images' rendering box stays put while the picture swaps */
      g.apply = function (it) {
        f('label').forEach(function (e) { e.textContent = it.label; });
        f('sub').forEach(function (e) { e.textContent = it.sub; });
        f('body').forEach(function (e) { e.textContent = it.body; });
        f('metric-label').forEach(function (e) { e.textContent = it.metric[0]; });
        if (g.drift) g.drift.reset(fmtMetric(it.metric[1], it.metric[2])); else if (metricEl) metricEl.textContent = fmtMetric(it.metric[1], it.metric[2]);
        f('img').forEach(function (e) {
          var src = it.image || (VIZ_IMG + it.id + '.png');
          if (e.getAttribute('src') === src) return;
          e.removeAttribute('srcset'); e.removeAttribute('sizes');
          e.style.transition = 'opacity .25s'; e.style.opacity = '0';
          var im = new Image(); im.onload = im.onerror = function () { e.src = src; e.alt = it.label + ' render'; e.style.opacity = ''; }; im.src = src;
        });
      };
      /* arrows: step the embed when it is live, else the local list. Capture phase, so the page's carousel
         stepping and the href="#" jump never run for these. */
      g.sec.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('[data-asi-prev],[data-asi-next]'); if (!a || !g.sec.contains(a)) return;
        e.preventDefault(); e.stopPropagation();
        var dir = a.hasAttribute('data-asi-next') ? 1 : -1, rec = liveOf(g.sec);
        if (rec) postTo(rec, { type: dir > 0 ? 'asi:next' : 'asi:prev' });
        else { g.idx = (g.idx + dir + PLANT_ITEMS.length) % PLANT_ITEMS.length; g.apply(PLANT_ITEMS[g.idx]); }
      }, true);
    });
    function liveOf(sec) { for (var i = 0; i < liveFrames.length; i++) if (liveFrames[i].sec === sec && liveFrames[i].on && !liveFrames[i].scene) return liveFrames[i]; return null; }
    onViz('asi:select', function (m, rec) {
      groups.forEach(function (g) {
        if (g.sec !== rec.sec || !m.id) return;
        var base = null; for (var i = 0; i < PLANT_ITEMS.length; i++) if (PLANT_ITEMS[i].id === m.id) { base = PLANT_ITEMS[i]; g.idx = i; }
        var it = {
          id: m.id, label: m.label || (base && base.label) || m.id, sub: m.sub || (base && base.sub) || '',
          body: m.body || (base && base.body) || '', image: m.image,
          metric: m.metric ? [m.metric.label, m.metric.value, m.metric.unit] : (base ? base.metric : ['', '', ''])
        };
        g.apply(it);
      });
    });
  }

  /* ---------- 11. video loops over still images; hero chips track the drone footage ---------- */
  function videos() {
    if (RM || !BASE) return;
    var saveData = navigator.connection && navigator.connection.saveData;
    $$('[data-asi-video]').forEach(function (wrap) {
      var slot = SLOT[wrap.getAttribute('data-asi-video')]; var key = slot && slot.v; if (!key || !VIDEO[key] || saveData) return;
      if (wrap.hasAttribute('data-asi-live') && liveAllowed()) return;   /* v1.2.0: the live scene replaces the loop */
      var still = $('img', wrap);
      if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
      var v = document.createElement('video');
      v.className = 'asi-video'; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'none';
      v.setAttribute('aria-hidden', 'true');
      if (still) { var cs = getComputedStyle(still); v.style.objectFit = cs.objectFit || 'cover'; v.style.objectPosition = cs.objectPosition; v.style.borderRadius = cs.borderRadius; }
      if (slot.filter) v.style.filter = slot.filter;
      v.src = BASE + VIDEO[key];
      if (still && still.nextSibling) wrap.insertBefore(v, still.nextSibling); else wrap.appendChild(v);
      v.addEventListener('playing', function () { v.classList.add('asi-on'); });
      inView(wrap, function (on) { if (on) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }, { threshold: 0.05 });
      if (key === 'hero-drone') trackChips(wrap, v);
    });
  }
  function trackChips(root, video) {
    var layer = $('[data-asi-chips]', closestSection(root)); if (!layer) return;
    var chips = $$(':scope > *', layer);
    var T = null;
    var x = new XMLHttpRequest(); x.open('GET', BASE + 'track.json'); x.onload = function () { try { T = JSON.parse(x.responseText); start(); } catch (e) {} }; x.send();
    function start() {
      var W, H, s, ox, oy, base = [];
      function measure() {
        W = root.clientWidth; H = root.clientHeight; s = Math.max(W / T.w, H / T.h); ox = (W - T.w * s) / 2; oy = (H - T.h * s) / 2;
        var rr = root.getBoundingClientRect();
        base = chips.map(function (c) { c.style.transform = ''; var r = c.getBoundingClientRect(); return [((r.left - rr.left) + r.width / 2 - ox) / s, ((r.top - rr.top) + r.height - oy) / s]; });
      }
      measure(); window.addEventListener('resize', measure);
      function mAt(t) { var f = Math.min(T.m.length - 1, Math.max(0, t * T.fps)), i = Math.floor(f), j = Math.min(T.m.length - 1, i + 1), a = f - i; return T.m[i].map(function (v, k) { return v + (T.m[j][k] - v) * a; }); }
      function render(t) {
        var m = mAt(t);
        chips.forEach(function (c, i) { var p = base[i]; var nx = m[0] * p[0] + m[1] * p[1] + m[2], ny = m[3] * p[0] + m[4] * p[1] + m[5]; c.style.transform = 'translate(' + ((nx - p[0]) * s).toFixed(1) + 'px,' + ((ny - p[1]) * s).toFixed(1) + 'px)'; });
      }
      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) { (function step() { video.requestVideoFrameCallback(function (now, meta) { render(meta.mediaTime); step(); }); })(); }
      else (function loop() { render(video.currentTime); requestAnimationFrame(loop); })();
      /* readings drift a little around their printed value */
      chips.forEach(function (c) {
        var walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT, null, false), n, node = null;
        while ((n = walker.nextNode())) { if (/\d+\.\d+/.test(n.nodeValue)) { node = n; break; } }
        if (!node) return;
        var orig = node.nodeValue, m = orig.match(/\d+\.\d+/), basev = parseFloat(m[0]), dec = m[0].split('.')[1].length, v = basev;
        setInterval(function () { if (document.hidden) return; v = Math.min(basev * 1.03, Math.max(basev * 0.97, v + (Math.random() - 0.5) * basev * 0.012)); node.nodeValue = orig.replace(m[0], v.toFixed(dec)); }, 1500 + Math.random() * 900);
      });
    }
  }

  /* =====================================================================================================
     v1.1.0 modules (review round, Phase 2)
     ===================================================================================================== */
  var DESK = window.matchMedia ? window.matchMedia('(min-width: 992px)') : { matches: true };
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  /* The page is zoomed x1.333 at >=1920 (site head code). Layout px = screen px / zoom. */
  function zoomOf() { var z = parseFloat(getComputedStyle(document.documentElement).zoom); return z > 0 ? z : 1; }
  /* One rAF-throttled scroll/resize loop shared by every scrubbed module. */
  var frameFns = [], framePending = false;
  function onFrame(fn) {
    frameFns.push(fn);
    if (frameFns.length === 1) {
      var kick = function () { if (framePending) return; framePending = true; requestAnimationFrame(function () { framePending = false; frameFns.forEach(function (f) { try { f(); } catch (e) {} }); }); };
      window.addEventListener('scroll', kick, { passive: true });
      window.addEventListener('resize', kick);
      if (DESK.addEventListener) DESK.addEventListener('change', kick);
      setTimeout(kick, 60);
    }
  }

  /* ---------- R-02: nav eases up and fades on scroll down, returns on any scroll up ---------- */
  function navAutoHide() {
    if (RM) return;
    var nav = $('.nav'); if (!nav) return;
    var lastY = window.scrollY, acc = 0, hidden = false;
    nav.style.transition = 'transform .45s ' + EASE + ',opacity .35s ' + EASE;
    function menuOpen() { return !!$('.nav-mobile.asi-open, .nav-dd-menu.asi-open', nav) || !!nav.querySelector(':focus'); }
    function set(h) {
      if (h === hidden) return; hidden = h;
      nav.style.transform = h ? 'translateY(calc(-100% - 28px))' : '';
      nav.style.opacity = h ? '0' : '';
      nav.style.pointerEvents = h ? 'none' : '';
    }
    window.addEventListener('scroll', function () {
      var y = window.scrollY, d = y - lastY; lastY = y;
      if (y < 80 || menuOpen()) { acc = 0; set(false); return; }
      if ((d > 0) !== (acc > 0)) acc = 0;
      acc += d;
      if (acc > 10) set(true); else if (acc < -6) set(false);
    }, { passive: true });
    nav.addEventListener('focusin', function () { set(false); });
  }

  /* ---------- R-31 / R-32 / R-35: list rows scale, fade and sharpen into place once, one after another ---------- */
  function cascades() {
    if (RM || !('IntersectionObserver' in window)) return;
    $$('[data-asi-cascade]').forEach(function (list) {
      var kids = $$(':scope > *', list); if (!kids.length) return;
      /* hide instantly (no transition, no stagger), then arm the staggered reveal */
      kids.forEach(function (k) { k.style.transition = 'none'; });
      list.classList.add('asi-cas-wait');
      void list.offsetHeight;
      kids.forEach(function (k, i) { k.style.transition = ''; k.style.transitionDelay = (i * 170) + 'ms'; });
      inView(list, function (on, e, io) {
        if (!on) return; io.disconnect();
        requestAnimationFrame(function () { list.classList.remove('asi-cas-wait'); });
        setTimeout(function () { kids.forEach(function (k) { k.style.transitionDelay = ''; k.style.transition = 'none'; }); }, 1000 + kids.length * 170);
      }, { threshold: 0.35 });
    });
  }

  /* ---------- R-14: Services cards start tucked beneath the card above, smaller and blurred, and grow,
     sharpen and settle as you scroll (scrubbed both ways). Below 992 px: a plain stacked list. ---------- */
  function parseRGBA(s) { var m = (s || '').match(/[\d.]+/g); if (!m) return null; return [+m[0], +m[1], +m[2], m.length > 3 ? +m[3] : 1]; }
  function solidBehind(el) {
    for (var a = el.parentElement; a; a = a.parentElement) { var c = parseRGBA(getComputedStyle(a).backgroundColor); if (c && c[3] > 0.99) return c; }
    return [255, 255, 255, 1];
  }
  function stacks() {
    if (RM) return;
    $$('[data-asi-stack]').forEach(function (list) {
      var cards = $$(':scope > *', list); if (cards.length < 2) return;
      if (getComputedStyle(list).position === 'static') list.style.position = 'relative';
      var own = parseRGBA(getComputedStyle(cards[0]).backgroundColor), under = solidBehind(list);
      var solid = own && own[3] < 1 ? 'rgb(' + [0, 1, 2].map(function (k) { return Math.round(own[k] * own[3] + under[k] * (1 - own[3])); }).join(',') + ')' : '';
      function reset() { cards.forEach(function (c) { c.style.transform = ''; c.style.filter = ''; c.style.opacity = ''; c.style.zIndex = ''; c.style.backgroundColor = ''; }); }
      onFrame(function () {
        if (!DESK.matches) { reset(); return; }
        var lr = list.getBoundingClientRect(), z = list.offsetHeight ? lr.height / list.offsetHeight : 1, vh = window.innerHeight;
        cards.forEach(function (c, i) {
          c.style.zIndex = String(cards.length - i);
          if (solid) c.style.backgroundColor = solid;
          if (i === 0) return;
          var top = lr.top + c.offsetTop * z;                       /* layout position, ignores our own transform */
          var p = clamp((vh * 0.95 - top) / (vh * 0.45), 0, 1), e = 1 - Math.pow(1 - p, 2);
          c.style.transformOrigin = '50% 0';
          c.style.transform = 'translateY(' + (-(1 - e) * 150).toFixed(1) + 'px) scale(' + (0.86 + 0.14 * e).toFixed(4) + ')';
          c.style.filter = e > 0.995 ? '' : 'blur(' + ((1 - e) * 8).toFixed(2) + 'px)';
          c.style.opacity = (0.35 + 0.65 * e).toFixed(3);
        });
      });
    });
  }

  /* ---------- R-16: statement pins for about one viewport while each word goes from 50% to full strength ---------- */
  function readthroughs() {
    if (RM) return;
    $$('[data-asi-readthrough]').forEach(function (sec) {
      var p = $('p, h2, h3', sec); if (!p) return;
      var inner = p.parentNode;
      var text = p.textContent.replace(/\s+/g, ' ').trim();
      p.innerHTML = text.split(' ').map(function (w) { return '<span class="asi-rt">' + w + '</span>'; }).join(' ');
      var words = $$('.asi-rt', p), n = words.length, pinned = null;
      function layout() {
        var on = DESK.matches;
        if (on === pinned && !on) return;
        pinned = on;
        if (!on) {
          ['height', 'paddingTop', 'paddingBottom', 'overflow'].forEach(function (k) { sec.style[k] = ''; });
          ['position', 'top', 'height', 'display', 'flexDirection', 'justifyContent'].forEach(function (k) { inner.style[k] = ''; });
          words.forEach(function (w) { w.style.opacity = ''; });
          return;
        }
        var vh = window.innerHeight / zoomOf();
        sec.style.paddingTop = '0px'; sec.style.paddingBottom = '0px'; sec.style.overflow = 'clip';
        sec.style.height = Math.round(vh * 2) + 'px';
        inner.style.position = 'sticky'; inner.style.top = '0px'; inner.style.height = Math.round(vh) + 'px';
        inner.style.display = 'flex'; inner.style.flexDirection = 'column'; inner.style.justifyContent = 'center';
      }
      onFrame(function () {
        layout(); if (!DESK.matches) return;
        var r = sec.getBoundingClientRect(), total = r.height - window.innerHeight;
        var pr = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
        words.forEach(function (w, i) { w.style.opacity = (0.5 + 0.5 * clamp(pr * (n + 2) - i, 0, 1)).toFixed(3); });
      });
    });
  }

  /* ---------- R-24: a Go Green line traces the existing rule as you scroll; markers turn green as it reaches them ---------- */
  function progressLines() {
    if (RM) return;
    $$('[data-asi-progress]').forEach(function (list) {
      var rule = $('[class*="-rule"]', list); if (!rule) return;
      var markers = $$('[class*="-marker"]', list);
      var fill = document.createElement('div'); fill.className = 'asi-progress-fill'; fill.setAttribute('aria-hidden', 'true');
      list.insertBefore(fill, rule.nextSibling);
      onFrame(function () {
        var on = DESK.matches && getComputedStyle(rule).display !== 'none';
        fill.style.display = on ? '' : 'none'; rule.style.opacity = on ? '0.5' : '';
        if (!on) { markers.forEach(function (m) { m.style.backgroundColor = ''; }); return; }
        var lr = list.getBoundingClientRect(), rr = rule.getBoundingClientRect(), z = list.offsetHeight ? lr.height / list.offsetHeight : 1;
        var head = clamp(window.innerHeight * 0.55 - rr.top, 0, rr.height);
        fill.style.left = ((rr.left - lr.left) / z).toFixed(1) + 'px'; fill.style.top = ((rr.top - lr.top) / z).toFixed(1) + 'px';
        fill.style.width = (rr.width / z).toFixed(1) + 'px'; fill.style.height = (head / z).toFixed(1) + 'px';
        markers.forEach(function (m) { var mr = m.getBoundingClientRect(); m.style.backgroundColor = rr.top + head >= mr.top + mr.height / 2 ? GREEN : ''; });
      });
    });
  }

  /* ---------- R-30: endless carousels. One copy of the cards sits on each side of the originals; when the track
     comes to rest past the middle set, it jumps by exactly one set, so the view never changes. ---------- */
  function loops() {
    /* v1.1.1 (Q6): every carousel with its own arrows loops, plus anything marked data-asi-loop. Arrows hidden in the
       Designer (e.g. Home careers, R-12) mean the row is swipe-only and does not loop. */
    $$('[data-asi-loop], [data-asi-carousel]').filter(function (track) {
      if (track.hasAttribute('data-asi-loop')) return true;
      var arrow = $('[data-asi-next], [data-asi-prev]', closestSection(track));
      return !!arrow && !arrow.closest('.u-hide');
    }).forEach(function (track) {
      var orig = $$(':scope > *', track).filter(function (el) { return getComputedStyle(el).display !== 'none'; }); if (orig.length < 2) return;   /* v1.3.0: hidden cards stay out */
      function clone(el) {
        var c = el.cloneNode(true);
        c.setAttribute('aria-hidden', 'true'); c.classList.add('asi-clone');
        [c].concat($$('*', c)).forEach(function (n) { n.classList.remove('asi-rv', 'asi-in'); n.removeAttribute('data-asi-video'); if (/^(A|BUTTON)$/.test(n.tagName)) n.setAttribute('tabindex', '-1'); });
        c.style.transitionDelay = '';
        return c;
      }
      /* Grid tracks (Partners, Contact at desktop) would wrap the copies onto new rows: lay them out as one row
         of columns the same width as the designed ones. */
      var gcs = getComputedStyle(track);
      if (gcs.display === 'grid' || gcs.display === 'inline-grid') {
        var n = gcs.gridTemplateColumns.split(' ').filter(Boolean).length || orig.length, gap = parseFloat(gcs.columnGap) || 0;
        track.style.gridTemplateColumns = 'none'; track.style.gridAutoFlow = 'column';
        track.style.gridAutoColumns = 'calc((100% - ' + ((n - 1) * gap) + 'px) / ' + n + ')';
      }
      var before = orig.map(clone), after = orig.map(clone);
      before.forEach(function (c) { track.insertBefore(c, orig[0]); });
      after.forEach(function (c) { track.appendChild(c); });
      function setW() { return orig[0].offsetLeft - before[0].offsetLeft; }
      function jump(d) {
        var snap = track.style.scrollSnapType, beh = track.style.scrollBehavior;
        track.style.scrollSnapType = 'none'; track.style.scrollBehavior = 'auto';
        track.scrollLeft += d;
        requestAnimationFrame(function () { track.style.scrollSnapType = snap; track.style.scrollBehavior = beh; });
      }
      function home() { var snap = track.style.scrollSnapType; track.style.scrollSnapType = 'none'; track.scrollLeft = setW(); requestAnimationFrame(function () { track.style.scrollSnapType = snap; }); }
      function wrap() {
        if (track.classList.contains('asi-drag')) return;
        var W = setW(), s = track.scrollLeft;
        if (W <= 0) return;
        if (s < W * 0.5) jump(W); else if (s >= W * 1.5) jump(-W);
      }
      home();
      window.addEventListener('load', home);
      window.addEventListener('resize', function () { var W = setW(); var s = track.scrollLeft % W; track.scrollLeft = W + s; });
      var t;
      track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(wrap, 160); }, { passive: true });
      if ('onscrollend' in window) track.addEventListener('scrollend', wrap);
    });
  }

  /* ---------- R-34: KPI hero chips orbit the ASI mark slowly on a shared ellipse, staying upright ---------- */
  function orbits() {
    if (RM) return;
    $$('[data-asi-orbit]').forEach(function (layer) {
      var mark = $('[class*="mark"]', layer); if (!mark) return;
      var chips = $$(':scope > *', layer).filter(function (c) { return c !== mark; });
      var RX = 230, RY = 120, PERIOD = 70000;
      var cx, cy, base = [], t0 = null, visible = true, started = false;
      function measure() {
        cx = mark.offsetLeft + mark.offsetWidth / 2; cy = mark.offsetTop + mark.offsetHeight / 2;
        base = chips.map(function (c) { var bx = c.offsetLeft + c.offsetWidth / 2, by = c.offsetTop + c.offsetHeight / 2; return { x: bx, y: by, a: Math.atan2((by - cy) / RY, (bx - cx) / RX) }; });
      }
      function frame(now) {
        if (!visible || document.hidden || getComputedStyle(layer).display === 'none') { t0 = null; requestAnimationFrame(frame); return; }
        if (t0 === null) t0 = now - (frame.elapsed || 0);
        var el = now - t0; frame.elapsed = el;
        var ease = clamp(el / 2200, 0, 1); ease = ease * ease * (3 - 2 * ease);       /* glide from the drawn spots onto the orbit */
        var ang = (el / PERIOD) * Math.PI * 2;
        chips.forEach(function (c, i) {
          var b = base[i], tx = cx + RX * Math.cos(b.a + ang) - b.x, ty = cy + RY * Math.sin(b.a + ang) - b.y;
          c.style.transform = 'translate(' + (tx * ease).toFixed(2) + 'px,' + (ty * ease).toFixed(2) + 'px)';
        });
        requestAnimationFrame(frame);
      }
      inView(layer, function (on) { visible = on; }, { threshold: 0 });
      /* wait for the hero load-in (which also animates transform) to finish */
      setTimeout(function () {
        if (started) return; started = true;
        chips.forEach(function (c) { c.style.transition = 'none'; });
        measure(); window.addEventListener('resize', measure);
        requestAnimationFrame(frame);
      }, 1800);
    });
  }

  /* ---------- R-41: Partners diagram. Dashed lines flow toward the ASI node; readings drift within a few percent ---------- */
  function diagrams() {
    if (RM) return;
    var NS = 'http://www.w3.org/2000/svg';
    $$('[data-asi-diagram]').forEach(function (d) {
      var img = $('img[class*="lines"]', d), node = $('[class*="node"]', d);
      if (img && node && window.fetch) {
        fetch(img.src, { mode: 'cors' }).then(function (r) { return r.text(); }).then(function (txt) {
          var holder = document.createElement('div'); holder.innerHTML = txt;
          var svg = holder.querySelector('svg'); if (!svg) return;
          svg.setAttribute('class', img.className); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
          img.parentNode.replaceChild(svg, img);
          var vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect(), nr = node.getBoundingClientRect();
          if (!sr.width) return;
          var c = { x: vb.x + (nr.left + nr.width / 2 - sr.left) / sr.width * vb.width, y: vb.y + (nr.top + nr.height / 2 - sr.top) / sr.height * vb.height };
          $$('path', svg).forEach(function (p) {
            var pts = (p.getAttribute('d').match(/M\s*-?[\d.]+[ ,]+-?[\d.]+/g) || []).map(function (s) { return s.replace(/^M\s*/, '').split(/[ ,]+/).map(Number); });
            if (pts.length < 2) return;
            var a = pts[0], b = pts[1], best = -1, i, j;
            for (i = 0; i < pts.length; i++) for (j = i + 1; j < pts.length; j++) { var dd = Math.pow(pts[i][0] - pts[j][0], 2) + Math.pow(pts[i][1] - pts[j][1], 2); if (dd > best) { best = dd; a = pts[i]; b = pts[j]; } }
            var m = svg.getScreenCTM().inverse().multiply(p.getScreenCTM());
            function tf(q) { var pt = svg.createSVGPoint(); pt.x = q[0]; pt.y = q[1]; return pt.matrixTransform(m); }
            var A = tf(a), B = tf(b);
            if (Math.hypot(A.x - c.x, A.y - c.y) < Math.hypot(B.x - c.x, B.y - c.y)) { var tmp = A; A = B; B = tmp; }   /* far end -> ASI */
            var line = document.createElementNS(NS, 'line');
            line.setAttribute('x1', A.x.toFixed(2)); line.setAttribute('y1', A.y.toFixed(2)); line.setAttribute('x2', B.x.toFixed(2)); line.setAttribute('y2', B.y.toFixed(2));
            line.setAttribute('stroke', p.getAttribute('stroke') || GREEN); line.setAttribute('stroke-width', '1'); line.setAttribute('class', 'asi-flow');
            svg.appendChild(line); p.style.display = 'none';
          });
        }).catch(function () {});
      }
      /* readings drift: every number in the chips except the "Illustrative data" tag */
      $$('p', d).forEach(function (el) {
        if (/illustrative/i.test(el.className + el.textContent)) return;
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false), nd, tn = null;
        while ((nd = walker.nextNode())) { if (/\d/.test(nd.nodeValue)) { tn = nd; break; } }
        if (!tn) return;
        var orig = tn.nodeValue, mm = orig.match(/\d+(\.\d+)?/); if (!mm) return;
        var bv = parseFloat(mm[0]), dec = mm[1] ? mm[1].length - 1 : 0, v = bv, lo = bv * 0.95, hi = bv * 1.05;
        if (dec === 0 && hi - lo < 2) { lo = Math.max(0, bv - 1); hi = bv + 1; }
        setInterval(function () { if (document.hidden) return; v = clamp(v + (Math.random() - 0.5) * (hi - lo) * 0.35, lo, hi); tn.nodeValue = orig.replace(mm[0], dec ? v.toFixed(dec) : String(Math.round(v))); }, 1700 + Math.random() * 1000);
      });
    });
  }


  /* ---------- R-28: a pinned, scroll-scrubbed frame sequence (v1.3.0) ----------
     data-asi-sequence="<frame url with {n}>|<count>[|<pad>]" on a section. At 992 px and up the section pins for
     three viewports while the frames play on a canvas; elements marked data-asi-seq-card="<from>-<to>|left|right"
     fade in over their frame range on that side, and [data-asi-seq-tick="<frame>"] rows tick at their frame.
     Everything else in the section except its head is set aside while pinned. Phones and reduced motion keep the
     section as designed. */
  function sequences() {
    if (RM) return;
    $$('[data-asi-sequence]').forEach(function (sec) {
      var cfg = sec.getAttribute('data-asi-sequence').split('|'), tpl = cfg[0], count = parseInt(cfg[1], 10) || 0, pad = parseInt(cfg[2], 10) || 4;
      if (!tpl || !count) return;
      var head = sec.firstElementChild, stage = null, canvas, ctx, frames = [], loaded = 0, cur = -1, built = false, on = null;
      var cards = $$('[data-asi-seq-card]', sec).map(function (el) {
        var a = el.getAttribute('data-asi-seq-card').split('|'), r = a[0].split('-');
        return { el: el, from: +r[0], to: +r[1], side: a[1] || 'right', home: el.parentNode, next: el.nextSibling };
      });
      var ticks = $$('[data-asi-seq-tick]', sec).map(function (el) { return { el: el, at: +el.getAttribute('data-asi-seq-tick') }; });
      function url(n) { var s = String(n); while (s.length < pad) s = '0' + s; return tpl.replace('{n}', s); }
      function load() {
        for (var i = 0; i < count; i++) (function (i) {
          var im = new Image(); im.crossOrigin = 'anonymous'; im.decoding = 'async';
          im.onload = function () { frames[i] = im; loaded++; if (i === cur || cur < 0) draw(cur < 0 ? 0 : cur, true); };
          im.src = url(i);
        })(i);
      }
      function build() {
        built = true;
        stage = document.createElement('div'); stage.className = 'asi-seq-stage';
        stage.style.cssText = 'position:sticky;top:0;width:100%;overflow:hidden';
        canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
        stage.appendChild(canvas); ctx = canvas.getContext('2d');
        sec.insertBefore(stage, head ? head.nextSibling : sec.firstChild);
        load();
      }
      function draw(f, force) {
        if (f === cur && !force) return;
        var im = frames[f];
        if (!im) { for (var d = 1; d < count && !im; d++) im = frames[f - d] || frames[f + d]; }
        cur = f; if (!im) return;
        var W = canvas.width, H = canvas.height, s = Math.min(W / im.naturalWidth, H / im.naturalHeight);
        var w = im.naturalWidth * s, h = im.naturalHeight * s;
        ctx.clearRect(0, 0, W, H); ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
      }
      function layout() {
        var want = DESK.matches;
        if (want === on) return;
        on = want;
        var rest = $$(':scope > *', sec).filter(function (el) { return el !== head && el !== stage; });
        if (!want) {
          if (!built) return;
          stage.style.display = 'none'; sec.style.height = ''; sec.style.overflow = ''; sec.style.paddingBottom = '';
          cards.forEach(function (c) { c.home.insertBefore(c.el, c.next); c.el.style.cssText = ''; });
          rest.forEach(function (el) { el.style.display = ''; });
          return;
        }
        if (!built) build();
        stage.style.display = '';
        rest.forEach(function (el) { el.style.display = 'none'; });
        cards.forEach(function (c) {
          stage.appendChild(c.el);
          c.el.style.cssText = 'position:absolute;top:50%;' + (c.side === 'left' ? 'left' : 'right') + ':max(20px,calc(50% - 680px));transform:translateY(-50%);max-width:420px;opacity:0;transition:opacity .45s, transform .45s;pointer-events:none;z-index:1';
        });
      }
      function size() {
        if (!on) return;
        var vh = window.innerHeight / zoomOf(), dpr = Math.min(2, window.devicePixelRatio || 1);
        stage.style.height = Math.round(vh) + 'px';
        sec.style.overflow = 'clip'; sec.style.paddingBottom = '0px';
        sec.style.height = Math.round((head ? head.offsetHeight : 0) + vh * 4) + 'px';
        var cw = Math.round(stage.clientWidth * dpr), ch = Math.round(vh * dpr);
        if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; draw(Math.max(0, cur), true); }
      }
      window.addEventListener('resize', function () { size(); });
      onFrame(function () {
        layout(); if (!on) return; size();
        var r = stage.parentNode.getBoundingClientRect(), top = (head ? head.offsetHeight : 0) * zoomOf();
        var total = r.height - top - window.innerHeight;
        var pr = total > 0 ? clamp((-r.top - top) / total, 0, 1) : 0;
        var f = Math.min(count - 1, Math.round(pr * (count - 1)));
        draw(f);
        cards.forEach(function (c) { var vis = f >= c.from && f <= c.to; c.el.style.opacity = vis ? '1' : '0'; c.el.style.pointerEvents = vis ? 'auto' : 'none'; c.el.style.transform = 'translateY(' + (vis ? '-50%' : 'calc(-50% + 16px)') + ')'; });
        ticks.forEach(function (t) { t.el.classList.toggle('asi-ticked', f >= t.at); });
      });
    });
  }

  onReady(boot);
})();
