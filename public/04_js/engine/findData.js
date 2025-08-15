// findData.js is in charge of importing data from data/
export async function loadManifest(pageKey) {
  const m = await import(`../data/manifests/${pageKey}.js`);
  return m.default || m.manifest || m;
}

export async function loadSlides(name) {
  const m = await import(`../data/slides/${name}.js`);
  return m.default || m;
}

export async function loadElements(name) {
  const m = await import(`../data/elements/${name}.js`);
  return m.default || m;
}
