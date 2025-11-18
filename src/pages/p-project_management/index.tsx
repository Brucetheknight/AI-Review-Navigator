import styles from './styles.module.css';

const ProjectManagementStage = () => (
  <section className={styles.stage}>
    <header>
      <p className={styles.kicker}>Stage 2</p>
      <h1>Project Management</h1>
      <p className={styles.summary}>
        Outline delivery owners, milestones, and governance so stakeholders know how to engage.
      </p>
    </header>
    <div className={styles.panelGrid}>
      <article>
        <h2>Milestones</h2>
        <ul>
          <li>Start / end dates</li>
          <li>Critical dependencies</li>
          <li>Exit criteria</li>
        </ul>
      </article>
      <article>
        <h2>Team</h2>
        <ul>
          <li>Directly responsible individual</li>
          <li>Working group</li>
          <li>Review cadence</li>
        </ul>
      </article>
    </div>
  </section>
);

export default ProjectManagementStage;
