"use client";

import { useEffect, useState } from "react";
import styles from "../styles/DashboardPage.module.css";

export default function UtilizationChart({ metrics }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const currentRate = metrics?.utilization?.vehicles?.utilizationRate ?? 72;
  const data = [
    Math.max(10, Math.min(100, Math.round(currentRate * 0.95))),
    Math.max(10, Math.min(100, Math.round(currentRate * 1.05))),
    Math.max(10, Math.min(100, Math.round(currentRate * 0.98))),
    Math.max(10, Math.min(100, Math.round(currentRate * 1.1))),
    Math.max(10, Math.min(100, Math.round(currentRate * 1.02))),
    Math.max(10, Math.min(100, Math.round(currentRate * 0.9))),
    Math.round(currentRate)
  ];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Map data to SVG points (width: 500, height: 200, padding: 40)
  const width = 500;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((val, idx) => {
    const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
    // Map value 0-100 to chartHeight
    const y = paddingTop + chartHeight - (val / 100) * chartHeight;
    return { x, y, value: val };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Fleet Utilization (%)</h3>
      </div>
      <div className={styles.chartWrapper}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((level) => {
            const y = paddingTop + chartHeight - (level / 100) * chartHeight;
            return (
              <g key={level}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="inherit"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {labels.map((lbl, idx) => {
            const x = paddingLeft + (idx / (labels.length - 1)) * chartWidth;
            return (
              <text
                key={idx}
                x={x}
                y={height - 10}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="middle"
                fontFamily="inherit"
              >
                {lbl}
              </text>
            );
          })}

          {/* Line Path */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#111111"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={animate ? "0" : "1000"}
              style={{
                transition: "stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                strokeDashoffset: 0,
              }}
            />
          )}

          {/* Interactive dots */}
          {points.map((p, idx) => (
            <g key={idx} className="chart-dot-group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#FFFFFF"
                stroke="#111111"
                strokeWidth="2"
                style={{
                  transform: animate ? "scale(1)" : "scale(0)",
                  transformOrigin: `${p.x}px ${p.y}px`,
                  transition: `transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.05}s`,
                }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                fill="transparent"
                style={{ cursor: "pointer" }}
              />
              {/* Tooltip on hover (simplified) */}
              <title>{`Day ${idx + 1}: ${p.value}%`}</title>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
