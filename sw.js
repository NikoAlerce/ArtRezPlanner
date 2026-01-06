
const CACHE_NAME = 'bosque-v4-fixed';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './index.tsx'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Intentamos cachear, si falla algún asset (como index.tsx en algunos entornos), no rompemos todo el SW
      return cache.addAll(ASSETS).catch(err => console.error('Error caching assets:', err));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // ESTRATEGIA CRÍTICA: Navigation Fallback
  // Si la petición es para navegar (abrir la app), devolvemos siempre index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((response) => {
        return response || fetch(event.request).catch(() => {
          // Si falla red y caché, intentar devolver el match de la raíz como último recurso
          return caches.match('./');
        });
      })
    );
    return;
  }

  // Para el resto de recursos (imágenes, scripts, estilos)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
