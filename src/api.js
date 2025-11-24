export function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return 'No abstract available.';
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    positions.forEach((pos) => (words[pos] = word));
  }
  return words.join(' ').replace(/\s+/g, ' ').trim();
}

export async function fetchWorkByDoi(doi) {
  const cleanDoi = doi.replace('https://doi.org/', '').trim();
  if (!cleanDoi) throw new Error('请输入有效 DOI');
  const res = await fetch(`https://api.openalex.org/works/https://doi.org/${cleanDoi}`);
  if (!res.ok) throw new Error('DOI 无效');
  return res.json();
}

export async function fetchRelatedWorks(seedId) {
  const res = await fetch(`https://api.openalex.org/works?filter=cites:${seedId}&per-page=30&sort=cited_by_count:desc`);
  if (!res.ok) throw new Error('关联文献获取失败');
  return res.json();
}

export async function fetchWorksBySearch(query, perPage = 10) {
  const res = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=${perPage}&sort=relevance_score:desc`);
  if (!res.ok) throw new Error('OpenAlex 扫描失败');
  return res.json();
}

export async function callLLM(apiKey, prompt, options = {}) {
  if (!apiKey) {
    alert('请先输入 API Key');
    throw new Error('No Key');
  }
  const body = {
    model: 'deepseek-ai/DeepSeek-V3',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
    ...options
  };
  const res = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}
