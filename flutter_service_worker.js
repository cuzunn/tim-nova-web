// Kendini imha eden service worker.
// ----------------------------------------------------------------------------
// Uygulama artik service worker KULLANMIYOR (--pwa-strategy=none). Ancak daha
// once siteyi acmis kullanicilarin cihazinda ESKI Flutter service worker'i
// kayitli kalmis olabilir; bu da eski (onbellekteki) surumu gostermeye devam
// eder. Tarayici, kayitli service worker dosyasini periyodik gunceller; bu yeni
// icerigi gorunce asagidaki kod calisir: tum onbellekleri siler, kendini
// kayittan dusurur ve acik sekmeleri tazeler. Sonuc: kullanici hicbir sey
// yapmadan guncel surume gecer ve bir daha onbelleğe takilmaz.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {}
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      try { client.navigate(client.url); } catch (e) {}
    }
  })());
});

// Hicbir istegi onbellekten karsilamayiz; her sey aga gider (taze icerik).
self.addEventListener('fetch', (event) => {});
