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

## Loading flow

main → bootloader → shell → manifest → engine.

engine → preload → DOM components → Hydrate

- Import: what,
- Setup (Pre-Render): what/where,
- Render: first paint (structure/content only),
- Hydrate: give what interactives/effects to which html elements

1. main.js is called.
    1. Imports bootloader and runs it.
    2. Bootloader computes env (no heavy assets).
    3. main reads data-page (on ```<html>``` ideally) and imports that shell.
    4. Calls ```startPage(env)```.
2. Shell imports manifest and prewarms.
    1. Reads manifest.options / assets / blocks to know what to prewarm (Reveal/KaTeX/Three, fonts, images).
    2. Optionally fetches page-only data and injects into block props.
3. Shell calls the engine.
    1. engine.start(manifest, env).

4. Engine runs the pipeline.
    1. Apply meta → options (cheap) → mount blocks via registry.
    2. Components render and attach their own listeners.
    3. Engine returns a teardown that removes listeners/destroys components.

## Loading components old

1. main.js is called.
    1. It first imports the bootloader.
    2. Bootloader loads in global assets.
    3. The bootloader returns the {env} object that contains global context.
    4. Main.js then calls the specific page shell file based on the key in ```data-page='key'``` located in the ```<body>``` element on each page.
2. The shell imports the page's manifest and prewarms libs.
    1. The shell reads what libs/expensive assets are needed for the page.
    2. The shell then warms up the libs/expensive assets.
3. The shell calls the engine.
    1. The engine recieves the (manifest, env) args which tells the engine what is needed to run the page
    2. The engine calls the manifest and env specified: data, components, interactives, effects, ect.
4. The engine runs according to the data it recieved.
    1. The engine grabs sets up the page's components that are called. Components can call data for themselves.
    2. Then the engine applies themes to the pages components.
    3. The engine then calls interactive components. These can grab data for themselves, like slides.

[Back to README](../../README.md)
