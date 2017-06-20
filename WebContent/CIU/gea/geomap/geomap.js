(function($){
//DEFINIMOS LA PLANTILLA BASE DE LOS SCRIPT
GEOMAP = function(opt, handler){
	var that = this;
	//LAS VARIABLES DEFAULT REEMPLAZAN A LAS SETTINGS CUANDO ESTAS NO SON ENTREGADAS 
	//COMO PARAMETRO DE INICIALIZACION
	//DEFINIMOS LAS VARIABLES DEFAULT
	var defaults = {
		target: null,
		libname: 'geomap.js',
		version: 9,
		styled: false,
		isLess: false,
		mapObj: null,
		initZoom:4,
		stylemap: null
	};
	//DEFINIMOS LAS SETTINGS
	var settings = {
	};
	//DEFINIMOS EL OBJETO ROOT SUPERIOR
	var root = null;
	//DEFINIMOS LOS METODOS PRIVADOS Y EL CONSTRUCTOR EN ESTA AREA OBJETO
	var methods = {
		constructor: function(opt, handler){
			settings = $.extend({}, defaults, opt);
			//INSTANCIAMOS EL MAPA
			//that.utils.add_css_sheet(settings.libname);
			//COMPROBAMOS LA VERSION
			methods.check_googlemaps_api();
		},
		check_googlemaps_api:function(){
			var status = false;
			$("script").each(function(key,value){
				if(typeof $(value).attr('src') != "undefined" && $(value).attr('src').search('http://maps.googleapis.com/maps/api/js') != -1){
					//EN ESTE SEGMENTO COMPROBAMOS QUE LA VERSION QUE UTILIZAREMOS DE GOOGLEMAPS SEA LA CORRECTA.
					//ESTO SE HACE POR UN SUBSTRING DE LA PROPIEDAD SRC DEL SCRIPT QUE CONTIENE LA LLAMADA A GOOGLEMAPS
					var parseString = $(value).attr('src').replace('http://maps.googleapis.com/maps/api/js', '');
					var version = parseString.split("&");
					version = version[0].substring(5);
					if(parseFloat(version) >= settings.version){
						status = true;
					}
					else
					{
						status = false;
					}
				}
			});
			if(!status){
				console.log("Se requiere la version "+settings.version+" de la API de GoogleMaps para ejecutar GEO-CGR")
				
			}else{
				//SI LA LIBRERIA ES CORRECTA LLAMAMOS AL MAPA
				methods.make_map();
			}
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
		          //	maxZoom: settings.maxZoom,
		          	minZoom: settings.minZoom,
		          	disableDefaultUI: true,
		          	draggable:true,
		          	disableDoubleClickZoom: true,
		          	scrollwheel: true,
		          	mapTypeControl:true,
		          	mapTypeControlOptions : {
							position:google.maps.ControlPosition.TOP_LEFT,
					},
					mapTypeId : google.maps.MapTypeId.ROADMAP
				}
				
				// COMPROBAMOS SI TIENE UN ESTILO DEFINIDO
				if(settings.styled){
					// LLAMAMOS EL STYLE DEFINIDO Y LO APLICAMOS
					$.getJSON( "CIU/gea/geomap/style.jsp",{}, function(data){
						settings.stylemap = data;
						mapOptions.styles = settings.stylemap;
						settings.mapObj = new google.maps.Map(document.getElementById(settings.target), mapOptions);
					});
				}
				else
				{
					settings.mapObj = new google.maps.Map(document.getElementById(settings.target), mapOptions);
				}
				
			}
			else
			{
				console.log("Se debe especificar una capa HTML para poder inicializar un mapa.")
			}

		}
	};
	//DEFINIMOS LOS METODOS PUBLICOS
	this.publics = {
		load_point: function(lat, lng){
			var markerOption = {
				position: that.publics.getLatLng(lat,lng)
			};
			var marker = new google.maps.Marker(markerOption);
			//INTEGRAMOS FUNCIONES AUXILIARES.
			marker._RENDER = function(activate){
				marker.setMap(settings.mapObj);
				if(typeof activate != "undefined" && activate) new google.maps.event.trigger(marker, 'click');
			};
			marker._SHOW_INFOWIN = function(INFOWIN,TYPE){
				INFOWIN.open(settings.mapObj,marker,TYPE);
			};
			marker._CLEAN = function(){
				marker.setMap(null);
			};
			marker._EVENT = function(event, action){
				if(typeof event != "undefined" && typeof action == "function"){
					google.maps.event.addDomListener(marker, event, action);
				}
				else
				{
					console.log("Error: Can'b bind event from external.");
				}
			};
			marker._CLEAR_EVENT = function(){
				google.maps.event.clearInstanceListeners(marker);
			};
			marker._TRIGGER = function(EVENT){
				new google.maps.event.trigger(marker, 'click');
			};
			return marker;
		},
		load_line: function(line){
			var line_obj = {
				"_LINES": []
			};
			line_obj._LINES.push(new google.maps.Polyline({
			    path: line,
			    strokeOpacity: 1.0,
			    strokeWeight: 3,
			    zIndex:2
		 	}))
		 	line_obj._LINES.push(new google.maps.Polyline({
			    path: line,
			    strokeOpacity: 1.0,
			    strokeWeight: 6,
			    zIndex:1
		 	}));
		 	line_obj._RENDER = function(activate){
		 		for(i=0;i<line_obj._LINES.length; i++){
		 			line_obj._LINES[i].setMap(settings.mapObj);
		 		}
		 		if(typeof activate != "undefined" && activate) new google.maps.event.trigger(line_obj._LINES[0], 'click');
			};
			line_obj._SET_COLOR = function(COLOR1,COLOR2){
		 		line_obj._LINES[0].setOptions({"strokeColor":COLOR1});
		 		line_obj._LINES[1].setOptions({"strokeColor":COLOR2});
			};
			line_obj._SHOW_INFOWIN = function(INFOWIN,TYPE){
				INFOWIN.open(settings.mapObj,line_obj._LINES[0],TYPE);
			};
			line_obj._CLEAN = function(){
				for(j=0;j<line_obj._LINES.length; j++){
		 			line_obj._LINES[j].setMap(null);
		 		}
			};
			line_obj._EVENT = function(event, action){
				if(typeof event != "undefined" && typeof action == "function"){
					for(i=0;i<line_obj._LINES.length; i++){
			 			google.maps.event.addDomListener(line_obj._LINES[i], event, action);
			 		}
				}
				else
				{
					console.log("Error: Can'b bind event from external.");
				}
			};
			line_obj._CLEAR_EVENT = function(){
				google.maps.event.clearInstanceListeners(line_obj._LINES[0]);
				google.maps.event.clearInstanceListeners(line_obj._LINES[1]);
			};
			line_obj._TRIGGER = function(EVENT){
				new google.maps.event.trigger(line_obj._LINES[0], EVENT);
			};
			return line_obj;
		},
		load_marker: function(lat, lng, options){
			var markerOption = {
				position: that.publics.getLatLng(lat,lng),
				map: settings.mapObj,
				uicon: options.icon
			};
			markerOption = $.extend({}, markerOption, options);
			var marker = new google.maps.Marker(markerOption);
			if(typeof markerOption.infowindow != "undefined"){
				google.maps.event.addDomListener(marker,'click', function(){
					options.infowindow.open(settings.mapObj,marker,"point");
				});
			}
			if(typeof markerOption.events != "undefined"){
				$.each(markerOption.events, function(key,value){
					google.maps.event.addDomListener(marker, key, value);
				})
			}
			if(typeof markerOption.iconChange != "undefined"){
				marker["busy"] = 0;
				google.maps.event.addDomListener(marker,'click', function(){
					marker["busy"] = 1;
					marker.setIcon(markerOption.iconChange);
					marker.setZIndex(1000);
					DATA.PUB.add_ipoint(marker);
				});
			}
			return marker;
		},
		load_marker_latlng: function(latlng, options){
			var markerOption = {
				position: latlng,
				map: settings.mapObj,
				uicon: options.icon
			};
			markerOption = $.extend({}, markerOption, options);
			var marker = new google.maps.Marker(markerOption);
			if(typeof markerOption.infowindow != "undefined"){
				google.maps.event.addDomListener(marker,'click', function(){
					options.infowindow.open(settings.mapObj);
				});
			}
			if(typeof markerOption.clickAction != "undefined" && markerOption.clickAction != "null"){
				google.maps.event.addDomListener(marker,'click', function(){
					that.animation.clear_category("fichas");
					that.animation.add_animation(marker, "fichas", "BOUNCE");
					markerOption.clickAction.action(markerOption.clickAction.data);
				});
				
			}
			if(typeof markerOption.iconChange != "undefined"){
				google.maps.event.addDomListener(marker,'click', function(){
					marker.setIcon(markerOption.iconChange);
					DATA.PUB.add_ipoint(marker);
				});
			}
			return marker;
		},
		load_polygon: function(poli, obj){
			var poligon = new google.maps.Polygon({
			    paths: poli,
			    strokeColor: (typeof obj.bordecolor != "undefined")? obj.bordecolor :"#333333",
			    strokeOpacity: (typeof obj.bordeopa != "undefined")? obj.bordeopa :0.8,
			    strokeWeight: 1,
			    fillColor: (typeof obj.rellenocolor != "undefined")? obj.rellenocolor :"#333333",
			    fillOpacity: (typeof obj.rellenopa != "undefined")? obj.rellenopa :0.5
			});
			poligon.setMap(settings.mapObj);
			if(typeof obj.infowindow != "undefined"){
				google.maps.event.addDomListener(poligon,'click', function(){
					obj.infowindow.open(settings.mapObj,poligon,"polygon");
				});
			}
			if(typeof obj.events != "undefined"){
				$.each(obj.events, function(key,value){
					google.maps.event.addDomListener(poligon, key, value);
				})
			}
		 	return poligon;
		},
		load_polyline_territorial: function(latlng,obj){
			var line = new google.maps.Polyline({
			    path: latlng,
			    icons: (typeof obj.icon != "undefined")? obj.icon:null,
			    strokeColor: (typeof obj.color != "undefined")? obj.color:"#333333",
			    strokeOpacity: 1.0,
			    strokeWeight: (typeof obj.strokeWeight != "undefined")? obj.strokeWeight:1,
			    ucolor: (typeof obj.color != "undefined")? obj.color:"#333333"
		 	});
		 	if(typeof obj.infowindow != "undefined"){
				google.maps.event.addDomListener(line,'click', function(){
					obj.infowindow.open(settings.mapObj,line,"line");
				});
			}
		 	if(typeof obj.events != "undefined"){
				$.each(obj.events, function(key,value){
					google.maps.event.addDomListener(line, key, value);
				})
			}
			if(typeof obj.colorChange != "undefined"){
				google.maps.event.addDomListener(line,'click', function(){
					line.setOptions({
						strokeColor: obj.colorChange
					});
					DATA.PUB.add_iline(line);
				});
			}
		 	line.setMap(settings.mapObj);
		 	var pline = {
		 		line1: line,
		 		line2: line
		 	};
		 	return pline;
		},
		load_polyline: function(latlng,obj){
			var line = new google.maps.Polyline({
			    path: latlng,
			    icons: (typeof obj.icon != "undefined")? obj.icon:null,
			    strokeColor: (typeof obj.color != "undefined")? obj.color:"#333333",
			    strokeOpacity: 1.0,
			    strokeWeight: (typeof obj.strokeWeight != "undefined")? obj.strokeWeight:1,
			    ucolor: (typeof obj.color != "undefined")? obj.color:"#333333",
			    zIndex:2
		 	});
		 	var line2 = new google.maps.Polyline({
			    path: latlng,
			    icons: (typeof obj.icon != "undefined")? obj.icon:null,
			    strokeColor: (obj.multi)?"#333333":"#FFFFFF",
			    strokeOpacity: 1.0,
			    strokeWeight: (typeof obj.strokeWeight != "undefined")? obj.strokeWeight*2:2,
			    ucolor: (typeof obj.color != "undefined")? obj.color:"#333333",
			    zIndex:1
		 	});
		 	if(typeof obj.infowindow != "undefined"){
				google.maps.event.addDomListener(line,'click', function(){
					obj.infowindow.open(settings.mapObj,line,"line");
				});
				google.maps.event.addDomListener(line2,'click', function(){
					obj.infowindow.open(settings.mapObj,line,"line");
				});
			}
		 	if(typeof obj.events != "undefined"){
				$.each(obj.events, function(key,value){
					google.maps.event.addDomListener(line, key, value);
				})
				$.each(obj.events, function(key,value){
					google.maps.event.addDomListener(line2, key, value);
				})
			}
			if(typeof obj.colorChange != "undefined"){
				line["busy"] = 0;
				google.maps.event.addDomListener(line,'click', function(){
					line["busy"] = 1;
					line.setOptions({
						strokeColor: obj.colorChange
					});
					DATA.PUB.add_iline(line);
				});
				google.maps.event.addDomListener(line2,'click', function(){
					line["busy"] = 1;
					line.setOptions({
						strokeColor: obj.colorChange
					});
					DATA.PUB.add_iline(line);
				});
			}
		 	line2.setMap(settings.mapObj);
		 	line.setMap(settings.mapObj);
		 	var pline = {
		 		line1: line,
		 		line2: line2
		 	};
		 	return pline;
		},
		getLatLng: function(lat,lng){
			return new google.maps.LatLng(lat,lng);
		},
		getMap: function(){
			return settings.mapObj;
		},
		setZoom: function(zoom){
			settings.mapObj.setZoom(zoom);
		},
		getZoom: function(){
			return settings.mapObj.getZoom();
		},
		setOptions: function(e){
			settings.mapObj.setOptions(e);
		},
		setCenter: function(lat,lng){
			settings.mapObj.setCenter(that.publics.getLatLng(lat,lng));
		},
		clear_all_marker:function(marker){
			try{
				$.each(bank.get_markers(), function(key,value){
					for(i=0; i< value.length; i++){
						if(typeof value[i] == "object"){ 
							value[i].obj.setMap(null);
						}
					}
				});
				marker.setMap(null);
			}
			catch(e){
				console.log("No hay puntos para eliminar.");
			}
		},
		clear_all_polygon:function(marker){
			try{
				bank = root.handler.get_lib_method('databank');
				$.each(bank.get_markers(), function(key,value){
					for(i=0; i< value.length; i++){
						if(typeof value[i] == "object"){ 
							value[i].obj.setMap(null);
						}
					}
				});
				marker.setMap(null);
			}
			catch(e){
				console.log("No hay puntos para eliminar.");
			}
		},
		setEvent:function(event,handler){
			google.maps.event.addDomListener(settings.mapObj, event, handler);
		},
		removeEvent:function(event){
			google.maps.event.clearListeners(settings.mapObj, event);
		},
		fit_to_content: function(event){
			var poly = DATA.PUB.get_poly_spa();
			var bounds = new google.maps.LatLngBounds();
			for(i=0; i<poly.length; i++){
				if(typeof poly[i].element != "undefined" && typeof poly[i].element.line1 != "undefined"){
					var path = poly[i].element.line1.getPath().getArray();	
					for(l=0; l<path.length; l++){
						bounds.extend(path[l]);
					}
				}
				else{					
					var path = poly[i].element.getPath().getArray();	
					for(l=0; l<path.length; l++){
						bounds.extend(path[l]);
					}
				}
				
			}
			settings.mapObj.fitBounds(bounds);
		},
		get_style: function(){
			return settings.stylemap;
		}
	};
	this.animation = {
		animation_table: {},
		add_animation: function(marker, category, efect){
			if(typeof that.animation.animation_table[category] == "undefined"){
				that.animation.animation_table[category] = []
				that.animation.animation_table[category].push(marker);
			}
			else
			{
				that.animation.animation_table[category].push(marker);
			}
			if(efect.toUpperCase() == "BOUNCE"){
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
			else if(efect.toUpperCase() == "DROP"){
				marker.setAnimation(google.maps.Animation.DROP);
			}
			return true;
		},
		remove_marker_category: function(marker, category){
			var search = that.animation.animation_table[category].indexOf(marker);
			if(search >= 0){
				that.animation.animation_table[category][search].setAnimation(null);
				that.animation.animation_table[category].splice(search,1);
			}
		},
		clear_category: function(category){
			if(typeof that.animation.animation_table[category] != "undefined"){
				$.each(that.animation.animation_table[category], function(key,value){
					value.setAnimation(null);
				});
				that.animation.animation_table[category] = [];
			}
			return true;
		}
	};

	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(opt, handler);
}	
GEOMAP.prototype = new GEAUTILS();
}(jQuery));