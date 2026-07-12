"use client";

export default function VehicleDetailsModal({ vehicle, onClose }) {
  if (!vehicle) return null;

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
            Vehicle Details
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

        <div style={{
          padding: "24px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Model</span>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111", margin: "4px 0 0 0" }}>{vehicle.model}</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Registration Number</span>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111", margin: "4px 0 0 0" }}>{vehicle.registrationNumber}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Vehicle Type</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{vehicle.type}</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Max Load Capacity</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{vehicle.maxLoadCapacity} kg</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Odometer Reading</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{vehicle.odometer} km</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Acquisition Cost</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{vehicle.acquisitionCost ? `₹${Number(vehicle.acquisitionCost).toLocaleString()}` : "N/A"}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Purchase Date</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toLocaleDateString() : "N/A"}</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Current Status</span>
              <p style={{ margin: "4px 0 0 0" }}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backgroundColor: vehicle.status === "Available" ? "#f0fdf4" : "#fffbeb",
                  color: vehicle.status === "Available" ? "#16a34a" : "#d97706",
                  border: `1px solid ${vehicle.status === "Available" ? "#bbf7d0" : "#fef3c7"}`,
                }}>
                  {vehicle.status}
                </span>
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Region / Depot</span>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{vehicle.region || "N/A"}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Additional Notes</span>
            <p style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#666666",
              margin: "4px 0 0 0",
              lineHeight: "1.5",
              backgroundColor: "#FAFAFA",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #E7E7E7",
            }}>
              {vehicle.notes || "No notes available for this vehicle profile."}
            </p>
          </div>
        </div>

        <div style={{
          padding: "20px 24px",
          borderTop: "1px solid #E7E7E7",
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <button
            type="button"
            onClick={onClose}
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
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
