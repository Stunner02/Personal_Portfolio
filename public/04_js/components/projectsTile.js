const container = document.getElementById("main3Projects");

projects.forEach(p => {
  const article = document.createElement("article");
  article.classList.add("project-tile");
  
  article.innerHTML = `
    <div class="card_media">
      <img src="${p.media}" alt="${p.alt}">
    </div>
    <div class="card_description">
      <a ${p.projectPageLink}>${p.name}</a>
      <p>${p.description}</p>
      <ul>
        ${p.smallDetails
           .map(detail => `<li>${detail}</li>`) // -> ["<li>element1</li>", …]
           .join("")                            // -> "<li>element1</li><li>element2</li>…"
        }
      </ul>
    </div>
  `;

  container.appendChild(article);
});


/* 
<section class="container" id="main3Projects">
  <article class="project-tile">
    <div class="card_media">
      <img src="${p.media}" alt="${p.alt}">
    </div>
    <div class="card_description">
      <h2>${p.name}</h2>
      <p>${p.description}</p>
    </div>
  </article>
</section>
*/