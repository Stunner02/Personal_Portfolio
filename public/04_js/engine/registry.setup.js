// /04_js/engine/registry.setup.js
import {
  registerComponent,
  registerInteractive,
  sealRegistry
} from './registry.js';

/* ---- Components (DOM factories) ---- */
import projectsTile from '../components/projectsTile.js';
// import ResumeBlock  from '/04_js/components/resume-block.js';    // Add later
// import ThemeSwitch  from '/04_js/components/theme-switch.js';

/* ---- Interactives (classes/ctors) ---- */
// import revealsSlides from '../interactives/slides-init.js';
// import Accordion    from '/04_js/interactives/accordion.js';     // Add later

// Quick fix: couldn't import default with fish, lazy side-effect loader; no exports needed from fish-demo.js
const fish = () => import('../../06_src/fish-demo.js');

export async function setupRegistry() {

  // Component - register(name, factory)
  registerComponent('projectsTile', projectsTile);

  // Interactives - register(name, factory)
  // registerInteractive('revealsSlides', revealsSlides);
  registerInteractive('fish', fish);

  // Optional: quick visibility in dev
  if (import.meta?.env?.DEV) {
    console.info('[registry] components:', listComponents());
    console.info('[registry] interactives:', listInteractives());
  }

  // Lock it so nobody mutates after setup
  // sealRegistry();
}
