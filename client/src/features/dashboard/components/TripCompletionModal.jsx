"use client";

import { useState } from "react";

export default function TripCompletionModal({ trip, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    endOdometer: "",
    actualDistance: "",
    fuelConsumed: "",
    revenue: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.endOdometer) {
      setError("Ending Odometer reading is required to complete the trip.");
      return;
    }

    const payload = {
      endOdometer: parseInt(formData.endOdometer, 10),
      actualDistance: formData.actualDistance ? parseInt(formData.actualDistance, 10) : undefined,
      fuelConsumed: formData.fuelConsumed || undefined,
      revenue: formData.revenue || undefined,
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
        maxWidth: "400px",
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
            Complete Trip {trip?.tripNumber}
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
            {error && (
              <div style={{
                padding: "12px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fee2e2",
                borderRadius: "10px",
                color: "#dc2626",
                fontSize: "13px",
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Ending Odometer Reading (km) *</label>
              <input
                type="number"
                name="endOdometer"
                value={formData.endOdometer}
                onChange={handleChange}
                required
                min={1}
                placeholder="e.g. 15400"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Actual Distance (km)</label>
              <input
                type="number"
                name="actualDistance"
                value={formData.actualDistance}
                onChange={handleChange}
                min={1}
                placeholder="e.g. 360"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Fuel Consumed (Liters)</label>
              <input
                type="text"
                name="fuelConsumed"
                value={formData.fuelConsumed}
                onChange={handleChange}
                placeholder="e.g. 45.5"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Revenue Generated (₹)</label>
              <input
                type="text"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                placeholder="e.g. 12000.00"
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
              Confirm Completion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
