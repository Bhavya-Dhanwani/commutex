import styles from "../css/FormFooter.module.css";
import Link from "next/link";

export default function FormFooter({ text, linkText, href }) {
  return (
    <div className={styles.footer}>
      <span className={styles.text}>{text}</span>
      <Link href={href} className={styles.link}>{linkText}</Link>
    </div>
  );
}
