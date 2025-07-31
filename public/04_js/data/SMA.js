// Any JS module – use whatever field names feel clear to you.
export const slides = [
  {
    id: 'cover',
    // w: 960, h: 700,
    elements: [
      addEl( 0, 0, 'h1', 'arial', 'My Portfolio'),
      addEl( 60, 240, 'p', 'inter', 'Mechanical Engineer · FEA · Robotics')
    ]
    // ,audio: '/audio/intro.mp3'
  },
  {
    id: 'resume-highlight',
    elements: [
      addEl( 60, 80,  'h2', 'inter', 'Key Skills'),
      addEl( 60, 140, 'ul', 'arial',
        `<li>Bing Bong airlines</li>
         <li>Rapid bingus prototyping</li>
         <li>Using · Chat · GPT</li>` )
    ]
    // no audio – fine to omit
  }
];

// Add element - addEl
function addEl(x, y, tag, fontFamily, html) {
  return { x, y, tag, fontFamily, html };
}
