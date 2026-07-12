"use client";

import { useState, useRef, useEffect } from "react";
import { LuChevronDown, LuCheck } from "react-icons/lu";
import styles from "../css/Dropdown.module.css";

export default function Dropdown({
  label,
  placeholder = "Select an option",
  options = [],
  value,
  onChange,
  required,
  disabled,
  name,
  error,
  icon: Icon,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div ref={ref} className={styles.wrapper}>
        <button
          type="button"
          className={`${styles.trigger} ${open ? styles.open : ""} ${error ? styles.error : ""}`}
          onClick={() => setOpen(!open)}
          disabled={disabled}
        >
          {Icon && (
            <span className={styles.icon}>
              <Icon size={18} />
            </span>
          )}
          <span className={selected ? styles.selectedValue : styles.placeholder}>
            {selected ? selected.label : placeholder}
          </span>
          <span className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`}>
            <LuChevronDown size={18} />
          </span>
        </button>

        {open && (
          <ul className={styles.menu}>
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`${styles.option} ${opt.value === value ? styles.optionSelected : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {opt.value === value && <LuCheck size={16} />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
