export default {
  key: 'projects',
  root: '', // If needed, add manifest override in boostrap, ex: 'body', '#app', '[data-root]'

  // Set up applyMeta(meta) and put in boostrap later
  meta: {
    title: 'Projects page',
    description: 'Page describing my projects',
    canonical: '/projects.html',
    // favicon: '/assets/icons/sma.ico',       // Set up flavicon later.
  },

  // Options: is for page-level switches that affect boot order. 
  // Three.js only paints to its canvas, not entire page
  // Theme: themeName can be added later in options
  options: { reveal: false },

  assets: {
    images: ['../01_images/ShapeMemoryPic_1.png', '../01_images/SMA_thickness_almost open.jpg'],
    fonts:  [{ family: 'Inter', weights: [400, 700] }],
  },
  blocks: [
    {
      component: 'projectsTile',
      mount: '#main3Projects',
      props: {  // props = properties
        elData: 'projects'
      //inData // Interactive data
      }
    },
    {
      interactive: 'fish', // interactive: name is good here.
      mount: '#fish-container',
      props: { 
        asset: '/assets/3d/fish/BarramundiFish.glb'
        // preload: controls or static image
      }
    }
  ],
};

// Example with children: 
/*
const manifest = {
  blocks: [
    {
      component: 'Grid',
      mount: '#projects',         // parent mounts into a known spot on the page
      props: { cols: 3, gap: '16px', className: 'projects-grid' },
      children: [
        { component: 'Card', props: {
            title: 'Shape Memory Mechanism',
            body: 'CubeSat deployment concept with SMA wires.',
            href: '/projects/sma'
        }},
        { component: 'Card', props: {
            title: 'Hyperloop Capstone',
            body: 'Analysis & structures for pod chassis.',
            href: '/projects/hyperloop'
        }},
        { component: 'Card', props: {
            title: 'Blender City Model',
            body: 'Procedural pipelines for large scenes.',
            href: '/projects/blender-city'
        }}
      ]
    }
  ]
};
*/
