// engine/data.preload.js
const _cache = new Map();

export async function preloadData(loaders = {}, { useCache = true } = {}) {
  const entries = Object.entries(loaders);
  if (!entries.length) return {};

  const pairs = await Promise.all(entries.map(async ([key, fn]) => {
    try {
      if (useCache && _cache.has(key)) return [key, _cache.get(key)];
      const value = await fn();
      if (useCache) _cache.set(key, value);
      return [key, value];
    } catch (err) {
      console.warn(`[preloadData] "${key}" failed:`, err);
      return [key, undefined]; // or rethrow if you want strict behavior
    }
  }));

  return Object.fromEntries(pairs); // { key: data }
}
// 1 data.blocks enters
// 2 loop over data props to find: elData, whatever other data used
// 3 entries = elData whatever
// 4 Find each entries data, import it
