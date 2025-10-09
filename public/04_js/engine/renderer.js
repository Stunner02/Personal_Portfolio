// engine/renderer.js
import { getComponent , getInteractive } from './registry.js';
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
export async function render(manifest, root, context) {
  for (const block of manifest.blocks) {
    await renderBlock(block, root, context);
  }
}

// This is only for creating DOM elements, not setting up interactives.
async function renderBlock(block, defaultRoot, context) {
  const target = block.mount ? qs(block.mount) : defaultRoot;
  if (!target) throw new Error(`Mount target not found: ${block.mount || '(root)'}`);

  // Interactive route
  if (block.interactive) {
    // Renderer sets up first pass of interactives, and labels them hydration ready!
    // The initInteractive function then searches for the labels ready to be hydrated 
    // after first pass and fully initiates them
    /* 1. block.interactive: match interactive name with file pathway - is this done in registry? 
          A. Yes, reg does this.
       2. run the first pass part of the interactive, each one should have their own optimized method
       3. Label the interactive as hydrationReady! for initInteractive.js
    */

    // Tag the existing element so the hydrator can find and mount later
    target.dataset.interactive = block.interactive;
    if (block.props) target.dataset.props = JSON.stringify(block.props);

    // Optional readiness flag to gate hydration (your preload will flip this)
    if (block.props?.hydrationReady === true) {
      target.dataset.hydrationReady = 'true';
    } else if (!target.dataset.hydrationReady) {
      target.dataset.hydrationReady = 'false';
    }

    // Render any children into this same target (optional)
    for (const child of (block.children || [])) {
      await renderBlock(child, target, context);
    }
    return target;
  }

  // Component route
  const Component = getComponent(block.component);
  const props = { ...(block.props || {}) };
  if (props.elData && context?.data) {
    props.items = Array.isArray(context.data[props.elData]) ? context.data[props.elData] : [];
  }
  const node = Component(props, context);
  mount(node, target);

  for (const child of (block.children || [])) {
    await renderBlock(child, node, context);
  }
  return node;
}