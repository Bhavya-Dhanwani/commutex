"use client";

import styles from "../css/Logo.module.css";
import logo from "@/assets/logo.png";
import Image from "next/image";

export default function Logo() {
  return (
    <div className={styles.container}>
      <Image src={logo} alt="commuteX" width={120} height="auto" priority className={styles.image} />
      <span className={styles.brand}>commuteX</span>
    </div>
  );
}
