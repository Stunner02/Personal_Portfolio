// utils/dom.js

/**
 * Query a single element. Optionally scope to a root (Element/Document/ShadowRoot).
 * - If you pass an Element instead of a selector, it is returned unchanged.
 * - Returns null when not found (let callers decide whether to throw).
 *
 * @param {string|Element} selector
 * @param {Document|Element|DocumentFragment|ShadowRoot} [root=document]
 * @returns {Element|null}
 */
export function qs(selector, root = document) {
  if (selector instanceof Element) return selector;
  if (typeof selector !== 'string') {
    throw new TypeError('qs(selector) expects a CSS selector string or Element');
  }
  // Prefer querying inside <head> when root is document for meta/link lookups elsewhere
  const scope = root || document;
  return scope.querySelector(selector);
}

/**
 * Mount a node (or HTML string / array of nodes) into a target element.
 * Default is append; you can clear first or choose a different mode.
 *
 * @param {Node|string|Array<Node|string>} node
 * @param {Element|string} target                 - Element or selector
 * @param {{ clear?: boolean, mode?: 'append'|'prepend'|'replace' }} [opts]
 * @returns {Node}                                - The node that was mounted (or the fragment)
 */
export function mount(node, target, opts = {}) {
  const { clear = false, mode = 'append' } = opts;

  const parent = typeof target === 'string' ? qs(target) : target;
  if (!parent || !(parent instanceof Element)) {
    throw new Error('mount(): target not found or not an Element');
  }

  const toInsert = toNode(node);

  if (clear || mode === 'replace') {
    parent.replaceChildren(); // clears faster than manual loops
  }

  switch (mode) {
    case 'prepend':
      parent.prepend(toInsert);
      break;
    case 'replace':
      parent.append(toInsert);
      break;
    case 'append':
    default:
      parent.append(toInsert);
      break;
  }

  return toInsert;
}

// ----------------- internal helpers -----------------

/**
 * Normalize inputs into a Node:
 * - string → DocumentFragment via <template>
 * - Node   → same Node
 * - Array  → DocumentFragment of all items
 */
function toNode(input) {
  if (input instanceof Node) return input;

  if (typeof input === 'string') {
    const tpl = document.createElement('template');
    tpl.innerHTML = input.trim();
    return tpl.content; // DocumentFragment
  }

  if (Array.isArray(input)) {
    const frag = document.createDocumentFragment();
    for (const item of input) {
      const n = toNode(item);
      frag.append(n);
    }
    return frag;
  }

  throw new TypeError('mount(): expected Node, string, or Array of those');
}
