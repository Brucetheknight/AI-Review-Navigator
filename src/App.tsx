import { NavLink, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Home, { StageDefinition } from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import OverviewStage from './pages/p-overview';
import ProjectManagementStage from './pages/p-project_management';
import WideAngleStage from './pages/p-wide_angle';
import SearchPlanStage from './pages/p-search_plan';
import IncubatorStage from './pages/p-incubator';
import ExecutionReportStage from './pages/p-execution_report';
import PostAnalysisStage from './pages/p-post_analysis';
import AppendixStage from './pages/p-appendix';

const stageRoutes: StageDefinition[] = [
  {
    path: 'overview',
    title: 'Overview',
    description: 'Product pitch, success metrics, and charter.',
  },
  {
    path: 'project-management',
    title: 'Project Management',
    description: 'Milestones, governance, and accountability.',
  },
  {
    path: 'wide-angle',
    title: 'Wide Angle',
    description: 'Competitive landscape and macro signals.',
  },
  {
    path: 'search-plan',
    title: 'Search Plan',
    description: 'Research tactics and validation backlogs.',
  },
  {
    path: 'incubator',
    title: 'Incubator',
    description: 'Design explorations and prototype evidence.',
  },
  {
    path: 'execution-report',
    title: 'Execution Report',
    description: 'Progress, blockers, and escalation asks.',
  },
  {
    path: 'post-analysis',
    title: 'Post Analysis',
    description: 'Retrospective narrative and follow-ups.',
  },
  {
    path: 'appendix',
    title: 'Appendix',
    description: 'Supporting links, glossary, and references.',
  },
];

const App = () => (
  <ErrorBoundary>
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <nav className="flex flex-wrap gap-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full border px-4 py-2 text-sm ${isActive ? 'border-sky-400 text-white' : 'border-slate-800 text-slate-400'}`
            }
          >
            Home
          </NavLink>
          {stageRoutes.map((stage) => (
            <NavLink
              key={stage.path}
              to={`/${stage.path}`}
              className={({ isActive }) =>
                `rounded-full border px-4 py-2 text-sm ${
                  isActive ? 'border-sky-400 text-white' : 'border-slate-800 text-slate-400'
                }`
              }
            >
              {stage.title}
            </NavLink>
          ))}
        </nav>
        <Routes>
          <Route path="/" element={<Home stages={stageRoutes} />} />
          <Route path="/overview" element={<OverviewStage />} />
          <Route path="/project-management" element={<ProjectManagementStage />} />
          <Route path="/wide-angle" element={<WideAngleStage />} />
          <Route path="/search-plan" element={<SearchPlanStage />} />
          <Route path="/incubator" element={<IncubatorStage />} />
          <Route path="/execution-report" element={<ExecutionReportStage />} />
          <Route path="/post-analysis" element={<PostAnalysisStage />} />
          <Route path="/appendix" element={<AppendixStage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  </ErrorBoundary>
);

export default App;
