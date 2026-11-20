// Guarda la app para que abra al instante y sin señal; siempre intenta traer la versión nueva.
const CACHE = 'cierre-caja-v5';
const ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icons/logo.png', 'icons/robot.png', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS.map(u => new Request(u, { cache: 'reload' }))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // los envíos van directo, sin caché
  // Siempre a la red y sin la memoria del navegador: así un cambio de diseño se ve de inmediato.
  e.respondWith(fetch(e.request.url, { cache: 'no-store' }).then(r => { if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); } return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
