import styles from "../css/ActionButton.module.css";
import Loader from "./Loader";

export default function ActionButton({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  icon: Icon,
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  );
}
