export const STORAGE_KEY = 'ai_navigator_projects_v4';
export const KEY_KEY = 'ai_navigator_key';

export const STEPS_CONFIG = [
  { id: 1, shortTitle: '广角镜', fullTitle: '1. 广角镜', icon: 'ph-aperture' },
  { id: 2, shortTitle: '显微镜', fullTitle: '2. 显微镜', icon: 'ph-microscope' },
  { id: 3, shortTitle: '孵化器', fullTitle: '3. 孵化器', icon: 'ph-lightning' },
  { id: 4, shortTitle: '蓝图', fullTitle: '4. 蓝图', icon: 'ph-compass' },
  { id: 5, shortTitle: '云端执行', fullTitle: '5. 云端执行', icon: 'ph-cloud-arrow-down' },
  { id: 6, shortTitle: '写作助手', fullTitle: '6. 写作助手', icon: 'ph-pen-nib' }
];

export const sparkSchema = {
  S: { label: 'Subject & Setting', cn: '对象与场景', color: 'blue', icon: 'ph-users-three', placeholder: '研究主体、数据集或环境背景...' },
  P: { label: 'Problem & Pain', cn: '问题与痛点', color: 'orange', icon: 'ph-lightning', placeholder: '现有局限、技术难题或知识缺口...' },
  A: { label: 'Approach & Action', cn: '方案与行动', color: 'purple', icon: 'ph-magic-wand', placeholder: '核心干预措施、新算法或实验设计...' },
  R: { label: 'Reference & Rigor', cn: '基准与稳健', color: 'slate', icon: 'ph-scales', placeholder: '对比基线(Baseline)及验证方法...' },
  K: { label: 'Key Result', cn: '结果与洞见', color: 'emerald', icon: 'ph-chart-polar', placeholder: '核心量化指标及定性结论...' }
};

export function createDefaultProject() {
  return {
    id: null,
    title: '',
    doi: '',
    updatedAt: null,
    step: 1,
    searchQuery: '',
    stepData: {
      1: { done: false, result: null, analysis: null, year: null, citations: null, graphData: null, historyData: null, error: '' },
      2: { done: false, result: null, gaps: [], error: '' },
      3: { done: false, spark: {}, question: '', error: '' },
      4: { done: false, result: null, parsedScheme: {}, error: '' },
      5: { done: false, evidence: [], error: '' },
      6: { done: false, status: 'idle', outline: [], finalDraft: '', error: '' }
    }
  };
}
