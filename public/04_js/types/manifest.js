// Not TS, just JSDoc typedefs to keep JS clean.
/**
 * @typedef {Object} Block
 * @property {string} component        // name registered in registry
 * @property {object} [props]          // component inputs (pure data)
 * @property {string} [mount]          // CSS selector to mount into (optional)
 * @property {Array<Block>} [children] // nested blocks (optional)
 */

/**
 * @typedef {Object} PageManifest
 * @property {string} key              // 'home' | 'resume' | ...
 * @property {Array<Block>} blocks     // top-level blocks to render in order
 * @property {object} [assets]         // preload lists (images, fonts, etc.)
 * @property {object} [options]        // page flags (theme, reveal, etc.)
 */
