"use client";

import styles from "../styles/Topbar.module.css";
import { LuSearch } from "react-icons/lu";

export default function SearchBar() {
  return (
    <div className={styles.searchBar}>
      <LuSearch size={16} style={{ color: "#666666" }} />
      <input
        type="text"
        placeholder="Search for trips, vehicles, or drivers..."
        className={styles.searchInput}
      />
    </div>
  );
}
