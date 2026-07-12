import styles from "../css/AuthLayout.module.css";

export default function AuthLayout({ children }) {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  );
}
