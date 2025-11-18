import styles from './styles.module.css';

const PostAnalysisStage = () => (
  <section className={styles.stage}>
    <header>
      <p className={styles.kicker}>Stage 7</p>
      <h1>Post Analysis</h1>
      <p className={styles.summary}>
        Share the retrospective narrative, learnings, and next bets after the review has concluded.
      </p>
    </header>
    <div className={styles.panelGrid}>
      <article>
        <h2>Insights</h2>
        <ul>
          <li>What worked</li>
          <li>What surprised us</li>
          <li>What we will stop doing</li>
        </ul>
      </article>
      <article>
        <h2>Follow Ups</h2>
        <ul>
          <li>Action items</li>
          <li>Owners & timelines</li>
          <li>Communication plan</li>
        </ul>
      </article>
    </div>
  </section>
);

export default PostAnalysisStage;
