(function() {
  const container = document.getElementById('operations-demo');
  if (!container) return;

  const BASE = 'https://mkupvyzvfntqiastdtai.supabase.co/storage/v1/object/public/upscaled-images/gene-previews/';

  // 5 operations, each with its own mini animation
  const ops = [
    {
      id: 'crossover',
      title: 'Crossover',
      desc: 'Blend two parent styles into a hybrid offspring at an adjustable ratio.',
      geneA: { name: 'Chrome', img: BASE + 'chrome.webp' },
      geneB: { name: 'Plush', img: BASE + 'plush.webp' },
      result: { name: 'ChromePlush', img: BASE + 'glossy.webp' },
    },
    {
      id: 'complement',
      title: 'Complement',
      desc: 'Mutate toward the nearest 10% — refining within the same aesthetic family.',
      source: { name: 'Chrome', img: BASE + 'chrome.webp' },
      target: { name: '+ Metallic', img: BASE + 'metallic.webp' },
    },
    {
      id: 'contrast',
      title: 'Contrast',
      desc: 'Mutate toward the farthest 10% — introducing a maximally different direction.',
      source: { name: 'Chrome', img: BASE + 'chrome.webp' },
      target: { name: '+ Denim', img: BASE + 'denim.webp' },
    },
    {
      id: 'evolution',
      title: 'Natural Selection',
      desc: 'Describe a target and the system evolves a population toward it over generations.',
    },
    {
      id: 'tree',
      title: 'Evolution Tree',
      desc: 'Every operation is recorded — designers can see lineage and backtrack to any node.',
    },
  ];

  // Build HTML
  container.innerHTML = `<div class="opd-carousel"></div>`;
  const carousel = container.querySelector('.opd-carousel');

  ops.forEach((op, i) => {
    const slide = document.createElement('div');
    slide.className = 'opd-slide' + (i === 0 ? ' active' : '');
    slide.dataset.idx = i;

    let vizHTML = '';

    if (op.id === 'crossover') {
      vizHTML = `
        <div class="opd-crossover-viz">
          <div class="opd-gene opd-gene-a">
            <img src="${op.geneA.img}" alt="${op.geneA.name}">
            <span>${op.geneA.name}</span>
          </div>
          <div class="opd-cross-symbol">×</div>
          <div class="opd-gene opd-gene-b">
            <img src="${op.geneB.img}" alt="${op.geneB.name}">
            <span>${op.geneB.name}</span>
          </div>
          <div class="opd-cross-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </div>
          <div class="opd-gene opd-gene-result">
            <img src="${op.result.img}" alt="${op.result.name}">
            <span>${op.result.name}</span>
          </div>
        </div>`;
    } else if (op.id === 'complement') {
      vizHTML = `
        <div class="opd-mutation-viz">
          <div class="opd-gene opd-mut-source">
            <img src="${op.source.img}" alt="${op.source.name}">
            <span>${op.source.name}</span>
          </div>
          <div class="opd-mut-arrow opd-mut-arrow-complement">
            <div class="opd-mut-arrow-line"></div>
            <span class="opd-mut-arrow-label" style="color:#4A90D9">nearest 10%</span>
          </div>
          <div class="opd-gene opd-mut-target">
            <img src="${op.target.img}" alt="${op.target.name}">
            <span style="color:#4A90D9">${op.target.name}</span>
          </div>
        </div>`;
    } else if (op.id === 'contrast') {
      vizHTML = `
        <div class="opd-mutation-viz">
          <div class="opd-gene opd-mut-source">
            <img src="${op.source.img}" alt="${op.source.name}">
            <span>${op.source.name}</span>
          </div>
          <div class="opd-mut-arrow opd-mut-arrow-contrast">
            <div class="opd-mut-arrow-line" style="background:linear-gradient(to right, #F5A623, transparent)"></div>
            <span class="opd-mut-arrow-label" style="color:#F5A623">farthest 10%</span>
          </div>
          <div class="opd-gene opd-mut-target">
            <img src="${op.target.img}" alt="${op.target.name}">
            <span style="color:#F5A623">${op.target.name}</span>
          </div>
        </div>`;
    } else if (op.id === 'evolution') {
      vizHTML = `
        <div class="opd-evo-viz">
          <div class="opd-evo-target-input">
            <span class="opd-evo-input-label">Target:</span>
            <span class="opd-evo-input-text">"luxurious"</span>
          </div>
          <div class="opd-evo-gens">
            <div class="opd-evo-gen">
              <img src="${BASE}industrial.webp"><img src="${BASE}icy.webp"><img src="${BASE}bohemian.webp">
            </div>
            <div class="opd-evo-arrow-down"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9c27b0" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg></div>
            <div class="opd-evo-gen">
              <img src="${BASE}brutalist.webp"><img src="${BASE}posh.webp"><img src="${BASE}glossy.webp">
            </div>
            <div class="opd-evo-arrow-down"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9c27b0" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg></div>
            <div class="opd-evo-gen">
              <img src="${BASE}luxury_gilded.webp"><img src="${BASE}hi_tech.webp"><img src="${BASE}diamond.webp" class="opd-evo-winner">
            </div>
          </div>
        </div>`;
    } else if (op.id === 'tree') {
      vizHTML = `
        <div class="opd-tree-viz">
          <div class="opd-tree-node opd-tree-root">
            <img src="${BASE}chrome.webp">
          </div>
          <div class="opd-tree-branches">
            <div class="opd-tree-branch">
              <span class="opd-tree-edge" style="color:#66BB6A">crossover</span>
              <div class="opd-tree-node"><img src="${BASE}glossy.webp"></div>
            </div>
            <div class="opd-tree-branch">
              <span class="opd-tree-edge" style="color:#4A90D9">complement</span>
              <div class="opd-tree-node"><img src="${BASE}metallic.webp"></div>
            </div>
            <div class="opd-tree-branch">
              <span class="opd-tree-edge" style="color:#F5A623">contrast</span>
              <div class="opd-tree-node"><img src="${BASE}denim.webp"></div>
            </div>
          </div>
        </div>`;
    }

    slide.innerHTML = `
      <div class="opd-content">
        <div class="opd-viz">${vizHTML}</div>
        <div class="opd-info">
          <h3>${op.title}</h3>
          <p>${op.desc}</p>
        </div>
      </div>
    `;
    carousel.appendChild(slide);
  });

  // Dots
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'opd-dots';
  ops.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'opd-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  container.appendChild(dotsWrap);

  const slides = carousel.querySelectorAll('.opd-slide');
  const dots = dotsWrap.querySelectorAll('.opd-dot');
  let current = 0;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  // Autoplay
  setInterval(() => {
    goTo((current + 1) % ops.length);
  }, 3000);
})();
