// pages/records/[id].js
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

import DrugInput from "@/components/drugInput/drugInput";
import FrontZones from "@/components/frontzones/frontzones";
import BackZones from "@/components/backzones/backzones";
import MedicineModal from "@/components/medicineModal/medicineModal";
import DatePicker from "@/components/DatePicker/DatePicker";

import styles from "../../styles/RecordEdit.module.css";

// --- utilitaires intensité ---
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function rgbToHex(r, g, b) {
    return (
        "#" +
        [r, g, b]
            .map((x) => (x.toString(16).length === 1 ? "0" + x.toString(16) : x.toString(16)))
            .join("")
    );
}
function interpolateColor(c1, c2, f) {
    const a = hexToRgb(c1);
    const b = hexToRgb(c2);
    return rgbToHex(
        Math.round(a.r + (b.r - a.r) * f),
        Math.round(a.g + (b.g - a.g) * f),
        Math.round(a.b + (b.b - a.b) * f)
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

export default function RecordEditPage() {
    const router = useRouter();
    const { id } = router.query;

    const record = useLiveQuery(
        async () => (id ? db.records.get(Number(id)) : null),
        [id]
    );

    const [intensity, setIntensity] = useState(10);
    const [infos, setInfos] = useState("");
    const [zones, setZones] = useState([]);
    const [isFront, setIsFront] = useState(true);
    const [stopTime, setStopTime] = useState("");
    const [startTime, setStartTime] = useState("");
    const [medicineModalOpen, setMedicineModalOpen] = useState(false);

    const allDrugs = useLiveQuery(() => db.drugs.toArray(), []) || [];
    const [counts, setCounts] = useState({});
    const drugs = useMemo(
        () => allDrugs.map((d) => ({ ...d, num: counts[d.id] || 0 })),
        [allDrugs, counts]
    );

    // slider inertie
    const rangeRef = useRef(null);
    const velocityRef = useRef(0);
    const lastXRef = useRef(0);
    const frameRef = useRef(null);

    useEffect(() => {
        if (record) {
            setStartTime(record.startTime || "");
            setStopTime(record.stopTime || "");
            setIntensity(record.intensity || 10);
            setInfos(record.infos || "");
            setZones(record.zones || []);
            setCounts(
                (record.drugs || []).reduce(
                    (acc, d) => ({ ...acc, [d.drug]: d.num }),
                    {}
                )
            );
        }
    }, [record]);

    if (!record) return <p>Chargement...</p>;

    const handleZoneClick = (e) => {
        const z = e.target.getAttribute("data-zone");
        setZones((prev) =>
            prev.includes(z) ? prev.filter((x) => x !== z) : [...prev, z]
        );
    };

    // --- slider drag ---
    const updateFromClientX = (clientX) => {
        if (!rangeRef.current) return;
        const rect = rangeRef.current.getBoundingClientRect();
        let ratio = (clientX - rect.left) / rect.width;
        ratio = Math.max(0, Math.min(1, ratio));
        return Math.max(1, ratio * 100);
    };
    const applyInertia = () => {
        if (Math.abs(velocityRef.current) < 0.5) return;
        setIntensity((prev) => {
            let next = prev + velocityRef.current;
            return Math.max(1, Math.min(100, next));
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
                setIntensity(Math.max(1, Math.round(newVal * 10) / 10));
            }
            const rect = rangeRef.current.getBoundingClientRect();
            const factor = 100 / rect.width;
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

    const handleDelete = async () => {
        await db.records.delete(record.id);
        router.push("/records");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const drugsTemp = drugs
            .filter((d) => d.num > 0)
            .map((d) => ({ num: d.num, drug: d.id, name: d.molecule }));

        await db.records.update(record.id, {
            startTime,
            stopTime,
            intensity: Math.round(intensity),
            infos,
            zones,
            drugs: drugsTemp,
        });

        router.push("/records");
    };

    const percent = intensity;

    return (
        <main className={styles.recordEdit}>
            <div className={styles.pageHeader}>
                <div className={styles.breadcrumbs}>
                    <h1>Enregistrement #{record.id}</h1>
                </div>
                <button className={`${styles.backButton} cta secondary`} onClick={() => router.push("/records")}>
                    <i className="fa-solid fa-arrow-left"></i><span>Retour aux enregistrements</span>
                </button>
            </div>

            <form className={styles.recordForm} onSubmit={handleSave}>
                {/* --- Zones --- */}
                <section>
                    <fieldset className={styles.zonesFieldset}>
                        <legend>Où la douleur a-t-elle commencé ?</legend>
                        <div className={styles.zonesWrap}>
                            {isFront ? (
                                <FrontZones handleZoneClick={handleZoneClick} selectedZones={zones} />
                            ) : (
                                <BackZones handleZoneClick={handleZoneClick} selectedZones={zones} />
                            )}
                        </div>
                        <ul className={styles.zonesNav}>
                            <li
                                onClick={() => setIsFront(true)}
                                className={isFront ? styles.active : ""}
                            >
                                Avant
                            </li>
                            <li
                                onClick={() => setIsFront(false)}
                                className={!isFront ? styles.active : ""}
                            >
                                Arrière
                            </li>
                        </ul>
                        {zones.length > 0 && (
                            <ul className={styles.selectedZones}>
                                {zones.map((z, i) => (
                                    <li key={i}>{z}</li>
                                ))}
                            </ul>
                        )}
                    </fieldset>
                </section>

                {/* --- Champ dates --- */}
                <section>
                    <fieldset className={styles.dateFieldset}>
                        <legend>Quand a eu lieu la crise ?</legend>
                        <DatePicker label="Début" value={startTime} onChange={setStartTime} />
                        <DatePicker label="Fin" value={stopTime} onChange={setStopTime} />
                    </fieldset>

                    {/* --- Intensité --- */}
                    <fieldset>
                        <legend>Quelle intensité ?</legend>
                        <div className={styles.intensityRange}>
                            <div
                                className={styles.value}
                                style={{ color: getGradientColor(intensity) }}
                            >
                                <span
                                    style={{
                                        boxShadow: `0 0 15px 0 color-mix(in srgb, ${getGradientColor(
                                            intensity
                                        )} 50%, transparent)`,
                                    }}
                                >
                                    {Math.round(intensity)}
                                </span>
                                <small
                                    style={{
                                        background: `radial-gradient(circle at center, ${getGradientColor(
                                            intensity
                                        )} 0%, transparent 100%)`,
                                    }}
                                ></small>
                            </div>
                            <div
                                className={styles.rangeContainer}
                                ref={rangeRef}
                                onMouseDown={startDrag}
                                onTouchStart={startDrag}
                            >
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
                                            background: `linear-gradient(to right, transparent, ${getGradientColor(
                                                intensity
                                            )})`,
                                        }}
                                    />
                                </div>
                                <div className={styles.range}>
                                    <div className={styles.bar}></div>
                                </div>
                            </div>
                        </div>
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
                                    incNum={(id) =>
                                        setCounts((c) => ({ ...c, [id]: Math.min((c[id] || 0) + 1, 10) }))
                                    }
                                    decNum={(id) =>
                                        setCounts((c) => ({ ...c, [id]: Math.max((c[id] || 0) - 1, 0) }))
                                    }
                                    handleChange={(e, id) =>
                                        setCounts((c) => ({ ...c, [id]: Number(e.target.value) }))
                                    }
                                />
                            ))
                        )}
                        <div>
                            <button
                                type="button"
                                className="cta secondary"
                                onClick={() => setMedicineModalOpen(true)}
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
                            value={infos}
                            onChange={(e) => setInfos(e.target.value)}
                        />
                    </fieldset>

                    {/* --- Footer --- */}
                    <div className={styles.formFooter}>
                        <button
                            type="button"
                            className={`${styles.cancelBtn} cta secondary`}
                            onClick={handleDelete}
                        >
                            Supprimer
                        </button>
                        <button type="submit" className={`${styles.submitBtn} cta`}>
                            Modifier
                        </button>
                    </div>
                </section>
            </form>

            {medicineModalOpen && (
                <MedicineModal
                    isOpen={medicineModalOpen}
                    hide={() => setMedicineModalOpen(false)}
                />
            )}
        </main>
    );
}
