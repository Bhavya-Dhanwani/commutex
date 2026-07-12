"use client";

import { useState, useEffect } from "react";
import fetchVehicles from "../api/vehicles";
import fetchDrivers from "../api/drivers";

export default function TripModal({ trip, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    tripNumber: "",
    vehicleId: "",
    driverId: "",
    source: "",
    destination: "",
    cargoWeight: "",
    plannedDistance: "",
    expectedArrival: "",
    remarks: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (trip) {
      setFormData({
        tripNumber: trip.tripNumber || "",
        vehicleId: trip.vehicleId || "",
        driverId: trip.driverId || "",
        source: trip.source || "",
        destination: trip.destination || "",
        cargoWeight: trip.cargoWeight !== undefined && trip.cargoWeight !== null ? String(trip.cargoWeight) : "",
        plannedDistance: trip.plannedDistance !== undefined && trip.plannedDistance !== null ? String(trip.plannedDistance) : "",
        expectedArrival: trip.expectedArrival ? new Date(trip.expectedArrival).toISOString().slice(0, 16) : "",
        remarks: trip.remarks || "",
      });
    }

    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const vehiclesRes = await fetchVehicles();
        const driversRes = await fetchDrivers();
        setVehicles(vehiclesRes.vehicles || vehiclesRes.data?.vehicles || []);
        setDrivers(driversRes.drivers || driversRes.data?.drivers || []);
      } catch (err) {
        console.error("Failed to load options for trip modal:", err);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, [trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.tripNumber || !formData.vehicleId || !formData.driverId) {
      setError("Trip Number, Vehicle, and Driver are required.");
      return;
    }

    // Map types to match validation
    const payload = {
      tripNumber: formData.tripNumber,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      source: formData.source || undefined,
      destination: formData.destination || undefined,
      cargoWeight: formData.cargoWeight ? parseInt(formData.cargoWeight, 10) : undefined,
      plannedDistance: formData.plannedDistance ? parseInt(formData.plannedDistance, 10) : undefined,
      expectedArrival: formData.expectedArrival ? new Date(formData.expectedArrival).toISOString() : undefined,
      remarks: formData.remarks || undefined,
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
            {trip ? "Edit Trip Profile" : "Dispatch New Trip"}
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Trip Number *</label>
              <input
                type="text"
                name="tripNumber"
                value={formData.tripNumber}
                onChange={handleChange}
                required
                disabled={!!trip}
                placeholder="e.g. TR-2026-001"
                style={{
                  padding: "10px 14px",
                  border: "1px solid #E7E7E7",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#111111",
                  outline: "none",
                  backgroundColor: trip ? "#F5F5F5" : "#FFFFFF",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Assign Vehicle *</label>
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
                  <option value="">Select a Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.model} ({v.registrationNumber}) - {v.status}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Assign Driver *</label>
                <select
                  name="driverId"
                  value={formData.driverId}
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
                  <option value="">Select a Driver</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} (Safety: {d.safetyScore}) - {d.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Source Location</label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="e.g. Warehouse A"
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
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Distribution Center B"
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
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Cargo Weight (kg)</label>
                <input
                  type="number"
                  name="cargoWeight"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  min={1}
                  placeholder="e.g. 5000"
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
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Planned Distance (km)</label>
                <input
                  type="number"
                  name="plannedDistance"
                  value={formData.plannedDistance}
                  onChange={handleChange}
                  min={1}
                  placeholder="e.g. 350"
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Expected Arrival</label>
              <input
                type="datetime-local"
                name="expectedArrival"
                value={formData.expectedArrival}
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
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={3}
                placeholder="Write any additional requirements or notes..."
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
              {trip ? "Save Changes" : "Save Draft Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
