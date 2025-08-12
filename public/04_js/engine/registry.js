const components = new Map();
const interactives = new Map();

export function registerComponent(name, factory) {
  components.set(name, factory);
}
export function getComponent(name) {
  if (!components.has(name)) throw new Error(`Component "${name}" not found`);
  return components.get(name);
}

export function registerInteractive(name, ctor) {
  interactives.set(name, ctor);
}
export function getInteractive(name) {
  if (!interactives.has(name)) throw new Error(`Interactive "${name}" not found`);
  return interactives.get(name);
}

export function listComponents() { return [...components.keys()]; }
export function listInteractives() { return [...interactives.keys()]; }
