import { useEffect, useState } from "react";

import "@/styles/reset.css";
import "@/styles/akrobat.css";
import "@/styles/globals.css";

import Toast from "@/components/Toast/Toast";

import AuthProvider from "@/context/AuthContext";
import Layout from "@/components/Layout/Layout";

export default function MyApp({ Component, pageProps }) {

  const [toast, setToast] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => console.log("✅ Service Worker enregistré"))
          .catch((err) => console.error("SW erreur", err));
      });
    }

    window.addEventListener("appinstalled", () => {
      console.log("✅ PWA installée");
      setToast(true);
    });
  }, []);

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toast
        message="App installée avec succès ✅"
        open={toast}
        onClose={() => setToast(false)}
      />
    </AuthProvider>
  );
}
