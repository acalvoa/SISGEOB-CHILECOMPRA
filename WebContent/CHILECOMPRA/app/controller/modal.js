GEOCGRAPP	
	.controller('modal1', function(){
		this.why = function(e){
			$(".tabitem").removeClass("active").addClass("inactive");
			$(e.currentTarget).addClass("active").removeClass("inactive");
			$(".modal-ini-content").hide();
			$(".whygeocgr").show();	
		};
		this.ayuda = function(e){
			$(".tabitem").removeClass("active").addClass("inactive");
			$(e.currentTarget).addClass("active").removeClass("inactive");
			$(".modal-ini-content").hide();
			$(".ayuda").show();
		};
		this.contacto = function(e){
			$(".tabitem").removeClass("active").addClass("inactive");
			$(e.currentTarget).addClass("active").removeClass("inactive");
			$(".modal-ini-content").hide();
			$(".contacto").show();
		};
		this.remember = function(e){
			if( $(e.currentTarget).attr("data-cookie") == 0 ){
				$.cookie("modal-ini", 1);
				$(e.currentTarget).attr("data-cookie", 1);
			} else {
				$.cookie("modal-ini", 0);
				$(e.currentTarget).attr("data-cookie", 0);
			}
		}
		this.close = function(e){
			$("#modal1").fadeOut(1000);
		};
		this.tab = function(e){
			$(".tabcontent").children(".content").hide();
			$(".tab"+$(e.currentTarget).attr("data-tab")).children(".content").show();
		}
		this.tcontent = function(e){
			$(".tabcontent").children(".content").hide();
			$(e.currentTarget).parent().children(".content").show();
		}
	})
	.controller('modal2', function(){
		this.close = function(e){
			$("#modal2").fadeOut(1000);
		}
		this.mercadopublico = function(){
			window.location = 'http://www.mercadopublico.cl/Procurement/CerrarGeoCGR.htm';
			// window.location = 'http://testqa.mercadopublico.cl/Procurement/CerrarGeoCGR.htm';
		}
	})
	.controller('modal3', function(){
		this.close = function(e){
			$("#modal3").fadeOut(1000);
		}
		this.close4 = function(e){
			$("#modal4").fadeOut(1000);
		}
		this.close5 = function(e){
			window.location = 'http://www.mercadopublico.cl/Procurement/CerrarGeoCGR.htm';
			// window.location = 'http://testqa.mercadopublico.cl/Procurement/CerrarGeoCGR.htm';
		}
	})
	.controller('modalServicios', function(){
		this.read = function(e){
			var codigo_wfs = $("#SERVICIO_ID_CODIGO").val();
			$("#modal_SERVICIOS").fadeOut();
			GEOCGRCHI.PUB.load_data(function(){
				LOADING.message("Cargado Datos del servicio WFS, Espere por favor...");
				LOADING.show();
				SOCKET.request({
					request: "wfs/request", 
					data:{
						SERVICE: _CONFIG._SERVICIO.WFS,
						ID: $("#SERVICIO_ID_CODIGO").val()
					},
					callback:function(response){
						if((response.STATUS == 0) || response.DATA.SPATIAL.length == 0){
							var prompt = new PROMPT({
								texto: "El WFS indicado no existe o no posee campos legibles. Verifique e intentolo nuevamente.",
								first: function(e){
									$("#SERVICIO_ID_CODIGO").val('');
									$("#modal_SERVICIOS").show();
									e.PUB.destroy();
								},
								second: function(e){
									$("#SERVICIO_ID_CODIGO").val('');
									$("#modal_SERVICIOS").show();
									e.PUB.destroy();
								},
							});
							prompt.PUB.set_first('<i class="fa fa-check"></i> Aceptar');
							prompt.PUB.set_second('<i class="fa fa-times"></i> Cancelar');
							prompt.PUB.show();
						}
						else
						{
							GEOCGRCHI.PUB.get_form_element().PUB.add_entidad(_CONFIG._SERVICIO.NOMBRE, _CONFIG._SERVICIO.SERVICIO,codigo_wfs);
							//INTEGRAMOS LOS ELEMENTOS SPATIAL
							$.SYNC.NEW("DRAW");
							if($.SYNC.SYNC(3,"DRAW")){
								$("#uploadBtn").attr("disabled","disabled");
								$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn").css("background", "#CCC");
								$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#CCC");
								GEOCGRCHI.PUB.set_control_spatial(true);
								var spatial = response.DATA.SPATIAL;
								var datos = response.DATA.DATA;
								for(j=0;j<spatial.length;j++){
									var element = spatial[j];
									if(element.TYPE == "POINT"){
										var elemento = GEOCGRCHI.PUB.get_spatial_element();
										var marker = new google.maps.Marker({
											position: MAPA.PUB.getLatLng(element.LAT, element.LNG),
											map: MAPA.PUB.getMap(),
											draggable: false
										});
										elemento.PUB.set_point(marker);
									}
									else if(element.TYPE == "LINESTRING"){
										var polyline = new google.maps.Polyline({
											path: new google.maps.MVCArray(),
											map: MAPA.PUB.getMap(),
											strokeColor: '#ff0000',
											strokeWeight: 4,
											strokeOpacity: 0.5,
											clickable: true,
										});
										for(k=0;k<element.SPATIAL.length;k++){
											polyline.getPath().push(MAPA.PUB.getLatLng(element.SPATIAL[k].LAT,element.SPATIAL[k].LNG));
										}
										var elemento = GEOCGRCHI.PUB.get_spatial_element();
										elemento.PUB.set_line(polyline);
									}
								}
								// INTEGRAMOS LOS DATOS
								// FECHA INICIO
								if(typeof datos.FECHA_INI != "undefined"){
									var scope = angular.element($("#picker-inicio")).scope();
									scope.$apply(function(){
										var f_part = datos.FECHA_INI.split("/");
										var fecha = new Date(f_part[1]+"/"+f_part[0]+"/"+f_part[2]);
										if(!isNaN( fecha.getTime() )) scope.initdate = fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear();
								    });
								    if(scope["formlinea"].initdate.$valid) $("#inicio-estimado").unbind('click').css({
								    	background: "#CCC"
								    });
								}
								// FECHA DE TERMINO
								if(typeof datos.FECHA_FIN != "undefined"){
									var scope = angular.element($("#picker-termino")).scope();
									scope.$apply(function(){
										var f_part = datos.FECHA_FIN.split("/");
										var fecha = new Date(f_part[1]+"/"+f_part[0]+"/"+f_part[2]);
										if(!isNaN( fecha.getTime())) scope.finishdate = fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear();
								    });
								    if(scope["formlinea"].finishdate.$valid) $("#termino-estimado").unbind('click').css({
								    	background: "#CCC"
								    });
								}
								// COMUNA
								if(typeof datos.COMUNA != "undefined"){
									for(key in datos.COMUNA){
										GEOCGRCHI.PUB.get_form_element().PUB.add_comuna(datos.COMUNA[key].NOMBRE, JSON.parse(datos.COMUNA[key].CENTROIDE), datos.COMUNA[key].NUMERO, true);
										var scope = angular.element($("#selector-comuna")).scope();
										scope.$apply(function(){
											scope["formlinea"].comunas.$setValidity("cccomuna", true);
											$("#selector-comuna").parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
										});
									}
								    if(scope["formlinea"].comunas.$valid) $("#add_comuna_button").unbind('click').css({
								    	background: "#CCC"
								    });
								}
								// FECHA DE TERMINO
								if(typeof datos.MODALIDAD != "undefined"){
									var scope = angular.element($(".modalidad").children("select")).scope();
									scope.$apply(function(){
								        scope.modalidad = datos.MODALIDAD.toString();
								    });
								    if(scope["formlinea"].modalidad.$valid) $(".modalidad").children("select").attr("disabled", "disabled");
								    $(".modalidad").children("select").val(datos.MODALIDAD);
								    $(".modalidad").addClass("mark");
								    $(".modalidad").css({
								    	padding: "0 0 0 0"
								    });
								}
								// FINANCIAMIENTO
								if(typeof datos.FINANCIAMIENTO != "undefined"){
									var scope = angular.element($(".financiamiento").children("select")).scope();
									scope.$apply(function(){
								        scope.financiamiento = datos.FINANCIAMIENTO.toString();
								    });
								    if(scope["formlinea"].financiamiento.$valid) $(".financiamiento").children("select").attr("disabled", "disabled");
								    $(".financiamiento").children("select").val(datos.FINANCIAMIENTO);
								    $(".financiamiento").addClass("mark");
								    $(".financiamiento").css({
								    	padding: "0 0 0 0"
								    });
								}
								// NOMBRE CORTO
								if(typeof datos.SHORTNAME != "undefined"){
									var scope = angular.element($("#shortName")).scope();
									scope.$apply(function(){
								        scope.shortname = datos.SHORTNAME.toString();
								    });
								    if(scope["formlinea"].shortname.$valid) $("#shortName").attr("disabled", "disabled").css({
								    	background: "#FFF",
								    	border: "1px #CCC solid"
								    });
								}
								// SEGUN TIPO DE LICITACION
								switch (GEOCGRCHI.PUB.get_tipo())
								{
									case "L1": case "LE": case "LP": case "LS":case "LQ":case "LR":
										break;
									case "A1": case "B1": case "E1": case "F1": case "J1": case "CO": case "B2": case "E2": case "H2": case "I2":
										// CAUSA LICITACION PRIVADA
										if(typeof datos.CAUSA_LICITACION != "undefined"){
											var scope = angular.element($("#selecLicPrivada")).scope();
											scope.$apply(function(){
										        scope.selecLicPrivada = datos.CAUSA_LICITACION.toString();
										    });
										    $("#selecLicPrivada").val(datos.CAUSA_LICITACION);
										    if(scope["formlinea"].selecLicPrivada.$valid) $("#selecLicPrivada").attr("disabled", "disabled"); 
										    $("#selecLicPrivada").parent().addClass("mark").css({
										    	padding: "0 0 0 0"
										    });
										}
										// CAUSA NORMA
										if(typeof datos.NORMA != "undefined"){
											var scope = angular.element($("#normaproc")).scope();
											scope.$apply(function(){
										        scope.normaproc = datos.NORMA.toString();
										    });
										    if(scope["formlinea"].normaproc.$valid) $("#normaproc").attr("disabled", "disabled");
										    $("#normaproc").css({
										    	background: "#FFF",
										    	border: "1px #CCC solid"
										    });
										}
										break;
									case "A2": case "D1": case "C2": case "F2":
										// CAUSA TRATO DIRECTO
										if(typeof datos.CAUSA_LICITACION != "undefined"){
											var scope = angular.element($("#selecTratoDir")).scope();
											scope.$apply(function(){
										        scope.selecLicPrivada = datos.CAUSA_LICITACION.toString();
										    });
										    $("#selecTratoDir").val(datos.CAUSA_LICITACION);
										    if(scope["formlinea"].selecTratoDir.$valid) $("#selecTratoDir").attr("disabled", "disabled");
										    $("#selecTratoDir").parent().addClass("mark").css({
										    	padding: "0 0 0 0"
										    });
										}
										// CAUSA NORMA
										if(typeof datos.NORMA != "undefined"){
											var scope = angular.element($("#normaproc")).scope();
											scope.$apply(function(){
										        scope.normaproc = datos.NORMA.toString();
										    });
										    if(scope["formlinea"].normaproc.$valid) $("#normaproc").attr("disabled", "disabled");
										    $("#normaproc").css({
										    	background: "#FFF",
										    	border: "1px #CCC solid"
										    });
										}
										break;	
								}
								// CODIGO BIP
								if(typeof datos.CODIGO_BIP != "undefined" && typeof datos.DV_BIP != "undefined"){
									var scope = angular.element($(".bip").children("input")).scope();
									scope.$apply(function(){
								        scope.codigobip = datos.CODIGO_BIP.toString();
								    });
								    var scope = angular.element($(".dbip").children("input")).scope();
									scope.$apply(function(){
								        scope.vcodigobip = datos.DV_BIP.toString();
								    });
								    if(scope["formlinea"].codigobip.$valid) $(".bip").children("input").attr("disabled", "disabled").css({
								    	background: "#FFF",
								    	border: "1px #CCC solid"
								    });
								    if(scope["formlinea"].vcodigobip.$valid) $(".dbip").children("input").attr("disabled", "disabled").css({
								    	background: "#FFF",
								    	border: "1px #CCC solid"
								    });
								}
								//CODIGO INI
								if(typeof datos.CODIGO_INI != "undefined"){
									var scope = angular.element($(".ini").children("input")).scope();
									scope.$apply(function(){
								        scope.codigoini = datos.CODIGO_INI.toString();
								    });
								    if(scope["formlinea"].codigoini.$valid) $(".ini").children("input").attr("disabled", "disabled").css({
								    	background: "#FFF",
								    	border: "1px #CCC solid"
								    });
								}
								//CLASIFICACION
								if(typeof datos.CLASIFICACION != "undefined"){
									var scope = angular.element($(".clasificacion").children("select")).scope();
									scope.$apply(function(){
								        scope.clasificacion = datos.CLASIFICACION.toString();
								    });
								    if(scope["formlinea"].clasificacion.$valid) $(".clasificacion").children("select").attr("disabled", "disabled");
								    $(".clasificacion").children("select").val(datos.CLASIFICACION);
								    $(".clasificacion").addClass("mark");
								    $(".clasificacion").css({
								    	padding: "0 0 0 0"
								    });
								    SOCKET.request({
										request: "formulario/FSubclasificacion",
										data:{
											CLASIFICACION:datos.CLASIFICACION.toString()
										},
										callback: function(response){
											$(".subclasificacion").children('select').empty();
											$(".subclasificacion").children('select').append(new Option("Seleccione la Subclasifición de la obra.", -1, true, true));
											for(i=0;i<response.length; i++){
												var data = response[i];
												$(".subclasificacion").children('select').append(new Option(data.T_SUBCLASIFICACION, data.X_SUBC, true, true));
											}
											// SUBCLASIFIACION  DE LA OBRA
											if(typeof datos.SUBCLASIFICACION != "undefined"){
												var scope = angular.element($(".subclasificacion").children('select')).scope();
												scope.$apply(function(){
											        scope.subclasificacion = datos.SUBCLASIFICACION.toString();
											    });
											    if(scope["formlinea"].selectSubClasificacion.$valid) $(".subclasificacion").children("select").attr("disabled", "disabled");
											    $(".subclasificacion").children("select").val(datos.SUBCLASIFICACION);
											    $(".subclasificacion").addClass("mark");
											    $(".subclasificacion").css({
											    	padding: "0 0 0 0"
											    });
											}
										}
									});
								}
							}
						}
						LOADING.hide();
					}
				});
			});
		}
	})