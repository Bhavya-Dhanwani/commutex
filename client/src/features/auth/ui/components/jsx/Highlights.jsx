import styles from "../css/Highlights.module.css";
import HighlightCard from "./HighlightCard";
import { LuTruck, LuMapPinned, LuPackage, LuChartColumn } from "react-icons/lu";

const highlights = [
  { icon: <LuTruck size={22} />, title: "Fleet Management", subtitle: "Track and manage your entire fleet" },
  { icon: <LuMapPinned size={22} />, title: "Route Optimization", subtitle: "Plan efficient routes in seconds" },
  { icon: <LuPackage size={22} />, title: "Shipment Tracking", subtitle: "Monitor shipments in real-time" },
  { icon: <LuChartColumn size={22} />, title: "Analytics Dashboard", subtitle: "Insights that drive decisions" },
];

export default function Highlights() {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Platform Highlights</h3>
      <div className={styles.grid}>
        {highlights.map((item) => (
          <HighlightCard key={item.title} icon={item.icon} title={item.title} subtitle={item.subtitle} />
        ))}
      </div>
    </div>
  );
}
