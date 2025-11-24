import { KEY_KEY, STEPS_CONFIG, STORAGE_KEY, createDefaultProject, sparkSchema } from './constants.js';
import { safeLoad, safeSave } from './storage.js';
import { renderGraph, renderHistoryChart } from './charts.js';
import { reconstructAbstract, fetchWorkByDoi, fetchRelatedWorks, fetchWorksBySearch, callLLM } from './api.js';
import { extractJSON, formatDate, renderMarkdown } from './utils.js';

const { createApp, ref, watch, nextTick, onMounted, computed } = Vue;

createApp({
  setup() {
    const view = ref('dashboard');
    const apiKey = ref(localStorage.getItem(KEY_KEY) || '');
    const showKey = ref(false);
    const loading = ref(false);
    const loadingText = ref('处理中...');
    const projectList = ref([]);
    const selectedGapIndex = ref(-1);
    const activeProject = ref(createDefaultProject());
    const currentStep = ref(1);

    const selectedEvidenceCount = computed(() => {
      return activeProject.value.stepData[5].evidence
        ? activeProject.value.stepData[5].evidence.filter((p) => p.selected).length
        : 0;
    });

    onMounted(() => {
      const saved = safeLoad(STORAGE_KEY, []);
      projectList.value = Array.isArray(saved) ? saved : [];
    });

    watch(apiKey, (newVal) => {
      try {
        localStorage.setItem(KEY_KEY, newVal);
      } catch (e) {
        console.warn('Failed to persist key');
      }
    });

    watch(
      activeProject,
      (newVal) => {
        if (!newVal.id) return;
        const idx = projectList.value.findIndex((p) => p.id === newVal.id);
        const projectToSave = JSON.parse(JSON.stringify(newVal));
        projectToSave.updatedAt = new Date().toISOString();
        projectToSave.step = Math.max(newVal.step, projectToSave.step || 1);
        if (idx > -1) projectList.value[idx] = projectToSave;
        else projectList.value.unshift(projectToSave);
        safeSave(STORAGE_KEY, projectList.value);
      },
      { deep: true }
    );

    function createNewProject() {
      activeProject.value = createDefaultProject();
      activeProject.value.id = Date.now().toString();
      activeProject.value.updatedAt = new Date().toISOString();
      currentStep.value = 1;
      view.value = 'workspace';
    }

    function loadProject(id) {
      const target = projectList.value.find((p) => p.id === id);
      if (target) {
        activeProject.value = JSON.parse(JSON.stringify(target));
        currentStep.value = target.step;
        view.value = 'workspace';
        if (target.stepData[1].graphData) {
          nextTick(() => {
            if (document.getElementById('graphDiv')) renderGraph(target.stepData[1].graphData);
            if (document.getElementById('historyChartDiv') && target.stepData[1].historyData) {
              renderHistoryChart(target.stepData[1].historyData);
            }
          });
        }
      }
    }

    function clearAllProjects() {
      if (confirm('确定清空所有项目吗？')) {
        projectList.value = [];
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    function renameProject(id) {
      const p = projectList.value.find((proj) => proj.id === id);
      if (p) {
        const newTitle = prompt('请输入新项目名称', p.title);
        if (newTitle) {
          p.title = newTitle;
          if (activeProject.value.id === id) activeProject.value.title = newTitle;
          safeSave(STORAGE_KEY, projectList.value);
        }
      }
    }

    function deleteProject(id) {
      if (confirm('确定删除该项目吗？此操作不可恢复。')) {
        const idx = projectList.value.findIndex((p) => p.id === id);
        if (idx > -1) {
          projectList.value.splice(idx, 1);
          safeSave(STORAGE_KEY, projectList.value);
          if (activeProject.value.id === id) {
            view.value = 'dashboard';
            activeProject.value = createDefaultProject();
          }
        }
      }
    }

    function scrollToStep(step) {
      if (!activeProject.value.id) return;
      if (step > activeProject.value.step && !activeProject.value.stepData[step - 1]?.done) return;

      if (view.value !== 'workspace') {
        view.value = 'workspace';
        nextTick(() => {
          setTimeout(() => {
            currentStep.value = step;
            const el = document.getElementById(`step-${step}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        });
      } else {
        currentStep.value = step;
        nextTick(() => {
          const el = document.getElementById(`step-${step}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    }

    function toggleStep(step) {
      if (step <= activeProject.value.step || activeProject.value.stepData[step - 1]?.done) {
        currentStep.value = step;
        nextTick(() => document.getElementById(`step-${step}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      }
    }

    function nextStep() {
      if (currentStep.value < 6) {
        activeProject.value.step = Math.max(activeProject.value.step, currentStep.value + 1);
        currentStep.value++;
        nextTick(() => document.getElementById(`step-${currentStep.value}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      }
    }

    async function runStep1() {
      loading.value = true;
      loadingText.value = '解析文献...';
      activeProject.value.stepData[1].error = '';
      try {
        const data = await fetchWorkByDoi(activeProject.value.doi);
        activeProject.value.title = data.title;
        activeProject.value.searchQuery = data.title;
        activeProject.value.stepData[1].year = data.publication_year;
        activeProject.value.stepData[1].citations = data.cited_by_count;
        activeProject.value.stepData[1].historyData = data.counts_by_year || [];

        const seedId = data.id.split('/').pop();
        const relData = await fetchRelatedWorks(seedId);
        const graphData = { seed: data, related: relData.results || [] };
        activeProject.value.stepData[1].graphData = graphData;
        activeProject.value.stepData[1].result = true;
        await nextTick();
        renderHistoryChart(activeProject.value.stepData[1].historyData);
        renderGraph(graphData);

        const analysis = await callLLM(apiKey.value, `论文《${data.title}》被 ${relData.results.length} 篇高引论文引用。请简要分析趋势。`);
        activeProject.value.stepData[1].analysis = analysis;
        activeProject.value.stepData[1].done = true;
        activeProject.value.step = Math.max(activeProject.value.step, 2);
      } catch (e) {
        activeProject.value.stepData[1].error = e.message;
        alert(e.message);
      } finally {
        loading.value = false;
      }
    }

    async function runStep2() {
      loading.value = true;
      loadingText.value = '扫描前沿文献...';
      activeProject.value.stepData[2].error = '';
      selectedGapIndex.value = -1;
      try {
        const q = activeProject.value.searchQuery || activeProject.value.title;
        const data = await fetchWorksBySearch(q, 10);

        const papers = data.results
          .map((p) => ({
            title: p.title,
            year: p.publication_year,
            abstract: reconstructAbstract(p.abstract_inverted_index).substring(0, 500)
          }))
          .filter((p) => p.abstract.length > 50);

        if (papers.length === 0) throw new Error('未找到包含摘要的相关文献，请尝试更换关键词');

        const context = papers.map((p, i) => `[${i + 1}] ${p.title} (${p.year}): ${p.abstract}`).join('\n\n');

        loadingText.value = '提炼研究缺口...';
        const prompt = `你是一个科研选题顾问。请阅读以下该领域的最新文献摘要，提炼出 3-4 个核心的研究缺口 (Research Gaps)。
【文献列表】
${context}

【要求】
请严格按照以下 JSON 数组格式返回，不要包含 Markdown 标记：
[
  {
    "status": "简述当前研究的主流做法或已取得的成果 (15字以内)",
    "gap": "指出上述做法的局限性、未解决的问题或矛盾点 (30字以内)",
    "source": "引用相关的文献编号，如 [1], [3]"
  }
]`;
        const rawResult = await callLLM(apiKey.value, prompt);
        const gaps = extractJSON(rawResult);

        activeProject.value.stepData[2].gaps = gaps.map((g) => ({ ...g, selected: false }));
        activeProject.value.stepData[2].result = true;
        activeProject.value.stepData[2].done = true;
        activeProject.value.step = Math.max(activeProject.value.step, 3);
      } catch (e) {
        activeProject.value.stepData[2].error = e.message;
        alert('缺口扫描失败: ' + e.message);
      } finally {
        loading.value = false;
      }
    }

    function selectGap(idx) {
      activeProject.value.stepData[2].gaps.forEach((g, i) => (g.selected = i === idx));
      selectedGapIndex.value = idx;
      const selectedGap = activeProject.value.stepData[2].gaps[idx];
      activeProject.value.stepData[2].result = `当前主流做法：${selectedGap.status}。核心缺口：${selectedGap.gap}。`;
    }

    async function runStep3Spark() {
      loading.value = true;
      loadingText.value = 'SPARK 提取中...';
      activeProject.value.stepData[3].error = '';
      try {
        const gapAnalysis = activeProject.value.stepData[2].result;
        const title = activeProject.value.title;
        const prompt = `你是一个跨学科科研专家。请基于以下研究背景和缺口分析，构建一个 "SPARK" 科研逻辑框架。
【研究标题】: ${title}
【缺口分析】: ${gapAnalysis}
请严格按照以下 JSON 格式输出：
{
  "spark": {
    "S": "...", "P": "...", "A": "...", "R": "...", "K": "..."
  },
  "question": "基于上述 SPARK 要素，合成一句流畅的学术研究问题 (Research Question)"
}`;
        const rawResult = await callLLM(apiKey.value, prompt);
        const resultObj = extractJSON(rawResult);
        activeProject.value.stepData[3].spark = resultObj.spark;
        activeProject.value.stepData[3].question = resultObj.question;
        activeProject.value.stepData[3].done = true;
        activeProject.value.step = Math.max(activeProject.value.step, 4);
      } catch (e) {
        activeProject.value.stepData[3].error = e.message;
        alert(e.message);
      } finally {
        loading.value = false;
      }
    }

    async function runStep4() {
      loading.value = true;
      loadingText.value = '生成方案...';
      activeProject.value.stepData[4].error = '';
      try {
        const spark = JSON.stringify(activeProject.value.stepData[3].spark);
        const userQuestion = activeProject.value.stepData[3].question;

        const prompt = `基于以下科研逻辑，制定 PRISMA 检索方案。

【核心研究问题 (用户修订版)】
"${userQuestion}"

【SPARK 逻辑框架】
${spark}

请制定 PRISMA 检索方案。
**关键要求**：请同时生成一个适合 OpenAlex API 的简单查询字符串（仅包含 3-5 个核心关键词，用 OR/AND 连接）。

输出纯 JSON：
{
    "question": "复述研究问题",
    "inclusion": ["纳入标准1", "纳入标准2"],
    "exclusion": ["排除标准1", "排除标准2"],
    "openAlexQuery": "keyword1 AND (keyword2 OR keyword3)",
    "databases": [{"name": "PubMed", "query": "..."}]
}`;
        const rawResult = await callLLM(apiKey.value, prompt);
        const schemeObj = extractJSON(rawResult);
        activeProject.value.stepData[4].parsedScheme = schemeObj;
        activeProject.value.stepData[4].result = rawResult;
        activeProject.value.stepData[4].done = true;
        activeProject.value.step = Math.max(activeProject.value.step, 5);
      } catch (e) {
        activeProject.value.stepData[4].error = e.message;
        alert(e.message);
      } finally {
        loading.value = false;
      }
    }

    async function runStep5() {
      loading.value = true;
      loadingText.value = '云端抓取中...';
      activeProject.value.stepData[5].error = '';
      try {
        const query = activeProject.value.stepData[4].parsedScheme.openAlexQuery || activeProject.value.title;
        const data = await fetchWorksBySearch(query, 20);
        const evidence = data.results.map((item) => {
          const fullAbs = reconstructAbstract(item.abstract_inverted_index);
          return {
            id: item.id,
            title: item.title,
            publication_year: item.publication_year,
            url: item.primary_location?.landing_page_url || item.doi,
            abstract: `${fullAbs.substring(0, 300)}...`,
            full_abstract: fullAbs.substring(0, 2000),
            selected: true,
            user_notes: ''
          };
        });
        activeProject.value.stepData[5].evidence = evidence;
        activeProject.value.stepData[5].done = true;
        activeProject.value.step = Math.max(activeProject.value.step, 6);
      } catch (e) {
        activeProject.value.stepData[5].error = e.message;
        alert(e.message);
      } finally {
        loading.value = false;
      }
    }

    function togglePaper(idx) {
      activeProject.value.stepData[5].evidence[idx].selected = !activeProject.value.stepData[5].evidence[idx].selected;
    }

    async function generateOutline() {
      loading.value = true;
      loadingText.value = '生成大纲...';
      activeProject.value.stepData[6].error = '';
      try {
        const spark = JSON.stringify(activeProject.value.stepData[3].spark);
        const question = activeProject.value.stepData[3].question;

        const prompt = `你是一个学术综述助手。基于以下研究逻辑，请为一篇系统综述生成一个标准的大纲结构。

【研究问题】${question}
【SPARK 逻辑】${spark}

请严格返回一个 JSON 字符串数组，例如：
["1. Introduction", "2. Methodology", "3. Current Approaches", "4. Challenges & Gaps", "5. Conclusion"]
`;

        const res = await callLLM(apiKey.value, prompt);
        const outlineTitles = extractJSON(res);

        activeProject.value.stepData[6].outline = outlineTitles.map((title) => ({
          title,
          status: 'pending',
          content: ''
        }));
        activeProject.value.stepData[6].status = 'outlining';
      } catch (e) {
        activeProject.value.stepData[6].error = e.message;
        alert('大纲生成失败: ' + e.message);
      } finally {
        loading.value = false;
      }
    }

    function addChapter() {
      activeProject.value.stepData[6].outline.push({ title: 'New Chapter', status: 'pending', content: '' });
    }

    function removeChapter(idx) {
      activeProject.value.stepData[6].outline.splice(idx, 1);
    }

    async function startWriting() {
      try {
        activeProject.value.stepData[6].status = 'writing';
        activeProject.value.stepData[6].error = '';
        activeProject.value.stepData[6].finalDraft = '';

        const selectedPapersRaw = activeProject.value.stepData[5].evidence.filter((p) => p.selected);
        if (selectedPapersRaw.length === 0) {
          alert('请至少选择一篇文献');
          activeProject.value.stepData[6].status = 'idle';
          return;
        }
        const selectedPapers = selectedPapersRaw.slice(0, 10);

        const context = selectedPapers
          .map((p, i) => {
            const abs = (p.full_abstract || '').substring(0, 1600);
            let text = `[${i + 1}] Title: ${p.title} (${p.publication_year})\nAbstract: ${abs}\n`;
            if (p.user_notes && p.user_notes.trim()) {
              text += `[IMPORTANT] User-Provided Methods/Data: ${p.user_notes}\n`;
            }
            return text;
          })
          .join('\n\n');

        const spark = JSON.stringify(activeProject.value.stepData[3].spark);

        for (let i = 0; i < activeProject.value.stepData[6].outline.length; i++) {
          const chapter = activeProject.value.stepData[6].outline[i];
          chapter.status = 'writing';
          loading.value = true;
          loadingText.value = `正在撰写: ${chapter.title}`;

          try {
            const prompt = `你正在撰写一篇综述的章节：【${chapter.title}】。

【SPARK 逻辑】${spark}
【真实文献库】${context}

请撰写该章节的内容。
要求：
1. 必须基于【真实文献库】中的内容。
2. **特别注意**：如果文献包含 "[IMPORTANT] User-Provided Methods/Data"，这是用户从全文中提取的精确信息，请**优先**将其整合进 Methods 或 Results 的描述中。
3. 引用必须标注来源编号，如 [1, 3]。
4. 保持学术语气。
5. 仅输出该章节的正文内容，不要重复标题。`;

            const content = await callLLM(apiKey.value, prompt);
            chapter.content = content;
            chapter.status = 'done';
            updateFinalDraft();
          } catch (e) {
            console.error(e);
            chapter.status = 'pending';
            activeProject.value.stepData[6].error = e.message || '写作失败，请重试该章节';
            break;
          }
        }

        loading.value = false;
        if (!activeProject.value.stepData[6].error) {
          activeProject.value.stepData[6].status = 'finished';
          activeProject.value.stepData[6].done = true;
          const refs =
            '\n\n### References\n' +
            selectedPapers.map((p, i) => `[${i + 1}] ${p.title}. (${p.publication_year}). DOI: ${p.url}`).join('\n');
          activeProject.value.stepData[6].finalDraft += refs;
        } else {
          activeProject.value.stepData[6].status = 'writing';
        }
      } catch (err) {
        activeProject.value.stepData[6].error = err.message || '写作流程失败';
        activeProject.value.stepData[6].status = 'idle';
        loading.value = false;
      }
    }

    function updateFinalDraft() {
      activeProject.value.stepData[6].finalDraft = activeProject.value.stepData[6].outline
        .filter((c) => c.status === 'done')
        .map((c) => `### ${c.title}\n\n${c.content}`)
        .join('\n\n');
    }

    function getStepName(step) {
      return STEPS_CONFIG[step - 1]?.shortTitle || '未知';
    }

    function getStepColor(step) {
      return [
        'bg-blue-900 text-blue-300',
        'bg-purple-900 text-purple-300',
        'bg-orange-900 text-orange-300',
        'bg-indigo-900 text-indigo-300',
        'bg-slate-700 text-slate-300',
        'bg-green-900 text-green-300'
      ][step - 1];
    }

    function testConnection() {
      alert('API Key Set');
    }

    function exportReport() {
      const p = activeProject.value;
      let md = `# ${p.title}\n\n${p.stepData[6].finalDraft}`;
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${p.title || 'review'}.md`;
      a.click();
    }

    return {
      view,
      apiKey,
      showKey,
      loading,
      loadingText,
      projectList,
      activeProject,
      currentStep,
      selectedEvidenceCount,
      sparkSchema,
      selectedGapIndex,
      STEPS_CONFIG,
      createNewProject,
      loadProject,
      clearAllProjects,
      scrollToStep,
      toggleStep,
      nextStep,
      runStep1,
      runStep2,
      runStep3Spark,
      runStep4,
      runStep5,
      generateOutline,
      addChapter,
      removeChapter,
      startWriting,
      selectGap,
      togglePaper,
      formatDate,
      renderMarkdown,
      getStepName,
      getStepColor,
      testConnection,
      exportReport,
      renameProject,
      deleteProject
    };
  }
}).mount('#app');
