// findData.js is in charge of importing data from data/

export async function loadManifest(pageKey) {
  const m = await import(`../pages/manifests/${pageKey}.js`);
  return m.default || m.manifest || m; 
  /* m.default is used because export default is common on most manifests. 
     m.manifest is used in case the manifest page requires more than one object, 
     making manifest a seperate object */
}                                       

export async function loadSlides(name) {
  const m = await import(`../data/slides/${name}.js`);
  return m.default || m;
}

export async function loadElements(name) {
  const m = await import(`../data/elements/${name}.js`);
  return m.default || m;
}
