(function($) {
	//DEFINIMOS LA PLANTILLA BASE DE LOS SCRIPT
	GEOMAP = function(opt, handler) {
		var that = this;
		//LAS VARIABLES DEFAULT REEMPLAZAN A LAS SETTINGS CUANDO ESTAS NO SON ENTREGADAS
		//COMO PARAMETRO DE INICIALIZACION
		//DEFINIMOS LAS VARIABLES DEFAULT
		var defaults = {
			target: null,
			libname: 'geomap.js',
			version: '3.exp',
			styled: false,
			isLess: false,
			mapObj: null,
			initZoom: 17,
			drawline: null,
			rule: null,
			styleMap: null
		};
		//DEFINIMOS LAS SETTINGS
		var settings = { };
		//DEFINIMOS EL OBJETO ROOT SUPERIOR
		var root = null;
		//DONDE SE GUARDAR LOS PUNTOS
		var markersPoint = [];
		// MARKER CUANDO SE BUSCA UNA POSICIÓN POR BUSCADOR
		var markSearch = [];
		// Buscar
		var bounds;
		var input;
		var searchBox;
		var places;
		//DEFINIMOS LOS METODOS PRIVADOS Y EL CONSTRUCTOR EN ESTA AREA OBJETO
		var methods = {
			constructor: function(opt, handler) {
				settings = $.extend({}, defaults, opt);
				//INSTANCIAMOS EL MAPA
				//that.utils.add_css_sheet(settings.libname);
				//COMPROBAMOS LA VERSION
				methods.check_googlemaps_api();
				that.lib_mp.get_zoom();

			},
			check_googlemaps_api: function() {
				var status = false;
				$("script").each(function(key, value) {
					if (typeof $(value).attr('src') != "undefined" && $(value).attr('src').search('http://maps.googleapis.com/maps/api/js')!=-1 ) {
						//EN ESTE SEGMENTO COMPROBAMOS QUE LA VERSION QUE UTILIZAREMOS DE GOOGLEMAPS SEA LA CORRECTA.
						//ESTO SE HACE POR UN SUBSTRING DE LA PROPIEDAD SRC DEL SCRIPT QUE CONTIENE LA LLAMADA A GOOGLEMAPS
						var parseString = $(value).attr('src').replace('http://maps.googleapis.com/maps/api/js?', '');
						var version = parseString.split("&");
						version = version[0].substring(2);
						
						if ( parseFloat(version)!=settings.version ) {
							status = true;
						} else {
							status = false;
						}
					}
				});
				
				if ( !status ) {
					console.log("Se requiere la version " + settings.version + " de la API de GoogleMaps para ejecutar GEO-CGR");
				} else {
					//SI LA LIBRERIA ES CORRECTA LLAMAMOS AL MAPA
					methods.make_map();
				}
			},
			//METODO PARA CARGAR EL MAPA
			make_map: function(options) {
				//CREAMOS LA INSTANCIA DEL MAPA SOBRE UN DIV VALIDO
				if ( settings.target!=null ) {
					//MAP OPTIONS//
					var mapOptions = {
						center: new google.maps.LatLng(settings.initLat, settings.initLng),
						zoom: settings.initZoom,
						disableDefaultUI: true,
						draggable: true,
						disableDoubleClickZoom: true,
						scrollwheel: true,
						zoomControl: false,
						mapTypeControl: false
					}
					//COMPROBAMOS SI TIENE UN ESTILO DEFINIDO
					if ( settings.styled ) {
						//LLAMAMOS EL STYLE DEFINIDO Y LO APLICAMOS
						$.getJSON("CHILECOMPRA/gea/geomap/style.jsp",{}, function(data) {
							settings.styleMap = data;
							mapOptions.mapTypeId = 'GEEOCGR';
							settings.mapObj = new google.maps.Map(document.getElementById(settings.target), mapOptions);
							var styledMapType = new google.maps.StyledMapType(data, { name: 'GEEOCGR' });
							settings.mapObj.mapTypes.set('GEEOCGR', styledMapType);
							methods.makeplace();
							methods.zoom_secu();
							settings.mapObj.setOptions({
								draggableCursor: "default", 
								draggingCursor: "hand"
							});
							that.PUB.verify_draw();
						});
					} else {
						settings.mapObj = new google.maps.Map(document.getElementById(settings.target), mapOptions);
						methods.makeplace();
						methods.zoom_secu();
						settings.mapObj.setOptions({
							draggableCursor: "default", 
							draggingCursor: "hand"
						});
					}

				} else {
					console.log("Se debe especificar una capa HTML para poder inicializar un mapa.")
				}
			},
			zoom_secu: function(){
				google.maps.event.addListener(settings.mapObj, 'zoom_changed', function() {
						if ( settings.mapObj.getZoom()>=17 && !GEOCGRCHI.PUB.get_control_spatial()) {
							GEOCGRCHI.PUB.get_spatial_element().PUB.verify_timeline();
							if(!_CONFIG._CUSTOM.BLOCK){
								$("#add-marker-des").css('display', 'none');
								$("#add-marker").css('display', 'block');
								$("#add-linea-des").css('display', 'none');
								$("#add-linea").css('display', 'block');
							}
							$("#pan-des").css('display', 'none');
							$("#pan-nodes").css('display', 'block');
							$("#regla-des").css('display', 'none');
							$("#regla").css('display', 'block');
						}
						else
						{
							GEOCGRCHI.PUB.get_spatial_element().PUB.verify_timeline();
							$("#pan-des").css('display', 'block');
							$("#pan-nodes").css('display', 'none');
							$("#add-marker-des").css('display', 'block');
							$("#add-marker").css('display', 'none');
							$("#add-linea-des").css('display', 'block');
							$("#add-linea").css('display', 'none');
							$("#regla-des").css('display', 'block');
							$("#regla").css('display', 'none');
						}
					});
			},
			makeplace: function() {
				input = (document.getElementById('pac-input'));
				searchBox = new google.maps.places.SearchBox((input));
				google.maps.event.addListener(searchBox, 'places_changed', function() {
					places = searchBox.getPlaces();
					if ( places.length==0 ) {
						return;
					}
					
					for ( var i = 0, marker; marker = markSearch[i]; i++ ) {
						marker.setMap(null);
					}
					
					//For each place, get the icon, place name, and location.
					markSearch = [];
					bounds = new google.maps.LatLngBounds();
					
					for ( var i = 0, place; place = places[i]; i++ ) {
						var image = {
							url: place.icon,
							size: new google.maps.Size(71, 71),
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(17, 34),
							scaledSize: new google.maps.Size(25, 25)
						};
						bounds.extend(place.geometry.location);
					}
				});
			},
			get_zoom: function() {
				//alert("paso1");
				//return settings.mapObj.getZoom();
			},
			stop_line: function(){
				if(settings.drawline != null){
					var pline = settings.drawline.getPath();
					if(pline.getLength() > 1){
						var elemento = GEOCGRCHI.PUB.get_spatial_element();
						elemento.PUB.set_line(settings.drawline);
						google.maps.event.clearListeners(settings.mapObj, 'click');
						google.maps.event.clearListeners(settings.mapObj, 'rightclick');
						settings.drawline = null;
					}
					else
					{
						settings.drawline.setMap(null);
						google.maps.event.clearListeners(settings.mapObj, 'click');
						google.maps.event.clearListeners(settings.mapObj, 'rightclick');
						settings.drawline = null;
					}
				}
				if(settings.rule != null){
					var pos = settings.rule.getPath();
					var distancia = 0;
					if(pos.getLength() > 1){
						for(i=0; i<(pos.getLength()-1); i++){
							distancia += google.maps.geometry.spherical.computeDistanceBetween(pos.getAt(i), pos.getAt((i+1))); 
						}
						alert("Existen "+(Math.ceil(distancia)/1000)+" KM, entre los puntos especificados.");
					}
					settings.rule.setMap(null);
					google.maps.event.clearListeners(settings.mapObj, 'click');
					google.maps.event.clearListeners(settings.mapObj, 'rightclick');
					settings.mapObj.setOptions({
						draggableCursor: "default", 
						draggingCursor: "hand"
					});
					settings.rule = null;
				}
			},
			block_other: function(){
					$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn").css("background", "#CCC");
					// $("#uploadBtn").prop("disabled", true);
					$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#CCC");
			}
		};
		//************************************************************************************
		//RULER: SEARCH
		$("#buscarcalle").click(function() {
			var valor = $("#pac-input").val().split(",");
			if(valor.length != 2 || isNaN(valor[0]) || isNaN(valor[1])){
				settings.mapObj.fitBounds(bounds);
		    	settings.mapObj.setZoom(settings.mapObj.getZoom()-4);	
			}
			else
			{
				bounds = new google.maps.LatLngBounds();
				bounds.extend(that.PUB.getLatLng(valor[0],valor[1]));
				settings.mapObj.fitBounds(bounds);
		    	settings.mapObj.setZoom(settings.mapObj.getZoom()-4);	
			}
		});
		//RULER: UNDO
		$("#undo-nodes").click(function() {
			$.SYNC.NEW("DRAW");
			if($.SYNC.SYNC(3,"DRAW")){
				methods.stop_line();
				if(that.PUB.getZoom() >= 17){
					var elemento = GEOCGRCHI.PUB.get_spatial_element();
					elemento.PUB.undo();
					if (elemento.PUB.more_undo()) {
						$("#undo-des").css('display','none');
						$("#undo-nodes").css('display','block');
					} else {
						$("#undo-des").css('display','block');
						$("#undo-nodes").css('display','none');
					}
					
					if (elemento.PUB.more_forward()) {
						$("#redo-des").css('display','none');
						$("#redo-nodes").css('display','block');
					} else {
						$("#redo-des").css('display','block');
						$("#redo-nodes").css('display','none');
					}
				}
				else
				{
					alert("Las herramientas de dibujo estan solo disponibles en zoom 17.");
				}
			}
		});
		//RULER: REDO
		$("#redo-nodes").click(function() {
			$.SYNC.NEW("DRAW");
			if($.SYNC.SYNC(3,"DRAW")){
				methods.stop_line();
				if(that.PUB.getZoom() >= 17){
					var elemento = GEOCGRCHI.PUB.get_spatial_element();
					elemento.PUB.forward();
					if (elemento.PUB.more_undo()) {
						$("#undo-des").css('display','none');
						$("#undo-nodes").css('display','block');
					} else {
						$("#undo-des").css('display','block');
						$("#undo-nodes").css('display','none');
					}
					
					if(elemento.PUB.more_forward()) {
						$("#redo-des").css('display','none');
						$("#redo-nodes").css('display','block');
					} else {
						$("#redo-des").css('display','block');
						$("#redo-nodes").css('display','none');
					}
				}
				else
				{
					alert("Las herramientas de dibujo estan solo disponibles en zoom 17.");
				}
			}
		});
		//RULER: HAND
		function limpiar(){
			$(".active").removeClass("active");
			$("#add-marker-des").css('display', 'none');
			$("#add-marker").css('display', 'block');
			$("#add-linea-des").css('display', 'none');
			$("#add-linea").css('display', 'block');			
			$("#regla-des").css('display', 'none');
			$("#regla").css('display', 'block');
		}
		$(".DRAW_ELEMENT").on('click', function(){
			$.SYNC.NEW("DRAW");
			var status = $.SYNC.STATUS("DRAW");
			if((status.ID_BUSY == -1 || status.ID_BUSY == 3) && that.PUB.getZoom() < 17){
				var prompt = new PROMPT({
					texto: "Acérquese al lugar donde se ubica la obra para que se habiliten las herramientas de dibujo",
					centro: function(e){
						e.PUB.destroy();
					}
				});
				prompt.PUB.set_centro('<i class="fa fa-check"></i> Cerrar');
				prompt.PUB.show(); 
			}
			else if(status.ID_BUSY == 1){
				var prompt = new PROMPT({
					texto: "El sistema ha detectado que ya se seleccion&oacute; la opción “Sin Ubicaci&oacute;n”. Para dibujar en el mapa desactive el botón “Sin Ubicaci&oacute;n”",
					first: function(e){
						e.PUB.destroy();
					},
					second: function(e){
						e.PUB.destroy();
					}
				});
				prompt.PUB.set_first('<i class="fa fa-check"></i> Aceptar');
				prompt.PUB.set_second('<i class="fa fa-check"></i> Cancelar');
				prompt.PUB.set_second_class('rojo');
				prompt.PUB.show();
			}
			else if(status.ID_BUSY == 2){
				var prompt = new PROMPT({
					texto: "El sistema ha detectado que ya se seleccion&oacute; la opción “Adjuntar KML”. Para dibujar en el mapa elimine el KML a traves del boton indicado.",
					first: function(e){
						e.PUB.destroy();
					},
					second: function(e){
						e.PUB.destroy();
					}
				});
				prompt.PUB.set_first('<i class="fa fa-check"></i> Aceptar');
				prompt.PUB.set_second('<i class="fa fa-check"></i> Cancelar');
				prompt.PUB.set_second_class('rojo');
				prompt.PUB.show();
			}
		});
		$("#pan-nodes").click(function() {
			limpiar();
			google.maps.event.clearListeners(settings.mapObj, 'click');
			$("#pan-nodes").hide();
			$("#pan-des").show().addClass("active").parent().addClass("active");
			settings.mapObj.setOptions({
				draggableCursor: 'url(http://maps.gstatic.com/mapfiles/openhand_8_8.cur),default', 
				draggingCursor: 'url(http://maps.gstatic.com/mapfiles/closedhand_8_8.cur),default'
			});
		});
		//RULER: ADD MARKER
		$("#add-marker").click(function() {
			$.SYNC.NEW("DRAW");
			if($.SYNC.SYNC(3,"DRAW")){
				methods.stop_line();
				methods.block_other();
				if(that.PUB.getZoom() >= 17 && !GEOCGRCHI.PUB.get_control_spatial()){
					limpiar();
					$("#add-marker-des").css('display', 'block').addClass("active").parent().addClass("active");
					$("#add-marker").css('display', 'none');
					$("#pan-nodes").show();
					$("#pan-des").hide();
					settings.mapObj.setOptions({
						draggableCursor: "crosshair", 
						draggingCursor: "crosshair"
					});
					google.maps.event.clearListeners(settings.mapObj, 'click');
					google.maps.event.addListener(settings.mapObj, 'click', function(event) {
						var elemento = GEOCGRCHI.PUB.get_spatial_element();
						var marker = new google.maps.Marker({
							position: event.latLng,
							map: settings.mapObj,
							draggable: true
						});
						elemento.PUB.set_point(marker);
						elemento.PUB.set_type(1);
						if (elemento.PUB.stack_length() > 0 ) {
							$("#undo-des").css('display','none');
							$("#undo-nodes").css('display','block');
						} else {
							$("#undo-des").css('display','block');
							$("#undo-nodes").css('display','none');
						}	
						$("#redo-des").css('display','block');
						$("#redo-nodes").css('display','none');
					});
				}
				else
				{
					alert("Las herramientas de dibujo estan solo disponibles en zoom 17.");
				}
			}
		});

		//RULER: ADD LINE (BEGIN)
		//***********************
		$("#add-linea").click(function() {
			$.SYNC.NEW("DRAW");
			if($.SYNC.SYNC(3,"DRAW")){
				methods.stop_line();
				methods.block_other();
				if ( that.PUB.getZoom()>=17 && !GEOCGRCHI.PUB.get_control_spatial() ) {
					limpiar();
					
					$("#add-linea").css('display', 'none');
					$("#add-linea-des").css('display', 'block').addClass("active").parent().addClass("active");
					$("#pan-nodes").show();
					$("#pan-des").hide();
					
					settings.mapObj.setOptions({ draggableCursor:"crosshair", draggingCursor:"crosshair" });
					
					var hexVal = "0123456789ABCDEF".split("");
					var defaultColor = '#ff0000'; 
					var polyline = new google.maps.Polyline({
						path: new google.maps.MVCArray(),
						map: settings.mapObj,
						strokeColor: '#ff0000',
						strokeWeight: 4,
						strokeOpacity: 0.5,
						clickable: true
					});
					
					google.maps.event.clearListeners(settings.mapObj, 'click');
					settings.drawline = polyline;
					google.maps.event.addListener(polyline, 'dblclick', function(e) {
						if ( polyline.getPath().getLength()<2 ) {
							alert("ERROR: Debe dibujar una línea");
						} else {
							var elemento = GEOCGRCHI.PUB.get_spatial_element();
							
							elemento.PUB.set_line(polyline);
							google.maps.event.clearListeners(settings.mapObj, 'click');
							google.maps.event.clearListeners(settings.mapObj, 'rightclick');
							google.maps.event.clearListeners(polyline, 'dblclick');
							settings.drawline = null;
							
							settings.mapObj.setOptions({
								draggableCursor: 'url(http://maps.gstatic.com/mapfiles/openhand_8_8.cur),default', 
								draggingCursor: 'url(http://maps.gstatic.com/mapfiles/closedhand_8_8.cur),default'
							});
						
							$("#add-linea").css('display', 'block');
							$("#add-linea-des").css('display', 'none').removeClass("active").parent().removeClass("active");
							$("#pan-nodes").show();
							$("#pan-des").hide();
						}
					});
					
					google.maps.event.addListener(settings.mapObj, 'click', function(e) {
						polyline.getPath().push(e.latLng);
						
						polyline.setOptions({
							editable: true
						});
					});
					
					$("#redo-des").css('display','block');
					$("#redo-nodes").css('display','none');
				} else {
					alert("Las herramientas de dibujo estan solo disponibles en zoom 17.");
				}
			}
		});
		//RULER: ADD LINE (END)
		//***********************
		
		//RULER: RULER
		$("#regla").click(function() {
			$.SYNC.NEW("DRAW");
			if($.SYNC.SYNC(3,"DRAW")){
				if(settings.drawline != null){
					var pos = settings.drawline.getPath();
					var distancia = 0;
					if(pos.getLength() > 1){
						for(i=0; i<(pos.getLength()-1); i++){
							distancia += google.maps.geometry.spherical.computeDistanceBetween(pos.getAt(i), pos.getAt((i+1))); 
						}
						alert("Existen "+(Math.ceil(distancia)/1000)+" KM, entre los puntos especificados.");
					}
					settings.rule.setMap(null);
					google.maps.event.clearListeners(settings.mapObj, 'click');
					google.maps.event.clearListeners(settings.mapObj, 'rightclick');
					settings.mapObj.setOptions({
						draggableCursor: "default", 
						draggingCursor: "hand"
					});
					settings.rule = null;
					return;
				}
				methods.stop_line();
				if(that.PUB.getZoom() >= 17 && !GEOCGRCHI.PUB.get_control_spatial()){
					google.maps.event.clearListeners(settings.mapObj, 'click');
					limpiar();
					$("#regla-des").css('display', 'block').addClass("active").parent().addClass("active");
					$("#regla").css('display', 'none');
					settings.mapObj.setOptions({
						draggableCursor: "crosshair", 
						draggingCursor: "crosshair"
					});
					var pos = [];
					var polyline = new google.maps.Polyline({
						path: new google.maps.MVCArray(),
						map: settings.mapObj,
						strokeColor: '#ff0000',
						strokeWeight: 4,
						strokeOpacity: 0.5,
						clickable: true,
					});
					settings.rule = polyline;
					google.maps.event.addListener(settings.mapObj, 'click', function(e) {
						pos.push(e.latLng);
						polyline.getPath().push(e.latLng);
						polyline.setOptions({
							editable: true
						});	
					});
					google.maps.event.addListener(settings.mapObj, 'rightclick', function(e) {
						var distancia = 0;
						for(i=0; i<(pos.length-1); i++){
							distancia += google.maps.geometry.spherical.computeDistanceBetween(pos[i], pos[(i+1)]); 
						}
						alert("Existen "+(Math.ceil(distancia)/1000)+" KM, entre los puntos especificados.");
						polyline.setMap(null);
						google.maps.event.clearListeners(settings.mapObj, 'click');
						google.maps.event.clearListeners(settings.mapObj, 'rightclick');
						google.maps.event.clearListeners(polyline, 'dblclick');
						settings.mapObj.setOptions({
							draggableCursor: 'url(http://maps.gstatic.com/mapfiles/openhand_8_8.cur),default', 
							draggingCursor: 'url(http://maps.gstatic.com/mapfiles/closedhand_8_8.cur),default'
						});
						limpiar();
						settings.rule = null;
					});
				}
				else
				{
					alert("Las herramientas de dibujo estan solo disponibles en zoom 17.");
				}
			}
		});
		//************************************************************************************
		$("#tierraclick").click(function() {
			settings.mapObj.mapTypeControl = true;
			$("#divmaptierra").css('display', 'none');
			$("#divmapgeo").css('display', 'block');
			settings.mapObj.setMapTypeId(google.maps.MapTypeId.HYBRID);
		});
		$("#mapageoclick").click(function() {
			settings.mapObj.mapTypeControl = true;
			$("#divmaptierra").css('display', 'block');
			$("#divmapgeo").css('display', 'none');
			settings.mapObj.setMapTypeId("GEOCGR");
		});
		$("#zoomIn").click(function() {
			settings.mapObj.setZoom(settings.mapObj.getZoom() + 1);
			
			if ( settings.mapObj.getZoom()>=17 && !GEOCGRCHI.PUB.get_control_spatial()) {
				GEOCGRCHI.PUB.get_spatial_element().PUB.verify_timeline();
				$("#pan-des").css('display', 'none');
				$("#pan-nodes").css('display', 'block');
				$("#add-marker-des").css('display', 'none');
				$("#add-marker").css('display', 'block');
				$("#add-linea-des").css('display', 'none');
				$("#add-linea").css('display', 'block');
				$("#regla-des").css('display', 'none');
				$("#regla").css('display', 'block');
			}
		});
		$("#zoomOut").click(function() {
			settings.mapObj.setZoom(settings.mapObj.getZoom() - 1);
			
			if ( settings.mapObj.getZoom()<17 ) {
				GEOCGRCHI.PUB.get_spatial_element().PUB.verify_timeline();
				$("#pan-des").css('display', 'block');
				$("#pan-nodes").css('display', 'none');
				$("#add-marker-des").css('display', 'block');
				$("#add-marker").css('display', 'none');
				$("#add-linea-des").css('display', 'block');
				$("#add-linea").css('display', 'none');
				$("#regla-des").css('display', 'block');
				$("#regla").css('display', 'none');
			}
		});
		//METODOS PUBLICOS
		this.lib_mp = {
			get_zoom: function() {
				methods.get_zoom()
				//return settings.mapObj.getZoom();
			},
			getMap: function(){
				return settings.mapObj;
			}
		};
		// METODOS PUBLICO
		this.PUB = {
			verify_draw: function(){
				if(that.PUB.getZoom() < 17){
					$("#undo-des").css('display', 'block');
					$("#undo-nodes").css('display', 'none');
					$("#redo-des").css('display', 'block');
					$("#redo-nodes").css('display', 'none');
					$("#pan-des").css('display', 'block');
					$("#pan-nodes").css('display', 'none');
					$("#add-marker-des").css('display', 'block');
					$("#add-marker").css('display', 'none');
					$("#add-linea-des").css('display', 'block');
					$("#add-linea").css('display', 'none');
					$("#regla-des").css('display', 'block');
					$("#regla").css('display', 'none');
				}
			},
			load_point: function(){
			},
			load_marker: function(lat, lng, options,nomap){
				var markerOption = {
					position: that.PUB.getLatLng(lat,lng),
					map: (nomap)?null:settings.mapObj
				};
				markerOption = $.extend({}, markerOption, options);
				var marker = new google.maps.Marker(markerOption);
				if(typeof markerOption.infowindow != "undefined"){
					google.maps.event.addDomListener(marker,'click', function(){
						options.infowindow.open(settings.mapObj,marker);
					});
				}
				if(typeof markerOption.events != "undefined"){
					$.each(markerOption.events, function(key,value){
						google.maps.event.addListener(marker, key, value);
					})
				}
				return marker;
			},
			load_marker_latlng: function(latlng, options){
				var markerOption = {
					position: latlng,
					map: settings.mapObj
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
				return marker;
			},
			load_polygon: function(poli, obj,nomap){
				var poligon = new google.maps.Polygon({
				    paths: poli,
				    strokeColor: (typeof obj.bordecolor != "undefined")? obj.bordecolor :"#333333",
				    strokeOpacity: (typeof obj.bordeopa != "undefined")? obj.bordeopa :0.8,
				    strokeWeight: 1,
				    fillColor: (typeof obj.rellenocolor != "undefined")? obj.rellenocolor :"#333333",
				    fillOpacity: (typeof obj.rellenopa != "undefined")? obj.rellenopa :0.5
				});
				if(typeof obj.infowindow != "undefined"){
					google.maps.event.addDomListener(poligon,'click', function(){
						obj.infowindow.open(settings.mapObj);
					});
				}
				if(typeof obj.events != "undefined"){
					$.each(obj.events, function(key,value){
						google.maps.event.addListener(poligon, key, value);
					})
				}
				if(!nomap || typeof nomap == "undefined") poligon.setMap(settings.mapObj);
			 	return poligon;
			},
			load_polyline: function(latlng,obj,nomap){
				var line = new google.maps.Polyline({
				    path: latlng,
				    icons: (typeof obj.icon != "undefined")? obj.icon:null,
				    strokeColor: (typeof obj.color != "undefined")? obj.color:"#333333",
				    strokeOpacity: (typeof obj.opacity != "undefined")? obj.opacity:1.0,
				    strokeWeight: (typeof obj.weight != "undefined")? obj.weight:1,
				    clickable: true,
				    editable: (!_CONFIG._CUSTOM.BLOCK)?true:false
			 	});
			 	if(typeof obj.infowindow != "undefined"){
					google.maps.event.addDomListener(line,'click', function(){
						obj.infowindow.open(settings.mapObj);
					});
				}
			 	if(typeof obj.events != "undefined"){
					$.each(obj.events, function(key,value){
						google.maps.event.addListener(line, key, value);
					})
				}
			 	if(!nomap || typeof nomap == "undefined") line.setMap(settings.mapObj);
			 	return line;
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
				settings.mapObj.setCenter(that.PUB.getLatLng(lat,lng));
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
				settings.mapObj.setOptions({
					draggableCursor: 'url(http://maps.gstatic.com/mapfiles/openhand_8_8.cur),default', 
					draggingCursor: 'url(http://maps.gstatic.com/mapfiles/closedhand_8_8.cur),default'
				});
				google.maps.event.clearListeners(settings.mapObj, event);
			}
		};
		//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
		methods.constructor(opt, handler);
	},
	GEOMAP.prototype = new GEAUTILS();
}(jQuery));