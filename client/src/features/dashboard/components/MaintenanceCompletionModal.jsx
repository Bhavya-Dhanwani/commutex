"use client";

import { useState, useEffect } from "react";

export default function MaintenanceCompletionModal({ log, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    workshop: "",
    cost: "",
    maintenanceType: "",
    description: "",
    completedDate: "",
  });

  useEffect(() => {
    if (log) {
      setFormData({
        workshop: log.workshop || "",
        cost: log.cost || "",
        maintenanceType: log.maintenanceType || "",
        description: log.description || "",
        completedDate: new Date().toISOString().slice(0, 10),
      });
    }
  }, [log]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      workshop: formData.workshop || undefined,
      cost: formData.cost || undefined,
      maintenanceType: formData.maintenanceType || undefined,
      description: formData.description || undefined,
      completedDate: formData.completedDate ? new Date(formData.completedDate).toISOString() : undefined,
    };
    onSubmit(payload);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "18px",
        border: "1px solid #E7E7E7",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
      }}>
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #E7E7E7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111111", margin: 0 }}>
            Complete Maintenance Log
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              color: "#666666",
              cursor: "pointer",
              padding: 0,
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Final Workshop Name</label>
              <input
                type="text"
                name="workshop"
                value={formData.workshop}
                onChange={handleChange}
                placeholder="e.g. Metro Auto Care"
                style={{
                  padding: "10px 14px",
                  border: "1px solid #E7E7E7",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#111111",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Actual Service Cost (₹)</label>
              <input
                type="text"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="e.g. 5200.00"
                style={{
                  padding: "10px 14px",
                  border: "1px solid #E7E7E7",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#111111",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Completed Date</label>
              <input
                type="date"
                name="completedDate"
                value={formData.completedDate}
                onChange={handleChange}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #E7E7E7",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#111111",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Final Work Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Details of services, parts replaced, etc."
                style={{
                  padding: "10px 14px",
                  border: "1px solid #E7E7E7",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#111111",
                  outline: "none",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div style={{
            padding: "20px 24px",
            borderTop: "1px solid #E7E7E7",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid #E7E7E7",
                backgroundColor: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                color: "#666666",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#16a34a",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              Mark Completed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
