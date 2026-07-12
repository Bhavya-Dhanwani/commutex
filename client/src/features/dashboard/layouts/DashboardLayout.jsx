"use client";

import { useState } from "react";
import styles from "../styles/DashboardLayout.module.css";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Content from "./Content";

export default function DashboardLayout({ user, currentTab, onTabChange, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || "User";

  return (
    <div className={styles.layout}>
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentTab={currentTab}
        onTabChange={onTabChange}
      />
      <div className={styles.mainContainer}>
        <Topbar user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Content>{children}</Content>
      </div>
    </div>
  );
}
