self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('static-cache-v1')
            .then(function(cache) {
                return cache.addAll([
                    '.',
                    'index.html',
                    'data.json',
                    'css/bootstrap.css',
                    'css/main.css',
                    'js/bootstrap.js',
                    'js/main.js',
                    'img/sprite.svg',
                    'favicon.ico',
                    'https://www.gravatar.com/avatar/b622337c5e7dae53b97a36bf3c697063?s=200',
                    'https://fonts.googleapis.com/css?family=Rubik:300,400,500&display=swap',
                    'https://fonts.gstatic.com/s/rubik/v9/iJWHBXyIfDnIV7Fqj2md8WD07oB-.woff2',
                    'https://fonts.gstatic.com/s/rubik/v9/iJWKBXyIfDnIV7nBrXyw023e.woff2',
                    'https://cdn.curator.io/published/fa18d8c4-2ff9-453e-85c0-7b15c4a60733.js',
                ]);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});