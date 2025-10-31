import { useEffect, useState, useRef } from "react";
import styles from "./InstallPWAButton.module.css";

export default function InstallPWAButton({ onInstallableChange }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);
  const [toast, setToast] = useState(false);

  // Detect installed
  const [isInstalled, setIsInstalled] = useState(false);

  // iOS modal & slider
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);
  const [isIosNeedsGuide, setIsIosNeedsGuide] = useState(false);
  const [slide, setSlide] = useState(0);
  const sliderRef = useRef(null);

  const screenshots = [
    "/ios/ios-safari-tutoriel-01.png",
    "/ios/ios-safari-tutoriel-02.png",
    "/ios/ios-safari-tutoriel-03.png",
  ];

  // ✅ Detect if already installed (Android & iOS)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (standalone) {
      setIsInstalled(true);
    }
  }, []);

  // --- iOS detection (CLIENT ONLY) ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isIos && !isInStandaloneMode) {
      setIsIosNeedsGuide(true);
    }
  }, []);

  // --- Android / Chrome install ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
      onInstallableChange?.(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      setInstallable(false);
      onInstallableChange?.(false);
      setIsInstalled(true); // ✅ Update here too
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
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setInstallable(false);
    onInstallableChange?.(false);
  };

  // --- Slider navigation ---
  const goToSlide = (i) => setSlide(Math.max(0, Math.min(i, screenshots.length - 1)));
  const nextSlide = () => goToSlide(slide + 1);
  const prevSlide = () => goToSlide(slide - 1);

  let startX = 0;
  const onTouchStart = (e) => (startX = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) prevSlide();
    if (diff < -50) nextSlide();
  };

  // ✅ already installed = do not show anything
  if (isInstalled) return null;

  // --- UI ---

  // ANDROID/CHROME INSTALL
  if (installable && !isIosNeedsGuide) {
    return (
      <>
        <button className={styles.button} onClick={handleInstall}>
          <i className="fas fa-arrow-down"></i> Installer l’App
        </button>

        {toast && <div className={styles.toast}>App installée avec succès ✅</div>}
      </>
    );
  }

  // iOS BUTTON + MODAL
  if (isIosNeedsGuide) {
    return (
      <>
        <button className={styles.button} onClick={() => setIsIosModalOpen(true)}>
          Installer l’App
        </button>

        {isIosModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div
                className={styles.slider}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                ref={sliderRef}
                style={{ transform: `translateX(-${slide * 100}%)` }}
              >
                {screenshots.map((src, i) => (
                  <div className={styles.slide} key={i}>
                    <img src={src} alt={`Tutoriel ${i + 1}`} />
                  </div>
                ))}
              </div>

              <button className={styles.closeBtn} onClick={() => setIsIosModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>

              <div className={styles.nav}>
                <button onClick={prevSlide} disabled={slide === 0}>
                  <i className="fas fa-arrow-left"></i>
                </button>
                <div className={styles.dots}>
                  {screenshots.map((_, i) => (
                    <span
                      key={i}
                      className={i === slide ? styles.activeDot : styles.dot}
                      onClick={() => goToSlide(i)}
                    ></span>
                  ))}
                </div>
                <button onClick={nextSlide} disabled={slide === screenshots.length - 1}>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
