import styles from "../css/RightPanel.module.css";

export default function RightPanel({ children }) {
  return (
    <div className={styles.panel}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
