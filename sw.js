
const CACHE_NAME = 'bosque-v6-clean';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Instalación: Cachear solo lo esencial (Shell)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Cacheando shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activación: Borrar CUALQUIER caché antiguo para arreglar el error 404
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('SW: Borrando caché viejo', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Fetch: Estrategia Network First (Red primero, luego caché)
// Esto evita que sirvamos archivos viejos o rotos
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  // Si es una navegación (abrir la app), intentar red, si falla, ir a index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // Para assets (JS, CSS, Imágenes), intentar red primero
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la red responde bien, guardamos una copia fresca en caché dinámico
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si no hay internet, devolvemos lo que haya en caché
        return caches.match(event.request);
      })
  );
});
