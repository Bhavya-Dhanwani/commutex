"use client";

import styles from "../styles/DashboardPage.module.css";
import { LuPackage } from "react-icons/lu";

export default function EmptyState({ title, description, actionText, onAction }) {
  return (
    <div className={styles.emptyState}>
      <LuPackage className={styles.emptyIcon} />
      <h4 className={styles.emptyTitle}>{title || "No data available"}</h4>
      <p className={styles.emptyText}>{description || "There is no information to display right now."}</p>
      {actionText && (
        <button type="button" className={styles.emptyBtn} onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
