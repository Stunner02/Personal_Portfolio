// engine/renderer.js
import { getComponent } from './registry.js';
import { qs, mount } from '../utils/dom.js';

/**
 * Block definition.
 * @typedef {object} Block
 * @property {string} component
 * @property {string} [mount]           // CSS selector like "#target"
 * @property {object} [props]           // Properties of a component
 * @property {Array<Block>} [children]  // Block can contain more Blocks. Ex: grid with sub components
 */

/**
 * Render a block tree
 * @param {Block} block
 * @param {HTMLElement} defaultRoot
 * @param {object} context - shared bag: { pageKey, registry, assets, bus }
 */

// render each block.component from manifest.
export function render(manifest, root, context) {   // Context is a bundle of page info. 
  for (const block of manifest.blocks) renderBlock(block, root, context);
}

// This is only for creating DOM elements, not setting up interactives.
function renderBlock(block, defaultRoot, context) {
  const Component = getComponent(block.component);            // From ./registry.js
  
  const props = { ...(block.props || {}) };
  if (props.elData && context?.data) {
    props.items = Array.isArray(context.data[props.elData])
      ? context.data[props.elData]
      : []; // safe empty default
  }
  const node = Component(props, context);         // Pass block props + context to component
  const target = block.mount ? qs(block.mount) : defaultRoot; // If block.mount exists, apply qs function to it, or return default root
  if (!target)                                                // Throw error if target !exist
    throw new Error(`Mount target not found: ${block.mount || '(root)'}`);
  mount(node, target);

  // Recurse into children, using current node as default root unless mount overrides
  for (const child of (block.children || [])) {
    renderBlock(child, node, context);
  }
  return node;
}