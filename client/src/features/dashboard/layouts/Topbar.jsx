"use client";

import { useState, useEffect } from "react";
import { LuBell, LuMoon, LuSun, LuMenu } from "react-icons/lu";
import { toast } from "react-toastify";

import styles from "../styles/Topbar.module.css";
import UserMenu from "../components/UserMenu";
import NotificationCard from "../components/NotificationCard";

export default function Topbar({ user, onMenuToggle }) {
  const [theme, setTheme] = useState("light");
  const [showNotifications, setShowNotifications] = useState(false);

  // Initialize theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    toast.success(`Theme toggled to ${newTheme} mode`);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <button type="button" className={styles.menuToggle} onClick={onMenuToggle}>
          <LuMenu />
        </button>
      </div>

      <div className={styles.rightSection}>
        {/* Theme Toggle */}
        <button type="button" className={styles.iconBtn} onClick={toggleTheme}>
          {theme === "light" ? <LuMoon /> : <LuSun />}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <LuBell />
            <span className={styles.badge} />
          </button>
          {showNotifications && <NotificationCard />}
        </div>

        <div className={styles.divider} />

        <UserMenu user={user} />
      </div>
    </header>
  );
}
