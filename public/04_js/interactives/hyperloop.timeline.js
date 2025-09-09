// Names on the rail; a run of equal-sized dots BETWEEN names indicates section length.
// Active section highlights the name. Subsections appear on hover.

(() => {
  const content = document.querySelector('main.home-grid');
  const nav     = document.querySelector('#timelineNav');
  if (!content || !nav){
    console.warn('[timeline] Missing #timelineNav or main.home-grid');
    return;
  }

  const header = document.querySelector('header.site-header');
  function setHeaderOffset(){
    const h = header ? header.offsetHeight : 0;
    document.documentElement.style.setProperty('--header-h', `${h}px`);
  }

  // Collect sections (top-level)
  const sections = [...content.querySelectorAll(':scope > section[id]')];

  // Build the structure: for each section => .tl-group containing:
  //   .tl-name (anchor with title), then a .tl-dots container (added for all but last)
  function buildRail(){
    nav.innerHTML = '';
    sections.forEach((sec, i) => {
      const id    = sec.id;
      const title = sec.dataset.title || sec.querySelector('h2')?.textContent?.trim() || `Section ${i+1}`;

      const group = document.createElement('div');
      group.className = 'tl-group';
      group.dataset.id = id;

      const nameWrap = document.createElement('div');
      nameWrap.className = 'tl-name-wrap';

      const name = document.createElement('a');
      name.className = 'tl-name';
      name.href = `#${id}`;
      name.textContent = title;
      name.setAttribute('aria-label', title);
      nameWrap.appendChild(name);

      // Subsections (H3) flyout
      const subs = [...sec.querySelectorAll(':scope h3[id]')];
      if (subs.length){
        const subnav = document.createElement('div');
        subnav.className = 'tl-subnav';
        subs.forEach(h3 => {
          const a = document.createElement('a');
          a.href = `#${h3.id}`;
          a.textContent = h3.textContent.trim();
          subnav.appendChild(a);
        });
        nameWrap.appendChild(subnav);
      }

      group.appendChild(nameWrap);

      // Dots belong to THIS section and sit BELOW its name,
      // i.e., between this name and the next name.
      if (i < sections.length - 1){
        const dots = document.createElement('div');
        dots.className = 'tl-dots';
        group.appendChild(dots);
      }

      nav.appendChild(group);
    });
  }

  // Map section height -> number of dots
  function assignDotCounts(){
    const tops = sections.map(s => s.offsetTop);
    const heights = sections.map((s, i) => {
      const nextTop = tops[i+1] ?? (s.offsetTop + s.offsetHeight);
      return Math.max(1, nextTop - s.offsetTop);
    });

    const min = Math.min(...heights);
    const max = Math.max(...heights);
    const minDots = 1;     // tweakable floor
    const maxDots = 6;    // tweakable ceiling

    function mapLenToCount(lenPx){
      if (max === min) return Math.round((minDots + maxDots)/2);
      const t = (lenPx - min) / (max - min);
      return Math.round(minDots + t * (maxDots - minDots));
    }

    // For each group except the last, (re)build the dot list
    const groups = [...nav.querySelectorAll('.tl-group')];
    groups.forEach((group, i) => {
      const dots = group.querySelector('.tl-dots');
      if (!dots) return;
      dots.replaceChildren(); // clear

      const count = mapLenToCount(heights[i]);
      for (let n = 0; n < count; n++){
        const d = document.createElement('span');
        d.className = 'tl-dot';
        dots.appendChild(d);
      }
    });
  }

  // Scrollspy: set .is-active on the matching group
  let observer;
  function buildObserver(){
    if (observer) observer.disconnect();
    const groupsById = new Map(
      [...nav.querySelectorAll('.tl-group')].map(g => [g.dataset.id, g])
    );

    observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      const id = visible.target.id;
      groupsById.forEach(el => el.classList.remove('is-active'));
      const active = groupsById.get(id);
      if (active){
        active.classList.add('is-active');
        active.querySelector('.tl-name')?.setAttribute('aria-current', 'location');
      }
    }, {
      root: null,
      rootMargin: `-${(header?.offsetHeight ?? 0) + 16}px 0px -60% 0px`,
      threshold: [0, .25, .5, 1]
    });

    sections.forEach(s => observer.observe(s));
  }

  // Init
  setHeaderOffset();
  buildRail();
  assignDotCounts();
  buildObserver();

  // Recalculate when content grows or viewport changes
  window.addEventListener('load', () => {
    setHeaderOffset();
    assignDotCounts();
  });
  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      setHeaderOffset();
      assignDotCounts();
    });
  });

  // Smooth scroll (optional)
  document.documentElement.style.scrollBehavior = 'smooth';
})();
