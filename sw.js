/* Service worker: "network-first" - uvijek pokušaj dohvatiti svježu
 * datoteku s mreže, a keš koristi samo kao rezervu kad nema interneta.
 * (Ranije je bio "cache-first", što je znalo servirati zastarjelu verziju
 * aplikacije nakon što bi se fileovi ažurirali na hostingu.)
 *
 * VAŽNO: obični fetch() i dalje poštuje preglednikov HTTP keš (Cache-Control
 * zaglavlja s hostinga) - "network-first" ovdje ne znači nužno stvaran odlazak
 * na mrežu, nego samo "prije nego posegneš za cache API-jem ovog service
 * workera, prvo probaj fetch()". Ako preglednik ima ui.js spremljen u svom
 * HTTP kešu (posebno se to znalo događati u Firefoxu - stariji fetch() zna
 * vratiti keširanu verziju bez provjere na serveru), stranica dobije zastarjelu
 * datoteku i nova funkcionalnost "ne radi" iako je gumb/HTML (koji se možda
 * ipak osvježio) prisutan. { cache: "no-store" } tjera fetch() da UVIJEK ode
 * na mrežu i zaobiđe taj HTTP keš u potpunosti - servira se samo iz
 * caches API-ja (gore) kao rezerva kad uređaj nema internet. */
"use strict";

const CACHE_NAME = "skolski-raspored-v8";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/models.js",
  "./js/storage.js",
  "./js/ui.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
