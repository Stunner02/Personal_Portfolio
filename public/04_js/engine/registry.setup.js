// /04_js/engine/registry.setup.js
import {
  registerComponent, registerInteractive,
  listComponents, listInteractives, sealRegistry
} from './registry.js';

/* Components (DOM factories) */
import projectsTile  from '../components/projectsTile.js';
// import ResumeBlock  from '/04_js/components/resume-block.js';    // Add later
// import ThemeSwitch  from '/04_js/components/theme-switch.js';

/* Interactives (classes/ctors) */
import revealsSlides from '../interactives/slides-init.js';
import fish from '../../06_src/fish-demo.js';
// import Accordion    from '/04_js/interactives/accordion.js';     // Add later


/* Add components/interactives to maps (imported from registry) */
export function setupRegistry() {

  // Component - register(name, factory)
  registerComponent('projectsTile', projectsTile);

  // Interactives - register(name, factory)
  registerInteractive('revealsSlides', revealsSlides);
  registerInteractive('fish', fish);

  // Optional: quick visibility in dev
  if (import.meta?.env?.DEV) {
    console.info('[registry] components:', listComponents());
    console.info('[registry] interactives:', listInteractives());
  }

  // Lock it so nobody mutates after setup
  sealRegistry();
}
