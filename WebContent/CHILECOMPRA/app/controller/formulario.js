(function(){
	FORMULARIOS = function(fila, value, code, spatial,tipo){
		var self = this;
		//SETTINGS
		var settings = {
			fila: null,
			code: null,
			data: null,
			spatial: null,
			status: false,
			codigo: 1,
			tipo: null,
			subclasificacion_atc: [],
			subclasificacion: []
		};
		var formulario = {
			tipo: -1,
			fundamento:"",
			licPrivada:-2,
			tratoDirec:-2,
			mandante:"",
			financiamiento: "-1",
		    contratante:"",
		    shortName:"",
			modalidad: "-1",
			codigobip: "",
			vcodigobip: "",
			codigoini: "",
			clasificacion: -1,
			subclasificacion: -1,
			comuna: [],
			inidate: "",
			finishdate: "",
			linea: null,
			monto_adjudicacion: "",
			fecha_adjudicacion: "",
			spatial_tool: 1,
			entidad: "",
			id_entidad: -1,
			codigo_entidad: ""
		};
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(fila, value, code, spatial, tipo){
			settings.fila = fila;
			settings.code = code;
			switch(tipo)
			{
				case "L1": case "LE": case "LP": case "LS": case "LQ" : case "LR":
					settings.tipo = "LP";
					break;
				case "A1": case "B1": case "E1": case "F1": case "J1": case "CO": case "B2": case "E2": case "H2": case "I2":
					settings.tipo = "LPV";
					break;
				case "A2": case "D1": case "C2": case "F2":
					settings.tipo = "TD";
					break;	
			}
			formulario.linea = code;
			settings.spatial = spatial;
		};
		// METODOS PRIVADOS
		PRIV = {
			tipo_form: function(){
				switch (settings.tipo)
				{
					case "LP":
						$("#selecLicPrivada").hide();
						$("#selecTratoDir").hide();
						$("#tituloid2").hide();
						$("#normaproc").parent().hide();
						$(".obra-publica-tipo").show();
						//$("#nametipolicitacion").html("Licitaci&oacute;n P&uacute;blica");
						//VALIDACIONES
						var scope = angular.element($("#selecTratoDir")).scope();
						scope.$apply(function(){
							scope["formlinea"].selecLicPrivada.$setValidity("ccselect", true);
							scope["formlinea"].selecTratoDir.$setValidity("ccselect", true);
							scope["formlinea"].normaproc.$setValidity("cctextbox", true);
						});
						break;
					case "LPV":
						$("#selecLicPrivada").show();
						$("#selecTratoDir").hide();
						$("#normaproc").parent().show();
						$(".obra-publica-tipo").hide();
						//VALIDACIONES
						var scope = angular.element($("#selecTratoDir")).scope();
						scope.$apply(function(){
							scope["formlinea"].selecLicPrivada.$setValidity("ccselect", false);
							scope["formlinea"].selecTratoDir.$setValidity("ccselect", true);
							scope["formlinea"].normaproc.$setValidity("cctextbox", false);
						});
						break;
					case "TD":
						$("#selecLicPrivada").hide();
						$("#selecTratoDir").show();
						$("#normaproc").parent().show();
						$(".obra-publica-tipo").hide();
						//$("#nametipolicitacion").html("Trato Directo");
						//VALIDACIONES
						var scope = angular.element($("#selecTratoDir")).scope();
						scope.$apply(function(){
							scope["formlinea"].selecLicPrivada.$setValidity("ccselect", true);
							scope["formlinea"].selecTratoDir.$setValidity("ccselect", false);
							scope["formlinea"].normaproc.$setValidity("cctextbox", false);
						});
						break;	
				}
			},
			number_format: function(number, decimals, dec_point, thousands_sep) {
			  number = number.replace(/\./g,"");
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
			}
		}
		// METODOS PUBLICOS
		this.PUB = {
			add_entidad: function(entidad, id, codigo){
				formulario.entidad = entidad;
				formulario.id_entidad = id;
				formulario.codigo_entidad = codigo;
			},
			load_state: function(value){
				formulario.clasificacion = value.CLASIFICATION;
				formulario.subclasificacion = value.SUBCLASIFICATION;
				formulario.shortName = value.SHORTNAME;
				formulario.modalidad = value.MODCONTRA;
				formulario.financiamiento = value.TFOUNDING;
				formulario.entidad = (typeof value.ENTIDAD != "undefined")? value.ENTIDAD: "";
				formulario.codigo_entidad = (typeof value.CODIGO_ENTIDAD != "undefined")? value.CODIGO_ENTIDAD: "";
				formulario.id_entidad = (typeof value.ID_ENTIDAD != "undefined")? value.ID_ENTIDAD: -1;
				formulario.mandante = (value.SERVMANDANTE.NUMERO != "NOTMATCH")?value.SERVMANDANTE.SERVICIO:"";
				formulario.contratante = (value.SERVCONTRATANTE.NUMERO != "NOTMATCH")?value.SERVCONTRATANTE.SERVICIO:"";
				var _INITDATE = new Date(value.INITDATE);
				var _FINISHDATE = new Date(value.FINISHDATE);
				formulario.inidate = _INITDATE.getDate()+"/"+(_INITDATE.getMonth()+1)+"/"+_INITDATE.getFullYear();
				formulario.finishdate = _FINISHDATE.getDate()+"/"+(_FINISHDATE.getMonth()+1)+"/"+_FINISHDATE.getFullYear();
				for(i=0;i<value.COMUNAS.length;i++){
					var spa = {
						name: value.COMUNAS[i].NOMBRE,
						spatial: null,
						lat: null,
						lng: null,
						codigo: value.COMUNAS[i].CODIGO
					};
					formulario.comuna.push(spa);
				}
				formulario.tipo = "1"; //OBRA PUBLICA
				formulario.procedimiento = "1";
				formulario.fundamento = (typeof value.NORMA == "undefined")?" ":value.NORMA;
				var _FECHAADJU = new Date(value.FECHAMONTOADJU);
				formulario.monto_adjudicacion = (typeof value.MONTOADJUCLP == "undefined" || value.MONTOADJUCLP == "-1")?"NOTREQ":value.MONTOADJUCLP.toString();
				formulario.fecha_adjudicacion = (typeof value.MONTOADJUCLP == "undefined" || value.MONTOADJUCLP == "-1")?"NOTREQ":_FECHAADJU.getDate()+"/"+(_FECHAADJU.getMonth()+1)+"/"+_FECHAADJU.getFullYear();;
				formulario.codigobip = (typeof value.CODBIP != "undefined")?value.CODBIP.substring(0,value.CODBIP.indexOf("-")):"";
				formulario.vcodigobip = (typeof value.CODBIP != "undefined")?value.CODBIP.substring((value.CODBIP.indexOf("-")+1),value.CODBIP.length):"";
				formulario.codigoini = (typeof value.CODINI != "undefined")?value.CODINI:"";
				if(settings.tipo == "LPV"){
					formulario.licPrivada = (typeof value.CAUSEORDER == "undefined")?"-1":value.CAUSEORDER;
					formulario.tratoDirec = "-1";
				}
				else if(settings.tipo == "TD"){
					formulario.tratoDirec= (typeof value.CAUSEORDER == "undefined")?"-1":value.CAUSEORDER;
					formulario.licPrivada= "-1";
				}
				fila.children(".form").removeClass("rojo").addClass("verde");
				settings.status = true;
				$("#saveform").addClass("verde");	
			},
			get_code: function(){
				return settings.code;
			},
			get_info:function(){
		        return formulario;
			},
			print: function(){
				if(settings.subclasificacion != []){
					settings.subclasificacion_act = settings.subclasificacion;
				}
				//ESTA FUNCION
				$(".modalidad").children("select").val(-1);
				$("#selecTratoDir").val(-1);
				$("#selecLicPrivada").val(-1);
				$(".financiamiento").children("select").val(-1);
				$(".clasificacion").children("select").val(-1);
				$(".subclasificacion").children("select").val(-1);
				// SETEAMSO LA SUBCLASIFICACIOND E LA OBRA EN PROGRESO
				$(".subclasificacion").children('select').append(new Option("Seleccione la Subclasifición de la obra.", -1, true, true));
				for(i=0;i<settings.subclasificacion.length; i++){
					var data = settings.subclasificacion[i];
					$(".subclasificacion").children('select').append(new Option(data.T_SUBCLASIFICACION, data.X_SUBC, true, true));
				}
				$(".subclasificacion").children("select").val(-1);
				// 	LIMPIAMOS
				//ASIGNAMOS LA IMPRESION DE LA MODALIDAD EN CONTRATATION EN CASO DE EXISTIR 
				if($.GEO.EVENTS.IS_READY('MODCONTRA_LOAD')){
					var scope = angular.element($(".modalidad").children("select")).scope();
					scope.$apply(function(){
				        scope.modalidad = formulario.modalidad.toString();
				    });
				    $(".modalidad").children("select").val(formulario.modalidad.toString());
				}
				else
				{
					$.GEO.EVENTS.ON('MODCONTRA_LOAD', function(formulario){
						var scope = angular.element($(".modalidad").children("select")).scope();
						scope.$apply(function(){
					        scope.modalidad = formulario.modalidad.toString();
					    });
					    setTimeout(function(){
					    	$(".modalidad").children("select").val(formulario.modalidad.toString());
					    },500);
					}, formulario);
				}
			    if(formulario.fundamento != "" && formulario.fundamento != " "){
			    	var scope = angular.element($(".normaproc").children("input")).scope();
					scope.$apply(function(){
				        scope.normaproc = formulario.fundamento;
				    });
				    $(".normaproc").children("input").val(formulario.fundamento);
			    }
			    if(formulario.licPrivada != -2){
			    	if($.GEO.EVENTS.IS_READY('LICPRIVADA_LOAD')){
				    	var scope = angular.element($("#selecLicPrivada")).scope();
						scope.$apply(function(){
					        scope.selecLicPrivada = formulario.licPrivada.toString();
					    });
					    $("#selecLicPrivada").val(formulario.licPrivada);
					}
					else{
						$.GEO.EVENTS.ON('LICPRIVADA_LOAD', function(formulario){
							var scope = angular.element($("#selecLicPrivada")).scope();
							scope.$apply(function(){
						        scope.selecLicPrivada = formulario.licPrivada.toString();
						    });
						    setTimeout(function(){
						    	$("#selecLicPrivada").val(formulario.licPrivada);
						    },500);
						}, formulario);
					}
			    }
			    if(formulario.tratoDirec != -2){
			    	if($.GEO.EVENTS.IS_READY('TRATODIRECTO_LOAD')){
				    	var scope = angular.element($("#selecTratoDir")).scope();
						scope.$apply(function(){
					        scope.selecTratoDir = formulario.tratoDirec.toString();
					    });
					    $("#selecTratoDir").val(formulario.tratoDirec);
					}
					else{
						$.GEO.EVENTS.ON('TRATODIRECTO_LOAD', function(formulario){
							var scope = angular.element($("#selecTratoDir")).scope();
							scope.$apply(function(){
						        scope.selecTratoDir = formulario.tratoDirec.toString();
						    });
						    setTimeout(function(){
						    	$("#selecTratoDir").val(formulario.tratoDirec);
						    },500);
						}, formulario);
					}
			    }
			    if($.GEO.EVENTS.IS_READY('TFOUNDING_LOAD')){
			    	var scope = angular.element($(".financiamiento").children("select")).scope();
					scope.$apply(function(){
				        scope.financiamiento = formulario.financiamiento.toString();
				    });
				    $(".financiamiento").children("select").val(formulario.financiamiento);
			    }
			    else{
			    	$.GEO.EVENTS.ON('TFOUNDING_LOAD', function(formulario){
						var scope = angular.element($(".financiamiento").children("select")).scope();
						scope.$apply(function(){
					        scope.financiamiento = formulario.financiamiento.toString();
					    });
					    setTimeout(function(){
					    	$(".financiamiento").children("select").val(formulario.financiamiento.toString());
					    },500);
					}, formulario);
			    }
				var scope = angular.element($(".financiamiento").children("select")).scope();
				scope.$apply(function(){
			        scope.financiamiento = formulario.financiamiento.toString();
			    });
			    $(".financiamiento").children("select").val(formulario.financiamiento);
				
			    if(formulario.monto_adjudicacion != "" && formulario.monto_adjudicacion != "NOTREQ"){
			    	var scope = angular.element($("#montoAdjudicado")).scope();
			    	scope.$apply(function(){
				        scope.ccmontoAdjudicado = formulario.monto_adjudicacion;
				    });
			    	$("#montoAdjudicado").val(PRIV.number_format(formulario.monto_adjudicacion,0,"","."));	
			    }

			    if(formulario.fecha_adjudicacion != "" && formulario.fecha_adjudicacion != "NOTREQ"){
			    	var scope = angular.element($("#fechaMontoAdjudicado")).scope();
			    	scope.$apply(function(){
				        scope.ccfechaMontoAdjudicado = formulario.fecha_adjudicacion;
				    });
			    	$("#fechaMontoAdjudicado").val(formulario.fecha_adjudicacion);	
			    }

				var scope = angular.element($(".codigobip").children("input")).scope();
				scope.$apply(function(){
			        scope.codigobip = formulario.codigobip;
			    });
			    $(".codigobip").val(formulario.codigobip);
				
				var scope = angular.element($(".vcodigobip").children("input")).scope();
				scope.$apply(function(){
			        scope.vcodigobip = formulario.vcodigobip;
			    });
			    $(".vcodigobip").val(formulario.vcodigobip);
				
				var scope = angular.element($(".codigoini").children("input")).scope();
				scope.$apply(function(){
			        scope.codigoini = formulario.codigoini;
			    });
			    $(".codigoini").val(formulario.codigoini);
				
				//VERIFICAMOS LA CLASIFICACION
				if($.GEO.EVENTS.IS_READY('CLASIFICATION_LOAD')){
					$(".clasificacion").children('select').val(formulario.clasificacion);
					$(".clasificacion").children('select').trigger("change");
					var scope = angular.element($(".clasificacion").children("select")).scope();
					scope.$apply(function(){
				        scope.clasificacion = formulario.clasificacion.toString();
				    });
				    var scope2 = angular.element($(".subclasificacion").children("select")).scope();
					scope2.$apply(function(){
				        scope2.subclasificacion = formulario.subclasificacion.toString();
				    });
			     	SOCKET.request({
						request: "formulario/FSubclasificacion",
						data:{
							CLASIFICACION:formulario.clasificacion.toString()
						},
						callback: function(response){
							self.PUB.set_subclasificacion(response);
							$(".subclasificacion").children('select').empty();
							$(".subclasificacion").children('select').append(new Option("Seleccione la Subclasifición de la obra.", -1, true, true));
							for(i=0;i<response.length; i++){
								var data = response[i];
								$(".subclasificacion").children('select').append(new Option(data.T_SUBCLASIFICACION, data.X_SUBC, true, true));
							}
							$(".subclasificacion").children('select').val(formulario.subclasificacion.toString());
						}
					});
				}
				else
				{
					$.GEO.EVENTS.ON('CLASIFICATION_LOAD', function(formulario){
						var scope = angular.element($(".clasificacion").children("select")).scope();
						scope.$apply(function(){
					        scope.clasificacion = formulario.clasificacion.toString();
					    });
					        var scope2 = angular.element($(".subclasificacion").children("select")).scope();
							scope2.$apply(function(){
						        scope2.subclasificacion = formulario.subclasificacion.toString();
						    });
					    SOCKET.request({
							request: "formulario/FSubclasificacion",
							data:{
								CLASIFICACION:formulario.clasificacion.toString()
							},
							callback: function(response){
								self.PUB.set_subclasificacion(response);
								$(".subclasificacion").children('select').empty();
								$(".subclasificacion").children('select').append(new Option("Seleccione la Subclasifición de la obra.", -1, true, true));
								for(i=0;i<response.length; i++){
									var data = response[i];
									$(".subclasificacion").children('select').append(new Option(data.T_SUBCLASIFICACION, data.X_SUBC, true, true));
									settings.subclasificacion_act;
								}
								 setTimeout(function(){
							    	$(".subclasificacion").children('select').val(formulario.subclasificacion.toString());
									$(".clasificacion").children('select').val(formulario.clasificacion.toString()); 
							    },500);
							}
						});
					}, formulario);
				}
				
				var scope = angular.element($(".shortName").children("input")).scope();
				scope.$apply(function(){
			        scope.shortname = formulario.shortName;
			    });
			    $(".shortName").children("input").val(formulario.shortName);
				$(".comuna-listado-text").empty();

				var scope = angular.element($("#servtxtinputs")).scope();
				scope.$apply(function(){
			        scope.servmandante = formulario.mandante;
			    });
			    $("#servtxtinputs").val(formulario.mandante);
				
				var scope = angular.element($("#servtxtinput")).scope();
				scope.$apply(function(){
			        scope.servcontratante = formulario.contratante;
			    });
			    $("#servtxtinput").val(formulario.contratante);
				$.each(formulario.comuna, function(key,value){
					$("<span></span>").html(value.name).appendTo($(".comuna-listado-text"))
					.on('click', function(){
						if(!_CONFIG._CUSTOM.BLOCK){
							$(this).remove();
							if(value.spatial != null){
								var code = GEOCGRCHI.PUB.get_form_element.PUB.get_code();
								var spatial = GEOCGRCHI.PUB.get_spatial_num(code);
								spatial.remove_point(value.spatial)
							}
							formulario.comuna.splice(key,1);
						}
					});
				});
				if(typeof formulario.comuna != "undefined" && formulario.comuna.length > 0){
					var scope = angular.element($("#selector-comuna")).scope();
					scope.$apply(function(){
						scope["formlinea"].comunas.$setValidity("cccomuna", true);
						$("#selector-comuna").parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
					});
				}
				else{
					scope["formlinea"].comunas.$setValidity("cccomuna", false);
					$("#selector-comuna").parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
				}
				
				var scope = angular.element($("#picker-inicio")).scope();
				scope.$apply(function(){
			        scope.initdate = formulario.inidate;
			    });
			    $("#picker-inicio").val(formulario.inidate);
				
				var scope = angular.element($("#picker-termino")).scope();
				scope.$apply(function(){
			        scope.finishdate = formulario.finishdate;
			    });
			    $("#picker-termino").val(formulario.finishdate);
				
				if(settings.status){
					$("#saveform").addClass("verde");
				}
				else
				{
					$("#saveform").removeClass("verde");
				}
				$("option[value='? string:-1 ?']").remove();
				//SETEAMOS LAS CONDICIONES DEL FORMULARIO
				PRIV.tipo_form();
			},
			add_comuna: function(name, centroid, numero, hold){
				var ubication = GEOCGRCHI.PUB.get_ubication();
				var spatial = GEOCGRCHI.PUB.get_spatial_num(settings.code);
				var spa;
				var add = true;
				for(i=0; i<formulario.comuna.length; i++){
					if(formulario.comuna[i].name == name){
						add = false;
						break;
					}
				}
				if(add){
					if(ubication){
						var marker = MAPA.PUB.load_marker(centroid.lat, centroid.lng, {}, true);
						spa = {
							name: name,
							spatial: marker,
							lat: centroid.lat,
							lng: centroid.lng,
							codigo: numero
						};
						formulario.comuna.push(spa);
						spatial.PUB.set_point(marker);
					}
					else
					{
						spa = {
							name: name,
							spatial: null,
							lat: centroid.lat,
							lng: centroid.lng,
							codigo: numero
						};
						formulario.comuna.push(spa);
					}
					$("<div></div>").html(name).appendTo($(".comuna-listado-text"))
					.on('click', function(){
						if(!hold && !_CONFIG._CUSTOM.BLOCK){
							$(this).remove();
							if(spa.spatial != null){
								var code = GEOCGRCHI.PUB.get_form_element().PUB.get_code();
								var spatial = GEOCGRCHI.PUB.get_spatial_num(code);
								spatial.PUB.remove_point(spa.spatial)
							}
							formulario.comuna.splice(formulario.comuna.indexOf(spa),1);
							if(formulario.comuna.length == 0){
								var scope = angular.element($("#selector-comuna")).scope();
								scope.$apply(function(){
									scope["formlinea"].comunas.$setValidity("cccomuna", false);
									$("#selector-comuna").parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
								});
							}
						}
					});
				}	
			},
			verify_form: function(recover){
				if(typeof recover != "undefined" && recover) return true;
				var status = true;
				settings.codigo = 1;
				if($(".modalidad").children("select").val() == "-1")  status = false; 
				if($(".financiamiento").children("select").val() == "-1") status = false; 
				if($(".codigobip").children("input").val() != ""){
					if(!$.isNumeric($(".codigobip").children("input").val()) || $(".vcodigobip").children("input").val() == "" || !$.isNumeric($(".vcodigobip").children("input").val())){
						status = false;
						settings.codigo = 0;
					}
				}
				if($(".codigoini").children("input").val() != ""){
					if(!$.isNumeric($(".codigoini").children("input").val())){
						status = false;
						settings.codigo = 0;
					}
				}
//				if($(".codigo_input").val() == "") status = false;
				if($(".clasificacion").children("select").val() == "-1")  status = false;
				if($(".subclasificacion").children("select").val() == "-1") status = false;
				if($("#picker-termino").val() == "") status = false;
				if($("#picker-inicio").val() == "") status = false;
				if($("#picker-termino").datepicker( "getDate" ).getTime() <= $("#picker-inicio").datepicker( "getDate" ).getTime()){
					status = false;
					settings.codigo = 2;
				} 
				if($(".shortName").children("input").val() == "") status = false;
				if(settings.tipo == "TD" && ($("#tratoDirec").val() == -1 || $("#tratoDirec").val() == -2)) status = false;
				if(settings.tipo == "LPV" && ($("#selecLicPrivada").val() == -1 || $("#selecLicPrivada").val() == -2)) status = false;
				if(settings.tipo != "LP" && $(".normaproc").children("input").val() == "") status = false;
				if(formulario.comuna.length == 0) status = false;
				return status;
			},
			verify_complete: function(){
				return settings.status;
			},
			save_form: function(recover){
				if(self.PUB.verify_form(recover)){
					//GUARDAMOS LOS CAMPOS DE LA SUBCLASIFICACION
					if(typeof settings.subclasificacion_act != "undefined" && settings.subclasificacion_act != []){
						settings.subclasificacion = settings.subclasificacion_act;
						settings.subclasificacion_act = [];
					}
					formulario.tipo = "1"; //OBRA PUBLICA
					formulario.procedimiento = "1";
					if( $("#normaproc").val() == null || typeof $("#normaproc").val() == "undefined" ){
					    formulario.fundamento = " ";
					}else{
						formulario.fundamento = $("#normaproc").val();	
					}
					formulario.mandante = $("#servtxtinputs").val();
					formulario.monto_adjudicacion = ($("#montoAdjudicado").val() != "")?$("#montoAdjudicado").val().replace(/\./g,""):"NOTREQ";
					formulario.fecha_adjudicacion = ($("#fechaMontoAdjudicado").val() != "")?$("#fechaMontoAdjudicado").val():"NOTREQ";
					formulario.contratante =  $("#servtxtinput").val();
					formulario.modalidad = $(".modalidad").children("select").val();
					formulario.financiamiento = $(".financiamiento").children("select").val();
					if( $(".descrip").val() == null || typeof $(".descrip").val() == "undefined" ){
					    formulario.descrip = " ";
					}
					else{
						formulario.descrip = $(".descrip").val();	
					}
					formulario.codigobip = $(".codigobip").children("input").val();
					formulario.vcodigobip = $(".vcodigobip").children("input").val();
					formulario.codigoini = $(".codigoini").children("input").val();
					formulario.clasificacion = $(".clasificacion").children("select").val();
					formulario.subclasificacion = $(".subclasificacion").children("select").val();
					formulario.inidate = $("#picker-inicio").val();
					formulario.finishdate = $("#picker-termino").val();
					formulario.licPrivada= ($("#selecLicPrivada").val() != null)?$("#selecLicPrivada").val():"-1";
					formulario.tratoDirec= ($("#selecTratoDir").val() != null)?$("#selecTratoDir").val():"-1";
					formulario.shortName = $(".shortName").children("input").val().toUpperCase();
					
					fila.children(".form").removeClass("rojo").addClass("verde");
					settings.status = true;
					$("#saveform").addClass("verde");	
				}
				else
				{
					if(!status && settings.codigo == 1){
						POP.PUB.show({
							element: $("#saveform"),
							pos: "LEFT",
							content: ALERT({
								header: "Registro Incompleto",
								icon:'<i class="fa fa-exclamation"></i>', 
								body: "Por favor, ingrese la informaci&oacute;n requerida."
							}),
							css: {
								width: 300,
								height: 100,
								"font-size": "0.9em",
								padding: "5px"
							}
						});
						setTimeout(function(){ 
							POP.PUB.hide(); 
						}, 5000);
					}
					else if(!status && settings.codigo == 0){
						POP.PUB.show({
							element: $("#saveform"),
							pos: "LEFT",
							content: ALERT({
								header: "Registro Incorrecto",
								icon:'<i class="fa fa-exclamation"></i>', 
								body: "El codigo BIP e INI, solo acepta numeros. En caso de ingresar codigo BIP, debe incluir el verificador"
							}),
							css: {
								width: 300,
								height: 150,
								"font-size": "0.9em",
								padding: "5px"
							}
						});
						setTimeout(function(){ 
							POP.PUB.hide(); 
						}, 5000);
					}
					else if(!status && settings.codigo == 2){
						POP.PUB.show({
							element: $("#saveform"),
							pos: "LEFT",
							content: ALERT({
								header: "Registro Incorrecto",
								icon:'<i class="fa fa-exclamation"></i>', 
								body: "La fecha de inicio debe ser menor a la fecha de termino."
							}),
							css: {
								width: 300,
								height: 150,
								"font-size": "0.9em",
								padding: "5px"
							}
						});
						setTimeout(function(){ 
							POP.PUB.hide(); 
						}, 5000);
					}

				}
			},
			compare: function(form){
				var other = form.PUB.get_info();
				for(key in other){
					if(key == "linea") continue;
					if(key == "comuna"){
						if(JSON.stringify(other.comuna) != JSON.stringify(formulario.comuna)) return false;
						continue;
					}
					if(other[key].toUpperCase() != formulario[key].toUpperCase()) return false;
				}
				return true;
			},
			set_subclasificacion: function(subclasificacion){
				settings.subclasificacion_act = subclasificacion;
			},
			set_form: function(form){
				formulario = JSON.parse(JSON.stringify(form.PUB.get_info()));
				fila.children(".form").removeClass("rojo").addClass("verde");
				settings.status = true;
			}
		}
		_CONSTRUCT(fila, value, code, spatial,tipo)
	}
})();