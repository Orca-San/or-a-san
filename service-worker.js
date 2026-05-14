const CACHE_NAME = "orcasan-cache-v25";
const INDEX_URL = "./index.html";
const APP_ASSETS = [
  "./",
  INDEX_URL,
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/orcasan-icon.svg",
  "./icons/orcasan-icon-192.png",
  "./icons/orcasan-icon-512.png",
];

function offlineFallback() {
  return new Response(
    `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OrçaSan offline</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f7f7;color:#182323;font-family:Arial,sans-serif}
      main{max-width:520px;padding:28px;border:1px solid #dbe5e3;border-radius:8px;background:#fff}
      strong{display:block;margin-bottom:8px;font-size:22px}
      p{margin:0;color:#60706f;line-height:1.5}
    </style>
  </head>
  <body>
    <main>
      <strong>OrçaSan indisponível</strong>
      <p>Abra o app novamente com internet ou com o servidor local ligado para atualizar os arquivos.</p>
    </main>
  </body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(INDEX_URL, responseClone));
          return response;
        })
        .catch(async () => (await caches.match(INDEX_URL)) || (await caches.match("./")) || offlineFallback()),
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => cachedResponse || caches.match("./index.html")),
      ),
  );
});
