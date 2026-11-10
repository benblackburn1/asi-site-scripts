/*!
 * ASI experience layer (Automation Services, Inc.), by Origin.
 * One file, loaded site-wide from the Webflow footer via jsDelivr pinned to a commit + SRI.
 * Every module is dormant until the Designer markup carries its data-asi-* hook, so deleting
 * this script returns the site to its designed, static state.
 *
 * CHANGELOG (newest first)
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
  window.__asiExperience = '1.0.6';

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH = 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;
  var EASE = 'cubic-bezier(.2,.7,.2,1)';
  var GREEN = '#8ae14d';

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
    '.btn .btn-icon{transition:transform .25s ' + EASE + ',filter .25s}',
    '.btn:hover .btn-icon{transform:translate(2px,-2px)}',
    '.btn-call:hover .btn-icon{filter:brightness(1.12);transform:none}',
    '.card img,[class*="-card"] img{transition:transform .6s ' + EASE + '}',
    '.card:hover img,[class*="-card"]:hover img{transform:scale(1.03)}',
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

  onReady(function () {
    [navMenus, reveals, splitHeads, eyebrowPulse, faqs, carousels, selectors, accordions, charts, counters, hotspots, videos, liveViews]
      .forEach(function (fn) { safe(fn.name, fn)(); });
  });

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
      return !el.closest('.nav, .footer, .cta-band, [data-asi-chips]') && !(first && first.contains(el)) && !el.closest('.asi-rv') && el.offsetParent !== null;
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
    }
    items.forEach(function (it, k) {
      it.setAttribute('tabindex', '0'); it.setAttribute('role', 'tab');
      it.addEventListener(opts.hover && !TOUCH ? 'mouseenter' : 'click', function (e) {
        if (it.tagName === 'A' && !opts.hover && cur !== k) e.preventDefault();
        touched = true; show(k);
      });
      it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); touched = true; show(k); } });
    });
    show(cur);
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
  function liveViews() {
    if (RM || window.innerWidth < 768) return;
    $$('[data-asi-live]').forEach(function (wrap) {
      var q = wrap.getAttribute('data-asi-live'); if (!q) return;
      if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
      var started = false;
      inView(wrap, function (on, e, io) {
        if (!on || started) return; started = true; io.disconnect();
        var f = document.createElement('iframe');
        f.className = 'asi-live'; f.title = wrap.getAttribute('data-asi-live-title') || 'Live plant view';
        f.setAttribute('loading', 'lazy'); f.setAttribute('allow', 'fullscreen');
        f.src = VIZ + q + (/(^|&)bare(&|$)/.test(q) ? '' : '&bare') + '&ui=0&orbit=0';
        var still = $('img', wrap);
        if (still && still.nextSibling) wrap.insertBefore(f, still.nextSibling); else wrap.appendChild(f);
        f.addEventListener('load', function () {
          setTimeout(function () { f.classList.add('asi-on'); var sec = closestSection(wrap); if (sec) sec.classList.add('asi-live-on'); }, 1800);
        });
      }, { rootMargin: '300px 0px', threshold: 0 });
    });
  }

  /* ---------- 11. video loops over still images; hero chips track the drone footage ---------- */
  function videos() {
    if (RM || !BASE) return;
    var saveData = navigator.connection && navigator.connection.saveData;
    $$('[data-asi-video]').forEach(function (wrap) {
      var slot = SLOT[wrap.getAttribute('data-asi-video')]; var key = slot && slot.v; if (!key || !VIDEO[key] || saveData) return;
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
})();
