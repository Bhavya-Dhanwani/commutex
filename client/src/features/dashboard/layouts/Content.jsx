"use client";

import styles from "../styles/DashboardLayout.module.css";

export default function Content({ children }) {
  return <main className={styles.contentArea}>{children}</main>;
}
