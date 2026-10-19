// Builds the static site into ../site.  Run:  node build/build.js
const fs = require('fs'), path = require('path');
const { getIconData, iconToSVG, iconToHTML, replaceIDs } = require('@iconify/utils');
const { SITE, SERVICES, CERTS, REVIEWS, FAQ } = require('./data');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'site');
const sets = { solar: require('@iconify-json/solar/icons.json'), ph: require('@iconify-json/ph/icons.json') };
const missing = new Set();
const V = Date.now().toString(36);

/* ---------- helpers ---------- */
function ic(id, cls) {
  const [s, n] = id.split(':'); const d = getIconData(sets[s], n);
  if (!d) { missing.add(id); return ''; }
  const r = iconToSVG(d, { height: '1em' });
  return iconToHTML(replaceIDs(r.body), { ...r.attributes, class: 'ico' + (cls ? ' ' + cls : ''), 'aria-hidden': 'true', focusable: 'false' });
}
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const img = (p, alt, o = {}) => `<img src="/assets/img/${p}.webp" alt="${esc(alt)}"${o.w ? ` width="${o.w}" height="${o.h}"` : ''}${o.eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
const hasPhone = /^\d{10}$/.test(SITE.phone);
const waLink = msg => hasPhone ? `https://wa.me/91${SITE.phone}?text=${encodeURIComponent(msg)}` : SITE.igDM;
// Detailed WhatsApp booking message, so Sheetal ma'am gets everything she needs in the first message
// Short enquiry message, like the reikisurat.in one. Details are asked later on chat.
function waMsg(s) {
  if (!s) return `Namaste! I would like to book a free consultation with Sheetal Ma'am at ${SITE.name}.\n\nCould you please let me know a suitable time to talk? Thank you!`;
  const link = SITE.domainLive ? `\n${SITE.url}/sessions#${s.id}` : '';
  return `Namaste! I'm interested in booking this session at ${SITE.name}:\n\n✦ *${s.name}*${link}\n\nCould you please share the available slots and fees? Thank you!`;
}
const bookHref = svc => waLink(waMsg(typeof svc === 'string' ? SERVICES.find(x => x.name === svc) : svc));
const bookLabel = hasPhone ? 'WhatsApp' : 'Instagram';
const bookIcon = hasPhone ? 'ph:whatsapp-logo-fill' : 'ph:instagram-logo-fill';
const mapLink = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(SITE.mapQuery);
const mapEmbed = 'https://www.google.com/maps?q=' + encodeURIComponent(SITE.mapQuery) + '&output=embed';
const ext = 'target="_blank" rel="noopener"';

// Brand mark: an eye inside a lotus, drawn in SVG
const mark = (cls = '') => `<svg class="mark ${cls}" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 7c4 5 6 10 6 15s-2 9-6 12c-4-3-6-7-6-12s2-10 6-15Z"/><path d="M17 15c-5 1-9 4-11 9 3 6 9 10 18 10"/><path d="M31 15c5 1 9 4 11 9-3 6-9 10-18 10"/><path d="M9 39c4 2 9 3 15 3s11-1 15-3"/></g><circle cx="24" cy="23" r="2.6" fill="currentColor"/></svg>`;

// Decorative zodiac ring
function ring(cls = '') {
  const C = 300; let g = `<circle cx="${C}" cy="${C}" r="290"/><circle cx="${C}" cy="${C}" r="250"/><circle cx="${C}" cy="${C}" r="196" stroke-dasharray="2 8"/>`;
  for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; g += `<line x1="${(C + Math.cos(a) * 250).toFixed(1)}" y1="${(C + Math.sin(a) * 250).toFixed(1)}" x2="${(C + Math.cos(a) * 290).toFixed(1)}" y2="${(C + Math.sin(a) * 290).toFixed(1)}"/>`; }
  for (let i = 0; i < 12; i++) { const a = (i * 30 + 15) * Math.PI / 180, x = C + Math.cos(a) * 270, y = C + Math.sin(a) * 270; g += `<path d="M${x.toFixed(1)} ${(y - 7).toFixed(1)} L${(x + 2).toFixed(1)} ${(y - 2).toFixed(1)} L${(x + 7).toFixed(1)} ${y.toFixed(1)} L${(x + 2).toFixed(1)} ${(y + 2).toFixed(1)} L${x.toFixed(1)} ${(y + 7).toFixed(1)} L${(x - 2).toFixed(1)} ${(y + 2).toFixed(1)} L${(x - 7).toFixed(1)} ${y.toFixed(1)} L${(x - 2).toFixed(1)} ${(y - 2).toFixed(1)} Z" fill="currentColor" stroke="none"/>`; }
  for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180; g += `<circle cx="${(C + Math.cos(a) * 222).toFixed(1)}" cy="${(C + Math.sin(a) * 222).toFixed(1)}" r="${i % 5 ? 1.2 : 2.4}" fill="currentColor" stroke="none"/>`; }
  return `<svg class="ring ${cls}" viewBox="0 0 600 600" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true" focusable="false">${g}</svg>`;
}
// A tarot card back, drawn in CSS + SVG
const cardBack = (cls = '') => `<div class="tcard ${cls}" aria-hidden="true"><div class="tcard-in"><svg viewBox="0 0 100 160" fill="none" stroke="currentColor" stroke-width="1"><rect x="6" y="6" width="88" height="148" rx="5"/><circle cx="50" cy="80" r="22"/><circle cx="50" cy="80" r="14"/><path d="M50 52v-14M50 108v14M22 80H8M78 80h14M30 60l-9-9M70 60l9-9M30 100l-9 9M70 100l9 9"/><path d="M50 72c4 0 7 4 8 8-1 4-4 8-8 8s-7-4-8-8c1-4 4-8 8-8Z" fill="currentColor" stroke="none" opacity=".55"/><circle cx="50" cy="80" r="2.5" fill="currentColor" stroke="none"/><path d="M50 18l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6Z M50 130l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6Z" fill="currentColor" stroke="none"/></svg></div></div>`;

function md(src) {
  const inline = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const out = []; let list = null, para = [];
  const fp = () => { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
  const fl = () => { if (list) { out.push('<ul>' + list.map(i => '<li>' + inline(i) + '</li>').join('') + '</ul>'); list = null; } };
  for (const raw of src.split('\n')) {
    const l = raw.trim(); let m;
    if (!l) { fp(); fl(); continue; }
    if ((m = l.match(/^(#{2,3})\s+(.*)/))) { fp(); fl(); out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); continue; }
    if ((m = l.match(/^[-*]\s+(.*)/))) { fp(); (list = list || []).push(m[1]); continue; }
    fl(); para.push(l);
  }
  fp(); fl(); return out.join('\n');
}
const POSTS = fs.readdirSync(path.join(ROOT, 'content/blog')).filter(f => f.endsWith('.md')).map(f => {
  const t = fs.readFileSync(path.join(ROOT, 'content/blog', f), 'utf8'); const m = t.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = {}; m[1].split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
  return { slug: f.replace('.md', ''), ...meta, html: md(m[2]), mins: Math.max(2, Math.round(m[2].split(/\s+/).length / 200)) };
}).sort((a, b) => b.date.localeCompare(a.date));
const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------- layout ---------- */
const NAV = [['sessions', '/sessions.html', 'Sessions'], ['about', '/about.html', 'About Sheetal'], ['reviews', '/#reviews', 'Reviews'], ['blog', '/blog.html', 'Blog'], ['contact', '/contact.html', 'Contact']];
function header(cur) {
  return `<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><div class="wrap hdr-in">
  <a class="brand" href="/" aria-label="${SITE.name}, home">${mark()}<span><b>Atmantan Holistic</b><small>${SITE.tagline}</small></span></a>
  <nav class="nav" aria-label="Main">${NAV.map(([k, h, t]) => `<a href="${h}"${k === cur ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <a class="btn btn-pri btn-sm hdr-cta" href="${bookHref()}" ${ext}>${ic('ph:whatsapp-logo-fill')} Book free consultation</a>
  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu"><span></span><span></span></button>
</div></header>
<div class="mnav" id="mnav" hidden>
  <nav aria-label="Mobile">${[['home', '/', 'Home']].concat(NAV).map(([k, h, t]) => `<a href="${h}"${k === cur ? ' aria-current="page"' : ''}>${t}${ic('solar:alt-arrow-right-linear')}</a>`).join('')}</nav>
  <div class="mnav-ft">
    <a class="btn btn-pri btn-block" href="${bookHref()}" ${ext}>${ic(bookIcon)} Book free consultation</a>
    ${hasPhone ? `<a class="btn btn-out btn-block" href="tel:+91${SITE.phone}">${ic('solar:phone-bold')} Call +91 ${SITE.phone}</a>` : `<a class="btn btn-out btn-block" href="${SITE.waCommunity}" ${ext}>${ic('ph:whatsapp-logo-fill')} Join WhatsApp community</a>`}
  </div>
</div>`;
}
function footer() {
  return `<footer class="ftr">
  <div class="wrap ftr-top">
    <div class="ftr-brand">
      <a class="brand brand-light" href="/">${mark()}<span><b>Atmantan Holistic</b><small>${SITE.tagline}</small></span></a>
      <p>Tarot reading, Reiki, pranic healing and manifestation coaching with ${SITE.person}. In Navsari and online.</p>
      <div class="social">
        <a href="${SITE.instagram}" ${ext} aria-label="Instagram">${ic('ph:instagram-logo-fill')}</a>
        <a href="${SITE.facebook}" ${ext} aria-label="Facebook">${ic('ph:facebook-logo-fill')}</a>
        <a href="${SITE.waCommunity}" ${ext} aria-label="WhatsApp community">${ic('ph:whatsapp-logo-fill')}</a>
      </div>
    </div>
    <div><h2>Sessions</h2><ul>${SERVICES.map(s => `<li><a href="/sessions.html#${s.id}">${s.name}</a></li>`).join('')}</ul></div>
    <div><h2>Explore</h2><ul><li><a href="/about.html">About Sheetal</a></li><li><a href="/#reviews">Client reviews</a></li><li><a href="/blog.html">Blog</a></li><li><a href="/contact.html">Contact</a></li><li><a href="/privacy.html">Privacy</a></li></ul></div>
    <div><h2>Visit</h2><address>${SITE.centreName}<br>${SITE.address.join('<br>')}</address>
      <p><a href="${mapLink}" ${ext}>Get directions</a>${hasPhone ? `<br><a href="tel:+91${SITE.phone}">+91 ${SITE.phone}</a>` : ''}${SITE.email ? `<br><a href="mailto:${SITE.email}">${SITE.email}</a>` : ''}</p></div>
  </div>
  <div class="wrap ftr-bot"><p>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</p><p>Energy healing and tarot support your well-being. They do not replace medical, legal or financial advice.</p></div>
</footer>
<div class="mcta"><a class="btn btn-pri" href="${bookHref()}" ${ext}>${ic(bookIcon)} Book free consultation</a><a class="mcta-ic" href="${hasPhone ? 'tel:+91' + SITE.phone : SITE.instagram}" ${hasPhone ? '' : ext} aria-label="${hasPhone ? 'Call' : 'Instagram'}">${ic(hasPhone ? 'solar:phone-bold' : 'ph:instagram-logo-fill')}</a></div>`;
}
function layout({ p, title, desc, body, cur = '', ld = [], og = '/assets/img/og.jpg', noindex }) {
  const canon = SITE.url + (p === '/index.html' ? '/' : p.replace(/\.html$/, ''));
  const biz = { '@context': 'https://schema.org', '@type': 'HealthAndBeautyBusiness', '@id': SITE.url + '/#business', name: SITE.name + ' – ' + SITE.tagline, alternateName: SITE.centreName, url: SITE.url + '/', image: SITE.url + og, founder: { '@type': 'Person', name: SITE.person },
    address: { '@type': 'PostalAddress', streetAddress: SITE.address.slice(0, 2).join(', '), addressLocality: 'Navsari', addressRegion: 'Gujarat', postalCode: '396445', addressCountry: 'IN' },
    sameAs: [SITE.instagram, SITE.facebook, SITE.exly], ...(hasPhone ? { telephone: '+91' + SITE.phone } : {}) };
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canon}">`}
<meta name="theme-color" content="#2E0838">
<meta property="og:type" content="website"><meta property="og:site_name" content="${SITE.name}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canon}"><meta property="og:image" content="${SITE.url}${og}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/lora-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/style.css?v=${V}">
<script>document.documentElement.classList.add('js');setTimeout(function(){if(!window.__anim)document.documentElement.classList.add('anim-off')},2500)</script>
${[biz, ...ld].map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>
<body>
${header(cur)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/js/main.js?v=${V}" defer></script>
</body>
</html>`;
}
const pages = [];
function write(rel, html, prio = '0.6', map = true) {
  const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html);
  if (map) pages.push([rel === 'index.html' ? '/' : '/' + rel.replace(/\.html$/, ''), prio]);
}
const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map(([t, h], i) => i < items.length - 1 ? `<li><a href="${h}">${esc(t)}</a></li>` : `<li aria-current="page">${esc(t)}</li>`).join('')}</ol></nav>`;
const pageHead = (h1, lead, cr) => `<section class="phead">${ring('phead-ring')}<div class="wrap">${cr || ''}<h1 data-hero>${h1}</h1>${lead ? `<p class="lead" data-hero>${lead}</p>` : ''}</div></section>`;
const faqHtml = qa => `<div class="faq">${qa.map(([q, a]) => `<details data-anim><summary>${esc(q)}<span class="faq-i">${ic('solar:alt-arrow-down-linear')}</span></summary><p>${esc(a)}</p></details>`).join('')}</div>`;
const faqLd = qa => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const stars = `<span class="stars" aria-label="5 out of 5">${ic('ph:star-fill')}${ic('ph:star-fill')}${ic('ph:star-fill')}${ic('ph:star-fill')}${ic('ph:star-fill')}</span>`;
const revCard = r => `<figure class="rev">${stars}<blockquote><p>${esc(r.text)}</p></blockquote><figcaption><span class="rev-av" aria-hidden="true">${esc(r.name[0])}</span><span><b>${esc(r.name)}</b><small>${esc(r.tag)}</small></span></figcaption></figure>`;
function reviewsBand(dark = true) {
  const half = Math.ceil(REVIEWS.length / 2);
  const row = (list, dir) => `<div class="marquee" data-dir="${dir}"><div class="marquee-track">${list.map(revCard).join('')}${list.map(revCard).join('').replace(/<figure class="rev">/g, '<figure class="rev" aria-hidden="true">')}</div></div>`;
  return `<section class="sec reviews${dark ? ' dark' : ''}" id="reviews">
  ${ring('rev-ring')}
  <div class="wrap"><div class="sec-hd center" data-anim><p class="kick">Client words</p><h2>What people say after a session</h2></div></div>
  ${row(REVIEWS.slice(0, half), 'l')}
  ${row(REVIEWS.slice(half).concat(REVIEWS.slice(0, 1)), 'r')}
  <div class="wrap rev-cta" data-anim><a class="btn btn-light" href="${bookHref()}" ${ext}>${ic('ph:whatsapp-logo-fill')} Book your session on WhatsApp</a></div>
</section>`;
}
const blogCard = p => `<article class="bcard" data-anim><a class="bcard-img" href="/blog/${p.slug}.html" tabindex="-1" aria-hidden="true">${img(p.img + '-720', '')}</a><div class="bcard-b"><p class="meta">${esc(p.category)} · ${p.mins} min read</p><h3><a href="/blog/${p.slug}.html">${esc(p.title)}</a></h3><p>${esc(p.excerpt)}</p></div></article>`;
function contactBand() {
  return `<section class="sec cband">
  <div class="wrap"><div class="cband-in" data-anim>
    <div class="cband-copy">
      <h2>Not sure where to start?</h2>
      <p>Send me a message and tell me a little about what is going on. Your first consultation is free, and I will tell you honestly which session, if any, will help.</p>
      <div class="btn-row"><a class="btn btn-pri btn-lg" href="${bookHref()}" ${ext}>${ic(bookIcon)} Message on ${bookLabel}</a><a class="btn btn-out btn-lg" href="/sessions.html">See all sessions</a></div>
    </div>
    <ul class="cband-list">
      <li>${ic('solar:chat-round-dots-bold-duotone')}<span><b>Phone, chat or video</b>Sessions wherever you are</span></li>
      <li>${ic('solar:map-point-bold')}<span><b>Navsari centre</b>102, Sachi Arcade, near Prajapati Ashram</span></li>
      <li>${ic('solar:lock-keyhole-minimalistic-bold')}<span><b>Private and personal</b>What you share stays between us</span></li>
    </ul>
  </div></div>
</section>`;
}

/* ================= HOME ================= */
function home() {
  const mods = ['Tarot Reading', 'Reiki Grandmaster', 'Pranic Healing', 'Chakra Balancing', 'Crystal Remedies', 'Manifestation Coaching', 'Pranic Psychotherapy', 'Distance Healing'];
  const strip = mods.map(m => `<span>${m}</span><i aria-hidden="true">✦</i>`).join('');
  const body = `
<section class="hero">
  <div class="hero-glow" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div class="hero-copy">
            <h1><span class="ln"><span>Find clarity.</span></span> <span class="ln"><span>Heal your <em>energy</em>.</span></span> <span class="ln"><span>Move forward.</span></span></h1>
      <p class="hero-sub" data-hero>Tarot readings, Reiki and pranic healing with a certified Reiki Grandmaster and tarot professional. Personal sessions by phone, video or at the Navsari centre.</p>
      <div class="hero-cta" data-hero>
        <a class="btn btn-pri btn-lg" href="${bookHref()}" ${ext}>${ic('ph:whatsapp-logo-fill')} Book free consultation</a>
        <a class="btn btn-out btn-lg" href="/sessions.html">Explore sessions</a>
      </div>
      <ul class="hero-proof" data-hero>
        <li><b>${SITE.years}</b><span>years of healing practice</span></li>
        <li><b>5</b><span>certifications</span></li>
        <li><b>Online</b><span>phone, chat &amp; video</span></li>
      </ul>
    </div>
    <div class="hero-art">
      ${ring('hero-ring')}
      ${cardBack('c1')}${cardBack('c2')}${cardBack('c3')}
      <div class="arch" data-arch>${img('sheetal', SITE.person + ', tarot reader and Reiki Grandmaster', { eager: true, w: 1040, h: 1040 })}</div>
      <div class="chip chip-a" data-chip>${ic('solar:diploma-bold-duotone')}<span><b>Reiki Grandmaster</b>Certified 2025</span></div>
      <div class="chip chip-b" data-chip>${ic('ph:cards-fill')}<span><b>Tarot Professional</b>Honest readings</span></div>
    </div>
  </div>
  <div class="strip" aria-label="Modalities"><div class="strip-track">${strip}${strip}</div></div>
</section>

<section class="sec" id="sessions">
  <div class="wrap">
    <div class="sec-hd row" data-anim><div><p class="kick">Sessions</p><h2>How I can help you</h2><p>Every session is one-to-one and shaped around what you are going through right now.</p></div><a class="link-more" href="/sessions.html">All session details ${ic('solar:arrow-right-linear')}</a></div>
    <div class="svc-grid">${SERVICES.map((s, i) => `<article class="svc" data-anim>
      <a class="svc-img" href="/sessions.html#${s.id}" tabindex="-1" aria-hidden="true">${img(s.img + '-720', s.name)}<span class="svc-n">0${i + 1}</span></a>
      <div class="svc-b"><span class="svc-ic">${ic(s.icon)}</span><h3>${s.name}</h3><p class="svc-t">${s.short}</p>
        <div class="svc-act"><a class="btn btn-out btn-sm" href="/sessions.html#${s.id}">See details</a><a class="btn btn-pri btn-sm" href="${bookHref(s)}" ${ext}>${ic('ph:whatsapp-logo-fill')} Book now</a></div>
      </div>
    </article>`).join('')}</div>
  </div>
</section>

<section class="sec about-band">
  <div class="wrap ab-in">
    <div class="ab-photo" data-anim><div class="ab-img">${img('sheetal-520', SITE.person)}</div><div class="ab-badge"><b>${SITE.years}</b><span>years in the healing practice</span></div></div>
    <div class="ab-copy">
      <p class="kick" data-anim>Meet your healer</p>
      <h2 data-anim>Hi, I’m Sheetal</h2>
      <p data-anim>I am a certified tarot professional, Reiki Grandmaster, pranic healer and manifestation coach. My work is about helping you find clarity, shift your energy and move forward with confidence, whether you are going through a change, looking for answers or ready to start something new.</p>
      <p data-anim>I blend intuitive guidance with grounded, practical steps. You will always get an honest answer from me, explained simply, along with something you can actually do next.</p>
      <ul class="certs" data-anim>${CERTS.map(c => `<li>${ic('solar:diploma-bold-duotone')}<span><b>${c[0]}</b>${c[1]}, ${c[2]}</span></li>`).join('')}</ul>
      <a class="btn btn-tl" href="/about.html" data-anim>Read my story</a>
    </div>
  </div>
</section>

<section class="sec how">
  <div class="wrap">
    <div class="sec-hd center" data-anim><p class="kick">Booking</p><h2>Three simple steps</h2></div>
    <ol class="steps">
      <li data-anim><span class="step-n">1</span>${ic('solar:chat-round-dots-bold-duotone', 'step-i')}<h3>Send a message</h3><p>Tell me briefly what you need help with. The first consultation is free.</p></li>
      <li data-anim><span class="step-n">2</span>${ic('solar:calendar-bold-duotone', 'step-i')}<h3>Pick a time</h3><p>We choose the right session and a time that suits you.</p></li>
      <li data-anim><span class="step-n">3</span>${ic('solar:videocamera-record-bold-duotone', 'step-i')}<h3>Your session</h3><p>By phone, chat, video or at the Navsari centre. You leave with clear next steps.</p></li>
    </ol>
    <div class="steps-line" aria-hidden="true"><span></span></div>
  </div>
</section>

${reviewsBand()}

<section class="sec">
  <div class="wrap">
    <div class="sec-hd row" data-anim><div><p class="kick">Blog</p><h2>Read, reflect, heal</h2><p>Simple guides on tarot, energy healing and manifestation.</p></div><a class="link-more" href="/blog.html">All articles ${ic('solar:arrow-right-linear')}</a></div>
    <div class="bgrid">${POSTS.slice(0, 3).map(blogCard).join('')}</div>
  </div>
</section>

${contactBand()}`;
  write('index.html', layout({ p: '/index.html', cur: 'home', body,
    title: 'Atmantan Holistic | Tarot Reading, Reiki & Pranic Healing | Dr. Sheetal Vala',
    desc: 'Tarot readings, Reiki healing, pranic healing, chakra balancing and manifestation coaching with Dr. Sheetal Vala, Reiki Grandmaster. Sessions online and at the Navsari centre. Free first consultation.',
    ld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url + '/' }] }), '1.0');
}

/* ================= SESSIONS ================= */
function sessions() {
  const body = `
${pageHead('Sessions', 'Every session is one-to-one. Not sure which to choose? Start with a free consultation and I will guide you.', crumbs([['Home', '/'], ['Sessions', '/sessions.html']]))}
<section class="sec">
  <div class="wrap">
    <nav class="jump" aria-label="Jump to a session">${SERVICES.map(s => `<a href="#${s.id}">${ic(s.icon)}${s.name}</a>`).join('')}</nav>
    <div class="sdet-list">${SERVICES.map((s, i) => `<article class="sdet${i % 2 ? ' rev-row' : ''}" id="${s.id}">
      <div class="sdet-img" data-anim>${img(s.img, s.name)}</div>
      <div class="sdet-b" data-anim>
        <span class="svc-ic">${ic(s.icon)}</span>
        <h2>${s.name}</h2>
        <p class="sdet-lead">${s.long}</p>
        <div class="sdet-meta"><p><b>Helpful for</b>${s.good.join(' · ')}</p><p><b>How</b>${s.mode}</p></div>
        <div class="btn-row"><a class="btn btn-pri" href="${bookHref(s)}" ${ext}>${ic(bookIcon)} Book now on WhatsApp</a></div>
      </div>
    </article>`).join('')}</div>
  </div>
</section>
<section class="sec soft"><div class="wrap narrow"><div class="sec-hd center" data-anim><p class="kick">FAQ</p><h2>Common questions</h2></div>${faqHtml(FAQ)}</div></section>
${contactBand()}`;
  write('sessions.html', layout({ p: '/sessions.html', cur: 'sessions', body,
    title: 'Sessions | Tarot Reading, Reiki, Pranic Healing & Chakra Balancing | Atmantan Holistic',
    desc: 'Tarot reading, Reiki healing, pranic healing, chakra balancing, manifestation coaching and chronic illness support with Dr. Sheetal Vala. Online or at the Navsari centre.',
    ld: [faqLd(FAQ), ...SERVICES.map(s => ({ '@context': 'https://schema.org', '@type': 'Service', name: s.name, description: s.long, provider: { '@id': SITE.url + '/#business' } }))] }), '0.9');
}

/* ================= ABOUT ================= */
function about() {
  const body = `
${pageHead('About Sheetal', 'Certified tarot professional, Reiki Grandmaster, pranic healer and manifestation coach.', crumbs([['Home', '/'], ['About', '/about.html']]))}
<section class="sec">
  <div class="wrap story">
    <div class="story-photo" data-anim><div class="arch arch-sm">${img('sheetal', SITE.person)}</div></div>
    <div class="story-b">
      <h2 data-anim>My work</h2>
      <p data-anim>I have spent more than ten years in the healing practice. It began with pranic healing in 2014, and over time grew to include tarot, Reiki up to Grandmaster level, crystal healing and manifestation coaching.</p>
      <p data-anim>My work is centred on helping you find clarity, shift your energy and align with your highest self. Whether you are moving through change, looking for insight or ready to manifest something new, I offer a safe, supportive space for real change.</p>
      <p data-anim>I blend intuitive guidance with grounded practice. In every session you get an honest answer, explained simply, and practical steps you can take afterwards: an affirmation, a mantra, a crystal or a short daily practice.</p>
      <p data-anim>Today I see clients online from anywhere, and in person at the ${SITE.centreName} in Navsari.</p>
      <div class="btn-row" data-anim><a class="btn btn-pri" href="${bookHref()}" ${ext}>${ic(bookIcon)} Book free consultation</a></div>
    </div>
  </div>
</section>
<section class="sec soft">
  <div class="wrap">
    <div class="sec-hd center" data-anim><p class="kick">Training</p><h2>Certifications</h2></div>
    <ol class="timeline">${CERTS.slice().sort((a, b) => a[2].localeCompare(b[2])).map(c => `<li data-anim><span class="tl-y">${c[2]}</span><div><h3>${c[0]}</h3><p>${c[1]}</p></div></li>`).join('')}</ol>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-hd center" data-anim><p class="kick">My approach</p><h2>What you can expect from me</h2></div>
    <div class="values">
      <div class="value" data-anim>${ic('solar:shield-check-bold-duotone')}<h3>Honest answers</h3><p>Real, unbiased answers to your questions, even when they are not what you hoped to hear.</p></div>
      <div class="value" data-anim>${ic('solar:monitor-bold-duotone')}<h3>Phone, chat &amp; video</h3><p>Consultations in whichever way you are most comfortable, wherever you live.</p></div>
      <div class="value" data-anim>${ic('solar:users-group-rounded-bold-duotone')}<h3>Personal guidance</h3><p>Every reading and healing is tailored to you, with practical steps for after the session.</p></div>
    </div>
  </div>
</section>
${reviewsBand()}
${contactBand()}`;
  write('about.html', layout({ p: '/about.html', cur: 'about', body,
    title: 'About Dr. Sheetal Vala | Tarot Reader & Reiki Grandmaster | Atmantan Holistic',
    desc: 'Dr. Sheetal Vala is a certified tarot professional, Reiki Grandmaster, pranic healer and manifestation coach with 10+ years in the healing practice. Sessions in Navsari and online.',
    ld: [{ '@context': 'https://schema.org', '@type': 'Person', name: SITE.person, jobTitle: 'Tarot Reader and Reiki Grandmaster', image: SITE.url + '/assets/img/sheetal.webp', sameAs: [SITE.instagram, SITE.facebook], worksFor: { '@id': SITE.url + '/#business' } }] }), '0.7');
}

/* ================= BLOG ================= */
function blog() {
  const cats = [...new Set(POSTS.map(p => p.category))];
  const body = `
${pageHead('Blog', 'Simple, practical reading on tarot, energy healing, chakras and manifestation.', crumbs([['Home', '/'], ['Blog', '/blog.html']]))}
<section class="sec">
  <div class="wrap">
    <div class="tabs" role="group" aria-label="Filter articles">${['All'].concat(cats).map((c, i) => `<button type="button" class="tab" data-bcat="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('')}</div>
    <div class="bgrid" data-bgrid>${POSTS.map(p => blogCard(p).replace('<article class="bcard"', `<article class="bcard" data-c="${esc(p.category)}"`)).join('')}</div>
  </div>
</section>`;
  write('blog.html', layout({ p: '/blog.html', cur: 'blog', body, title: 'Blog | Tarot, Reiki, Chakras & Manifestation | Atmantan Holistic', desc: 'Articles by Dr. Sheetal Vala on tarot readings, Reiki and pranic healing, chakra balancing, crystal remedies and manifestation.' }), '0.6');
  POSTS.forEach(p => {
    const more = POSTS.filter(x => x.slug !== p.slug).slice(0, 3);
    const body = `
<article class="post">
  <header class="post-hd">${ring('phead-ring')}<div class="wrap narrow">
    ${crumbs([['Home', '/'], ['Blog', '/blog.html'], [p.title, '/blog/' + p.slug + '.html']])}
    <p class="meta" data-hero>${esc(p.category)} · ${p.mins} min read · <time datetime="${p.date}">${fmtDate(p.date)}</time></p>
    <h1 data-hero>${esc(p.title)}</h1>
    <p class="lead" data-hero>${esc(p.excerpt)}</p>
  </div></header>
  <div class="wrap narrow">
    <figure class="post-img">${img(p.img, p.title, { eager: true })}</figure>
    <div class="post-body">${p.html}</div>
    <aside class="post-cta"><div class="post-av">${img('sheetal-520', '')}</div><div><p><b>Written by ${SITE.person}</b>Tarot professional and Reiki Grandmaster</p><a class="btn btn-pri btn-sm" href="${bookHref()}" ${ext}>${ic(bookIcon)} Ask me a question</a></div></aside>
  </div>
</article>
<section class="sec soft"><div class="wrap"><div class="sec-hd" data-anim><h2>Keep reading</h2></div><div class="bgrid">${more.map(blogCard).join('')}</div></div></section>`;
    write(`blog/${p.slug}.html`, layout({ p: `/blog/${p.slug}.html`, cur: 'blog', body, og: `/assets/img/${p.img}.webp`, title: `${p.title} | Atmantan Holistic`, desc: p.excerpt,
      ld: [{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, datePublished: p.date, image: `${SITE.url}/assets/img/${p.img}.webp`, author: { '@type': 'Person', name: SITE.person }, publisher: { '@id': SITE.url + '/#business' } }] }), '0.5');
  });
}

/* ================= CONTACT ================= */
function contact() {
  const body = `
${pageHead('Contact', 'Send a message and tell me a little about what you need. Your first consultation is free.', crumbs([['Home', '/'], ['Contact', '/contact.html']]))}
<section class="sec">
  <div class="wrap contact-in">
    <form class="cform" data-cform data-mode="${hasPhone ? 'wa' : 'ig'}" data-wa="${hasPhone ? '91' + SITE.phone : ''}" data-anim>
      <h2>Write your message</h2>
      <p class="small">${hasPhone ? 'This opens WhatsApp with your message ready to send.' : 'Your message is copied and Instagram opens, so you can paste it into a direct message.'}</p>
      <label>Your name<input name="name" required maxlength="80" autocomplete="name"></label>
      <label>I am interested in<select name="topic">${SERVICES.map(s => `<option>${s.name}</option>`).join('')}<option>Not sure yet</option></select></label>
      <label>Your message<textarea name="msg" rows="3" maxlength="400" placeholder="Optional: anything you would like Ma'am to know"></textarea></label>
      <button class="btn btn-pri btn-lg" type="submit">${ic(bookIcon)} Send on ${bookLabel}</button>
      <p class="form-note" data-form-note role="status" hidden></p>
    </form>
    <div class="cinfo">
      ${hasPhone ? `<a class="cline" href="${bookHref()}" ${ext} data-anim>${ic('ph:whatsapp-logo-fill')}<span><b>WhatsApp</b>+91 ${SITE.phone}</span></a><a class="cline" href="tel:+91${SITE.phone}" data-anim>${ic('solar:phone-bold')}<span><b>Call</b>+91 ${SITE.phone}</span></a>` : ''}
      ${SITE.email ? `<a class="cline" href="mailto:${SITE.email}" data-anim>${ic('solar:letter-bold')}<span><b>Email</b>${SITE.email}</span></a>` : ''}
      <a class="cline" href="${SITE.waCommunity}" ${ext} data-anim>${ic('solar:users-group-rounded-bold-duotone')}<span><b>WhatsApp community</b>Daily guidance and affirmations</span></a>
      <a class="cline" href="${SITE.facebook}" ${ext} data-anim>${ic('ph:facebook-logo-fill')}<span><b>Facebook</b>Sheetal Vala</span></a>
      <div class="cvisit" data-anim><h3>Visit the centre</h3><address>${SITE.centreName}<br>${SITE.address.join('<br>')}</address><a class="btn btn-out btn-sm" href="${mapLink}" ${ext}>${ic('solar:map-point-bold')} Get directions</a></div>
    </div>
  </div>
</section>
<section class="map"><iframe title="Map to ${SITE.centreName}" src="${mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></section>`;
  write('contact.html', layout({ p: '/contact.html', cur: 'contact', body, title: 'Contact | Book a Session with Dr. Sheetal Vala | Atmantan Holistic', desc: `Book a tarot reading or healing session. ${SITE.centreName}, ${SITE.address.join(', ')}. Online sessions by phone, chat and video.` }), '0.7');
}

function privacy() {
  const body = `${pageHead('Privacy', '', crumbs([['Home', '/'], ['Privacy', '/privacy.html']]))}
<section class="sec"><div class="wrap narrow prose">
<p>This website does not collect or store your personal information. When you use the contact form, your message is passed to Instagram or WhatsApp on your own device, and you choose whether to send it.</p>
<p>Anything you share with ${SITE.person} during a consultation or session is kept private and is never shared with anyone else.</p>
<p>The map on the contact page is provided by Google Maps, which has its own privacy policy.</p>
<p>Tarot readings and energy healing support your well-being. They are not a substitute for medical, legal or financial advice.</p>
</div></section>`;
  write('privacy.html', layout({ p: '/privacy.html', body, title: 'Privacy | Atmantan Holistic', desc: 'Privacy information for Atmantan Holistic.' }), '0.2');
}
function notFound() {
  write('404.html', layout({ p: '/404.html', noindex: true, title: 'Page not found | Atmantan Holistic', desc: 'Page not found.', body: `<section class="sec nf">${ring('phead-ring')}<div class="wrap narrow"><h1>This page could not be found</h1><p class="lead">It may have moved. Try one of these instead.</p><div class="btn-row"><a class="btn btn-pri" href="/">Home</a><a class="btn btn-out" href="/sessions.html">Sessions</a></div></div></section>` }), '0', false);
}

/* ================= RUN ================= */
home(); sessions(); about(); blog(); contact(); privacy(); notFound();
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(OUT, 'assets/css/style.css'));
fs.copyFileSync(path.join(__dirname, 'main.js'), path.join(OUT, 'assets/js/main.js'));
fs.writeFileSync(path.join(OUT, 'assets/img/favicon.svg'), mark().replace('<svg class="mark "', '<svg xmlns="http://www.w3.org/2000/svg"').replace(/currentColor/g, '#5B0C68'));
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(([l, p]) => `  <url><loc>${SITE.url}${l}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
if (missing.size) console.warn('Missing icons:', [...missing]);
console.log('Built', pages.length, 'pages');
