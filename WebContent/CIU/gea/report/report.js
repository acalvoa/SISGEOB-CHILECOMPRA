(function($){
//DEFINIMOS LA PLANTILLA BASE DE LOS SCRIPT
REPORT = function(opt, handler){
	var that = this;
	//LAS VARIABLES DEFAULT REEMPLAZAN A LAS SETTINGS CUANDO ESTAS NO SON ENTREGADAS 
	//COMO PARAMETRO DE INICIALIZACION
	//DEFINIMOS LAS VARIABLES DEFAULT
	var defaults = {
		target: null,
		map: null,
		initZoom:4,
		poligonos: [],
		callback: null
	};
	//DEFINIMOS LAS SETTINGS
	var settings = {
	};
	//DEFINIMOS LOS METODOS PRIVADOS Y EL CONSTRUCTOR EN ESTA AREA OBJETO
	var methods = {
		constructor: function(opt, handler){
			settings = $.extend({}, defaults, opt);
			//INSTANCIAMOS EL MAPA
			//that.utils.add_css_sheet(settings.libname);
			//COMPROBAMOS LA VERSION
			methods.make_map();
		},
		//METODO PARA CARGAR EL MAPA
		make_map: function(options){
			//CREAMOS LA INSTANCIA DEL MAPA SOBRE UN DIV VALIDO
			if(settings.target != null)
			{
				// MAP OPTIONS//
				var mapOptions = {
					center: new google.maps.LatLng(settings.initLat, settings.initLng),
		          	zoom: settings.initZoom,
		          	maxZoom: settings.maxZoom,
		          	minZoom: settings.minZoom,
		          	disableDefaultUI: true,
		          	mapTypeControl:false,
		          	draggable:true,
		          	disableDoubleClickZoom: true,
		          	scrollwheel: true
				}
				////////////////
				// COMPROBAMOS SI TIENE UN ESTILO DEFINIDO
				if(settings.styled){
					// LLAMAMOS EL STYLE DEFINIDO Y LO APLICAMOS
					$.getJSON( "CIU/gea/geomap/style.jsp",{}, function(data){
						settings.stylemap = data;
						mapOptions.mapTypeControlOptions = {
							mapTypeIds: [ 'Styled']
						};
						mapOptions.mapTypeId = 'Styled';
						settings.map = new google.maps.Map(document.getElementById(settings.target), mapOptions);
						var styledMapType = new google.maps.StyledMapType(data, { name: 'Styled' });
						settings.map.mapTypes.set('Styled', styledMapType);
						google.maps.event.addListenerOnce(settings.map, 'idle', function(){
						    if(settings.callback != null) settings.callback();
						});

					});
				}
				// EN CASO CONTRARIO
				else
				{
					////////////////
					settings.map = new google.maps.Map(document.getElementById(settings.target), mapOptions);
					google.maps.event.addListenerOnce(settings.map, 'idle', function(){
					    if(settings.callback != null) settings.callback();
					});
				}
			}
			else
			{
				console.log("Se debe especificar una capa HTML para poder inicializar un mapa.")
			}
		}
	};
	//DEFINIMOS LOS METODOS PUBLICOS
	this.PUB = {
		load_marker: function(lat, lng, options){
			var markerOption = {
				position: that.PUB.getLatLng(lat,lng),
				map: settings.map,
				uicon: options.icon
			};
			markerOption = $.extend({}, markerOption, options);
			var marker = new google.maps.Marker(markerOption);
		},
		load_polygon: function(poli, obj){
			if(typeof obj == "undefined") obj = {};
			var poligon = new google.maps.Polygon({
			    paths: poli,
			    strokeColor: (typeof obj.bordecolor != "undefined")? obj.bordecolor :"#333333",
			    strokeOpacity: (typeof obj.bordeopa != "undefined")? obj.bordeopa :0.8,
			    strokeWeight: 1,
			    fillColor: (typeof obj.rellenocolor != "undefined")? obj.rellenocolor :"#333333",
			    fillOpacity: (typeof obj.rellenopa != "undefined")? obj.rellenopa :0.5
			});
			poligon.setMap(settings.map);
			settings.poligonos.push(poligon);
		},
		load_polyline: function(latlng,obj){
			var line = new google.maps.Polyline({
			    path: latlng,
			    icons: (typeof obj.icon != "undefined")? obj.icon:null,
			    strokeColor: (typeof obj.color != "undefined")? obj.color:"#333333",
			    strokeOpacity: 1.0,
			    strokeWeight: (typeof obj.strokeWeight != "undefined")? obj.strokeWeight:1,
			    ucolor: (typeof obj.color != "undefined")? obj.color:"#333333"
		 	});
		 	line.setMap(settings.map);
		 	settings.poligonos.push(line);
		},
		fit_to_content: function(event){

			var bounds = new google.maps.LatLngBounds();
			for(i=0; i<settings.poligonos.length; i++){
				var path = settings.poligonos[i].getPath().getArray();
				for(l=0; l<path.length; l++){
					bounds.extend(path[l]);
				}
			}
			settings.map.fitBounds(bounds);
		},
		resize: function(){
			google.maps.event.trigger(settings.map, "resize");
		},
		setCenter: function(lat,lng){
			settings.map.setCenter(new google.maps.LatLng(lat,lng));
		},
		getLatLng: function(lat,lng){
			return new google.maps.LatLng(lat,lng);
		},
	};
	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(opt, handler);
}	
GEOMAP.prototype = new GEAUTILS();
}(jQuery));