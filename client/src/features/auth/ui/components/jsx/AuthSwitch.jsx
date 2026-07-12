"use client";

import { useState } from "react";
import styles from "../css/AuthSwitch.module.css";

export default function AuthSwitch({ active, onSwitch }) {
  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`${styles.tab} ${active === "login" ? styles.active : ""}`}
        onClick={() => onSwitch("login")}
      >
        Login
      </button>
      <button
        type="button"
        className={`${styles.tab} ${active === "signup" ? styles.active : ""}`}
        onClick={() => onSwitch("signup")}
      >
        Signup
      </button>
      <span
        className={styles.slider}
        style={{ transform: active === "signup" ? "translateX(100%)" : "translateX(0)" }}
      />
    </div>
  );
}
