document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Add button to your container
    // const container = document.querySelector('.container');
    // const scanButton = document.createElement('button');
    // scanButton.className = 'btn btn-primary mb-3';
    // scanButton.textContent = 'Escanear';
    // scanButton.onclick = scanBarcode;
    // const inputCodeButton = document.createElement('button');
    // inputCodeButton.className = 'btn btn-primary mb-3';
    // inputCodeButton.textContent = 'Buscar por código';
    // inputCodeButton.onclick = showInputCode;
    // container.appendChild(scanButton);
    // container.appendChild(inputCodeButton);
}
function showInputCode(){
    var inputCodeModal = new bootstrap.Modal(document.getElementById('inputCodeModal'));
    $('#inputCodeModal').on('shown.bs.modal', function () {
        $('#inputCodeModalInput').val("")
        $('#inputCodeModalInput').trigger('focus')
      })
    inputCodeModal.show();
}

function findProductByCode(){
    let codigo = $('#inputCodeModalInput').val()
    $('#inputCodeModal').modal('hide')
    findProduct(codigo)
}

function scanBarcode() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                // document.getElementById('barcodeModal').addEventListener('hidden.bs.modal', function () {
                //     // Rescan after modal is completely hidden
                //     scanBarcode();
                // }, { once: true });
                mostrarLoader(true);
                findProduct(result.text);
            } else {
                // If scan was cancelled, show scan button again
                const scanButton = document.querySelector('.btn-primary');
                if (scanButton) scanButton.style.display = 'block';
            }
        },
        function (error) {
            alert("El escaneo falló: " + error);
            // Show scan button again after error
            const scanButton = document.querySelector('.btn-primary');
            if (scanButton) scanButton.style.display = 'block';
        },
        {
            preferFrontCamera: false,
            showFlipCameraButton: true,
            showTorchButton: true,
            torchOn: false,
            saveHistory: true,
            prompt: "Coloque un código de barras dentro del área de escaneo",
            formats: "ALL",
            orientation: "all",
            disableSuccessBeep: false,
        }
    );
}

function findProduct(code) {
    let token = localStorage.getItem('appToken');
    let URL = localStorage.getItem('appUrl');
    
    // Show Bootstrap modal
    var barcodeModal = new bootstrap.Modal(document.getElementById('barcodeModal'));
    cordova.plugin.http.post(
        URL + 'rest.php', 
        {
            token: token, 
            codebar: code 
        }, 
        { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }, 
        function(response) {
            if (response.status === 200) {
                let responseData = response.data
                responseData = JSON.parse(responseData)
                if (responseData.codigo) {
                    document.getElementById('resultAPI').textContent = '';
                    document.getElementById('modalTitle').textContent = responseData.codigo;
                    document.getElementById('nombreAPI').textContent = responseData.nombre;
                    document.getElementById('importeAPI').textContent = responseData.moneda + responseData.importe;
                    if(responseData.venta){
                        document.getElementById('ventaAPI').textContent = 'VENTA: ' + responseData.venta;
                    } else {
                        document.getElementById('ventaAPI').textContent = '';
                    }
                    if(responseData.descuento){
                        document.getElementById('descuentoAPI').textContent = 'DESCUENTO: ' + responseData.descuento;
                    } else {
                        document.getElementById('descuentoAPI').textContent = ''
                    }
                    if(responseData.bonifica){
                        document.getElementById('bonificaAPI').textContent = 'BONIFICA: ' + responseData.bonifica;
                    } else {
                        document.getElementById('bonificaAPI').textContent = ''
                    }
                } else if (responseData.error) {
                    // Handle error response
                    document.getElementById('modalTitle').textContent = code;
                    document.getElementById('resultAPI').textContent = 'PRODUCTO NO ENCONTRADO'
                    document.getElementById('codigoAPI').textContent = ''
                    document.getElementById('nombreAPI').textContent = ''
                    document.getElementById('importeAPI').textContent = ''
                    document.getElementById('ventaAPI').textContent = ''
                    document.getElementById('descuentoAPI').textContent = ''
                    document.getElementById('bonificaAPI').textContent = ''
                    // alert('Error: ' + responseData.error);
                }
                barcodeModal.show();
            } else {
                // HTTP error
                document.getElementById('resultAPI').textContent = 'ERROR DE SERVIDOR';
                // alert('Error de servidor: ' + response.status);
                barcodeModal.show();
            }
            mostrarLoader(false);
        },
        function(error) {
            mostrarLoader(false);
            // Detailed error logging
            console.error('Complete Error Object:', error);
            console.error('Error Status:', error.status);
            console.error('Error Error:', error.error);
            console.error('Error Exception:', error.exception);

            document.getElementById('resultAPI').textContent = 'ERROR DESCONOCIDO';
            barcodeModal.show();
            // alert('Error Detallado: ' + JSON.stringify(error));
        }
    );
}