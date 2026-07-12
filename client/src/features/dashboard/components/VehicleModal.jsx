"use client";

import { useState, useEffect } from "react";
import styles from "../styles/DashboardPage.module.css";

export default function VehicleModal({ vehicle, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    model: "",
    type: "Truck",
    maxLoadCapacity: 1000,
    odometer: 0,
    acquisitionCost: "0.00",
    purchaseDate: new Date().toISOString().split("T")[0],
    status: "Available",
    region: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNumber: vehicle.registrationNumber || "",
        model: vehicle.model || "",
        type: vehicle.type || "Truck",
        maxLoadCapacity: Number(vehicle.maxLoadCapacity) || 1000,
        odometer: Number(vehicle.odometer) || 0,
        acquisitionCost: vehicle.acquisitionCost || "0.00",
        purchaseDate: vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        status: vehicle.status || "Available",
        region: vehicle.region || "",
        notes: vehicle.notes || "",
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxLoadCapacity" || name === "odometer" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to submit vehicle data");
    } finally {
      setLoading(false);
    }
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
      animation: "fadeIn 0.2s ease",
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
        overflow: "hidden",
      }}>
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #E7E7E7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111111", margin: 0 }}>
            {vehicle ? "Edit Vehicle" : "Add Vehicle"}
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

        <form onSubmit={handleFormSubmit} style={{
          padding: "24px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
        }}>
          {error && (
            <div style={{
              padding: "12px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fee2e2",
              borderRadius: "8px",
              color: "#dc2626",
              fontSize: "13px",
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Model Name *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="e.g. Volvo FH16"
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
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Registration Number (Unique) *</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              placeholder="e.g. GJ01AB4521"
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Type *</label>
              <select
                name="type"
                value={formData.type}
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
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Mini Truck">Mini Truck</option>
                <option value="Trailer">Trailer</option>
                <option value="Container">Container</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Max Load Capacity (kg) *</label>
              <input
                type="number"
                name="maxLoadCapacity"
                value={formData.maxLoadCapacity}
                onChange={handleChange}
                required
                min={1}
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Odometer (km)</label>
              <input
                type="number"
                name="odometer"
                value={formData.odometer}
                onChange={handleChange}
                min={0}
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Acquisition Cost (₹)</label>
              <input
                type="text"
                name="acquisitionCost"
                value={formData.acquisitionCost}
                onChange={handleChange}
                placeholder="0.00"
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Status *</label>
              <select
                name="status"
                value={formData.status}
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
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Region</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g. Gujarat"
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
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional details..."
              style={{
                padding: "10px 14px",
                border: "1px solid #E7E7E7",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#111111",
                outline: "none",
                minHeight: "80px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "12px",
            borderTop: "1px solid #E7E7E7",
            paddingTop: "20px",
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
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
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#111111",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Saving..." : "Save Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
