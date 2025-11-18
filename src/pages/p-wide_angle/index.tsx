import styles from './styles.module.css';

const WideAngleStage = () => (
  <section className={styles.stage}>
    <header>
      <p className={styles.kicker}>Stage 3</p>
      <h1>Wide Angle Assessment</h1>
      <p className={styles.summary}>
        Capture competitive insights, macro risks, and industry benchmarks that may influence the review.
      </p>
    </header>
    <div className={styles.panelGrid}>
      <article>
        <h2>Competitive</h2>
        <ul>
          <li>Relative positioning</li>
          <li>Feature parity check</li>
          <li>Emerging entrants</li>
        </ul>
      </article>
      <article>
        <h2>Risks</h2>
        <ul>
          <li>Operational blockers</li>
          <li>Regulatory gaps</li>
          <li>Resourcing constraints</li>
        </ul>
      </article>
    </div>
  </section>
);

export default WideAngleStage;
