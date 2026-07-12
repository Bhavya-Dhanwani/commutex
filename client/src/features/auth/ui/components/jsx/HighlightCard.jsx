import styles from "../css/HighlightCard.module.css";

export default function HighlightCard({ icon, title, subtitle }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}
