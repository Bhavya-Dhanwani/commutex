"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchRoles, updateRolePermissions } from "../api/roles";

export default function RoleManagerSettings() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await fetchRoles();
        setRoles(res.roles || res.data?.roles || []);
      } catch (err) {
        console.error("Failed to load roles permissions:", err);
        toast.error("Failed to load role permissions catalog");
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  const handlePermissionToggle = async (roleId, feature, currentValue) => {
    const roleToUpdate = roles.find((r) => r.id === roleId);
    if (!roleToUpdate) return;

    const updatedPermissions = {
      ...roleToUpdate.permissions,
      [feature]: !currentValue,
    };

    // Optimistically update UI
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId ? { ...r, permissions: updatedPermissions } : r
      )
    );

    try {
      await updateRolePermissions(roleId, updatedPermissions);
      toast.success(`Updated ${feature} access for ${roleToUpdate.name}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to update permissions");
      // Rollback UI
      setRoles((prev) =>
        prev.map((r) =>
          r.id === roleId ? { ...r, permissions: roleToUpdate.permissions } : r
        )
      );
    }
  };

  if (loading) {
    return <div style={{ fontSize: "14px", color: "#666666", padding: "16px" }}>Loading permission matrix...</div>;
  }

  const featuresList = [
    "Analytics",
    "Vehicles",
    "Drivers",
    "Trips",
    "Maintenance",
    "Fuel",
    "Expenses",
    "Users",
    "Settings",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111111", margin: "0 0 4px 0" }}>
          Access & Role Permissions Management
        </h3>
        <p style={{ fontSize: "12px", color: "#666666", margin: 0 }}>
          Define dynamic feature access policies for each organizational workspace role. Permissions update in real-time.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
      }}>
        {roles.map((r) => (
          <div key={r.id} style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "14px",
            border: "1px solid #E7E7E7",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#111111" }}>{r.name} Role</span>
              <span style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#666666",
                backgroundColor: "#F3F4F6",
                padding: "4px 8px",
                borderRadius: "6px",
              }}>
                Custom Permissions
              </span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "10px",
            }}>
              {featuresList.map((feature) => {
                const allowed = r.permissions?.[feature] === true;
                const toggleId = `${r.id}-${feature}`;
                return (
                  <div key={feature} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    backgroundColor: allowed ? "#f0fdf4" : "#FAFAFA",
                    border: allowed ? "1px solid #dcfce7" : "1px solid #E7E7E7",
                    transition: "all 0.2s ease",
                  }}>
                    <label
                      htmlFor={toggleId}
                      style={{ fontSize: "13px", fontWeight: 600, color: allowed ? "#16a34a" : "#444444", cursor: "pointer" }}
                    >
                      {feature}
                    </label>
                    <input
                      id={toggleId}
                      type="checkbox"
                      checked={allowed}
                      onChange={() => handlePermissionToggle(r.id, feature, allowed)}
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "#111111",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
