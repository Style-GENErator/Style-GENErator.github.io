(function() {
  const container = document.getElementById('crossover-demo');
  if (!container) return;

  const BASE = 'https://mkupvyzvfntqiastdtai.supabase.co/storage/v1/object/public/upscaled-images/gene-previews/';

  const examples = [
    {
      geneA: { name: 'Smoke', img: BASE + 'smoke.webp' },
      geneB: { name: 'Honeycomb', img: BASE + 'honeycomb.webp' },
      result: { img: 'assets/images/user-examples/P12_generator_smoke-x-honeycomb-x-zaha-hadid-x-glass_handbag.jpg' },
    },
    {
      geneA: { name: 'Art Deco', img: BASE + 'art_deco.webp' },
      geneB: { name: 'Gold Porcelain', img: BASE + 'gold_porcelain.webp' },
      result: { img: 'assets/images/user-examples/P8_generator_art-deco-x-gold-porcelain_handbag.jpg' },
    },
    {
      geneA: { name: 'Knitted', img: BASE + 'knitted.webp' },
      geneB: { name: 'Chrome', img: BASE + 'chrome.webp' },
      result: { img: 'assets/images/user-examples/good_F3_generator_knitted-x-chrome-x-mecha_sneaker.jpg' },
    },
    {
      geneA: { name: 'Blue White Porcelain', img: BASE + 'blue_white_porcelain.webp' },
      geneB: { name: 'Graffiti', img: BASE + 'graffiti.webp' },
      result: { img: 'assets/images/user-examples/Z6_generator_blue-white-porcelain-x-graffiti_sneaker.jpg' },
    },
  ];

  container.innerHTML = `<div class="xover-grid"></div>`;
  const grid = container.querySelector('.xover-grid');

  examples.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'xover-card';
    card.innerHTML = `
      <div class="xover-parents">
        <div class="xover-gene">
          <img src="${ex.geneA.img}" alt="${ex.geneA.name}">
          <span>${ex.geneA.name}</span>
        </div>
        <div class="xover-symbol">×</div>
        <div class="xover-gene">
          <img src="${ex.geneB.img}" alt="${ex.geneB.name}">
          <span>${ex.geneB.name}</span>
        </div>
      </div>
      <div class="xover-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
      </div>
      <div class="xover-result">
        <img src="${ex.result.img}" alt="Crossover result">
      </div>
    `;
    grid.appendChild(card);
  });
})();
