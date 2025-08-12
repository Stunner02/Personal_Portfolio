export default {
  key: 'shapeMemoryAlloy',

  // Set up applyMeta(meta) and put in boostrap later
  meta: {
    title: 'Shape Memory Alloy page',
    description: 'Page describing my shape memory alloy or sma college capstone project',
    canonical: '/sma.html',
    favicon: '/assets/icons/sma.ico',       // Set up flavicon later.
    ogImage: '/assets/sma/og-preview.png'
  },

  options: { theme: 'dark', reveal: false }, // flip reveal true to test later

  assets: {
    images: ['/assets/sma/hero.jpg', '/assets/sma/micrograph.png'],
    fonts:  [{ family: 'Inter', weights: [400, 700] }],
  },
  blocks: [,
    {
      component: 'slide',
      props: {  slideId: 'SMA',
                display: embedded, // embedded, fullscreen
                controls: true,
                // width:    960,  // 10 inches - 1 inch/96px
                // height:   540,  // 5.625 inches
                // margin:   0,
                // center: false,
                // minScale: 0.2,   // safety rails
                // maxScale: 2,
                uniqueFonts: true,
                theme: sma,
      }
    },
    { component: 'footer' }
  ],
};
