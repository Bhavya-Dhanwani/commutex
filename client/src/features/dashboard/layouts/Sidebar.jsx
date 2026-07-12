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

export default function Sidebar({ user, isOpen, onClose, currentTab, onTabChange }) {
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

  // Menu items visibility rule based on user role permissions
  const getVisibleMenu = () => {
    const baseMenu = [{ id: "dashboard", label: "Analytics", icon: LuLayoutDashboard }];

    const role = user?.role || "User";
    const permissions = user?.permissions || {};

    const items = [...baseMenu];

    if (role === "Admin" || permissions.Vehicles === true) {
      items.push({ id: "vehicles", label: "Vehicles", icon: LuTruck });
    }
    if (role === "Admin" || permissions.Drivers === true) {
      items.push({ id: "drivers", label: "Drivers", icon: LuUsers });
    }
    if (role === "Admin" || permissions.Trips === true) {
      items.push({ id: "trips", label: "Trips", icon: LuMapPinned });
    }
    if (role === "Admin" || permissions.Maintenance === true) {
      items.push({ id: "maintenance", label: "Maintenance", icon: LuWrench });
    }
    if (role === "Admin" || permissions.Fuel === true) {
      items.push({ id: "fuel", label: "Fuel", icon: LuFuel });
    }
    if (role === "Admin" || permissions.Expenses === true) {
      items.push({ id: "expenses", label: "Expenses", icon: LuChartColumn });
    }
    if (role === "Admin" || permissions.Users === true) {
      items.push({ id: "users", label: "Users", icon: LuUsers });
    }
    if (role === "Admin" || permissions.Settings === true) {
      items.push({ id: "settings", label: "Settings", icon: LuSettings });
    } else {
      // default settings tab fallback so they can access profile
      items.push({ id: "settings", label: "Settings", icon: LuSettings });
    }

    return items;
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
