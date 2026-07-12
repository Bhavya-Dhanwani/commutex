import styles from "../css/LeftPanel.module.css";
import Logo from "../../components/jsx/Logo";
import Description from "../../components/jsx/Description";
import HeroIllustration from "../../components/jsx/HeroIllustration";
import Highlights from "../../components/jsx/Highlights";

export default function LeftPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.content}>
        <Logo />

        <Description>
          An all-in-one solution for transport and logistics
          management. Manage your fleet, shipments,
          routes and operations with ease.
        </Description>

        <HeroIllustration />

        <Highlights />
      </div>
    </div>
  );
}
