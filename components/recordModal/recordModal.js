// components/recordModal/recordModal.js

import { useState, useMemo, useContext, useRef, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";

// CONTEXT
import { AuthContext } from "@/context/AuthContext";

// COMPONENTS
import DrugInput from "@/components/drugInput/drugInput";
import FrontZones from "@/components/frontzones/frontzones";
import BackZones from "@/components/backzones/backzones";
import MedicineModal from "../medicineModal/medicineModal";
import DatePickerComponent from "@/components/DatePicker/DatePicker";
import { db } from "@/lib/db";

// STYLES
import styles from "./recordModal.module.css";

function formatDateLocal(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    "-" + pad(date.getMonth() + 1) +
    "-" + pad(date.getDate()) +
    "T" + pad(date.getHours()) +
    ":" + pad(date.getMinutes())
  );
}


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

const stops = [
  { pct: 0, color: "#2498f7" },
  { pct: 25, color: "#19f87d" },
  { pct: 50, color: "#f3d324" },
  { pct: 75, color: "#ff7519" },
  { pct: 100, color: "#fa2059" },
];

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

const RecordModal = ({ isOpen, hide }) => {
  const context = useContext(AuthContext);
  const [intensity, setIntensity] = useState(10);
  const [infos, setInfos] = useState("");
  const [errorIntensity, setErrorIntensity] = useState(false);
  const [isDisabled, setIsDisabled] = useState();
  const [selectedZones, setSelectedZones] = useState([]);
  const [isFront, setIsFront] = useState(true);
  const [medicineModalOpen, setMedicineModalOpen] = useState(false);
  const percent = intensity; // déjà en 0–100
  const rangeRef = useRef(null);
  const [stopTime, setStopTime] = useState("");

  // à chaque ouverture → remettre la date actuelle
  useEffect(() => {
    if (isOpen) {
      setStopTime(formatDateLocal(new Date())); // en local
    }
  }, [isOpen]);


  // inertie
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const frameRef = useRef(null);

  // Live : médicaments en base
  const allDrugs = useLiveQuery(() => db.drugs.toArray(), []) || [];

  // Quantités locales
  const [counts, setCounts] = useState({});
  const drugs = useMemo(
    () => allDrugs.map((d) => ({ ...d, num: counts[d.id] || 0 })),
    [allDrugs, counts]
  );

  const toggleMedicineModal = () => setMedicineModalOpen(!medicineModalOpen);

  const handleZoneClick = (e) => {
    const currentZone = e.target.getAttribute("data-zone");
    setSelectedZones((prev) =>
      prev.includes(currentZone)
        ? prev.filter((z) => z !== currentZone)
        : [...prev, currentZone]
    );
  };

  const incNum = (id) =>
    setCounts((c) => ({ ...c, [id]: Math.min((c[id] || 0) + 1, 10) }));
  const decNum = (id) =>
    setCounts((c) => ({ ...c, [id]: Math.max((c[id] || 0) - 1, 0) }));
  const handleChange = (e, id) => {
    const v = parseInt(e.target.value, 10);
    if (!Number.isNaN(v)) setCounts((c) => ({ ...c, [id]: v }));
  };

  const isBefore = (date1, date2) => new Date(date1) <= new Date(date2);


  const updateFromClientX = (clientX) => {
    if (!rangeRef.current) return;
    const rect = rangeRef.current.getBoundingClientRect();
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    return Math.max(1, ratio * 100); // valeur flottante min 1
  };

  const applyInertia = () => {
    if (Math.abs(velocityRef.current) < 0.5) return;
    setIntensity((prev) => {
      let next = prev + velocityRef.current;
      next = Math.max(1, Math.min(100, next)); // min 1
      return next;
    });
    velocityRef.current *= 0.9;
    frameRef.current = requestAnimationFrame(applyInertia);
  };

  const startDrag = (e) => {
    e.preventDefault();
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    let newVal = updateFromClientX(clientX);
    if (newVal !== undefined) setIntensity(newVal);
    lastXRef.current = clientX;
    cancelAnimationFrame(frameRef.current);

    const move = (ev) => {
      const x = ev.type === "touchmove" ? ev.touches[0].clientX : ev.clientX;
      newVal = updateFromClientX(x);
      if (newVal !== undefined) {
        // arrondi au dixième pour éviter les trop nombreux re-render
        setIntensity(Math.max(1, Math.round(newVal * 10) / 10));
      }
      const rect = rangeRef.current.getBoundingClientRect();
      const factor = 100 / rect.width; // px → %
      velocityRef.current = (x - lastXRef.current) * factor;
      lastXRef.current = x;
    };

    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", stop);
      frameRef.current = requestAnimationFrame(applyInertia);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", stop);
  };

  const [modalReady, setModalReady] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setModalReady(true), 300);
    } else {
      setModalReady(false);
    }
  }, [isOpen]);

  const resetModalState = () => {
    setStopTime("");
    setInfos("");
    setIntensity(10);
    setSelectedZones([]);
    setCounts({});
    setErrorIntensity(false);

    // Réinitialiser le contexte
    context.setIsRecording(false);
    context.setStartTime("");
    context.setCurrentRecordId(null);
  };


  const handleCancel = async () => {
    if (context.currentRecordId) {
      // supprimer le record orphelin de la DB
      await db.records.delete(context.currentRecordId);
    }
    // reset des états locaux et du contexte
    resetModalState();
    // fermer la modal
    hide(); 
  };


  // --- validation dynamique ---
  useEffect(() => {
    const disabled =
      !context.startTime ||     // pas de début
      !stopTime ||              // pas de fin
      !intensity || intensity < 1 || intensity > 100 || // intensité invalide
      !selectedZones.length ||   // pas de zone sélectionnée
      isBefore(stopTime, context.startTime); // incohérence dates

    setIsDisabled(disabled);
  }, [context.startTime, stopTime, intensity, selectedZones]);

  const handleNewRecord = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    const drugsTemp = drugs
      .filter((d) => d.num > 0)
      .map((d) => ({
        num: d.num,
        drug: d.id,
        name: d.molecule,
      }));

    // Mettre à jour le record existant
    await db.records.update(context.currentRecordId, {
      stopTime,
      duration: Date.parse(stopTime) - Date.parse(context.startTime),
      intensity: Math.round(intensity),
      infos,
      drugs: drugsTemp,
      zones: selectedZones,
      isRecording: false
    });

    resetModalState();
    hide();
  };



  return (
    isOpen && (
      <>
        <MedicineModal isOpen={medicineModalOpen} hide={toggleMedicineModal} />

        <div className={`${styles.modalContainer} ${modalReady ? styles.ready : ""}`}>
          <div className={styles.recordModal}>
            <div className={styles.closeButton} onClick={hide}>
              <i className="fas fa-times"></i>
            </div>
            <form className={styles.recordForm} onSubmit={handleNewRecord}>
              <section>
                {/* --- Zones --- */}
                <fieldset className={styles.zonesFieldset}>
                  <legend>Où la douleur a-t-elle commencé ?</legend>
                  <div className={styles.zonesWrap}>
                    {isFront ? (
                      <FrontZones
                        handleZoneClick={handleZoneClick}
                        selectedZones={selectedZones}
                      />
                    ) : (
                      <BackZones
                        handleZoneClick={handleZoneClick}
                        selectedZones={selectedZones}
                      />
                    )}
                  </div>
                  <ul className={styles.zonesNav}>
                    <li
                      onClick={() => setIsFront(true)}
                      className={isFront ? styles.active : ""}
                    >
                      <span>Avant</span>
                    </li>
                    <li
                      onClick={() => setIsFront(false)}
                      className={!isFront ? styles.active : ""}
                    >
                      <span>Arrière</span>
                    </li>
                  </ul>
                  {selectedZones.length > 0 && (
                    <ul className={styles.selectedZones}>
                      {selectedZones.map((z, i) => (
                        <li key={i}>{z}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </section>

              <section>
                {/* --- Champ dates --- */}
                <fieldset className={styles.dateFieldset}>
                  <legend>Quand a eu lieu la crise ?</legend>
                  <DatePickerComponent
                    label="Début"
                    value={context.startTime}
                    onChange={context.setStartTime}
                  />

                  <DatePickerComponent
                    label="Fin"
                    value={stopTime}
                    onChange={setStopTime}
                  />

                </fieldset>

                {/* --- Intensité --- */}
                <fieldset>
                  <legend>Quelle intensité ?</legend>
                  <div
                    className={styles.intensityRange}
                  >
                    <div
                      className={styles.value}
                      style={{
                        color: getGradientColor(intensity)
                      }}
                    >
                      <span
                        style={{
                          boxShadow: `0 0 15px 0 color-mix(in srgb, ${getGradientColor(intensity)} 50%, transparent)`,
                        }}
                      >
                        {Math.round(intensity)}
                      </span>
                      <small
                        style={{
                          background: `radial-gradient(circle at center, ${getGradientColor(intensity)} 0%, transparent 100%)`,
                        }}
                      ></small>
                    </div>
                    <div className={styles.rangeContainer}
                      ref={rangeRef}
                      onMouseDown={startDrag}
                      onTouchStart={startDrag}>
                      <div className={styles.thresholds}>
                        {Array.from({ length: 21 }).map((_, i) => (
                          <span key={i}></span>
                        ))}
                      </div>
                      <div className={styles.thumbContainer}>
                        <div
                          className={styles.thumb}
                          style={{
                            width: `${percent}%`,
                            background: `linear-gradient(to right, transparent, ${getGradientColor(intensity)})`,
                          }}
                        />
                      </div>
                      <div className={styles.range}>
                        <div className={styles.bar}></div>
                      </div>
                    </div>
                  </div>
                  {errorIntensity && <p>L’intensité doit être définie</p>}
                </fieldset>

                {/* --- Médicaments --- */}
                <fieldset>
                  <legend>As-tu pris des médicaments ?</legend>

                  {drugs.length === 0 ? (
                    <p>Aucun médicament dans ta liste</p>
                  ) : (
                    drugs.map((drug) => (
                      <DrugInput
                        key={drug.id}
                        drugInfos={drug}
                        incNum={incNum}
                        decNum={decNum}
                        handleChange={handleChange}
                      />
                    ))
                  )}

                  <div>
                    <button
                      type="button"
                      className={`cta secondary`}
                      onClick={toggleMedicineModal}
                    >
                      <span>Ajouter un nouveau médicament</span>
                    </button>
                  </div>
                </fieldset>

                {/* --- Infos libres --- */}
                <fieldset>
                  <legend>Quelque chose à ajouter ?</legend>
                  <textarea
                    className={styles.formTextarea}
                    onChange={(e) => setInfos(e.target.value)}
                  />
                </fieldset>

                <div className={styles.formFooter}>
                  <button
                    type="button"
                    className={`${styles.cancelBtn} cta secondary`}
                    onClick={handleCancel}
                  >
                    <span>Annuler</span>
                  </button>
                  <button
                    type="submit"
                    className={`${styles.submitBtn} cta`}
                    disabled={isDisabled}
                  >
                    <span>Enregistrer</span>
                  </button>
                </div>
              </section>
            </form>
          </div>
        </div>
      </>
    )
  );
};

export default RecordModal;
