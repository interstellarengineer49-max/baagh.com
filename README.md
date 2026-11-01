# BAAGH — Country Living

Static, responsive BAAGH Country Living website built with HTML, CSS and vanilla JavaScript.

## Run locally

From this directory, start a local static server:

```powershell
python -m http.server 8765
```

Open `http://localhost:8765`. GSAP and ScrollTrigger are loaded from jsDelivr; Cormorant Garamond and Manrope are loaded from Google Fonts.

## Project structure

- `index.html` — accessible single-page website
- `css/style.css` — brand styles and components
- `css/responsive.css` — tablet, mobile and reduced-motion styles
- `js/main.js` — animated responsive navigation, lifestyle accordion and client-side enquiry validation
- `js/animations.js` — cinematic hero, editorial section transitions, staggered reveals, image masks and subtle parallax
- `assets/images/` — reference lifestyle concept imagery
- `assets/logos/` — supplied source PDFs and web-ready logo artwork

The original BAAGH and MUFAST logo PDFs are retained in `assets/logos/`. BAAGH vector logos are exported as SVG; MUFAST marks preserve their source PDF artwork and embedded imagery in SVG. No logo artwork is recreated or recolored. The standalone MUFAST Livestock PDF was not among the supplied logo PDFs, so its SVG is cropped from the original artwork in `MUFAST_Group_Company_Profile.pdf`.

The enquiry form validates fields in the browser only. It is not connected to a backend and does not send or store submissions.
