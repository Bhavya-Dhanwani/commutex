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

export default function KPIGrid({ role, metrics }) {
  const getKPIs = () => {
    const utilRate = metrics?.utilization?.vehicles?.utilizationRate;
    const totalVehicles = metrics?.utilization?.vehicles?.total;
    const onTrip = metrics?.utilization?.vehicles?.byStatus?.["On Trip"];
    const available = metrics?.utilization?.vehicles?.byStatus?.["Available"];
    const inShop = metrics?.utilization?.vehicles?.byStatus?.["In Shop"];
    const totalTrips = metrics?.utilization?.trips?.total;
    const draftTrips = metrics?.utilization?.trips?.byStatus?.["Draft"];
    const dispTrips = metrics?.utilization?.trips?.byStatus?.["Dispatched"];
    const expensesSum = metrics?.expenses?.totalExpenses;
    const revenueSum = metrics?.revenue?.totalRevenue;
    const avgFuelEff = metrics?.fuel?.averageKmPerLiter;

    switch (role) {
      case "Fleet Manager":
        return [
          { title: "Active Vehicles (On Trip)", value: onTrip !== undefined ? String(onTrip) : "53", change: `Total: ${totalVehicles || 0} registered`, isPositive: true, icon: LuTruck },
          { title: "Fleet Utilization", value: utilRate !== undefined ? `${utilRate}%` : "81%", change: "Based on active vehicles", isPositive: true, icon: LuChartColumn },
          { title: "Vehicles Available", value: available !== undefined ? String(available) : "32", change: "Ready to dispatch", isPositive: true, icon: LuUsers },
          { title: "Pending Service (In Shop)", value: inShop !== undefined ? String(inShop) : "5", change: "In maintenance garage", isPositive: false, icon: LuWrench },
        ];
      case "Dispatcher":
        return [
          { title: "Total Trips logged", value: totalTrips !== undefined ? String(totalTrips) : "18", change: `Dispatched: ${dispTrips || 0}`, isPositive: true, icon: LuMapPinned },
          { title: "Draft / Pending Trips", value: draftTrips !== undefined ? String(draftTrips) : "4", change: "Need assignments", isPositive: false, icon: LuClock3 },
          { title: "Vehicles Available", value: available !== undefined ? String(available) : "32", change: "Ready to dispatch", isPositive: true, icon: LuTruck },
          { title: "Active Vehicles", value: onTrip !== undefined ? String(onTrip) : "53", change: `Total: ${totalVehicles || 0}`, isPositive: true, icon: LuTruck },
        ];
      case "Safety Officer":
        return [
          { title: "Active Vehicles", value: onTrip !== undefined ? String(onTrip) : "53", change: `Total: ${totalVehicles || 0}`, isPositive: true, icon: LuTruck },
          { title: "Pending Service (In Shop)", value: inShop !== undefined ? String(inShop) : "5", change: "In maintenance garage", isPositive: false, icon: LuWrench },
          { title: "Vehicles Available", value: available !== undefined ? String(available) : "32", change: "Ready to dispatch", isPositive: true, icon: LuTruck },
          { title: "Total Trips logged", value: totalTrips !== undefined ? String(totalTrips) : "18", change: `Draft: ${draftTrips || 0}`, isPositive: true, icon: LuMapPinned },
        ];
      case "Financial Analyst":
        return [
          { title: "Total Fuel Efficiency", value: avgFuelEff !== undefined ? `${avgFuelEff} km/L` : "8.5 km/L", change: "Avg fleet performance", isPositive: true, icon: LuIndianRupee },
          { title: "Total Logged Expenses", value: expensesSum !== undefined ? `₹${Number(expensesSum).toLocaleString()}` : "₹1,12,000", change: "Fuel & maintenance costs", isPositive: false, icon: LuChartColumn },
          { title: "Total Revenue Logged", value: revenueSum !== undefined ? `₹${Number(revenueSum).toLocaleString()}` : "₹2,50,000", change: "From completed trips", isPositive: true, icon: LuIndianRupee },
          { title: "Fleet Utilization", value: utilRate !== undefined ? `${utilRate}%` : "81%", change: "On target with forecast", isPositive: true, icon: LuCircleCheck },
        ];
      default:
        return [
          { title: "Active Vehicles", value: onTrip !== undefined ? String(onTrip) : "53", change: `Total: ${totalVehicles || 0}`, isPositive: true, icon: LuTruck },
          { title: "Total Revenue Logged", value: revenueSum !== undefined ? `₹${Number(revenueSum).toLocaleString()}` : "₹2,50,000", change: "From completed trips", isPositive: true, icon: LuIndianRupee },
          { title: "Total Logged Expenses", value: expensesSum !== undefined ? `₹${Number(expensesSum).toLocaleString()}` : "₹1,12,000", change: "Total recorded costs", isPositive: false, icon: LuChartColumn },
          { title: "Fleet Utilization", value: utilRate !== undefined ? `${utilRate}%` : "81%", change: "Realtime usage index", isPositive: true, icon: LuChartColumn },
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
