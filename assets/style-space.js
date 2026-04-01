(async function() {
  const resp = await fetch('assets/genes.json');
  const genes = await resp.json();

  const container = document.getElementById('style-space-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Exact colors from the paper figure legend
  const categoryColors = {
    'Material': '#4A90D9',
    'Texture': '#F5A623',
    'Movement': '#7ED321',
    'Light & Color': '#BD10E0',
    'Mood': '#F5515F',
    'Architecture': '#F8A0C8'
  };

  const categoryFills = {
    'Material': 'rgba(74,144,217,0.07)',
    'Texture': 'rgba(245,166,35,0.07)',
    'Movement': 'rgba(126,211,33,0.07)',
    'Light & Color': 'rgba(189,16,224,0.07)',
    'Mood': 'rgba(245,81,95,0.07)',
    'Architecture': 'rgba(248,160,200,0.07)'
  };

  // Legend
  const legend = document.getElementById('style-space-legend');
  Object.entries(categoryColors).forEach(([cat, color]) => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12px;color:#666;';
    item.innerHTML = `<div style="width:10px;height:10px;border-radius:2px;background:${color};"></div>${cat}`;
    legend.appendChild(item);
  });

  // Scales
  const padding = 60;
  const xExtent = d3.extent(genes, d => d.x);
  const yExtent = d3.extent(genes, d => d.y);
  const xRange = xExtent[1] - xExtent[0];
  const yRange = yExtent[1] - yExtent[0];

  const xScale = d3.scaleLinear()
    .domain([xExtent[0] - xRange * 0.08, xExtent[1] + xRange * 0.08])
    .range([padding, width - padding]);
  const yScale = d3.scaleLinear()
    .domain([yExtent[0] - yRange * 0.08, yExtent[1] + yRange * 0.08])
    .range([height - padding, padding]);

  const svg = d3.select('#style-space-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('cursor', 'grab');

  const g = svg.append('g');

  // Zoom with counter-scaling
  let currentK = 1;
  const zoom = d3.zoom()
    .scaleExtent([0.5, 10])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
      currentK = event.transform.k;
      // Counter-scale gene nodes so they stay the same visual size
      geneGroups.attr('transform', d =>
        `translate(${xScale(d.x)},${yScale(d.y)}) scale(${1/currentK})`
      );
      svg.style('cursor', event.sourceEvent && event.sourceEvent.type === 'mousemove' ? 'grabbing' : 'grab');
    });
  svg.call(zoom);

  // Double-click to reset zoom
  svg.on('dblclick.zoom', null);
  svg.on('dblclick', () => {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  });

  // Convex hulls
  const categories = [...new Set(genes.map(d => d.category))];
  const hullData = [];
  categories.forEach(cat => {
    const points = genes.filter(d => d.category === cat).map(d => [xScale(d.x), yScale(d.y)]);
    if (points.length >= 3) {
      const hull = d3.polygonHull(points);
      if (hull) {
        const cx = d3.mean(hull, d => d[0]);
        const cy = d3.mean(hull, d => d[1]);
        const expanded = hull.map(([x, y]) => {
          const dx = x - cx, dy = y - cy;
          const dist = Math.sqrt(dx*dx + dy*dy);
          return [x + dx/dist * 25, y + dy/dist * 25];
        });

        g.append('path')
          .attr('d', `M${expanded.map(p => p.join(',')).join('L')}Z`)
          .attr('fill', categoryFills[cat] || 'rgba(0,0,0,0.03)')
          .attr('stroke', categoryColors[cat] || '#ccc')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.25);

        hullData.push({ cat, cx, cy, expanded });
      }
    }
  });

  // Gene nodes
  const tooltip = document.getElementById('gene-tooltip');
  const tooltipImg = document.getElementById('tooltip-img');
  const tooltipName = document.getElementById('tooltip-name');

  const geneGroups = g.selectAll('.gene')
    .data(genes)
    .enter()
    .append('g')
    .attr('class', 'gene')
    .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`)
    .style('cursor', 'pointer');

  const size = 30;
  const r = 6;

  // Border rect
  geneGroups.append('rect')
    .attr('x', -size/2 - 1)
    .attr('y', -size/2 - 1)
    .attr('width', size + 2)
    .attr('height', size + 2)
    .attr('rx', r + 1)
    .attr('fill', 'white')
    .attr('stroke', d => categoryColors[d.category] || '#ccc')
    .attr('stroke-width', 2)
    .style('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))');

  // Clip path
  geneGroups.append('clipPath')
    .attr('id', (d, i) => `clip-${genes.indexOf(d)}`)
    .append('rect')
    .attr('x', -size/2)
    .attr('y', -size/2)
    .attr('width', size)
    .attr('height', size)
    .attr('rx', r);

  // Thumbnail (lazy loaded via IntersectionObserver)
  const imageElements = geneGroups.filter(d => d.preview)
    .append('image')
    .attr('data-src', d => d.preview)
    .attr('x', -size/2)
    .attr('y', -size/2)
    .attr('width', size)
    .attr('height', size)
    .attr('clip-path', (d, i) => `url(#clip-${genes.indexOf(d)})`)
    .attr('preserveAspectRatio', 'xMidYMid slice');

  // Load all images with staggered timing to avoid blocking
  imageElements.each(function(d, i) {
    const el = this;
    setTimeout(() => {
      el.setAttribute('href', el.getAttribute('data-src'));
    }, i * 20);
  });

  // Fallback
  geneGroups.filter(d => !d.preview)
    .append('rect')
    .attr('x', -size/2)
    .attr('y', -size/2)
    .attr('width', size)
    .attr('height', size)
    .attr('rx', r)
    .attr('fill', d => categoryColors[d.category] || '#ccc')
    .attr('opacity', 0.3);

  // Gene name
  geneGroups.append('text')
    .attr('y', size/2 + 12)
    .attr('text-anchor', 'middle')
    .attr('font-size', '8px')
    .attr('font-family', 'Inter, sans-serif')
    .attr('fill', '#999')
    .text(d => d.name);

  // Category labels (on top of everything)
  const labelLayer = g.append('g').attr('class', 'label-layer');
  hullData.forEach(({ cat, cx, cy, expanded }) => {
    const labelY = d3.min(expanded, d => d[1]) - 10;
    const textWidth = cat.length * 7.5 + 16;

    // Background pill
    labelLayer.append('rect')
      .attr('x', cx - textWidth / 2)
      .attr('y', labelY - 14)
      .attr('width', textWidth)
      .attr('height', 22)
      .attr('rx', 11)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.9)
      .attr('stroke', categoryColors[cat])
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.4);

    // Label text
    labelLayer.append('text')
      .attr('x', cx)
      .attr('y', labelY)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', categoryColors[cat])
      .text(cat);
  });

  // Hover interactions
  geneGroups.on('mouseenter', function(event, d) {
    d3.select(this).raise();
    d3.select(this).select('rect')
      .attr('stroke-width', 3);
    if (d.preview) {
      tooltipImg.src = d.preview;
      tooltipImg.style.display = 'block';
    } else {
      tooltipImg.style.display = 'none';
    }
    tooltipName.textContent = d.name;
    tooltip.style.display = 'block';
  })
  .on('mousemove', function(event) {
    tooltip.style.left = (event.clientX + 16) + 'px';
    tooltip.style.top = (event.clientY - 80) + 'px';
  })
  .on('mouseleave', function() {
    d3.select(this).select('rect')
      .attr('stroke-width', 2);
    tooltip.style.display = 'none';
  });

  // Hint text
  svg.append('text')
    .attr('x', width - 12)
    .attr('y', height - 10)
    .attr('text-anchor', 'end')
    .attr('font-size', '10px')
    .attr('font-family', 'Inter, sans-serif')
    .attr('fill', '#ccc')
    .text('Scroll to zoom · Drag to pan · Double-click to reset');

})();
