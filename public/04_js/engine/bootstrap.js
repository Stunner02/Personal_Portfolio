// engine/bootstrap.js
import { setupRegistry } from './registry.setup.js'; // ensure components/interactives are registered
import { loadManifest } from './findData.js';
import { render } from './renderer.js';
import { qs } from '../utils/dom.js';
import hydrator from './hydrator.js';
// import { initInteractives } from './initInteractives.js';
// import { applyTheme, applyFonts } from './themeFonts.js';
import { preloadData } from './preloadData.js';
import { preloadAssets } from '../utils/preloadAssets.js';


// setupGlobals is empty - setup for later
export async function setupGlobals() {
  // preload fonts/polyfills/etc here later
  return {}; // return { env: {} } if it gets used later
}

/**
 * Apply <head> tags from manifest.meta (title, description, canonical, favicon, OG image)
 * Keeps SEO data next to the page manifest.
 */
function applyMeta(meta = {}) {
  //    upsert = update or insert
  const upsertMetaByName = (name, content) => {
    if (!content) return;
    let tag = document.head.querySelector(`meta[name="${name}"]`);
    if (!tag) { 
      tag = document.createElement('meta'); // Create <meta>
      tag.setAttribute('name', name);       // Give 'name' attribute
      document.head.appendChild(tag); 
    }
    tag.setAttribute('content', content);
  };
  //    upsert = update or insert
  const upsertLink = (rel, href) => {
    if (!href) return;
    let link = document.head.querySelector(`link[rel="${rel}"]`);
    if (!link) { 
      link = document.createElement('link');  // Create <link> 
      link.setAttribute('rel', rel);          // Give 'rel' attribute
      document.head.appendChild(link); 
    }
    link.setAttribute('href', href);
  };

  // const upsertMetaByProp = (property, content) => {
  //   if (!content) return;
  //   let tag = document.head.querySelector(`meta[property="${property}"]`);
  //   if (!tag) { 
  //     tag = document.createElement('meta');   // Create <meta>
  //     tag.setAttribute('property', property); // Give 'property' attribute
  //     document.head.appendChild(tag); 
  //   }
  //   tag.setAttribute('content', content);
  // };

  if (meta.title) document.title = meta.title;
  upsertMetaByName('description', meta.description);
  upsertLink('canonical', meta.canonical);
  upsertLink('icon', meta.favicon);

  /* Below sets up Open Graph metadata so the page preview looks good on social media */
  // upsertMetaByProp('og:title', meta.ogTitle || meta.title);
  // upsertMetaByProp('og:description', meta.ogDescription || meta.description);
  // upsertMetaByProp('og:image', meta.ogImage);
  // upsertMetaByProp('og:url', meta.canonical);
}

/**
 * Boot a page using its manifest key.
 * @param {{ pageKey: string, rootSelector?: string }} opts
 */

export async function bootstrap({ pageKey, rootSelector = 'main' }) {

  // Limiting doc scope with root - reduces error/search speed 
  const root = document.querySelector(rootSelector);
  if (!root) throw new Error(`[bootstrap] Root not found: ${rootSelector}`);

  // 0) Load manifest (data only)
  const manifest = await loadManifest(pageKey);
  if (!manifest || !manifest.blocks) {
    throw new Error(`[bootstrap] Invalid manifest for "${pageKey}"`);
  }

  // 0.1 Load Data
  const dataBag = await preloadData(manifest)

  // 1) Registry must be ready before components/interactives are used
  setupRegistry();

  // 2) Head/meta + theme/fonts (page-wide cosmetics)
  if (manifest.meta) applyMeta(manifest.meta);

  // Set up page themes potentially later

  // 3) Preload assets (non-blocking is fine; await if you want strict ordering)
  // 3.1) Posters for interactives get preloadeded here. 
  try {
    if (manifest.assets) preloadAssets(manifest.assets.images); // Fix: currently only loads images, sort out manifest 
  } catch (e) {
    console.warn('[bootstrap] preloadAssets warning:', e);
  }

  // Context - provide components context - page name, options, manifest, databag
  const context = { pageKey, options: manifest.options, manifest, data: dataBag };

  // 4) Render static DOM via components - first paint
  render(manifest, root, context);

  // 5) Hydrator
  await hydrator(manifest, root, context); // Prepare(), First pass(), Full pass()

  return { manifest, root };
}
