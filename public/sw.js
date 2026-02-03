// Service worker minimal — évite le 404 si le navigateur ou un outil demande sw.js
// Pas d'offline / cache pour cette démo.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
