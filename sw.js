const CACHE = 'fittrack-v11';
const FILES = [
  './', './index.html', './style.css', './app.js', './icon.svg',
  './manifest.json', './model-viewer.min.js', './male_muscles_named.glb',
  './gifs/Abductor-machine.gif',
  './gifs/Bench-press.gif',
  './gifs/Lateral-raise-machine.gif',
  './gifs/Lever-Incline-Chest-Press.gif',
  './gifs/Lying-leg-curl-gif.gif',
  './gifs/Machine-Shoulder-Press.gif',
  './gifs/One-arm-triceps-pushdown.gif',
  './gifs/Preacher-Curl.gif',
  './gifs/Seated-Machine-Row.gif',
  './gifs/Tricep-Pushdown.gif',
  './gifs/abs.gif',
  './gifs/adductors.gif',
  './gifs/butterfly_uebung-butterfly_maschine.gif',
  './gifs/hack-squat-min.gif',
  './gifs/lat-pulldown.gif',
  './gifs/leg-extension-machine.gif',
  './gifs/rear-delts.gif',
  './gifs/t-bar-row-machine.gif',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
