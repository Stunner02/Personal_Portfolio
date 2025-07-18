const container = document.getElementById("main3Projects");

projects.forEach(p => {
  const section = document.createElement("section");
  section.classList.add("project-tile");

  section.innerHTML = `
    <div class="card_media">
      <img src="${p.media}" alt="${p.alt}">
    </div>
    <div class="card_description">
      <h2>${p.name}</h2>
      <p>${p.description}</p>
    </div>
  `;

  container.appendChild(section);
});
