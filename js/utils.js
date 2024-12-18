function mostrarLoader(valor){
	if(valor){
		console.log('MOSTRAR LOADER')
		$('.loaderContainer').css('display', 'flex')
	} else {
		console.log('ESCONDER LOADER')
		$('.loaderContainer').css('display', 'none')
	}
}