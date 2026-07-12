"use client";

import { useState } from "react";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import InputField from "./InputField";
import styles from "../css/PasswordField.module.css";

export default function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  name,
}) {
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
      label={label}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      icon={LuLock}
      endIcon={toggleButton}
      value={value}
      onChange={onChange}
      error={error}
      required={required}
      disabled={disabled}
      name={name}
    />
  );
}
