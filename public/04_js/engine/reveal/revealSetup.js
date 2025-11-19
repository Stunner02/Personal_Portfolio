// revealSetup.js 
/* Notes 
Note:    document.querySelectorAll('.reveal').forEach(startDeck);
Same as: document.querySelectorAll('.reveal').forEach((el, i, list) => startDeck(el)); 

Html: 
<section class="container pptWrapperTest">  // <section> is a style wrapper
  <div class="reveal" data-slideset="SMA">  // <div reveal> gets passed into startDeck()
    <div class="slides"></div>              // .slides is root, append each slide inside here
  </div>
</section> 
*/

// Notes for calling this js file with bootstrap.js
/* Need function for calling: initRevealIfNeeded(root);
- function needs to use root?
- Manifest has properties for each slide it passes: 
- props list: 
        slideId: 'SMA',       // Match to dataset.slideset key,
        display: 'embedded',  // Nothing for now, gets passed to buildDeck = new Reveal(RevealDiv, {embed: ,ect:})
        controls: true,       // Keep true for now, 
        theme: 'sma'          // I suppose fonts get called by the theme? maybe set this up for ease in future
        // preloadSlides: 3   // preloading a certain amount of slides is good, variable control from testing load time
*/


import Reveal from 'reveal.js'; // Gives us: Reveal(htmlElement, {options})
import { FONT_STACKS } from '../../tokens/fonts';

// Build-time file map: { './data/SMA.js': () => import('./data/SMA.js'), ... }
const decks = import.meta.glob('../../data/slides/*.js');

export async function startDeck(revealDiv, props = {}) {
/* 2) Find the correct slideset for the div */
  const { slideId } = props;                                    // "Resume"
  if (!slideId) throw new Error('[startDeck] props.slideId is required'); // err check slides name

  const key  = `../../data/slides/${slideId}.js`;   // case-sensitive; must match filename
  const load = decks[key];
  if (!load) throw new Error(`[startDeck] no deck for ${key}`);

  const { slides = [] } = await load();  // lazy import the chosen module

/* 3) Build the deck, then initialize the deck */
  const deck = buildDeck(revealDiv, slides);
  await deck.initialize();
  return deck;
}

/* ===== Helpers ===== */

function buildDeck(revealDiv, slideData) {
  /* 3.1) Create deck with Reveal(htmlElement, {options}) */
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

  /* 3.2 Append slides inside the html slides div before deck gets initialized */
  const slidesRoot = revealDiv.querySelector('.slides');  
  slideData.forEach(slide => slidesRoot.appendChild(createSection(slide)));

  return deck;
}

function createSection(slide) {
  /* 3.2.1 Create <section> for slide */
  const section = Object.assign(document.createElement('section'), { id: slide.id });
  // per-slide size override
  if (slide.w) section.dataset.width  = slide.w; 
  if (slide.h) section.dataset.height = slide.h;

  /* 3.2.2 Create elements inside the slides section using createNode() */
  slide.elements.forEach(el => section.appendChild(createNode(el)));
 
  /* 3.2.3 Do later: if (slide.audio) section.dataset.audio = slide.audio; */

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