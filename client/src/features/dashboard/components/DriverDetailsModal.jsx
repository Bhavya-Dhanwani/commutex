"use client";

export default function DriverDetailsModal({ driver, onClose }) {
  if (!driver) return null;

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
            Driver Details
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
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Full Name</span>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111", margin: "4px 0 0 0" }}>{driver.name}</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Employee ID</span>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111", margin: "4px 0 0 0" }}>{driver.employeeId || "N/A"}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>License Number</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{driver.licenseNumber} ({driver.licenseCategory || "N/A"})</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>License Expiry</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Phone Number</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{driver.phone || "N/A"}</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Email Address</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{driver.email || "N/A"}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Safety Score</span>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#16a34a", margin: "4px 0 0 0" }}>{driver.safetyScore}/100</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Experience</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{driver.experienceYears} Years</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Address</span>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111111", margin: "4px 0 0 0" }}>{driver.address || "N/A"}</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase" }}>Duty Status</span>
              <p style={{ margin: "4px 0 0 0" }}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backgroundColor: driver.status === "Available" ? "#f0fdf4" : "#fffbeb",
                  color: driver.status === "Available" ? "#16a34a" : "#d97706",
                  border: `1px solid ${driver.status === "Available" ? "#bbf7d0" : "#fef3c7"}`,
                }}>
                  {driver.status}
                </span>
              </p>
            </div>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            backgroundColor: "#FAFAFA",
            padding: "16px",
            borderRadius: "14px",
            border: "1px solid #E7E7E7",
            marginTop: "8px",
            alignItems: "center",
            textAlign: "center",
          }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#111111", textTransform: "uppercase", letterSpacing: "0.5px" }}>Emergency Contact Info</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, color: "#666666" }}>Contact Name</span>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#111111", margin: "4px 0 0 0" }}>{driver.emergencyContactName || "N/A"}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, color: "#666666" }}>Phone Number</span>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#111111", margin: "4px 0 0 0" }}>{driver.emergencyContactPhone || "N/A"}</p>
              </div>
            </div>
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
