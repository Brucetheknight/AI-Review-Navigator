import { Link } from 'react-router-dom';

export interface StageDefinition {
  path: string;
  title: string;
  description: string;
}

interface Props {
  stages: StageDefinition[];
}

const Home = ({ stages }: Props) => (
  <section className="space-y-8">
    <header className="space-y-4">
      <p className="tracking-[0.35em] uppercase text-sm text-slate-400">AI Review Navigator</p>
      <h1 className="text-4xl md:text-5xl font-semibold">Choose a review stage</h1>
      <p className="max-w-2xl text-lg text-slate-300">
        Each stage captures a different slice of the product narrative. Jump to any step to review plans, surface
        blockers, or collect follow-up actions.
      </p>
    </header>
    <div className="grid gap-4 md:grid-cols-2">
      {stages.map((stage) => (
        <Link
          key={stage.path}
          to={`/${stage.path}`}
          className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-500"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Stage</p>
          <h2 className="text-2xl font-semibold">{stage.title}</h2>
          <p className="text-slate-300 group-hover:text-slate-100 transition text-sm mt-2">{stage.description}</p>
        </Link>
      ))}
    </div>
  </section>
);

export default Home;
