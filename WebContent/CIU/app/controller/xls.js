(function(){
	XLS = function(args){
		var settings = {
			link: $("#xls")
		}
		// CONSTRUCTOR
		var _CONSTRUCT = function(args){
		}
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
			"3": "#004A80",
		};
		var PRIV = {
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
			clone: function(obj) {
			    if ( obj === null || typeof obj  !== 'object' ) {
			        return obj;
			    }
			 
			    var temp = obj.constructor();
			    for ( var key in obj ) {
			        temp[ key ] = PRIV.clone( obj[ key ] );
			    }
			 
			    return temp;
			},
			// FUNCION RECURSIVA AUXILIAR PARA GENERAR LOS RENDERS
			render: function(renders,i,max, callback){
				html2canvas($("#report_div_"+i), {
				    useCORS: true,
				  	onrendered: function(canvas)
				  	{
				  		renders.push(canvas.toDataURL('image/jpeg'));
				  		if(i<max){
				  			PRIV.render(renders,(i+1),max,callback);
				  		}
				  		else
				  		{
				  			callback(renders);
				  		}
				    }
				});
			},
			rgb: function(rgb){
			 	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
			 	return (rgb && rgb.length === 4) ? "" +
			  	("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
			  	("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
			  	("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
			},
			normalize: function(str) {
			  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
			      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
			      mapping = {};
			 
			  for(var i = 0, j = from.length; i < j; i++ )
			      mapping[ from.charAt( i ) ] = to.charAt( i );
			 
			  var ret = [];
			      for( var i = 0, j = str.length; i < j; i++ ) {
			          var c = str.charAt( i );
			          if( mapping.hasOwnProperty( str.charAt( i ) ) )
			              ret.push( mapping[ c ] );
			          else
			              ret.push( c );
			      }   
			  return ret.join( '' );  
			 
			}
		}
		// METODOS PUBLICOS
		this.PUB = {
			kml: function(type){
				LOADING.show("Generando archivo, Espere por favor...");	
				var q = {
					q0:PRIV.rgb($("#leyenda-color #q1").css("background-color")),
					q1:PRIV.rgb($("#leyenda-color #q1").css("background-color")),
					q2:PRIV.rgb($("#leyenda-color #q2").css("background-color")),
					q3:PRIV.rgb($("#leyenda-color #q3").css("background-color")),
					q4:PRIV.rgb($("#leyenda-color #q4").css("background-color")),
					q5:PRIV.rgb($("#leyenda-color #q5").css("background-color"))
				};
				switch(type){
					case 1:
						var regiones = GEA.PUB.get_nac();
						var regionales = [];
						for(key in regiones){
							regionales.push(regiones[key]);
						}
						var METADATA = GEA.PUB.metadata_cartografica(regionales);
						var xw = new XMLWriter('UTF-8', '1.0');
						var CLASIFICACION = {};
						SOCKET.request({
							request: "clasificacion/getClasificacion",
							data:{
							},
							callback:function(response){
								for(i=0;i<response.length;i++){
									CLASIFICACION[response[i].NUMERO] = {
										MONTO: 0,
										NUMOBRAS: 0,
										NOMBRE: response[i].NOMBRE
									}
								}
								var model = {
									"Cod. Region": "string",
									name: "string",
									inv_total: "string",
									obras: "string"
								}
								//AGREGAMOS LAS INV_TOTAL
								for(key in CLASIFICACION){
									model["INV_TOTAL_"+CLASIFICACION[key].NOMBRE.replace(/ /g, "_")] = "string";
								}
								//AGREGAMOS LAS OBRAS_REG
								for(key in CLASIFICACION){
									model["TOTAL_OBRAS_"+CLASIFICACION[key].NOMBRE.replace(/ /g, "_")] = "string";
								}
								xw.writeStartDocument();
								xw.writeStartElement("kml");
								xw.writeAttributeString('xmlns', 'http://www.opengis.net/kml/2.2');
									xw.writeStartElement("Document");
										xw.writeStartElement("Folder");
											//INTEGRAMOS EL NOMBRE
											xw.writeStartElement("name");
											xw.writeString("Vista Interpretativa Nacional")
											xw.writeEndElement();	
											//INTEGRAMOS EL SCHEMA
											xw.writeStartElement("Schema");
											xw.writeAttributeString('name', 'model_data');
											xw.writeAttributeString('id', 'model_data_pattern');
												// AGREGAMOS EL MODELO DE DATOS
												for(key in model){
													xw.writeStartElement("SimpleField");
													xw.writeAttributeString('name', key);
													xw.writeAttributeString('type', 'string');
													xw.writeEndElement();
												}
											xw.writeEndElement();	
											//CARGAMOS LOS DATOS
											//CREAMOS EL INFORME
											for(key in regiones){
												var clasi_clone = PRIV.clone(CLASIFICACION);
												if(typeof regiones[key].CLASIFICACIONES != "undefined"){
													var clasi_fil = GEA.SWITCH.clasificacion(regiones[key].CLASIFICACIONES);
													for(l=0;l<clasi_fil.length;l++){
														clasi_clone[clasi_fil[l].NUMERO] = {
															MONTO: clasi_fil[l].MONTO_CONTRATADO,
															NUMOBRAS: clasi_fil[l].NUMOBRAS,
															NOMBRE: clasi_fil[l].NOMBRE
														}
													}
												}
												xw.writeStartElement("Placemark");
													xw.writeStartElement("Style");
														xw.writeStartElement("LineStyle");
															xw.writeStartElement("color");
															xw.writeString("FF333333");
															xw.writeEndElement();
														xw.writeEndElement();
														xw.writeStartElement("PolyStyle");
															// COLOR LINEA
															xw.writeStartElement("color");
															var relleno = q["q"+Math.floor(regiones[key].MONTO_CONTRATADO/METADATA._MAX_MONTO*5)];
															xw.writeString("7f"+relleno.substring(4)+relleno.substring(2,4)+relleno.substring(0,2));
															xw.writeEndElement();
															// COLOR MODE
															xw.writeStartElement("colorMode");
															xw.writeString("normal");
															xw.writeEndElement();
															// FILL
															xw.writeStartElement("fill");
															xw.writeString("1");
															xw.writeEndElement();
														xw.writeEndElement();
													xw.writeEndElement();
													xw.writeStartElement("ExtendedData");
														xw.writeStartElement("SchemaData");
														xw.writeAttributeString('schemaUrl', '#model_data_pattern');
															
															xw.writeStartElement("SimpleData")
															xw.writeAttributeString('name', 'subdere')
															xw.writeString(key);
															xw.writeEndElement();

															xw.writeStartElement("SimpleData");
															xw.writeAttributeString('name', 'name');
															xw.writeString(regiones[key].NOMBRE);
															xw.writeEndElement();

															xw.writeStartElement("SimpleData");
															xw.writeAttributeString('name', 'inv_total');
															xw.writeString(regiones[key].MONTO_CONTRATADO.toString());
															xw.writeEndElement();

															xw.writeStartElement("SimpleData");
															xw.writeAttributeString('name', 'obras');
															xw.writeString(regiones[key].NUMOBRAS.toString());
															xw.writeEndElement();

															for(key2 in clasi_clone){
																xw.writeStartElement("SimpleData");
																xw.writeAttributeString('name', "INV_TOTAL_"+clasi_clone[key2].NOMBRE.replace(/ /g, "_"));
																xw.writeString(clasi_clone[key2].MONTO.toString());
																xw.writeEndElement();
															}
															for(key2 in clasi_clone){
																xw.writeStartElement("SimpleData");
																xw.writeAttributeString('name', "TOTAL_OBRAS_"+clasi_clone[key2].NOMBRE.replace(/ /g, "_"));
																xw.writeString(clasi_clone[key2].NUMOBRAS.toString());
																xw.writeEndElement();
															}
														xw.writeEndElement();
													xw.writeEndElement();
													var coordenadas = JSON.parse(regiones[key].SPATIAL_OBJECT);
													xw.writeStartElement("MultiGeometry");
													for(i=0;i<coordenadas.length;i++){
														xw.writeStartElement("Polygon");
															xw.writeStartElement("outerBoundaryIs");
																xw.writeStartElement("LinearRing");
																	xw.writeStartElement("coordinates");
																	var coords = "";
																	for(l=0; l<coordenadas[i].length; l+=2){
																		coords += coordenadas[i][(l+1)]+",";
																		coords += coordenadas[i][l]+" ";
																	}
																	xw.writeString(coords);
																	xw.writeEndElement();
																xw.writeEndElement();
															xw.writeEndElement();
														xw.writeEndElement();
													}
													xw.writeEndElement();
												xw.writeEndElement();
											}
										xw.writeEndElement();
									xw.writeEndElement();
								xw.writeEndDocument();
								var data = new Blob([xw.flush()], {type: 'text/plain'});
       							var downloadLink = document.createElement("a");
								downloadLink.href = window.URL.createObjectURL(data);
								downloadLink.download = "informe.kml";
								document.body.appendChild(downloadLink);
								downloadLink.click();
								document.body.removeChild(downloadLink);
						        LOADING.hide();
							},
							buffered: true
						});	
						break;
					case 2:
						var regiones = GEA.PUB.get_regcomu();
						var comunales = [];
						for(key in regiones){
							comunales.push(regiones[key]);
						}
						var METADATA = GEA.PUB.metadata_cartografica(comunales);
						var xw = new XMLWriter('UTF-8', '1.0');
						var CLASIFICACION = {};
						SOCKET.request({
							request: "clasificacion/getClasificacion",
							data:{
							},
							callback:function(response){
								for(i=0;i<response.length;i++){
									CLASIFICACION[response[i].NUMERO] = {
										MONTO: 0,
										NUMOBRAS: 0,
										NOMBRE: response[i].NOMBRE
									}
								}
								var model = {
									"Cod. Comuna": "string",
									name: "string",
									inv_total: "string",
									obras: "string"
								}
								//AGREGAMOS LAS INV_TOTAL
								for(key in CLASIFICACION){
									model["INV_TOTAL_"+CLASIFICACION[key].NOMBRE.replace(/ /g, "_")] = "string";
								}
								//AGREGAMOS LAS OBRAS_REG
								for(key in CLASIFICACION){
									model["TOTAL_OBRAS_"+CLASIFICACION[key].NOMBRE.replace(/ /g, "_")] = "string";
								}
								xw.writeStartDocument();
								xw.writeStartElement("kml");
								xw.writeAttributeString('xmlns', 'http://www.opengis.net/kml/2.2');
									xw.writeStartElement("Document");
										xw.writeStartElement("Folder");
											//INTEGRAMOS EL NOMBRE
											xw.writeStartElement("name");
											xw.writeString("Vista Interpretativa Comunal")
											xw.writeEndElement();	
											//INTEGRAMOS EL SCHEMA
											xw.writeStartElement("Schema");
											xw.writeAttributeString('name', 'model_data');
											xw.writeAttributeString('id', 'model_data_pattern');
												// AGREGAMOS EL MODELO DE DATOS
												for(key in model){
													xw.writeStartElement("SimpleField");
													xw.writeAttributeString('name', key);
													xw.writeAttributeString('type', 'string');
													xw.writeEndElement();
												}
											xw.writeEndElement();	
											//CARGAMOS LOS DATOS
											//CREAMOS EL INFORME
											for(key in regiones){
												var clasi_clone = PRIV.clone(CLASIFICACION);
												if(typeof regiones[key].CLASIFICACIONES != "undefined"){
													for(l=0;l<regiones[key].CLASIFICACIONES.length;l++){
														clasi_clone[regiones[key].CLASIFICACIONES[l].NUMERO] = {
															MONTO: regiones[key].CLASIFICACIONES[l].MONTO_CONTRATADO,
															NUMOBRAS: regiones[key].CLASIFICACIONES[l].NUMOBRAS,
															NOMBRE: regiones[key].CLASIFICACIONES[l].NOMBRE
														}
													}
												}
												xw.writeStartElement("Placemark");
													xw.writeStartElement("Style");
														xw.writeStartElement("LineStyle");
															xw.writeStartElement("color");
															xw.writeString("FF333333");
															xw.writeEndElement();
														xw.writeEndElement();
														xw.writeStartElement("PolyStyle");
															// COLOR LINEA
															xw.writeStartElement("color");
															var relleno = q["q"+Math.floor(regiones[key].MONTO_CONTRATADO/METADATA._MAX_MONTO*5)];
															xw.writeString("7f"+relleno.substring(4)+relleno.substring(2,4)+relleno.substring(0,2));
															xw.writeEndElement();
															// COLOR MODE
															xw.writeStartElement("colorMode");
															xw.writeString("normal");
															xw.writeEndElement();
															// FILL
															xw.writeStartElement("fill");
															xw.writeString("1");
															xw.writeEndElement();
														xw.writeEndElement();
													xw.writeEndElement();
													xw.writeStartElement("ExtendedData");
														xw.writeStartElement("SchemaData");
														xw.writeAttributeString('schemaUrl', '#model_data_pattern');
															
															xw.writeStartElement("SimpleData")
															xw.writeAttributeString('name', 'subdere')
															xw.writeString(key);
															xw.writeEndElement();

															xw.writeStartElement("SimpleData");
															xw.writeAttributeString('name', 'name');
															xw.writeString(regiones[key].NOMBRE);
															xw.writeEndElement();

															xw.writeStartElement("SimpleData");
															xw.writeAttributeString('name', 'inv_total');
															xw.writeString(regiones[key].MONTO_CONTRATADO.toString());
															xw.writeEndElement();

															xw.writeStartElement("SimpleData");
															xw.writeAttributeString('name', 'obras');
															xw.writeString(regiones[key].NUMOBRAS.toString());
															xw.writeEndElement();

															for(key2 in clasi_clone){
																xw.writeStartElement("SimpleData");
																xw.writeAttributeString('name', "INV_TOTAL_"+clasi_clone[key2].NOMBRE.replace(/ /g, "_"));
																xw.writeString(clasi_clone[key2].MONTO.toString());
																xw.writeEndElement();
															}
															for(key2 in clasi_clone){
																xw.writeStartElement("SimpleData");
																xw.writeAttributeString('name', "TOTAL_OBRAS_"+clasi_clone[key2].NOMBRE.replace(/ /g, "_"));
																xw.writeString(clasi_clone[key2].NUMOBRAS.toString());
																xw.writeEndElement();
															}
														xw.writeEndElement();
													xw.writeEndElement();
													var coordenadas = JSON.parse(regiones[key].SPATIAL_OBJECT);
													xw.writeStartElement("MultiGeometry");
													for(i=0;i<coordenadas.length;i++){
														xw.writeStartElement("Polygon");
															xw.writeStartElement("outerBoundaryIs");
																xw.writeStartElement("LinearRing");
																	xw.writeStartElement("coordinates");
																	var coords = "";
																	for(l=0; l<coordenadas[i].length; l+=2){
																		coords += coordenadas[i][(l+1)]+",";
																		coords += coordenadas[i][l]+" ";
																	}
																	xw.writeString(coords);
																	xw.writeEndElement();
																xw.writeEndElement();
															xw.writeEndElement();
														xw.writeEndElement();
													}
													xw.writeEndElement();
												xw.writeEndElement();
											}
										xw.writeEndElement();
									xw.writeEndElement();
								xw.writeEndDocument();
								var data = new Blob([xw.flush()], {type: 'text/plain'});
       							var downloadLink = document.createElement("a");
								downloadLink.href = window.URL.createObjectURL(data);
								downloadLink.download = "informe.kml";
								document.body.appendChild(downloadLink);
								downloadLink.click();
								document.body.removeChild(downloadLink);
						        LOADING.hide();
							},
							buffered: true
						});	
						break;
					case 3:
						var regiones = GEA.PUB.get_regprovi();
						var provinciales = [];
						for(key in regiones){
							provinciales.push(regiones[key]);
						}
						var METADATA = GEA.PUB.metadata_cartografica(provinciales);
						var xw = new XMLWriter('UTF-8', '1.0');
						var CLASIFICACION = {};
						SOCKET.request({
							request: "clasificacion/getClasificacion",
							data:{
							},
							callback:function(response){
								for(i=0;i<response.length;i++){
									CLASIFICACION[response[i].NUMERO] = {
										MONTO: 0,
										NUMOBRAS: 0,
										NOMBRE: response[i].NOMBRE
									}
								}
								var model = {
									"Cod. Provincia": "string",
									name: "string",
									inv_total: "string",
									obras: "string"
								}
								//AGREGAMOS LAS INV_TOTAL
								for(key in CLASIFICACION){
									model["INV_TOTAL_"+CLASIFICACION[key].NOMBRE.replace(/ /g, "_")] = "string";
								}
								//AGREGAMOS LAS OBRAS_REG
								for(key in CLASIFICACION){
									model["TOTAL_OBRAS_"+CLASIFICACION[key].NOMBRE.replace(/ /g, "_")] = "string";
								}
								xw.writeStartDocument();
								xw.writeStartElement("kml");
								xw.writeAttributeString('xmlns', 'http://www.opengis.net/kml/2.2');
									xw.writeStartElement("Document");
										xw.writeStartElement("Folder");
											//INTEGRAMOS EL NOMBRE
											xw.writeStartElement("name");
											xw.writeString("Vista Interpretativa Provincial")
											xw.writeEndElement();	
											//INTEGRAMOS EL SCHEMA
											xw.writeStartElement("Schema");
											xw.writeAttributeString('name', 'model_data');
											xw.writeAttributeString('id', 'model_data_pattern');
												// AGREGAMOS EL MODELO DE DATOS
												for(key in model){
													xw.writeStartElement("SimpleField");
													xw.writeAttributeString('name', key);
													xw.writeAttributeString('type', 'string');
													xw.writeEndElement();
												}
											xw.writeEndElement();	
											//CARGAMOS LOS DATOS
											//CREAMOS EL INFORME
											for(key in regiones){
												var clasi_clone = PRIV.clone(CLASIFICACION);
												if(typeof regiones[key].CLASIFICACIONES != "undefined"){
													for(l=0;l<regiones[key].CLASIFICACIONES.length;l++){
														clasi_clone[regiones[key].CLASIFICACIONES[l].NUMERO] = {
															MONTO: regiones[key].CLASIFICACIONES[l].MONTO_CONTRATADO,
															NUMOBRAS: regiones[key].CLASIFICACIONES[l].NUMOBRAS,
															NOMBRE: regiones[key].CLASIFICACIONES[l].NOMBRE
														}
													}
												}
												xw.writeStartElement("Placemark");
													xw.writeStartElement("Style");
														xw.writeStartElement("LineStyle");
															xw.writeStartElement("color");
															xw.writeString("FF333333");
															xw.writeEndElement();
														xw.writeEndElement();
														xw.writeStartElement("PolyStyle");
															// COLOR LINEA
															xw.writeStartElement("color");
															var relleno = q["q"+Math.floor(regiones[key].MONTO_CONTRATADO/METADATA._MAX_MONTO*5)];
															xw.writeString("7f"+relleno.substring(4)+relleno.substring(2,4)+relleno.substring(0,2));
															xw.writeEndElement();
															// COLOR MODE
															xw.writeStartElement("colorMode");
															xw.writeString("normal");
															xw.writeEndElement();
															// FILL
															xw.writeStartElement("fill");
															xw.writeString("1");
															xw.writeEndElement();
														xw.writeEndElement();
													xw.writeEndElement();
													xw.writeStartElement("ExtendedData");
														xw.writeStartElement("SchemaData");
														xw.writeAttributeString('schemaUrl', '#model_data_pattern');
															
															xw.writeStartElement("SimpleData")
															xw.writeAttributeString('name', 'subdere')
															xw.writeString(key);
															xw.writeEndElement();

															xw.writeStartElement("SimpleData");
															xw.writeAttributeString('name', 'name');
															xw.writeString(regiones[key].NOMBRE);
															xw.writeEndElement();

															xw.writeStartElement("SimpleData");
															xw.writeAttributeString('name', 'inv_total');
															xw.writeString(regiones[key].MONTO_CONTRATADO.toString());
															xw.writeEndElement();

															xw.writeStartElement("SimpleData");
															xw.writeAttributeString('name', 'obras');
															xw.writeString(regiones[key].NUMOBRAS.toString());
															xw.writeEndElement();

															for(key2 in clasi_clone){
																xw.writeStartElement("SimpleData");
																xw.writeAttributeString('name', "INV_TOTAL_"+clasi_clone[key2].NOMBRE.replace(/ /g, "_"));
																xw.writeString(clasi_clone[key2].MONTO.toString());
																xw.writeEndElement();
															}
															for(key2 in clasi_clone){
																xw.writeStartElement("SimpleData");
																xw.writeAttributeString('name', "TOTAL_OBRAS_"+clasi_clone[key2].NOMBRE.replace(/ /g, "_"));
																xw.writeString(clasi_clone[key2].NUMOBRAS.toString());
																xw.writeEndElement();
															}
														xw.writeEndElement();
													xw.writeEndElement();
													var coordenadas = JSON.parse(regiones[key].SPATIAL_OBJECT);
													xw.writeStartElement("MultiGeometry");
													for(i=0;i<coordenadas.length;i++){
														xw.writeStartElement("Polygon");
															xw.writeStartElement("outerBoundaryIs");
																xw.writeStartElement("LinearRing");
																	xw.writeStartElement("coordinates");
																	var coords = "";
																	for(l=0; l<coordenadas[i].length; l+=2){
																		coords += coordenadas[i][(l+1)]+",";
																		coords += coordenadas[i][l]+" ";
																	}
																	xw.writeString(coords);
																	xw.writeEndElement();
																xw.writeEndElement();
															xw.writeEndElement();
														xw.writeEndElement();
													}
													xw.writeEndElement();
												xw.writeEndElement();
											}
										xw.writeEndElement();
									xw.writeEndElement();
								xw.writeEndDocument();
								var data = new Blob([xw.flush()], {type: 'text/plain'});
       							var downloadLink = document.createElement("a");
								downloadLink.href = window.URL.createObjectURL(data);
								downloadLink.download = "informe.kml";
								document.body.appendChild(downloadLink);
								downloadLink.click();
								document.body.removeChild(downloadLink);
						        LOADING.hide();
							},
							buffered: true
						});	
						break;
					case 4:
						var regiones = GEA.PUB.get_provi();
						var xw = new XMLWriter('UTF-8', '1.0');
						var CLASIFICACION = {};
						var model = {
							CODIGO_GEO: "string",
							NOMBRE: "string",
							MONTO_CONTRATADO: "string",
							ID_MERCADO_PUB: "string"
						}
						var line_color = {
							"0": "74C2E1",
							"1": "74C2E1",
							"2": "0191C8",
							"3": "004A80",
						};
						var marker_icon = {
							"0": "CIU/public_html/images/1q.png",
							"1": "CIU/public_html/images/1q.png",
							"2": "CIU/public_html/images/2q.png",
							"3": "CIU/public_html/images/3q.png",
						};
						xw.writeStartDocument();
						xw.writeStartElement("kml");
						xw.writeAttributeString('xmlns', 'http://www.opengis.net/kml/2.2');
							xw.writeStartElement("Document");
								xw.writeStartElement("Folder");
									//INTEGRAMOS EL NOMBRE
									xw.writeStartElement("name");
									xw.writeString("Vista Catastral Comunal")
									xw.writeEndElement();	
									//INTEGRAMOS EL SCHEMA
									xw.writeStartElement("Schema");
									xw.writeAttributeString('name', 'model_data');
									xw.writeAttributeString('id', 'model_data_pattern');
										// AGREGAMOS EL MODELO DE DATOS
										for(key in model){
											xw.writeStartElement("SimpleField");
											xw.writeAttributeString('name', key);
											xw.writeAttributeString('type', 'string');
											xw.writeEndElement();
										}
									xw.writeEndElement();	
									//CARGAMOS LOS DATOS
									//CREAMOS EL INFORME

									for(i=0;i<regiones.length;i++){
										var obra = regiones[i];
										xw.writeStartElement("Placemark");
											xw.writeStartElement("Style");
												var relleno = line_color[obra.C_CLAS];
												var icon = marker_icon[obra.C_CLAS];
												xw.writeStartElement("LineStyle");
													xw.writeStartElement("color");
													xw.writeString("ff"+relleno.substring(4)+relleno.substring(2,4)+relleno.substring(0,2));
													xw.writeEndElement();
												xw.writeEndElement();
												xw.writeStartElement("IconStyle");
													xw.writeStartElement("color");
													xw.writeString("ff"+relleno.substring(4)+relleno.substring(2,4)+relleno.substring(0,2));
													xw.writeEndElement();
													// COLOR MODE
													xw.writeStartElement("Icon");
														xw.writeStartElement("href");
														xw.writeString("http://www.contraloria.cl/geocgrappcgr/GEOCGR/"+icon);
														xw.writeEndElement();
													xw.writeEndElement();
												xw.writeEndElement();
											xw.writeEndElement();
											xw.writeStartElement("ExtendedData");
												xw.writeStartElement("SchemaData");
												xw.writeAttributeString('schemaUrl', '#model_data_pattern');

													xw.writeStartElement("SimpleData")
													xw.writeAttributeString('name', 'CODIGO_GEO')
													xw.writeString(obra.X_EXPE.toString());
													xw.writeEndElement();

													xw.writeStartElement("SimpleData");
													xw.writeAttributeString('name', 'NOMBRE');
													xw.writeString(obra.TITULO.toString());
													xw.writeEndElement();

													xw.writeStartElement("SimpleData");
													xw.writeAttributeString('name', 'MONTO_CONTRATADO');
													xw.writeString(obra.MONTO_CONTRATADO.toString());
													xw.writeEndElement();

													xw.writeStartElement("SimpleData");
													xw.writeAttributeString('name', 'ID_MERCADO_PUB');
													xw.writeString(obra.ID_MERCADO_PUB.toString());
													xw.writeEndElement();
												xw.writeEndElement();
											xw.writeEndElement();
											var spatial = JSON.parse(obra.SPATIAL_OBJECT);
											if(spatial.TYPE == "POINT"){
												xw.writeStartElement("Point");
													xw.writeStartElement("coordinates");
														var coords = "";
														for(l=0; l<spatial.COORDINATES.length; l+=2){
															coords += spatial.COORDINATES[(l)]+",";
															coords += spatial.COORDINATES[l+1]+" ";
														}
														xw.writeString(coords);
													xw.writeEndElement();
												xw.writeEndElement();
											}
											if(spatial.TYPE == "POLYLINE"){
												xw.writeStartElement("LineString");
													xw.writeStartElement("coordinates");
														var coords = "";
														for(l=0; l<spatial.COORDINATES.length; l+=2){
															coords += spatial.COORDINATES[(l)]+",";
															coords += spatial.COORDINATES[l+1]+" ";
														}
														xw.writeString(coords);
													xw.writeEndElement();
												xw.writeEndElement();
											}
											else if(spatial.TYPE == "MULTYGEOMETRY"){
												xw.writeStartElement("MultiGeometry");
												var spa = spatial.ELEMENTS;
												for(h=0;h<spa.length;h++){
													if(spa[h].TYPE == "POINT"){
														xw.writeStartElement("Point");
															xw.writeStartElement("coordinates");
																var coords = "";
																for(l=0; l<spa[h].COORDINATES.length; l+=2){
																	coords += spa[h].COORDINATES[(l)]+",";
																	coords += spa[h].COORDINATES[l+1]+" ";
																}
																xw.writeString(coords);
															xw.writeEndElement();
														xw.writeEndElement();
													}
													else if(spa[h].TYPE == "POLYLINE"){
														xw.writeStartElement("LineString");
															xw.writeStartElement("coordinates");
																var coords = "";
																for(l=0; l<spa[h].COORDINATES.length; l+=2){
																	coords += spa[h].COORDINATES[(l)]+",";
																	coords += spa[h].COORDINATES[l+1]+" ";
																}
																xw.writeString(coords);
															xw.writeEndElement();
														xw.writeEndElement();
													}
												}
												xw.writeEndElement();
											}
										xw.writeEndElement();
									}
								xw.writeEndElement();
							xw.writeEndElement();
						xw.writeEndDocument();
						var data = new Blob([xw.flush()], {type: 'text/plain'});
						var downloadLink = document.createElement("a");
						downloadLink.href = window.URL.createObjectURL(data);
						downloadLink.download = "informe.kml";
						document.body.appendChild(downloadLink);
						downloadLink.click();
						document.body.removeChild(downloadLink);
				        LOADING.hide();
						break;
					case 5:
						var regiones = GEA.PUB.get_comu();
						var xw = new XMLWriter('UTF-8', '1.0');
						var CLASIFICACION = {};
						var model = {
							CODIGO_GEO: "string",
							NOMBRE: "string",
							MONTO_CONTRATADO: "string",
							ID_MERCADO_PUB: "string"
						}
						var line_color = {
							"0": "74C2E1",
							"1": "74C2E1",
							"2": "0191C8",
							"3": "004A80",
						};
						var marker_icon = {
							"0": "CIU/public_html/images/1q.png",
							"1": "CIU/public_html/images/1q.png",
							"2": "CIU/public_html/images/2q.png",
							"3": "CIU/public_html/images/3q.png",
						};
						xw.writeStartDocument();
						xw.writeStartElement("kml");
						xw.writeAttributeString('xmlns', 'http://www.opengis.net/kml/2.2');
						xw.writeStartElement("Document");
							xw.writeStartElement("Folder");
								//INTEGRAMOS EL NOMBRE
								xw.writeStartElement("name");
								xw.writeString("Vista Catastral Comunal")
								xw.writeEndElement();	
								//INTEGRAMOS EL SCHEMA
								xw.writeStartElement("Schema");
								xw.writeAttributeString('name', 'model_data');
								xw.writeAttributeString('id', 'model_data_pattern');
									// AGREGAMOS EL MODELO DE DATOS
									for(key in model){
										xw.writeStartElement("SimpleField");
										xw.writeAttributeString('name', key);
										xw.writeAttributeString('type', 'string');
										xw.writeEndElement();
									}
								xw.writeEndElement();	
								//CARGAMOS LOS DATOS
								//CREAMOS EL INFORME

								for(i=0;i<regiones.length;i++){
									var obra = regiones[i];
									xw.writeStartElement("Placemark");
										xw.writeStartElement("Style");
											var relleno = line_color[obra.C_CLAS];
											var icon = marker_icon[obra.C_CLAS];
											xw.writeStartElement("LineStyle");
												xw.writeStartElement("color");
												xw.writeString("ff"+relleno.substring(4)+relleno.substring(2,4)+relleno.substring(0,2));
												xw.writeEndElement();
												xw.writeStartElement("width");
												xw.writeString("3");
												xw.writeEndElement();
											xw.writeEndElement();
											xw.writeStartElement("IconStyle");
												xw.writeStartElement("color");
												xw.writeString("ff"+relleno.substring(4)+relleno.substring(2,4)+relleno.substring(0,2));
												xw.writeEndElement();
												// COLOR MODE
												xw.writeStartElement("Icon");
													xw.writeStartElement("href");
													xw.writeString("http://www.contraloria.cl/geocgrappcgr/GEOCGR/"+icon);
													xw.writeEndElement();
												xw.writeEndElement();
											xw.writeEndElement();
										xw.writeEndElement();
										xw.writeStartElement("ExtendedData");
											xw.writeStartElement("SchemaData");
											xw.writeAttributeString('schemaUrl', '#model_data_pattern');

												xw.writeStartElement("SimpleData")
												xw.writeAttributeString('name', 'CODIGO_GEO')
												xw.writeString(obra.X_EXPE.toString());
												xw.writeEndElement();

												xw.writeStartElement("SimpleData");
												xw.writeAttributeString('name', 'NOMBRE');
												xw.writeString(obra.TITULO.toString());
												xw.writeEndElement();

												xw.writeStartElement("SimpleData");
												xw.writeAttributeString('name', 'MONTO_CONTRATADO');
												xw.writeString(obra.MONTO_CONTRATADO.toString());
												xw.writeEndElement();

												xw.writeStartElement("SimpleData");
												xw.writeAttributeString('name', 'ID_MERCADO_PUB');
												xw.writeString(obra.ID_MERCADO_PUB.toString());
												xw.writeEndElement();
											xw.writeEndElement();
										xw.writeEndElement();
										var spatial = JSON.parse(obra.SPATIAL_OBJECT);
										if(spatial.TYPE == "POINT"){
											xw.writeStartElement("Point");
												xw.writeStartElement("coordinates");
													var coords = "";
													for(l=0; l<spatial.COORDINATES.length; l+=2){
														coords += spatial.COORDINATES[(l)]+",";
														coords += spatial.COORDINATES[l+1]+" ";
													}
													xw.writeString(coords);
												xw.writeEndElement();
											xw.writeEndElement();
										}
										if(spatial.TYPE == "POLYLINE"){
											xw.writeStartElement("LineString");
												xw.writeStartElement("coordinates");
													var coords = "";
													for(l=0; l<spatial.COORDINATES.length; l+=2){
														coords += spatial.COORDINATES[(l)]+",";
														coords += spatial.COORDINATES[l+1]+" ";
													}
													xw.writeString(coords);
												xw.writeEndElement();
											xw.writeEndElement();
										}
										else if(spatial.TYPE == "MULTYGEOMETRY"){
											xw.writeStartElement("MultiGeometry");
											var spa = spatial.ELEMENTS;
											for(h=0;h<spa.length;h++){
												if(spa[h].TYPE == "POINT"){
													xw.writeStartElement("Point");
														xw.writeStartElement("coordinates");
															var coords = "";
															for(l=0; l<spa[h].COORDINATES.length; l+=2){
																coords += spa[h].COORDINATES[(l)]+",";
																coords += spa[h].COORDINATES[l+1]+" ";
															}
															xw.writeString(coords);
														xw.writeEndElement();
													xw.writeEndElement();
												}
												else if(spa[h].TYPE == "POLYLINE"){
													xw.writeStartElement("LineString");
														xw.writeStartElement("coordinates");
															var coords = "";
															for(l=0; l<spa[h].COORDINATES.length; l+=2){
																coords += spa[h].COORDINATES[(l)]+",";
																coords += spa[h].COORDINATES[l+1]+" ";
															}
															xw.writeString(coords);
														xw.writeEndElement();
													xw.writeEndElement();
												}
											}
											xw.writeEndElement();
										}
									xw.writeEndElement();
								}
							xw.writeEndElement();
						xw.writeEndElement();
						xw.writeEndDocument();
						var data = new Blob([xw.flush()], {type: 'text/plain'});
						var downloadLink = document.createElement("a");
						downloadLink.href = window.URL.createObjectURL(data);
						downloadLink.download = "informe.kml";
						document.body.appendChild(downloadLink);
						downloadLink.click();
						document.body.removeChild(downloadLink);
				        LOADING.hide();
					break;
					case 6:
						var obra = GEA.PUB.getObra();
						var xw = new XMLWriter('UTF-8', '1.0');
						var CLASIFICACION = {};
						var model = {
							CODIGO_GEO: "string",
							NOMBRE: "string",
							MONTO_CONTRATADO: "string",
							ID_MERCADO_PUB: "string"
						}
						var line_color = {
							"0": "74C2E1",
							"1": "74C2E1",
							"2": "0191C8",
							"3": "004A80",
						};
						var marker_icon = {
							"0": "CIU/public_html/images/1q.png",
							"1": "CIU/public_html/images/1q.png",
							"2": "CIU/public_html/images/2q.png",
							"3": "CIU/public_html/images/3q.png",
						};
						xw.writeStartDocument();
						xw.writeStartElement("kml");
						xw.writeAttributeString('xmlns', 'http://www.opengis.net/kml/2.2');
						xw.writeStartElement("Document");
							xw.writeStartElement("Folder");
								//INTEGRAMOS EL NOMBRE
								xw.writeStartElement("name");
								xw.writeString("Vista Catastral Comunal")
								xw.writeEndElement();	
								//INTEGRAMOS EL SCHEMA
								xw.writeStartElement("Schema");
								xw.writeAttributeString('name', 'model_data');
								xw.writeAttributeString('id', 'model_data_pattern');
									// AGREGAMOS EL MODELO DE DATOS
									for(key in model){
										xw.writeStartElement("SimpleField");
										xw.writeAttributeString('name', key);
										xw.writeAttributeString('type', 'string');
										xw.writeEndElement();
									}
								xw.writeEndElement();	
								//CARGAMOS LOS DATOS
								//CREAMOS EL INFORME
								xw.writeStartElement("Placemark");
									xw.writeStartElement("Style");
										var relleno = line_color[obra.C_CLAS];
										var icon = marker_icon[obra.C_CLAS];
										xw.writeStartElement("LineStyle");
											xw.writeStartElement("color");
											xw.writeString("ff"+relleno.substring(4)+relleno.substring(2,4)+relleno.substring(0,2));
											xw.writeEndElement();
											xw.writeStartElement("width");
											xw.writeString("3");
											xw.writeEndElement();
										xw.writeEndElement();
										xw.writeStartElement("IconStyle");
											xw.writeStartElement("color");
											xw.writeString("ff"+relleno.substring(4)+relleno.substring(2,4)+relleno.substring(0,2));
											xw.writeEndElement();
											// COLOR MODE
											xw.writeStartElement("Icon");
												xw.writeStartElement("href");
												xw.writeString("http://www.contraloria.cl/geocgrappcgr/GEOCGR/"+icon);
												xw.writeEndElement();
											xw.writeEndElement();
										xw.writeEndElement();
									xw.writeEndElement();
									xw.writeStartElement("ExtendedData");
										xw.writeStartElement("SchemaData");
										xw.writeAttributeString('schemaUrl', '#model_data_pattern');

											xw.writeStartElement("SimpleData")
											xw.writeAttributeString('name', 'CODIGO_GEO')
											xw.writeString(obra.X_EXPE.toString());
											xw.writeEndElement();

											xw.writeStartElement("SimpleData");
											xw.writeAttributeString('name', 'NOMBRE');
											xw.writeString(obra.TITULO.toString());
											xw.writeEndElement();

											xw.writeStartElement("SimpleData");
											xw.writeAttributeString('name', 'MONTO_CONTRATADO');
											xw.writeString(obra.MONTO_CONTRATADO.toString());
											xw.writeEndElement();

											xw.writeStartElement("SimpleData");
											xw.writeAttributeString('name', 'ID_MERCADO_PUB');
											xw.writeString(obra.ID_MERCADO_PUB.toString());
											xw.writeEndElement();
										xw.writeEndElement();
									xw.writeEndElement();
									var spatial = JSON.parse(obra.SPATIAL_OBJECT);
									if(spatial.TYPE == "POINT"){
										xw.writeStartElement("Point");
											xw.writeStartElement("coordinates");
												var coords = "";
												for(l=0; l<spatial.COORDINATES.length; l+=2){
													coords += spatial.COORDINATES[(l)]+",";
													coords += spatial.COORDINATES[l+1]+" ";
												}
												xw.writeString(coords);
											xw.writeEndElement();
										xw.writeEndElement();
									}
									if(spatial.TYPE == "POLYLINE"){
										xw.writeStartElement("LineString");
											xw.writeStartElement("coordinates");
												var coords = "";
												for(l=0; l<spatial.COORDINATES.length; l+=2){
													coords += spatial.COORDINATES[(l)]+",";
													coords += spatial.COORDINATES[l+1]+" ";
												}
												xw.writeString(coords);
											xw.writeEndElement();
										xw.writeEndElement();
									}
									else if(spatial.TYPE == "MULTYGEOMETRY"){
										xw.writeStartElement("MultiGeometry");
										var spa = spatial.ELEMENTS;
										for(h=0;h<spa.length;h++){
											if(spa[h].TYPE == "POINT"){
												xw.writeStartElement("Point");
													xw.writeStartElement("coordinates");
														var coords = "";
														for(l=0; l<spa[h].COORDINATES.length; l+=2){
															coords += spa[h].COORDINATES[(l)]+",";
															coords += spa[h].COORDINATES[l+1]+" ";
														}
														xw.writeString(coords);
													xw.writeEndElement();
												xw.writeEndElement();
											}
											else if(spa[h].TYPE == "POLYLINE"){
												xw.writeStartElement("LineString");
													xw.writeStartElement("coordinates");
														var coords = "";
														for(l=0; l<spa[h].COORDINATES.length; l+=2){
															coords += spa[h].COORDINATES[(l)]+",";
															coords += spa[h].COORDINATES[l+1]+" ";
														}
														xw.writeString(coords);
													xw.writeEndElement();
												xw.writeEndElement();
											}
										}
										xw.writeEndElement();
									}
							xw.writeEndElement();
						xw.writeEndElement();
						xw.writeEndDocument();
						var data = new Blob([xw.flush()], {type: 'text/plain'});
				        var downloadLink = document.createElement("a");
						downloadLink.href = window.URL.createObjectURL(data);
						downloadLink.download = "informe.kml";
						document.body.appendChild(downloadLink);
						downloadLink.click();
						document.body.removeChild(downloadLink);
				        LOADING.hide();
					break;
				}
				
			},
			xls: function(type){
				LOADING.show("Generando archivo, Espere por favor...");	
				switch(type){
					case 1:
						var valores = {};
						var regiones = GEA.PUB.get_nac();
						for(j=0; j<regiones.length;j++){
							var temp = {};
							temp.NOMBRE = regiones[j].NOMBRE;
							temp.OBRAS = regiones[j].NUMOBRAS;
							temp.MONTO = regiones[j].MONTO_CONTRATADO;
							valores[regiones[j].NUMERO] = temp;
						}
						$("#datatable").remove();
						var tabla = $('<table id="datatable"></table>').appendTo($('body'));
						var fila = $('<tr></tr>').appendTo(tabla);
						$('<td>Codigo de Regi&oacute;n</td>').appendTo(fila);
						$('<td>Nombre de la Region</td>').appendTo(fila);
						$('<td>Inversi&oacute;n Total</td>').appendTo(fila);
						$('<td>Obras Registradas</td>').appendTo(fila);
						$('<td>Inv_Tot_Transporte_Terrestre</td>').appendTo(fila);
						$('<td>Inv_Tot_Portuarias_y_Aeroportuarias</td>').appendTo(fila);
						$('<td>Inv_Tot_Edificaciones_Publicas</td>').appendTo(fila);
						$('<td>Inv_Tot_Salud_y_Sanidad</td>').appendTo(fila);
						$('<td>Inv_Tot_Educaci&oacute;n_y_Cultura</td>').appendTo(fila);
						$('<td>Inv_Tot_Deporte</td>').appendTo(fila);
						$('<td>Inv_Tot_Hidraulicas</td>').appendTo(fila);			
						$('<td>Inv_Tot_Habitacional</td>').appendTo(fila);			
						$('<td>Inv_Tot_Areas_Verdes_y_Equipamiento</td>').appendTo(fila);	
						$('<td>Obras_Reg_Transporte_Terrestre</td>').appendTo(fila);
						$('<td>Obras_Reg_Portuarias_y_Aeroportuarias</td>').appendTo(fila);
						$('<td>Obras_Reg_Edificaciones_Publicas</td>').appendTo(fila);
						$('<td>Obras_Reg_Salud_y_Sanidad</td>').appendTo(fila);
						$('<td>Obras_Reg_Educaci&oacute;n_y_Cultura</td>').appendTo(fila);
						$('<td>Obras_Reg_Deporte</td>').appendTo(fila);
						$('<td>Obras_Reg_Hidraulicas</td>').appendTo(fila);			
						$('<td>Obras_Reg_Habitacional</td>').appendTo(fila);			
						$('<td>Obras_Reg_Areas_Verdes_y_Equipamiento</td>').appendTo(fila);
						for(llave in regiones){
							if(typeof valores[llave] == "undefined") valores[llave] = {};
							var clasi_fil = GEA.SWITCH.clasificacion(regiones[llave].CLASIFICACIONES);
							for(k=0; k<clasi_fil.length; k++){
								valores[llave][CryptoJS.SHA1(clasi_fil[k].NOMBRE).toString()+"_MONTO"] = clasi_fil[k].MONTO_CONTRATADO;
								valores[llave][CryptoJS.SHA1(clasi_fil[k].NOMBRE).toString()+"_NUMERO"] = clasi_fil[k].NUMOBRAS;
							}
						}
						for(d=1; d<16; d++){
							var region = d.toString();
							if(region.length < 2) region = "0"+region;
							var fila2 = $('<tr></tr>').appendTo(tabla);
							$('<td>'+region+'</td>').appendTo(fila2);
							$('<td>'+regiones[region].NOMBRE+'</td>').appendTo(fila2);
							
							var suma = 0;
							for(key in valores[region]){
								if(key.indexOf("_MONTO") != -1) suma += parseInt(valores[region][key]);
							}
							$('<td>'+suma+'</td>').appendTo(fila2);
							var numobras = 0;
							for(key in valores[region]){
								if(key.indexOf("_NUMERO") != -1) numobras += parseInt(valores[region][key]);
							}
							$('<td>'+numobras+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Transporte terrestre").toString()+'_MONTO'] != "undefined")?valores[region][CryptoJS.SHA1("Transporte terrestre").toString()+'_MONTO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Portuarias y aeroportuarias").toString()+'_MONTO'] != "undefined")?valores[region][CryptoJS.SHA1("Portuarias y aeroportuarias").toString()+'_MONTO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Edificaciones públicas").toString()+'_MONTO'] != "undefined")?valores[region][CryptoJS.SHA1("Edificaciones públicas").toString()+'_MONTO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Salud y sanidad").toString()+'_MONTO'] != "undefined")?valores[region][CryptoJS.SHA1("Salud y sanidad").toString()+'_MONTO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Educación y cultura").toString()+'_MONTO'] != "undefined")?valores[region][CryptoJS.SHA1("Educación y cultura").toString()+'_MONTO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Deporte").toString()+'_MONTO'] != "undefined")?valores[region][CryptoJS.SHA1("Deporte").toString()+'_MONTO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Hidráulicas").toString()+'_MONTO'] != "undefined")?valores[region][CryptoJS.SHA1("Hidráulicas").toString()+'_MONTO']:0)+'</td>').appendTo(fila2);			
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Habitacional").toString()+'_MONTO'] != "undefined")?valores[region][CryptoJS.SHA1("Habitacional").toString()+'_MONTO']:0)+'</td>').appendTo(fila2);		
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Areas verdes; esparcimiento y equipamiento vario urbano y rural").toString()+'_MONTO'] != "undefined")?valores[region][CryptoJS.SHA1("Areas verdes; esparcimiento y equipamiento vario urbano y rural").toString()+'_MONTO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Transporte terrestre").toString()+'_NUMERO'] != "undefined")?valores[region][CryptoJS.SHA1("Transporte terrestre").toString()+'_NUMERO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Portuarias y aeroportuarias").toString()+'_NUMERO'] != "undefined")?valores[region][CryptoJS.SHA1("Portuarias y aeroportuarias").toString()+'_NUMERO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Edificaciones públicas").toString()+'_NUMERO'] != "undefined")?valores[region][CryptoJS.SHA1("Edificaciones públicas").toString()+'_NUMERO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Salud y sanidad").toString()+'_NUMERO'] != "undefined")?valores[region][CryptoJS.SHA1("Salud y sanidad").toString()+'_NUMERO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Educación y cultura").toString()+'_NUMERO'] != "undefined")?valores[region][CryptoJS.SHA1("Educación y cultura").toString()+'_NUMERO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Deporte").toString()+'_NUMERO'] != "undefined")?valores[region][CryptoJS.SHA1("Deporte").toString()+'_NUMERO']:0)+'</td>').appendTo(fila2);
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Hidráulicas").toString()+'_NUMERO'] != "undefined")?valores[region][CryptoJS.SHA1("Hidráulicas").toString()+'_NUMERO']:0)+'</td>').appendTo(fila2);			
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Habitacional").toString()+'_NUMERO'] != "undefined")?valores[region][CryptoJS.SHA1("Habitacional").toString()+'_NUMERO']:0)+'</td>').appendTo(fila2);		
							$('<td>'+((typeof valores[region][CryptoJS.SHA1("Areas verdes; esparcimiento y equipamiento vario urbano y rural").toString()+'_NUMERO'] != "undefined")?valores[region][CryptoJS.SHA1("Areas verdes; esparcimiento y equipamiento vario urbano y rural").toString()+'_NUMERO']:0)+'</td>').appendTo(fila2);
						}
						ExcellentExport.excel(document.getElementById("xlsids"), 'datatable', 'Obra.xls');
						var downloadLink = document.createElement("a");
						downloadLink.href = $("#xlsids").attr("href");
						downloadLink.download = "informe.xls";
						document.body.appendChild(downloadLink);
						downloadLink.click();
						document.body.removeChild(downloadLink);
						LOADING.hide();
						break;
					case 2:
						var valores = {};
						var regiones = GEA.PUB.get_regcomu();
						$("#datatable").remove();
						var tabla = $('<table id="datatable"></table>').appendTo($('body'));
						var fila = $('<tr></tr>').appendTo(tabla);
						$('<td>Codígo de Comuna</td>').appendTo(fila);
						$('<td>Nombre de la Comuna</td>').appendTo(fila);
						$('<td>Inversión Total</td>').appendTo(fila);
						$('<td>Obras Registradas</td>').appendTo(fila);
						var CLASIFICACION = {};
						// LLENAMOS LAS CLASIFICACIONES
						SOCKET.request({
							request: "clasificacion/getClasificacion",
							data:{
							},
							callback:function(response){
								for(i=0;i<response.length;i++){
									CLASIFICACION[response[i].NUMERO] = {
										MONTO: 0,
										NUMOBRAS: 0,
										NOMBRE: response[i].NOMBRE
									}
								}
								//AGREGAMOS LAS INV_TOTAL
								for(key in CLASIFICACION){
									$('<td>Inversion Total en '+CLASIFICACION[key].NOMBRE+'</td>').appendTo(fila);
								}
								//AGREGAMOS LAS OBRAS_REG
								for(key in CLASIFICACION){
									$('<td>Obras Registradas en '+CLASIFICACION[key].NOMBRE+'</td>').appendTo(fila);
								}
								//CREAMOS EL INFORME

								for(key in regiones){
									var clasi_clone = PRIV.clone(CLASIFICACION);
									if(typeof regiones[key].CLASIFICACIONES != "undefined"){
										for(l=0;l<regiones[key].CLASIFICACIONES.length;l++){
											clasi_clone[regiones[key].CLASIFICACIONES[l].NUMERO] = {
												MONTO: parseInt(regiones[key].CLASIFICACIONES[l].MONTO_CONTRATADO),
												NUMOBRAS: parseInt(regiones[key].CLASIFICACIONES[l].NUMOBRAS),
												NOMBRE: regiones[key].CLASIFICACIONES[l].NOMBRE
											}
										}
									}
									
									var fila2 = $('<tr></tr>').appendTo(tabla);
									$('<td>'+key+'</td>').appendTo(fila2);
									$('<td>'+regiones[key].NOMBRE+'</td>').appendTo(fila2);	
									$('<td>'+regiones[key].MONTO_CONTRATADO+'</td>').appendTo(fila2);
									$('<td>'+regiones[key].NUMOBRAS+'</td>').appendTo(fila2);
									for(key2 in clasi_clone){
										$('<td>'+clasi_clone[key2].MONTO+'</td>').appendTo(fila2);
									}
									for(key2 in clasi_clone){
										$('<td>'+clasi_clone[key2].NUMOBRAS+'</td>').appendTo(fila2);
									}
								}
								// DESCARGAMOS EL INFORME
								ExcellentExport.excel(document.getElementById("xlsids"), 'datatable', 'Obra.xls');
								var downloadLink = document.createElement("a");
								downloadLink.href = $("#xlsids").attr("href");
								downloadLink.download = "informe.xls";
								document.body.appendChild(downloadLink);
								downloadLink.click();
								document.body.removeChild(downloadLink);
								LOADING.hide();
							},
							buffered: true
						});						
						break;
					case 3:
						var valores = {};
						var regiones = GEA.PUB.get_regprovi();
						$("#datatable").remove();
						var tabla = $('<table id="datatable"></table>').appendTo($('body'));
						var fila = $('<tr></tr>').appendTo(tabla);
						$('<td>Codígo de Provincia</td>').appendTo(fila);
						$('<td>Nombre de la Provincia</td>').appendTo(fila);
						$('<td>Inversión Total</td>').appendTo(fila);
						$('<td>Obras Registradas</td>').appendTo(fila);
						var CLASIFICACION = {};
						// LLENAMOS LAS CLASIFICACIONES
						SOCKET.request({
							request: "clasificacion/getClasificacion",
							data:{
							},
							callback:function(response){
								for(i=0;i<response.length;i++){
									CLASIFICACION[response[i].NUMERO] = {
										MONTO: 0,
										NUMOBRAS: 0,
										NOMBRE: response[i].NOMBRE
									}
								}
								//AGREGAMOS LAS INV_TOTAL
								for(key in CLASIFICACION){
									$('<td>Inversion Total en '+CLASIFICACION[key].NOMBRE+'</td>').appendTo(fila);
								}
								//AGREGAMOS LAS OBRAS_REG
								for(key in CLASIFICACION){
									$('<td>Obras Registradas en '+CLASIFICACION[key].NOMBRE+'</td>').appendTo(fila);
								}
								//CREAMOS EL INFORME
								for(key in regiones){
									var clasi_clone = PRIV.clone(CLASIFICACION);
									if(typeof regiones[key].CLASIFICACIONES != "undefined"){
										for(l=0;l<regiones[key].CLASIFICACIONES.length;l++){
											clasi_clone[regiones[key].CLASIFICACIONES[l].NUMERO] = {
												MONTO: parseInt(regiones[key].CLASIFICACIONES[l].MONTO_CONTRATADO),
												NUMOBRAS: parseInt(regiones[key].CLASIFICACIONES[l].NUMOBRAS),
												NOMBRE: regiones[key].CLASIFICACIONES[l].NOMBRE
											}
										}
									}
									
									var fila2 = $('<tr></tr>').appendTo(tabla);
									$('<td>'+key+'</td>').appendTo(fila2);
									$('<td>'+regiones[key].NOMBRE+'</td>').appendTo(fila2);	
									$('<td>'+regiones[key].MONTO_CONTRATADO+'</td>').appendTo(fila2);
									$('<td>'+regiones[key].NLOCAOBRAS+'</td>').appendTo(fila2);
									for(key2 in clasi_clone){
										$('<td>'+clasi_clone[key2].MONTO+'</td>').appendTo(fila2);
									}
									for(key2 in clasi_clone){
										$('<td>'+clasi_clone[key2].NUMOBRAS+'</td>').appendTo(fila2);
									}
								}
								// DESCARGAMOS EL INFORME
								ExcellentExport.excel(document.getElementById("xlsids"), 'datatable', 'Obra.xls');
								var downloadLink = document.createElement("a");
								downloadLink.href = $("#xlsids").attr("href");
								downloadLink.download = "informe.xls";
								document.body.appendChild(downloadLink);
								downloadLink.click();
								document.body.removeChild(downloadLink);
								LOADING.hide();
							},
							buffered: true
						});
						break;
					case 4:
						var valores = {};
						var regiones = GEA.PUB.get_provi();
						var lista = {
							"TITULO": "NOMBRE DE LA OBRA",
							"NOMBRE_CORTO": "NOMBRE CORTO",
							"TREGION": "REGION",
							"TPROVINCIA": "PROVINCIA",
							"TCOMUNA": "COMUNA",
							"CLASIFICACION": "CLASIFICACI&Oacute;N",
							"PLAZO_EJE": "PLAZO DE EJECUCI&Oacute;N",
							"DESCRIPCION": "DESCRIPCION DE LA OBRA",
							"ID_MERCADO_PUB": "CODIGO DE MERCADO PUBLICO",
							"CODIGO_BIP": "CODIGO BIP",
							"PROC_CONTRATACION": "PROCEDIMIENTO DE CONTRATACI&Oacute;N",
							"MONTO_CONTRATADO": "MONTO CONTRATADO",
							"SERV_CONTR": "SERVICIO CONTRATANTE",
							"SERV_MAND": "SERVICIO MANDANTE",
							"NOMBRE_INSP_FIS": "NOMBRE INSPECTOR FISCAL",
							"RUN_INSP_FIS": "RUN INSPECTOR FISCAL",
							"NOMBRE_EJECUTOR": "NOMBRE/RAZON SOCIAL",
							"RUT_EJECUTOR": "RUN/RUT",
							"FECHA_INI": "FECHA DE INICIO",
							"FECHA_FIN": "FECHA DE TERMINO"
						};
						$("#datatable").remove();
						var tabla = $('<table id="datatable"></table>').appendTo($('body'));
						var fila = $('<tr></tr>').appendTo(tabla);
						for(llave in lista){
							$('<td>'+lista[llave]+'</td>').appendTo(fila);
						}
						for(i=0; i<regiones.length;i++){
							var obra = regiones[i];
							obra.NOMBRE_INSP_FIS = obra.NOMBRE_INSP_FIS+" "+obra.APELLIDO_P_INSP_FIS+" "+obra.APELLIDO_M_INSP_FIS;
							if(obra.RUT_CONTRATIS != "No Existe Registro"){
								obra.RUT_EJECUTOR = obra.RUT_CONTRATIS;
								obra.NOMBRE_EJECUTOR = obra.NOMBRE_CONTRATIS+" "+obra.APELLIDOS_CONTRATIS;
							}
							else
							{
								obra.NOMBRE_EJECUTOR = obra.NOMBRE_CONSORCIO+" "+obra.APELLIDOS_CONSORCIO;
								obra.RUT_EJECUTOR = obra.RUT_CONS;
							}
							if(obra.PROC_CONTRATACION == "PR") obra.PROC_CONTRATACION = "Propuesta privada.";
							if(obra.PROC_CONTRATACION == "PU") obra.PROC_CONTRATACION = "Propuesta p&uacute;blica.";
							if(obra.PROC_CONTRATACION == "TD") obra.PROC_CONTRATACION = "Trato directo.";
							if(obra.PROC_CONTRATACION == "UN") obra.PROC_CONTRATACION = "Precio Unitario.";
							var fila2 = $('<tr></tr>').appendTo(tabla);
							for(llave in lista){
								if(typeof obra[llave] == "Number"){
									var elemento = (typeof obra[llave] != "undefined")?obra[llave]:0;
									$('<td>'+parseInt(elemento)+'</td>').appendTo(fila2);	
								}
								else{
									var elemento = (typeof obra[llave] != "undefined")?obra[llave]:"No existe Registro";
									$('<td>'+elemento+'</td>').appendTo(fila2);
								}
							}
						}
						ExcellentExport.excel(document.getElementById("xlsids"), 'datatable', 'Obra.xls');
						var downloadLink = document.createElement("a");
						downloadLink.href = $("#xlsids").attr("href");
						downloadLink.download = "informe.xls";
						document.body.appendChild(downloadLink);
						downloadLink.click();
						document.body.removeChild(downloadLink);	
						LOADING.hide();	
						break;
					case 5:
						var valores = {};
						var regiones = GEA.PUB.get_comu();
						var lista = {
							"TITULO": "NOMBRE DE LA OBRA",
							"NOMBRE_CORTO": "NOMBRE CORTO",
							"TREGION": "REGION",
							"TPROVINCIA": "PROVINCIA",
							"TCOMUNA": "COMUNA",
							"CLASIFICACION": "CLASIFICACI&Oacute;N",
							"PLAZO_EJE": "PLAZO DE EJECUCI&Oacute;N",
							"DESCRIPCION": "DESCRIPCION DE LA OBRA",
							"ID_MERCADO_PUB": "CODIGO DE MERCADO PUBLICO",
							"CODIGO_BIP": "CODIGO BIP",
							"PROC_CONTRATACION": "PROCEDIMIENTO DE CONTRATACI&Oacute;N",
							"MONTO_CONTRATADO": "MONTO CONTRATADO",
							"SERV_CONTR": "SERVICIO CONTRATANTE",
							"SERV_MAND": "SERVICIO MANDANTE",
							"NOMBRE_INSP_FIS": "NOMBRE INSPECTOR FISCAL",
							"RUN_INSP_FIS": "RUN INSPECTOR FISCAL",
							"NOMBRE_EJECUTOR": "NOMBRE/RAZON SOCIAL",
							"RUT_EJECUTOR": "RUN/RUT",
							"FECHA_INI": "FECHA DE INICIO",
							"FECHA_FIN": "FECHA DE TERMINO"
						};
						$("#datatable").remove();
						var tabla = $('<table id="datatable"></table>').appendTo($('body'));
						var fila = $('<tr></tr>').appendTo(tabla);
						for(llave in lista){
							$('<td>'+lista[llave]+'</td>').appendTo(fila);
						}
						for(i=0; i<regiones.length;i++){
							var obra = regiones[i];
							obra.NOMBRE_INSP_FIS = obra.NOMBRE_INSP_FIS+" "+obra.APELLIDO_P_INSP_FIS+" "+obra.APELLIDO_M_INSP_FIS;
							if(obra.RUT_CONTRATIS != "No Existe Registro"){
								obra.RUT_EJECUTOR = obra.RUT_CONTRATIS;
								obra.NOMBRE_EJECUTOR = obra.NOMBRE_CONTRATIS+" "+obra.APELLIDOS_CONTRATIS;
							}
							else
							{
								obra.NOMBRE_EJECUTOR = obra.NOMBRE_CONSORCIO+" "+obra.APELLIDOS_CONSORCIO;
								obra.RUT_EJECUTOR = obra.RUT_CONS;
							}
							if(obra.PROC_CONTRATACION == "PR") obra.PROC_CONTRATACION = "Propuesta privada.";
							if(obra.PROC_CONTRATACION == "PU") obra.PROC_CONTRATACION = "Propuesta p&uacute;blica.";
							if(obra.PROC_CONTRATACION == "TD") obra.PROC_CONTRATACION = "Trato directo.";
							if(obra.PROC_CONTRATACION == "UN") obra.PROC_CONTRATACION = "Precio Unitario.";
							var fila2 = $('<tr></tr>').appendTo(tabla);
							for(llave in lista){
								if(typeof obra[llave] == "Number"){
									var elemento = (typeof obra[llave] != "undefined")?obra[llave]:0;
									$('<td>'+parseInt(elemento)+'</td>').appendTo(fila2);	
								}
								else{
									var elemento = (typeof obra[llave] != "undefined")?obra[llave]:"No existe Registro";
									$('<td>'+elemento+'</td>').appendTo(fila2);
								}
							}
						}
						ExcellentExport.excel(document.getElementById("xlsids"), 'datatable', 'Obra.xls');
						var downloadLink = document.createElement("a");
						downloadLink.href = $("#xlsids").attr("href");
						downloadLink.download = "informe.xls";
						document.body.appendChild(downloadLink);
						downloadLink.click();
						document.body.removeChild(downloadLink);	
						LOADING.hide();	
						break;
					case 6:
						var valores = {};
						var lista = {
							"TITULO": "NOMBRE DE LA OBRA",
							"NOMBRE_CORTO": "NOMBRE CORTO",
							"TREGION": "REGION",
							"TPROVINCIA": "PROVINCIA",
							"TCOMUNA": "COMUNA",
							"CLASIFICACION": "CLASIFICACI&Oacute;N",
							"PLAZO_EJE": "PLAZO DE EJECUCI&Oacute;N",
							"DESCRIPCION": "DESCRIPCION DE LA OBRA",
							"ID_MERCADO_PUB": "CODIGO DE MERCADO PUBLICO",
							"CODIGO_BIP": "CODIGO BIP",
							"PROC_CONTRATACION": "PROCEDIMIENTO DE CONTRATACI&Oacute;N",
							"MONTO_CONTRATADO": "MONTO CONTRATADO",
							"SERV_CONTR": "SERVICIO CONTRATANTE",
							"SERV_MAND": "SERVICIO MANDANTE",
							"NOMBRE_INSP_FIS": "NOMBRE INSPECTOR FISCAL",
							"RUN_INSP_FIS": "RUN INSPECTOR FISCAL",
							"NOMBRE_EJECUTOR": "NOMBRE/RAZON SOCIAL",
							"RUT_EJECUTOR": "RUN/RUT",
							"FECHA_INI": "FECHA DE INICIO",
							"FECHA_FIN": "FECHA DE TERMINO"
						};
						$("#datatable").remove();
						var tabla = $('<table id="datatable"></table>').appendTo($('body'));
						var fila = $('<tr></tr>').appendTo(tabla);
						for(llave in lista){
							$('<td>'+lista[llave]+'</td>').appendTo(fila);
						}
						var obra = GEA.PUB.get_obra_actual();
						obra.NOMBRE_INSP_FIS = obra.NOMBRE_INSP_FIS+" "+obra.APELLIDO_P_INSP_FIS+" "+obra.APELLIDO_M_INSP_FIS;
						if(obra.RUT_CONTRATIS != "No Existe Registro"){
							obra.RUT_EJECUTOR = obra.RUT_CONTRATIS;
							obra.NOMBRE_EJECUTOR = obra.NOMBRE_CONTRATIS+" "+obra.APELLIDOS_CONTRATIS;
						}
						else
						{
							obra.NOMBRE_EJECUTOR = obra.NOMBRE_CONSORCIO+" "+obra.APELLIDOS_CONSORCIO;
							obra.RUT_EJECUTOR = obra.RUT_CONS;
						}
						if(obra.PROC_CONTRATACION == "PR") obra.PROC_CONTRATACION = "Propuesta privada.";
						if(obra.PROC_CONTRATACION == "PU") obra.PROC_CONTRATACION = "Propuesta p&uacute;blica.";
						if(obra.PROC_CONTRATACION == "TD") obra.PROC_CONTRATACION = "Trato directo.";
						if(obra.PROC_CONTRATACION == "UN") obra.PROC_CONTRATACION = "Precio Unitario.";
						var fila2 = $('<tr></tr>').appendTo(tabla);
						for(llave in lista){
							if(typeof obra[llave] == "Number"){
								var elemento = (typeof obra[llave] != "undefined")?obra[llave]:0;
								$('<td>'+parseInt(elemento)+'</td>').appendTo(fila2);	
							}
							else{
								var elemento = (typeof obra[llave] != "undefined")?obra[llave]:"No existe Registro";
								$('<td>'+elemento+'</td>').appendTo(fila2);
							}
						}
						ExcellentExport.excel(document.getElementById("xlsids"), 'datatable', 'Obra.xls');
						var downloadLink = document.createElement("a");
						downloadLink.href = $("#xlsids").attr("href");
						downloadLink.download = "informe.xls";
						document.body.appendChild(downloadLink);
						downloadLink.click();
						document.body.removeChild(downloadLink);		
						LOADING.hide();
						break;
				}
			},
			clear: function(){
				$("#link").attr("href", "#");
				settings.status = false;
			},
			get_status: function(){
				return settings.status;
			},
			pdf: function(type){
				switch(type){
					case 1:
						LOADING.show("Generando vista previa, Espere por favor...");
						
						$("#close_r_form").unbind().on('click', function(){
							$(".pdf_report").hide();
						});
						$("#visualizar_pdf").unbind().on('click', function(){
							$(".pdf_modal").hide();
						});
						$("#descargar_pdf").unbind().on('click', function(){
							LOADING.show("Generando archivo, Espere por favor...");
							$(".pdf_modal").hide();
							setTimeout(function(){
								html2canvas($(".pdf_report_div"), {
								  useCORS: true,
								  onrendered: function(canvas)
								  {
								    var dataUrl= canvas.toDataURL('image/jpeg');
								    var doc = new jsPDF();
									doc.addImage(dataUrl, 'JPEG', 10, 15, 190, 150);
								    $(".gm-style>div:first>div").css({
								      left:0,
								      top:0,
								      "transform":transform
								    })
								    doc.output('save', "Obra");
								  }
								});
								$(".pdf_modal").hide();
								$(".pdf_report").hide();
								LOADING.hide();
							},5000);
						});
						var transform=$(".gm-style>div:first>div").css("transform")
						var comp=transform.split(",") //split up the transform matrix
						var mapleft=parseFloat(comp[4]) //get left value
						var maptop=parseFloat(comp[5])  //get top value
						$(".gm-style>div:first>div").css({ //get the map container. not sure if stable
						  "transform":"none",
						  "left":mapleft,
						  "top":maptop,
						})
						var mapOptions = {
							center: new google.maps.LatLng(-43.43778, -70.65028),
				          	zoom: 4
				        };
				        $(".pdf_report").show(function(){
				        	var METADATA;
				        	REPORTEPDF = new REPORT({
								target: "pdfreportmap",
								initLat: _CONFIG._MAP.LAT,
								initLng: (_CONFIG._MAP.LNG),
								initZoom: 4,
								maxZoom: _CONFIG._MAP.MAXZOOM,
								minZoom: _CONFIG._MAP.MINZOOM,
								styled:true,
								callback: function(){
									var q = {
										q0:$("#leyenda-color #q1").css("background-color"),
										q1:$("#leyenda-color #q1").css("background-color"),
										q2:$("#leyenda-color #q2").css("background-color"),
										q3:$("#leyenda-color #q3").css("background-color"),
										q4:$("#leyenda-color #q4").css("background-color"),
										q5:$("#leyenda-color #q5").css("background-color")
									};
									SOCKET.request({
										request: "regiones/get", 
										callback:function(response){
											var polyregion = {};
											METADATA = GEA.PUB.metadata_cartografica(response.regiones);
											$.each(response.regiones, function(key,value){
												var aux = GEA.SWITCH.getDataBySwitch(value);
												var quintil = aux.QUINTIL;
												var coordenadas = JSON.parse(aux.SPATIAL_OBJECT);
												var info = $("#pdf_r"+parseInt(aux.NUMERO));
												info.empty();
												$("<div></div>").addClass("t1").html(aux.NOMBRE).appendTo(info);
												$("<div></div>").addClass("t2").html(PRIV.number_format(aux.MONTO_CONTRATADO,0,",",".")).appendTo(info);
												$("<div></div>").addClass("t3").html(aux.NUMOBRAS).appendTo(info);
												for(k=0;k<coordenadas.length;k++){
													var poligono = [];
													for(l=0; l<coordenadas[k].length; l+=2){
														poligono.push(new google.maps.LatLng(coordenadas[k][(l)],coordenadas[k][l+1]));
													}
													REPORTEPDF.PUB.load_polygon(poligono,{
														rellenocolor: q["q"+Math.ceil(aux.MONTO_CONTRATADO/METADATA._MAX_MONTO*5)]
													});	
												}
											})	
											LOADING.hide();
											$(".pdf_modal").show();							
										},
										buffered: true
									});
									GRAFICOPDF = new GRAFICOCLA({
										container: $("#grafico_pdf")
									});
									SOCKET.request({
										request: "clasificacion/getNacional",
										callback:function(response){
											var aux = GEA.SWITCH.clasificacion(response);
											var totalobras = 0;
											var numobras = 0;
											for(i=0; i<aux.length; i++){
												totalobras += aux[i].MONTO_CONTRATADO;
												numobras += aux[i].NUMOBRAS;
											}
											//CARGAMOS LOS DATOS DE STAT EN EL HEADER
											$("#inversiontotal_pdf").children('.data').html("$ "+PRIV.number_format(totalobras,0,"","."));
											$("#numobras_pdf").children('.data').html(PRIV.number_format(numobras,0,"","."));
											GRAFICOPDF.PUB.make(aux,METADATA);
										},
										buffered: true
									});
									var fecha = new Date();
									$("#fecha_pdf_value").html(fecha.getDate()+"-"+(fecha.getMonth()+1)+"-"+fecha.getFullYear());
									$("#pdf_report_reg_comu").hide();
								}
							});
				        });
						break;
					case 2:
						LOADING.show("Generando vista previa, Espere por favor...");
						var div = $("#report_div_1");
						div.remove();
						div.appendTo($("#report_pdf_arg"));						
						$("#visualizar_pdf").unbind().on('click', function(){
							$(".pdf_modal").hide();
						});
						var mapOptions = {
							center: new google.maps.LatLng(-43.43778, -70.65028),
				          	zoom: 4
				        };
				        $("#pdf_report_reg_comu").show(function(){
				        	$(".pdf_modal").show();
				        	$("#report_div_1").show();
				        	REPORTEPDF = new REPORT({
								target: "pdfreportmap_reg_comu",
								initLat: _CONFIG._MAP.LAT,
								initLng: (_CONFIG._MAP.LNG),
								initZoom: 4,
								maxZoom: _CONFIG._MAP.MAXZOOM,
								minZoom: _CONFIG._MAP.MINZOOM,
								styled:true,
								callback: function(){
									var q = {
										q0:$("#leyenda-color #q1").css("background-color"),
										q1:$("#leyenda-color #q1").css("background-color"),
										q2:$("#leyenda-color #q2").css("background-color"),
										q3:$("#leyenda-color #q3").css("background-color"),
										q4:$("#leyenda-color #q4").css("background-color"),
										q5:$("#leyenda-color #q5").css("background-color")
									};
									var regiones = GEA.PUB.get_regcomu();
									var numcomu = Object.keys(regiones).length;
									//CARGAMOS LOS CAMPOS QUE NECESITAMOS
									$("#report_div_2").children("#panelizq").children(".cabecera").empty();
									$("<div></div>").addClass("t1").html("Nombre de la comuna").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									$("<div></div>").addClass("t2").html("Inversi&oacute;n total").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									$("<div></div>").addClass("t3").html("Obras Registradas").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									//CREAMOS LAS CAPAS ADICIONALES
									var numpag = Math.ceil(numcomu/20);
									$("#report_pdf_arg_global").html((numpag+1));
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_actual_info_reg").html("2");
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_total_info_reg").html((numpag+1));
									//GENERAMOS EL DESCARGA PDF
									$("#descargar_pdf").unbind().on('click', function(){
										var renders = [];
										LOADING.show("Generando archivo, Espere por favor...");
										$(".pdf_modal").hide();
										setTimeout(function(){
											PRIV.render(renders,1,(numpag+1), function(can){
												var doc = new jsPDF();
												for(i=0;i<can.length;i++)
												{
													if(i > 0) doc.addPage();
													doc.addImage(can[i], 'JPEG', 10, 15, 190, 150);
											 	}
											 	$(".gm-style>div:first>div").css({
											      	left:0,
											      	top:0,
											      	"transform":transform
											    })
											    doc.output('save', "Obra");
												LOADING.hide();
												$(".pdf_report").hide();
												for(l=1;l<numpag;l++){
													$("#report_div_"+(l+2)).remove();
												}
												var div = $("#report_div_1");
												div.remove();
												div.appendTo($("#report_pdf_arg"));
											});
										},5000);
									});
									//CARGAMOS LEYENDA
									$("#panelizqbot1").show();
									$("#panelizqbot2").hide();
									$("#pdf_tipo_reg").html("Nivel Regional");
									$("#pdf_tipo_reg_resumen").html("Resumen por comunas");
									$("#report_div_2").children("#panelizq").children("#pdf_r18").show();
									$("#report_div_2").children("#panelizq").children("#pdf_r19").show();
									$("#report_div_2").children("#panelizq").children("#pdf_r17").removeAttr('style');
									$("#report_div_2").children("#paneldere").children(".clasificacion").show();
									//LIMPIAMOS LOS REGISTROS
									for(i=1; i<=20; i++){
										$("#report_div_2").children("#panelizq").children("#pdf_r"+i).empty();
									}
									//CLONAMOS LAS CAPAS
									for(l=1;l<numpag;l++){
										$("#report_div_2").clone().attr('id', 'report_div_'+(l+2)).prependTo($("#report_pdf_arg"));
										$("#report_div_"+(l+2)).children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_actual_info_reg").html((l+2));
										$("#report_div_"+(l+2)).children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_total_info_reg").html((numpag+1));
									}
									//REMOVEMOS LAS CAPAS EN CLOSE
									$("#close_r_form_reg").unbind().on('click', function(){
										$(".pdf_report").hide();
										for(l=1;l<numpag;l++){
											$("#report_div_"+(l+2)).remove();
										}
										var div = $("#report_div_1");
										div.remove();
										div.appendTo($("#report_pdf_arg"));
									});
									var acumulador_regiones = 1;
									var acumulador_regresivo = 1;
									var COMUNAS = [];
									for(key in regiones){
										COMUNAS.push(regiones[key]);
									}
									var METADATA = GEA.PUB.metadata_cartografica(COMUNAS);
									for(key in regiones){
										var quintil = regiones[key].QUINTIL;
										var coordenadas = JSON.parse(regiones[key].SPATIAL_OBJECT);
										var info = $("#report_div_"+(Math.ceil(acumulador_regiones++/20)+1)).children("#panelizq").children("#pdf_r"+acumulador_regresivo++);
										info.removeAttr('style');
										info.empty();
										$("<div></div>").addClass("t1").html(regiones[key].NOMBRE).appendTo(info);
										$("<div></div>").addClass("t2").html(PRIV.number_format(regiones[key].MONTO_CONTRATADO,0,",",".")).appendTo(info);
										$("<div></div>").addClass("t3").html(regiones[key].NUMOBRAS).appendTo(info);
										for(k=0;k<coordenadas.length;k++){
											var poligono = [];
											for(l=0; l<coordenadas[k].length; l+=2){
												poligono.push(new google.maps.LatLng(coordenadas[k][(l)],coordenadas[k][l+1]));
											}
											REPORTEPDF.PUB.load_polygon(poligono,{
												rellenocolor: q["q"+Math.floor(regiones[key].MONTO_CONTRATADO/METADATA._MAX_MONTO*5)]
											});	
										}
										if(acumulador_regresivo > 20) acumulador_regresivo = 1;
									}
									//PANELES DE DESPLAZAMIENTO
									var actual = 1;
									var total = numpag+1;
									$("#mov_dere_pdf_reg").unbind().on('click',function(){
										if(actual < total){
											$("#report_div_"+actual).prependTo($("#report_pdf_arg"));
											actual++;
										}	
									});
									$("#mov_izq_pdf_reg").unbind().on('click',function(){
										if(actual > 1){
											var act = $("#report_pdf_arg").children(".pdf_report_div_info").first();
											act.appendTo($("#report_pdf_arg"));
											actual--;
										}	
									});
									REPORTEPDF.PUB.fit_to_content();
									LOADING.hide();
									var fecha = new Date();
									$(".fecha_pdf_value").each(function(){
										$(this).html(fecha.getDate()+"-"+(fecha.getMonth()+1)+"-"+fecha.getFullYear());
									});
								}
							});
				        });
						break;
					case 3:
						LOADING.show("Generando vista previa, Espere por favor...");
						var div = $("#report_div_1");
						div.remove();
						div.appendTo($("#report_pdf_arg"));						
						$("#visualizar_pdf").unbind().on('click', function(){
							$(".pdf_modal").hide();
						});
						var mapOptions = {
							center: new google.maps.LatLng(-43.43778, -70.65028),
				          	zoom: 4
				        };
				        $("#pdf_report_reg_comu").show(function(){
				        	$(".pdf_modal").show();
				        	$("#report_div_1").show();
				        	REPORTEPDF = new REPORT({
								target: "pdfreportmap_reg_comu",
								initLat: _CONFIG._MAP.LAT,
								initLng: (_CONFIG._MAP.LNG),
								initZoom: 4,
								maxZoom: _CONFIG._MAP.MAXZOOM,
								minZoom: _CONFIG._MAP.MINZOOM,
								styled:true,
								callback: function(){
									var q = {
										q0:$("#leyenda-color #q1").css("background-color"),
										q1:$("#leyenda-color #q1").css("background-color"),
										q2:$("#leyenda-color #q2").css("background-color"),
										q3:$("#leyenda-color #q3").css("background-color"),
										q4:$("#leyenda-color #q4").css("background-color"),
										q5:$("#leyenda-color #q5").css("background-color")
									};
									var regiones = GEA.PUB.get_regprovi();
									var numcomu = Object.keys(regiones).length;
									//CARGAMOS LOS CAMPOS QUE NECESITAMOS
									$("#report_div_2").children("#panelizq").children(".cabecera").empty();
									$("<div></div>").addClass("t1").html("Nombre de la provincia").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									$("<div></div>").addClass("t2").html("Inversi&oacute;n total").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									$("<div></div>").addClass("t3").html("Obras Registradas").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									//CREAMOS LAS CAPAS ADICIONALES
									var numpag = Math.ceil(numcomu/20);
									$("#report_pdf_arg_global").html((numpag+1));
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_actual_info_reg").html("2");
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_total_info_reg").html((numpag+1));
									//CARGAMOS LEYENDA
									$("#panelizqbot1").show();
									$("#panelizqbot2").hide();
									$("#pdf_tipo_reg").html("Nivel Regional");
									$("#pdf_tipo_reg_resumen").html("Resumen por provincias");
									$("#report_div_2").children("#panelizq").children("#pdf_r18").show();
									$("#report_div_2").children("#panelizq").children("#pdf_r19").show();
									$("#report_div_2").children("#panelizq").children("#pdf_r17").removeAttr('style');
									$("#report_div_2").children("#paneldere").children(".clasificacion").show();
									//LIMPIAMOS LOS REGISTROS
									for(i=1; i<=20; i++){
										$("#report_div_2").children("#panelizq").children("#pdf_r"+i).empty();
									}
									//CLONAMOS LAS CAPAS
									for(l=1;l<numpag;l++){
										$("#report_div_2").clone().attr('id', 'report_div_'+(l+2)).prependTo($("#report_pdf_arg"));
										$("#report_div_"+(l+2)).children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_actual_info_reg").html((l+2));
										$("#report_div_"+(l+2)).children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_total_info_reg").html((numpag+1));
									}
									//GENERAMOS EL DESCARGA PDF
									$("#descargar_pdf").unbind().on('click', function(){
										var renders = [];
										LOADING.show("Generando archivo, Espere por favor...");
										$(".pdf_modal").hide();
										setTimeout(function(){
											PRIV.render(renders,1,(numpag+1), function(can){
												var doc = new jsPDF();
												for(i=0;i<can.length;i++)
												{
													if(i > 0) doc.addPage();
													doc.addImage(can[i], 'JPEG', 10, 15, 190, 150);
											 	}
											 	$(".gm-style>div:first>div").css({
											      	left:0,
											      	top:0,
											      	"transform":transform
											    })
											    doc.output('save', "Obra");
												LOADING.hide();
												$(".pdf_report").hide();
												for(l=1;l<numpag;l++){
													$("#report_div_"+(l+2)).remove();
												}
												var div = $("#report_div_1");
												div.remove();
												div.appendTo($("#report_pdf_arg"));
											});
										},5000);
									});
									//REMOVEMOS LAS CAPAS EN CLOSE
									$("#close_r_form_reg").unbind().on('click', function(){
										$(".pdf_report").hide();
										for(l=1;l<numpag;l++){
											$("#report_div_"+(l+2)).remove();
										}
										var div = $("#report_div_1");
										div.remove();
										div.appendTo($("#report_pdf_arg"));
									});
									var acumulador_regiones = 1;
									var acumulador_regresivo = 1;
									var PROVINCIAS = [];
									for(key in regiones){
										PROVINCIAS.push(regiones[key]);
									}
									var METADATA = GEA.PUB.metadata_cartografica(PROVINCIAS);
									for(key in regiones){
										var quintil = regiones[key].QUINTIL;
										var coordenadas = JSON.parse(regiones[key].SPATIAL_OBJECT);
										var info = $("#report_div_"+(Math.ceil(acumulador_regiones++/20)+1)).children("#panelizq").children("#pdf_r"+acumulador_regresivo++);
										info.removeAttr('style');
										info.attr('style','');
										info.empty();
										$("<div></div>").addClass("t1").html(regiones[key].NOMBRE).appendTo(info);
										$("<div></div>").addClass("t2").html(PRIV.number_format(regiones[key].MONTO_CONTRATADO,0,",",".")).appendTo(info);
										$("<div></div>").addClass("t3").html(regiones[key].NUMOBRAS).appendTo(info);
										for(k=0;k<coordenadas.length;k++){
											var poligono = [];
											for(l=0; l<coordenadas[k].length; l+=2){
												poligono.push(new google.maps.LatLng(coordenadas[k][(l)],coordenadas[k][l+1]));
											}
											REPORTEPDF.PUB.load_polygon(poligono,{
												rellenocolor: q["q"+Math.floor(regiones[key].MONTO_CONTRATADO/METADATA._MAX_MONTO*5)]
											});	
										}
										if(acumulador_regresivo > 20) acumulador_regresivo = 1;
									}
									//PANELES DE DESPLAZAMIENTO
									var actual = 1;
									var total = numpag+1;
									$("#mov_dere_pdf_reg").unbind().on('click',function(){
										if(actual < total){
											$("#report_div_"+actual).prependTo($("#report_pdf_arg"));
											actual++;
										}	
									});
									$("#mov_izq_pdf_reg").unbind().on('click',function(){
										if(actual > 1){
											var act = $("#report_pdf_arg").children(".pdf_report_div_info").first();
											act.appendTo($("#report_pdf_arg"));
											actual--;
										}	
									});
									REPORTEPDF.PUB.fit_to_content();
									LOADING.hide();
									var fecha = new Date();
									$(".fecha_pdf_value").each(function(){
										$(this).html(fecha.getDate()+"-"+(fecha.getMonth()+1)+"-"+fecha.getFullYear());
									});
								}
							});
				        });
						break;
					case 4:
						LOADING.show("Generando vista previa, Espere por favor...");
						var div = $("#report_div_1");
						div.remove();
						div.appendTo($("#report_pdf_arg"));						
						$("#visualizar_pdf").unbind().on('click', function(){
							$(".pdf_modal").hide();
						});
						var mapOptions = {
							center: new google.maps.LatLng(-43.43778, -70.65028),
				          	zoom: 4
				        };
				        $("#pdf_report_reg_comu").show(function(){
				        	$(".pdf_modal").show();
				        	$("#report_div_1").show();
				        	REPORTEPDF = new REPORT({
								target: "pdfreportmap_reg_comu",
								initLat: _CONFIG._MAP.LAT,
								initLng: (_CONFIG._MAP.LNG),
								initZoom: 4,
								maxZoom: _CONFIG._MAP.MAXZOOM,
								minZoom: _CONFIG._MAP.MINZOOM,
								styled:true,
								callback: function(){
									var q = {
										q1:$("#leyenda-color #q1").css("background-color"),
										q2:$("#leyenda-color #q2").css("background-color"),
										q3:$("#leyenda-color #q3").css("background-color"),
										q4:$("#leyenda-color #q4").css("background-color"),
										q5:$("#leyenda-color #q5").css("background-color")
									};
									var regiones = GEA.PUB.get_provi();
									var numcomu = Object.keys(regiones).length;
									//CARGAMOS LOS CAMPOS QUE NECESITAMOS
									$("#report_div_2").children("#panelizq").children(".cabecera").empty();
									$("<div></div>").addClass("t1_2").html("Nombre de la obra").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									$("<div></div>").addClass("t2_2").html("Monto Contratado").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									//CREAMOS LAS CAPAS ADICIONALES
									var numpag = Math.ceil(numcomu/20);
									if(numpag == 0) numpag = 1;
									$("#report_pdf_arg_global").html((numpag+1));
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_actual_info_reg").html("2");
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_total_info_reg").html((numpag+1));
									//GENERAMOS EL DESCARGA PDF
									$("#descargar_pdf").unbind().on('click', function(){
										var renders = [];
										LOADING.show("Generando archivo, Espere por favor...");
										$(".pdf_modal").hide();
										setTimeout(function(){
											PRIV.render(renders,1,(numpag+1), function(can){
												var doc = new jsPDF();
												for(i=0;i<can.length;i++)
												{
													if(i > 0) doc.addPage();
													doc.addImage(can[i], 'JPEG', 10, 15, 190, 150);
											 	}
											 	$(".gm-style>div:first>div").css({
											      	left:0,
											      	top:0,
											      	"transform":transform
											    })
											    doc.output('save', "Obra");
												LOADING.hide();
												$(".pdf_report").hide();
												for(l=1;l<numpag;l++){
													$("#report_div_"+(l+2)).remove();
												}
												var div = $("#report_div_1");
												div.remove();
												div.appendTo($("#report_pdf_arg"));
											});
										},5000);
									});
									//CARGAMOS LA LEYENDA
									$("#panelizqbot1").hide();
									$("#panelizqbot2").show();
									$("#pdf_tipo_reg").html("Nivel Provincial");
									$("#pdf_tipo_reg_resumen").html("Resumen de obras");
									$("#report_div_2").children("#panelizq").children("#pdf_r18").show();
									$("#report_div_2").children("#panelizq").children("#pdf_r19").show();
									$("#report_div_2").children("#panelizq").children("#pdf_r17").removeAttr('style');
									$("#report_div_2").children("#paneldere").children(".clasificacion").show();
									//LIMPIAMOS LOS REGISTROS
									for(i=1; i<=20; i++){
										$("#report_div_2").children("#panelizq").children("#pdf_r"+i).empty();
									}
									//CLONAMOS LAS CAPAS
									for(l=1;l<numpag;l++){
										$("#report_div_2").clone().attr('id', 'report_div_'+(l+2)).prependTo($("#report_pdf_arg"));
										$("#report_div_"+(l+2)).children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_actual_info_reg").html((l+2));
										$("#report_div_"+(l+2)).children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_total_info_reg").html((numpag+1));
									}
									//REMOVEMOS LAS CAPAS EN CLOSE
									$("#close_r_form_reg").unbind().on('click', function(){
										$(".pdf_report").hide();
										for(l=1;l<numpag;l++){
											$("#report_div_"+(l+2)).remove();
										}
										var div = $("#report_div_1");
										div.remove();
										div.appendTo($("#report_pdf_arg"));
									});
									var acumulador_regiones = 1;
									var acumulador_regresivo = 1;
									//MARCAMOS LA DELIMITACION
									$.each(GEA.PUB.get_delimitacion(), function(llave,polygon){
										REPORTEPDF.PUB.load_polyline(polygon, {
											icon: [{
										      	icon: {
												    path: 'M 0,-1 0,0.2',
												    strokeOpacity: 1,
												    strokeWeight: 3,
												    strokeColor: "#FA9747"
												},
										     	offset: '0',
										      	repeat: '13px'
										    }],
										    color: "#FFF",
										    strokeWeight: 7
										});
									});
									//CARGAMOS LOS PUNTOS
									for(key in regiones){
										var valueobra = regiones[key];
										var info = $("#report_div_"+(Math.ceil(acumulador_regiones++/20)+1)).children("#panelizq").children("#pdf_r"+acumulador_regresivo++);
										info.removeAttr('style');
										info.empty();
										$("<div></div>").addClass("t1_2").html(regiones[key].TITULO).appendTo(info);
										$("<div></div>").addClass("t2_2").html(PRIV.number_format(regiones[key].MONTO_CONTRATADO,0,",",".")).appendTo(info);
										//$("<div></div>").addClass("t3").html(regiones[key].OBRAS).appendTo(info);
										var spatial = JSON.parse(valueobra.SPATIAL_OBJECT);
										if(spatial.TYPE == "POINT"){
											REPORTEPDF.PUB.load_marker(spatial.COORDINATES[1],spatial.COORDINATES[0],{
												icon: (valueobra.SPATIAL_TOOL == "NOUBICATION")?marker_icon["SEDE"]:(valueobra.MULTIDPA == 1)?marker_icon["MULTI"]:marker_icon[valueobra.C_CLAS]
											})
										}
										else if(spatial.TYPE == "POLYLINE"){
											var coordenadas_array = [];
										    for(k=0; k<spatial.COORDINATES.length; k+=2){
										    	coordenadas_array.push(REPORTEPDF.PUB.getLatLng(spatial.COORDINATES[k+1], spatial.COORDINATES[k]));
										    }
											REPORTEPDF.PUB.load_polyline(coordenadas_array,{
												color:line_color[valueobra.C_CLAS],
												strokeOpacity: 1,
												strokeWeight: 5,
												colorChange: "#ff9c00"
											})
										}
										else if(spatial.TYPE == "MULTYGEOMETRY"){
											$.each(spatial.ELEMENTS, function(ll,val){
												if(val.TYPE == "POINT"){
													 REPORTEPDF.PUB.load_marker(val.COORDINATES[1],val.COORDINATES[0],{
														icon: (valueobra.SPATIAL_TOOL == "NOUBICATION")?marker_icon["SEDE"]:(valueobra.MULTIDPA == 1)?marker_icon["MULTI"]:marker_icon[valueobra.C_CLAS]
													});
												}
												else if(val.TYPE == "POLYLINE"){
												    coordenadas_array = [];
												    for(k=0; k<val.COORDINATES.length; k+=2){
												    	coordenadas_array.push(new google.maps.LatLng(parseFloat(val.COORDINATES[k+1]), parseFloat(val.COORDINATES[k])));
												    }
													REPORTEPDF.PUB.load_polyline(coordenadas_array,{
														color:line_color[valueobra.C_CLAS],
														strokeOpacity: 1,
														strokeWeight: 5,
														colorChange: "#ff9c00"
													});
												}
											});
										}
										if(acumulador_regresivo > 20) acumulador_regresivo = 1;
									}
									//PANELES DE DESPLAZAMIENTO
									var actual = 1;
									var total = numpag+1;
									$("#mov_dere_pdf_reg").unbind().on('click',function(){
										if(actual < total){
											$("#report_div_"+actual).prependTo($("#report_pdf_arg"));
											actual++;
										}	
									})
									$("#mov_izq_pdf_reg").unbind().on('click',function(){
										if(actual > 1){
											var act = $("#report_pdf_arg").children(".pdf_report_div_info").first();
											act.appendTo($("#report_pdf_arg"));
											actual--;
										}	
									})
									REPORTEPDF.PUB.fit_to_content();
									LOADING.hide();
									var fecha = new Date();
									$(".fecha_pdf_value").each(function(){
										$(this).html(fecha.getDate()+"-"+(fecha.getMonth()+1)+"-"+fecha.getFullYear());
									});
								}
							});
				        });
						break;
					case 5:
						LOADING.show("Generando vista previa, Espere por favor...");	
						var div = $("#report_div_1");
						div.remove();
						div.appendTo($("#report_pdf_arg"));						
						$("#visualizar_pdf").unbind().on('click', function(){
							$(".pdf_modal").hide();
						});
						var mapOptions = {
							center: new google.maps.LatLng(-43.43778, -70.65028),
				          	zoom: 4
				        };
				        $("#pdf_report_reg_comu").show(function(){
				        	$(".pdf_modal").show();
				        	$("#report_div_1").show();
				        	REPORTEPDF = new REPORT({
								target: "pdfreportmap_reg_comu",
								initLat: _CONFIG._MAP.LAT,
								initLng: (_CONFIG._MAP.LNG),
								initZoom: 4,
								maxZoom: _CONFIG._MAP.MAXZOOM,
								minZoom: _CONFIG._MAP.MINZOOM,
								styled:true,
								callback: function(){
									var q = {
										q1:$("#leyenda-color #q1").css("background-color"),
										q2:$("#leyenda-color #q2").css("background-color"),
										q3:$("#leyenda-color #q3").css("background-color"),
										q4:$("#leyenda-color #q4").css("background-color"),
										q5:$("#leyenda-color #q5").css("background-color")
									};
									var regiones = GEA.PUB.get_comu();
									var numcomu = Object.keys(regiones).length;
									//CARGAMOS LOS CAMPOS QUE NECESITAMOS
									$("#report_div_2").children("#panelizq").children(".cabecera").empty();
									$("<div></div>").addClass("t1_2").html("Nombre de la obra").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									$("<div></div>").addClass("t2_2").html("Monto Contratado").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									//CREAMOS LAS CAPAS ADICIONALES
									var numpag = Math.ceil(numcomu/20);
									if(numpag == 0) numpag = 1;
									$("#report_pdf_arg_global").html((numpag+1));
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_actual_info_reg").html("2");
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_total_info_reg").html((numpag+1));
									//GENERAMOS EL DESCARGA PDF
									$("#descargar_pdf").unbind().on('click', function(){
										var renders = [];
										LOADING.show("Generando archivo, Espere por favor...");
										$(".pdf_modal").hide();
										setTimeout(function(){
											PRIV.render(renders,1,(numpag+1), function(can){
												var doc = new jsPDF();
												for(i=0;i<can.length;i++)
												{
													if(i > 0) doc.addPage();
													doc.addImage(can[i], 'JPEG', 10, 15, 190, 150);
											 	}
											 	$(".gm-style>div:first>div").css({
											      	left:0,
											      	top:0,
											      	"transform":transform
											    })
											    doc.output('save', "Obra");
												LOADING.hide();
												$(".pdf_report").hide();
												for(l=1;l<numpag;l++){
													$("#report_div_"+(l+2)).remove();
												}
												var div = $("#report_div_1");
												div.remove();
												div.appendTo($("#report_pdf_arg"));
											});
										},5000);
										
									});
									var transform=$(".gm-style>div:first>div").css("transform")
									var comp=transform.split(",") //split up the transform matrix
									var mapleft=parseFloat(comp[4]) //get left value
									var maptop=parseFloat(comp[5])  //get top value
									$(".gm-style>div:first>div").css({ //get the map container. not sure if stable
									  "transform":"none",
									  "left":mapleft,
									  "top":maptop,
									})
									//CARGAMOS LA LEYENDA
									$("#panelizqbot1").hide();
									$("#panelizqbot2").show();
									$("#pdf_tipo_reg").html("Nivel Comunal");
									$("#pdf_tipo_reg_resumen").html("Resumen de obras");
									$("#report_div_2").children("#panelizq").children("#pdf_r18").show();
									$("#report_div_2").children("#panelizq").children("#pdf_r19").show();
									$("#report_div_2").children("#panelizq").children("#pdf_r17").removeAttr('style');
									$("#report_div_2").children("#paneldere").children(".clasificacion").show();
									//LIMPIAMOS LOS REGISTROS
									for(i=1; i<=20; i++){
										$("#report_div_2").children("#panelizq").children("#pdf_r"+i).empty();
									}
									//CLONAMOS LAS CAPAS
									for(l=1;l<numpag;l++){
										$("#report_div_2").clone().attr('id', 'report_div_'+(l+2)).prependTo($("#report_pdf_arg"));
										$("#report_div_"+(l+2)).children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_actual_info_reg").html((l+2));
										$("#report_div_"+(l+2)).children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_total_info_reg").html((numpag+1));
									}
									//REMOVEMOS LAS CAPAS EN CLOSE
									$("#close_r_form_reg").unbind().on('click', function(){
										$(".pdf_report").hide();
										for(l=1;l<numpag;l++){
											$("#report_div_"+(l+2)).remove();
										}
										var div = $("#report_div_1");
										div.remove();
										div.appendTo($("#report_pdf_arg"));
									});
									var acumulador_regiones = 1;
									var acumulador_regresivo = 1;
									//MARCAMOS LA DELIMITACION
									$.each(GEA.PUB.get_delimitacion(), function(llave,polygon){
										REPORTEPDF.PUB.load_polyline(polygon, {
											icon: [{
										      	icon: {
												    path: 'M 0,-1 0,0.2',
												    strokeOpacity: 1,
												    strokeWeight: 3,
												    strokeColor: "#FA9747"
												},
										     	offset: '0',
										      	repeat: '13px'
										    }],
										    color: "#FFF",
										    strokeWeight: 7
										});
									});
									
									//CARGAMOS LOS PUNTOS
									for(key in regiones){
										var valueobra = regiones[key];
										var info = $("#report_div_"+(Math.ceil(acumulador_regiones++/20)+1)).children("#panelizq").children("#pdf_r"+acumulador_regresivo++);
										info.removeAttr('style');
										info.empty();
										$("<div></div>").addClass("t1_2").html(regiones[key].TITULO).appendTo(info);
										$("<div></div>").addClass("t2_2").html(PRIV.number_format(regiones[key].MONTO_CONTRATADO,0,",",".")).appendTo(info);
										//$("<div></div>").addClass("t3").html(regiones[key].OBRAS).appendTo(info);
										var spatial = JSON.parse(valueobra.SPATIAL_OBJECT);
										if(spatial.TYPE == "POINT"){
											REPORTEPDF.PUB.load_marker(spatial.COORDINATES[1],spatial.COORDINATES[0],{
												icon: (valueobra.SPATIAL_TOOL == "NOUBICATION")?marker_icon["SEDE"]:(valueobra.MULTIDPA == 1)?marker_icon["MULTI"]:marker_icon[valueobra.C_CLAS]
											})
										}
										else if(spatial.TYPE == "POLYLINE"){
											var coordenadas_array = [];
										    for(k=0; k<spatial.COORDINATES.length; k+=2){
										    	coordenadas_array.push(REPORTEPDF.PUB.getLatLng(spatial.COORDINATES[k+1], spatial.COORDINATES[k]));
										    }
											REPORTEPDF.PUB.load_polyline(coordenadas_array,{
												color:line_color[valueobra.C_CLAS],
												strokeOpacity: 1,
												strokeWeight: 5,
												colorChange: "#ff9c00"
											})
										}
										else if(spatial.TYPE == "MULTYGEOMETRY"){
											$.each(spatial.ELEMENTS, function(ll,val){
												if(val.TYPE == "POINT"){
													 REPORTEPDF.PUB.load_marker(val.COORDINATES[1],val.COORDINATES[0],{
														icon: (valueobra.SPATIAL_TOOL == "NOUBICATION")?marker_icon["SEDE"]:(valueobra.MULTIDPA == 1)?marker_icon["MULTI"]:marker_icon[valueobra.C_CLAS]
													});
												}
												else if(val.TYPE == "POLYLINE"){
												    coordenadas_array = [];
												    for(k=0; k<val.COORDINATES.length; k+=2){
												    	coordenadas_array.push(new google.maps.LatLng(parseFloat(val.COORDINATES[k+1]), parseFloat(val.COORDINATES[k])));
												    }
													REPORTEPDF.PUB.load_polyline(coordenadas_array,{
														color:line_color[valueobra.C_CLAS],
														strokeOpacity: 1,
														strokeWeight: 5,
														colorChange: "#ff9c00"
													});
												}
											});
										}
										if(acumulador_regresivo > 20) acumulador_regresivo = 1;
									}
									//PANELES DE DESPLAZAMIENTO
									var actual = 1;
									var total = numpag+1;
									$("#mov_dere_pdf_reg").unbind().on('click',function(){
										if(actual < total){
											$("#report_div_"+actual).prependTo($("#report_pdf_arg"));
											actual++;
										}	
									})
									$("#mov_izq_pdf_reg").unbind().on('click',function(){
										if(actual > 1){
											var act = $("#report_pdf_arg").children(".pdf_report_div_info").first();
											act.appendTo($("#report_pdf_arg"));
											actual--;
										}	
									})
									REPORTEPDF.PUB.fit_to_content();
									LOADING.hide();
									var fecha = new Date();
									$(".fecha_pdf_value").each(function(){
										$(this).html(fecha.getDate()+"-"+(fecha.getMonth()+1)+"-"+fecha.getFullYear());
									});
								}
							});
				        });
						break;
					case 6:
						LOADING.show("Generando vista previa, Espere por favor...");	
						var div = $("#report_div_1");
						div.remove();
						div.appendTo($("#report_pdf_arg"));				
						$("#visualizar_pdf").unbind().on('click', function(){
							$(".pdf_modal").hide();
						});
						var mapOptions = {
							center: new google.maps.LatLng(-43.43778, -70.65028),
				          	zoom: 4
				        };
				        $("#pdf_report_reg_comu").show(function(){
				        	$(".pdf_modal").show();
				        	$("#report_div_1").show();
				        	REPORTEPDF = new REPORT({
								target: "pdfreportmap_reg_comu",
								initLat: _CONFIG._MAP.LAT,
								initLng: (_CONFIG._MAP.LNG),
								initZoom: 4,
								maxZoom: _CONFIG._MAP.MAXZOOM,
								minZoom: _CONFIG._MAP.MINZOOM,
								styled:true,
								callback: function(){
									var q = {
										q1:$("#leyenda-color #q1").css("background-color"),
										q2:$("#leyenda-color #q2").css("background-color"),
										q3:$("#leyenda-color #q3").css("background-color"),
										q4:$("#leyenda-color #q4").css("background-color"),
										q5:$("#leyenda-color #q5").css("background-color")
									};
									var valueobra = GEA.PUB.get_obra_actual();
									//CARGAMOS LA CAPA 2
									$("#report_pdf_arg_global").html("2");
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_actual_info_reg").html("2");
									$("#report_div_2").children("#paneldere").children(".date_pdf").children(".pagina").children("#pdf_total_info_reg").html("2");
									$("#report_div_2").children("#paneldere").children(".clasificacion").hide();
									//CARGAMOS LA LEYENDA
									$("#panelizqbot1").hide();
									$("#panelizqbot2").show();
									//CARGAMOS LOS CAMPOS QUE NECESITAMOS
									$("#report_div_2").children("#panelizq").children(".cabecera").empty();
									$("<div></div>").addClass("t3_2").html("Ficha de la obra").appendTo($("#report_div_2").children("#panelizq").children(".cabecera"));
									//CARGAMOS LEYENDA
									$("#pdf_tipo_reg").html("Nivel Obra");
									$("#pdf_tipo_reg_resumen").html("Datos de la obra");
									//REMOVEMOS LAS CAPAS EN CLOSE
									$("#close_r_form_reg").unbind().on('click', function(){
										$(".pdf_report").hide();
										for(l=1;l<numpag;l++){
											$("#report_div_"+(l+2)).remove();
										}
									});
									//LIMPIAMOS LOS REGISTROS
									for(i=1; i<=20; i++){
										$("#report_div_2").children("#panelizq").children("#pdf_r"+i).empty();
									}
									//MARCAMOS LA DELIMITACION
									$.each(GEA.PUB.get_delimitacion(), function(llave,polygon){
										REPORTEPDF.PUB.load_polyline(polygon, {
											icon: [{
										      	icon: {
												    path: 'M 0,-1 0,0.2',
												    strokeOpacity: 1,
												    strokeWeight: 3,
												    strokeColor: "#FA9747"
												},
										     	offset: '0',
										      	repeat: '13px'
										    }],
										    color: "#FFF",
										    strokeWeight: 7
										});
									});
									//GENERAMOS EL DESCARGA PDF
									$("#descargar_pdf").unbind().on('click', function(){
										var renders = [];
										LOADING.show("Generando archivo, Espere por favor...");
										$(".pdf_modal").hide();
										setTimeout(function(){
											PRIV.render(renders,1,2, function(can){
												var doc = new jsPDF();
												for(i=0;i<can.length;i++)
												{
													if(i > 0) doc.addPage();
													doc.addImage(can[i], 'JPEG', 10, 15, 190, 150);
													
											 	}
											 	$(".gm-style>div:first>div").css({
											      	left:0,
											      	top:0,
											      	"transform":transform
											    })
											    doc.output('save', "Obra");
												LOADING.hide();
												$(".pdf_report").hide();
												for(l=1;l<numpag;l++){
													$("#report_div_"+(l+2)).remove();
												}
											});
										}, 5000);
													
									});
									var transform=$(".gm-style>div:first>div").css("transform")
									var comp=transform.split(",") //split up the transform matrix
									var mapleft=parseFloat(comp[4]) //get left value
									var maptop=parseFloat(comp[5])  //get top value
									$(".gm-style>div:first>div").css({ //get the map container. not sure if stable
									  "transform":"none",
									  "left":mapleft,
									  "top":maptop,
									})
									var lista = {
										"TITULO": "NOMBRE DE LA OBRA",
										"TREGION": "REGION",
										"TPROVINCIA": "PROVINCIA",
										"TCOMUNA": "COMUNA",
										"CLASIFICACION": "CLASIFICACI&Oacute;N",
										"PLAZO_EJE": "PLAZO DE EJECUCI&Oacute;N",
										"ID_MERCADO_PUB": "CODIGO DE MERCADO PUBLICO",
										"CODIGO_BIP": "CODIGO BIP",
										"PROC_CONTRATACION": "PROCEDIMIENTO DE CONTRATACI&Oacute;N",
										"MONTO_CONTRATADO": "MONTO CONTRATADO",
										"SERV_CONTR": "SERVICIO CONTRATANTE",
										"SERV_MAND": "SERVICIO MANDANTE",
										"NOMBRE_INSP_FIS": "NOMBRE INSPECTOR FISCAL",
										"RUN_INSP_FIS": "RUN INSPECTOR FISCAL",
										"NOMBRE_EJECUTOR": "NOMBRE/RAZON SOCIAL",
										"RUT_EJECUTOR": "RUN/RUT",
										"DESCRIPCION": "DESCRIPCION DE LA OBRA"
									};
									var obra = valueobra;
									obra.NOMBRE_INSP_FIS = obra.NOMBRE_INSP_FIS+" "+obra.APELLIDO_P_INSP_FIS+" "+obra.APELLIDO_M_INSP_FIS;
									if(obra.RUT_CONTRATIS != "No Existe Registro"){
										obra.RUT_EJECUTOR = obra.RUT_CONTRATIS;
										obra.NOMBRE_EJECUTOR = obra.NOMBRE_CONTRATIS+" "+obra.APELLIDOS_CONTRATIS;
									}
									else
									{
										obra.NOMBRE_EJECUTOR = obra.NOMBRE_CONSORCIO+" "+obra.APELLIDOS_CONSORCIO;
										obra.RUT_EJECUTOR = obra.RUT_CONS;
									}
									if(obra.PROC_CONTRATACION == "PR") obra.PROC_CONTRATACION = "Propuesta privada.";
									if(obra.PROC_CONTRATACION == "PU") obra.PROC_CONTRATACION = "Propuesta p&uacute;blica.";
									if(obra.PROC_CONTRATACION == "TD") obra.PROC_CONTRATACION = "Trato directo.";
									if(obra.PROC_CONTRATACION == "UN") obra.PROC_CONTRATACION = "Precio Unitario.";
									var h=1;
									$("#report_div_2").children("#panelizq").children("#pdf_r18").hide();
									$("#report_div_2").children("#panelizq").children("#pdf_r19").hide();
									for(llave in lista){
										var info;
										if(llave == "DESCRIPCION"){
											info = $("#report_div_2").children("#panelizq").children("#pdf_r"+h++);
											info.css({
												height: "100"
											})
										}
										else if(llave == "TCOMUNA"){
											info = $("#report_div_2").children("#panelizq").children("#pdf_r"+h++);
											info.css({
												height: "70",
												"font-size": "6pt"
											})
										}
										else
										{
											info = $("#report_div_2").children("#panelizq").children("#pdf_r"+h++);
											info.attr('style','');
										}
										info.empty();
										$("<div></div>").addClass("t2_2").html(lista[llave]).appendTo(info);
										$("<div></div>").addClass("t1_2").html(obra[llave]).appendTo(info);
									}
									var spatial = JSON.parse(valueobra.SPATIAL_OBJECT);
									if(spatial.TYPE == "POINT"){
										REPORTEPDF.PUB.load_marker(spatial.COORDINATES[1],spatial.COORDINATES[0],{
											icon: (valueobra.SPATIAL_TOOL == "NOUBICATION")?marker_icon["SEDE"]:(valueobra.MULTIDPA == 1)?marker_icon["MULTI"]:marker_icon[valueobra.C_CLAS]
										})
									}
									else if(spatial.TYPE == "POLYLINE"){
										var coordenadas_array = [];
									    for(k=0; k<spatial.COORDINATES.length; k+=2){
									    	coordenadas_array.push(REPORTEPDF.PUB.getLatLng(spatial.COORDINATES[k+1], spatial.COORDINATES[k]));
									    }
										REPORTEPDF.PUB.load_polyline(coordenadas_array,{
											color:line_color[valueobra.C_CLAS],
											strokeOpacity: 1,
											strokeWeight: 5,
											colorChange: "#ff9c00"
										})
									}
									else if(spatial.TYPE == "MULTYGEOMETRY"){
										$.each(spatial.ELEMENTS, function(ll,val){
											if(val.TYPE == "POINT"){
												 REPORTEPDF.PUB.load_marker(val.COORDINATES[1],val.COORDINATES[0],{
													icon: (valueobra.SPATIAL_TOOL == "NOUBICATION")?marker_icon["SEDE"]:(valueobra.MULTIDPA == 1)?marker_icon["MULTI"]:marker_icon[valueobra.C_CLAS]
												});
											}
											else if(val.TYPE == "POLYLINE"){
											    coordenadas_array = [];
											    for(k=0; k<val.COORDINATES.length; k+=2){
											    	coordenadas_array.push(new google.maps.LatLng(parseFloat(val.COORDINATES[k+1]), parseFloat(val.COORDINATES[k])));
											    }
												REPORTEPDF.PUB.load_polyline(coordenadas_array,{
													color:line_color[valueobra.C_CLAS],
													strokeOpacity: 1,
													strokeWeight: 5,
													colorChange: "#ff9c00"
												});
											}
										});
									}
									//PANELES DE DESPLAZAMIENTO
									var actual = 1;
									var total = 2;
									$("#mov_dere_pdf_reg").unbind().on('click',function(){
										if(actual < total){
											$("#report_div_"+actual).prependTo($("#report_pdf_arg"));
											actual++;
										}	
									})
									$("#mov_izq_pdf_reg").unbind().on('click',function(){
										if(actual > 1){
											var act = $("#report_pdf_arg").children(".pdf_report_div_info").first();
											act.appendTo($("#report_pdf_arg"));
											actual--;
										}	
									})
									REPORTEPDF.PUB.fit_to_content();
									LOADING.hide();
									var fecha = new Date();
									$(".fecha_pdf_value").html(fecha.getDate()+"-"+(fecha.getMonth()+1)+"-"+fecha.getFullYear());
								}
							});
				        });
						break;
				}
				
			}
		}
		_CONSTRUCT(args);
	};
	XLSD = new XLS();
})()