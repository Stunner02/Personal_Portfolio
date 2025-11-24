export const slides = [
  {
    id: 'cover-1',
    // w: 960, h: 700,
    elements: [
      addEl( 0, 0, 'h1', 'arial', 'My Portfolio'),
      addEl( 60, 240, 'p', 'inter', 'Mechanical Engineer · FEA · Robotics')
    ]
    // Add later: audio: '/audio/intro.mp3'
  },
  {
    id: 'outline-2',
    elements: [
      addEl( 32.5, 34.5,  'h2', 'inter', 'Outline' ),
      addEl( 50,   121,   'p', 'inter',
        `<u>Topic</u><br>
        Pitch<br>
        Key specifications<br>
        Design<br>
        Analysis / testing<br>
        Results and Conclusions` ),
      addEl( 560, 121, 'p', 'inter',
        `<u>Time</u><br>
        5%<br>
        10%<br>
        30%<br>
        40%<br>
        10%` )
    ]
    // no audio – fine to omit
  },
  {
    id: 'ourProjectScope-3',
    elements: [
      addEl( 32.5, 29,  'h2', 'inter', 'Our Project Scope'),
      addEl( 60,   140, 'p', 'arial',
        `Increase in CubeSat solar cell<br>
        surface area via an origami <br>
        flasher.<br>
        Actuated by Nitinol wires.<br>
        Raised above clearance level by<br>
        a telescoping actuator.<br>` )
    ]
  },
  {
    id: 'keySpecifications-6',
    elements: [
      addEl( 32.5, 225.5,  'h2', 'inter', 'Key Specifications')
    ]
  },
  {
    id: 'targetSpecifications-7',
    elements: [
      addEl( 32.5, 26,  'h2', 'inter', 'Target Specifications'),
      addEl( 60,   140, 'p', 'arial', `1.   Solar Power Generation = 28.5 W`)
    ]
  },
  {
    id: 'Design-8',
    elements: [
      addEl( 32.5, 225.5,  'h2', 'inter', 'Design'),
    ]
  }
];

// Add element - addEl
function addEl(x, y, tag, fontFamily, html) {
  return { x, y, tag, fontFamily, html };
}
