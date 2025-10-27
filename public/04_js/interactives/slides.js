// /04_js/interactives/slides.js
import { startDeck } from '../engine/reveal/revealSetup';

export async function mount(el, props = {}) {
  return startDeck(el, props);
}