// /04_js/interactives/slides.js
import { startDeck } from '../engine/reveal/revealSetup';

export async function mount(el, props = {}) {
  el.querySelector('.slides')?.replaceChildren(); // drop poster
  return startDeck(el, props);
}