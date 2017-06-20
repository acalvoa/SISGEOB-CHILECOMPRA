$(document).ready(function(){
	//ACA CARGAMOS TODOS LOS OBJETOS QUE NECESITAN LA CONDICION DE 
	//DOCUMENTO LISTO A NIVEL DE ARBOL DOM
	//GENERALMENTE ESTE PARAMETRO CORRESPONDE A FUNCIONES QUE OPERAN CON EL ARBOL DOM Y SELECTORES
	$.getJSON("echo.jsp",function(result){
		if(result.STATUS == "OK"){
			SOCKET.request({
				request: "formulario/servicio",
				data:{
					IP: result.REMOTEADDR
				},
				callback: function(response){
					_CONFIG._SERVICIO = {
						NOMBRE: response.SERVICIO,
						SERVICIO: response.X_SERVICIO,
						WFS: response.WFS,
						FECHA: response.FECHA
					}
					GEOCGRCHI = new CHILECOMPRA();
				}
			});
		}
		else
		{
			SOCKET.request({
				request: "formulario/servicio",
				data:{
					IP: "127.0.0.55"
				},
				callback: function(response){
					_CONFIG._SERVICIO = {
						NOMBRE: response.SERVICIO,
						SERVICIO: response.X_SERVICIO,
						WFS: response.WFS,
						FECHA: response.FECHA
					}
					GEOCGRCHI = new CHILECOMPRA();
				}
			});
		}
	});
	// GEOCGRCHI = new CHILECOMPRA();
	//INTEGRAMOS EL OBJETO GEOMAP
	MAPA = new GEOMAP({
		target: "gea",
		initLat: _CONFIG._MAP.LAT,
		initLng: _CONFIG._MAP.LNG,
		initZoom: _CONFIG._MAP.ZOOM,
		styled:true
	});
	//CARGAMOS EL POPOVER 
	POP = new POPOVER();
	
	//CARGAMOS EL APP DE ETIQUETA SUPERIOR DERECHA
	ETIPOP = new ETIQUETA({
		container: $(".etiqueta")
	});	

	// CARGAMOS EL INICIALIZADOR DE CHILECOMPRA - GEOCGR
	
});
