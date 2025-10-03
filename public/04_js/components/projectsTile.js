// components/projectTile.js

// /04_js/components/projectsTile.js
function hrefFrom(link) {
  if (!link) return '#';
  const m = String(link).match(/href\s*=\s*['"]?([^'">]+)['"]?/i);
  return m ? m[1] : String(link); // supports "href='/path/'" or plain "/path/"
}

export default function projectsTile(props = {}) {
  const items = Array.isArray(props.items) ? props.items : [];

  const nodes = items.map(p => {
    const article = document.createElement('article');
    article.className = 'project-tile';
    article.innerHTML = `
      <div class="card_media">
        <img src="${p.media}" alt="${p.alt || p.name || ''}">
      </div>
      <div class="card_description">
        <a href="${hrefFrom(p.projectPageLink)}">${p.name}</a>
        <p>${p.description || ''}</p>
        ${
          Array.isArray(p.smallDetails) && p.smallDetails.length
            ? `<ul>${p.smallDetails.map(d => `<li>${d}</li>`).join('')}</ul>`
            : ''
        }
      </div>
    `;
    return article;
  });

  return nodes; // renderer mounts into '#main3Projects'
}

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