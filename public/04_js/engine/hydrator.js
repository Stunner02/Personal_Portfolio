// engine/hydrator.js
//
// Posters/placeholder HTML are already in the page for first paint.
// This hydrator does, per interactive block:
//   1) prepare()         — load slides object / heavy deps (Reveal) or GLB/HDR (Three)
//   2) mountFirstPass()  — fast upgrade (e.g., swap poster → first few slides / lite scene)
//   3) mountSecondPass() — finish in the background (append remaining slides / full 3D)
//
// Notes:
// - Second pass runs "in the background" (not awaited by Hydrator) so the page stays snappy.
// - If a module doesn't implement mountFirstPass/mountSecondPass, we fall back to a single mount().
// - We never inject posters here; your HTML already handles first paint.

import { qs } from '../utils/dom.js';
import { getInteractive } from './registry.js';

export default async function hydrator(manifest, root, context) {
  // 1) Name interactives in the manifest
  const blocks = collectInteractiveBlocks(manifest.blocks);

  // 2) Run each interactive independently
  // 3) prepare+first pass are awaited for "ASAP upgrade".
  await Promise.all(blocks.map(block => hydrateOne(block, root, context)));
}

async function hydrateOne(block, root, context) {
  const el = block.mount ? qs(block.mount) : root;
  if (!el) {
    console.warn('[hydrator] mount not found:', block.mount || '(root)');
    return;
  }

  const name  = String(block.interactive || '');
  const props = block.props || {};

  try {
    // Resolve module (can be object with {prepare, mountFirstPass, mountSecondPass} or a default function)
    const mod = await getInteractive(name);

    // 1) PREPARE — load heavy deps + data
    const prepared = (typeof mod.prepare === 'function')
      ? await mod.prepare(el, props, context)
      : undefined;

    // 2) FIRST PASS — fast upgrade using prepared payload
    //    Prefer explicit mountFirstPass; else fall back to single mount/default.
    const firstPass =
      (typeof mod.mountFirstPass === 'function' && mod.mountFirstPass) ||
      (typeof mod.mount          === 'function' && mod.mount)          ||
      (typeof mod.default        === 'function' && mod.default)        ||
      null;

    if (!firstPass) {
      console.warn('[hydrator] no mount function for', name, mod);
      return;
    }

    el.dataset.hydrationReady = 'first';
    const cleanupMaybe = await firstPass(el, props, context, prepared, { stage: 'first' });
    if (typeof cleanupMaybe === 'function') {
      // If first pass returns a cleanup, prefer the "latest" cleanup on second pass.
      el.__ixCleanup = cleanupMaybe;
    }

    // 3) SECOND PASS — finish in background (do not block hydrator flow)
    const secondPass =
      (typeof mod.mountSecondPass === 'function' && mod.mountSecondPass) || null;

    if (secondPass) {
      // Fire-and-forget; handle its own errors to avoid unhandled rejections.
      Promise.resolve()
        .then(() => secondPass(el, props, context, prepared, { stage: 'second' }))
        .then(cleanup2 => {
          el.dataset.hydrationReady = 'full';
          if (typeof cleanup2 === 'function') el.__ixCleanup = cleanup2;
        })
        .catch(err => {
          console.warn('[hydrator] second pass failed for', name, err);
          // Keep first-pass deck/scene; poster is already gone.
        });
    } else {
      // Single-stage modules mark as full once first pass is done.
      el.dataset.hydrationReady = 'full';
    }
  } catch (e) {
    console.warn('[hydrator] failed for', name, e);
    // Leave poster/placeholder in place; optional: mark error for CSS
    // el.dataset.error = 'true';
  }
}

/* -------------------- Utilities -------------------- */

function collectInteractiveBlocks(blocks = [], out = []) {
  for (const b of blocks) {
    if (b?.interactive) out.push(b);
    if (Array.isArray(b?.children) && b.children.length) {
      collectInteractiveBlocks(b.children, out);
    }
  }
  return out;
}
