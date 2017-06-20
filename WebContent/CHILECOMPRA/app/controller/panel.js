GEOCGRAPP
	.controller('tabs', function(){
		var reset = function(e){
			$(".tabs .tabsitem").removeClass("active");
			$(e.currentTarget).addClass("active");
		}
		this.inicio = function(e){
			reset(e);
			$(".tab-content").hide();
			$(".content-inicio").show();
		}
		this.ubicacion = function(e){
			reset(e);
			$(".tab-content").hide();
			$(".content-ubicaciones").show();
		}
		this.formulario = function(e){
			reset(e);
			$(".tab-content").hide();
			$(".content-formulario").show();
		}
		
	})
	.controller('inicio', function(){
		this.noubication = function(e){
			if(!_CONFIG._CUSTOM.BLOCK){
				$.SYNC.NEW("DRAW");
				if($.SYNC.SYNC(1,"DRAW")){
					if($(e.currentTarget).attr("data-value") == "false"){
						GEOCGRCHI.PUB.set_tool(3);
						GEOCGRCHI.PUB.set_spatial_null(true);
						GEOCGRCHI.PUB.set_control_spatial_state(true);
						$(e.currentTarget).attr("data-value", "true");
						$(e.currentTarget).css({
							background: "#26C63B"
						});
						POP.PUB.show({
							element: $(e.currentTarget),
							pos: "LEFT",
							content: ALERT({
								header: "Atenci&oacute;n",
								icon:'<i class="fa fa-exclamation"></i>', 
								body: "Una vez que complete el campo comuna en la pestaña de formulario se definiran las localizaciones transitorias de la obra de cada l&iacute;nea."
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
						e.stopPropagation();
						$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn").css("background", "#CCC");
						// $("#uploadBtn").prop("disabled", true);
					}
					else if($(e.currentTarget).attr("data-value") == "true"){
						GEOCGRCHI.PUB.set_spatial_null(false);
						GEOCGRCHI.PUB.set_tool(1);
						GEOCGRCHI.PUB.set_control_spatial_state(false);
						$(e.currentTarget).attr("data-value", "false");
						$(e.currentTarget).css({
							background: "#118BF4"
						});
						MAPA.PUB.verify_draw();
						$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn").css("background", "#118BF4");
						// $("#uploadBtn").prop("disabled",false);
						$.SYNC.FREE(1,"DRAW");
					}
				}
				else{
					var status = $.SYNC.STATUS("DRAW");
					if(status.ID_BUSY == 3){
						var prompt = new PROMPT({
							texto: "El sistema ha detectado que ya se dibuj&oacute; en el mapa. Para activar el botón “Sin Ubicac&oacute;n” borre los elementos dibujados.",
							first: function(e){
								e.PUB.destroy();
							},
							second: function(e){
								e.PUB.destroy();
							}
						});
						prompt.PUB.set_first('<i class="fa fa-check"></i> Aceptar');
						prompt.PUB.set_second('<i class="fa fa-check"></i> Cancelar');
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
						prompt.PUB.show();
					}
				}
			}
		}
		this.finish = function(){
		    var loc = document.location.href;
		    var getString = loc.split('?')[1];
		    var GET = getString.split('&');
		    var get = {};//this object will be filled with the key-value pairs and returned.

		    for(var i = 0, l = GET.length; i < l; i++){
		      var tmp = GET[i].indexOf('=');
		      get[GET[i].substring(0,tmp)] = unescape(decodeURI(GET[i].substring((tmp+1))));
		//      console.log("dato="+unescape(decodeURI(GET[i].substring((tmp+1)))));
		    }
			if(GEOCGRCHI.PUB.verify_all_info()){
				LOADING.message("Guardando datos en GEOCGR, Espere por favor...");
				LOADING.show();
				SOCKET.request({
					request: "mercado/set", 
					data:{
						formulario : GEOCGRCHI.PUB.get_formulario(),
						id_mercado : GEOCGRCHI.PUB.get_id_mercado(),
						kmlfile: GEOCGRCHI.PUB.get_kmlfile()
					},
					callback:function(result){
						LOADING.message("Negociando con Mercado Publico, Espere por favor...");
						var geocgrdata = {
							licitacion: get.codigo,
							llave: encodeURIComponent(get.key),
						};
						if(result.STATUS == "OK"){
							geocgrdata.statusGeoCgr = 'Ok';
						}
						else{
							geocgrdata.statusGeoCgr = 'Error';
							alert("Existio un error al generar la tramitación del expediente. Contacte con los administradores de la plataforma. Error: "+result.STATUS);
							LOADING.hide();
						//	console.log(result);
						}
						$.ajax({
							type: "POST",
							data: JSON.stringify(geocgrdata),
							dataType: "JSON", 
							url: "http://api.mercadopublico.cl/servicios/v1/privado/GeoCgr/RegistroGeoReferencia.json?ticket=D6DF9A69-2F0E-482E-B1F4-55A234C8193F",
							contentType: "application/json",
							crossdomain: true,
							success: function(resultado){
								if(resultado.Respuesta == "OK"){
									LOADING.hide();
									$("#modal2").show();
								}
								else
								{
									if(result.STATUS == "OK"){
										alert("El servicio de Mercado Público no validó la transacción. Contacte con los administradores de la plataforma.\n\r Código Mercado Público: "+resultado.Respuesta);
										LOADING.hide();
										$("#modal5").show();
									}
									else
									{
										alert("El servicio de Mercado Público no validó la transacción, debido a errores en la tramitación del expediente."); 
										LOADING.hide();
										$("#modal5").show();
									}
								}
							},
		                    error: function (xhr, status, error) {
		                        alert("Existe un error al contactar con el servicio de verificación de Mercado Público. Contacte con los administradores de la plataforma.");
		                        LOADING.hide();
		                        $("#modal5").show();
		                    },
		                    statusCode: {
							    404: function() {
							    	alert("El servicio de validación de Mercado Público no se encuentra disponible. Contacte con los administradores de la plataforma.");
							    	LOADING.hide();
							      	$("#modal5").show();
							    }  
							}
						});
					}
				});
			}
			else
			{
				$("#modal3").show();
			}
			
		}
	})
	.controller('formulario', function(){
		this.addcomuna = function(){
			if($("#selector-comuna").val() != ""){
				SOCKET.request({
					request: "comuna/getcomunaone", 
					data:{
						SEARCH: $("#selector-comuna").val()
					},
					callback:function(result){
						if(typeof result.value != "undefined"){
							GEOCGRCHI.PUB.get_form_element().PUB.add_comuna(result.value, JSON.parse(result.CENTROIDE), result.NUMERO);
							$("#selector-comuna").val('');
							var scope = angular.element($("#selector-comuna")).scope();
							scope.$apply(function(){
								scope["formlinea"].comunas.$setValidity("cccomuna", true);
								$("#selector-comuna").parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
							});
						}
						else
						{
							POP.PUB.show({
								element: $(e.currentTarget),
								pos: "TOP",
								content: ALERT({
									header: "Atenci&oacute;n",
									icon:'<i class="fa fa-exclamation"></i>', 
									body: "No se encuentran registros para la comuna indicada."
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
				});
			}
			else{
				POP.PUB.show({
					element: $(e.currentTarget),
					pos: "TOP",
					content: ALERT({
						header: "Atenci&oacute;n",
						icon:'<i class="fa fa-exclamation"></i>', 
						body: "Debe ingresar una comuna para agregar a la lista."
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
		},
		this.save = function(e,model){
			//VERIFICACIONES DE FORMULARIO
			var prev = GEOCGRCHI.PUB
			if(model.$valid){
				GEOCGRCHI.PUB.get_form_element().PUB.save_form();
				GEOCGRCHI.PUB.verify_form_clone();
			}
			else
			{
				$(".conditions-form").empty();
				if(typeof model.$error.cctextbox != "undefined"){
					$.each(model.$error.cctextbox, function(key,value){
						switch(value.$name){
							case "shortname":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe completar el campo \"Nombre corto\".");
								break;
							case "normaproc":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe completar el campo que indica la norma.");
								break;
							case "initdate":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar la fecha de \"Inicio Estimado\".");
								break;
							case "fechaMontoAdjudicado":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar la fecha de adjudicaci&oacute;n del monto.");
								break;
							case "montoAdjudicado":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe indica el monto adjudicado en pesos chilenos.");
								break;
							case "servmandante":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("En el campo \"Servicio Mandante\" debe escoger a la entidad p&uacute;blica desde el selector autocompletado.");
								break
							case "servcontratante":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("En el campo \"Servicio Contratante\" debe escoger a la entidad p&uacute;blica desde el selector autocompletado.");
								break
							case "finishdate":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar la fecha de \"T&eacute;rmino Estimado\".");
								break
						}
					});
				}	
				if(typeof model.$error.codigo != "undefined"){
					$.each(model.$error.codigo, function(key,value){
						switch(value.$name){
							case "codigobip":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("El \"C&oacute;digo BIP\" debe ingresar 8 d&iacute;gito.");
								break
							case "vcodigobip":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("El campo \"DV\" -D&iacute;gito Verificador del c&oacute;digo BIP- debe ingresar 1 d&iacute;gito.");
								break
							case "codigoini":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("En el campo \"C&oacute;digo INI\" debe ingresar 12 d&iacute;gitos.");
								break
						}
					});
				}
				if(typeof model.$error.validdate != "undefined"){
					$.each(model.$error.validdate, function(key,value){
						switch(value.$name){
							case "finishdate":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("La fecha \"T&eacute;rmino Estimado\" debe ser posterior a la fecha de \"Inicio Estimado\".");
								break
						}
					});
				}

				if(typeof model.$error.ccselect != "undefined"){
					$.each(model.$error.ccselect, function(key,value){
						switch(value.$name){
							case "modalidad":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar una de las alternativas del campo \"Modalidad de contrataci&oacute;n\".");
								break;
							case "financiamiento":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar una de las alternativas del campo \"Tipo de Financiamiento\".");
								break;
							case "clasificacion":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar una de las alternativas del campo \"Clasificaci&oacute;n de la Obra\".");
								break;
							case "selectSubClasificacion":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar una de las alternativas del campo  \"Subclasificaci&oacute;n de la Obra\".");
								break;
							case "selecLicPrivada":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar la causa de licitación privada.");
								break;
							case "selecTratoDir":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar la causa de trato directo.");
								break;
						}
					});
				}
				if(typeof model.$error.ccservicio != "undefined"){
					$.each(model.$error.ccservicio, function(key,value){
						switch(value.$name){
							case "servmandante":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar el servicio mandante de los servicios sugeridos por la funcion autocompletar.");
								break
							case "servcontratante":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar el servicio contratante de los servicios sugeridos por la funcion autocompletar.");
								break
						}
					});
				}
				if(typeof model.$error.cccomuna != "undefined"){
					$.each(model.$error.cccomuna, function(key,value){
						switch(value.$name){
							case "comunas":
								var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
								$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
								status.append("Debe seleccionar, al menos, una comuna en la que se ubica la o las intervenciones de su licitaci&oacute;n.");
								break
						}
					});
				}
				if(typeof model.$error.mideso != "undefined"){
					var status = $("<div></div>").addClass("punto").appendTo($(".conditions-form"));
					$("<i></i>").addClass("fa fa-times error invalid").appendTo(status);
					status.append("El codigo BIP y su digito verificador, han resultado invalidos en su validación con el servicio MIDESO.");
				}
				$("#modal4").show();
			}
		},
		this.changetab = function(e, tab){
			$(".form-tabs-info").hide();
			$(".form-tabs .tabs").removeClass('active');
			$(e.currentTarget).addClass('active');	
			if(tab == "DATOS"){
				$(".form-datos").show();
			}
			else if(tab == "DETALLES"){
				$(".form-detalles").show();	
			}
		}
	})
	.controller('ubicaciones', function(){
		this.savegeom = function(e){
			if(GEOCGRCHI.PUB.get_spatial_element().PUB.verify_geom()){
				$(e.currentTarget).addClass("verde");
				GEOCGRCHI.PUB.verify_spatial_clone();
			}
			else
			{
				POP.PUB.show({
					element: $(e.currentTarget),
					pos: "LEFT",
					content: ALERT({
						header: "Registro Incompleto",
						icon:'<i class="fa fa-exclamation"></i>', 
						body: "Por favor, dibuje la ubicaci&oacute;n."
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
		}
	});
