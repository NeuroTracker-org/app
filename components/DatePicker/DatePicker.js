import { useState, useRef } from "react";
import styles from "./datePicker.module.css";

export default function DatePicker({ label, value, onChange }) {
  const inputRef = useRef(null);

  // formater en mode "lundi 14:32"
  const formatDate = (val) => {
    if (!val) return "";
    const date = new Date(val);
    return date.toLocaleString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={styles.wrapper}
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.inputContainer}>
        <i className={`far fa-calendar-alt ${styles.icon}`} />
        <span className={styles.formattedDate}>
          {formatDate(value)}
        </span>

        {/* Input natif caché mais clickable */}
        <input
          ref={inputRef}
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.hiddenInput}
        />
      </div>
    </div>
  );
}
