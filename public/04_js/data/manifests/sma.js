export default {
  key: 'shapeMemoryAlloy',
  root: '', // If needed, add manifest override in boostrap, ex: 'body', '#app', '[data-root]'

  // Set up applyMeta(meta) and put in boostrap later
  meta: {
    title: 'Shape Memory Alloy page',
    description: 'Page describing my shape memory alloy (or sma) college capstone project',
    canonical: '/sma.html',
    favicon: '/assets/icons/sma.ico',       // Set up flavicon later.
    // ogImage: '/assets/sma/og-preview.png'
  },
  // Options: theme(prob not necesary), reveal, threejs
  options: { theme: 'dark', reveal: false }, // flip reveal true to test later

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
    { component: 'footer' }
  ],
};
