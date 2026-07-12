import styles from "../css/SocialButton.module.css";

export default function SocialButton({ children, icon: Icon, onClick }) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
}
