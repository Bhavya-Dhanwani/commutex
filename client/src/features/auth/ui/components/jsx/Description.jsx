import styles from "../css/Description.module.css";

export default function Description({ children }) {
  return <p className={styles.description}>{children}</p>;
}
