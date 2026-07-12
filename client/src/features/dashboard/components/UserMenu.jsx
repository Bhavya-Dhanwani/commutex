"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { LuUser, LuSettings, LuLogOut } from "react-icons/lu";
import styles from "../styles/Topbar.module.css";
import { clearUser } from "../../auth/state/user.slice";
import logoutApi from "../../auth/api/logout";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      dispatch(clearUser());
      window.location.href = "/login";
    }
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className={styles.userMenu}>
      <button type="button" className={styles.userTrigger} onClick={() => setOpen(!open)}>
        <div className={styles.avatar}>{getInitials()}</div>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #E7E7E7" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", margin: 0, color: "#111111" }}>{user?.name}</p>
            <p style={{ fontSize: "11px", color: "#666666", margin: "2px 0 0 0" }}>{user?.email}</p>
          </div>
          <button type="button" className={styles.dropdownItem} onClick={() => router.push("/dashboard")}>
            <LuUser size={16} />
            <span>Profile</span>
          </button>
          <button type="button" className={styles.dropdownItem} onClick={() => router.push("/dashboard")}>
            <LuSettings size={16} />
            <span>Settings</span>
          </button>
          <button type="button" className={styles.dropdownItem} style={{ color: "#dc2626" }} onClick={handleLogout}>
            <LuLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
