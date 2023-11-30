const CACHE_NAME = 'cache-v1';

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
                'offline.html'
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


    self.addEventListener("DOMContentLoaded", function() {
        var request = indexedDB.open("miBaseDeDatos", 1);

        request.onupgradeneeded = function(event) {
            var db = event.target.result;
            db.createObjectStore("login", { keyPath: "email" });
            db.createObjectStore("register", { keyPath: "email" });
        };

        request.onsuccess = function(event) {
            var db = event.target.result;

            var loginForm = document.getElementById("formLogin");
            loginForm.addEventListener("submit", function(event) {
                event.preventDefault();
                
                var email = document.getElementById("InputEmail").value;
                var password = document.getElementById("InputPassword").value;

                var transaction = db.transaction("login", "readwrite");
                var store = transaction.objectStore("login");

                store.put({ email: email, password: password });

                loginForm.reset();
            });

            var registerForm = document.getElementById("formRegister");
            registerForm.addEventListener("submit", function(event) {
                event.preventDefault();

                var name = document.getElementById("InputName").value;
                var lastname = document.getElementById("InputLastname").value;
                var email = document.getElementById("InputEmail1").value;
                var password = document.getElementById("InputPassword1").value;

                var transaction = db.transaction("register", "readwrite");
                var store = transaction.objectStore("register");

                store.put({ name: name, lastname: lastname, email: email, password: password });

                registerForm.reset();
            });
        };

        request.onerror = function(event) {
            console.error("Error al abrir la base de datos:", event.target.error);
        };
    });