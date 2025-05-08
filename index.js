// (0) This is for theme control 
// Help: https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/
// const btn = document.querySelector('.theme-switch input[type="checkbox"]');
// const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// const currentTheme = localStorage.getItem("theme");
// if (currentTheme == "dark") {
//   document.body.classList.toggle("dark-theme");
// } else if (currentTheme == "light") {
//   document.body.classList.toggle("light-theme");
// }

// btn.addEventListener("click", function () {
//   if (prefersDarkScheme.matches) {
//     document.body.classList.toggle("light-theme");
//     var theme = document.body.classList.contains("light-theme")
//       ? "light"
//       : "dark";
//   } else {
//     document.body.classList.toggle("dark-theme");
//     var theme = document.body.classList.contains("dark-theme")
//       ? "dark"
//       : "light";
//   }
//   localStorage.setItem("theme", theme);
// });

// (0.1) This is for smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// (1) Media Queries
mobilePortrait()
function mobilePortrait(){
  const mql = window.matchMedia('screen and (max-width: 575px)');

  checkMedia(mql);
  mql.addListener(checkMedia);

  function checkMedia(mql){

      if(mql.matches){

      }
  }
}

// (1.1) Image Carousel
let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  // for (i = 0; i < dots.length; i++) {
  //   dots[i].className = dots[i].className.replace(" active", "");
  // }
  slides[slideIndex-1].style.display = "block";  
  // dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 3750); // Change image every 2 seconds
}


let slideIndex_Education = 0;
showSlide_Education();

function showSlide_Education() {
  let i;
  let slides_Education = document.getElementsByClassName("slide_Education");
  let dots_Education = document.getElementsByClassName("dot_Education");
  for (i = 0; i < slides_Education.length; i++) {
    slides_Education[i].style.display = "none";  
  }
  slideIndex_Education++;
  if (slideIndex_Education > slides_Education.length) {slideIndex_Education = 1}    
  // for (i = 0; i < dots.length; i++) {
  //   dots[i].className = dots[i].className.replace(" active", "");
  // }
  slides_Education[slideIndex_Education-1].style.display = "block";  
  // dots[slideIndex-1].className += " active";
  setTimeout(showSlide_Education, 5000); // Change image every 2 seconds
}

document.addEventListener('DOMContentLoaded', function() {
  let acc = document.getElementsByClassName("accordion-btn");

  for (let j = 0; j < acc.length; j++) {
      acc[j].addEventListener("click", function() {
          
          // Close other accordions and reset their arrows
          for (let k = 0; k < acc.length; k++) {
              if (k !== j) {
                  acc[k].nextElementSibling.style.maxHeight = null;
                  let otherArrow = acc[k].querySelector('.arrow');
                  if(otherArrow) {
                      otherArrow.style.transform = "rotate(0deg)";
                  }
              }
          }
          
          this.classList.toggle("active");
          let panel = this.nextElementSibling;
          let arrow = this.querySelector('.arrow');

          if (arrow) {
              if (panel.style.maxHeight) {
                  panel.style.maxHeight = null;
                  arrow.style.transform = "rotate(0deg)";
              } else {
                  panel.style.maxHeight = panel.scrollHeight + "px";
                  arrow.style.transform = "rotate(180deg)";
              }
          }
      });
  }
});

function adjustResumeMaxWidth() {
  // Get the width of the viewport
  let viewportWidth = window.innerWidth;

  // Check if viewportWidth is greater than 676px
  if (viewportWidth > 768) {
      // Get the width of .grid-container
      let gridContainerWidth = document.querySelector('.home-grid').offsetWidth;

      // Calculate half of the gridContainerWidth
      let halfWidth = gridContainerWidth / 2;

      // Set the max-width of #Resume
      document.querySelector('#resume').style.maxWidth = `${halfWidth}px`;
  } else {
      // Reset the max-width for #Resume when viewportWidth is less than or equal to 676px
      document.querySelector('#resume').style.maxWidth = '';
  }
}

// Call the function initially
adjustResumeMaxWidth();

// Call the function on window resize to adjust dynamically
window.addEventListener('resize', adjustResumeMaxWidth);

// mobileLandscape()
// tablet()
// desktop()
// desktopLarge()
// desktopExtraLarge()
