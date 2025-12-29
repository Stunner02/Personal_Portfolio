export const slides = [
  {
    id: 'cover-1',
    // w: 960, h: 700,
    attrs: { },
    elements: [
      addEl( 0, 0, 'h1', 'arial', 'My Portfolio'),
      addEl( 60, 240, 'p', 'inter', 'Mechanical Engineer · FEA · Robotics')
    ]
    // Add later: audio: '/audio/intro.mp3'
  },
  {
    id: 'outline-2',
    attrs: {  },
    elements: [
      addEl( 32.5, 34.5,  'h2', 'inter', 'Outline' ),
      addEl( 50,   121,   'h1', 'inter',
        `<u>Topic</u><br>
        Pitch<br>
        Key specifications<br>
        Design<br>
        Analysis / testing<br>
        Results and Conclusions` ),
      addEl( 560, 121, 'h1', 'inter',
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
    attrs: {},
    // attrs: { 'data-auto-animate': '', 'data-auto-animate-id': 'two' }, // Example
    elements: [
      addEl( 32.5, 29,  'h2', 'inter', 'Our Project Scope'),
      addEl( 60,   140, 'h1', 'arial',
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
    attrs: { },
    elements: [
      addEl( 32.5, 225.5,  'h2', 'inter', 'Key Specifications')
    ]
  },
  {
    id: 'targetSpecifications-7',
    attrs: { },
    elements: [
      addEl( 32.5, 26,  'h2', 'inter', 'Target Specifications'),
      addEl( 60,   140, 'p', 'arial', `<ol style="margin-left: 1em;">
        <li style="margin-bottom: 10px;">
            Solar Power Generation = 28.5 W
            <ol type="a" style="font-size: 14px; color: #333; margin-top: 5px;">
                <li>Stored mechanism occupies 30% of total volume for a 3U CubeSat</li>
            </ol>
        </li>

        <li style="margin-bottom: 10px;">
            Final Area Achieved = 1745 cm<sup>2</sup> or 270 in<sup>2</sup>
            <ol type="a" style="font-size: 14px; color: #333; margin-top: 5px;">
                <li>220% increase in available surface area</li>
            </ol>
        </li>

        <li style="margin-bottom: 10px;">
            Packing Ratio
            <span style="font-size: 14px; vertical-align: sub;">(Area/Packed Volume)</span> 
            = 3.63
        </li>

        <li>
            Number of solar cells = 464 TASC
        </li>
    </ol>`)
    ]
  },
  {
    id: 'Design-8',
    attrs: { },
    elements: [
      addEl( 32.5, 225.5,  'h2', 'inter', '<img src="../01_images/ShapeMemoryPic_1.png" alt="slides loading">'),
    ]
  }
];

// So, we need to add photos and animations
// Reveal has built in animation support 
/* Actions - on click, with previous */
// Fade in (time) 
// Fade out (time)

// Add element - addEl
function addEl(x, y, tag, fontFamily, html) {
  return { x, y, tag, fontFamily, html };
}

/* 

Common font sizes
36px (Topic page texts)
25px (top left slide title)
18px (slide text h1)
14px (slide text h2)

outliers- hmm, lets make some images and some inline texts (inline txt for colorful text)
6 px, 	(pg.55) make img?	
10 px,	
12 px,	(pg 57)
12.5 px (pg.46)
14.5 px 
16 px, 	(pg.56)
17 px, 
17.5 px
10px (in budget breakdown, pg.33 (make img?))


Slide element attributes: 
font-family: (free ones like inter/arial?)

- heading type
h1: 
h2:
h3:
h4:
p:
ul:
ect.. but how do we make them slide show specific?
	

- size/rotation
w:	(inches)
h:	(inches)
angle:  (degrees)

- position (from: Top left)
	x: (inches)
	y: (inches)

- text fitting
(shrink text to fit the shape)
padding:
	top: 	0.1 (inches - default)
	bottom:	0.1 (inches - default)
	left:   0.1 (inches - default)
	right:  0.1 (inches - default)

- animation
action: (on click)
	fade-in:  (time)
	fade-out: (time)

- alt text (added for users with no vision)

*/