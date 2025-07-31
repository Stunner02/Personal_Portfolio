// slides-init.js 
import Reveal from 'reveal.js';
import { FONT_STACKS } from '../tokens/fonts.js';

document.querySelectorAll('.reveal').forEach(startDeck);
  // revealEl is what is inside <div class="reveal">…</div>
/* Current html structure
    <section class="container pptWrapperTest">
      <div class="reveal" data-slideset="SMA">
        <div class="slides"></div>
      </div>
    </section> */
  // Use each .reveal section's dataset name to import slides
  
async function startDeck(revealDiv) {
  const slideKey   = revealDiv.dataset.slideset;               // "resume"
  const slideModule  = await import(`./data/${slideKey}.js`);  // ⇒ /data/resume.js
  const slides  = slideModule.slides ?? [];

  const deck = buildDeck(revealDiv, slides);
  await deck.initialize();
}

/* ===== Helpers ===== */

function buildDeck(revealDiv, slideData) {
  const deck = new Reveal(revealDiv, {
    embedded: true,
    //gSlides widescreen 16/9 dimensions: w: 960, h: 540
    width:    960,  // 10 inches - 1 inch/96px
    height:   540,  // 5.625 inches
    margin:   0,
    center: false,
    minScale: 0.2,   // safety rails
    maxScale: 2
  });

  const slidesRoot = revealDiv.querySelector('.slides');
  slideData.forEach(slide =>
    slidesRoot.appendChild(createSection(slide))
  );

  return deck;
}

function createSection(slide) {
  const section = Object.assign(document.createElement('section'), { id: slide.id });
  if (slide.w) section.dataset.width  = slide.w;    // per-slide size override
  if (slide.h) section.dataset.height = slide.h;

  slide.elements.forEach(el => section.appendChild(createNode(el)));
  // if (slide.audio) section.dataset.audio = slide.audio;
  return section;
}

function createNode({ x, y, tag, fontFamily, html }) {
  const node = document.createElement(tag);
  node.innerHTML      = html;
  node.style.position = 'absolute';
  node.style.left     = `${x}px`;
  node.style.top      = `${y}px`;
  node.style.fontFamily = FONT_STACKS[fontFamily] ?? FONT_STACKS.default;
  return node;
}