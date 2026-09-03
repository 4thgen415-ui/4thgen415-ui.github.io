// Bump CACHE_NAME whenever the caching logic changes: old clients detect the
// new worker on their next navigation, purge stale caches, and reload.
const CACHE_NAME = 'bbm-browser-logo-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch(() => {}) // never block install on precache failures
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const oldKeys = keys.filter((k) => k !== CACHE_NAME);
    await Promise.all(oldKeys.map((k) => caches.delete(k)));
    await self.clients.claim();
    // Self-heal: if this worker replaced an older version, open tabs may be
    // showing a stale cached shell. Reload them so they fetch fresh content.
    if (oldKeys.length > 0) {
      const clientList = await self.clients.matchAll({ type: 'window' });
      await Promise.all(
        clientList.map((client) => {
          if (typeof client.navigate === 'function') {
            return client.navigate(client.url).catch(() => {});
          }
          return Promise.resolve();
        })
      );
    }
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/deckapi/') ||
    url.pathname.startsWith('/ws')
  ) {
    return;
  }

  // Network-first: the cache is only an offline fallback, never a substitute
  // for reachable content.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && (response.type === 'basic' || response.type === 'default')) {
          const clone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, clone))
            .catch(() => {});
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          const shell = await caches.match('/');
          if (shell) return shell;
        }
        return new Response('You appear to be offline. Reconnect and reload to continue.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});
