// src/engine/bootstrap.js
import './registry.setup.js';                          // ensure components/interactives are registered

import { loadManifest } from './engine/findData.js';
import { render } from './engine/renderer.js';
import { initInteractives } from './initInteractives.js';
import { initRevealIfNeeded } from './engine/revealSetup.js';
import { applyTheme, applyFonts } from './themeFonts.js';
import { preloadAssets } from '../utils/preloadAssets.js';

/**
 * Apply <head> tags from manifest.meta (title, description, canonical, favicon, OG image)
 * Keeps SEO data next to the page manifest.
 */
function applyMeta(meta = {}) {
  const upsertMetaByName = (name, content) => {
    if (!content) return;
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('name', name); document.head.appendChild(tag); }
    tag.setAttribute('content', content);
  };

  const upsertMetaByProp = (property, content) => {
    if (!content) return;
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); }
    tag.setAttribute('content', content);
  };

  const upsertLink = (rel, href) => {
    if (!href) return;
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', rel); document.head.appendChild(link); }
    link.setAttribute('href', href);
  };

  if (meta.title) document.title = meta.title;
  upsertMetaByName('description', meta.description);
  upsertLink('canonical', meta.canonical);
  upsertLink('icon', meta.favicon);
  upsertMetaByProp('og:title', meta.ogTitle || meta.title);
  upsertMetaByProp('og:description', meta.ogDescription || meta.description);
  upsertMetaByProp('og:image', meta.ogImage);
  upsertMetaByProp('og:url', meta.canonical);
}

/**
 * Boot a page using its manifest key.
 * @param {{ pageKey: string, rootSelector?: string }} opts
 */
export async function bootstrap({ pageKey, rootSelector = '#app' }) {
  const root = document.querySelector(rootSelector);
  if (!root) throw new Error(`[bootstrap] Root not found: ${rootSelector}`);

  // 1) Load manifest (data only)
  const manifest = await loadManifest(pageKey);
  if (!manifest || !manifest.blocks) {
    throw new Error(`[bootstrap] Invalid manifest for "${pageKey}"`);
  }

  // 2) Head/meta + theme/fonts (page-wide cosmetics)
  if (manifest.meta) applyMeta(manifest.meta);
  if (manifest.options?.theme) applyTheme(manifest.options.theme);
  if (manifest.assets?.fonts && manifest.assets.fonts.length) {
    await applyFonts(manifest.assets.fonts);
  }

  // 3) Preload assets (non-blocking is fine; await if you want strict ordering)
  try {
    if (manifest.assets) preloadAssets(manifest.assets);
  } catch (e) {
    console.warn('[bootstrap] preloadAssets warning:', e);
  }

  // 4) Render static DOM via components
  const context = { pageKey, options: manifest.options, manifest };
  render(manifest, root, context);

  // 5) Hydrate interactives
  await initInteractives(root, manifest, context);

  // 6) Initialize Reveal decks if this page opted in
  if (manifest.options?.reveal) {
    await initRevealIfNeeded(root);
  }

  return { manifest, root };
}
