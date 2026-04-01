(function() {
  const steps = [
    { added: ['Plastic', 'Plush'], removed: [] },
    { added: ['Crystals'], removed: [] },
    { added: ['Geode'], removed: [] },
    { added: ['Diamond'], removed: [] },
    { added: ['Felipe Pantone'], removed: ['Diamond'] },
    { added: ['Modern Minimal'], removed: ['Felipe Pantone'] },
  ];

  const container = document.getElementById('iteration-explorer');
  if (!container) return;

  steps.forEach((_, i) => { new Image().src = `assets/images/iterations/iter_${i+1}.jpg`; });

  container.innerHTML = `
    <div class="iter-wrap">
      <div class="iter-changes"></div>
      <div class="iter-image-wrap">
        <img class="iter-image" src="assets/images/iterations/iter_1.jpg" alt="Handbag iteration">
      </div>
      <div class="iter-pips"></div>
    </div>
  `;

  const image = container.querySelector('.iter-image');
  const changes = container.querySelector('.iter-changes');
  const pipsWrap = container.querySelector('.iter-pips');

  // Small dot pips instead of numbered buttons
  steps.forEach((_, i) => {
    const pip = document.createElement('button');
    pip.className = 'iter-pip' + (i === 0 ? ' active' : '');
    pip.addEventListener('click', () => { goTo(i); stopAutoplay(); });
    pipsWrap.appendChild(pip);
  });

  const pips = pipsWrap.querySelectorAll('.iter-pip');
  let current = 0;
  let timer = null;

  function goTo(idx) {
    current = idx;
    image.src = `assets/images/iterations/iter_${idx + 1}.jpg`;

    const s = steps[idx];
    let html = '';
    s.added.forEach(g => { html += `<span class="iter-pill iter-add">+ ${g}</span>`; });
    s.removed.forEach(g => { html += `<span class="iter-pill iter-rm">− ${g}</span>`; });
    changes.innerHTML = html;

    pips.forEach((p, i) => {
      p.classList.toggle('active', i === idx);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => goTo((current + 1) % steps.length), 1000);
  }
  function stopAutoplay() { if (timer) clearInterval(timer); }

  goTo(0);
  startAutoplay();
})();
