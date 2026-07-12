"use client";

import styles from "../styles/DashboardPage.module.css";
import { LuTrendingUp, LuTrendingDown } from "react-icons/lu";

export default function KPICard({ title, value, change, isPositive, icon: Icon }) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiHeader}>
        <h3 className={styles.kpiTitle}>{title}</h3>
        {Icon && <Icon className={styles.kpiIcon} />}
      </div>
      <p className={styles.kpiValue}>{value}</p>
      {change && (
        <div className={`${styles.kpiChange} ${isPositive ? styles.changePositive : styles.changeNegative}`}>
          {isPositive ? <LuTrendingUp size={14} /> : <LuTrendingDown size={14} />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}
