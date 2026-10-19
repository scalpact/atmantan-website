# Atmantan Holistic – website

A plain HTML, CSS and JS website for Dr. Sheetal Vala (Atmantan Holistic – Healing & Tarot Centre). It needs no database and no server code.

## Open it on your computer
- Easiest: open the `site` folder in VS Code and use the **Live Server** extension on `site/index.html`.
- Or, with Node.js installed: `node dev-server.js` and open http://localhost:3000.

## Change content
Edit `build/data.js` (phone, email, domain, sessions, reviews, FAQ, certifications) or add a `.md` file in `content/blog/`. Then run:

```
npm install
node build/build.js
```

* **Phone:** put a 10-digit number in `phone: ''`. Every "Book" button then opens WhatsApp chat, and Call buttons appear.
* **Without a phone number:** the buttons open an Instagram DM to @healwithsheetal.
* **Domain:** set `url:` to the real domain for SEO and the sitemap.

## Go live
Upload the contents of the `site` folder to any host (Vercel, Netlify, Hostinger, cPanel). On Vercel or Netlify, set the output or publish folder to `site`.
