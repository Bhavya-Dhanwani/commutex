"use client";

import styles from "../styles/DashboardPage.module.css";

export default function WelcomeHeader({ user }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 17) return "Good Afternoon,";
    return "Good Evening,";
  };

  const getFormattedDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleDateString("en-US", { month: "long" });
    const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
    return `${weekday} / ${day} ${month}`;
  };

  const displayName = user?.name || "User";
  const displayRole = user?.role || "User";

  return (
    <div className={styles.welcomeHeader}>
      <h1 className={styles.welcomeGreeting}>
        {getGreeting()} <br />
        {displayName}
      </h1>
      <p className={styles.welcomeSubtitle}>
        <span className={styles.roleBadge}>{displayRole}</span>
        <span>•</span>
        <span>{getFormattedDate()}</span>
      </p>
    </div>
  );
}
