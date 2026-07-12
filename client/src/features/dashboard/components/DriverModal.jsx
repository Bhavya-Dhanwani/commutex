"use client";

import { useState, useEffect } from "react";
import styles from "../styles/DashboardPage.module.css";

export default function DriverModal({ driver, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    phone: "",
    email: "",
    address: "",
    licenseNumber: "",
    licenseCategory: "",
    licenseExpiry: new Date().toISOString().split("T")[0],
    safetyScore: 100,
    experienceYears: 0,
    status: "Available",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || "",
        employeeId: driver.employeeId || "",
        phone: driver.phone || "",
        email: driver.email || "",
        address: driver.address || "",
        licenseNumber: driver.licenseNumber || "",
        licenseCategory: driver.licenseCategory || "",
        licenseExpiry: driver.licenseExpiry ? new Date(driver.licenseExpiry).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        safetyScore: Number(driver.safetyScore) || 100,
        experienceYears: Number(driver.experienceYears) || 0,
        status: driver.status || "Available",
        emergencyContactName: driver.emergencyContactName || "",
        emergencyContactPhone: driver.emergencyContactPhone || "",
      });
    }
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "safetyScore" || name === "experienceYears" ? Number(value) : value,
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
      setError(err.response?.data?.message || err.message || "Failed to submit driver data");
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
            {driver ? "Edit Driver Profile" : "Add Driver Profile"}
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
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Driver Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. John Doe"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="e.g. EMP102"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. driver@domain.com"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Ahmedabad, India"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>License Number *</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                placeholder="e.g. DL-88213"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>License Category</label>
              <input
                type="text"
                name="licenseCategory"
                value={formData.licenseCategory}
                onChange={handleChange}
                placeholder="e.g. HMV"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>License Expiry</label>
              <input
                type="date"
                name="licenseExpiry"
                value={formData.licenseExpiry}
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Safety Score (0-100)</label>
              <input
                type="number"
                name="safetyScore"
                value={formData.safetyScore}
                onChange={handleChange}
                min={0}
                max={100}
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
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
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Emergency Phone</label>
              <input
                type="text"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                placeholder="e.g. 9876543211"
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
              {loading ? "Saving..." : "Save Driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
