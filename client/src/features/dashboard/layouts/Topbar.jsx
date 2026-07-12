"use client";

import { LuMenu } from "react-icons/lu";

import styles from "../styles/Topbar.module.css";
import UserMenu from "../components/UserMenu";

export default function Topbar({ user, onMenuToggle }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <button type="button" className={styles.menuToggle} onClick={onMenuToggle}>
          <LuMenu />
        </button>
      </div>

      <div className={styles.rightSection}>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
