"use client";

import styles from "../styles/DashboardPage.module.css";
import KPICard from "./KPICard";
import {
  LuTruck,
  LuUsers,
  LuWrench,
  LuMapPinned,
  LuClock3,
  LuCircleCheck,
  LuTriangleAlert,
  LuIndianRupee,
  LuChartColumn
} from "react-icons/lu";

export default function KPIGrid({ role }) {
  const getKPIs = () => {
    switch (role) {
      case "Fleet Manager":
        return [
          { title: "Active Vehicles", value: "53", change: "+4% from last week", isPositive: true, icon: LuTruck },
          { title: "Fleet Utilization", value: "81%", change: "+2.5% from yesterday", isPositive: true, icon: LuChartColumn },
          { title: "Drivers Online", value: "26", change: "+2 new registrations", isPositive: true, icon: LuUsers },
          { title: "Pending Service", value: "5", change: "-2 resolved today", isPositive: true, icon: LuWrench },
        ];
      case "Dispatcher":
        return [
          { title: "Trips Today", value: "18", change: "+12% vs last Monday", isPositive: true, icon: LuMapPinned },
          { title: "Pending Dispatches", value: "4", change: "Need assignments", isPositive: false, icon: LuClock3 },
          { title: "Drivers Online", value: "26", change: "4 on stand-by", isPositive: true, icon: LuUsers },
          { title: "Vehicles Available", value: "32", change: "+5 returned", isPositive: true, icon: LuTruck },
        ];
      case "Safety Officer":
        return [
          { title: "Drivers Online", value: "26", change: "All active check-ins", isPositive: true, icon: LuUsers },
          { title: "Compliance Score", value: "98%", change: "+0.5% this month", isPositive: true, icon: LuCircleCheck },
          { title: "Active Incidents", value: "1", change: "Critical warning", isPositive: false, icon: LuTriangleAlert },
          { title: "License Expirations", value: "3", change: "Due within 30 days", isPositive: false, icon: LuClock3 },
        ];
      case "Financial Analyst":
        return [
          { title: "Fuel Cost Today", value: "₹24,500", change: "-8% vs last week", isPositive: true, icon: LuIndianRupee },
          { title: "Total Expenses", value: "₹1,12,000", change: "+15% budget utilization", isPositive: false, icon: LuChartColumn },
          { title: "Avg Trip Cost", value: "₹4,800", change: "-2.4% avg drop-off", isPositive: true, icon: LuIndianRupee },
          { title: "Monthly Budget Left", value: "64%", change: "On target with forecast", isPositive: true, icon: LuCircleCheck },
        ];
      default:
        return [
          { title: "Active Vehicles", value: "53", change: "+4% from last week", isPositive: true, icon: LuTruck },
          { title: "Trips Today", value: "18", change: "+12% vs last Monday", isPositive: true, icon: LuMapPinned },
          { title: "Drivers Online", value: "26", change: "+2 new registrations", isPositive: true, icon: LuUsers },
          { title: "Fleet Utilization", value: "81%", change: "+2.5% from yesterday", isPositive: true, icon: LuChartColumn },
        ];
    }
  };

  const kpiList = getKPIs();

  return (
    <div className={styles.kpiGrid}>
      {kpiList.map((kpi, idx) => (
        <KPICard
          key={idx}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          isPositive={kpi.isPositive}
          icon={kpi.icon}
        />
      ))}
    </div>
  );
}
