/**
 * initInteractives(root, manifest, context)
 * ---------------------------------------
 * Drop-in hydrator for "interactive" blocks.
 *
 * Conventions:
 *  - Mark interactive roots in HTML:  <div data-interactive="slideDeck" data-props='{"controls":true}'></div>
 *  - Module interface: export async function mount(el, props, context) { ... }
 *    (or default export as the mount function). Optional: export function unmount(el) { ... }.
 *  - Registry (optional): context.registry?.getInteractive(name) -> Promise<Module>|Module
 *
 */

const _state = new WeakMap(); // el -> { name, mounted, unmount? }

/**
 * @param {object} manifest
 * @param {HTMLElement|Document} root
 * @param {object} context - { registry?, pageKey?, bus? ... }
 */
export async function initInteractives(manifest = {}, root = document, context = {}) {
  // 1) Locate all hydrate targets
  const targets = Array.from(root.querySelectorAll('[data-interactive]')); 
  if (targets.length === 0) return;

  // Prefer lazy hydrate; allow opt-out per element.
  const canIO = 'IntersectionObserver' in window;
  const io = canIO
    ? new IntersectionObserver(onIntersect, { rootMargin: '200px 0px', threshold: 0.01 })
    : null;

  // 2) 
  for (const el of targets) {
    const name = (el.dataset.interactive || '').trim(); // Trim removes whitespace from name
    if (!name) continue;                                // If name isn't readable, skip

    // Gather props: prefer data-props JSON, otherwise all other data-* fields.
    const props = readProps(el);

    // If author sets data-lazy="false" or IO not supported, mount now.
    if (el.dataset.lazy === 'false' || !io) {
      // Fire and forget; keep bootstrap flowing.
      mountOne(el, name, props, context).catch(console.warn);
    } else {
      _state.set(el, { name, mounted: false });
      io.observe(el);
    }
  }

  function onIntersect(entries, observer) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      const meta = _state.get(el);
      if (!meta || meta.mounted) {
        observer.unobserve(el);
        continue;
      }
      meta.mounted = true;
      observer.unobserve(el);
      mountOne(el, meta.name, readProps(el), context).catch(console.warn);
    }
  }
}

/* ------------ helpers ------------ */

function readProps(el) {
  // If data-props='{"a":1}' exists, try to parse it
  const raw = el.dataset.props;
  if (raw) {
    try { return JSON.parse(raw); } catch { /* fall through */ }
  }
  // Else collect all dataset except "interactive" and "lazy" and "props"
  const { interactive, lazy, props, ...rest } = el.dataset;
  // Convert dataset (kebab/underscores not handled here—expect camelCase in data-*)
  return { ...rest };
}

async function mountOne(el, name, props, context) {
  // Avoid double-mounts
  const meta = _state.get(el);
  if (meta?.mounted) return;

  // Resolve module: registry first, then dynamic import fallbacks
  const mod = await loadInteractiveModule(name, context);

  const fn = (mod && (mod.mount || mod.default));
  if (typeof fn !== 'function') {
    console.warn(`[initInteractives] "${name}" has no mount() export`, mod);
    return;
  }

  // Mount
  const maybeCleanup = await fn(el, props, context);
  const unmount = (typeof mod?.unmount === 'function') ? mod.unmount : (
    typeof maybeCleanup === 'function' ? maybeCleanup : null
  );

  _state.set(el, { name, mounted: true, unmount });

  // Optional: auto-cleanup on pagehide (best-effort)
  window.addEventListener('pagehide', () => {
    try { unmount && unmount(el, context); } catch {}
  }, { once: true });
}

async function loadInteractiveModule(name, context) {
  // 1) Registry path (preferred)
  try {
    const reg = context?.registry;
    if (reg && typeof reg.getInteractive === 'function') {
      const fromReg = await reg.getInteractive(name);
      if (fromReg) return fromReg;
    }
  } catch (e) {
    console.warn(`[initInteractives] registry.getInteractive("${name}") failed`, e);
  }

  // 2) Author-provided absolute/relative path via data-module="..."
  //    Example: <div data-interactive="foo" data-module="/04_js/interactives/foo.js">
  const overridePath = document.querySelector(`[data-interactive="${cssEscape(name)}"][data-module]`)?.dataset.module;
  if (overridePath) {
    const m = await safeImport(overridePath);
    if (m) return m;
  }

  // 3) Conventional locations (adjust to your project as needed)
  const candidates = [
    `../interactives/${name}.js`,       // if engine/ and interactives/ are siblings under src/
    `../../interactives/${name}.js`,    // if engine/ is nested deeper
    `/src/interactives/${name}.js`,     // absolute during dev with Vite
    `/public/04_js/interactives/${name}.js`, // if running from compiled public tree
  ];

  for (const path of candidates) {
    const m = await safeImport(path);
    if (m) return m;
  }

  throw new Error(`[initInteractives] Could not resolve interactive "${name}"`);
}

async function safeImport(path) {
  try {
    // Vite needs @vite-ignore for runtime-computed specifiers
    return await import(/* @vite-ignore */ path);
  } catch {
    return null;
  }
}

// Minimal CSS.escape polyfill for attribute selectors (very small surface we need)
function cssEscape(str) {
  return String(str).replace(/"/g, '\\"');
}
