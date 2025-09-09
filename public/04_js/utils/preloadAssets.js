// engine/preload.js

// --- File-scope config ---
const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg']);
const FONT_EXTS  = new Set(['woff2', 'woff']);
const CSS_EXTS   = new Set(['css']);
const JS_EXTS    = new Set(['js', 'mjs']);

const _preloaded = new Set(); // Stashes already loaded exts. Avoid double work across calls

/**
 * Preload or warm the cache for a list of URLs.
 * - De-dupes and resolves to absolute URLs
 * - Adds <link rel="preconnect"> for new origins (optional)
 * - Uses appropriate strategy per type (image/font/css/js)
 *
 * preloadAssets parameters:
 * @param {string[]} urls
 * @param {{
 *   throwOnError?: boolean,     // if true, reject on first failure
 *   base?: string,              // resolve relative URLs against this
 *   preconnect?: boolean,       // add <link rel="preconnect"> to new origins
 *   crossorigin?: 'anonymous'|'use-credentials'|undefined // for cross-origin fonts
 *                }}[opts] 
 * @returns {Promise<void>}
 */
export function preloadAssets(urls = [], opts = {}) {
  // 0) Default options below, pass the opts object with different values for varieties 
  const {
    throwOnError = false,
    base = document.baseURI || location.href,
    preconnect = true,
    crossorigin = 'anonymous',
  } = opts;

  // 1) Resolve duplicated links. Return asset links with no dupes to absolute in an array
  const absolute = dedupeResolve(urls, base);
  if (absolute.length === 0) return Promise.resolve();

  // 2) Add preconnects
  if (preconnect) addPreconnects(absolute);

  const tasks = absolute.map(url => {
    const ext = extname(url);

    // If the ext name matches, return appropriate preload method
    if (IMAGE_EXTS.has(ext)) return preloadImage(url);
    if (FONT_EXTS.has(ext))  return preloadFont(url, { crossorigin });
    if (CSS_EXTS.has(ext))   return preloadStyle(url);
    if (JS_EXTS.has(ext))    return preloadModule(url);

    return warmFetch(url); // generic fallback
  });

  return (throwOnError ? Promise.all(tasks).then(() => {}) 
                       : Promise.allSettled(tasks).then(() => {}));
}

// ---------- helpers (hoisted as declarations) ----------

// Check if url has duplicates
function dedupeResolve(urls, base) {
  const out = [];                         // 0) Set up returned 'out' array.
  for (const raw of urls) {
    if (!raw) continue;                         // Error check 1) Null or bad url, skip
    const href = new URL(raw, base).href; // 1) create href for url
    if (_preloaded.has(href)) continue;         // Error check 2) created url matches one already in _preloaded --> skip
    _preloaded.add(href);                 // 2) add href to _preloaded
    out.push(href);                       // 3) add new href to out
  }
  return out;                             // 4) return 'out' array once all urls are checked
}

// Return the extension name 
function extname(url) {
  try {
    const { pathname } = new URL(url, document.baseURI || location.href);
    const last = pathname.split('/').pop() || ''; // split url into an array, remove + return last one.
    const dot  = last.lastIndexOf('.');           // lastindexof() helps find the dot position in the extension
    // ? : is shorthand if else statement. If dot is > 0, run this : else run this
    return dot >= 0 ? last.slice(dot + 1).toLowerCase() : ''; // Return ext name here or ''
  } catch {
    return '';  // Invalid extension -> return empty string
  }
}

// Add preconnect to each unique origin, ignore our website origin 
function addPreconnects(urls) {

  // 1) Create origins set, strip everything but the origin, filter out our origin 
  const origins = new Set(
    urls
      .map(u => new URL(u).origin)
      .filter(o => o !== location.origin)
  );  // new URL("https://fonts.gstatic.com/s/inter…").origin → "https://fonts.gstatic.com"

  // 2) For each origin, add a preconnect and a dns-prefetch as a fallback
  for (const origin of origins) {
    // Warms DNS + TCP + TLS
    if (!document.head.querySelector(`link[rel~="preconnect"][href^="${origin}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    // Cheap DNS warmup as a fallback - Light-weight DNS hint (safe redundancy)
    if (!document.head.querySelector(`link[rel~="dns-prefetch"][href^="${origin}"]`)) {
      const dns = document.createElement('link');
      dns.rel = 'dns-prefetch';
      dns.href = origin;
      document.head.appendChild(dns);
    }
  }
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Keep priority tame; this is a warm-up, not layout-critical
    if ('fetchPriority' in img) img.fetchPriority = 'low';
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`image failed: ${url}`));
    img.src = url;
    // If you use srcset/sizes in production, consider a <link rel="preload" imagesrcset=...>
  });
}

function preloadFont(url, { crossorigin = 'anonymous' } = {}) {
  // Best-practice hint; the browser will reuse this when the @font-face fires.
  return new Promise((resolve, reject) => {
    let link = document.head.querySelector(`link[rel="preload"][as="font"][href="${url}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'preload';
      link.as  = 'font';
      link.href = url;
      // Cross-origin fonts need CORS headers on the server.
      // Set crossorigin if different origin, otherwise skip to avoid warnings.
      if (new URL(url).origin !== location.origin) link.crossOrigin = crossorigin;
      document.head.appendChild(link);
    }
    // Some browsers fire load/error on preload; settle either way after a timeout fallback
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', () => reject(new Error(`font failed: ${url}`)), { once: true });
    // Fallback: if no event fires (older engines), also warm via fetch (opaque is fine)
    setTimeout(() => { fetch(url, { mode: 'no-cors' }).finally(resolve); }, 250);
  });
}

function preloadStyle(url) {
  // Preload the stylesheet so later <link rel="stylesheet" href="..."> is instant.
  return new Promise((resolve, reject) => {
    let link = document.head.querySelector(`link[rel="preload"][as="style"][href="${url}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'preload';
      link.as  = 'style';
      link.href = url;
      document.head.appendChild(link);
    }
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', () => reject(new Error(`style failed: ${url}`)), { once: true });
    // Safety warm-up in case preload events aren't reliable:
    setTimeout(() => { fetch(url, { mode: 'no-cors' }).finally(resolve); }, 250);
  });
}

function preloadModule(url) {
  // ES modules benefit from <link rel="modulepreload"> (preloads graph)
  // If you’re going to <script type="module" src="..."> later, this pays off.
  return new Promise((resolve, reject) => {
    let link = document.head.querySelector(`link[rel="modulepreload"][href="${url}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = url;
      document.head.appendChild(link);
    }
    // Browsers may not fire load reliably for modulepreload; also warm via fetch.
    fetch(url, { mode: 'no-cors', cache: 'force-cache' }).then(() => resolve()).catch(reject);
  });
}

function warmFetch(url) {
  // Generic low-friction warm-up; ok to be opaque. Force cache so same-origin skips network.
  return fetch(url, { mode: 'no-cors', cache: 'force-cache' }).then(() => {});
}
