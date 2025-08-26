export default {
  key: 'shapeMemoryAlloy',
  root: '', // If needed, add manifest override in boostrap, ex: 'body', '#app', '[data-root]'

  // Set up applyMeta(meta) and put in boostrap later
  meta: {
    title: 'Shape Memory Alloy page',
    description: 'Page describing my shape memory alloy (or sma) college capstone project',
    canonical: '/sma.html',
    // favicon: '/assets/icons/sma.ico',       // Set up flavicon later.
  },

  // Options: is for page-level switches that affect boot order. 
  // Three.js only paints to its canvas, not entire page
  // Theme: themeName can be added later in options
  options: { reveal: true },

  assets: {
    images: ['/assets/sma/hero.jpg', '/assets/sma/micrograph.png'],
    fonts:  [{ family: 'Inter', weights: [400, 700] }],
  },
  blocks: [
    {
      component: 'slide',
      props: {  
        slideId: 'SMA',
        display: 'embedded', // embedded, fullscreen
        controls: true,
        uniqueFonts: true,
        theme: 'sma',
      }
    },
    { component: 'three.js',
      props: { }
     }
  ],
};
