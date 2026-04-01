(async function() {
  const container = document.getElementById('semantic-search-demo');
  if (!container) return;

  const resp = await fetch('assets/search-precomputed.json');
  const precomputed = await resp.json();
  const queries = Object.keys(precomputed);

  const genesResp = await fetch('assets/genes.json');
  const genes = await genesResp.json();
  const previewMap = {};
  genes.forEach(g => { if (g.preview) previewMap[g.name] = g.preview; });

  container.innerHTML = `
    <div class="ss-input-wrap">
      <div class="ss-search-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      </div>
      <input class="ss-input" type="text" readonly>
      <div class="ss-cursor"></div>
    </div>
    <div class="ss-results"></div>
  `;

  const input = container.querySelector('.ss-input');
  const results = container.querySelector('.ss-results');

  function showQuery(query) {
    input.value = query;

    const matches = precomputed[query] || [];
    results.innerHTML = '';
    matches.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'ss-result-card';
      card.style.animationDelay = (i * 50) + 'ms';
      const preview = previewMap[m.name] || '';
      card.innerHTML = `
        ${preview ? `<img class="ss-result-img" src="${preview}" alt="${m.name}">` : '<div class="ss-result-img ss-no-img"></div>'}
        <div class="ss-result-score">${m.score}%</div>
        <div class="ss-result-name">${m.name}</div>
      `;
      results.appendChild(card);
    });
  }

  // Typing animation
  let autoTimer = null;
  let currentIdx = 0;

  async function typeQuery(query) {
    input.value = '';
    input.classList.add('typing');
    for (let i = 0; i <= query.length; i++) {
      input.value = query.slice(0, i);
      await new Promise(r => setTimeout(r, 40 + Math.random() * 30));
    }
    input.classList.remove('typing');
    showQuery(query);
  }

  function autoplayNext() {
    const query = queries[currentIdx % queries.length];
    currentIdx++;
    typeQuery(query).then(() => {
      autoTimer = setTimeout(autoplayNext, 2500);
    });
  }

  function stopAutoplay() {
    if (autoTimer) clearTimeout(autoTimer);
    input.classList.remove('typing');
  }

  // Start autoplay
  autoplayNext();

})();
