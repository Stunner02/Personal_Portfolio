// Any JS module – use whatever field names feel clear to you.
export const slides = [
  {
    id: 'cover',
    w: 960, h: 700,
    attrs: { },
    elements: [
      addEl( 60, 100, 'h1', 'My Portfolio' ),
      addEl( 60, 240, 'p',  'Mechanical Engineer · FEA · Robotics' )
    ]
    // ,audio: '/audio/intro.mp3'
  },
  {
    id: 'resume-highlight',
    attrs: { },
    elements: [
      addEl( 60, 80,  'h2', 'Key Skills' ),
      addEl( 60, 140, 'ul',
        `<li>Finite-element wizardry</li>
         <li>Rapid prototyping (3-D print / CNC)</li>
         <li>Python · C# · MATLAB</li>` )
    ]
    // no audio – fine to omit
  }
];

// Add element - addEl
function addEl(x, y, tag, html) {
  return { x, y, tag, html };
}
