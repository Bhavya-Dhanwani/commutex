"use client";

import styles from "../styles/DashboardPage.module.css";

export default function QuickActionCard({ title, description, icon: Icon, onClick }) {
  return (
    <div className={styles.taskCard} onClick={onClick}>
      {Icon && <Icon className={styles.taskIcon} />}
      <div className={styles.taskInfo}>
        <h4 className={styles.taskTitle}>{title}</h4>
        <p className={styles.taskDesc}>{description}</p>
      </div>
    </div>
  );
}
