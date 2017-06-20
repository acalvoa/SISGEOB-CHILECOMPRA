(function(){
	SPATIAL = function(fila, value, code){
		//SETTINGS
		var self = this;
		var settings = {
			fila: null,
			code: null,
			data: null,
			type: 1, //1:DRAW, 2: KML
			lineas: [],
			puntos: [],
			stack: [],
			postack: -1,
			map: MAPA.lib_mp.getMap(),
			status: false,
			noubication: false,
			spatial_tool: 1 // 1: DRAW, 2: KML, 3: NOUBICATION
		};
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(fila, value, code){
			settings.fila = fila;
			settings.data = value;
			settings.code = code;
		}
		// METODOS PRIVADOS
		var PRIV = {
			set_resumen: function(){
				if(!settings.noubication){
					$("#numspuntos").html(settings.puntos.length+" PUNTOS");
					$("#numslineas").html(settings.lineas.length+" LINEAS");
				}
			},
			add_list: function(element,num){
				var elem = $(".content-ubicaciones").children(".listado").children(".bcontent");
				var fila = $('<div class="filageom"></div>').appendTo(elem)
				.on('click', function(){
					google.maps.event.trigger(element.ele,'click');
				});
				if(element.type == "punto"){
					$('<div class="icono-rojo"></div>').appendTo(fila).html('<i class="fa fa-map-marker"></i>');
					$('<div class="nombre"></div>').appendTo(fila).html("Punto "+num);
				}
				else if(element.type == "linea"){
					$('<div class="icono-amarillo"></div>').appendTo(fila).html('<i class="fa fa-minus"></i>');
					$('<div class="nombre"></div>').appendTo(fila).html("Linea "+num);
				}
				if(settings.type == 1){
					if(!_CONFIG._CUSTOM.BLOCK){
						$('<div class="trash"></div>').css({
							color: (GEOCGRCHI.PUB.get_control_spatial())?"#CCC":"#000"
						}).appendTo(fila).html('<i class="fa fa-trash-o"></i>')
						.on('click',function(){
							$.each($.infowindows,function(key,value){
								value.out();
							});
							if(!GEOCGRCHI.PUB.get_control_spatial()){
								if(element.type == "punto"){
									settings.puntos.splice(settings.puntos.indexOf(element.ele),1);
									for(i=0; i<settings.stack.length; i++){
										if(settings.stack[i].ele == element.ele){
											var elemento = settings.stack[i];
											elemento.ele.setMap(null);
											settings.stack.splice(i,1);
											settings.stack.splice(settings.postack,0,elemento);
											settings.postack--;
											break;
										}
									}
								}
								else if(element.type == "linea"){
									settings.lineas.splice(settings.lineas.indexOf(element.ele),1);
									for(i=0; i<settings.stack.length; i++){
										if(settings.stack[i].ele == element.ele){
											var elemento = settings.stack[i];
											elemento.ele.setMap(null);
											settings.stack.splice(i,1);
											settings.stack.splice(settings.postack,0,elemento);
											settings.postack--;
											break;
										}
									}
								}
								$("#redo-des").css('display','none');
								$("#redo-nodes").css('display','block');
								PRIV.set_resumen();
								PRIV.draw_list();
								self.PUB.verify_geom();
							}
						});
					}
				}
				return fila;
			},
			draw_list: function(){
				if(!settings.noubication){
					var linea = 1;
					var punto = 1;
					$(".content-ubicaciones").children(".listado").children(".bcontent").empty();
					for(i=0; i<=settings.postack; i++){
						if(settings.stack[i].type == "punto"){
							PRIV.listener(i,punto++,linea);
						}
						else
						{
							PRIV.listener(i,punto,linea++);
						}
					}
				}
			},
			listener: function(i,punto,linea){
				if(settings.stack[i].type == "punto"){
					var element = $.extend({}, settings.stack[i]);
					google.maps.event.clearInstanceListeners(element.ele);
					google.maps.event.addListener(element.ele,'click',function(event){
						var infowin = new GEOBOX({
				        	content: INFOPOP({
				        		type: "punto",
								value:{
									name: "Punto "+(punto),
								},
								tremove: function(){
									$.each($.infowindows,function(key,value){
										value.out();
									});
									settings.puntos.splice(settings.puntos.indexOf(element.ele),1);
									for(i=0; i<settings.stack.length; i++){
										if(settings.stack[i].ele == element.ele){
											var elemento = settings.stack[i];
											elemento.ele.setMap(null);
											settings.stack.splice(i,1);
											settings.stack.splice(settings.postack,0,elemento);
											settings.postack--;
											break;
										}
									}
									$("#redo-des").css('display','none');
									$("#redo-nodes").css('display','block');
									PRIV.set_resumen();
									PRIV.draw_list();
								},
								drawtype: settings.type
							}),
					        height: 60,
					        width: 250,
					        close: function(){

					        }
					    });
					    infowin.open(settings.map, element.ele, false, true);
					});
					PRIV.add_list(element, punto);
				}
				else if(settings.stack[i].type == "linea"){
					var element2 = $.extend({}, settings.stack[i]);
					google.maps.event.clearInstanceListeners(element2.ele);
					google.maps.event.addListener(element2.ele,'click',function(event){
						var coord = element2.ele.getPath().getArray();
						var distancia = 0;
						for(i=0; i<(coord.length-2); i++){
							distancia += parseInt(google.maps.geometry.spherical.computeDistanceBetween(coord[i], coord[(i+1)]));
						}
						var infowin = new GEOBOX({
				        	content: INFOPOP({
				        		type: "line",
								value:{
									name: "Linea "+(linea),
									distance: distancia,
								},
								tremove: function(){
									$.each($.infowindows,function(key,value){
										value.out();
									});
									settings.lineas.splice(settings.lineas.indexOf(element2.ele),1);
									for(i=0; i<settings.stack.length; i++){
										if(settings.stack[i].ele == element2.ele){
											var elemento = settings.stack[i];
											elemento.ele.setMap(null);
											settings.stack.splice(i,1);
											settings.stack.splice(settings.postack,0,elemento);
											settings.postack--;
											break;
										}
									}
									$("#redo-des").css('display','none');
									$("#redo-nodes").css('display','block');
									PRIV.set_resumen();
									PRIV.draw_list();
								},
								drawtype: settings.type
							}),
					        height: 80,
					        width: 250,
					        close: function(){
					        }
					    });
						
					    infowin.open(settings.map, element2.ele, true, true);
					});
					PRIV.add_list(element2, linea);
				}
			},
			number_format: function(number, decimals, dec_point, thousands_sep) {
			  
			  number = (number + '')
			    .replace(/[^0-9+\-Ee.]/g, '');
			  var n = !isFinite(+number) ? 0 : +number,
			    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			    s = '',
			    toFixedFix = function(n, prec) {
			      var k = Math.pow(10, prec);
			      return '' + (Math.round(n * k) / k)
			        .toFixed(prec);
			    };
			  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
			  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
			    .split('.');
			  if (s[0].length > 3) {
			    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
			  }
			  if ((s[1] || '')
			    .length < prec) {
			    s[1] = s[1] || '';
			    s[1] += new Array(prec - s[1].length + 1)
			      .join('0');
			  }
			  return s.join(dec);
			},
			set_line_back: function(line){
				settings.lineas.push(line);
				settings.stack[++settings.postack] = {
					ele: line,
					type: "linea"
				};
				settings.stack.splice((settings.postack+1), (settings.stack.length-(settings.postack+1)));
				settings.status = true;
				self.PUB.verify_geom();
			},
			set_point_back: function(punto){
				settings.puntos.push(punto);
				settings.stack[++settings.postack] = {
					ele: punto,
					type: "punto"
				};
				settings.stack.splice((settings.postack+1), (settings.stack.length-(settings.postack+1)));
				settings.status = true;
				self.PUB.verify_geom();
			}
		}
		// METODOS PUBLICOS
		this.PUB = {
			load_state: function(value){
				var spatial = JSON.parse(value.SPATIAL);

				if(spatial.TYPE == "POINT"){
					var COORD = spatial.COORDINATES;
					PRIV.set_point_back(MAPA.PUB.load_marker(COORD[1], COORD[0], {}, true));
				}
				else if(spatial.TYPE == "POLYLINE"){
					var COORD = spatial.COORDINATES;
					var coords = [];
					for(i=0;i<COORD.length;i+=2){
						coords.push(MAPA.PUB.getLatLng(COORD[(i+1)],COORD[i]));
					}
					PRIV.set_line_back(MAPA.PUB.load_polyline(coords, {
						color: '#ff0000',
						weight: 4,
						opacity: 0.5
					}, true));
				}
				else if(spatial.TYPE == "MULTYGEOMETRY"){
					for(i=0;i<spatial.ELEMENTS.length;i++){
						var elemento = spatial.ELEMENTS[i];
						if(elemento.TYPE == "POINT"){
							var COORD = elemento.COORDINATES;
							PRIV.set_point_back(MAPA.PUB.load_marker(COORD[1], COORD[0], {}, true));
						}
						else if(elemento.TYPE == "POLYLINE"){
							var COORD = elemento.COORDINATES;
							var coords = [];
							for(l=0;l<elemento.COORDINATES.length;l+=2){
								coords.push(MAPA.PUB.getLatLng(elemento.COORDINATES[(l+1)],elemento.COORDINATES[l]));
							}
							PRIV.set_line_back(MAPA.PUB.load_polyline(coords, {
								color: '#ff0000',
								weight: 4,
								opacity: 0.5
							}, true));
						}
					}
				}
			},
			set_tool: function(value){
				settings.spatial_tool = value;
			},
			get_code: function(){
				return settings.code;
			},
			set_point: function(punto){
				settings.puntos.push(punto);
				settings.stack[++settings.postack] = {
					ele: punto,
					type: "punto"
				};
				settings.stack.splice((settings.postack+1), (settings.stack.length-(settings.postack+1)));
				settings.status = true;
				self.PUB.verify_geom();
				PRIV.draw_list();
				PRIV.set_resumen();
			},
			set_line: function(line){
				settings.lineas.push(line);
				settings.stack[++settings.postack] = {
					ele: line,
					type: "linea"
				};
				settings.stack.splice((settings.postack+1), (settings.stack.length-(settings.postack+1)));
				settings.status = true;
				self.PUB.verify_geom();
				PRIV.draw_list();
				PRIV.set_resumen();
			},
			undo: function(){
				if(settings.postack >= 0)
				{
					settings.stack[settings.postack].ele.setMap(null);
					if(settings.stack[settings.postack].type == "linea"){
						settings.lineas.splice((settings.lineas.length-1),1);
					}
					else if(settings.stack[settings.postack].type == "punto"){
						settings.puntos.splice((settings.puntos.length-1),1);
					}
					settings.postack--;
					//SINCRONIZAMOS LOS ELEMENTOS EN CASO DE EXISTENCIA Y SE ASIGNAN AL HANDLER 3
					$.SYNC.SYNC(3,"DRAW");
					$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn").css("background", "#CCC");
					$("#uploadBtn").prop("disabled", true);
					$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#CCC");
					//GENERAMOS LAS COMPROBACIONES
					self.PUB.verify_geom();
					PRIV.set_resumen();
					PRIV.draw_list();
					return true;
				}
				else
				{
					return false;
				}
			},
			verify_timeline: function(){
				var status = $.SYNC.STATUS("DRAW");
				if(settings.stack.length > 0 && status != null && status.ID_BUSY == 3){
					if(settings.postack >= 0){
						$("#undo-des").css('display','none');
						$("#undo-nodes").css('display','block');
					}
					if(settings.postack < (settings.stack.length-1)){
						$("#redo-des").css('display','none');
						$("#redo-nodes").css('display','block');
					}
				}
				else{
					$("#undo-des").css('display','block');
					$("#undo-nodes").css('display','none');
					$("#redo-des").css('display','block');
					$("#redo-nodes").css('display','none');
				}
			},
			forward: function(){
				if(settings.postack < (settings.stack.length-1))
				{
					settings.stack[++settings.postack].ele.setMap(settings.map);
					if(settings.stack[settings.postack].type == "linea"){
						settings.lineas.push(settings.stack[settings.postack]);
					}
					else if(settings.stack[settings.postack].type == "punto"){
						settings.puntos.push(settings.stack[settings.postack]);
					}
					//SINCRONIZAMOS LOS ELEMENTOS EN CASO DE EXISTENCIA Y SE ASIGNAN AL HANDLER 3
					$.SYNC.SYNC(3,"DRAW");
					$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn").css("background", "#CCC");
					$("#uploadBtn").prop("disabled", true);
					$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#CCC");
					//GENERAMOS LAS COMPROBACIONES
					self.PUB.verify_geom();
					PRIV.set_resumen();
					PRIV.draw_list();
					return true;
				}
				else{
					return false
				}
			},
			print: function(){
				for(i=0; i< settings.lineas.length; i++)
				{
					settings.lineas[i].setMap(settings.map);
				}
				for(i=0; i< settings.puntos.length; i++)
				{
					settings.puntos[i].setMap(settings.map);
				}
				PRIV.draw_list();
				PRIV.set_resumen();
				if(self.PUB.verify_geom()){
					$("#guardargeom").addClass("verde");
				}
				else
				{
					$("#guardargeom").removeClass("verde");
				}
			},
			clear: function(){
				for(i=0; i< settings.lineas.length; i++)
				{
					settings.lineas[i].setMap(null);
				}
				for(i=0; i< settings.puntos.length; i++)
				{
					settings.puntos[i].setMap(null);
				}
			},
			clear_check: function(){
				settings.postack = -1;
				settings.stack = [];
				settings.puntos = [];
				settings.lineas = [];
				self.PUB.clear();
				self.PUB.verify_geom();
				PRIV.set_resumen();
				PRIV.draw_list();
			},
			stack_length: function(){
				return settings.stack.length;
			},
			more_undo: function(){
				if(settings.postack >= 0){
					return true;
				}
				else
				{
					return false;
				}
			},
			more_forward: function(){
				if(settings.postack < (settings.stack.length-1)){
					return true;
				}
				else
				{
					return false;
				}
			},
			verify_geom: function(){
				var status = false;
				if(settings.puntos.length > 0) status = true;
				if(settings.lineas.length > 0) status = true;
				if(status){
					fila.children(".geom").removeClass("rojo").addClass("verde");
					return true;
				}
				else
				{
					fila.children(".geom").removeClass("verde").addClass("rojo");
					//SIN CRONIZAMOS LOS ELEMENTOS Y PERMITIMOS NUEVAMENTE LA ESCRITOURA DE ELEMENTOS EN EL MAPA
					$.SYNC.NEW("DRAW");
					if($.SYNC.STATUS("DRAW").ID_BUSY != 1){
						$.SYNC.FREE(1,"DRAW");
						$.SYNC.FREE(2,"DRAW");
						$.SYNC.FREE(3,"DRAW");
					}
					//CASIGNAMOS LOS COLORES Y DESBLOQUEOS CORRESPONDIENTES A CADA ELEMENTO
					$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn").css("background", "#118BF4");
					$("#uploadBtn").prop("disabled", true);
					$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#118BF4");
					MAPA.PUB.verify_draw();
					$(".kmlfile .visor").html("Archivo KML");
					$("#uploadBtn").prop("disabled",false);
					return false;
				}
			},
			set_noubication: function(value){
				settings.noubication = value;
			},
			remove_point: function(value){
				value.setMap(null);
				settings.puntos.splice(settings.puntos.indexOf(value),1);
				PRIV.draw_list();
				self.PUB.verify_geom();
			},
			get_spatial_send: function(){
				var geom = {
					point: [],
					line: [],
					spatial_tool: settings.spatial_tool
				};
				for(i=0; i< settings.puntos.length; i++)
				{
					var pos = settings.puntos[i].getPosition();
					geom.point.push([pos.lat(),pos.lng()]);
				}
				for(i=0; i< settings.lineas.length; i++)
				{
					var pos = settings.lineas[i].getPath().getArray();
					var temp = [];
					for(l=0;l<pos.length; l++){
						temp.push([pos[l].lat(),pos[l].lng()]);
					}
					geom.line.push(temp);
				}
				return geom;
			},
			get_spatial_info: function(){
				return settings;
			},
			compare: function(geom){
				var geoms = geom.PUB.get_spatial_send();
				if(self.PUB.get_spatial_send() == geoms){
					return true;
				}
				else
				{
					return false;
				}
			},
			set_geom: function(geom){
				var geoms =  JSON.parse(JSON.stringify(geom.PUB.get_spatial_info()));
				for(i=0;i<geoms.lineas.length;i++){
					var coord = geoms.lineas[i].getPath();
					var polyline = new google.maps.Polyline({
						path: coord,
						map: null,
						strokeColor: '#ff0000',
						strokeWeight: 4,
						strokeOpacity: 0.5,
						clickable: true
					});
					self.PUB.set_line(polyline);
				}
				for(i=0;i<geoms.puntos.length;i++){
					var coord = geoms.puntos[i].getPosition();
					var marker = new google.maps.Marker({
						position: coord,
						map: null,
						draggable: true
					});
					self.PUB.set_point(marker);
				}
				settings.status = true;
				self.PUB.verify_geom();
			},
			set_type: function(typec){
				settings.type = typec;
			}
		}
		_CONSTRUCT(fila, value, code);
	}
})();