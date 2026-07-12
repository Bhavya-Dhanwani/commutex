import styles from "../css/Spinner.module.css";

export default function Spinner({ morphing, success }) {
  return (
    <div
      className={`${styles.spinner} ${morphing ? styles.morphing : ""} ${success ? styles.success : ""}`}
    />
  );
}
