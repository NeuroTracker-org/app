const CACHE_NAME = "neurotracker-cache-v1";
const OFFLINE_URL = "/offline.html";

// Liste des fichiers à mettre en cache au premier chargement
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// INSTALL → pré-cache des assets de base
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting(); // activer direct le nouveau SW
});

// ACTIVATE → on supprime les anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH → stratégie mixte (network-first pour HTML, cache-first pour les assets)
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // ⚡ Ignorer les requêtes non HTTP(S) (chrome-extension://, moz-extension://, etc.)
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  if (event.request.mode === "navigate") {
    // Pages HTML → network first, fallback offline
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    // Assets (JS, CSS, images…) → cache first
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((resp) =>
            caches.open(CACHE_NAME).then((cache) => {
              // ⚠️ éviter de mettre en cache les réponses invalides
              if (resp && resp.status === 200 && resp.type === "basic") {
                cache.put(event.request, resp.clone());
              }
              return resp;
            })
          )
        );
      })
    );
  }
});
