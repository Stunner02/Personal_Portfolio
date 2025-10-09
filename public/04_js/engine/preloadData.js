// engine/data.preload.js

export async function preloadData(manifest) {
  if (!manifest) throw new Error('[preloadData] manifest is required');
  const need = collectDatasetKeys(manifest);      // e.g., ["projects"]
  return await loadDataBag(need);                 // -> { projects: [...] }
}

/* ----- Data get/register/collect ----- */
export async function loadDataBag(keys = []) {
  const entries = await Promise.all(
    keys.map(async (name) => {
      // Assumes keys are bare names like "projects"
      const url = new URL(`../data/elements/${name}.js`, import.meta.url).href;
      const mod = await import(/* @vite-ignore */ url);

      // Accept: default, named "data", or named matching the file (e.g., projects)
      const data = mod.default ?? mod.data ?? mod[name];
      if (data === undefined) {
        throw new Error(`[data] ${name}.js must export default, "data", or "${name}"`);
      }
      return [name, data]; // e.g., ["projects", [...]]
    })
  );

  return Object.fromEntries(entries); // { projects: [...] , ... }
}

// Find keys in manifest: element Data, interactive Data
export function collectDatasetKeys(manifest) {
  const need = new Set();
  for (const block of manifest.blocks || []) {
    const p = block.props || {};
    if (p.elData) need.add(p.elData);
    if (p.InData) need.add(p.inData);
    if (Array.isArray(p.datasets)) for (const k of p.datasets) need.add(k);
  }
  return [...need];
}

// need = ['project','education', ...]
// export async function preloadData(need) {
//   const keys = [...new Set(need || [])];   // dedupe/guard

//   await Promise.all(keys.map(async (key) => {
//     const loader = dataLoaders[key];
//     if (!loader) { console.warn(`[preloadData] No loader for "${key}"`); return; }

//     // memoize the promise so repeated calls don't refetch
//     if (!dataCache.has(key)) {
//       dataCache.set(key,
//         Promise.resolve()
//           .then(loader)                                      // <-- runs the dynamic import now
//           .then(m => (m && m.default !== undefined ? m.default : m))
//           .catch(err => { console.error(`[preloadData] ${key}`, err); return undefined; })
//       );
//     }

//     const value = await dataCache.get(key);
//     databag.set(key, value);
//   }));

//   // optional: snapshot for debugging
//   return Object.fromEntries(databag);
// }

// 1 data.blocks enters
// 2 loop over data props to find: elData, whatever other data used
// 3 entries = elData whatever
// 4 Find each entries data, import it
