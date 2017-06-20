(function($){
	GEOCGR = function(args){
		//SETTINGS
		var self = this;
		var settings = {
			dpa: 0,	//0: comunal, 1: provincial
			region: null,
			dpalvl:0, //0 Pais, 1: Region, 2: Provincial, 3: comunal, 4:obra
			footer: true,
			actual: null,
			regionactual: null,
			provinciaactual: null,
			comunaactual: null,
			infowin_height:250,
			infowin_width:400,
			fromSearchObraDirecta: null,
			datesChanged: false
		};
		// DEFINIMOS EL CONSTRUCTOR
		var constructor = function(){
			console.log("Inicializador GEOCGR - Cargado");
			if($.cookie("modal-ini") == null || $.cookie("modal-ini") == 0 || $.cookie("modal-ini") == "null" || typeof $.cookie("modal-ini") == "undefined"){
				$("#modal1").show();
			}else{
				$("#checkcookie").attr("checked", "checked");
				$("#checkcookie").attr("data-cookie",1);
			}
			PRIV.setup_date();
			PRIV.set_date_init_header();
			_SET_LEYEND();
			
		};
		//DEFINIMOS EL COMPORTAMIENTO DE LA LEYENDA.
		var _SET_LEYEND = function(){
			// NIVEL CATASTRAL
			LEYENDA.SET_LEYEND_TYPE("CATASTRAL",true);
			LEYENDA.ADD_LEYEND("CATASTRAL", "#74C2E1");
			LEYENDA.ADD_LEYEND("CATASTRAL", "#0191C8");
			LEYENDA.ADD_LEYEND("CATASTRAL", "#004a80");
			LEYENDA.ADD_SPECIAL_LEYEND("CATASTRAL", "#FFFFFF", "MULTI");
			LEYENDA.ADD_SPECIAL_LEYEND("CATASTRAL", {
				"USED":"CIU/public_html/images/sedeconsistorial_used.png",
				"UNUSED": "CIU/public_html/images/sedeconsistorial.png" }, "SEDE");
			// NIVEL CARTOGRAFICO 
			LEYENDA.SET_LEYEND_TYPE("CARTOGRAFICO",false);
			LEYENDA.ADD_LEYEND("CARTOGRAFICO", "#C1E9FF");
			LEYENDA.ADD_LEYEND("CARTOGRAFICO", "#93A7F1");
			LEYENDA.ADD_LEYEND("CARTOGRAFICO", "#626FE3");
			LEYENDA.ADD_LEYEND("CARTOGRAFICO", "#3137D5");
			LEYENDA.ADD_LEYEND("CARTOGRAFICO", "#0000A0");
			LEYENDA.SET_ELEMENT_TYPE("LINE", function(color){ return {"CONTENT":color, "BORDER": "#FFF"} });
			LEYENDA.SET_ELEMENT_TYPE("SEDE", function(color){ return color; });
			LEYENDA.SET_ELEMENT_TYPE("MLINE", function(color){ return {"CONTENT":color, "BORDER": "#333"} });
			LEYENDA.SET_ELEMENT_TYPE("POINT", function(color){ 
				return {
			      	path: google.maps.SymbolPath.CIRCLE,
			      	scale: 8,
				  	strokeWeight: 1,
				  	strokeColor: "#FFF",
				  	fillColor: color,
				  	fillOpacity: 1
			    };
			});
			LEYENDA.SET_ELEMENT_TYPE("MPOINT", function(color){ 
				return {
			      	path: google.maps.SymbolPath.CIRCLE,
			      	scale: 8,
				  	strokeWeight: 1,
				  	strokeColor: "#333",
				  	fillColor: color,
				  	fillOpacity: 1
			    };
			});
		};
		// DEFINIMOS LOS QUINTILES
		var q = {
			q0:$("#leyenda-color #q1").css("background-color"),
			q1:$("#leyenda-color #q1").css("background-color"),
			q2:$("#leyenda-color #q2").css("background-color"),
			q3:$("#leyenda-color #q3").css("background-color"),
			q4:$("#leyenda-color #q4").css("background-color"),
			q5:$("#leyenda-color #q5").css("background-color")
		};
		// DEFINIMOS LOS ICONOS SEGUN TRAMO
		
		var marker_icon = {
			"0": {
		      	path: google.maps.SymbolPath.CIRCLE,
		      	scale: 8,
			  	strokeWeight: 1,
			  	strokeColor: "#FFF",
			  	fillColor: "#74C2E1",
			  	fillOpacity: 1
		    },
			"1": {
		      	path: google.maps.SymbolPath.CIRCLE,
		      	scale: 8,
			  	strokeWeight: 1,
			  	strokeColor: "#FFF",
			  	fillColor: "#74C2E1",
			  	fillOpacity: 1
		    },
			"2": {
		     	path: google.maps.SymbolPath.CIRCLE,
		      	scale: 8,
			  	strokeWeight: 1,
			  	strokeColor: "#FFF",
			  	fillColor: "#0191C8",
			  	fillOpacity: 1
		    },
			"3": {
				path: google.maps.SymbolPath.CIRCLE,
		      	scale: 8,
			  	strokeWeight: 1,
			  	strokeColor: "#FFF",
			  	fillColor: "#004a80",
			  	fillOpacity: 1
		    },
			"MULTI": {
				path: google.maps.SymbolPath.CIRCLE,
		      	scale: 8,
			  	strokeWeight: 1,
			  	strokeColor: "#000",
			  	fillColor: "#FFFFFF",
			  	fillOpacity: 1
		    },
		    "CHANGE":{
				path: google.maps.SymbolPath.CIRCLE,
		      	scale: 8,
			  	strokeWeight: 1,
			  	strokeColor: "#FFF",
			  	fillColor: "#FF9C00",
			  	fillOpacity: 1
		    },
		    "SEDE": "CIU/public_html/images/sedeconsistorial.png",
		    "SEDEUSED": "CIU/public_html/images/sedeconsistorial_used.png"
		};
		// DEFINIMOS LOS ICONOS SEGUN TRAMO
		var line_color = {
			"0": "#74C2E1",
			"1": "#74C2E1",
			"2": "#0191C8",
			"3": "#004a80",
			"MULTI": "#FFFFFF"
		};
		// CAPAS
		var LAYERS = {};
		// INFORMES CARTOGRAFIA
		var nac = {};
		var regcomu = {	};
		var regprovi = {};
		var comu = [];
		var delimitacion = null;
		var provenc = [];
		// VARIABLES DEL SWITCH
		var NUMPROV = null;
		var NUMCOM = null;
		var INFOWINACT = null;
		var regionesSpatialInfo = {};
		var provinciasSpatialInfo = {};
		var provComuRegionesConsultadas = {};
		var comunasSpatialInfo = {};
		// DEFINIMOS LOS METODOS startup
		var startup = {
			//CREAMOS LA FUNCION QUE ENTREGA LA METADATA DE LA CARTOGRAFIA DISPONIBLE
			metadata_cartografica: function(data){
				var METADATA ={
					_TOTAL_MONTO: 0.5,
					_NUM_OBRAS: 0,
					_MAX_MONTO: 0.5,
					_TOTAL_MONTO_CLASI: 0
				};
				var METADATA_READY = [];
				for(i=0;i<data.length;i++){
					if(METADATA_READY.indexOf(data[i].NUMERO) > -1) continue;
					data[i] = self.SWITCH.getDataBySwitch(data[i]);
					METADATA._TOTAL_MONTO += data[i].MONTO_CONTRATADO;
					METADATA._NUM_OBRAS += data[i].NUMOBRAS;
					if(METADATA._MAX_MONTO < data[i].MONTO_CONTRATADO) METADATA._MAX_MONTO = data[i].MONTO_CONTRATADO;
					METADATA_READY.push(data[i].NUMERO);
				}
				return METADATA;
			},
			get_regional: function(_RANKING,callbackdpa){
				POP.PUB.hide();
				LEYENDA.RENDER("CARTOGRAFICO");
				$("#ranking .listado_obras").html('<div>Obras de Mayor Inversi&oacute;n</div>');
				LOADING.show("Cargando Cartograf&iacute;a, Espere por favor...");
				PRIV.setDpa("pais");
				GEA.PUB.setDatesChanged(false);
				
				var METADATA;
				SOCKET.request({
					request: "regiones/get",
					data:{
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET",
						ADDSPATIALINFO: (regionesSpatialInfo['01'] == undefined)?"TRUE":"FALSE"	
					}, 
					callback:function(response){
						DATA.PUB.clear_poly_spa();
						var polyregion = {};
						LAYERS['REGION'] = response.regiones;

						METADATA = startup.metadata_cartografica(response.regiones);
						//SE ITERA LAS REGIONES PARA RENDERIZAR EL MAPA.
						$.each(response.regiones, function(key,value){
							var VALUE_OF = value;
							value = self.SWITCH.getDataBySwitch(value);
							nac[value.NUMERO] = value;
							
							if(regionesSpatialInfo[value.NUMERO] == undefined){
								var coordenadas = JSON.parse(value.SPATIAL_OBJECT);
								regionesSpatialInfo[value.NUMERO] = value.SPATIAL_OBJECT;
							}else{
								var coordenadas = JSON.parse(regionesSpatialInfo[value.NUMERO]);
							}
							
							$.each(coordenadas, function(llave,valor){
								var poligono = [];
								for(l=0; l<valor.length; l+=2){
									poligono.push(new google.maps.LatLng(valor[(l)],valor[l+1]));
								}
								var reg = DATA.PUB.add_polygon({
									element: MAPA.publics.load_polygon(poligono,
									{
										rellenocolor: q["q"+Math.ceil((value.MONTO_CONTRATADO/METADATA._MAX_MONTO)*5)],
										events:{
											'mouseover': function(e){
												ETIPOP.PUB.hide();
												ETIPOP.PUB.update((value.MONTO_CONTRATADO/METADATA._TOTAL_MONTO)*100);
												ETIPOP.PUB.pos(e);
												ETIPOP.PUB.setTitle(value.NOMBRE);
												ETIPOP.PUB.setValue(value.MONTO_CONTRATADO);
												ETIPOP.PUB.setNumObras(value.NUMOBRAS,1);
												ETIPOP.PUB.setNumMultiObras(value.MULTIREG,1);
												var F_ADJU="";
												var F_TRAZON="";
												if(value.FECHA_ADJU != undefined){
													F_ADJU = new Date(value.FECHA_ADJU.replace(" ","T"));
												}	
												if(value.F_TRAZON != undefined){
													F_TRAZON = new Date(value.FECHA_TRAZON.replace(" ","T"));
												}	
												if(F_ADJU != "" && F_TRAZON != ""){
													if(F_ADJU > F_TRAZON){
														ETIPOP.PUB.setNumLastMod(F_ADJU.getDate()+"/"+(F_ADJU.getMonth()+1)+"/"+F_ADJU.getFullYear());
													}
													else
													{
														ETIPOP.PUB.setNumLastMod(F_TRAZON.getDate()+"/"+(F_TRAZON.getMonth()+1)+"/"+F_TRAZON.getFullYear());
													}
												}else{
													if(F_ADJU != ""){
														ETIPOP.PUB.setNumLastMod(F_ADJU.getDate()+"/"+(F_ADJU.getMonth()+1)+"/"+F_ADJU.getFullYear());
													}else if (F_TRAZON != ""){
														ETIPOP.PUB.setNumLastMod(F_TRAZON.getDate()+"/"+(F_TRAZON.getMonth()+1)+"/"+F_TRAZON.getFullYear());
													}else{
														ETIPOP.PUB.setNumLastMod("-");
													}
												}	
												ETIPOP.PUB.show();
												$.each(polyregion[value.NUMERO], function(llave,polygon){
													polygon.element.setOptions({
														strokeColor: "#FA9747",
														fillColor: "#FA9747"
													});
												});
											},
											'mouseout': function(e){
												ETIPOP.PUB.hide();
												$.each(polyregion[value.NUMERO], function(llave,polygon){
													polygon.element.setOptions({
														strokeColor: "#333333",
														fillColor: q["q"+Math.ceil((value.MONTO_CONTRATADO/METADATA._MAX_MONTO)*5)]
													});
												});
											},
											'click': function(){
												settings.region = value;
												if(settings.dpa == 0){
													startup.get_comunal(response.regiones,VALUE_OF);
												}
												else if(settings.dpa == 1){
													startup.get_provincial(response.regiones,VALUE_OF);
												}
											}
										}
									})
								}, true, value.FIT);
								if(typeof polyregion[value.NUMERO] == "undefined"){
									polyregion[value.NUMERO] = [];	
								}
								polyregion[value.NUMERO].push(reg);
							});
						});
						LOADING.hide();
						MAPA.publics.fit_to_content();
						MAPA.publics.setCenter(_CONFIG._MAP.LAT,_CONFIG._MAP.LNG);
						MAPA.publics.setZoom(4);
						// cargamos las clasificaciones
						SOCKET.request({
							request: "clasificacion/getNacional",
							data:{
								MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
								MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
							},
							callback:function(response){
								var aux = self.SWITCH.clasificacion(response);
								//AGREGAMOS LA 
								//CARGAMOS LOS DATOS DE STAT EN EL HEADER
								$("#inversiontotal").children('.data').html("$ "+PRIV.number_format((METADATA._TOTAL_MONTO==0.5)?0:METADATA._TOTAL_MONTO,0,"","."));
								$("#numobras").children('.data').html(PRIV.number_format((METADATA._NUM_OBRAS==0.5)?0:METADATA._NUM_OBRAS,0,"","."));
								GRAFICOPANEL.PUB.make(aux,METADATA);
							},
							buffered: true
						});
					},
					buffered: true
				});
				
				if(_RANKING){
					SOCKET.request({
						request: "ranking/getNacional",
						data:{
							MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
							MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
						}, 
						callback:function(response){
							var aux = response;
							RANK.PUB.set(aux);
						},
						buffered: true
					});
				}
				SOCKET.request({
					request: "clasificacion/getAllRegClasi",
					data:{MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						  MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"},
					callback:function(response){
						for(i=0; i<response.length;i++){
							if(typeof nac[response[i].REGION]["CLASIFICACIONES"] == "undefined") nac[response[i].REGION]["CLASIFICACIONES"] = [];
							nac[response[i].REGION]["CLASIFICACIONES"].push(response[i]);
						}
					},
					buffered: true
				});
				if(typeof callbackdpa != "undefined") callbackdpa();
				GEA.PUB.postAdvSearch();
			},
			get_provincial: function(UPPER_LAYERS,UPPER_LAYER){
				POP.PUB.hide();
				$("#ranking .listado_obras").html('<div>Listado Total de Obras</div>');
				var UPPER_LAYER = self.SWITCH.getDataBySwitch(UPPER_LAYER);
				var UPPER_METADATA = startup.metadata_cartografica(UPPER_LAYERS);

				settings.regionactual = UPPER_LAYER;
				//CARGAMOS GRAFIC DE REPORTE COMUNAL
				GRAFICOPDF = new GRAFICOCLA({
					container: $("#grafico_pdf_info")
				});
				var centro = JSON.parse(UPPER_LAYER.CENTROIDE);
				LOADING.show("Cargando Cartograf&iacute;a, Espere por favor...");
				ETIPOP.PUB.hide();
				PRIV.setDpa("region");
				var METADATA;
				SOCKET.request({
					request: "provincia/getregion", 
					data:{
						REGION: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET",
						ADDSPATIALINFO: (provComuRegionesConsultadas[UPPER_LAYER.NUMERO] == undefined)?"TRUE":"FALSE"
					},
					callback:function(response){
						LAYERS['PROVINCIAS'] = response.PROVINCIAS;
						METADATA = startup.metadata_cartografica(response.PROVINCIAS);
						RESUPOP.PUB.RESTORE_LVL();
						RESUPOP.PUB.SET_REGIONAL(UPPER_LAYER,UPPER_METADATA);
						DATA.PUB.clear_poly_spa();
						regprovi = {};
						
						if(provComuRegionesConsultadas[UPPER_LAYER.REGION] == undefined){
							provComuRegionesConsultadas[UPPER_LAYER.REGION] = "YES";
						}	
						
						$.each(response.PROVINCIAS,function(key,value){
							var VALUE_OF = value;
							value = self.SWITCH.getDataBySwitch(value);
							regprovi[value.NUMERO] = value;
							
							if(provinciasSpatialInfo[value.NUMERO+"_"+value.FIT] == undefined){
								var coordenadas = JSON.parse(value.SPATIAL_OBJECT);
								provinciasSpatialInfo[value.NUMERO+"_"+value.FIT] = value.SPATIAL_OBJECT;
							}else{
								var coordenadas = JSON.parse(provinciasSpatialInfo[value.NUMERO+"_"+value.FIT]);
							}
							//var coordenadas = JSON.parse(value.SPATIAL_OBJECT);
							
							var polyprov = [];
							var colorprov = [];
							$.each(coordenadas, function(llave,valor){
								var poligono = [];
								for(l=0; l<valor.length; l+=2){
									poligono.push(new google.maps.LatLng(valor[(l)],valor[l+1]));
								}
								polyprov.push(poligono);
								var prov = DATA.PUB.add_polygon({
									element: MAPA.publics.load_polygon(poligono,
									{
										rellenocolor: q["q"+Math.ceil((value.MONTO_CONTRATADO/METADATA._MAX_MONTO)*5)],
										events:{
											'mouseover': function(e){
												ETIPOP.PUB.hide();
												ETIPOP.PUB.update(Math.floor(value.MONTO_CONTRATADO/METADATA._TOTAL_MONTO*100));
												ETIPOP.PUB.pos(e);
												ETIPOP.PUB.setTitle(value.NOMBRE);
												ETIPOP.PUB.setValue(value.MONTO_CONTRATADO);
												ETIPOP.PUB.setNumObras(value.NUMOBRAS,3);
												ETIPOP.PUB.setNumMultiObras(value.MULTIPROV,3);
												var F_ADJU="";
												var F_TRAZON="";
												if(value.FECHA_ADJU != undefined){
													F_ADJU = new Date(value.FECHA_ADJU.replace(" ","T"));
												}	
												if(value.F_TRAZON != undefined){
													F_TRAZON = new Date(value.FECHA_TRAZON.replace(" ","T"));
												}	
												if(F_ADJU != "" && F_TRAZON != ""){
													if(F_ADJU > F_TRAZON){
														ETIPOP.PUB.setNumLastMod(F_ADJU.getDate()+"/"+(F_ADJU.getMonth()+1)+"/"+F_ADJU.getFullYear());
													}
													else
													{
														ETIPOP.PUB.setNumLastMod(F_TRAZON.getDate()+"/"+(F_TRAZON.getMonth()+1)+"/"+F_TRAZON.getFullYear());
													}
												}else{
													if(F_ADJU != ""){
														ETIPOP.PUB.setNumLastMod(F_ADJU.getDate()+"/"+(F_ADJU.getMonth()+1)+"/"+F_ADJU.getFullYear());
													}else if (F_TRAZON != ""){
														ETIPOP.PUB.setNumLastMod(F_TRAZON.getDate()+"/"+(F_TRAZON.getMonth()+1)+"/"+F_TRAZON.getFullYear());
													}else{
														ETIPOP.PUB.setNumLastMod("-");
													}
												}	
												ETIPOP.PUB.show();
												$.each(colorprov, function(llave,polygon){
													polygon.element.setOptions({
														strokeColor: "#FA9747",
														fillColor: "#FA9747"
													});
												});
											},
											'mouseout': function(){
												ETIPOP.PUB.hide();
												$.each(colorprov, function(llave,polygon){
													polygon.element.setOptions({
														strokeColor: "#333333",
														fillColor: q["q"+Math.ceil((value.MONTO_CONTRATADO/METADATA._MAX_MONTO)*5)]
													});
												});
											},
											'click': function(){
												LOADING.show("Cargando Cartograf&iacute;a y Elementos, Espere por favor...");
												PRIV.setDpa("provincia");
												startup.getProvinciaObras(response.PROVINCIAS, VALUE_OF, polyprov);
												ETIPOP.PUB.hide();
											}
										}
									})
								}, true, value.FIT);
								colorprov.push(prov);
							});
							if((response.PROVINCIAS.length -1) == key){
								SOCKET.request({
									request: "clasificacion/getAllProvincial",
									data:{
										REGION: UPPER_LAYER.NUMERO,
										MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
										MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
									},
									callback:function(response){
									},
									buffered: true
								});
							}
						});
						LOADING.hide();
						MAPA.publics.fit_to_content();
						SOCKET.request({
							request: "clasificacion/getRegional",
							data:{
								REGION: UPPER_LAYER.NUMERO,
								MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
								MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
							},
							callback:function(response){
								var aux = self.SWITCH.clasificacion(response);
								GRAFICOPANEL.PUB.make(aux,METADATA);
								GRAFICOPDF.PUB.make(aux,METADATA);
							},
							buffered: true
						});
					},
					buffered: true
				});
				SOCKET.request({
					request: "ranking/getRegional",
					data:{
						REGION: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
						//var aux = self.SWITCH.ranking(response);
						var aux = response;
						var totalobras = 0;
						var numobras = 0;
						for(i=0; i<aux.length; i++){
							totalobras += aux[i].MONTO_CONTRATADO;
							numobras += aux[i].NUMOBRAS;
						}
						//AGREGAMOS LA 
						//CARGAMOS LOS DATOS DE STAT EN EL HEADER
						RANK.PUB.set(aux);
					},
					buffered: true
				});
				SOCKET.request({
					request: "clasificacion/getNacional",
					callback:function(response){
						var METADATA = startup.metadata_cartografica(LAYERS['REGION']);
						$("#inversiontotal").children('.data').html("$ "+PRIV.number_format((METADATA._TOTAL_MONTO==0.5)?0:METADATA._TOTAL_MONTO,0,"","."));
						$("#numobras").children('.data').html(PRIV.number_format((METADATA._NUM_OBRAS==0.5)?0:METADATA._NUM_OBRAS,0,"","."));
					},
					buffered: true
				});
				GEA.PUB.postAdvSearch();
			},
			get_comunal: function(UPPER_LAYERS,UPPER_LAYER){
				POP.PUB.hide();
				$("#ranking .listado_obras").html('<div>Listado Total de Obras</div>');
				var UPPER_LAYER = self.SWITCH.getDataBySwitch(UPPER_LAYER);
				var UPPER_METADATA = startup.metadata_cartografica(UPPER_LAYERS);
				settings.regionactual = UPPER_LAYER;
				//CARGAMOS GRAFIC DE REPORTE COMUNAL
				GRAFICOPDF = new GRAFICOCLA({
					container: $("#grafico_pdf_info")
				});
				//DERIVAMOS LA SIGUIENTES DIRECTRICES
				var centro = JSON.parse(UPPER_LAYER.CENTROIDE);
				LOADING.show("Cargando Cartograf&iacute;a, Espere por favor...");
				ETIPOP.PUB.hide();
				PRIV.setDpa("region");
				GEA.PUB.postAdvSearch();
				var METADATA;
				var UPPER_METADATA;
				SOCKET.request({
					request: "comuna/getregion", 
					data:{
						REGION: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET",
						ADDSPATIALINFO: (provComuRegionesConsultadas[UPPER_LAYER.NUMERO] == undefined)?"TRUE":"FALSE"
					},
					callback:function(response){
						LAYERS['COMUNAS'] = response.COMUNAS;
						METADATA = startup.metadata_cartografica(response.COMUNAS);
						RESUPOP.PUB.SET_REGIONAL(UPPER_LAYER,UPPER_METADATA);
						DATA.PUB.clear_poly_spa();
						RESUPOP.PUB.setSubGrafico("Del total Nacional");
						regcomu = {};
						
						if(provComuRegionesConsultadas[UPPER_LAYER.REGION] == undefined){
							provComuRegionesConsultadas[UPPER_LAYER.REGION] = "YES";
						}
						
						$.each(response.COMUNAS,function(key,value){
							var VALUE_OF = value;
							value = self.SWITCH.getDataBySwitch(value);
							regcomu[value.NUMERO] = value;
							
							if(comunasSpatialInfo[value.NUMERO] == undefined){
								var coordenadas = JSON.parse(value.SPATIAL_OBJECT);
								comunasSpatialInfo[value.NUMERO] = value.SPATIAL_OBJECT;
							}else{
								var coordenadas = JSON.parse(comunasSpatialInfo[value.NUMERO]);
							}
							//var coordenadas = JSON.parse(value.SPATIAL_OBJECT);
							var comupoly = [];
							var colorcom = [];
							$.each(coordenadas, function(llave,valor){
								var poligono = [];
								for(l=0; l<valor.length; l+=2){
									poligono.push(new google.maps.LatLng(valor[(l)],valor[l+1]));
								}
								comupoly.push(poligono);
								var com = DATA.PUB.add_polygon({
									element: MAPA.publics.load_polygon(poligono,
									{
										rellenocolor: q["q"+Math.ceil((value.MONTO_CONTRATADO/METADATA._MAX_MONTO)*5)],
										events:{
											'mouseover': function(e){
												ETIPOP.PUB.hide();
												ETIPOP.PUB.update(Math.floor(value.MONTO_CONTRATADO/METADATA._TOTAL_MONTO*100));
												ETIPOP.PUB.pos(e);
												ETIPOP.PUB.setTitle(value.NOMBRE);
												ETIPOP.PUB.setValue(value.MONTO_CONTRATADO);
												ETIPOP.PUB.setNumObras(value.NUMOBRAS,2);
												ETIPOP.PUB.setNumMultiObras(value.MULTICOM,2);
												var F_ADJU="";
												var F_TRAZON="";
												if(value.FECHA_ADJU != undefined){
													F_ADJU = new Date(value.FECHA_ADJU.replace(" ","T"));
												}	
												if(value.F_TRAZON != undefined){
													F_TRAZON = new Date(value.FECHA_TRAZON.replace(" ","T"));
												}	
												if(F_ADJU != "" && F_TRAZON != ""){
													if(F_ADJU > F_TRAZON){
														ETIPOP.PUB.setNumLastMod(F_ADJU.getDate()+"/"+(F_ADJU.getMonth()+1)+"/"+F_ADJU.getFullYear());
													}
													else
													{
														ETIPOP.PUB.setNumLastMod(F_TRAZON.getDate()+"/"+(F_TRAZON.getMonth()+1)+"/"+F_TRAZON.getFullYear());
													}
												}else{
													if(F_ADJU != ""){
														ETIPOP.PUB.setNumLastMod(F_ADJU.getDate()+"/"+(F_ADJU.getMonth()+1)+"/"+F_ADJU.getFullYear());
													}else if (F_TRAZON != ""){
														ETIPOP.PUB.setNumLastMod(F_TRAZON.getDate()+"/"+(F_TRAZON.getMonth()+1)+"/"+F_TRAZON.getFullYear());
													}else{
														ETIPOP.PUB.setNumLastMod("-");
													}
												}	
												ETIPOP.PUB.show();
												$.each(colorcom, function(llave,polygon){
													polygon.element.setOptions({
														strokeColor: "#FA9747",
														fillColor: "#FA9747"
													});
												});
											},
											'mouseout': function(){
												ETIPOP.PUB.hide();
												$.each(colorcom, function(llave,polygon){
													polygon.element.setOptions({
														strokeColor: "#333333",
														fillColor: q["q"+Math.ceil((value.MONTO_CONTRATADO/METADATA._MAX_MONTO)*5)]
													});
												});
											},
											'click': function(){
												LOADING.show("Cargando Cartograf&iacute;a y Elementos, Espere por favor...");
												PRIV.setDpa("comuna");
												startup.getComunaObras(response.COMUNAS,VALUE_OF,comupoly);
												ETIPOP.PUB.hide();											
											}
										}
									})
								}, true, value.FIT);
								colorcom.push(com);
							});
							if((response.COMUNAS.length -1) == key){
								SOCKET.request({
									request: "clasificacion/getAllComunal",
									data:{
										REGION: UPPER_LAYER.NUMERO,
										MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
										MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
									},
									callback:function(response){
									},
									buffered: true
								});
							}
						});
						LOADING.hide();
						MAPA.publics.fit_to_content();
						SOCKET.request({
							request: "clasificacion/getRegional",
							data:{
								REGION: UPPER_LAYER.NUMERO,
								MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
								MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
							},
							callback:function(response){
								var aux = self.SWITCH.clasificacion(response);
								GRAFICOPANEL.PUB.make(aux,METADATA);
								GRAFICOPDF.PUB.make(aux,METADATA);
							},
							buffered: true
						});
					},
					buffered: true
				});
				SOCKET.request({
					request: "ranking/getRegional",
					data:{
						REGION: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
						var aux = response;
						RANK.PUB.set(aux);
					},
					buffered: true
				});
				SOCKET.request({
					request: "clasificacion/getNacional",
					callback:function(response){
						var METADATA = startup.metadata_cartografica(LAYERS['REGION']);
						$("#inversiontotal").children('.data').html("$ "+PRIV.number_format((METADATA._TOTAL_MONTO==0.5)?0:METADATA._TOTAL_MONTO,0,"","."));
						$("#numobras").children('.data').html(PRIV.number_format((METADATA._NUM_OBRAS==0.5)?0:METADATA._NUM_OBRAS,0,"","."));
					},
					buffered: true
				});
				GEA.PUB.postAdvSearch();
			},
			getProvinciaObras: function(UPPER_LAYERS,UPPER_LAYER,polyprov){
				POP.PUB.hide();
				LEYENDA.RENDER("CATASTRAL");
				$("#ranking .listado_obras").html('<div>Listado Total de Obras</div>');
				var UPPER_LAYER = self.SWITCH.getDataBySwitch(UPPER_LAYER);
				var UPPER_METADATA = startup.metadata_cartografica(UPPER_LAYERS);
				DATA.PUB.clear_lines();
				DATA.PUB.clear_markers();
				NUMPROV = UPPER_LAYER;
				SOCKET.request({
					request: "obras/getObrasProvincia", 
					data:{
						PROVINCIA: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
						RESUPOP.PUB.SET_PROVINCIAL(UPPER_LAYER,UPPER_METADATA,response.OBRAS);
						if(response.OBRAS.length == 0){
							LOADING.hide();
						}
						provenc = [];
						provence = {};
						MCLUSTER.PUB.clear();
						//DEFINIREMOS UN OBEJTO PARA ALMACENAR LOS ELEMENTOS
						var proyectos = {}; 
						var co = 0;
						//var to = Object.keys(response.OBRAS).length;
						var to =UPPER_LAYER.NUMOBRAS
						var MAX_OBRA_MONTO = 0;
						for(f=0;f<response.OBRAS.length;f++){
							if(response.OBRAS[f].MONTO_CONTRATADO > MAX_OBRA_MONTO)
							{
								MAX_OBRA_MONTO = response.OBRAS[f].MONTO_CONTRATADO; 
							}
						}
						$.each(response.OBRAS, function(key,valueobra){
							if(typeof proyectos[valueobra.CODPROYECTO] != "undefined"){
							//	to--;
								if(co == to)
								{
									LOADING.hide();
									for(key in provence){
										provenc.push(provence[key]);
									}
								}
								return;
							}
							else
							{
								proyectos[valueobra.CODPROYECTO] = true;
								valueobra.C_CLAS = Math.ceil(valueobra.MONTO_CONTRATADO/(MAX_OBRA_MONTO/3));
								provence[valueobra.CODPROYECTO] = valueobra;
							}
							var spatial = JSON.parse(valueobra.SPATIAL_OBJECT);

							if(spatial.TYPE == "POINT"){														
								var icono = (valueobra.MULTIPROV > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MPOINT","MULTI"): (valueobra.SPATIAL_TOOL == "NOUBICATION")? LEYENDA.GET_SPECIAL_ELEMENT("SEDE","SEDE"):LEYENDA.GET_ELEMENT("POINT",valueobra.MONTO_CONTRATADO,MAX_OBRA_MONTO);
								var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono,valueobra, "P", UPPER_LAYER, UPPER_METADATA);
								MAPA_GRILLA.ADD_POINT(spatial.COORDINATES[1],spatial.COORDINATES[0],GELEMENT);
							}
							else if(spatial.TYPE == "POLYLINE"){
							    var coordenadas_array = [];
							    for(k=0; k<spatial.COORDINATES.length; k+=2){
							    	coordenadas_array.push(MAPA.publics.getLatLng(spatial.COORDINATES[k+1], spatial.COORDINATES[k]));
							    }
							    var icono = (valueobra.MULTIPROV > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MLINE","MULTI"): LEYENDA.GET_ELEMENT("LINE",valueobra.MONTO_CONTRATADO,MAX_OBRA_MONTO);
								var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono, valueobra, "P", UPPER_LAYER, UPPER_METADATA);
							    MAPA_GRILLA.ADD_LINE(coordenadas_array,GELEMENT);
							}
							else if(spatial.TYPE == "MULTYGEOMETRY"){
								var _MULTIGEO = MAPA_GRILLA.ADD_MULTIGEO();
								$.each(spatial.ELEMENTS, function(ll,val){
									if(val.TYPE == "POINT"){
										var icono = (valueobra.MULTIPROV > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MPOINT","MULTI"): (valueobra.SPATIAL_TOOL == "NOUBICATION")? LEYENDA.GET_SPECIAL_ELEMENT("SEDE","SEDE"): LEYENDA.GET_ELEMENT("POINT",valueobra.MONTO_CONTRATADO,MAX_OBRA_MONTO);
										var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono, valueobra, "P", UPPER_LAYER, UPPER_METADATA);
										MAPA_GRILLA.ADD_MULTIGEO_POINT(val.COORDINATES[1],val.COORDINATES[0],GELEMENT, _MULTIGEO);
									}
									else if(val.TYPE == "POLYLINE"){
									    var coordenadas_array = [];
									    for(k=0; k<val.COORDINATES.length; k+=2){
									    	coordenadas_array.push(MAPA.publics.getLatLng(val.COORDINATES[k+1], val.COORDINATES[k]));
									    }
									    var icono = (valueobra.MULTIPROV > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MLINE","MULTI"): LEYENDA.GET_ELEMENT("LINE",valueobra.MONTO_CONTRATADO,MAX_OBRA_MONTO);
									    var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono, valueobra, "P", UPPER_LAYER, UPPER_METADATA);
							   	 		MAPA_GRILLA.ADD_MULTIGEO_LINE(coordenadas_array,GELEMENT, _MULTIGEO);
									}
								})
							}
							co++;
							if(co == to)
							{
								LOADING.hide();
								MAPA_GRILLA.RENDER();
								for(key in provence){
									provenc.push(provence[key]);
								}
							}
						});
					},
					buffered: true
				});
				DATA.PUB.clear_poly_spa();
				delimitacion = polyprov;
				$.each(polyprov, function(llave,polygon){
					DATA.PUB.add_line({
						element: MAPA.publics.load_polyline_territorial(polygon, {
							icon: [{
						      	icon: {
								    path: 'M 0,-0.6 0,0.2',
								    strokeOpacity: 1,
								    strokeWeight: 3,
								    strokeColor: "#FA9747"
								},
						     	offset: '0',
						      	repeat: '13px'
						    }],
						    color: "#FFF",
						    strokeWeight: 7
						})
					},true);
				});
				SOCKET.request({
					request: "ranking/getProvincial",
					data:{
						PROVINCIA: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
						//var aux = self.SWITCH.ranking(response);
						var aux = response;
						RANK.PUB.set(aux);
					},
					buffered: true
				});
				SOCKET.request({
					request: "clasificacion/getProvincial",
					data:{
						PROVINCIA: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
						var aux = self.SWITCH.clasificacion(response);
						GRAFICOPANEL.PUB.make(aux,{
							_TOTAL_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_MAX_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_NUM_OBRAS: UPPER_LAYER.NUMOBRAS
						});
						GRAFICOPDF.PUB.make(aux,{
							_TOTAL_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_MAX_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_NUM_OBRAS: UPPER_LAYER.NUMOBRAS
						});
					},
					buffered: true
				});
				SOCKET.request({
					request: "clasificacion/getNacional",
					callback:function(response){
						var METADATA = startup.metadata_cartografica(LAYERS['REGION']);
						$("#inversiontotal").children('.data').html("$ "+PRIV.number_format((METADATA._TOTAL_MONTO==0.5)?0:METADATA._TOTAL_MONTO,0,"","."));
						$("#numobras").children('.data').html(PRIV.number_format((METADATA._NUM_OBRAS==0.5)?0:METADATA._NUM_OBRAS,0,"","."));
					},
					buffered: true
				});
				MAPA.publics.fit_to_content();
				GEA.PUB.postAdvSearch();
			},
			getComunaObras: function(UPPER_LAYERS,UPPER_LAYER,comupoly){
				POP.PUB.hide();
				LEYENDA.RENDER("CATASTRAL");
				$("#ranking .listado_obras").html('<div>Listado Total de Obras</div>');
				var UPPER_LAYER = self.SWITCH.getDataBySwitch(UPPER_LAYER);
				var UPPER_METADATA = startup.metadata_cartografica(UPPER_LAYERS);
				var METADATA = startup.metadata_cartografica(LAYERS['REGION']);
				$("#inversiontotal").children('.data').html("$ "+PRIV.number_format((METADATA._TOTAL_MONTO==0.5)?0:METADATA._TOTAL_MONTO,0,"","."));
				$("#numobras").children('.data').html(PRIV.number_format((METADATA._NUM_OBRAS==0.5)?0:METADATA._NUM_OBRAS,0,"","."));
				DATA.PUB.clear_lines();
				DATA.PUB.clear_markers();
				NUMCOM = UPPER_LAYER;
				SOCKET.request({
					request: "obras/getObrasComuna", 
					data:{
						COMUNA: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
				
						//RESUPOP.PUB.RESTORE_LVL();
						RESUPOP.PUB.SET_COMUNAL(UPPER_LAYER,UPPER_METADATA,response.OBRAS);
						if(response.OBRAS.length == 0){
							LOADING.hide();
						}
						comu = [];
						MCLUSTER.PUB.clear();
						var co = 0;
						var MAX_OBRA_MONTO = 0;
						for(f=0;f<response.OBRAS.length;f++){
							if(response.OBRAS[f].MONTO_CONTRATADO > MAX_OBRA_MONTO)
							{
								MAX_OBRA_MONTO = response.OBRAS[f].MONTO_CONTRATADO; 
							}
						}
						$.each(response.OBRAS,function(key,valueobra){
							co++;
							valueobra.C_CLAS = Math.ceil(valueobra.MONTO_CONTRATADO/(MAX_OBRA_MONTO/3));
							comu.push(valueobra);
							var spatial = JSON.parse(valueobra.SPATIAL_OBJECT);
							if(valueobra.MONTO_CONTRATADO > MAX_OBRA_MONTO) MAX_OBRA_MONTO = valueobra.MONTO_CONTRATADO;
							if(spatial.TYPE == "POINT"){
								var icono = (valueobra.MULTICOM > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MPOINT","MULTI"): (valueobra.SPATIAL_TOOL == "NOUBICATION")? LEYENDA.GET_SPECIAL_ELEMENT("SEDE","SEDE"):LEYENDA.GET_ELEMENT("POINT",valueobra.MONTO_CONTRATADO,MAX_OBRA_MONTO);
								var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono,valueobra, "C", UPPER_LAYER, UPPER_METADATA);
								MAPA_GRILLA.ADD_POINT(spatial.COORDINATES[1],spatial.COORDINATES[0],GELEMENT);
							}
							else if(spatial.TYPE == "POLYLINE"){
								var coordenadas_array = [];
							    for(k=0; k<spatial.COORDINATES.length; k+=2){
							    	coordenadas_array.push(MAPA.publics.getLatLng(spatial.COORDINATES[k+1], spatial.COORDINATES[k]));
							    }

							    var icono = (valueobra.MULTICOM > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MLINE","MULTI"): LEYENDA.GET_ELEMENT("LINE",valueobra.MONTO_CONTRATADO,MAX_OBRA_MONTO);
								var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono, valueobra, "C", UPPER_LAYER, UPPER_METADATA);
							    MAPA_GRILLA.ADD_LINE(coordenadas_array,GELEMENT);
							}
							else if(spatial.TYPE == "MULTYGEOMETRY"){
								var _MULTIGEO = MAPA_GRILLA.ADD_MULTIGEO();
								$.each(spatial.ELEMENTS, function(ll,val){
									if(val.TYPE == "POINT"){
										var icono = (valueobra.MULTICOM > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MPOINT","MULTI"): (valueobra.SPATIAL_TOOL == "NOUBICATION")? LEYENDA.GET_SPECIAL_ELEMENT("SEDE","SEDE"): LEYENDA.GET_ELEMENT("POINT",valueobra.MONTO_CONTRATADO,MAX_OBRA_MONTO);
										var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono, valueobra, "C", UPPER_LAYER, UPPER_METADATA);
										MAPA_GRILLA.ADD_MULTIGEO_POINT(val.COORDINATES[1],val.COORDINATES[0],GELEMENT, _MULTIGEO);
									}
									else if(val.TYPE == "POLYLINE"){
									    coordenadas_array = [];
									    for(k=0; k<val.COORDINATES.length; k+=2){
									    	coordenadas_array.push(new google.maps.LatLng(parseFloat(val.COORDINATES[k+1]), parseFloat(val.COORDINATES[k])));
									    }

									    var icono = (valueobra.MULTICOM > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MLINE","MULTI"): LEYENDA.GET_ELEMENT("LINE",valueobra.MONTO_CONTRATADO,MAX_OBRA_MONTO);
									    var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono, valueobra, "C", UPPER_LAYER, UPPER_METADATA);
							   	 		MAPA_GRILLA.ADD_MULTIGEO_LINE(coordenadas_array,GELEMENT, _MULTIGEO);
									}
								});
								
								ETIPOP.PUB.hide();
							}
							if(co == (response.OBRAS.length)){
								LOADING.hide();
								MAPA_GRILLA.RENDER();
							}
						});
						LOADING.hide();														
					},
					buffered: true
				});
				DATA.PUB.clear_poly_spa();
				delimitacion = comupoly;
				$.each(comupoly, function(llave,polygon){
					DATA.PUB.add_line({
						element: MAPA.publics.load_polyline_territorial(polygon, {
							icon: [{
						      	icon: {
								    path: 'M 0,-0.6 0,0.2',
								    strokeOpacity: 1,
								    strokeWeight: 3,
								    strokeColor: "#FA9747"
								},
						     	offset: '0',
						      	repeat: '13px'
						    }],
						    color: "#FFF",
						    strokeWeight: 7
						})
					},true);
				});
				SOCKET.request({
					request: "ranking/getComunal",
					data:{
						COMUNA: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
						//var aux = self.SWITCH.ranking(response);
						var aux = response;
						RANK.PUB.set(aux);
					},
					buffered: true
				});
				SOCKET.request({
					request: "clasificacion/getComunal",
					data:{
						COMUNA: UPPER_LAYER.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
						var aux = self.SWITCH.clasificacion(response);
						GRAFICOPANEL.PUB.make(aux,{
							_TOTAL_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_MAX_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_NUM_OBRAS: UPPER_LAYER.NUMOBRAS
						});
						GRAFICOPDF.PUB.make(aux,{
							_TOTAL_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_MAX_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_NUM_OBRAS: UPPER_LAYER.NUMOBRAS
						});
					},
					buffered: true
				});
				MAPA.publics.fit_to_content();
				GEA.PUB.postAdvSearch();
			}
		};
		
		// DEFINIMOS METODOS PUBLICOS
		this.PUB = {
			metadata_cartografica: function(req){
				return startup.metadata_cartografica(req);
			},
			_INIT: function(INIT){
				startup.get_regional(INIT);
			},
			_SEARCH: function(MP, callback, callback2){
				LOADING.show("Efectuando b&uacute;squeda, Espere por favor...");
				SOCKET.request({
					request: "obras/getObrasBuscadors", 
					data:{
						SEARCH: MP,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"   
					},
					callback:function(result){	
						if(result.STATUS == 1 || result.STATUS == 2){	
							if(result.OBRAS.length > 1){
								self.PUB.setRegional(false,function(){
									var fields = [];
									for(i=0;i<result.OBRAS.length; i++){
										var value = result.OBRAS[i];
										fields.push([value.TITULO, value.MONTO_CONTRATADO, value.FECHA_INI, value]);
									}
									RANK.PUB.set_search(fields);
									$(".tabpanel div").removeClass("borderdiv");
									$(".tabranking div").addClass("borderdiv");
									$(".panel-item").hide();
									$("#ranking .listado_obras").hide();
									$("#ranking #erasesearch").show();
									$("#ranking").show();
									LOADING.hide();
									if(typeof callback2 != "undefined") callback2();
								});
							}	
							else
							{
								GEA.PUB.search(result, true);
							}
						}
						else
						{
							LOADING.hide();
							callback();
						}
					}
				});
			},
			getObra: function(){
				return settings.actual;
			},
			setRegional: function(ranking,callback){
				settings.dpalvl == 0;
				startup.get_regional(ranking,callback);
			},
			setComunal: function(){
				if(settings.dpalvl < 2){
					settings.dpa = 0;
					if(settings.region != null && settings.dpalvl == 1){
						startup.get_comunal(LAYERS['REGION'],settings.region);
					}
					return true;
				}
				return false;
			},
			setProvincial: function(){
				if(settings.dpalvl < 2){
					settings.dpa = 1;
					if(settings.region != null && settings.dpalvl == 1){
						startup.get_provincial(LAYERS['REGION'],settings.region);
					}
					return true;
				}
				return false;
			},
			get_regcomu: function(){
				return regcomu;
			},
			get_regprovi: function(){
				return regprovi;
			},
			get_comu: function(){
				return comu;
			},
			get_provi: function(){
				return provenc;
			},
			get_obra_actual: function(){
				return settings.actual;
			},
			get_dpalvl: function(){
				return settings.dpalvl;
			},
			get_dpa: function(){
				return settings.dpa;
			},
			get_delimitacion: function(){
				return delimitacion;
			},	
			dpaChile: function(){
				if(settings.dpalvl != 0){
					settings.dpalvl = 0;
					PRIV.setDpa("pais");
					startup.get_regional();
					MAPA.publics.setZoom(4);
					MAPA.publics.setCenter(_CONFIG._MAP.LAT,_CONFIG._MAP.LNG);
				}
			},
			dpaNewHeaderFilter: function(callback){
				LOADING.show("Cargando Cartograf&iacute;a, Espere por favor...");
				RESUPOP.PUB.RESTORE_LVL();
				SOCKET.request({
				request: "regiones/get",
				data:{
					MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
					MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET",
					ADDSPATIALINFO: (regionesSpatialInfo['01'] == undefined)?"TRUE":"FALSE"
				},
				callback:function(response){
					
					var dpaConsulta = settings.dpalvl;
					if(dpaConsulta == 0){
						PRIV.setDpa("pais");
						startup.get_regional(true);
						settings.dpalvl = 0;
						MAPA.publics.setZoom(4);
						MAPA.publics.setCenter(_CONFIG._MAP.LAT,_CONFIG._MAP.LNG);
					}else if (dpaConsulta == 1){
						var numRegion = settings.region.NUMERO;
						LAYERS['REGION'] = response.regiones;
						METADATA = startup.metadata_cartografica(response.regiones);
						for(i=0;i<response.regiones.length; i++){
							if(response.regiones[i].NUMERO == numRegion){
								settings.region = response.regiones[i]; 
							}
						}
						
						PRIV.setDpa("region");
						if(settings.dpa == 0){
							startup.get_comunal(LAYERS['REGION'],settings.region);
						}
						else if(settings.dpa == 1){
							startup.get_provincial(LAYERS['REGION'],settings.region);
						}
						settings.dpalvl = 1;
						
					}else if (dpaConsulta == 2 || (dpaConsulta == 4 && settings.dpa == 1)){
						if(dpaConsulta == 4){
							settings.actual = null;
							FICHAS.PUB.clear_all();
						}	
						GEA.PUB.dpaHeaderFilterRegionLevel();
						GEA.PUB.dpaHeaderFilterProvinciaLevel();
					}else if (dpaConsulta == 3 || (dpaConsulta == 4 && settings.dpa == 0)){
						GEA.PUB.dpaHeaderFilterRegionLevel();
						if(settings.fromSearchObraDirecta == null){
							GEA.PUB.dpaHeaderFilterComunaLevel();
							if(dpaConsulta == 4){
								FICHAS.PUB.clear_all();
							}	
						}else{
							METADATA = startup.metadata_cartografica(response.regiones);
							$("#inversiontotal").children('.data').html("$ "+PRIV.number_format((METADATA._TOTAL_MONTO==0.5)?0:METADATA._TOTAL_MONTO,0,"","."));
							$("#numobras").children('.data').html(PRIV.number_format((METADATA._NUM_OBRAS==0.5)?0:METADATA._NUM_OBRAS,0,"","."));
							GEA.PUB.setFromSearchObraDirecta(null);
						}	
					}
					if(typeof callback != "undefined") callback();
				},});
			},
			dpaHeaderFilterRegionLevel: function(){
				SOCKET.request({
				request: "regiones/get",
				data:{
					MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
					MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET",
					ADDSPATIALINFO: (regionesSpatialInfo['01'] == undefined)?"TRUE":"FALSE"
				},
				callback:function(response){
					
					var dpaConsulta = settings.dpalvl;
					var numRegion = settings.region.NUMERO;
					LAYERS['REGION'] = response.regiones;
					METADATA = startup.metadata_cartografica(response.regiones);
					for(i=0;i<response.regiones.length; i++){
						if(response.regiones[i].NUMERO == numRegion){
							settings.region = response.regiones[i]; 
						}
					}
					GEA.PUB.setDatesChanged(false);
				},});
			},
			dpaHeaderFilterComunaLevel: function(){
				SOCKET.request({
				request: "comuna/getregion",
				data:{
					REGION: settings.regionactual.NUMERO,
					MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
					MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
				},
				callback:function(response){
					
					//Se limpia la caja pop de info de una obra concreta si estuviera seleccionada.
					$.clearBox();
					MAPA_GRILLA.FULL_CLEAN();
					var dpaConsulta = settings.dpalvl;
					LAYERS['COMUNAS'] = response.COMUNAS;
					METADATA = startup.metadata_cartografica(response.COMUNAS);
					for(i=0;i<response.COMUNAS.length; i++){
						if(response.COMUNAS[i].NUMERO == NUMCOM.NUMERO){
							settings.comunaactual = response.COMUNAS[i];
							NUMCOM = response.COMUNAS[i];
						}
					}
					startup.getComunaObras(LAYERS['COMUNAS'],NUMCOM,delimitacion);
				},});
			},
			dpaHeaderFilterProvinciaLevel: function(){
				SOCKET.request({
				request: "provincia/getregion",
				data:{
					REGION: settings.regionactual.NUMERO,
					MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
					MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
				},
				callback:function(response){
					
					//Se limpia la caja pop de info de una obra concreta si estuviera seleccionada.
					$.clearBox();
					MAPA_GRILLA.FULL_CLEAN();
					var dpaConsulta = settings.dpalvl;
					LAYERS['PROVINCIAS'] = response.PROVINCIAS;
					METADATA = startup.metadata_cartografica(response.PROVINCIAS);
					for(i=0;i<response.PROVINCIAS.length; i++){
						if(response.PROVINCIAS[i].NUMERO == NUMPROV.NUMERO){
							settings.provinciaactual = response.PROVINCIAS[i];
							NUMPROV = response.PROVINCIAS[i];
						}
					}
					startup.getProvinciaObras(LAYERS['PROVINCIAS'],NUMPROV,delimitacion);

				},});
			},
			dpaRegion: function(){
				if(settings.dpalvl != 1){
					settings.dpalvl = 1;
					if(settings.dpa == 0){
						startup.get_comunal(LAYERS['REGION'],settings.region);
					}
					else if(settings.dpa == 1){
						startup.get_provincial(LAYERS['REGION'],settings.region);
					}
				}

			},
			dpaComuna: function(){

			},
			dpaProvincia: function(){

			},
			setFromSearchObraDirecta: function(value){
				settings.fromSearchObraDirecta = value;	
			},
			getDatesChanged: function(){
				return $("#datesChanged").val();
			},
			setDatesChanged: function(value){
				$("#datesChanged").val(value);	
			},
			postAdvSearch: function(){
				if($("#fromadvsearch").val() !== null && $("#fromadvsearch").val()=="true"){
					BUSQUEDA.PUB.search();
					$(".tabpanel div").removeClass("borderdiv");
					$(".tabadvsearch div").addClass("borderdiv");
					$(".panel-item").hide();
					$("#advasearch").show();
					$("#fromadvsearch").val("");
				}	
				
			},
			search: function(response, activate,swit){
				POP.PUB.hide();
				LEYENDA.RENDER("CATASTRAL");
				NUMCOM = response.COMUNA;
				LAYERS['COMUNAS'] = response.COMUNAS;
				var UPPER_LAYER, UPPER_LAYERS_METADATA;
				if(swit){
					UPPER_LAYER = self.SWITCH.getDataBySwitch(response.COMUNA);
					UPPER_LAYERS_METADATA = self.SWITCH.getDataBySwitch(response.COMUNAS);
				}else{
					self.SWITCH.set_all_not();
					UPPER_LAYER = self.SWITCH.getDataBySwitch(response.COMUNA);
					UPPER_LAYERS_METADATA = startup.metadata_cartografica(response.COMUNAS);
				}
				settings.dpa = 0;
				settings.dpalvl = 3;
				PRIV.setDpa("comuna");
				settings.region = response.REGION;
				settings.regionactual = response.REGION;
				LOADING.show("Cargando Cartograf&iacute;a y Elementos, Espere por favor...");
				// RESUPOP.PUB.setTitle("Comuna de "+UPPER_LAYER.NOMBRE.substring(0,1).toUpperCase() + UPPER_LAYER.NOMBRE.substring(1,UPPER_LAYER.NOMBRE.length).toLowerCase());
				// RESUPOP.PUB.setValue(UPPER_LAYER.MONTO_CONTRATADO);
				// RESUPOP.PUB.setNumObras(UPPER_LAYER.NUMOBRAS,2);
				// RESUPOP.PUB.setMultiObras(UPPER_LAYER.MULTICOM,2);
				// RESUPOP.PUB.update(Math.floor(UPPER_LAYER.MONTO_CONTRATADO/UPPER_LAYERS_METADATA._TOTAL_MONTO*100));
				// RESUPOP.PUB.setSubGrafico("Del Total Regional");
				var METADATA2 = startup.metadata_cartografica(LAYERS['REGION']);
				RESUPOP.PUB.RESTORE_LVL();
				RESUPOP.PUB.SET_REGIONAL(response.REGION,METADATA2);
				RESUPOP.PUB.SET_COMUNAL(UPPER_LAYER,UPPER_LAYERS_METADATA,response.OBRAS);

				$("#inversiontotal").children('.data').html("$ "+PRIV.number_format((METADATA2._TOTAL_MONTO==0.5)?0:METADATA2._TOTAL_MONTO,0,"","."));
				$("#numobras").children('.data').html(PRIV.number_format((METADATA2._NUM_OBRAS==0.5)?0:METADATA2._NUM_OBRAS,0,"","."));
				DATA.PUB.clear_poly_spa();
				var puntos = JSON.parse(UPPER_LAYER.SPATIAL_OBJECT);
				delimitacion = [];
				for(i=0; i<puntos.length; i++){
					var poligono = [];
					for(l=0; l<puntos[i].length; l+=2){
						poligono.push(new google.maps.LatLng(puntos[i][(l)],puntos[i][l+1]));
					}
					delimitacion.push(poligono);
					DATA.PUB.add_line({
						element: MAPA.publics.load_polyline_territorial(poligono, {
							icon: [{
						      	icon: {
								    path: 'M 0,-0.6 0,0.2',
								    strokeOpacity: 1,
								    strokeWeight: 3,
								    strokeColor: "#FA9747"
								},
						     	offset: '0',
						      	repeat: '13px'
						    }],
						    color: "#FFF",
						    strokeWeight: 7
						})
					},true);
				}
				SOCKET.request({
					request: "ranking/getComunal",
					data:{
						COMUNA: response.COMUNA.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
						RANK.PUB.set(response);
					},
					buffered: true
				});
				SOCKET.request({
					request: "clasificacion/getComunal",
					data:{
						COMUNA: response.COMUNA.NUMERO,
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
					},
					callback:function(response){
						var aux = self.SWITCH.clasificacion(response);
						GRAFICOPANEL.PUB.make(aux,{
							_TOTAL_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_MAX_MONTO: UPPER_LAYER.MONTO_CONTRATADO,
							_NUM_OBRAS: UPPER_LAYER.NUMOBRAS
						});
					},
					buffered: true
				});
				MAPA.publics.fit_to_content();
				if(response.OBRAS.length == 0){
					LOADING.hide();
				}
				comu = [];		
				var proyectos = {};		
				var MAX_OBRA_MONTO = 0;
				for(f=0;f<response.OBRAS.length;f++){
					if(response.OBRAS[f].MONTO_CONTRATADO > MAX_OBRA_MONTO)
					{
						MAX_OBRA_MONTO = response.OBRAS[f].MONTO_CONTRATADO; 
					}
				}		
				$.each(response.OBRAS,function(key,value){
					if(typeof proyectos[value.CODPROYECTO] != "undefined"){
						return;
					}
					comu.push(value);
					value.C_CLAS = Math.ceil(value.MONTO_CONTRATADO/(MAX_OBRA_MONTO/3));
					var spatial = JSON.parse(value.SPATIAL_OBJECT);
					if(spatial.TYPE == "POINT"){
						var icono = (value.MULTICOM > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MPOINT","MULTI"): (value.SPATIAL_TOOL == "NOUBICATION")? LEYENDA.GET_SPECIAL_ELEMENT("SEDE","SEDE"):LEYENDA.GET_ELEMENT("POINT",value.MONTO_CONTRATADO,MAX_OBRA_MONTO);
						var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono,value, "C", UPPER_LAYER, UPPER_LAYERS_METADATA);
						var temp = MAPA_GRILLA.ADD_POINT(spatial.COORDINATES[1],spatial.COORDINATES[0],GELEMENT);
					}
					else if(spatial.TYPE == "POLYLINE"){
						var coordenadas_array = [];
					    for(k=0; k<spatial.COORDINATES.length; k+=2){
					    	coordenadas_array.push(MAPA.publics.getLatLng(spatial.COORDINATES[k+1], spatial.COORDINATES[k]));
					    }
					    var icono = (value.MULTICOM > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MLINE","MULTI"): LEYENDA.GET_ELEMENT("LINE",value.MONTO_CONTRATADO,MAX_OBRA_MONTO);
						var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono, value, "C", UPPER_LAYER, UPPER_LAYERS_METADATA);
					    var temp = MAPA_GRILLA.ADD_LINE(coordenadas_array,GELEMENT);
					}
					else if(spatial.TYPE == "MULTYGEOMETRY"){
						var _MULTIGEO = MAPA_GRILLA.ADD_MULTIGEO();
						$.each(spatial.ELEMENTS, function(ll,val){
							if(val.TYPE == "POINT"){
								var icono = (value.MULTICOM > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MPOINT","MULTI"): (value.SPATIAL_TOOL == "NOUBICATION")? LEYENDA.GET_SPECIAL_ELEMENT("SEDE","SEDE"): LEYENDA.GET_ELEMENT("POINT",value.MONTO_CONTRATADO,MAX_OBRA_MONTO);
								var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono, value, "C", UPPER_LAYER, UPPER_LAYERS_METADATA);
								var temp = MAPA_GRILLA.ADD_MULTIGEO_POINT(val.COORDINATES[1],val.COORDINATES[0],GELEMENT, _MULTIGEO);
							}
							else if(val.TYPE == "POLYLINE"){
								coordenadas_array = [];
							    for(k=0; k<val.COORDINATES.length; k+=2){
							    	coordenadas_array.push(new google.maps.LatLng(parseFloat(val.COORDINATES[k+1]), parseFloat(val.COORDINATES[k])));
							    }
							    var icono = (value.MULTICOM > 1)? LEYENDA.GET_SPECIAL_ELEMENT("MLINE","MULTI"): LEYENDA.GET_ELEMENT("LINE",value.MONTO_CONTRATADO,MAX_OBRA_MONTO);
							    var GELEMENT = MAPA_GRILLA.MAKE_GOBJECT(icono, value, "C", UPPER_LAYER, UPPER_LAYERS_METADATA);
					   	 		var temp = MAPA_GRILLA.ADD_MULTIGEO_LINE(coordenadas_array,GELEMENT, _MULTIGEO);
							}
						});
					}
					if(key == (response.OBRAS.length-1)){
						LOADING.hide();
						MAPA_GRILLA.RENDER(activate);
					}
				});
				ETIPOP.PUB.hide();
				LOADING.hide();
			},
			set_nobra: function(){
				$(".panel-item").hide();
				$("#clasificatab").show();
				PRIV.setDpa("nobra");
			},
			get_nac: function(){
				return nac;
			}
		}
		var PRIV = {
			setDpa: function(text){
				if(text == "pais"){
					FILTER.PUB.clear_all();
					DATA.PUB.clear_polygons();
					DATA.PUB.clear_lines();
					MAPA_GRILLA.FULL_CLEAN();
					settings.actual = null;
					settings.dpalvl = 0;
					$(".dpaview").hide();
					$(".dpaview#pais").show();
					$(".panel").css({
						top: "8%"
					});
					RESUPOP.PUB.hide();
					PRIV.footer("SHOW");
					PRIV.filtroleyenda("INTERPRETATIVA");
					$(".tabficha").css({
						color: "999"
					});
					$(".tabpanel div").removeClass("borderdiv");
					$(".tabsearch div").addClass("borderdiv");
					$(".panel-item").hide();
					$("#search").show();
				}
				else if(text == "region"){
					FILTER.PUB.clear_all();
					DATA.PUB.clear_polygons();
					DATA.PUB.clear_lines();
					MAPA_GRILLA.FULL_CLEAN();
					settings.actual = null;
					settings.dpalvl = 1;
					$(".dpaview").hide();
					$(".dpaview#pais").show();
					$(".panel").css({
						top: "17%"
					});
					RESUPOP.PUB.show();
					$.clearBox();
					PRIV.footer("HIDE");
					PRIV.filtroleyenda("INTERPRETATIVA");
					$(".tabficha").css({
						color: "#999"
					});
					$(".tabpanel div").removeClass("borderdiv");
					$(".tabinicio div").addClass("borderdiv");
					$(".panel-item").hide();
					$("#clasificatab").show();
				}
				else if(text == "comuna"){
					FILTER.PUB.clear_all();
					DATA.PUB.clear_polygons();
					DATA.PUB.clear_lines();
					MAPA_GRILLA.FULL_CLEAN();
					settings.actual = null;
					settings.dpalvl = 3;
					$(".dpaview").hide();
					$(".panel").css({
						top: "17%"
					});
					RESUPOP.PUB.show();
					$(".dpaview#region").show();
					PRIV.footer("HIDE");
					PRIV.filtroleyenda("OBRA");
					$(".tabficha").css({
						color: "#999"
					});
					$(".tabpanel div").removeClass("borderdiv");
					$(".tabinicio div").addClass("borderdiv");
					$(".panel-item").hide();
					$("#clasificatab").show();
				}
				else if(text == "provincia"){
					FILTER.PUB.clear_all();
					DATA.PUB.clear_polygons();
					DATA.PUB.clear_lines();
					MAPA_GRILLA.FULL_CLEAN();
					settings.actual = null;
					settings.dpalvl = 2;
					$(".dpaview").hide();
					$(".dpaview#region").show();
					$(".panel").css({
						top: "17%"
					});
					RESUPOP.PUB.show();
					PRIV.footer("HIDE");
					PRIV.filtroleyenda("OBRA");
					$(".tabficha").css({
						color: "#999"
					});
					$(".tabpanel div").removeClass("borderdiv");
					$(".tabinicio div").addClass("borderdiv");
					$(".panel-item").hide();
					$("#clasificatab").show();
				}
				else if(text == "obra"){
					$(".tabficha").css({
						color: "#000"
					});
				}
				else if(text == "nobra"){
					$(".tabficha").css({
						color: "#999"
					});
					$(".tabpanel div").removeClass("borderdiv");
					$(".tabinicio div").addClass("borderdiv");
				}
			},
			footer: function(action){
				if(action == "HIDE" && settings.footer){
					settings.footer = false;
					$(".f1").animate({
					    top: "+="+($(".f1").height()+40)+"px"
					}, 500, function() {
					});
				}
				else if(action == "SHOW" && !settings.footer){
					settings.footer = true;
					$(".f1").animate({
					    top: "-="+($(".f1").height()+40)+"px"
					}, 500, function() {
					});
				}
			},
			filtroleyenda: function(type){
				if(type == "OBRA"){
					$(".leyendaobra").show();
					$(".leyenda").hide();
					$(".filtro").show();
				}
				else if(type == "INTERPRETATIVA"){
					$(".leyendaobra").hide();
					$(".leyenda").show();
					$(".filtro").hide();
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
			setup_date: function(){
				$.datepicker.regional['es'] = {
					 closeText: 'Cerrar',
					 prevText: '<Ant',
					 nextText: 'Sig>',
					 currentText: 'Hoy',
					 monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
					 monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
					 dayNames: ['Domingo', 'Lunes', 'Mart&eacute;tes', 'Mircoles', 'Jueves', 'Viernes', 'Sábado'],
					 dayNamesShort: ['Dom','Lun','Mar','Mi&eacute;','Juv','Vie','Sáb'],
					 dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
					 weekHeader: 'Sm',
					 dateFormat: 'dd/mm/yy',
					 firstDay: 1,
					 isRTL: false,
					 showMonthAfterYear: false,
					 yearSuffix: ''
				 };
				 $.datepicker.setDefaults($.datepicker.regional['es']);
				 
			},
			set_date_init_header: function(){
				var f = new Date();
				var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
				 $("#fromdateHeaderValue").val("01 Ene " + f.getFullYear());
			//	$("#fromdateHeaderValue").val("01 Ene 2016");
				$("#todateHeaderValue").val(("0"+(f.getDate())).slice(-2) + " " + meses[f.getMonth()]+ " " + f.getFullYear());
				$("#todateHeader").val(("0"+(f.getDate())).slice(-2) + "/" + ("0"+(f.getMonth()+1)).slice(-2) + "/" + f.getFullYear());
				// $("#fromdateHeader").val("01/01/" + f.getFullYear());
				$("#fromdateHeader").val("01/01/"+ f.getFullYear());
				$("#alternateFromValue").val("01 Ene " + f.getFullYear());
				$("#alternateToValue").val(("0"+(f.getDate())).slice(-2) + " " + meses[f.getMonth()]+ " " + f.getFullYear());
				$("#alternateFrom").val("01/01/" + f.getFullYear());
				$("#alternateTo").val(("0"+(f.getDate())).slice(-2) + "/" + ("0"+(f.getMonth()+1)).slice(-2) + "/" + f.getFullYear());

				$("#alternateFromASValue").val("01 Ene " + f.getFullYear());
				$("#alternateToASValue").val(("0"+(f.getDate())).slice(-2) + " " + meses[f.getMonth()]+ " " + f.getFullYear());
				$("#alternateFromAS").val("01/01/" + f.getFullYear());
				$("#alternateToAS").val(("0"+(f.getDate())).slice(-2) + "/" + ("0"+(f.getMonth()+1)).slice(-2) + "/" + f.getFullYear());
			}
		};
		
		//INTEGRAREMOS EL SWITCH
		this.SWITCH = {
			status: "2016",
			set_all_not: function(){
				self.SWITCH.status = "ALL";
				$("#c2014").children(".swcontent").removeClass("inactive").addClass("active");
				$("#c2014").children(".swcontent").children('.lg').html('<i class="fa fa-check-square-o"></i>');
				$("#c2015").children(".swcontent").removeClass("inactive").addClass("active");
				$("#c2015").children(".swcontent").children('.lg').html('<i class="fa fa-check-square-o"></i>');
			},
			set_2015: function(){
				if(self.SWITCH.status == "ALL"){
					self.SWITCH.status = "2016";
					$("#c2014").children(".swcontent").removeClass("active").addClass("inactive");
					$("#c2014").children(".swcontent").children('.lg').html('<i class="fa fa-square-o"></i>');
					self.SWITCH.change();
				}
				else if(self.SWITCH.status == "2016"){
					self.SWITCH.status = "ALL";
					$("#c2014").children(".swcontent").removeClass("inactive").addClass("active");
					$("#c2014").children(".swcontent").children('.lg').html('<i class="fa fa-check-square-o"></i>');
					self.SWITCH.change();
				}
			},
			set_2016: function(){
				if(self.SWITCH.status == "ALL"){
					self.SWITCH.status = "2015";
					$("#c2015").children(".swcontent").removeClass("active").addClass("inactive");
					$("#c2015").children(".swcontent").children('.lg').html('<i class="fa fa-square-o"></i>');
					self.SWITCH.change();
				}
				else if(self.SWITCH.status == "2015"){
					self.SWITCH.status	 = "ALL";
					$("#c2015").children(".swcontent").removeClass("inactive").addClass("active");
					$("#c2015").children(".swcontent").children('.lg').html('<i class="fa fa-check-square-o"></i>');
					self.SWITCH.change();
				}
			},
			change: function(METADATA){
				$.clearBox();
				if(settings.dpalvl == 0){
					startup.get_regional();
				}
				else if(settings.dpalvl == 1){
					if(settings.dpa == 0){
						var UPPER_METADATA = (typeof METADATA == "undefined")?LAYERS['PROVINCIAS']:METADATA;
						startup.get_comunal(LAYERS['COMUNAS'],settings.regionactual);
					}
					else if(settings.dpa == 1){
						var UPPER_METADATA = (typeof METADATA == "undefined")?LAYERS['PROVINCIAS']:METADATA;
						startup.get_provincial(LAYERS['PROVINCIAS'],settings.regionactual);
					}
				}
				else if(settings.dpalvl == 2){
					var UPPER_METADATA = (typeof METADATA == "undefined")?LAYERS['PROVINCIAS']:METADATA;
					startup.getProvinciaObras(LAYERS['PROVINCIAS'],NUMPROV,delimitacion);
				}
				else if(settings.dpalvl == 3){
					startup.getComunaObras(LAYERS['COMUNAS'],NUMCOM,delimitacion);
				}
				else if(settings.dpalvl == 4){
					INFOWINACT.close();
					if(settings.dpa == 0){
						var UPPER_METADATA = (typeof METADATA == "undefined")?LAYERS['PROVINCIAS']:METADATA;
						startup.getComunaObras(LAYERS['COMUNAS'],NUMCOM,delimitacion);
					}
					else if(settings.dpa == 1){
						var UPPER_METADATA = (typeof METADATA == "undefined")?LAYERS['PROVINCIAS']:METADATA;
						startup.getProvinciaObras(LAYERS['PROVINCIAS'],NUMPROV,delimitacion);
					}
				}
			},
			getDataBySwitch: function(value){
				switch(self.SWITCH.status){
					case "ALL":
						var aux = JSON.parse(JSON.stringify(value));
						aux.MONTO_CONTRATADO = value.MONTO;
						aux.NUMOBRAS = value.OBRAS;
						return aux;
					case "2015":
						var aux = JSON.parse(JSON.stringify(value));
						aux.MONTO_CONTRATADO = value.MONTO;
						aux.NUMOBRAS = value.OBRAS;
						return aux;
					case "2016":
						var aux = JSON.parse(JSON.stringify(value));
						aux.MONTO_CONTRATADO = value.MONTO;
						aux.NUMOBRAS = value.OBRAS;
						return aux;
				}
			},
			//FUNCIONES PARA PROVEER RANKING
			ranking: function(value){
				switch(self.SWITCH.status){
					case "ALL":
						return value.ALL;
					case "2015":
						return value.R2015;
					case "2016":
						return value.R2016;
				}
			},
			clasificacion: function(value){
				switch(self.SWITCH.status){
					case "ALL":
						var retorno = [];
						for(i=0;i<value.length;i++){
							retorno.push({
								NUMERO: value[i].NUMERO,
								NOMBRE: value[i].NOMBRE,
								REGION: value[i].REGION,
								COMUNA: value[i].COMUNA,
								PROVINCIA: value[i].PROVINCIA,
								MONTO_CONTRATADO: value[i].MONTO,
								NUMOBRAS: value[i].OBRAS
							});
						}
						return retorno;
						
					case "2015":
						var retorno = [];
						for(i=0;i<value.length;i++){
							retorno.push({
								NUMERO: value[i].NUMERO,
								NOMBRE: value[i].NOMBRE,
								REGION: value[i].REGION,
								COMUNA: value[i].COMUNA,
								PROVINCIA: value[i].PROVINCIA,
								//MONTO_CONTRATADO: value[i].MONTO2015,
								MONTO_CONTRATADO: value[i].MONTO,
								//NUMOBRAS: value[i].OBRAS2015
								NUMOBRAS: value[i].OBRAS
							});
						}
						return retorno;
					case "2016":
						var retorno = [];
						for(i=0;i<value.length;i++){
							retorno.push({
								NUMERO: value[i].NUMERO,
								NOMBRE: value[i].NOMBRE,
								REGION: value[i].REGION,
								COMUNA: value[i].COMUNA,
								PROVINCIA: value[i].PROVINCIA,
								MONTO_CONTRATADO: value[i].MONTO,
								NUMOBRAS: value[i].OBRAS
							});
						}
						return retorno;
				}
			},
			resupop: function(value){
				switch(self.SWITCH.status){
					case "ALL":
						var aux = JSON.parse(JSON.stringify(value));
						aux.MONTO_CONTRATADO = value.MONTO;
						aux.OBRAS = value.OBRAS;
						return aux;
					case "2015":
						var aux = JSON.parse(JSON.stringify(value));
						aux.MONTO_CONTRATADO = value.MONTO;
						aux.OBRAS = value.OBRAS;
						return aux;
					case "2016":
						var aux = JSON.parse(JSON.stringify(value));
						aux.MONTO_CONTRATADO = value.MONTO;
						aux.OBRAS = value.OBRAS;
						return aux;
				}
			},
			analizeObra: function(valueobra){
				var FECHA_OBRA = new Date(valueobra.F_TRAZON.replace(/-/g,"/"));
				var FECHA_INFERIOR = new Date(2015, 0, 0);
				var FECHA_SUPERIOR = new Date(2016, 0, 0);
				switch(self.SWITCH.status){
					case "ALL":
						return true;
					case "2015":
						if(FECHA_OBRA >= FECHA_INFERIOR && FECHA_OBRA < FECHA_SUPERIOR){
							return true;
						}
						else
						{
							return false;
						}
					case "2016":
						if(FECHA_OBRA >= FECHA_SUPERIOR){
							return true;
						}
						else
						{
							return false;
						}
				}
			},
			popResu: function(){
				
				switch(self.SWITCH.status){
					case "ALL":
						return "Adjudicaciones de obra provenientes de Mercado P&uacute;blico entre el 01.01.2015 y el 01.01.2016.";
					case "2015":
						return "Adjudicaciones de obra provenientes de Mercado P&uacute;blico entre el 01.01.2015 y el 31.12.2015.";
					case "2016":
						return "Adjudicaciones de obra provenientes de Mercado P&uacute;blico a partir del 01.01.2016.";
				}
			}
		}
		constructor();
	}
})(jQuery);