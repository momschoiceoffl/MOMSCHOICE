const CACHE_NAME = 'moms-choice-v1';
const ASSETS = [
  './',
  './index.html',
  './category.html',
  './product.html',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/js/translations.js',
  './assets/js/site-config.js',
  'https://res.cloudinary.com/ft8zlz5x/image/upload/v1793237123/moms_pick/logo/MOMS%20CHOICE.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
