import { useEffect, useState } from "react";
import styles from "./InstallPWAButton.module.css";

export default function InstallPWAButton({ onInstallableChange }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
      onInstallableChange?.(true); // 🔔 on prévient le parent
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      setInstallable(false);
      onInstallableChange?.(false); // 🔔 plus besoin du bouton
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [onInstallableChange]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ PWA installée");
    } else {
      console.log("❌ Installation refusée");
    }

    setDeferredPrompt(null);
    setInstallable(false);
    onInstallableChange?.(false); // on prévient le parent
  };

  if (!installable) return null;

  return (
    <>
      <button className={styles.button} onClick={handleInstall}>
        <i className="fas fa-arrow-down-to-line"></i> Installer l’App
      </button>

      {toast && (
        <div className={styles.toast}>App installée avec succès ✅</div>
      )}
    </>
  );
}
