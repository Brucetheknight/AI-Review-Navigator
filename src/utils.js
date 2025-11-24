export function extractJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlock) {
      try {
        return JSON.parse(codeBlock[1]);
      } catch (err) {
        // fall through
      }
    }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      const candidate = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (err) {
        // continue
      }
    }
    throw new Error('无法提取 JSON');
  }
}

export function formatDate(isoStr) {
  return isoStr ? new Date(isoStr).toLocaleDateString() : '';
}

export function renderMarkdown(text) {
  return text ? marked.parse(text) : '';
}
