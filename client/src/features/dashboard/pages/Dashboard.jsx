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

  const handleVehicleSubmit = async (formData) => {
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
  };

  const handleDriverSubmit = async (formData) => {
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
  };

  useEffect(() => {
    const checkUserSession = async () => {
      if (user) {
        setLoading(false);
        return;
      }

      try {
        const response = await meApi();
        const userData = response.user || response.data?.user;
        if (userData) {
          dispatch(setUser(userData));
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
        if (currentTab === "fleet") {
          const res = await fetchVehicles();
          setTabData(res.vehicles || res.data?.vehicles || []);
        } else if (currentTab === "drivers") {
          const res = await fetchDrivers();
          setTabData(res.drivers || res.data?.drivers || []);
        } else if (currentTab === "users") {
          const res = await fetchUsers();
          setTabData(res.users || res.data?.users || []);
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
    const isDataTab = ["fleet", "drivers", "users"].includes(currentTab);

    if (!isDataTab) {
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
          {currentTab === "fleet" && (
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
        </div>

        {tabData.length === 0 ? (
          <EmptyState
            title={`No ${currentTab} registered`}
            description={`Your system does not have any active ${currentTab} registered on the database.`}
            actionText={`Register ${currentTab.slice(0, -1)}`}
            onAction={() => {
              setActiveModal(currentTab === "fleet" ? "vehicle" : "driver");
              setModalData(null);
            }}
          />
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              {currentTab === "fleet" && (
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
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.model}</td>
                        <td>{item.registrationNumber}</td>
                        <td>{item.type}</td>
                        <td>{item.maxLoadCapacity} kg</td>
                        <td>{item.odometer} km</td>
                        <td>
                          <span className={`${styles.statusBadge} ${item.status === "Active" || item.status === "Available" ? styles.statusSuccess : styles.statusWarning}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
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
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td>{item.licenseNumber} ({item.licenseCategory})</td>
                        <td>{item.phone}</td>
                        <td>{item.safetyScore}/100</td>
                        <td>{item.experienceYears} Years</td>
                        <td>
                          <span className={`${styles.statusBadge} ${item.status === "Active" || item.status === "Available" ? styles.statusSuccess : styles.statusWarning}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
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
            <ActivityFeed activities={[
              { time: "09:15 AM", text: "Fuel bill EXP-400 approved by Analyst" },
              { time: "10:45 AM", text: "Monthly budget forecast report exported" },
            ]} />
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
            <ActivityFeed />
          </div>
        );
    }
  };

  const renderDashboardCharts = () => {
    if (role === "Fleet Manager") {
      return (
        <div className={styles.chartsGrid}>
          <UtilizationChart />
          <VehicleStatusBars />
        </div>
      );
    }
    if (role === "Financial Analyst") {
      return (
        <div className={styles.chartsGrid}>
          <UtilizationChart />
          <ExpenseChart />
        </div>
      );
    }
    return (
      <div className={styles.chartsGrid}>
        <UtilizationChart />
        <StatusChart />
      </div>
    );
  };

  return (
    <DashboardLayout user={user} currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === "dashboard" ? (
        <>
          {/* Welcome Greeting Banner */}
          <WelcomeHeader user={user} />

          {/* Metrics KPIs section */}
          <KPIGrid role={role} />

          {/* Workspace Task Center */}
          <div style={{ marginBottom: "32px" }}>
            <WorkspaceSection role={role} />
          </div>

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
    </DashboardLayout>
  );
}

