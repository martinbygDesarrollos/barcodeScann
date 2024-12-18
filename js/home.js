document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // var token = localStorage.getItem('appToken');
    // if (token) {
    //     // Use the token as needed
    //     // console.log('Token retrieved:', token);
    // }
    // Scan when device is ready
    scanBarcode();
}

function scanBarcode() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                // Update modal content
                document.getElementById('barcodeResult').textContent = 'Código: ' + result.text;
                document.getElementById('barcodeFormat').textContent = 'Formato: ' + result.format;
                
                // Show Bootstrap modal
                // var barcodeModal = new bootstrap.Modal(document.getElementById('barcodeModal'));
                // barcodeModal.show();

                // Add event listener to rescan after modal is closed
                document.getElementById('barcodeModal').addEventListener('hidden.bs.modal', function () {
                    // Rescan after modal is completely hidden
                    scanBarcode();
                }, { once: true });
                mostrarLoader(true)
                findProduct(result.text);
            } else {
                // If scan was cancelled, scan again
                scanBarcode();
            }
        },
        function (error) {
            alert("El escaneo falló: " + error);
            // Continue scanning even after an error
            scanBarcode();
        },
        {
            preferFrontCamera: false,
            showFlipCameraButton: false,
            showTorchButton: true,
            torchOn: false,
            saveHistory: true,
            prompt: "Coloque un código de barras dentro del área de escaneo",
            formats: "QR_CODE,PDF_417,CODE_39,CODE_128,EAN_8,EAN_13",
            orientation: "portrait",
            disableSuccessBeep: false
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
                // Parse the response data
                // let responseData = JSON.parse(response.data);
                let responseData = fixCorruptedJson(response.data);
                // alert('Éxito: '+ responseData);
                responseData = JSON.parse(responseData)
                if (responseData.codigo) {
                    document.getElementById('resultAPI').textContent = 'RESULTADO: PRODUCTO ENCONTRADO';
                    document.getElementById('codigoAPI').textContent = 'CODIGO: ' + code;
                    document.getElementById('nombreAPI').textContent = 'PRODUCTO: ' + responseData.nombre;
                    document.getElementById('importeAPI').textContent = 'IMPORTE: ' + responseData.moneda + responseData.importe;
                    document.getElementById('ventaAPI').textContent = 'VENTA: ' + responseData.venta;
                    document.getElementById('descuentoAPI').textContent = 'DESCUENTO: ' + responseData.descuento;
                    document.getElementById('bonificaAPI').textContent = 'BONIFICA: ' + responseData.bonifica;
                    // alert('EXITO: ' + responseData.nombre);
                    // Additional details if available
                    // let details = Object.entries(responseData)
                    //     .map(([key, value]) => `${key}: ${value}`)
                    //     .join('\n');
                    
                    // alert('Producto Encontrado:\n' + details);
                } else if (responseData.error) {
                    // Handle error response
                    document.getElementById('resultAPI').textContent = 'RESULTADO: NO ENCONTRADO'
                    document.getElementById('codigoAPI').textContent = 'CODIGO:' + code
                    document.getElementById('nombreAPI').textContent = 'PRODUCTO: -'
                    document.getElementById('importeAPI').textContent = 'IMPORTE: -'
                    document.getElementById('ventaAPI').textContent = 'VENTA:'
                    document.getElementById('descuentoAPI').textContent = 'DESCUENTO:'
                    document.getElementById('bonificaAPI').textContent = 'BONIFICA:'
                    // alert('Error: ' + responseData.error);
                }
                barcodeModal.show();
            } else {
                // HTTP error
                document.getElementById('resultAPI').textContent = 'RESULTADO: ERROR DE SERVIDOR';
                // alert('Error de servidor: ' + response.status);
                barcodeModal.show();
            }
        },
        function(error) {
            // Detailed error logging
            console.error('Complete Error Object:', error);
            console.error('Error Status:', error.status);
            console.error('Error Error:', error.error);
            console.error('Error Exception:', error.exception);

            document.getElementById('resultAPI').textContent = 'RESULTADO: ERROR DESCONOCIDO';
            barcodeModal.show();

            alert('Error Detallado: ' + JSON.stringify(error));
        }
    );
}

function fixCorruptedJson(jsonString) {
    // Replace importe values that are split across lines with comma
    return jsonString.replace(/"importe":\s*(\d+),\s*(\d+\.\d+)/g, (match, part1, part2) => {
        return `"importe": ${part1}${part2}`;
    });
}