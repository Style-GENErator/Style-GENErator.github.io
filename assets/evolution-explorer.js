(function() {
  const container = document.getElementById('evolution-explorer');
  if (!container) return;

  const generations = [
    {
      candidates: [
        { name: 'Industrial', fitness: 14, img: 'assets/images/evolution/gen1_0.jpg' },
        { name: 'Icy', fitness: 8, img: 'assets/images/evolution/gen1_1.jpg' },
        { name: 'Bohemian', fitness: 11, img: 'assets/images/evolution/gen1_2.jpg' },
      ]
    },
    {
      candidates: [
        { name: 'Indusbrutal', fitness: 17, img: 'assets/images/evolution/gen2_0.jpg', mutation: '+Brutalist 33%', parent: 0 },
        { name: 'IndusGlam', fitness: 12, img: 'assets/images/evolution/gen2_1.jpg', mutation: '+Posh 56%', parent: 0 },
        { name: 'Glacialiscent', fitness: 10, img: 'assets/images/evolution/gen2_2.jpg', mutation: '+Glossy 31%', parent: 2 },
      ]
    },
    {
      candidates: [
        { name: 'Indulgent Brutality', fitness: 19, img: 'assets/images/evolution/gen3_0.jpg', mutation: '+Luxury Gilded 77%', parent: 0 },
        { name: 'GlamTech', fitness: 14, img: 'assets/images/evolution/gen3_1.jpg', mutation: '+Hi-Tech 54%', parent: 1 },
        { name: 'Frostgem', fitness: 24, img: 'assets/images/evolution/gen3_2.jpg', mutation: '+Diamond 69%', parent: 2, winner: true },
      ]
    }
  ];

  container.innerHTML = `
    <div class="evo-canvas">
      <div class="evo-target-centered">Target: <em>"luxurious"</em></div>
      <svg class="evo-lines"></svg>
      <div class="evo-rows"></div>
    </div>
  `;

  const rows = container.querySelector('.evo-rows');
  const linesSvg = container.querySelector('.evo-lines');

  generations.forEach((gen, gi) => {
    const row = document.createElement('div');
    row.className = 'evo-row';
    row.dataset.gen = gi;

    gen.candidates.forEach((c, ci) => {
      const card = document.createElement('div');
      card.className = 'evo-card';
      card.dataset.gen = gi;
      card.dataset.idx = ci;
      card.innerHTML = `
        ${c.mutation ? `<div class="evo-mut-label">${c.mutation}</div>` : '<div class="evo-mut-label" style="visibility:hidden">—</div>'}
        <div class="evo-card-img${c.winner ? ' evo-card-img-winner' : ''}">
          <img src="${c.img}" alt="${c.name}">
        </div>
        <div class="evo-card-name">${c.name}</div>
        <div class="evo-card-fitness">
          <div class="evo-card-fitness-fill" data-target="${c.fitness}"></div>
        </div>
        <div class="evo-card-score">${c.fitness}%</div>
      `;
      row.appendChild(card);
    });

    rows.appendChild(row);
  });

  const allRows = container.querySelectorAll('.evo-row');
  const allCards = container.querySelectorAll('.evo-card');
  const allFills = container.querySelectorAll('.evo-card-fitness-fill');
  const targetLabel = container.querySelector('.evo-target-centered');

  function resetAll() {
    targetLabel.style.transition = 'none';
    targetLabel.style.opacity = '0';
    allCards.forEach(c => {
      c.style.transition = 'none';
      c.style.opacity = '0';
      c.style.transform = 'scale(0.9)';
    });
    allFills.forEach(f => {
      f.style.transition = 'none';
      f.style.width = '0%';
    });
    linesSvg.innerHTML = '';
  }

  function resizeSvg() {
    const canvas = container.querySelector('.evo-canvas');
    linesSvg.style.width = canvas.offsetWidth + 'px';
    linesSvg.style.height = canvas.offsetHeight + 'px';
  }

  function drawLines(genIdx) {
    const gen = generations[genIdx];
    const parentRow = allRows[genIdx - 1];
    const childRow = allRows[genIdx];
    if (!parentRow || !childRow) return;

    const canvasRect = container.querySelector('.evo-canvas').getBoundingClientRect();

    gen.candidates.forEach((c, ci) => {
      if (c.parent === undefined) return;
      const parentCard = parentRow.children[c.parent];
      const childCard = childRow.children[ci];
      if (!parentCard || !childCard) return;

      const pImg = parentCard.querySelector('.evo-card-img');
      const cMut = childCard.querySelector('.evo-mut-label');

      const pRect = pImg.getBoundingClientRect();
      const cRect = cMut.getBoundingClientRect();

      const x1 = pRect.left + pRect.width / 2 - canvasRect.left;
      const y1 = pRect.bottom - canvasRect.top + 2;
      const x2 = cRect.left + cRect.width / 2 - canvasRect.left;
      const y2 = cRect.top - canvasRect.top - 2;

      const midY = (y1 + y2) / 2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`);
      path.setAttribute('stroke', 'rgba(0,0,0,0.12)');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('fill', 'none');

      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      linesSvg.appendChild(path);

      requestAnimationFrame(() => {
        path.style.transition = 'stroke-dashoffset 0.6s ease';
        path.style.strokeDashoffset = '0';
      });
    });
  }

  // Sequential animation using a promise chain — no overlapping timers
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  let running = false;
  let cancelled = false;

  async function runAnimation() {
    if (running) return;
    running = true;

    while (!cancelled) {
      resetAll();
      // Force reflow
      void container.offsetHeight;

      // Target label
      targetLabel.style.transition = 'opacity 0.4s';
      targetLabel.style.opacity = '1';
      await delay(500);
      if (cancelled) break;

      resizeSvg();

      // Gen 1
      Array.from(allRows[0].children).forEach((card, i) => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s, transform 0.4s';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, i * 100);
      });
      await delay(500);
      if (cancelled) break;

      // Gen 1 fitness
      allFills.forEach(f => {
        if (f.closest('.evo-card').dataset.gen === '0') {
          f.style.transition = 'width 0.8s ease';
          f.style.width = f.dataset.target + '%';
        }
      });
      await delay(800);
      if (cancelled) break;

      // Lines to gen 2
      resizeSvg();
      drawLines(1);
      await delay(600);
      if (cancelled) break;

      // Gen 2
      Array.from(allRows[1].children).forEach((card, i) => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s, transform 0.4s';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, i * 100);
      });
      await delay(500);
      if (cancelled) break;

      // Gen 2 fitness
      allFills.forEach(f => {
        if (f.closest('.evo-card').dataset.gen === '1') {
          f.style.transition = 'width 0.8s ease';
          f.style.width = f.dataset.target + '%';
        }
      });
      await delay(800);
      if (cancelled) break;

      // Lines to gen 3
      resizeSvg();
      drawLines(2);
      await delay(600);
      if (cancelled) break;

      // Gen 3
      Array.from(allRows[2].children).forEach((card, i) => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s, transform 0.4s';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, i * 100);
      });
      await delay(500);
      if (cancelled) break;

      // Gen 3 fitness
      allFills.forEach(f => {
        if (f.closest('.evo-card').dataset.gen === '2') {
          f.style.transition = 'width 0.8s ease';
          f.style.width = f.dataset.target + '%';
        }
      });
      await delay(1000);
      if (cancelled) break;

      // Hold
      await delay(2500);
      if (cancelled) break;

      // Fade out
      targetLabel.style.transition = 'opacity 0.4s';
      targetLabel.style.opacity = '0';
      allCards.forEach(c => {
        c.style.transition = 'opacity 0.4s, transform 0.4s';
        c.style.opacity = '0';
        c.style.transform = 'scale(0.9)';
      });
      allFills.forEach(f => {
        f.style.transition = 'width 0.3s';
        f.style.width = '0%';
      });
      linesSvg.innerHTML = '';
      await delay(600);
    }

    running = false;
  }

  cancelled = false;
  runAnimation();
})();
