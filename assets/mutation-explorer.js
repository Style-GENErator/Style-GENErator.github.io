(function() {
  const data = [
    { product: 'Lamp', source: 'Knitted', complement: 'Wooly', contrast: 'Glass' },
    { product: 'Chair', source: 'Cotton Candy', complement: 'Play-doh', contrast: 'Brutalist' },
    { product: 'Table', source: 'Geode', complement: 'Marble', contrast: 'Hi-Tech' },
    { product: 'Car', source: 'Armor', complement: 'Mecha', contrast: 'Norman Foster' },
    { product: 'Helmet', source: 'Space Age', complement: 'Sci-fi', contrast: 'Rustic' },
    { product: 'Watch', source: 'Gold', complement: 'Posh', contrast: 'Toy' },
  ];

  const container = document.getElementById('mutation-explorer');
  if (!container) return;

  data.forEach(d => {
    const key = d.product.toLowerCase();
    ['complement', 'source', 'contrast'].forEach(type => {
      new Image().src = `assets/images/mutations/${key}_${type}.jpg`;
    });
  });

  container.innerHTML = `
    <div class="mut-grid"></div>
    <div class="mut-spectrum">
      <div class="mut-header">
        <span class="mut-header-label mut-header-complement">← Complement</span>
        <span class="mut-header-label mut-header-source">Source</span>
        <span class="mut-header-label mut-header-contrast">Contrast →</span>
      </div>
      <div class="mut-global-track">
        <div class="mut-global-fill mut-global-fill-left"></div>
        <div class="mut-global-fill mut-global-fill-right"></div>
        <div class="mut-global-handle"></div>
      </div>
    </div>
  `;

  const grid = container.querySelector('.mut-grid');

  data.forEach((d) => {
    const key = d.product.toLowerCase();
    const card = document.createElement('div');
    card.className = 'mut-card';
    card.innerHTML = `
      <div class="mut-image-wrap">
        <img class="mut-img mut-img-complement" src="assets/images/mutations/${key}_complement.jpg">
        <img class="mut-img mut-img-source" src="assets/images/mutations/${key}_source.jpg">
        <img class="mut-img mut-img-contrast" src="assets/images/mutations/${key}_contrast.jpg">
      </div>
      <div class="mut-gene-label">${d.source}</div>
    `;
    grid.appendChild(card);
  });

  const cards = Array.from(grid.querySelectorAll('.mut-card'));
  const handle = container.querySelector('.mut-global-handle');
  const fillLeft = container.querySelector('.mut-global-fill-left');
  const fillRight = container.querySelector('.mut-global-fill-right');
  const headerComp = container.querySelector('.mut-header-complement');
  const headerSrc = container.querySelector('.mut-header-source');
  const headerCon = container.querySelector('.mut-header-contrast');

  // state: 'source' | 'complement' | 'contrast'
  let currentState = 'source';

  function showState(state) {
    currentState = state;

    // Handle: 0% = full left, 50% = center, 100% = full right
    const pct = state === 'complement' ? 0 : state === 'contrast' ? 100 : 50;
    handle.style.left = pct + '%';

    // Fill
    if (state === 'complement') {
      fillLeft.style.width = '50%';
      fillLeft.style.right = '50%';
      fillLeft.style.left = 'auto';
      fillRight.style.width = '0';
    } else if (state === 'contrast') {
      fillRight.style.width = '50%';
      fillRight.style.left = '50%';
      fillRight.style.right = 'auto';
      fillLeft.style.width = '0';
    } else {
      fillLeft.style.width = '0';
      fillRight.style.width = '0';
    }

    // Header
    headerComp.style.opacity = state === 'complement' ? '1' : '0.5';
    headerComp.style.fontWeight = state === 'complement' ? '700' : '500';
    headerSrc.style.opacity = state === 'source' ? '1' : '0.4';
    headerSrc.style.fontWeight = state === 'source' ? '700' : '500';
    headerCon.style.opacity = state === 'contrast' ? '1' : '0.5';
    headerCon.style.fontWeight = state === 'contrast' ? '700' : '500';

    // Images: crossfade
    cards.forEach((card, i) => {
      const d = data[i];
      const imgComp = card.querySelector('.mut-img-complement');
      const imgSrc = card.querySelector('.mut-img-source');
      const imgCon = card.querySelector('.mut-img-contrast');
      const label = card.querySelector('.mut-gene-label');

      if (state === 'complement') {
        imgComp.style.opacity = '1';
        imgSrc.style.opacity = '0';
        imgCon.style.opacity = '0';
        label.innerHTML = `<span class="mut-name-source">${d.source}</span> <span class="mut-name-complement">+ ${d.complement}</span>`;
        label.className = 'mut-gene-label';
      } else if (state === 'contrast') {
        imgComp.style.opacity = '0';
        imgSrc.style.opacity = '0';
        imgCon.style.opacity = '1';
        label.innerHTML = `<span class="mut-name-source">${d.source}</span> <span class="mut-name-contrast">+ ${d.contrast}</span>`;
        label.className = 'mut-gene-label';
      } else {
        imgComp.style.opacity = '0';
        imgSrc.style.opacity = '1';
        imgCon.style.opacity = '0';
        label.innerHTML = d.source;
        label.className = 'mut-gene-label';
      }
    });
  }

  // Autoplay
  let timer = null;
  let phase = 0;
  const sequence = ['source', 'complement', 'complement', 'source', 'source', 'contrast', 'contrast', 'source'];
  const durations =  [600,      600,          1400,         600,      600,      600,         1400,        600];

  function step() {
    showState(sequence[phase % sequence.length]);
    timer = setTimeout(() => {
      phase++;
      step();
    }, durations[phase % durations.length]);
  }

  function start() {
    stop();
    phase = 0;
    step();
  }

  function stop() {
    if (timer) clearTimeout(timer);
  }

  showState('source');
  start();

})();
