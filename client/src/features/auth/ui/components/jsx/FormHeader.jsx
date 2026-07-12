import styles from "../css/FormHeader.module.css";

export default function FormHeader({ title, subtitle, icon }) {
  return (
    <div className={styles.header}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
