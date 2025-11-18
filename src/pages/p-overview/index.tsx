import styles from './styles.module.css';

const OverviewStage = () => (
  <section className={styles.stage}>
    <header>
      <p className={styles.kicker}>Stage 1</p>
      <h1>Product Overview</h1>
      <p className={styles.summary}>
        Capture the elevator pitch, success metrics, and north-star problem statement for the review.
      </p>
    </header>
    <div className={styles.panelGrid}>
      <article>
        <h2>Charter</h2>
        <ul>
          <li>Primary objective</li>
          <li>Strategic alignment</li>
          <li>Success criteria</li>
        </ul>
      </article>
      <article>
        <h2>Signals</h2>
        <ul>
          <li>Top-line KPIs</li>
          <li>Customer sentiment</li>
          <li>Market urgency</li>
        </ul>
      </article>
    </div>
  </section>
);

export default OverviewStage;
