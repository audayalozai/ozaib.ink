const CACHE_NAME = "ozaib-ink-v1";
const STATIC_CACHE = "ozaib-static-v1";
const DYNAMIC_CACHE = "ozaib-dynamic-v1";

// Resources to cache on install
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo.svg",
  "/feed.xml",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Helper: determine if request should be cached
function shouldCache(request) {
  const url = new URL(request.url);

  // Don't cache admin/api requests
  if (url.pathname.startsWith("/api/admin")) return false;
  if (url.pathname.startsWith("/api/")) return false;

  // Don't cache POST/PUT/DELETE
  if (request.method !== "GET") return false;

  // Cache same-origin requests
  if (url.origin === self.location.origin) return true;

  // Cache external images (cover images, etc.)
  if (request.destination === "image") return true;

  // Cache fonts
  if (request.destination === "font") return true;

  return false;
}

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  if (!shouldCache(event.request)) return;

  // Network-first for HTML (always get latest), cache-first for assets
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Offline - try cache
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            // Fall back to home page
            return caches.match("/");
          });
        })
    );
    return;
  }

  // Cache-first for assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Update cache in background
        fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
          })
          .catch(() => {});
        return cached;
      }

      // Not in cache - fetch and cache
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) return response;

          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // Return placeholder for failed image requests
          if (event.request.destination === "image") {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#f5f5f5" width="100%" height="100%"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="sans-serif">لا توجد صورة</text></svg>',
              { headers: { "Content-Type": "image/svg+xml" } }
            );
          }
        });
    })
  );
});

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Allow manual cache clear
self.addEventListener("message", (event) => {
  if (event.data === "CLEAR_CACHE") {
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    );
  }
});
