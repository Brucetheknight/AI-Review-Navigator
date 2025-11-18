import { Link } from 'react-router-dom';

const ErrorPage = () => (
  <main className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center">
    <p className="text-6xl">🧭</p>
    <h1 className="text-3xl font-semibold">You seem lost</h1>
    <p className="max-w-xl opacity-75">
      The page you are trying to reach does not exist. Choose a stage from the navigation or return home.
    </p>
    <Link
      to="/"
      className="px-6 py-3 rounded-full bg-sky-500 text-slate-900 font-semibold hover:bg-sky-400 transition"
    >
      Back to overview
    </Link>
  </main>
);

export default ErrorPage;
