import styles from "../css/Loader.module.css";

export default function Loader({ size = 20 }) {
  return (
    <span className={styles.spinner} style={{ width: size, height: size }} />
  );
}
