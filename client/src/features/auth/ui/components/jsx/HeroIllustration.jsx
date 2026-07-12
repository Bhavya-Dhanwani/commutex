import styles from "../css/HeroIllustration.module.css";
import authIllustration from "@/assets/auth.png";

export default function HeroIllustration() {
  return (
    <div className={styles.container}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={authIllustration.src} alt="Transit illustration" className={styles.image} />
    </div>
  );
}
