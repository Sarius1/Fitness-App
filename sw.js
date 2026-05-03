const CACHE = 'fittrack-v10';
const FILES = [
  './', './index.html', './style.css', './app.js', './icon.svg',
  './manifest.json', './model-viewer.min.js', './male_muscles_named.glb',
  './%C3%BCbungsmodelle/Abductor%20machine.gif',
  './%C3%BCbungsmodelle/Bench%20press.gif',
  './%C3%BCbungsmodelle/Lateral%20raise%20machine.gif',
  './%C3%BCbungsmodelle/Lever-Incline-Chest-Press.gif',
  './%C3%BCbungsmodelle/Lying-leg-curl-gif.gif',
  './%C3%BCbungsmodelle/Machine-Shoulder-Press.gif',
  './%C3%BCbungsmodelle/One-arm-triceps-pushdown.gif',
  './%C3%BCbungsmodelle/Preacher-Curl.gif',
  './%C3%BCbungsmodelle/Seated-Machine-Row.gif',
  './%C3%BCbungsmodelle/Tricep%20Pushdown.gif',
  './%C3%BCbungsmodelle/abs.gif',
  './%C3%BCbungsmodelle/adductors.gif',
  './%C3%BCbungsmodelle/butterfly_uebung-butterfly_maschine.gif',
  './%C3%BCbungsmodelle/hack-squat-min.gif',
  './%C3%BCbungsmodelle/lat%20pulldown.gif',
  './%C3%BCbungsmodelle/leg-extension-machine.gif',
  './%C3%BCbungsmodelle/rear%20delts.gif',
  './%C3%BCbungsmodelle/t-bar-row-machine.gif',
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
