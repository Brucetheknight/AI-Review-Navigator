import styles from './styles.module.css';

const AppendixStage = () => (
  <section className={styles.stage}>
    <header>
      <p className={styles.kicker}>Stage 8</p>
      <h1>Appendix</h1>
      <p className={styles.summary}>
        Centralize references, glossary entries, and resource links that support the review artifact.
      </p>
    </header>
    <div className={styles.panelGrid}>
      <article>
        <h2>References</h2>
        <ul>
          <li>Prior review docs</li>
          <li>Design specs</li>
          <li>Data dashboards</li>
        </ul>
      </article>
      <article>
        <h2>Resources</h2>
        <ul>
          <li>Owner roster</li>
          <li>Meeting notes</li>
          <li>External research</li>
        </ul>
      </article>
    </div>
  </section>
);

export default AppendixStage;
