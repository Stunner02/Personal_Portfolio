// slides.js  (ES-module, works fine with Vite or plain <script type="module">)
import Reveal       from 'reveal.js';
import Fullscreen   from 'reveal.js/plugin/fullscreen/fullscreen.esm.js';

const BASE = {
  embedded: true,
  keyboardCondition: 'focused',
  plugins: [Fullscreen],
  margin: 0.04
};

// Helper ▸ reads data-attributes off the element and merges with BASE
export function initDeck(el) {
  const perDeck = {
    width:  el.dataset.width  ? +el.dataset.width  : 960,
    height: el.dataset.height ? +el.dataset.height : 700,
    // any other per-deck overrides here...
  };
  const deck = new Reveal(el, { ...BASE, ...perDeck });
  return deck.initialize().then(() => deck);
}
