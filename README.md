# NYU VioletLab

The website for NYU VioletLab, an independent, student-run community for people who love to build. Recurring hackathons for experienced hackers and first-timers. Born at Tandon, open to every builder at NYU.

Live at **https://violetlab.github.io**

## Stack

Plain static HTML + CSS, no build step. GitHub Pages serves the files as-is, so anyone can edit and ship without a toolchain.

## Structure

```
.
├── index.html            # all page markup
├── .nojekyll             # tell Pages to serve files as-is (skip Jekyll)
└── assets/
    ├── css/
    │   ├── tokens.css     # the brand: colors, fonts, spacing. Edit to reskin.
    │   └── main.css       # reset + layout + components
    ├── js/
    │   └── reveal.js      # scroll-reveal on entry
    └── img/
        └── mark.svg       # the VL monogram (favicon + nav)
```

## Editing

- **Change copy or sections:** edit `index.html`.
- **Change colors / fonts / spacing:** edit `assets/css/tokens.css`. This is the single source of truth for the brand.
- **Change layout or a component:** edit `assets/css/main.css`.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Deploy

Push to `main`. GitHub Pages redeploys automatically (Settings -> Pages -> Deploy from a branch -> `main` / root).

## House rules

- No secrets, no member PII, no personal emails in this repo (it is public).
- No comparisons to other clubs in the copy. Positive self-definition only.
