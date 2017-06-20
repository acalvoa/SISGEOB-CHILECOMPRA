(function($){
//DEFINIMOS LA PLANTILLA BASE DE LOS SCRIPT
//ESTA ES UNA PLANTILLA A MODO DE EJEMPLO Y PUEDE SER USADA PARA HACER
//MAS PLUGINS PARA GEOCGR. SE RECOMIENDA SEGUIR LA ESTRUCTURA DE CLASES Y ENCAPSULADOS
$.geomap = function(opt){
	//LAS VARIABLES DEFAULT REEMPLAZAN A LAS SETTINGS CUANDO ESTAS NO SON ENTREGADAS 
	//COMO PARAMETRO DE INICIALIZACION
	//DEFINIMOS LAS VARIABLES DEFAULT
	var defaults = {
		target: null,
		libname: "geomap"
	};
	//DEFINIMOS LAS SETTINGS
	var settings = {
	};
	//DEFINIMOS LOS METODOS PRIVADOS Y EL CONSTRUCTOR EN ESTA AREA OBJETO
	var methods = {
		constructor: function(opt){
			settings = $.extend({}, defaults, opt);
			//INSTANCIAMOS EL MAPA
			methods.make_map();
			methods.add_css_sheet();
		},
		make_map: function(){
			//CREAMOS LA INSTANCIA DEL MAPA SOBRE UN DIV VALIDO
			if(settings.target != null)
			{
				// MAP OPTIONS//
				var mapOptions = {
					center: new google.maps.LatLng(settings.initLat, settings.initLng),
		          	zoom: 14,
		          	mapTypeId: google.maps.MapTypeId.ROADMAP
				}
				////////////////
				settings.mapObj = new google.maps.Map(document.getElementById(settings.target), mapOptions);
			}
			else
			{
				console.log("Se debe especificar una capa HTML para poder inicializar un mapa.")
			}
		},
		add_css_sheet: function(){
			$("script").each(function(key,value){
				if($(value).attr('src').search(settings.libname) != -1){
					var cssSheet = '<link rel="stylesheet" href="'+$(value).attr('src').replace(".js", ".css")+'">';
					$("head").append(cssSheet);
				}
			});
		}
		
	};
	//DEFINIMOS LOS METODOS PUBLICOS
	this.publics = {
	};
	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(opt);
}
}(jQuery));