/* registry.js: 1. creates maps - 2. registers components - 3. gets components
* register functions: sets key and value for components (name, factory)
* get functions:      looks for the name of the component, returns key/value: name/factory
*/
const components = new Map();
const interactives = new Map();

export function registerComponent(name, factory) {
  components.set(name, factory);
}
export function getComponent(name) {
  if (!components.has(name)) throw new Error(`Component "${name}" not found`);
  return components.get(name);
}

 // Add interactives to the interactive map, ctor = factory
export function registerInteractive(name, ctor) {
  interactives.set(name, ctor); // Set(key, value)
}
export function getInteractive(name) {
  if (!interactives.has(name)) throw new Error(`Interactive "${name}" not found`);
  return interactives.get(name);
}

export function listComponents() { return [...components.keys()]; }
export function listInteractives() { return [...interactives.keys()]; }
