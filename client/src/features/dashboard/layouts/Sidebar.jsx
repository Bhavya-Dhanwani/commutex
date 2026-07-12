"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  LuLayoutDashboard,
  LuTruck,
  LuUsers,
  LuMapPinned,
  LuWrench,
  LuFuel,
  LuChartColumn,
  LuSettings,
  LuLogOut,
  LuCircleCheck,
  LuTriangleAlert
} from "react-icons/lu";

import styles from "../styles/Sidebar.module.css";
import { clearUser } from "../../auth/state/user.slice";
import logoutApi from "../../auth/api/logout";

export default function Sidebar({ role, isOpen, onClose, currentTab, onTabChange }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      dispatch(clearUser());
      window.location.href = "/login";
    }
  };

  // Menu items visibility rule based on user role
  const getVisibleMenu = () => {
    const baseMenu = [{ id: "dashboard", label: "Dashboard", icon: LuLayoutDashboard }];

    switch (role) {
      case "Admin":
        return [
          ...baseMenu,
          { id: "fleet", label: "Fleet", icon: LuTruck },
          { id: "drivers", label: "Drivers", icon: LuUsers },
          { id: "trips", label: "Trips", icon: LuMapPinned },
          { id: "maintenance", label: "Maintenance", icon: LuWrench },
          { id: "fuel", label: "Fuel", icon: LuFuel },
          { id: "expenses", label: "Expenses", icon: LuChartColumn },
          { id: "compliance", label: "Compliance", icon: LuCircleCheck },
          { id: "incidents", label: "Incidents", icon: LuTriangleAlert },
          { id: "analytics", label: "Analytics", icon: LuChartColumn },
          { id: "users", label: "Users", icon: LuUsers },
          { id: "settings", label: "Settings", icon: LuSettings },
        ];
      case "Fleet Manager":
        return [
          ...baseMenu,
          { id: "fleet", label: "Fleet", icon: LuTruck },
          { id: "maintenance", label: "Maintenance", icon: LuWrench },
          { id: "settings", label: "Settings", icon: LuSettings },
        ];
      case "Dispatcher":
        return [
          ...baseMenu,
          { id: "trips", label: "Trips", icon: LuMapPinned },
          { id: "drivers", label: "Drivers", icon: LuUsers },
          { id: "settings", label: "Settings", icon: LuSettings },
        ];
      case "Safety Officer":
        return [
          ...baseMenu,
          { id: "drivers", label: "Drivers", icon: LuUsers },
          { id: "compliance", label: "Compliance", icon: LuCircleCheck },
          { id: "incidents", label: "Incidents", icon: LuTriangleAlert },
          { id: "settings", label: "Settings", icon: LuSettings },
        ];
      case "Financial Analyst":
        return [
          ...baseMenu,
          { id: "fuel", label: "Fuel", icon: LuFuel },
          { id: "expenses", label: "Expenses", icon: LuChartColumn },
          { id: "analytics", label: "Analytics", icon: LuChartColumn },
          { id: "settings", label: "Settings", icon: LuSettings },
        ];
      case "User":
      default:
        return [
          ...baseMenu,
          { id: "settings", label: "Settings", icon: LuSettings },
        ];
    }
  };

  const menuItems = getVisibleMenu();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.logoSection}>
          <div className={styles.logoText}>commuteX</div>
        </div>

        <nav className={styles.navSection}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.activeItem : ""}`}
                onClick={() => {
                  onTabChange(item.id);
                  onClose(); // close on mobile
                }}
              >
                <Icon className={styles.navIcon} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={styles.footerSection}>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <LuLogOut className={styles.navIcon} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
