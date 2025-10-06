import { useState, useRef } from "react";

// LIBS
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale"; // import locale de date-fns
import "react-datepicker/dist/react-datepicker.css"; // styles de base

// STYLES
import styles from "./datePicker.module.css";

// Enregistrement de la locale "fr"
registerLocale("fr", fr);

export default function DatePickerComponent({ label, value, onChange }) {
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
    <divz
      className={styles.wrapper}
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <label className={styles.fieldLabel}>{label}</label>
      <DatePicker
        ref={inputRef}
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange(date?.toISOString().slice(0, 16))}
        showTimeSelect
        timeIntervals={15}
        dateFormat="EEEE dd MMMM HH:mm" // format texte
        timeFormat="HH:mm"
        locale="fr" // Locale activée
        timeCaption="Heure"
        placeholderText="Choisir une date"
        className={styles.dateInput}
      />
    </divz>
  );
}
