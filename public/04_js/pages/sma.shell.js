// Page shell for the Shape Memory Alloy page.
// Purpose: start the engine with the manifest whose key matches this page.

import { bootstrap } from '../engine/bootstrap.js';

/**
 * Called by main.js after it lazy-imports this shell.
 * Keeps page-specific logic here (if any), but right now it just boots.
 */
export async function startPage() {
  await bootstrap({
    pageKey: 'shapeMemoryAlloy', // must match manifest.key
    rootSelector: '#app',        // change only if your page uses a different root
  });
}