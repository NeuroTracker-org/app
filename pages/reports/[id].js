// pages/reports/[id].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { fetchSharedReport } from "@/lib/shareReport";
import { useIsMobileDevice } from "@/lib/isMobile";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Components
import RecordListElement from "@/components/recordListElement/recordListElement";
import Spinner from "@/components/Spinner/Spinner";

// Styles
import styles from "@/styles/Reports.module.css";


// ------------------ utils ------------------

function formatDuration(ms) {
  if (!ms) return "0m";
  const totalMinutes = Math.floor(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h > 0 ? `${h}h ` : ""}${m}m`;
}

const stops = [
  { pct: 0, color: "#2498f7" },
  { pct: 25, color: "#19f87d" },
  { pct: 50, color: "#f3d324" },
  { pct: 75, color: "#ff7519" },
  { pct: 100, color: "#fa2059" },
];

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  return rgbToHex(
    Math.round(c1.r + (c2.r - c1.r) * factor),
    Math.round(c1.g + (c2.g - c1.g) * factor),
    Math.round(c1.b + (c2.b - c1.b) * factor)
  );
}
function getGradientColor(value) {
  const pct = Math.max(0, Math.min(100, value));
  let lower = stops[0];
  let upper = stops[stops.length - 1];
  for (let i = 1; i < stops.length; i++) {
    if (pct <= stops[i].pct) {
      lower = stops[i - 1];
      upper = stops[i];
      break;
    }
  }
  const range = upper.pct - lower.pct;
  const factor = range === 0 ? 0 : (pct - lower.pct) / range;
  return interpolateColor(lower.color, upper.color, factor);
}

// ------------------ page ------------------

export default function SharedReportPage() {
  const router = useRouter();
  const { id } = router.query;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobileDevice();

  useEffect(() => {
    if (!id) return;
    fetchSharedReport(id)
      .then((data) => setReport(data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main className={styles.reportsMain}>
      <Spinner />
    </main>
  );
  if (!report) return (
    <main className={styles.reportsMain}>
      <p>Rapport introuvable ou expiré.</p>
    </main>
  );

  const { range, stats, records } = report;
  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("fr-FR") : "";

  const totalZones = Object.values(stats.zones || {}).reduce((a, b) => a + b, 0);

  // Générer le calendrier à partir du range
  const buildCalendar = () => {
    if (!range.start || !range.end) return [];
    const start = new Date(range.start);
    const end = new Date(range.end);

    const firstDay = new Date(start);
    firstDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));

    const lastDay = new Date(end);
    lastDay.setDate(lastDay.getDate() + (7 - lastDay.getDay() || 7));

    const days = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };
  const days = buildCalendar();

  return (
    <>
      <Head>
        <title>Rapport partagé</title>
      </Head>

      <main className={styles.reportsMain}>
        <div id="report-export">
          <header>
            <h1>
              <img src="/monogram.svg" alt="Rapport" /> Rapport du{" "}
              {formatDate(range.start)} au {formatDate(range.end)}
            </h1>
          </header>

          {/* --- Statistiques --- */}
          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p>{stats.count}</p>
              <h3>Enregistrements</h3>
            </div>
            <div className={styles.statCard}>
              <p>
                {
                  stats.count ?
                    stats.count > stats.prevCount ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill={`#fa2059`} d="M512 160C512 142.3 497.7 128 480 128L256 128C238.3 128 224 142.3 224 160C224 177.7 238.3 192 256 192L402.7 192L137.4 457.4C124.9 469.9 124.9 490.2 137.4 502.7C149.9 515.2 170.2 515.2 182.7 502.7L448 237.3L448 384C448 401.7 462.3 416 480 416C497.7 416 512 401.7 512 384L512 160z" /></svg>
                    ) : stats.count < stats.prevCount ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill={`#28e476`} d="M480 512C497.7 512 512 497.7 512 480L512 256C512 238.3 497.7 224 480 224C462.3 224 448 238.3 448 256L448 402.7L182.6 137.4C170.1 124.9 149.8 124.9 137.3 137.4C124.8 149.9 124.8 170.2 137.3 182.7L402.7 448L256 448C238.3 448 224 462.3 224 480C224 497.7 238.3 512 256 512L480 512z" /></svg>
                    ) : stats.count === stats.prevCount ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill={`#888888)`} d="M120 192C106.7 192 96 202.7 96 216C96 229.3 106.7 240 120 240L520 240C533.3 240 544 229.3 544 216C544 202.7 533.3 192 520 192L120 192zM120 400C106.7 400 96 410.7 96 424C96 437.3 106.7 448 120 448L520 448C533.3 448 544 437.3 544 424C544 410.7 533.3 400 520 400L120 400z" /></svg>
                    ) : null : "Pas assez de données"
                }
              </p>
              <h3>Évolution</h3>
            </div>
            <div className={styles.statCard}>
              <p>{formatDuration(stats.totalDuration)}</p>
              <h3>Durée totale</h3>
            </div>
            <div className={styles.statCard}>
              <p>{stats.drugs}</p>
              <h3>
                Prise{stats.drugs > 1 ? "s" : ""} de médicament
                {stats.drugs > 1 ? "s" : ""}
              </h3>
            </div>
          </section>

          {/* --- Zones douloureuses --- */}
          <section className={styles.zonesSection}>
            <div className={styles.contentWrap}>
              <div className={styles.zonesList}>
                <h3>Zones douloureuses</h3>
                {Object.keys(stats.zones || {}).length === 0 ? (
                  <p>Aucune donnée</p>
                ) : (
                  <ul>
                    {Object.entries(stats.zones).map(([zone, count]) => {
                      const pct = totalZones
                        ? ((count / totalZones) * 100).toFixed(1)
                        : 0;
                      return (
                        <li key={zone}>
                          <span>
                            {pct}
                            <sup>%</sup>
                          </span>
                          <p>
                            {zone}
                            <small>({count})</small>
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {Object.keys(stats.zones || {}).length > 0 && (
                <div
                  className={styles.chartWrapper}
                  style={
                    isMobile
                      ? { width: "90dvw", height: "90dvw" }
                      : { width: "500px", height: "500px" }
                  }
                >
                  <ResponsiveContainer>
                    <RadarChart
                      outerRadius="70%"
                      data={Object.entries(stats.zones).map(([zone, count]) => ({
                        zone,
                        count,
                      }))}
                    >
                      <PolarGrid stroke="#444" />
                      <PolarAngleAxis
                        dataKey="zone"
                        tick={{ fill: "#eee", fontSize: 12 }}
                      />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar
                        dataKey="count"
                        stroke="#fa2059"
                        fill="#fa2059"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload || payload.length === 0)
                            return null;
                          const { value } = payload[0];
                          const pct =
                            totalZones > 0
                              ? ((value / totalZones) * 100).toFixed(1)
                              : 0;
                          return (
                            <div
                              style={{
                                background: "#101319",
                                border: "1px solid #1c2230",
                                color: "#FFF",
                                padding: "6px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              <div>{label}</div>
                              <div style={{ color: "#fa2059" }}>
                                {pct}% ({value})
                              </div>
                            </div>
                          );
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>

          {/* --- Calendrier --- */}
          <section className={styles.calendarSection}>
            <h3>Calendrier</h3>
            <div className={styles.calendarGrid}>
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                <div key={d} className={styles.calendarHeader}>
                  {d}
                </div>
              ))}
              {days.map((day) => {
                const iso = day.toISOString().slice(0, 10);
                const recs = records.filter(
                  (r) => r.startTime.slice(0, 10) === iso
                );
                return (
                  <div key={iso} className={styles.calendarCell}>
                    <span className={styles.dayNumber}>{day.getDate()}</span>
                    <div className={styles.dots}>
                      {recs.map((r) => (
                        <span
                          key={r.startTime}
                          className={styles.dot}
                          style={{ background: getGradientColor(r.intensity) }}
                          title={`Intensité ${r.intensity}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* --- Détails --- */}
          <section className={styles.detailsSection}>
            <h3>Détails des enregistrements</h3>
            {records.length === 0 ? (
              <p>Aucun enregistrement sur cette période</p>
            ) : (
              <ul className={styles.recordsList}>
                {records
                  .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                  .map((record, idx) => (
                    <li key={idx}>
                      <RecordListElement record={record} />
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
