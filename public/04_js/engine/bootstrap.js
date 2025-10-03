// engine/bootstrap.js
import { setupRegistry } from './registry.setup.js'; // ensure components/interactives are registered
import { loadManifest } from './findData.js';
import { render } from './renderer.js';
import { initInteractives } from './initInteractives.js';
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
  // Setting a root element limits the query scope of the components to improve error rate
  const root = document.querySelector(rootSelector);
  if (!root) throw new Error(`[bootstrap] Root not found: ${rootSelector}`);

  // 0) Load manifest (data only)
  const manifest = await loadManifest(pageKey);
  if (!manifest || !manifest.blocks) {
    throw new Error(`[bootstrap] Invalid manifest for "${pageKey}"`);
  }

  //0.1 Load Data
  const dataBag = await preloadData(manifest)

  // 1) Registry must be ready before components/interactives are used
  setupRegistry();

  // 2) Head/meta + theme/fonts (page-wide cosmetics)
  if (manifest.meta) applyMeta(manifest.meta);

  // Set up themes potentially later, fonts only for slides at the moment, need to
  // create applyFonts.js? Mostly just want the manifest to call the fonts for the slides */
  /*
    if (manifest.options?.theme) applyTheme(manifest.options.theme);
    if (manifest.assets?.fonts && manifest.assets.fonts.length) {
      await applyFonts(manifest.assets.fonts);
    }
  */

  // 3) Preload assets (non-blocking is fine; await if you want strict ordering)
  try {
    if (manifest.assets) preloadAssets(manifest.assets.images); // Fix: currently only loads images, sort out manifest 
  } catch (e) {
    console.warn('[bootstrap] preloadAssets warning:', e);
  }

  // 4) Render static DOM via components - first paint
  const context = { pageKey, options: manifest.options, manifest, data: dataBag };
  render(manifest, root, context);

  // 5) Hydrate interactives
  await initInteractives(manifest, root, context);

  // 6) This should be in interactives ^^^
  const hasSlides = manifest.blocks.some(b => b?.component === 'slide');
  if (hasSlides) {  // Initialize Reveal decks if this page opted in
    const { initSlides } = await import('./revealSetup.js');
    await initSlides(root);
  }

  return { manifest, root };
}
