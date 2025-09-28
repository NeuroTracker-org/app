import { useEffect, useState } from "react";
import styles from "./ShareReportModal.module.css";
import { createShareLink } from "@/lib/shareReport";

const TTL_OPTIONS = [
    { label: "1 h", value: 3600 },
    { label: "24 h", value: 86400 },
    { label: "7 jours", value: 604800 },
];

export default function ShareReportModal({ open, onClose, report }) {
    const [busy, setBusy] = useState(false);
    const [link, setLink] = useState("");
    const [expiresIn, setExpiresIn] = useState(0);
    const [error, setError] = useState("");
    const [ttlSec, setTtlSec] = useState(86400); // par défaut 24h

    // Compte à rebours visuel
    useEffect(() => {
        if (!link || !expiresIn) return;
        const t = setInterval(() => {
            setExpiresIn((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(t);
    }, [link, expiresIn]);

    if (!open) return null;

    const createLink = async () => {
        setBusy(true);
        setError("");
        try {
            const url = await createShareLink(report, ttlSec);
            setLink(url);
            setExpiresIn(ttlSec);
            await navigator.clipboard.writeText(url);
        } catch (e) {
            setError(e.message || "Erreur");
        } finally {
            setBusy(false);
        }
    };

    const mins = Math.floor(expiresIn / 60);
    const secs = expiresIn % 60;

    return (
        <div
            className={styles.overlay}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Partager ce rapport</h3>
                    <button className={styles.iconBtn} onClick={onClose}>
                        <i className="far fa-times" />
                    </button>
                </div>

                {!link ? (
                    <div className={styles.modalBody}>
                        <p className={styles.description}>
                            Combien de temps le lien de partage restera actif ?
                        </p>

                        {/* Sélecteur TTL */}
                        <div
                            className={styles.segmented}
                            role="radiogroup"
                            aria-label="Durée de validité du lien"
                        >
                            {TTL_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={ttlSec === opt.value}
                                    className={`${styles.segment} ${ttlSec === opt.value ? styles.segmentActive : ""
                                        }`}
                                    onClick={() => setTtlSec(opt.value)}
                                    disabled={busy}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <div className={styles.footer}>
                            <button className="cta" onClick={createLink} disabled={busy}>
                                {busy ? "Génération..." : "Générer un lien"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.modalBody}>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.shareLink}
                                value={link}
                                readOnly
                                onClick={() => navigator.clipboard.writeText(link)}
                            />
                            <button onClick={() => navigator.clipboard.writeText(link)} title="Copier à nouveau">
                                <i className="far fa-copy" />
                            </button>
                        </div>
                        <p className={styles.subtle}>
                            Expire dans {mins}:{String(secs).padStart(2, "0")}
                        </p>

                        <div className={styles.footer}>
                            <button
                                className={`cta secondary`}
                                onClick={() => {
                                    setLink("");
                                    setError("");
                                    setExpiresIn(0);
                                }}
                            >
                                Générer un nouveau lien
                            </button>
                            <button className="cta" onClick={onClose}>
                                Terminer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
