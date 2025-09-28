// lib/isMobile.js
import { useEffect, useState } from "react";

export function useIsMobileDevice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      const byUserAgent =
        typeof navigator !== "undefined" &&
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const byScreen =
        typeof window !== "undefined" &&
        window.innerWidth <= 940; // breakpoint mobile

      return byUserAgent || byScreen;
    }

    function update() {
      setIsMobile(checkMobile());
    }

    update(); // première exécution
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return isMobile;
}
