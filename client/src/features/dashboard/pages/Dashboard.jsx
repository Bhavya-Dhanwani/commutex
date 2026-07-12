"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LuTriangleAlert, LuLock } from "react-icons/lu";

import { setUser } from "../../auth/state/user.slice";
import meApi from "../../auth/api/me";

import fetchVehicles, { createVehicle, updateVehicle } from "../api/vehicles";
import fetchDrivers, { createDriver, updateDriver } from "../api/drivers";
import fetchUsers, { changeUserRole } from "../api/users";
import fetchTrips, { createTrip, updateTrip, dispatchTrip, completeTrip, cancelTrip } from "../api/trips";
import fetchMaintenanceLogs, { createMaintenance, updateMaintenance, startMaintenance, completeMaintenance } from "../api/maintenance";
import fetchFuelLogs, { createFuelLog, updateFuelLog } from "../api/fuel";
import fetchExpenses, { createExpense, updateExpense } from "../api/expenses";
import {
  fetchFleetUtilization,
  fetchFuelEfficiency,
  fetchVehicleRoi,
  fetchExpensesAnalytics,
  fetchRevenueAnalytics,
  fetchMaintenanceAnalytics,
  fetchRecentActivity
} from "../api/analytics";

import DashboardLayout from "../layouts/DashboardLayout";
import WelcomeHeader from "../components/WelcomeHeader";
import KPIGrid from "../components/KPIGrid";
import WorkspaceSection from "../components/WorkspaceSection";
import UtilizationChart from "../components/UtilizationChart";
import StatusChart from "../components/StatusChart";
import ExpenseChart from "../components/ExpenseChart";
import RecentTrips from "../components/RecentTrips";
import ActivityFeed from "../components/ActivityFeed";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import VehicleStatusBars from "../components/VehicleStatusBars";
import VehicleModal from "../components/VehicleModal";
import DriverModal from "../components/DriverModal";
import VehicleDetailsModal from "../components/VehicleDetailsModal";
import DriverDetailsModal from "../components/DriverDetailsModal";
import TripModal from "../components/TripModal";
import TripCompletionModal from "../components/TripCompletionModal";
import MaintenanceModal from "../components/MaintenanceModal";
import MaintenanceCompletionModal from "../components/MaintenanceCompletionModal";
import FuelModal from "../components/FuelModal";
import ExpenseModal from "../components/ExpenseModal";
import RoleManagerSettings from "../components/RoleManagerSettings";

import styles from "../styles/DashboardPage.module.css";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");

  // State to simulate empty state toggling
  const [tripsEmpty, setTripsEmpty] = useState(false);

  // Tab dynamic loading states
  const [tabData, setTabData] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [tabError, setTabError] = useState("");

  // CRUD popup modal states
  const [activeModal, setActiveModal] = useState(null); // 'vehicle' | 'driver'
  const [modalData, setModalData] = useState(null); // data object to edit, or null for create

  // Read-only detail modal states
  const [detailModal, setDetailModal] = useState(null); // 'vehicle' | 'driver'
  const [detailData, setDetailData] = useState(null); // data object to view

  const handleVehicleSubmit = async (formData) => {
    try {
      if (modalData) {
        await updateVehicle(modalData.id, formData);
        toast.success("Vehicle updated successfully!");
        setTabData((prev) => prev.map((v) => (v.id === modalData.id ? { ...v, ...formData } : v)));
      } else {
        const res = await createVehicle(formData);
        toast.success("Vehicle registered successfully!");
        const created = res.vehicle || res.data?.vehicle || res;
        setTabData((prev) => [created, ...prev]);
      }
      setActiveModal(null);
      setModalData(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to save vehicle");
    }
  };

  const handleDriverSubmit = async (formData) => {
    try {
      if (modalData) {
        await updateDriver(modalData.id, formData);
        toast.success("Driver profile updated successfully!");
        setTabData((prev) => prev.map((d) => (d.id === modalData.id ? { ...d, ...formData } : d)));
      } else {
        const res = await createDriver(formData);
        toast.success("Driver registered successfully!");
        const created = res.driver || res.data?.driver || res;
        setTabData((prev) => [created, ...prev]);
      }
      setActiveModal(null);
      setModalData(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to save driver");
    }
  };

  const handleTripSubmit = async (formData) => {
    try {
      if (modalData) {
        await updateTrip(modalData.id, formData);
        toast.success("Trip updated successfully!");
        setTabData((prev) => prev.map((t) => (t.id === modalData.id ? { ...t, ...formData } : t)));
      } else {
        const res = await createTrip(formData);
        toast.success("Trip created as draft!");
        const created = res.trip || res.data?.trip || res;
        setTabData((prev) => [created, ...prev]);
      }
      setActiveModal(null);
      setModalData(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to save trip");
    }
  };

  const handleTripCompleteSubmit = async (payload) => {
    try {
      await completeTrip(modalData.id, payload);
      toast.success("Trip completed successfully!");
      setTabData((prev) => prev.map((t) => (t.id === modalData.id ? { ...t, ...payload, status: "Completed" } : t)));
      setActiveModal(null);
      setModalData(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to complete trip");
    }
  };

  const handleMaintenanceSubmit = async (formData) => {
    try {
      if (modalData) {
        await updateMaintenance(modalData.id, formData);
        toast.success("Maintenance log updated successfully!");
        setTabData((prev) => prev.map((m) => (m.id === modalData.id ? { ...m, ...formData } : m)));
      } else {
        const res = await createMaintenance(formData);
        toast.success("Maintenance log created!");
        const created = res.maintenanceLog || res.data?.maintenanceLog || res;
        setTabData((prev) => [created, ...prev]);
      }
      setActiveModal(null);
      setModalData(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to save maintenance log");
    }
  };

  const handleMaintenanceCompleteSubmit = async (payload) => {
    try {
      await completeMaintenance(modalData.id, payload);
      toast.success("Maintenance log completed!");
      setTabData((prev) => prev.map((m) => (m.id === modalData.id ? { ...m, ...payload, status: "Completed" } : m)));
      setActiveModal(null);
      setModalData(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to complete maintenance log");
    }
  };

  const handleFuelSubmit = async (formData) => {
    try {
      if (modalData) {
        await updateFuelLog(modalData.id, formData);
        toast.success("Fuel log updated successfully!");
        setTabData((prev) => prev.map((f) => (f.id === modalData.id ? { ...f, ...formData } : f)));
      } else {
        const res = await createFuelLog(formData);
        toast.success("Fuel log recorded successfully!");
        const created = res.fuelLog || res.data?.fuelLog || res;
        setTabData((prev) => [created, ...prev]);
      }
      setActiveModal(null);
      setModalData(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to save fuel log");
    }
  };

  const handleExpenseSubmit = async (formData) => {
    try {
      if (modalData) {
        await updateExpense(modalData.id, formData);
        toast.success("Expense log updated successfully!");
        setTabData((prev) => prev.map((e) => (e.id === modalData.id ? { ...e, ...formData } : e)));
      } else {
        const res = await createExpense(formData);
        toast.success("Expense log recorded successfully!");
        const created = res.expense || res.data?.expense || res;
        setTabData((prev) => [created, ...prev]);
      }
      setActiveModal(null);
      setModalData(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to save expense log");
    }
  };

  // Real API metrics for Analytics Dashboard tab
  const [metrics, setMetrics] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (currentTab === "dashboard") {
      const loadAnalytics = async () => {
        try {
          const util = await fetchFleetUtilization();
          const fuel = await fetchFuelEfficiency();
          const roi = await fetchVehicleRoi();
          const exp = await fetchExpensesAnalytics();
          const rev = await fetchRevenueAnalytics();
          const maint = await fetchMaintenanceAnalytics();
          const act = await fetchRecentActivity();

          setMetrics({
            utilization: util.data || util,
            fuel: fuel.data || fuel,
            roi: roi.data || roi,
            expenses: exp.data || exp,
            revenue: rev.data || rev,
            maintenance: maint.data || maint,
          });

          const recentData = act.data || act || {};
          const formatted = [];
          if (recentData.trips) {
            recentData.trips.forEach((t) => {
              formatted.push({
                time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `Trip TX-${t.tripNumber?.slice(0, 8) || "N/A"} status updated to ${t.status}`,
                createdAt: new Date(t.createdAt),
              });
            });
          }
          if (recentData.maintenance) {
            recentData.maintenance.forEach((m) => {
              formatted.push({
                time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `Maintenance task for Vehicle ${m.vehicleId?.slice(0, 8) || "N/A"} - Status: ${m.status}`,
                createdAt: new Date(m.createdAt),
              });
            });
          }
          if (recentData.expenses) {
            recentData.expenses.forEach((e) => {
              formatted.push({
                time: new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `Expense of ₹${Number(e.amount).toLocaleString()} logged for Category ${e.category}`,
                createdAt: new Date(e.createdAt),
              });
            });
          }
          if (recentData.fuelLogs) {
            recentData.fuelLogs.forEach((f) => {
              formatted.push({
                time: new Date(f.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `Fuel replenishment: ${f.liters}L logged (Cost: ₹${Number(f.cost).toLocaleString()})`,
                createdAt: new Date(f.createdAt),
              });
            });
          }
          formatted.sort((a, b) => b.createdAt - a.createdAt);
          setActivities(formatted.slice(0, 8));
        } catch (e) {
          console.error("Failed to load analytics metrics:", e);
        }
      };
      loadAnalytics();
    }
  }, [currentTab]);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await meApi();
        const userData = response.user || response.data?.user;
        if (userData) {
          dispatch(setUser(userData));
          if (userData.role === "User") {
            router.push("/wait");
          }
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Session restoration failed:", err);
        toast.error("Please log in to continue");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [user, dispatch, router]);

  // Handle automatic data fetching for managed tabs
  useEffect(() => {
    if (currentTab === "dashboard" || currentTab === "settings") {
      return;
    }

    const loadData = async () => {
      setTabLoading(true);
      setTabError("");
      setTabData([]);

      try {
        if (currentTab === "vehicles") {
          const res = await fetchVehicles();
          setTabData(res.vehicles || res.data?.vehicles || []);
        } else if (currentTab === "drivers") {
          const res = await fetchDrivers();
          setTabData(res.drivers || res.data?.drivers || []);
        } else if (currentTab === "users") {
          const res = await fetchUsers();
          setTabData(res.users || res.data?.users || []);
        } else if (currentTab === "trips") {
          const res = await fetchTrips();
          setTabData(res.trips || res.data?.trips || []);
        } else if (currentTab === "maintenance") {
          const res = await fetchMaintenanceLogs();
          setTabData(res.maintenanceLogs || res.data?.maintenanceLogs || []);
        } else if (currentTab === "fuel") {
          const res = await fetchFuelLogs();
          setTabData(res.fuelLogs || res.data?.fuelLogs || []);
        } else if (currentTab === "expenses") {
          const res = await fetchExpenses();
          setTabData(res.expenses || res.data?.expenses || []);
        }
      } catch (err) {
        console.error("Failed to load tab data:", err);
        const status = err.response?.status;
        const msg = err.response?.data?.message || err.message;
        
        if (status === 403) {
          setTabError(`Access Denied: ${msg}`);
        } else {
          setTabError(`Failed to load content: ${msg}`);
        }
      } finally {
        setTabLoading(false);
      }
    };

    loadData();
  }, [currentTab]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeUserRole(userId, newRole);
      toast.success("User role updated successfully!");
      setTabData((prev) =>
        prev.map((item) => (item.id === userId ? { ...item, role: newRole } : item))
      );
    } catch (err) {
      console.error("Failed to change user role:", err);
      const msg = err.response?.data?.message || err.message;
      toast.error(`Failed to update role: ${msg}`);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFA" }}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: "#111111", fontFamily: "var(--font-poppins), sans-serif" }}>Loading commuteX platform...</p>
      </div>
    );
  }

  const role = user?.role || "User";

  const renderTabContent = () => {
    // Check if the current tab is an integrated data tab
    const isDataTab = ["vehicles", "drivers", "users", "trips", "maintenance", "fuel", "expenses"].includes(currentTab);

    if (!isDataTab) {
      if (currentTab === "settings") {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div className={styles.workspaceCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Account Settings</h2>
              </div>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Full Name</label>
                    <input type="text" value={user?.name || ""} readOnly style={{ padding: "10px 14px", border: "1px solid #E7E7E7", borderRadius: "10px", backgroundColor: "#FAFAFA", outline: "none", fontSize: "14px" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Email Address</label>
                    <input type="text" value={user?.email || ""} readOnly style={{ padding: "10px 14px", border: "1px solid #E7E7E7", borderRadius: "10px", backgroundColor: "#FAFAFA", outline: "none", fontSize: "14px" }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "200px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#666666" }}>Current System Role</label>
                  <span style={{ padding: "6px 12px", borderRadius: "8px", backgroundColor: "#111111", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, width: "fit-content" }}>{user?.role}</span>
                </div>
              </div>
            </div>
            {role === "Admin" && (
              <div className={styles.workspaceCard} style={{ padding: "24px" }}>
                <RoleManagerSettings />
              </div>
            )}
          </div>
        );
      }
      return (
        <div className={styles.workspaceCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Hub</h2>
          </div>
          <EmptyState
            title={`No ${currentTab} items found`}
            description={`Manage your fleet's active ${currentTab} registry, settings, and logs in this view.`}
            actionText={`Add ${currentTab.slice(0, -1) || "item"}`}
            onAction={() => toast.success(`Mock operation completed for ${currentTab}!`)}
          />
        </div>
      );
    }

    if (tabLoading) {
      return (
        <div className={styles.workspaceCard} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
          <p style={{ fontSize: "15px", fontWeight: 500, color: "#666666" }}>Loading data from server...</p>
        </div>
      );
    }

    if (tabError) {
      const isAccessDenied = tabError.includes("Access Denied");
      return (
        <div className={styles.workspaceCard} style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{ padding: "16px", background: "#fef2f2", borderRadius: "50%", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isAccessDenied ? <LuLock size={40} /> : <LuTriangleAlert size={40} />}
            </div>
          </div>
          <h2 className={styles.cardTitle} style={{ fontSize: "20px", color: "#111111", marginBottom: "8px" }}>
            {isAccessDenied ? "RBAC Authorization Failed" : "Data Loading Error"}
          </h2>
          <p style={{ fontSize: "14px", color: "#666666", maxWidth: "460px", margin: "0 auto 24px auto", lineHeight: "1.6" }}>
            {tabError}
          </p>
          {isAccessDenied && (
            <p style={{ fontSize: "12px", color: "#a3a3a3", fontWeight: 500 }}>
              Current User Session Role: <span className={styles.roleBadge} style={{ background: "#666666" }}>{role}</span>
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={styles.workspaceCard}>
        <div className={styles.cardHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h2 className={styles.cardTitle}>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Hub</h2>
            <span style={{ fontSize: "12px", color: "#666666", fontWeight: 500 }}>
              {tabData.length} records found
            </span>
          </div>
          {currentTab === "vehicles" && (
            <button
              type="button"
              onClick={() => {
                setActiveModal("vehicle");
                setModalData(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              + Add Vehicle
            </button>
          )}
          {currentTab === "drivers" && (
            <button
              type="button"
              onClick={() => {
                setActiveModal("driver");
                setModalData(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              + Add Driver
            </button>
          )}
          {currentTab === "trips" && (
            <button
              type="button"
              onClick={() => {
                setActiveModal("trip");
                setModalData(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              + Create Trip
            </button>
          )}
          {currentTab === "maintenance" && (
            <button
              type="button"
              onClick={() => {
                setActiveModal("maintenance");
                setModalData(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              + Add Maintenance
            </button>
          )}
          {currentTab === "fuel" && (
            <button
              type="button"
              onClick={() => {
                setActiveModal("fuel");
                setModalData(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              + Log Fuel
            </button>
          )}
          {currentTab === "expenses" && (
            <button
              type="button"
              onClick={() => {
                setActiveModal("expense");
                setModalData(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              + Add Expense
            </button>
          )}
        </div>

        {tabData.length === 0 ? (
          <EmptyState
            title={`No ${currentTab} registered`}
            description={`Your system does not have any active ${currentTab} registered on the database.`}
            actionText={`Register ${currentTab === "maintenance" ? "Maintenance" : currentTab === "fuel" ? "Fuel Log" : currentTab === "expenses" ? "Expense Entry" : currentTab.slice(0, -1)}`}
            onAction={() => {
              if (currentTab === "vehicles") {
                setActiveModal("vehicle");
              } else if (currentTab === "drivers") {
                setActiveModal("driver");
              } else if (currentTab === "trips") {
                setActiveModal("trip");
              } else if (currentTab === "maintenance") {
                setActiveModal("maintenance");
              } else if (currentTab === "fuel") {
                setActiveModal("fuel");
              } else if (currentTab === "expenses") {
                setActiveModal("expense");
              }
              setModalData(null);
            }}
          />
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              {currentTab === "vehicles" && (
                <>
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Registration No</th>
                      <th>Type</th>
                      <th>Max Load</th>
                      <th>Odometer</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((item) => (
                      <tr key={item.id} style={{ cursor: "pointer" }}>
                        <td onClick={() => { setDetailModal("vehicle"); setDetailData(item); }} style={{ fontWeight: 600 }}>{item.model}</td>
                        <td onClick={() => { setDetailModal("vehicle"); setDetailData(item); }}>{item.registrationNumber}</td>
                        <td onClick={() => { setDetailModal("vehicle"); setDetailData(item); }}>{item.type}</td>
                        <td onClick={() => { setDetailModal("vehicle"); setDetailData(item); }}>{item.maxLoadCapacity} kg</td>
                        <td onClick={() => { setDetailModal("vehicle"); setDetailData(item); }}>{item.odometer} km</td>
                        <td onClick={() => { setDetailModal("vehicle"); setDetailData(item); }}>
                          <span className={`${styles.statusBadge} ${item.status === "Active" || item.status === "Available" ? styles.statusSuccess : styles.statusWarning}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalData(item);
                              setActiveModal("vehicle");
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #E7E7E7",
                              background: "#FFFFFF",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#111111",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {currentTab === "drivers" && (
                <>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>License Number</th>
                      <th>Phone</th>
                      <th>Safety Score</th>
                      <th>Experience</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((item) => (
                      <tr key={item.id} style={{ cursor: "pointer" }}>
                        <td onClick={() => { setDetailModal("driver"); setDetailData(item); }} style={{ fontWeight: 600 }}>{item.name}</td>
                        <td onClick={() => { setDetailModal("driver"); setDetailData(item); }}>{item.licenseNumber} ({item.licenseCategory})</td>
                        <td onClick={() => { setDetailModal("driver"); setDetailData(item); }}>{item.phone}</td>
                        <td onClick={() => { setDetailModal("driver"); setDetailData(item); }}>{item.safetyScore}/100</td>
                        <td onClick={() => { setDetailModal("driver"); setDetailData(item); }}>{item.experienceYears} Years</td>
                        <td onClick={() => { setDetailModal("driver"); setDetailData(item); }}>
                          <span className={`${styles.statusBadge} ${item.status === "Active" || item.status === "Available" ? styles.statusSuccess : styles.statusWarning}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalData(item);
                              setActiveModal("driver");
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #E7E7E7",
                              background: "#FFFFFF",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#111111",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {currentTab === "trips" && (
                <>
                  <thead>
                    <tr>
                      <th>Trip Number</th>
                      <th>Route</th>
                      <th>Cargo Weight</th>
                      <th>Distance</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.tripNumber}</td>
                        <td>{item.source || "N/A"} &rarr; {item.destination || "N/A"}</td>
                        <td>{item.cargoWeight ? `${item.cargoWeight} kg` : "N/A"}</td>
                        <td>{item.plannedDistance ? `${item.plannedDistance} km` : "N/A"}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${
                            item.status === "Completed" ? styles.statusSuccess :
                            item.status === "Dispatched" ? styles.statusWarning :
                            item.status === "Draft" ? styles.statusWarning :
                            styles.roleBadge
                          }`} style={{
                            backgroundColor: item.status === "Draft" ? "#f3f4f6" : undefined,
                            color: item.status === "Draft" ? "#374151" : undefined,
                            border: item.status === "Draft" ? "1px solid #e5e7eb" : undefined,
                          }}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {item.status === "Draft" && (
                              <>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await dispatchTrip(item.id);
                                      toast.success("Trip dispatched successfully!");
                                      setTabData((prev) => prev.map((t) => (t.id === item.id ? { ...t, status: "Dispatched" } : t)));
                                    } catch (err) {
                                      toast.error(err.response?.data?.message || err.message);
                                    }
                                  }}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#111111",
                                    color: "#FFFFFF",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Dispatch
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setModalData(item);
                                    setActiveModal("trip");
                                  }}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid #E7E7E7",
                                    background: "#FFFFFF",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#111111",
                                    cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>
                              </>
                            )}
                            {item.status === "Dispatched" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setModalData(item);
                                    setActiveModal("completeTrip");
                                  }}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#16a34a",
                                    color: "#FFFFFF",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await cancelTrip(item.id);
                                      toast.success("Trip cancelled.");
                                      setTabData((prev) => prev.map((t) => (t.id === item.id ? { ...t, status: "Cancelled" } : t)));
                                    } catch (err) {
                                      toast.error(err.response?.data?.message || err.message);
                                    }
                                  }}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid #dc2626",
                                    background: "#FFFFFF",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#dc2626",
                                    cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {currentTab === "maintenance" && (
                <>
                  <thead>
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Type</th>
                      <th>Workshop</th>
                      <th>Cost</th>
                      <th>Started Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.vehicleId?.slice(0, 8) || ""}...</td>
                        <td>{item.maintenanceType || "Routine"}</td>
                        <td>{item.workshop || "N/A"}</td>
                        <td>{item.cost ? `₹${Number(item.cost).toLocaleString()}` : "N/A"}</td>
                        <td>{item.startDate ? new Date(item.startDate).toLocaleDateString() : "Not Started"}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${item.status === "Completed" ? styles.statusSuccess : styles.statusWarning}`}>
                            {item.status} {item.startDate && item.status !== "Completed" && "(In Progress)"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {item.status === "Active" && !item.startDate && (
                              <>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await startMaintenance(item.id);
                                      toast.success("Maintenance started!");
                                      setTabData((prev) => prev.map((m) => (m.id === item.id ? { ...m, startDate: new Date().toISOString() } : m)));
                                    } catch (err) {
                                      toast.error(err.response?.data?.message || err.message);
                                    }
                                  }}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#111111",
                                    color: "#FFFFFF",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Start
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setModalData(item);
                                    setActiveModal("maintenance");
                                  }}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid #E7E7E7",
                                    background: "#FFFFFF",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#111111",
                                    cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>
                              </>
                            )}
                            {item.status === "Active" && item.startDate && (
                              <button
                                type="button"
                                onClick={() => {
                                  setModalData(item);
                                  setActiveModal("completeMaintenance");
                                }}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  border: "none",
                                  background: "#16a34a",
                                  color: "#FFFFFF",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {currentTab === "fuel" && (
                <>
                  <thead>
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Volume</th>
                      <th>Cost</th>
                      <th>Odometer</th>
                      <th>Fuel Station</th>
                      <th>Filled On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.vehicleId?.slice(0, 8) || ""}...</td>
                        <td>{item.liters ? `${item.liters} L` : "N/A"}</td>
                        <td>{item.cost ? `₹${Number(item.cost).toLocaleString()}` : "N/A"}</td>
                        <td>{item.odometer ? `${item.odometer} km` : "N/A"}</td>
                        <td>{item.fuelStation || "N/A"}</td>
                        <td>{item.filledOn ? new Date(item.filledOn).toLocaleDateString() : "N/A"}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setModalData(item);
                              setActiveModal("fuel");
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #E7E7E7",
                              background: "#FFFFFF",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#111111",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {currentTab === "expenses" && (
                <>
                  <thead>
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Expense Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.vehicleId?.slice(0, 8) || ""}...</td>
                        <td>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: item.category === "Fuel" ? "#fef3c7" : item.category === "Maintenance" ? "#fee2e2" : "#f3f4f6",
                            color: item.category === "Fuel" ? "#d97706" : item.category === "Maintenance" ? "#dc2626" : "#374151"
                          }}>
                            {item.category}
                          </span>
                        </td>
                        <td>₹{Number(item.amount).toLocaleString()}</td>
                        <td>{item.description || "N/A"}</td>
                        <td>{item.expenseDate ? new Date(item.expenseDate).toLocaleDateString() : "N/A"}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setModalData(item);
                              setActiveModal("expense");
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #E7E7E7",
                              background: "#FFFFFF",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#111111",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {currentTab === "users" && (
                <>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td>{item.email}</td>
                        <td>
                          {item.id === user.id ? (
                            <span className={styles.roleBadge} style={{ background: "#dc2626" }}>
                              {item.role} (You)
                            </span>
                          ) : (
                            <select
                              value={item.role}
                              onChange={(e) => handleRoleChange(item.id, e.target.value)}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "8px",
                                border: "1px solid #E7E7E7",
                                backgroundColor: "#FFFFFF",
                                fontFamily: "var(--font-poppins), sans-serif",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#111111",
                                cursor: "pointer",
                                outline: "none",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                              }}
                            >
                              <option value="Admin">Admin</option>
                              <option value="Fleet Manager">Fleet Manager</option>
                              <option value="Dispatcher">Dispatcher</option>
                              <option value="Safety Officer">Safety Officer</option>
                              <option value="Financial Analyst">Financial Analyst</option>
                              {item.role === "User" && (
                                <option value="User" disabled>User</option>
                              )}
                            </select>
                          )}
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${item.isVerified ? styles.statusSuccess : styles.statusWarning}`}>
                            {item.isVerified ? "Verified" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderDashboardBottomGrid = () => {
    switch (role) {
      case "Fleet Manager":
        return (
          <div className={styles.dashboardGrid}>
            {/* Active Service Log Table */}
            <div className={styles.tableCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Active Service Log</h3>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Service Type</th>
                      <th>Cost</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>VAN-05</td>
                      <td>Oil Change</td>
                      <td>₹2,500</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.statusWarning}`}>In Shop</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>TRUCK-11</td>
                      <td>Engine Repair</td>
                      <td>₹18,000</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.statusSuccess}`}>Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>MINI-03</td>
                      <td>Tyre Replace</td>
                      <td>₹6,200</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.statusWarning}`}>In Shop</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <ActivityFeed activities={[
              { time: "09:20 AM", text: "Vehicle Volvo FH16 added to Fleet" },
              { time: "11:30 AM", text: "Maintenance scheduled for Tata Prima" },
              { time: "12:15 PM", text: "Fuel log entry logged for Mahindra Blazo" },
            ]} />
          </div>
        );
      case "Dispatcher":
        return (
          <div className={styles.dashboardGrid}>
            <RecentTrips
              isEmpty={tripsEmpty}
              onCreateTrip={() => {
                setTripsEmpty(false);
                toast.success("Mock dispatch trip created!");
              }}
            />
            <ActivityFeed activities={[
              { time: "10:12 AM", text: "Trip TX-9040 marked as Completed" },
              { time: "10:55 AM", text: "Driver Vikram R. assigned to Trip TX-9038" },
            ]} />
          </div>
        );
      case "Safety Officer":
        return (
          <div className={styles.dashboardGrid}>
            {/* Drivers & Safety Profiles Table */}
            <div className={styles.tableCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Drivers & Safety Profiles</h3>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Driver</th>
                      <th>License</th>
                      <th>Safety Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Alex</td>
                      <td>DL-88213 (LMV)</td>
                      <td>96%</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.statusSuccess}`}>Available</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>John</td>
                      <td>DL-44120 (HMV) - EXPIRED</td>
                      <td>81%</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.statusWarning}`}>Suspended</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Priya</td>
                      <td>DL-77031 (LMV)</td>
                      <td>99%</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.statusInfo}`}>On Trip</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <ActivityFeed activities={[
              { time: "09:00 AM", text: "Safety compliance checklist filled for TR-20" },
              { time: "10:30 AM", text: "Driver John suspended due to License Expiry" },
            ]} />
          </div>
        );
      case "Financial Analyst":
        return (
          <div className={styles.dashboardGrid}>
            {/* Pending Fuel Bills Table */}
            <div className={styles.tableCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Pending Fuel Bills</h3>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ref ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>EXP-401</td>
                      <td>Diesel Fuel Log</td>
                      <td>₹12,400</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.statusWarning}`}>Awaiting Review</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>EXP-400</td>
                      <td>Maintenance Billing</td>
                      <td>₹18,000</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.statusSuccess}`}>Approved</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>EXP-399</td>
                      <td>Toll Expenses</td>
                      <td>₹3,500</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.statusSuccess}`}>Approved</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <ActivityFeed activities={activities} />
          </div>
        );
      default:
        return (
          <div className={styles.dashboardGrid}>
            <RecentTrips
              isEmpty={tripsEmpty}
              onCreateTrip={() => {
                setTripsEmpty(false);
                toast.success("Mock dispatch trip created!");
              }}
            />
            <ActivityFeed activities={activities} />
          </div>
        );
    }
  };

  const renderDashboardCharts = () => {
    if (role === "Fleet Manager") {
      return (
        <div className={styles.chartsGrid}>
          <UtilizationChart metrics={metrics} />
          <VehicleStatusBars />
        </div>
      );
    }
    if (role === "Financial Analyst") {
      return (
        <div className={styles.chartsGrid}>
          <UtilizationChart metrics={metrics} />
          <ExpenseChart metrics={metrics} />
        </div>
      );
    }
    return (
      <div className={styles.chartsGrid}>
        <UtilizationChart metrics={metrics} />
        <StatusChart metrics={metrics} />
      </div>
    );
  };

  return (
    <DashboardLayout user={user} currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === "dashboard" ? (
        metrics === null ? (
          <div style={{ display: "flex", width: "100%", height: "60vh", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#666666" }}>Loading analytics overview data...</p>
          </div>
        ) : (
          <>
            {/* Welcome Greeting Banner */}
            <WelcomeHeader user={user} />

          {/* Metrics KPIs section */}
          <KPIGrid role={role} metrics={metrics} />



          {/* Charts section based on role */}
          {renderDashboardCharts()}

          {/* Activity Timeline and Details Table based on role */}
          {renderDashboardBottomGrid()}

          {/* Optional interactive control to demonstrate empty states on dispatcher dashboard */}
          {role === "Dispatcher" && (
            <div style={{ marginTop: "16px", padding: "12px", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E7E7E7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#666666" }}>Empty State Toggle:</span>
              <button
                type="button"
                style={{ fontSize: "11px", padding: "4px 8px", background: "#111111", color: "#FFFFFF", border: "none", borderRadius: "4px", cursor: "pointer" }}
                onClick={() => setTripsEmpty(!tripsEmpty)}
              >
                {tripsEmpty ? "Show Trips" : "Hide Trips"}
              </button>
            </div>
          )}
        </>
        )
      ) : (
        renderTabContent()
      )}
      {/* CRUD Overlay Modals */}
      {activeModal === "vehicle" && (
        <VehicleModal
          vehicle={modalData}
          onClose={() => {
            setActiveModal(null);
            setModalData(null);
          }}
          onSubmit={handleVehicleSubmit}
        />
      )}
      {activeModal === "driver" && (
        <DriverModal
          driver={modalData}
          onClose={() => {
            setActiveModal(null);
            setModalData(null);
          }}
          onSubmit={handleDriverSubmit}
        />
      )}
      {activeModal === "trip" && (
        <TripModal
          trip={modalData}
          onClose={() => {
            setActiveModal(null);
            setModalData(null);
          }}
          onSubmit={handleTripSubmit}
        />
      )}
      {activeModal === "completeTrip" && (
        <TripCompletionModal
          trip={modalData}
          onClose={() => {
            setActiveModal(null);
            setModalData(null);
          }}
          onSubmit={handleTripCompleteSubmit}
        />
      )}
      {activeModal === "maintenance" && (
        <MaintenanceModal
          log={modalData}
          onClose={() => {
            setActiveModal(null);
            setModalData(null);
          }}
          onSubmit={handleMaintenanceSubmit}
        />
      )}
      {activeModal === "completeMaintenance" && (
        <MaintenanceCompletionModal
          log={modalData}
          onClose={() => {
            setActiveModal(null);
            setModalData(null);
          }}
          onSubmit={handleMaintenanceCompleteSubmit}
        />
      )}
      {activeModal === "fuel" && (
        <FuelModal
          log={modalData}
          onClose={() => {
            setActiveModal(null);
            setModalData(null);
          }}
          onSubmit={handleFuelSubmit}
        />
      )}
      {activeModal === "expense" && (
        <ExpenseModal
          log={modalData}
          onClose={() => {
            setActiveModal(null);
            setModalData(null);
          }}
          onSubmit={handleExpenseSubmit}
        />
      )}

      {/* Detail Overlay Modals */}
      {detailModal === "vehicle" && (
        <VehicleDetailsModal
          vehicle={detailData}
          onClose={() => {
            setDetailModal(null);
            setDetailData(null);
          }}
        />
      )}
      {detailModal === "driver" && (
        <DriverDetailsModal
          driver={detailData}
          onClose={() => {
            setDetailModal(null);
            setDetailData(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

