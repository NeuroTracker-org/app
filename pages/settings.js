// pages/settings.js
import Head from "next/head";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { QRCodeCanvas } from "qrcode.react";
import styles from "../styles/Settings.module.css";

function nowIsoLocal() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}


function downloadFile(filename, mime, textOrBlob) {
  const blob =
    textOrBlob instanceof Blob
      ? textOrBlob
      : new Blob([textOrBlob], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Settings() {
  const [syncCode, setSyncCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [remaining, setRemaining] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [counts, setCounts] = useState({ records: 0, drugs: 0 });
  const [pairCode, setPairCode] = useState("");
  const [pairStatus, setPairStatus] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;

  // Charger depuis IndexedDB
  useEffect(() => {
    (async () => {
      const meta = await db.meta.get("syncCode");
      if (meta && meta.value && meta.expiresAt > Date.now()) {
        setSyncCode(meta.value);
        setExpiresAt(meta.expiresAt);
      } else {
        setSyncCode("");
        setExpiresAt(null);
        if (meta) await db.meta.delete("syncCode");
      }
      const [r, d] = await Promise.all([
        db.records.count(),
        db.drugs.count(),
      ]);
      setCounts({ records: r, drugs: d });
    })();
  }, []);

  // Compte à rebours
  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setRemaining("Expiré");
        setSyncCode("");
        setExpiresAt(null);
        db.meta.delete("syncCode");
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setRemaining(`${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const generateSyncCode = async () => {
    const code = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

    const [records, drugs, metaAll] = await Promise.all([
      db.records.toArray(),
      db.drugs.toArray(),
      db.meta.toArray(),
    ]);
    const payload = { records, drugs, meta: metaAll, exportedAt: new Date().toISOString() };

    const res = await fetch(`/api/sync/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Erreur lors de la génération du code");
      return;
    }

    const { expiresAt } = await res.json();
    setSyncCode(code);
    setExpiresAt(expiresAt);
  };


  const copySyncCode = async () => {
    if (!syncCode) return;
    await navigator.clipboard.writeText(syncCode);
  };

  // Rejoindre un appareil (pairing via code)
  const handlePair = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/sync/${pairCode}`);
      const data = await res.json();

      if (!res.ok) {
        setPairStatus(`❌ ${data.error || "Erreur serveur"}`);
        return;
      }

      if (data.expiresAt < Date.now()) {
        setPairStatus("❌ Code expiré");
        return;
      }

      // fusionner les données
      await db.transaction("readwrite", db.records, db.drugs, async () => {
        for (const r of data.records || []) {
          const exists = await db.records.get(r.id);
          if (exists) {
            await db.records.update(r.id, r);
          } else {
            await db.records.add(r);
          }
        }
        for (const d of data.drugs || []) {
          const exists = await db.drugs.get(d.id);
          if (exists) {
            await db.drugs.update(d.id, d);
          } else {
            await db.drugs.add(d);
          }
        }
      });

      setPairStatus("✅ Synchronisation terminée !");
      setTimeout(() => setPairStatus(""), 5000);

      const [r, d] = await Promise.all([db.records.count(), db.drugs.count()]);
      setCounts({ records: r, drugs: d });
    } catch (err) {
      setPairStatus("❌ Erreur réseau");
    } finally {
      setBusy(false);
    }
  };




  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      alert("Fichier JSON invalide");
      return;
    }

    if (!data.records || !data.drugs) {
      alert("Fichier non reconnu");
      return;
    }

    await db.transaction("readwrite", db.records, db.drugs, async () => {
      for (const r of data.records) {
        // merge records : éviter conflit ID
        const exists = await db.records.get(r.id);
        if (exists) {
          await db.records.put({ ...r, id: undefined });
        } else {
          await db.records.add(r);
        }
      }
      for (const d of data.drugs) {
        const exists = await db.drugs.get(d.id);
        if (exists) {
          await db.drugs.put({ ...d, id: undefined });
        } else {
          await db.drugs.add(d);
        }
      }
    });

    const [r, d] = await Promise.all([
      db.records.count(),
      db.drugs.count(),
    ]);
    setCounts({ records: r, drugs: d });
    alert("Import terminé !");
  };

  const exportJSON = async () => {
    setBusy(true);
    try {
      const [records, drugs, metaAll] = await Promise.all([
        db.records.toArray(),
        db.drugs.toArray(),
        db.meta.toArray(),
      ]);
      const payload = {
        exportedAt: new Date().toISOString(),
        app: "NeuroTracker",
        version: 1,
        records,
        drugs,
        meta: metaAll,
      };
      downloadFile(
        `neurotracker_export_${nowIsoLocal()}.json`,
        "application/json",
        JSON.stringify(payload, null, 2)
      );
    } finally {
      setBusy(false);
    }
  };


  const wipeAll = async () => {
    setBusy(true);
    try {
      await db.transaction("readwrite", db.records, db.drugs, db.meta, async () => {
        await Promise.all([db.records.clear(), db.drugs.clear()]);
        await db.meta.delete("recordingState");
        await db.meta.delete("syncCode");
      });
      setSyncCode("");
      setCounts({ records: 0, drugs: 0 });
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  };


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("pair");
    if (codeParam) {
      setPairCode(codeParam.toUpperCase());
      handlePair();
    }
  }, []);



  return (
    <>
      <Head>
        <title>NeuroTracker App – Paramètres</title>
      </Head>

      <main className={styles.settingsMain}>
        <header className={styles.header}>
          <h1>Paramètres</h1>
          <p>Gérer la synchronisation et vos données locales.</p>
        </header>

        <section className={styles.card + ' ' + styles.syncCard}>
          {
            syncCode && (
              <div className={styles.qrCode}>
                <QRCodeCanvas value={`${baseUrl}/settings?pair=${syncCode}`} size={160} />
              </div>
            )
          }
          <div className={styles.contentWrap}>
            <h2>Code de synchronisation</h2>
            <p className={styles.helpText}>
              Utilisez ce code ou le QR Code pour associer un autre appareil.
              Le code est valable 1 heure.
            </p>
            {syncCode ? (
              <div className={styles.qrWrap}>
                <p className={styles.codeWrap}>
                  <code>
                    {syncCode}
                    <button className="cta" onClick={copySyncCode} disabled={busy}>
                      <i className="far fa-copy"></i>
                    </button>
                  </code>
                  <span>Temps restant : {remaining}</span>
                </p>
                <div className={styles.syncActions}>
                </div>
              </div>
            ) : (
              <div className={styles.syncRow}>
                <button className="cta" onClick={generateSyncCode} disabled={busy}>
                  Créer un code
                </button>
              </div>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <h2>Synchroniser mon appareil</h2>
          <p className={styles.helpText}>
            Entrez le code d&apos;un autre appareil ou scannez son QR Code.
          </p>
          <div className={styles.syncRow}>
            <input
              className={styles.syncInput}
              type="text"
              placeholder="Code à 8 caractères"
              value={pairCode}
              onChange={(e) => setPairCode(e.target.value.toUpperCase())}
            />
            <button className="cta" onClick={handlePair} disabled={busy}>
              Synchroniser
            </button>
          </div>
          {pairStatus && <p className={styles.helpText}>{pairStatus}</p>}
        </section>

        <section className={styles.card}>
          <h2>Importer mes données</h2>
          <p className={styles.helpText}>Réinjecter un export JSON (fusion sécurisée).</p>
          <div className={`inputFileWrap`}>
            <label htmlFor="file-upload">
              <input type="file" name="file-upload" accept="application/json" onChange={handleImport} />
              <i className="far fa-arrow-up-from-bracket"></i>
              <span>Choisir un fichier</span>
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <h2>Exporter mes données</h2>
          <p className={styles.helpText}>
            {counts.records} enregistrements, {counts.drugs} médicaments.
          </p>
          <div className={styles.actionsRow}>
            <button className="cta" onClick={exportJSON} disabled={busy}>
              <i className="far fa-arrow-down-to-line"></i> Export JSON
            </button>
          </div>
        </section>

        <section className={styles.cardDanger}>
          <h2>Effacer mes données</h2>
          <p className={styles.helpText}>
            Supprime définitivement tous vos enregistrements et la liste de médicaments.
          </p>
          <button
            className={`${styles.dangerBtn} cta secondary`}
            onClick={() => setConfirmOpen(true)}
            disabled={busy}
          >
            Effacer toutes les données
          </button>
        </section>
      </main>

      {confirmOpen && (
        <div className={styles.modalBackdrop} onClick={() => !busy && setConfirmOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer toutes vos données&nbsp;? Cette action est irréversible.</p>
            <div className={styles.modalActions}>
              <button className="cta secondary" onClick={() => setConfirmOpen(false)} disabled={busy}>
                Annuler
              </button>
              <button className="cta" onClick={wipeAll} disabled={busy}>
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
