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

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting(); // active direct
});

// ACTIVATE → on supprime seulement les vieux caches
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

// FETCH → stratégie "Network First" pour le HTML, "Cache First" pour le reste
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Navigation → network first, fallback offline
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    // Assets (JS, CSS, images…) → cache first, fallback network
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((resp) =>
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resp.clone());
              return resp;
            })
          )
        );
      })
    );
  }
});
