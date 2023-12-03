//obtenemos la url del servidor
var url=window.location.href;
//definimos que nuestro sw.js se encuentra en el repositorio
var ubicacionSw='/MangoTaco/sw.js';
if ( navigator.serviceWorker ) {
/*Para que nuestro proyecto siga funcionando en localhost
como en el servidor realizaremos una validación si la url
contiene localhost la ruta es la local del proyecto, de lo contrario
es la ruta de nuestro repositorio*/
if(url.includes('localhost')){
ubicacionSw='/sw.js';
}
navigator.serviceWorker.register(ubicacionSw);
}

document.addEventListener('DOMContentLoaded', function() {
    const formRegister = document.getElementById('formRegister');
  
    formRegister.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = {
        nombre: document.getElementById('InputName').value,
        apellido: document.getElementById('InputLastname').value,
        email: document.getElementById('InputEmail1').value,
        password: document.getElementById('InputPassword1').value
      };
  
      // Llama a la función que almacena los datos en IndexedDB
      almacenarDatosEnIndexedDB(formData);
    });
  });

  document.addEventListener('DOMContentLoaded', function(){
    const formContact = document.getElementById('contactForm');

    formRegister.addEventListener('submit', function(event){
      event.preventDefault();

      const formContact = {
        nombre: document.getElementById('name').value,
        correo: document.getElementById('email').value,
        asunto: document.getElementById('subject').value,
        mensaje: document.getElementById('message').value
      };

      almacenarDatosEnIndexedDB(formContact);
    });
  });