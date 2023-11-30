const CACHE_NAME = 'cache-v1';
const CACHE_DINAMICO = 'cachedin-v1';
const CACHE_ESTATICO = 'cacheest-v1';
const CACHE_INMUTABLE = 'cachein-v1';

self.addEventListener('install', (event) => {
    const preCache = caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll([
                'index.html',
                'service.html',
                'contact-us.html',
                'js/app.js',
                'offline.html',
                'images/offline-imagen.jpg'
            ]);
        });

        const cacheInmutable = caches.open(CACHE_INMUTABLE)
            .then(cache=>{
                cache.addAll([
                    'css/syle.css',
                    'css/bootstrap.min.css',
            ]);
            });
//Indicamos que la instalación espere hasta que las promesas se cumplan
    event.waitUntil(preCache, cacheInmutable);
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
                        // Si la solicitud es para una página HTML y estamos offline, redirigir a offline.html
                        if (event.request.headers.get('accept').includes('text/html') && !navigator.onLine) {
                            return caches.match('offline.html');
                        }
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
                    // Manejar la solicitud de la página HTML cuando hay un error de red
                    return caches.match('offline.html');
                }
            })
    );
});