# Set up for Java

This document describes the file/folder setup and rendering flow for JavaScript modules in the `04_js/` directory.

## Folder Structure

- `pages/` – Shells and per-page entrypoints  
  - `manifest.home.js`  
  - `manifest.about.js`  
  - `manifest.contact.js`  

- `core/` – Main renderer and orchestration logic  
  - `renderer.js`  
  - `findData.js`  
  - `themeFonts.js`  
  - `revealSetup.js` (possibly placed here)

- `components/` – Modular UI blocks  
  - `model-viewer.js`  
  - `slide-deck.js`  
  - `carousel.js`  

- `data/` – Slide and element content  
  - `slide.resume.js`  
  - `slide.project.js`  
  - `element.projects.js`  

- `tokens/` – Design tokens (e.g., fonts)  
  - `fonts.js`  

- `utils/` – Generic helpers  
  - `dom.js`  
  - `parse.js`  
  - `katex.js`  

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

[Back to README](../../README.md)
