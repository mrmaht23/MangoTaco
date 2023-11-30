const CACHE_NAME = 'cache-v3';

self.addEventListener('install', (event) => {
    const preCache = caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll([
                'index.html',
                'service.html',
                'contact-us.html',
                'css/style.css',
                'css/bootstrap.min.css',
                'js/app.js',
                'offline.html',
                'images/offline-imagen.jpg'
            ]);
        });

    event.waitUntil(preCache);
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('Deleting old cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                console.log('No existe en cache', event.request.url);

                return fetch(event.request)
                    .then((webResponse) => {
                        return caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, webResponse.clone());
                                return webResponse;
                            });
                    });
            })
            .catch((error) => {
                console.error('Fetch error:', error);

                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/offline.html');
                }
            })
    );
});