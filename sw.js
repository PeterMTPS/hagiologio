// Service worker do Hagiológio: deixa o site instalável e funcionando sem internet.
// Página e dados: rede primeiro, cópia guardada se estiver offline.
// Retratos, fontes e o resto: cópia guardada na hora, atualizada em segundo plano.
// A música não é guardada (são arquivos grandes, tocados por streaming).
const VERSION = "v1";
const CORE = `hagio-core-${VERSION}`;
const DATA = "hagio-data";
const STATIC = "hagio-static";
const PRECACHE = [
  "./",
  "manifest.webmanifest",
  "data/index.json",
  "logo/simbolo-96.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CORE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  const keep = [CORE, DATA, STATIC];
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(req, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(fallbackUrl || req, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(fallbackUrl || req)) || (await caches.match(fallbackUrl || req));
    if (hit) return hit;
    throw err;
  }
}

async function staleWhileRevalidate(req, cacheName, event) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const update = fetch(req).then((res) => {
    if (res.ok || res.type === "opaque") cache.put(req, res.clone());
    return res;
  });
  if (hit) {
    event.waitUntil(update.catch(() => {}));
    return hit;
  }
  return update;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (url.pathname.endsWith(".mp3")) return;
    if (req.mode === "navigate") {
      e.respondWith(networkFirst(req, CORE, new URL("./", self.registration.scope).href));
      return;
    }
    if (url.pathname.includes("/data/")) {
      e.respondWith(networkFirst(req, url.pathname.endsWith("/data/index.json") ? CORE : DATA));
      return;
    }
    e.respondWith(staleWhileRevalidate(req, STATIC, e));
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(staleWhileRevalidate(req, STATIC, e));
  }
});
