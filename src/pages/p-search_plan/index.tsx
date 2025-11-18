import styles from './styles.module.css';

const SearchPlanStage = () => (
  <section className={styles.stage}>
    <header>
      <p className={styles.kicker}>Stage 4</p>
      <h1>Search Plan</h1>
      <p className={styles.summary}>
        Define learning goals, research tactics, and validation backlogs to de-risk the solution path.
      </p>
    </header>
    <div className={styles.panelGrid}>
      <article>
        <h2>Learning Agenda</h2>
        <ul>
          <li>Hypotheses to validate</li>
          <li>Signals to measure</li>
          <li>Fallback experiments</li>
        </ul>
      </article>
      <article>
        <h2>Channels</h2>
        <ul>
          <li>User interviews</li>
          <li>Instrumentation</li>
          <li>Dogfooding</li>
        </ul>
      </article>
    </div>
  </section>
);

export default SearchPlanStage;
