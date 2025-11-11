# Nicolas Cage Fan Page (static)

This repository contains a small static fan page built with vanilla HTML, CSS, and JavaScript.

Pages included:

- `index.html` — Home / welcome
- `bio.html` — Short biography
- `about.html` — About this demo site
- `films.html` — Films & awards (renders `data/films.json` client-side)

How to run locally (using npx live-server):

This uses `npx` so you don't need to install a global package. Make sure you have Node.js and npm installed.

```bash
# from the repository root
# runs a simple static server with live reload on port 8080
npx live-server --port=8080
# then open http://localhost:8080/index.html in your browser
```

If you prefer a global install instead of `npx`, run:

```bash
# install globally (optional)
npm install -g live-server
live-server --port=8080
```

Notes:

- This is a demo/fan page for learning purposes. The site currently uses placeholder images (from picsum.photos) as visual examples.
- If you want photos of Nicolas Cage specifically, make sure to use properly licensed images — do not upload or publish copyrighted photos without permission. Replace image URLs in `data/films.json` and the `src` of the profile image in `bio.html` with your own licensed files (or host them in `assets/images/`).
- The films list is a small curated JSON sample in `data/films.json` and is used by `assets/js/main.js`.

To replace placeholders with local images:

1. Create `assets/images/` and add images (e.g., `leaving-las-vegas.jpg`).
2. Update `data/films.json` to point to `/assets/images/leaving-las-vegas.jpg` instead of the picsum URL.


