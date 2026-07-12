import styles from "../css/Divider.module.css";

export default function Divider({ text = "OR" }) {
  return (
    <div className={styles.divider}>
      <span className={styles.line} />
      <span className={styles.text}>{text}</span>
      <span className={styles.line} />
    </div>
  );
}
