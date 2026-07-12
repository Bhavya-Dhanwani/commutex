"use client";

import { LuCircleCheck, LuArrowLeft } from "react-icons/lu";
import styles from "../css/SuccessMessage.module.css";

export default function SuccessMessage({ onBack }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <LuCircleCheck size={48} />
      </div>
      <h2 className={styles.title}>Password reset link sent</h2>
      <p className={styles.description}>
        Please check your inbox. If the email exists, you&apos;ll receive a reset link shortly.
      </p>
      <button type="button" className={styles.button} onClick={onBack}>
        <LuArrowLeft size={18} />
        Back to Login
      </button>
    </div>
  );
}
