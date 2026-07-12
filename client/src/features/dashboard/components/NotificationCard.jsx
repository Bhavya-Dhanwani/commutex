"use client";

import { LuBell } from "react-icons/lu";

export default function NotificationCard({ notifications = [] }) {
  const defaultNotifications = [
    { id: 1, text: "Over-speed warning flagged for Trip TX-9041" },
    { id: 2, text: "Volvo FH16 is due for maintenance tomorrow" },
    { id: 3, text: "New trip request received from Client X" },
  ];

  const list = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <div
      style={{
        position: "absolute",
        top: "44px",
        right: 0,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E7E7E7",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        width: "280px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #E7E7E7", paddingBottom: "8px" }}>
        <h4 style={{ fontSize: "14px", fontWeight: "700", margin: 0, color: "#111111" }}>Notifications</h4>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {list.map((item) => (
          <div key={item.id} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <LuBell size={14} style={{ color: "#111111", marginTop: "2px", flexShrink: 0 }} />
            <p style={{ fontSize: "12px", color: "#666666", margin: 0, lineHeight: 1.4 }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
