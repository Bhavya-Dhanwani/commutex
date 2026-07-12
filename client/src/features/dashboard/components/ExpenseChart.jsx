"use client";

import { useEffect, useState } from "react";
import styles from "../styles/DashboardPage.module.css";

export default function ExpenseChart({ metrics }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const trendBreakdown = metrics?.expenses?.trend || [];
  let data = [40, 48, 38, 52, 49, 62];
  let labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (trendBreakdown.length > 0) {
    const sorted = [...trendBreakdown].sort((a, b) => a.month.localeCompare(b.month));
    data = sorted.map(item => parseFloat(item.amount) / 1000);
    labels = sorted.map(item => {
      const parts = item.month.split('-');
      const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      return date.toLocaleDateString("en-US", { month: "short" });
    });
  }

  const maxVal = Math.max(...data, 10);
  const scaleMax = Math.ceil(maxVal / 20) * 20;

  const width = 500;
  const height = 200;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((val, idx) => {
    const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (val / scaleMax) * chartHeight;
    return { x, y, value: val };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Create closed path for the area fill
  const firstPoint = points[0] || { x: paddingLeft, y: height - paddingBottom };
  const lastPoint = points[points.length - 1] || { x: width - paddingRight, y: height - paddingBottom };
  const areaD = pathD
    ? `${pathD} L ${lastPoint.x} ${paddingTop + chartHeight} L ${firstPoint.x} ${paddingTop + chartHeight} Z`
    : "";

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Fuel Spending Trend</h3>
      </div>
      <div className={styles.chartWrapper}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111111" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, Math.round(scaleMax * 0.25), Math.round(scaleMax * 0.5), Math.round(scaleMax * 0.75), scaleMax].map((level) => {
            const y = paddingTop + chartHeight - (level / scaleMax) * chartHeight;
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
                  ₹{level}k
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

          {/* Area Fill */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#areaGrad)"
              style={{
                opacity: animate ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            />
          )}

          {/* Top Edge Line */}
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
            <g key={idx}>
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
              <title>{`Month ${idx + 1}: ₹${p.value}k`}</title>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
