"use client";

import styles from "../styles/DashboardPage.module.css";

export default function VehicleStatusBars() {
  const statuses = [
    { label: "Available", count: 42, color: "#16a34a", percentage: 79 },
    { label: "On Trip", count: 8, color: "#2563eb", percentage: 15 },
    { label: "In Shop", count: 2, color: "#d97706", percentage: 4 },
    { label: "Retired", count: 1, color: "#dc2626", percentage: 2 },
  ];

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Vehicle Status</h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "center" }}>
        {statuses.map((item, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#111111" }}>{item.label}</span>
              <span style={{ fontSize: "12px", color: "#666666", fontWeight: "500" }}>{item.count} vehicles ({item.percentage}%)</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#FAFAFA", border: "1px solid #E7E7E7", borderRadius: "99px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${item.percentage}%`,
                  height: "100%",
                  backgroundColor: item.color,
                  borderRadius: "99px",
                  transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
