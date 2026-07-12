"use client";

import { useState, useEffect } from "react";
import fetchVehicles from "../api/vehicles";

export default function MaintenanceModal({ log, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    maintenanceType: "Routine",
    description: "",
    workshop: "",
    cost: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (log) {
      setFormData({
        vehicleId: log.vehicleId || "",
        maintenanceType: log.maintenanceType || "Routine",
        description: log.description || "",
        workshop: log.workshop || "",
        cost: log.cost || "",
      });
    }

    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const vehiclesRes = await fetchVehicles();
        setVehicles(vehiclesRes.vehicles || vehiclesRes.data?.vehicles || []);
      } catch (err) {
        console.error("Failed to load options for maintenance modal:", err);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, [log]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.vehicleId) {
      setError("Please assign a vehicle.");
      return;
    }

    const payload = {
      vehicleId: formData.vehicleId,
      maintenanceType: formData.maintenanceType || undefined,
      description: formData.description || undefined,
      workshop: formData.workshop || undefined,
      cost: formData.cost || undefined,
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
        maxWidth: "480px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
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
            {log ? "Edit Maintenance Record" : "Schedule New Maintenance"}
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

        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Select Vehicle *</label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
                style={{
                  padding: "10px 14px",
                  border: "1px solid #E7E7E7",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#111111",
                  outline: "none",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <option value="">Choose a Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.model} ({v.registrationNumber}) - {v.status}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Maintenance Type</label>
              <select
                name="maintenanceType"
                value={formData.maintenanceType}
                onChange={handleChange}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #E7E7E7",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#111111",
                  outline: "none",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <option value="Routine">Routine</option>
                <option value="Repair">Repair</option>
                <option value="Inspection">Inspection</option>
                <option value="Tire Change">Tire Change</option>
                <option value="Breakdown">Breakdown</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Workshop / Center</label>
                <input
                  type="text"
                  name="workshop"
                  value={formData.workshop}
                  onChange={handleChange}
                  placeholder="e.g. Metro Garage"
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
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Estimated Cost (₹)</label>
                <input
                  type="text"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="e.g. 4500.00"
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

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the issues or required checklist..."
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
                backgroundColor: "#111111",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              {log ? "Save Changes" : "Create Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
