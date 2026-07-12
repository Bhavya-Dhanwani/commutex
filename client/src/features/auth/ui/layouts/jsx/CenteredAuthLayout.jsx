import styles from "../css/CenteredAuthLayout.module.css";

export default function CenteredAuthLayout({ children }) {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  );
}
