# Set up for Java

This document describes the file/folder setup and rendering flow for JavaScript modules in the `04_js/` directory.

## Folder Structure

- `pages/` – Shells and per-page entrypoints  
  - `home.shell.js`  
  - `resume.shell.js`  
  - `projects.shell.js`  

- `engine/` – Core rendering and orchestration logic  
  - `bootstrap.js`  
  - `renderer.js`  
  - `registry.js`  
  - `findData.js`  
  - `themeFonts.js`  
  - `revealSetup.js`  
  - `initInteractives.js`  

- `components/` – Modular UI blocks (pure DOM creation)  
  - `hero.js`  
  - `footer.js`  
  - `grid.js`  

- `interactives/` – Stateful, event-driven UI  
  - `themeToggle.js`  
  - `carousel.js`  
  - `slideDeck.js`  

- `effects/` – Motion, animation, and scroll logic  
  - `fadeInOnScroll.js`  
  - `cursorEffect.js`  
  - `parallax.js`  

- `data/` – Page data, slides, and reusable elements  
  - `manifests/home.js`  
  - `slides/resume.js`  
  - `elements/featuredProjects.js`  

- `tokens/` – Design tokens  
  - `fonts.js`  
  - `spacing.js`  

- `types/` – Shared typedefs  
  - `manifest.js`  

- `utils/` – Generic helpers  
  - `dom.js`  
  - `parse.js`  
  - `preloadAssets.js`  

---

## Data Signals

Each page’s data is loaded from two sources:

1. **HTML `data-*` markers**  
2. **JavaScript page manifests**

### `data-*` Markers

HTML uses `data-*` attributes to signal which component or data set should apply. For example:

```html
<section class="container pptWrapperTest">
    <div class="reveal" data-slideset="resume">
        <div class="slides"></div>
    </div>
</section>
```

The data-slideset="resume" tells the slide-deck component to load and render the resume slideset.

### Manifest

Each page imports a manifest that declares what should be loaded:

```javascript

export const pageManifest = {
  fonts: ["Inter:400,700", "JetBrainsMono:400"],
  theme: "dark",
  models: [{ id: "satellite", src: "/assets/models/sat.glb" }],
  components: ["model-viewer", "slide-deck", "image-zoom"],
};
```

This allows the renderer.js to selectively initialize components and preload assets as needed, keeping pages lightweight and modular.

## Current (planned) js Layout

```plaintext
04_js/
├─ main.js                   # Global entrypoint per HTML page
│
├─ engine/                   # Core rendering engine
│  ├─ renderer.js
│  ├─ registry.js
│  ├─ findData.js
│  ├─ themeFonts.js
│  ├─ bootstrap.js
│  └─ revealSetup.js
│
├─ pages/                    # Page-specific bootstraps
│  ├─ home.shell.js
│  ├─ resume.shell.js
│  └─ projects.shell.js
│
├─ data/                     # Objects & arrays only
│  ├─ slides/
│  │   ├─ resume.js
│  │   └─ projects.js
│  ├─ elements/
│  │   └─ featuredProjects.js
│  └─ manifests/
│      ├─ home.js
│      ├─ resume.js
│      └─ projects.js
│
├─ components/               # Visual, DOM-based UI blocks
│  ├─ hero.js
│  ├─ footer.js
│  └─ grid.js
│
├─ interactives/             # Stateful, event-driven UI
│  ├─ slideDeck.js
│  ├─ carousel.js
│  └─ themeToggle.js
│
├─ effects/                  # Motion / animation / scroll logic
│  ├─ fadeInOnScroll.js
│  └─ cursorEffect.js
│
├─ tokens/                   # Design primitives
│  ├─ fonts.js
│  └─ spacing.js
│
├─ types/                    # Shared typedefs for clean JS
│  └─ manifest.js
│
└─ utils/                    # Pure helper functions
   ├─ preloadAssets.js
   ├─ parse.js
   └─ dom.js
```

[Back to README](../../README.md)
