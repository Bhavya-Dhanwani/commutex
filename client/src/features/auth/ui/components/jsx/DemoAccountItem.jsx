import { LuUser, LuTruck, LuMapPinned, LuShield, LuChartColumn, LuChevronRight } from "react-icons/lu";
import styles from "../css/DemoAccountItem.module.css";

const iconMap = {
  admin: LuUser,
  fleet: LuTruck,
  dispatcher: LuMapPinned,
  safety: LuShield,
  finance: LuChartColumn,
};

export default function DemoAccountItem({ role, icon, email, password, onSelect }) {
  const Icon = iconMap[icon] || LuUser;

  return (
    <button
      type="button"
      className={styles.item}
      onClick={() => onSelect({ email, password })}
    >
      <div className={styles.left}>
        <span className={styles.icon}>
          <Icon size={18} />
        </span>
        <span className={styles.role}>{role}</span>
      </div>
      <LuChevronRight size={16} className={styles.chevron} />
    </button>
  );
}
