let PASS_1 = ""
let TOKEN_1 = ""
let URL_1 = ""
let PASS_2 = ""
let TOKEN_2 = ""
let URL_2 = ""

let isConfigLoaded = false;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    fetch('config.json')
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar la configuración');
        return response.json();
      })
      .then(config => {
        PASS_1 = config.PASS_1;
        TOKEN_1 = config.TOKEN_1;
        URL_1 = config.URL_1;
        PASS_2 = config.PASS_2;
        TOKEN_2 = config.TOKEN_2;
        URL_2 = config.URL_2;
        isConfigLoaded = true;
      })
      .catch(error => {
        console.error('Error al cargar la configuración:', error);
        alert('No se pudo cargar la configuración. La aplicación no puede continuar.');
      });

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

$(document).ready(function() {
    console.log("Ready!!!")    
});
function sendPass() {  
    
    if (!isConfigLoaded) {
        alert('La configuración aún no está cargada. Intente de nuevo más tarde.');
        return;
    }

    let password = $('#password').val();     
    if (!password) {
        alert('Ingrese la contraseña por favor');         
        return;     
    }      
    let TOKEN = "";     
    let URL = "";     
    
    switch (password) {
        case PASS_1:
            TOKEN = TOKEN_1
            URL = URL_1
            break;
        case PASS_2:
            TOKEN = TOKEN_2
            URL = URL_2
            break;
        default:
            alert('Contraseña invalida');  
            return;       
            break;
    }
    mostrarLoader(true)
    // Use Cordova HTTP plugin
    cordova.plugin.http.post(
        URL + 'loginrest.php', 
        {
            token: TOKEN, 
            password: password 
        }, 
        { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN
        }, 
        function(response) {
            mostrarLoader(false)
            // Success
            // console.log('Full Response:', response);
            // alert('Éxito: ' + JSON.stringify(response) + "---------" + JSON.stringify(response.data));
            // Check for successful status
            if (response.status === 200 && JSON.parse(response.data).resultado == "OK" ) {
                // Navigate to new page
                localStorage.setItem('appToken', TOKEN);
                localStorage.setItem('appUrl', URL);
                window.location.href = 'home.html';
            } else {
                alert('Inicio de sesión fallido');
            }
        }, 
        function(error) {
            mostrarLoader(false)
            // Detailed error logging
            console.error('Complete Error Object:', error);
            console.error('Error Status:', error.status);
            console.error('Error Error:', error.error);
            console.error('Error Exception:', error.exception);
            alert('Error Detallado: ' + JSON.stringify(error));
        }
    );
}
