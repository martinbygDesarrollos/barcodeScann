const PASS_1 = "kano"
// PASS_2=ori
// PASS_3=test

const TOKEN_1 = "3EeBg0D6h592AgFCkF8E1sE915"
// TOKEN_2=Orion0D6h592AgFCkF8E1sE915
// TOKEN_3=3EeBg0D6h592AgFCkF8E1sE915

const URL_1 = "http://dk.gargano.com.uy/ventas/"
// URL_2=http://orion.zapto.org/ventas/
// URL_3=http://dk.gargano.com.uy/ventas/

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

$(document).ready(function() {
    console.log("Ready!!!")    
});
function sendPass() {     
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
