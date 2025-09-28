// components/Toast/Toast.jsx
import { useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({ message, open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.toast}>
      {message}
    </div>
  );
}
