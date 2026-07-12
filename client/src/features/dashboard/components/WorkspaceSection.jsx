"use client";

import styles from "../styles/DashboardPage.module.css";
import QuickActionCard from "./QuickActionCard";
import {
  LuWrench,
  LuClock3,
  LuTruck,
  LuTriangleAlert,
  LuMapPinned,
  LuUsers,
  LuCircleCheck,
  LuIndianRupee,
  LuChartColumn,
  LuTrendingUp
} from "react-icons/lu";

export default function WorkspaceSection({ role }) {
  const getTasks = () => {
    switch (role) {
      case "Fleet Manager":
        return [
          { title: "Vehicles Awaiting Service", description: "3 trucks are overdue for inspection.", icon: LuWrench },
          { title: "Maintenance Schedule", description: "View upcoming oil changes and tire rotations.", icon: LuClock3 },
          { title: "Quick Add Vehicle", description: "Onboard a new vehicle into the fleet database.", icon: LuTruck },
          { title: "Inventory Alerts", description: "Fuel filter and brake pads stock is running low.", icon: LuTriangleAlert },
        ];
      case "Dispatcher":
        return [
          { title: "Today's Trips", description: "12 active trips are currently en route.", icon: LuMapPinned },
          { title: "Assign Driver", description: "3 dispatches require a driver match.", icon: LuUsers },
          { title: "Pending Dispatches", description: "Review and approve 4 new dispatch orders.", icon: LuClock3 },
          { title: "Vehicle Availability", description: "15 sedans and 8 trucks ready for routing.", icon: LuTruck },
        ];
      case "Safety Officer":
        return [
          { title: "Drivers with Violations", description: "1 critical speeding violation flag detected.", icon: LuTriangleAlert },
          { title: "License Expiry", description: "3 driver licenses expire in next 30 days.", icon: LuClock3 },
          { title: "Incident Reports", description: "Review incident logs submitted by drivers.", icon: LuCircleCheck },
          { title: "Compliance Tasks", description: "Fill out quarterly safety audit report forms.", icon: LuUsers },
        ];
      case "Financial Analyst":
        return [
          { title: "Fuel Cost", description: "Monitor and analyze current fuel price trends.", icon: LuIndianRupee },
          { title: "Expenses", description: "4 pending fuel bills require payment approval.", icon: LuChartColumn },
          { title: "Monthly Budget", description: "64% of July operations budget is remaining.", icon: LuCircleCheck },
          { title: "Profit Summary", description: "Track gross margin and operational revenue.", icon: LuTrendingUp },
        ];
      default:
        return [
          { title: "Vehicles Awaiting Service", description: "3 trucks are overdue for inspection.", icon: LuWrench },
          { title: "Today's Trips", description: "12 active trips are currently en route.", icon: LuMapPinned },
          { title: "Drivers with Violations", description: "1 critical speeding violation flag detected.", icon: LuTriangleAlert },
          { title: "Fuel Cost", description: "Monitor and analyze current fuel price trends.", icon: LuIndianRupee },
        ];
    }
  };

  const tasks = getTasks();

  return (
    <div className={styles.workspaceCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Workspace Tasks</h3>
      </div>
      <div className={styles.workspaceTasks}>
        {tasks.map((task, idx) => (
          <QuickActionCard
            key={idx}
            title={task.title}
            description={task.description}
            icon={task.icon}
            onClick={() => console.log(`Clicked task: ${task.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
