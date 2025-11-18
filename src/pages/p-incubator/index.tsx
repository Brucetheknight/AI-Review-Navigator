import styles from './styles.module.css';

const IncubatorStage = () => (
  <section className={styles.stage}>
    <header>
      <p className={styles.kicker}>Stage 5</p>
      <h1>Incubator</h1>
      <p className={styles.summary}>
        Showcase design explorations, prototypes, and testing insights that demonstrate solution maturity.
      </p>
    </header>
    <div className={styles.panelGrid}>
      <article>
        <h2>Concepts</h2>
        <ul>
          <li>Key workflows</li>
          <li>UX risks and mitigations</li>
          <li>Technical feasibility notes</li>
        </ul>
      </article>
      <article>
        <h2>Evidence</h2>
        <ul>
          <li>Prototype metrics</li>
          <li>User sentiment</li>
          <li>Engineering spikes</li>
        </ul>
      </article>
    </div>
  </section>
);

export default IncubatorStage;
