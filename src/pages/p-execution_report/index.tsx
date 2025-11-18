import styles from './styles.module.css';

const ExecutionReportStage = () => (
  <section className={styles.stage}>
    <header>
      <p className={styles.kicker}>Stage 6</p>
      <h1>Execution Report</h1>
      <p className={styles.summary}>
        Summarize current progress, blockers, and escalations to give reviewers clear execution visibility.
      </p>
    </header>
    <div className={styles.panelGrid}>
      <article>
        <h2>Status</h2>
        <ul>
          <li>Confidence by workstream</li>
          <li>Velocity snapshots</li>
          <li>Budget & burn</li>
        </ul>
      </article>
      <article>
        <h2>Escalations</h2>
        <ul>
          <li>Active blockers</li>
          <li>Requested decisions</li>
          <li>Support needed</li>
        </ul>
      </article>
    </div>
  </section>
);

export default ExecutionReportStage;
