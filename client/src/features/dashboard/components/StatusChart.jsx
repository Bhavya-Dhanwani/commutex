"use client";

import { useEffect, useState } from "react";
import styles from "../styles/DashboardPage.module.css";

export default function StatusChart() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const total = 53;
  const segments = [
    { label: "Active", count: 35, color: "#111111" },
    { label: "In Maintenance", count: 12, color: "#666666" },
    { label: "Inactive", count: 6, color: "#E7E7E7" },
  ];

  // Circumference for r=50 is ~314.16
  const r = 50;
  const circ = 2 * Math.PI * r;

  let currentOffset = 0;

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Vehicle Status</h3>
      </div>
      <div className={styles.chartWrapper} style={{ flexDirection: "row", gap: "24px" }}>
        {/* SVG Donut */}
        <div style={{ position: "relative", width: "160px", height: "160px" }}>
          <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ transform: "rotate(-90deg)" }}>
            {segments.map((seg, idx) => {
              const percentage = seg.count / total;
              const dashArray = `${percentage * circ} ${circ}`;
              const dashOffset = currentOffset;
              currentOffset -= percentage * circ;

              return (
                <circle
                  key={idx}
                  cx="60"
                  cy="60"
                  r={r}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={animate ? dashArray : `0 ${circ}`}
                  strokeDashoffset={animate ? dashOffset : 0}
                  style={{
                    transition: "stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset 1s",
                  }}
                />
              );
            })}
          </svg>
          {/* Centered label */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "22px", fontWeight: "800", margin: 0, color: "#111111" }}>{total}</p>
            <p style={{ fontSize: "11px", fontWeight: "500", margin: 0, color: "#666666", textTransform: "uppercase" }}>Total</p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {segments.map((seg, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: seg.color,
                  border: seg.color === "#FFFFFF" ? "1px solid #E7E7E7" : "none",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#111111" }}>
                  {seg.count} {seg.label}
                </span>
                <span style={{ fontSize: "11px", color: "#666666" }}>
                  {Math.round((seg.count / total) * 100)}% of Fleet
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
