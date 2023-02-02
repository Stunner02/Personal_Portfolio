// (0) This is for theme control 
// Help: https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/
const btn = document.querySelector('.theme-switch input[type="checkbox"]');
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

const currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
  document.body.classList.toggle("dark-theme");
} else if (currentTheme == "light") {
  document.body.classList.toggle("light-theme");
}

btn.addEventListener("click", function () {
  if (prefersDarkScheme.matches) {
    document.body.classList.toggle("light-theme");
    var theme = document.body.classList.contains("light-theme")
      ? "light"
      : "dark";
  } else {
    document.body.classList.toggle("dark-theme");
    var theme = document.body.classList.contains("dark-theme")
      ? "dark"
      : "light";
  }
  localStorage.setItem("theme", theme);
});

// (0.1) This is for smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// (2) This is for asidebar svg manipulation
var targetDiv = document.getElementById('svg-target'); //finds the target element
var svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); //creates + sets attributes
svgNode.setAttributeNS(null, 'viewBox', '0 0 60 752'); //creates + sets attributes
targetDiv.appendChild(svgNode); //Adds svg attributes to targetDiv

// This creates a filter
var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id","f1");
  // filter.setAttribute("x","-0.5");
  // filter.setAttribute("y","-0.5");
  // filter.setAttribute("width","200%");
  // filter.setAttribute("height","200%");

var feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
  feGaussianBlur.setAttribute("in","SourceGraphic");
  feGaussianBlur.setAttribute("stdDeviation","7.5");
  feGaussianBlur.setAttribute("result","blur");

var feColorMatrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
  feColorMatrix.setAttribute("in", "blur");
  feColorMatrix.setAttribute("mode", "matrix");
  feColorMatrix.setAttribute("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9");
  feColorMatrix.setAttribute("result", "goo");

var feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
  feComposite.setAttribute("in","SourceGraphic");
  feComposite.setAttribute("in2", "goo");
  feComposite.setAttribute("operator", "atop");

filter.appendChild(feGaussianBlur);
filter.appendChild(feColorMatrix);
filter.appendChild(feComposite);
defs.appendChild(filter);
svgNode.setAttribute("filter","url(#f1)")  
svgNode.appendChild(defs);    

// create the circle node, set attributes, and append it to the SVG node
var circleY0 = 106; // Initial pixel cy height
var circleCenter = []; // Create array for centers of circles on the page navigation
const circleSide = [0, 60]; // Sides of circles - used later for svg 1st and last points 

for (var i = 0; i < 5; i++) { // This creates 5 circles for the aside bar
  const circleNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleNode.setAttributeNS(null, 'cx', '30');                // x position
  circleNode.setAttributeNS(null, 'cy', circleY0 + i * 135);  // y position
  circleNode.setAttributeNS(null, 'r', '27.5');               // circle radius  
  circleNode.setAttributeNS(null, 'fill', 'steelblue');       // sets the fill attribute to steelblue
  svgNode.appendChild(circleNode);
  circleCenter[i] = [30, circleY0 + i * 135];
}

// For text that the circle has

// (3) This is for the scrollbar

//For the dot
var dotPosition = document.getElementsByClassName("dot"); 

//Create dot
const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
dot.setAttributeNS(null, "Class", "dot");           // Sets class for dot so that CSS can edit it
dot.setAttributeNS(null, 'cx', '30');               // x position
dot.setAttributeNS(null, 'cy', circleY0 + i * 135); // y position
dot.setAttributeNS(null, 'r', '27.5');              // circle radius  
dot.setAttributeNS(null, 'fill', 'steelblue');      // sets the fill attribute to steelblue 
svgNode.appendChild(dot);

//What retrieves the data/ uses it
window.addEventListener("scroll", function(event) {
  
  // This finds the percent of scrolling on the document.
  var h = document.documentElement, 
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight';
  var percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
  
  dot.setAttributeNS(null, 'cy', 14 + (0.72 * percent) + "%"); // y position

});

  //changes the top attribute of the dot id on the page nav
  //dot.style.top = 10.7 + (0.72 * percent) + "%";  //This controls the CSS #dot attribute
  
// ~ CSS ~
// #dot {
//   position: absolute;
//   top: 10.7%; /*Top is at 10.7% - P4 is at 82.1% */ 
//   left: 13%; /*For 50px by 50px use 7.5%*/
//   height: 45px;
//   width: 45px;
//   /*background-color:steelblue;*/
//   background-color: steelblue;
//   border-radius: 50%;
//   z-index: 19; 
// }
 



