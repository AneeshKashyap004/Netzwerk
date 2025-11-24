# Netzwerk — Static Website

This is a modern, responsive multi-page static website scaffold for Netzwerk based on the provided sites:
- https://netzwerk.odoo.com/
- https://x-workzdev01.github.io/netzwerk_website/index.html

Features
 - Multi-page layout: `index.html`, `services.html`, `about.html`, `contact.html`
- Vibrant modern styles (gradients, glass effect), playful hero art and hover animations
- Mobile navigation and active link highlighting
- Lightweight CSS and minimal JS

How to use
1. Open `index.html` in a browser (double-click or `open` in your OS).
2. For local development with live reload, you can use any static server. Example using `npx serve`:

```bash
npx serve .
```

Optional improvements / next steps
- Replace placeholder images with brand assets and review the logo
- Add a backend or serverless form provider (Formspree / Netlify Forms) to persist contact submissions
- Add more SEO / Open Graph metadata, favicons (done) and a sitemap
- Accessibility review: keyboard navigation, contrast and ARIA audits
- Add small CI to deploy to GitHub Pages, Netlify or Vercel
 - Switched to a light theme (improved contrast and readability)
 - Added IT/ITES content: Capabilities, Support & SLAs, Security, Certifications, Technologies and Careers/RFP guidance
 - Next: run a Lighthouse/a11y report and tweak colors if you'd like a different palette
 - Consolidated partners information into the `About` page and removed the separate `partners.html` page to simplify navigation

Contact
- Email: contact@netzwerk.systems
- Phone: +91 63618 27210
