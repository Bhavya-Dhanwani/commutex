"use client";

import { useState, useEffect } from "react";
import { LuMenu, LuMoon, LuSun } from "react-icons/lu";
import { toast } from "react-toastify";

import styles from "../styles/Topbar.module.css";
import UserMenu from "../components/UserMenu";

export default function Topbar({ user, onMenuToggle }) {
  const [theme, setTheme] = useState("light");

  // Load and apply theme on mount
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
    toast.success(`Switched to ${newTheme} mode`);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <button type="button" className={styles.menuToggle} onClick={onMenuToggle}>
          <LuMenu />
        </button>
      </div>

      <div className={styles.rightSection} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            color: "#666666",
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
        >
          {theme === "light" ? <LuMoon /> : <LuSun />}
        </button>

        <div style={{ height: "20px", width: "1px", backgroundColor: "#E7E7E7" }} />

        <UserMenu user={user} />
      </div>
    </header>
  );
}
