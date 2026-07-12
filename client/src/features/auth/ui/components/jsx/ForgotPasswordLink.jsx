import Link from "next/link";
import styles from "../css/ForgotPasswordLink.module.css";

export default function ForgotPasswordLink() {
  return (
    <div className={styles.container}>
      <Link href="/forgot-password" className={styles.link}>
        Forgot password?
      </Link>
    </div>
  );
}
