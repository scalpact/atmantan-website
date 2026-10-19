/* Atmantan Holistic — menu, filters, contact form, animation */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* menu */
  var btn = $('.menu-btn'), mnav = $('#mnav');
  function setMenu(open) {
    if (!btn) return;
    btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.hidden = !open; document.body.classList.toggle('menu-open', open);
    if (open) mnav.style.paddingTop = ($('.hdr').getBoundingClientRect().bottom + 8) + 'px';
  }
  btn && btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  mnav && mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* header + mobile CTA on scroll */
  var hdr = $('.hdr'), mcta = $('.mcta');
  function onScroll() {
    var y = scrollY;
    hdr && hdr.classList.toggle('scrolled', y > 8);
    if (mcta) mcta.classList.toggle('show', y > 520 && (innerHeight + y) < document.documentElement.scrollHeight - 340);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* blog filter */
  var tabs = $$('[data-bcat]');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.dataset.bcat;
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $$('[data-bgrid] .bcard').forEach(function (c) { c.hidden = v !== 'All' && c.dataset.c !== v; });
    });
  });

  /* contact form */
  var f = $('[data-cform]');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var v = function (n) { return f[n] ? f[n].value.trim() : ''; };
    var msg = "Namaste! I'm " + v('name') + ". I'm interested in this session at Atmantan Holistic:\n\n✦ *" + v('topic') + "*" + (v('msg') ? '\n\n' + v('msg') : '') + '\n\nCould you please share the available slots and fees? Thank you!';
    var note = $('[data-form-note]');
    if (f.dataset.mode === 'wa') { window.open('https://wa.me/' + f.dataset.wa + '?text=' + encodeURIComponent(msg), '_blank', 'noopener'); return; }
    var done = function (ok) {
      note.hidden = false;
      note.textContent = ok ? 'Your message is copied. Paste it into the Instagram chat that just opened and press send.' : 'Instagram is opening. Please type or paste your message there.';
      window.open(f.dataset.ig, '_blank', 'noopener');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });

  /* GSAP motion */
  function init() {
    window.__anim = true;
    var root = document.documentElement;
    if (reduce || !window.gsap || !window.ScrollTrigger) { root.classList.add('anim-off'); return; }
    gsap.registerPlugin(ScrollTrigger);

    // hero
    var lines = $$('.hero h1 .ln > span');
    if (lines.length) {
      gsap.set('[data-hero]', { opacity: 1 });
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-kick', { y: 14, opacity: 0, duration: .6 })
        .from(lines, { yPercent: 115, duration: 1, stagger: .1 }, '-=.3')
        .from('.hero-sub', { y: 18, opacity: 0, duration: .7 }, '-=.6')
        .from('.hero-cta', { y: 18, opacity: 0, duration: .6 }, '-=.5')
        .from('.hero-proof li', { y: 14, opacity: 0, duration: .5, stagger: .08 }, '-=.4')
        .from('.hero-ring', { scale: .8, opacity: 0, duration: 1.4, ease: 'power2.out' }, .1)
        .from('[data-arch]', { y: 50, opacity: 0, duration: 1.1 }, .25)
        .from('.tcard', { y: 80, rotate: 0, opacity: 0, duration: 1, stagger: .12, ease: 'back.out(1.4)' }, .55)
        .from('[data-chip]', { scale: .7, opacity: 0, duration: .6, stagger: .15, ease: 'back.out(2)' }, 1.1);
      gsap.to('.hero-ring', { rotate: 360, duration: 140, repeat: -1, ease: 'none' });
      gsap.to('.c1', { y: -10, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 });
      gsap.to('.c2', { y: -14, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.9 });
      gsap.to('.c3', { y: -8, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.1 });
      gsap.to('[data-chip]', { y: -6, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .6, delay: 2 });
      gsap.to('.hero-art', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    } else {
      var hh = $$('[data-hero]');
      if (hh.length) gsap.fromTo(hh, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .08, ease: 'power3.out' });
    }
    $$('.phead-ring, .rev-ring').forEach(function (r) { gsap.to(r, { rotate: 360, duration: 160, repeat: -1, ease: 'none' }); });

    // reveal on scroll
    var items = $$('[data-anim]');
    if (items.length) {
      gsap.set(items, { opacity: 0, y: 30 });
      ScrollTrigger.batch(items, { start: 'top 88%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .08, overwrite: true }); } });
    }
    // image zoom-in on section photos
    $$('.sdet-img img, .ab-photo img').forEach(function (im) {
      gsap.fromTo(im, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom 40%', scrub: true } });
    });
    // steps connector
    var sl = $('.steps-line span');
    if (sl) gsap.fromTo(sl, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 80%', end: 'bottom 60%', scrub: .6 } });
    root.classList.add('anim-ready');
  }
  init();
  addEventListener('load', function () { window.ScrollTrigger && ScrollTrigger.refresh(); });
})();
