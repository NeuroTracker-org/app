import Link from "next/link";

import styles from "./recordListElement.module.css";


import { blendColor } from "@/lib/fallbackColor";

const stops = [
  { pct: 0, color: "#2498f7" },
  { pct: 25, color: "#19f87d" },
  { pct: 50, color: "#f3d324" },
  { pct: 75, color: "#ff7519" },
  { pct: 100, color: "#fa2059" },
];
// Get color based value (0-100)
const getColorForValue = (value) => {
  if (value == null) return "#999"; // Gris neutre si pas de valeur
  const pct = Math.min(Math.max(value, 0), 100);
  for (let i = 1; i < stops.length; i++) {
    if (pct <= stops[i].pct) {
      const lower = stops[i - 1];
      const upper = stops[i];
      const range = upper.pct - lower.pct;
      const rangePct = (pct - lower.pct) / range;
      const r = Math.floor(
        parseInt(lower.color.substring(1, 3), 16) * (1 - rangePct) +
        parseInt(upper.color.substring(1, 3), 16) * rangePct
      );
      const g = Math.floor(
        parseInt(lower.color.substring(3, 5), 16) * (1 - rangePct) +
        parseInt(upper.color.substring(3, 5), 16) * rangePct
      );
      const b = Math.floor(
        parseInt(lower.color.substring(5, 7), 16) * (1 - rangePct) +
        parseInt(upper.color.substring(5, 7), 16) * rangePct
      );
      return `rgb(${r},${g},${b})`;
    } else if (pct === stops[i].pct) {
      return stops[i].color;
    }
  }
  return stops[stops.length - 1].color;
};



export default function RecordListElement({ record }) {
  const start = new Date(record.startTime).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const stop = record.stopTime
    ? new Date(record.stopTime).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    })
    : "En cours";


  // Fonction pour formater la durée (ms → h:m)
  const formatDuration = (ms) => {
    if (!ms || ms < 0) return "?";
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${minutes && minutes > 0 ? `${minutes}m` : ""}`.trim();
  };


  return (
    <Link
      href={`/records/${record.id}`}
      className={styles.recordItem}
      style={{
        backgroundColor: blendColor(getColorForValue(record.intensity), 0.05, "#101319"),
        borderColor: getColorForValue(record.intensity),
        boxShadow: `0 0 8px ${blendColor(getColorForValue(record.intensity), 0.4, "transparent")}`,
      }}
    >
      <section className={styles.sectionPart + " " + styles.titleSection}>
        <h3
          style={{
            color: getColorForValue(record.intensity)
          }}
        >
          Enregistrement #{record.id}
        </h3>
      </section>
      <section className={styles.intensitySection + " " + styles.sectionPart}>
        <h4>
          Intensité :
        </h4>
        <span className={styles.intensityValue}>{record.intensity ?? "?"}/100</span>
      </section>
      <section className={styles.dateSection + " " + styles.sectionPart}>
        <div className={styles.dateTimes}>
          <h4>Date :</h4>
          <small>{start}</small>
          <i className={`far fa-arrow-right-long`}></i>
          <small>{stop}</small>
        </div>
      </section>
      <section className={styles.dateSection + " " + styles.sectionPart}>
        <div className={styles.duration}>
          <h4>Durée :</h4>
          <small>{record.duration ? formatDuration(record.duration) : "?"}</small>
        </div>
      </section>
    </Link>
  );
}
