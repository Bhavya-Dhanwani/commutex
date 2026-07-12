import styles from "../css/ErrorMessage.module.css";

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className={styles.error}>{message}</p>;
}
