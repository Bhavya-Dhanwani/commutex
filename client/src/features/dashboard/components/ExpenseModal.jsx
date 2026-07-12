"use client";

import { useState, useEffect } from "react";
import fetchVehicles from "../api/vehicles";
import fetchTrips from "../api/trips";

export default function ExpenseModal({ log, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    tripId: "",
    category: "Fuel",
    amount: "",
    description: "",
    expenseDate: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (log) {
      setFormData({
        vehicleId: log.vehicleId || "",
        tripId: log.tripId || "",
        category: log.category || "Fuel",
        amount: log.amount || "",
        description: log.description || "",
        expenseDate: log.expenseDate ? new Date(log.expenseDate).toISOString().slice(0, 10) : "",
      });
    }

    const loadOptions = async () => {
      try {
        const vehiclesRes = await fetchVehicles();
        setVehicles(vehiclesRes.vehicles || vehiclesRes.data?.vehicles || []);
        
        try {
          const tripsRes = await fetchTrips();
          setTrips(tripsRes.trips || tripsRes.data?.trips || []);
        } catch (e) {
          console.log("Trips loading skipped or unauthorized");
        }
      } catch (err) {
        console.error("Failed to load options for expense modal:", err);
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

    if (!formData.vehicleId || !formData.amount) {
      setError("Please fill out all required fields.");
      return;
    }

    const payload = {
      vehicleId: formData.vehicleId,
      tripId: formData.tripId || undefined,
      category: formData.category,
      amount: formData.amount,
      description: formData.description || undefined,
      expenseDate: formData.expenseDate ? new Date(formData.expenseDate).toISOString() : undefined,
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
            {log ? "Edit Expense Entry" : "Record New Expense"}
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
                    {v.model} ({v.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            {trips.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Associated Trip (Optional)</label>
                <select
                  name="tripId"
                  value={formData.tripId}
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
                  <option value="">None / General Expense</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tripNumber} ({t.source} &rarr; {t.destination})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Expense Category *</label>
                <select
                  name="category"
                  value={formData.category}
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
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Toll">Toll</option>
                  <option value="Parking">Parking</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Fine">Fine</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Total Cost (₹) *</label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 150.00"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Expense Date</label>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Details of expense..."
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
              {log ? "Save Changes" : "Log Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
