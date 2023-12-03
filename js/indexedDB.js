const dbName = 'BDRegistro';
const dbVersion = 1;

function iniciarIndexedDB() {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;

        // Crea un almacén de objetos para almacenar los datos del formulario
        const objectStore = db.createObjectStore('RegistroUsuarios', { keyPath: 'id', autoIncrement: true });

        // Define los índices si es necesario
        // objectStore.createIndex('nombreIndex', 'nombre', { unique: false });
    };

    request.onerror = function(event) {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
}

function almacenarDatosEnIndexedDB(formData) {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function(event) {
        const db = event.target.result;

        // Inicia una transacción y obtén el almacén de objetos
        const transaction = db.transaction(['RegistroUsuarios'], 'readwrite');
        const objectStore = transaction.objectStore('RegistroUsuarios');

        // Añade los datos del formulario al almacén de objetos
        const agregarDatos = objectStore.add(formData);

        agregarDatos.onsuccess = function() {
            console.log('Datos del formulario almacenados con éxito en IndexedDB.');
        };

        agregarDatos.onerror = function() {
            console.error('Error al almacenar los datos del formulario en IndexedDB.');
        };

        // Cierra la transacción
        transaction.oncomplete = function() {
            db.close();
        };
    };

    request.onerror = function(event) {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
};



var db;
var request = indexedDB.open('miBaseDeDatos', 1);

// Manejador de actualización de la base de datos
request.onupgradeneeded = function(event) {
    db = event.target.result;

    // Crea un objeto de almacén de datos si no existe
    if (!db.objectStoreNames.contains('contactos')) {
        var store = db.createObjectStore('contactos', { keyPath: 'id', autoIncrement: true });
        store.createIndex('nombre', 'nombre', { unique: false });
        store.createIndex('correo', 'correo', { unique: false });
        store.createIndex('asunto', 'asunto', { unique: false });
        store.createIndex('mensaje', 'mensaje', { unique: false });
    }
};

// Manejador de éxito al abrir la base de datos
request.onsuccess = function(event) {
    db = event.target.result;
};

// Manejador de errores
request.onerror = function(event) {
    console.log('Error al abrir la base de datos', event.target.error);
};

// Iniciar IndexedDB cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    iniciarIndexedDB();
});