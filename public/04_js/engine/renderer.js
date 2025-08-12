import { getComponent } from './registry.js';
import { qs, mount } from '../utils/dom.js';

/**
 * Render a block tree
 * @param {Block} block
 * @param {HTMLElement} defaultRoot
 * @param {object} context - shared bag: { pageKey, registry, assets, bus }
 */
function renderBlock(block, defaultRoot, context) {
  const Component = getComponent(block.component);
  const node = Component(block.props || {}, context);       // ← PURE DOM creation
  const target = block.mount ? qs(block.mount) : defaultRoot;
  if (!target) throw new Error(`Mount target not found: ${block.mount || '(root)'}`);
  mount(node, target);

  // Recurse into children, using current node as default root unless mount overrides
  for (const child of (block.children || [])) {
    renderBlock(child, node, context);
  }
  return node;
}

export function render(manifest, root, context) {
  for (const block of manifest.blocks) renderBlock(block, root, context);
}
