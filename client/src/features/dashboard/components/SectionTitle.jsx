"use client";

import styles from "../styles/DashboardPage.module.css";

export default function SectionTitle({ children }) {
  return <h2 className={styles.cardTitle}>{children}</h2>;
}
