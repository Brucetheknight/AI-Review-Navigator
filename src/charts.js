export function renderHistoryChart(data) {
  if (!data || data.length === 0) return;
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  const trace = {
    x: sortedData.map((d) => d.year),
    y: sortedData.map((d) => d.cited_by_count),
    type: 'bar',
    marker: { color: '#3b82f6', opacity: 0.8 }
  };
  const layout = {
    margin: { t: 10, l: 40, r: 10, b: 40 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    xaxis: { title: 'Year', tickfont: { color: '#94a3b8', size: 10 }, gridcolor: '#334155' },
    yaxis: { title: 'Citations', tickfont: { color: '#94a3b8', size: 10 }, gridcolor: '#334155' },
    autosize: true
  };
  Plotly.newPlot('historyChartDiv', [trace], layout, { displayModeBar: false, responsive: true });
}

export function renderGraph(data) {
  if (!data?.seed) return;
  const nodes = [
    {
      x: 0,
      y: 0,
      size: 40,
      color: '#f59e0b',
      label: `[SEED] ${data.seed.title}`,
      year: data.seed.publication_year,
      citations: data.seed.cited_by_count,
      url: data.seed.doi
    }
  ];
  const edgesX = [];
  const edgesY = [];
  data.related.forEach((p, i) => {
    const angle = (i / data.related.length) * 2 * Math.PI + Math.random() * 0.2;
    const r = 1.2 + Math.random() * 0.8;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    nodes.push({
      x,
      y,
      size: Math.max(8, Math.log(p.cited_by_count + 1) * 5),
      color: p.cited_by_count,
      label: p.title,
      year: p.publication_year,
      citations: p.cited_by_count,
      url: p.doi
    });
    edgesX.push(0, x, null);
    edgesY.push(0, y, null);
  });
  const edgeTrace = {
    x: edgesX,
    y: edgesY,
    mode: 'lines',
    line: { color: '#475569', width: 1, opacity: 0.3 },
    hoverinfo: 'none'
  };
  const nodeTrace = {
    x: nodes.map((n) => n.x),
    y: nodes.map((n) => n.y),
    mode: 'markers',
    marker: {
      size: nodes.map((n) => n.size),
      color: nodes.map((n) => n.color || 0),
      colorscale: 'Bluered',
      reversescale: true,
      showscale: false,
      line: { color: '#ffffff', width: 0.5 }
    },
    text: nodes.map((n) => `<b>${n.label}</b><br>Year: ${n.year}<br>Citations: ${n.citations}`),
    hovertemplate: '%{text}<extra></extra>',
    customdata: nodes.map((n) => n.url)
  };
  Plotly.newPlot(
    'graphDiv',
    [edgeTrace, nodeTrace],
    {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      showlegend: false,
      xaxis: { visible: false },
      yaxis: { visible: false },
      margin: { t: 0, l: 0, r: 0, b: 0 },
      hovermode: 'closest'
    },
    { displayModeBar: false, responsive: true }
  ).then((gd) => {
    gd.on('plotly_click', (d) => {
      const url = d.points[0].customdata;
      if (url) window.open(url, '_blank');
    });
  });
}
