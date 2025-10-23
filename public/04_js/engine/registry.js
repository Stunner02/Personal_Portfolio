/* registry.js: 1. creates maps - 2. registers components - 3. gets components
* register functions: sets key and value for components (name, factory)
* get functions:      looks for the name of the component, returns key/value: name/factory
*/
const components = new Map();
const interactives = new Map();

const dataLoaders = Object.create(null);  // name -> () => Promise<any>
const dataCache   = new Map();            // name -> Promise<any>
const databag     = new Map();            // name -> value


/* ----- Component get/register ------ */
export function registerComponent(name, factory) { 
  components.set(name, factory);
}

export function getComponent(name) { // Used in render
  if (!components.has(name)) throw new Error(`Component "${name}" not found`);
  return components.get(name);
}

/* ----- Interactives get/register ----- */
export function registerInteractive(name, ctor) { // Add interactives to the interactive map, ctor = factory
  interactives.set(name, ctor); // Set(key, value)
}

export async function getInteractive(name) {
  if (!interactives.has(name)) throw new Error(`Interactive "${name}" not found`);
  const entry = interactives.get(name);                 // module OR loader
  const mod = (typeof entry === 'function') ? await entry() : entry;

  // Flatten default so either named or default exports work
  if (mod && (typeof mod.default === 'object' || typeof mod.default === 'function')) {
    return { ...mod, ...mod.default };
  }
  return mod;
}


export function listComponents()    { return [...components.keys()]; }
export function listInteractives()  { return [...interactives.keys()]; }
export function listData()          { return [...databag.keys()]; }

// Seal Registry 
export function sealRegistry() { _sealed = true; }
export const isRegistrySealed = () => _sealed;