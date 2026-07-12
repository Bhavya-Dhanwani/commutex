import styles from "../css/InputField.module.css";

export default function InputField({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  endIcon,
  value,
  onChange,
  error,
  required,
  disabled,
  name,
}) {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={`${styles.inputWrapper} ${error ? styles.error : ""} ${disabled ? styles.disabled : ""}`}>
        {Icon && (
          <span className={styles.icon}>
            <Icon size={18} />
          </span>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={styles.input}
        />
        {endIcon && (
          <span className={styles.endIcon}>
            {endIcon}
          </span>
        )}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
