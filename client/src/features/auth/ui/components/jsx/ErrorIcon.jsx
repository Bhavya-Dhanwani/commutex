import { LuX } from "react-icons/lu";
import styles from "../css/ErrorIcon.module.css";

export default function ErrorIcon({ visible }) {
  return (
    <div className={`${styles.container} ${visible ? styles.visible : ""}`}>
      <div className={styles.circle}>
        <LuX size={32} />
      </div>
    </div>
  );
}
