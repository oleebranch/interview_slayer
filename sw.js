// ---- Interview Slayer PWA ----
const VERSION = 'v1.0.0';
const CACHE_NAME = `islayer-${VERSION}`;

// Works on localhost (/) AND GitHub Pages (/interview_slayer/)
const BASE = self.registration.scope.replace(self.location.origin, '') || '/';

const PRECACHE = [
  `${BASE}`,
  `${BASE}index.html`,
  `${BASE}offline.html`,
  `${BASE}style.css`,
  `${BASE}script.js`,
  `${BASE}boss.html`,
  `${BASE}solo.html`,
  `${BASE}timed.html`,
  `${BASE}flashcard_pm.html`,
  `${BASE}flashcard_genai.html`,
  `${BASE}quiz_pm.html`,
  `${BASE}quiz_genai.html`,
  `${BASE}boss.json`,
  `${BASE}icons/icon-192.png`,
  `${BASE}icons/icon-512.png`,
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null))))
      .then(() => self.clients.claim())
  );
});

// Stale‑while‑revalidate for static assets; offline fallback for navigations
self.addEventListener('fetch', (evt) => {
  const req = evt.request;

  // HTML navigations: try network, else offline page
  if (req.mode === 'navigate') {
    evt.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.match(`${BASE}offline.html`);
      })
    );
    return;
  }

  // Others: SWR
  evt.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    const network = fetch(req).then((res) => {
      // Only cache successful, same‑origin GETs
      if (res && res.status === 200 && req.method === 'GET' && new URL(req.url).origin === location.origin) {
        cache.put(req, res.clone());
      }
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
