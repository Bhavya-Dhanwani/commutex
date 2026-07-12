"use client";

import { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";
import DemoAccountItem from "./DemoAccountItem";
import styles from "../css/DemoAccounts.module.css";

const demoAccounts = [
  {
    role: "Admin User",
    icon: "admin",
    email: "admin@commutex.local",
    password: "demo@123",
  },
  {
    role: "Fleet Manager",
    icon: "fleet",
    email: "fleet.manager@commutex.local",
    password: "demo@123",
  },
  {
    role: "Dispatcher",
    icon: "dispatcher",
    email: "dispatcher@commutex.local",
    password: "demo@123",
  },
  {
    role: "Safety Officer",
    icon: "safety",
    email: "safety.officer@commutex.local",
    password: "demo@123",
  },
  {
    role: "Financial Analyst",
    icon: "finance",
    email: "financial.analyst@commutex.local",
    password: "demo@123",
  },
  {
    role: "General User",
    icon: "user",
    email: "user@commutex.local",
    password: "demo@123",
  },
];

export default function DemoAccounts({ onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={ref}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
      >
        <span className={styles.label}>DEMO ACCOUNTS</span>
        <span className={`${styles.arrow} ${expanded ? styles.arrowOpen : ""}`}>
          <LuChevronDown size={18} />
        </span>
      </button>

      <div className={`${styles.menu} ${expanded ? styles.menuOpen : ""}`}>
        {demoAccounts.map((account) => (
          <DemoAccountItem
            key={account.role}
            role={account.role}
            icon={account.icon}
            email={account.email}
            password={account.password}
            onSelect={(data) => {
              onSelect(data);
              setExpanded(false);
            }}
          />
        ))}
      </div>
    </div>
  );
}
