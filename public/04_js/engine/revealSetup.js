// engine/revealSetup.js
// No side effects on import — you control when Reveal runs.

import { FONT_STACKS } from '../tokens/fonts';

/**
 * Boot Reveal only if the page actually needs it.
 * Heuristics:
 *  - manifest.options?.reveal === true   (preferred)
 *  - OR the manifest has a 'slide' block
 *  - OR the DOM already contains .reveal nodes under `root`
 *
 * Call this **after** your blocks render so .reveal exists.
 */
export async function initRevealIfNeeded(root = document, manifest = {}, context = {}) {
  const hasRevealFlag =
    !!manifest?.options?.reveal || // preferred place for the switch
    false;

  const hasSlideBlock =
    Array.isArray(manifest?.blocks) &&
    manifest.blocks.some(b => b?.component === 'slide');

  const hasRevealDom =
    !!(root.querySelector && root.querySelector('.reveal'));

  if (!hasRevealFlag && !hasSlideBlock && !hasRevealDom) {
    return; // nothing to do
  }

  // Load Reveal only when needed
  const { default: Reveal } = await import('reveal.js');

  // Initialize every deck in scope
  const decks = Array.from(root.querySelectorAll('.reveal'));
  if (decks.length === 0) return; // blocks may not have rendered yet

  await Promise.all(decks.map(el => startDeck(el, Reveal)));
}

/**
 * Start a single deck found at a <div class="reveal" data-slideset="KEY">…</div>
 * If the slide data module is missing, we render an empty deck instead of crashing.
 */
export async function startDeck(revealDiv, RevealLib = null) {
  const RevealCtor = RevealLib || (await import('reveal.js')).default;

  // "SMA", "resume", etc. — set by your slide block onto the container
  const slideKey = revealDiv.dataset.slideset;
  const slides = await loadSlides(slideKey); // [] if not found

  const deck = buildDeck(revealDiv, slides, RevealCtor);
  await deck.initialize();
}

/* ----------------- internals ----------------- */

async function loadSlides(slideKey) {
  if (!slideKey) return [];
  // Try a few common locations. Adjust if your repo differs.
  const candidates = [
    `../data/slides/${slideKey}.js`,
    `./data/${slideKey}.js`,
    `/src/data/slides/${slideKey}.js`,
  ];
  for (const spec of candidates) {
    try {
      const mod = await import(/* @vite-ignore */ spec);
      return mod?.slides ?? [];
    } catch { /* try next */ }
  }
  console.warn(`[revealSetup] slide data "${slideKey}" not found; rendering empty deck`);
  return [];
}

function buildDeck(revealDiv, slideData, RevealCtor) {
  const deck = new RevealCtor(revealDiv, {
    embedded: true,
    // 16:9 @ “960x540” like your code
    width: 960,
    height: 540,
    margin: 0,
    center: false,
    minScale: 0.2,
    maxScale: 2,
  });

  const slidesRoot = revealDiv.querySelector('.slides');
  slideData.forEach(slide => slidesRoot.appendChild(createSection(slide)));
  return deck;
}

function createSection(slide) {
  const section = Object.assign(document.createElement('section'), { id: slide.id });
  if (slide.w) section.dataset.width = slide.w;
  if (slide.h) section.dataset.height = slide.h;
  slide.elements?.forEach(el => section.appendChild(createNode(el)));
  return section;
}

function createNode({ x = 0, y = 0, tag = 'div', fontFamily, html = '' }) {
  const node = document.createElement(tag);
  node.innerHTML = html;
  node.style.position = 'absolute';
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.style.fontFamily = FONT_STACKS[fontFamily] ?? FONT_STACKS.default;
  return node;
}
