"use client";

import { useState, forwardRef } from "react";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import InputField from "./InputField";
import styles from "../css/PasswordField.module.css";

const PasswordField = forwardRef(function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required,
  disabled,
  name,
}, ref) {
  const [visible, setVisible] = useState(false);

  const toggleButton = (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setVisible(!visible)}
      tabIndex={-1}
    >
      {visible ? <LuEyeOff size={18} /> : <LuEye size={18} />}
    </button>
  );

  return (
    <InputField
      ref={ref}
      label={label}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      icon={LuLock}
      endIcon={toggleButton}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      required={required}
      disabled={disabled}
      name={name}
    />
  );
});

export default PasswordField;
