(function(){
	CHILECOMPRA = function(args){
		//SELF
		var SELF = this;
		//DEFINIMOS UNA ESTRUCTURA DE SINCRONIZACION
		$.SYNC = {
			SYNC_TABLE: {},
			FREE: function(CALL_HANDLER,CLASS){
				if($.SYNC.SYNC_TABLE[CLASS].BUSY || (CALL_HANDLER == $.SYNC.SYNC_TABLE[CLASS].ID_BUSY)){
					$.SYNC.SYNC_TABLE[CLASS].BUSY = false;
					$.SYNC.SYNC_TABLE[CLASS].ID_BUSY = -1;
				}
			},
			SYNC: function(CALL_HANDLER,CLASS){
				if(!$.SYNC.SYNC_TABLE[CLASS].BUSY || (CALL_HANDLER == $.SYNC.SYNC_TABLE[CLASS].ID_BUSY)){
					$.SYNC.SYNC_TABLE[CLASS].ID_BUSY = CALL_HANDLER;
					$.SYNC.SYNC_TABLE[CLASS].BUSY = true;
					$.SYNC.SYNC_TABLE[CLASS].LAST_REG = CALL_HANDLER;
					return true;
				}
				else{

					return false;
				}
			},
			NEW: function(CLASS){
				if(typeof $.SYNC.SYNC_TABLE[CLASS] == "undefined"){
					$.SYNC.SYNC_TABLE[CLASS] = {
						BUSY: false,
						ID_BUSY: -1,
						LAST_REG: -1
					}
				}
			},
			STATUS: function(CLASS){
				if(typeof $.SYNC.SYNC_TABLE[CLASS] != "undefined"){
					return $.SYNC.SYNC_TABLE[CLASS];
				}
				return null;
			}
		};
		$.GEO = {
			EVENTS:{
				EVENTS_TABLE:{},
				READY_STATE:{},
				ON: function(event, callback,args){
					if(typeof $.GEO.EVENTS.EVENTS_TABLE[event] == "undefined") $.GEO.EVENTS.EVENTS_TABLE[event] = [];
					$.GEO.EVENTS.EVENTS_TABLE[event].push({
						call: callback,
						arguments: args 
					}); 
				},
				TRIGGER: function(event,callback){
					if(typeof $.GEO.EVENTS.EVENTS_TABLE[event] != "undefined" && $.GEO.EVENTS.EVENTS_TABLE[event] != null){
						for(i=0;i<$.GEO.EVENTS.EVENTS_TABLE[event].length;i++){
							var method = $.GEO.EVENTS.EVENTS_TABLE[event].pop();
							if(typeof method.arguments != "undefined"){
								method.call(method.arguments);	
							} 
							else{
								method.call();
							}
						}
						if(typeof callback != "undefined") callback();
						$.GEO.EVENTS.FREE(event);
					}
				},
				FREE: function(event){
					$.GEO.EVENTS.TRIGGER(event,function(){
						$.GEO.EVENTS.EVENTS_TABLE[event] = null;
					});
				},
				READY: function(event){
					$.GEO.EVENTS.READY_STATE[event] = true;
				},
				IS_READY: function(event){
					if(typeof $.GEO.EVENTS.READY_STATE[event] == "undefined" || !$.GEO.EVENTS.READY_STATE[event]){
						return false;
					}
					else{
						return true;
					}
				}
			}
		};
		//SETTINGS
		var settings = {
			url: null,
			spatial: {},
			form: {},
			titulo: $("#tituloid"),
			tipo: $("#tituloid2"),
			tabla: $("#tablaitems"),
			ubicaciones_slider: $("#ubicaciones-slider"),
			formularios_slider: $("#formularios-slider"),
			spatial_element: null,
			form_element: null,
			numtotal: 0,
			noubication: false,
			cache: [],
			DEBUG: true,
			BLOCK_SPATIAL: false,
			CLONE: false,
			VALID: true,
			load: 0,
			kmlfile: "No Existe"
		};
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			console.log("Inicializador Chilecompra - Cargando Datos");
			settings.url = PRIV.getGET();
			PRIV.service_loader();
			PRIV.load_html_trick();
			PRIV.set_title(settings.url.codigo);
			PRIV.set_tipo(settings.url.tipo);
			PRIV.active_slider();
			PRIV.loadForms(settings.url.tipo);
			PRIV.auto_comuna();
			PRIV.auto_contratante();
			PRIV.auto_mandante();
			PRIV.load_files();
			PRIV.setup_date();
			if( $.cookie("modal-ini") == null || $.cookie("modal-ini") == 0 || typeof $.cookie("modal-ini") == "undefined" ){
				$("#modal1").show();
			} else {
				$("#checkcookie").attr("checked", "checked");
				$("#checkcookie").attr("data-cookie", 1);
			}
		};
		// METODOS PRIVADOS
		var PRIV = {
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
			loadForms: function(tipo){
				//MOLIDAD DE CONTRATACION
				SOCKET.request({
					request: "formulario/FModalidad",
					data:{},
					callback: function(response){
						$(".modalidad").children('select').empty();
						$(".modalidad").children('select').append(new Option("Seleccione Modalidad de Contratacion.", -1, true, true));
						for(i=0;i<response.length; i++){
							var data = response[i];
							$(".modalidad").children('select').append(new Option(data.T_MODALIDAD_CONT, data.X_MODC, true, true));
						}
						$(".modalidad").children('select').val(-1);
						$.GEO.EVENTS.TRIGGER('MODCONTRA_LOAD');
						$.GEO.EVENTS.READY('MODCONTRA_LOAD');
					}
				});
				//TIPO DE FINANCIAMIENTO
				SOCKET.request({
					request: "formulario/FTFinanciamiento",
					data:{},
					callback: function(response){
						$(".financiamiento").children('select').empty();
						$(".financiamiento").children('select').append(new Option("Seleccione Tipo de Financiamiento.", -1, true, true));
						for(i=0;i<response.length; i++){
							var data = response[i];
							$(".financiamiento").children('select').append(new Option(data.T_TIPO_FINANCIAMIENTO, data.X_TIFI, true, true));
						}
						$(".financiamiento").children('select').val(-1);
						$.GEO.EVENTS.TRIGGER('TFOUNDING_LOAD');
						$.GEO.EVENTS.READY('TFOUNDING_LOAD');
					}
				});
				//TIPO DE LICITACION
				switch (tipo)
				{
					case "A1": case "B1": case "E1": case "F1": case "J1": case "CO": case "B2": case "E2": case "H2": case "I2": case "O2":
						//TIPO DE FINANCIAMIENTO
						SOCKET.request({
							request: "formulario/FLPrivada",
							data:{
								CAUSA_PRIV:1
							},
							callback: function(response){
								$(".causalicitacionprivada").children('#selecLicPrivada').empty();
								$(".causalicitacionprivada").children('#selecLicPrivada').append(new Option("Seleccione Causa de licitación privada.", -1, true, true));
								for(i=0;i<response.length; i++){
									var data = response[i];
									$(".causalicitacionprivada").children('#selecLicPrivada').append(new Option(data.T_CAUSA, data.X_CAPP, true, true));
								}
								$(".causalicitacionprivada").children('#selecLicPrivada').val(-1);
								$.GEO.EVENTS.TRIGGER('LICPRIVADA_LOAD');
								$.GEO.EVENTS.READY('LICPRIVADA_LOAD');
							}
						});
						//$("#nametipolicitacion").html("Licitaci&oacute;n Privada");
						break;
					case "A2": case "D1": case "C2": case "F2": case "SE":
						SOCKET.request({
							request: "formulario/FLPrivada",
							data:{
								CAUSA_PRIV:2
							},
							callback: function(response){
								$(".causalicitacionprivada").children('#selecTratoDir').empty();
								$(".causalicitacionprivada").children('#selecTratoDir').append(new Option("Seleccione Causa de trato directo.", -1, true, true));
								for(i=0;i<response.length; i++){
									var data = response[i];
									$(".causalicitacionprivada").children('#selecTratoDir').append(new Option(data.T_CAUSA, data.X_CAPP, true, true));
								}
								$(".causalicitacionprivada").children('#selecTratoDir').val(-1);
								$.GEO.EVENTS.TRIGGER('TRATODIRECTO_LOAD');
								$.GEO.EVENTS.READY('TRATODIRECTO_LOAD');
							}
						});
						break;	
				}
				// CLASIFIVCACION
				SOCKET.request({
					request: "formulario/FClasificacion",
					data:{
					},
					callback: function(response){

						$(".clasificacion").children('select').empty();
						$(".clasificacion").children('select').append(new Option("Seleccione la Clasifición de la obra.", -1, false, false));
						for(i=0;i<response.length; i++){
							var data = response[i];
							$(".clasificacion").children('select').append(new Option(data.T_CLASIFICACION, data.X_CLAS, false, false));
						}
						$.GEO.EVENTS.TRIGGER('CLASIFICATION_LOAD');
						$.GEO.EVENTS.READY('CLASIFICATION_LOAD');
					}
				});
				//ASIGNAMOS EL EVENTO DE CAMBIO
				$(".clasificacion").children('select').on('change', function(){
					if($(".clasificacion").children('select').val() == -1){
						$(".subclasificacion").children('select').empty();
						$(".subclasificacion").children('select').append(new Option("Seleccione la Subclasifición de la obra.", -1, true, true));
					}
					else
					{
						SOCKET.request({
							request: "formulario/FSubclasificacion",
							data:{
								CLASIFICACION:$(".clasificacion").children('select').val()
							},
							callback: function(response){
								settings.form_element.PUB.set_subclasificacion(response);
								$(".subclasificacion").children('select').empty();
								$(".subclasificacion").children('select').append(new Option("Seleccione la Subclasifición de la obra.", -1, true, true));
								for(i=0;i<response.length; i++){
									var data = response[i];
									$(".subclasificacion").children('select').append(new Option(data.T_SUBCLASIFICACION, data.X_SUBC, true, true));
								}
								$(".subclasificacion").children('select').val(-1);
							}
						});
					}	
				})
				
			},
			service_loader: function(){
				if(typeof _CONFIG._SERVICIO == "undefined") 
				{
					_CONFIG._SERVICIO = {};
					_CONFIG._SERVICIO.NOMBRE = "DEFAULT";
					_CONFIG._SERVICIO.FECHA = "DEFAULT";
				}
				if(_CONFIG._SERVICIO.NOMBRE != "DEFAULT"){
					$("#SERVICIOS_CONTENT").html("Segun nuestro registros, usted est&aacute; accediendo a este formulario desde las dependencias de "+_CONFIG._SERVICIO.NOMBRE+".<br><br>A continuaci&oacute;n debe ingresar el c&oacute;digo que su entidad p&uacute;blica dispone para identificar a la obra que est&aacute; registrando. Con ello se podr&aacute; completar de forma autom&aacute;tica el presente formulario.<br><br>En caso de ser necesario, se solicita registrar los datos faltantes.<br><br>Ingrese su c&oacute;digo interno que identifica la obra:");
					$(".fecha_servicio").html("Fecha de &uacute;ltimo WFS informado, "+_CONFIG._SERVICIO.FECHA);
					$("#modal_SERVICIOS").show();
				}
				else
				{
					PRIV.load_data();
				}
			},
			load_data: function(callback){
				LOADING.message("Cargado Datos de Mercado P&uacute;blico...");
				LOADING.show();
				SOCKET.request({
					request: "mercado/get", 
					data:{
						id: settings.url.codigo
					},
					callback:function(response){
						if(response.STATUS == "OK"){
							var PREV_STATUS = response.DATAREG;
							if(response.DATAREG.STATUS == 1 && _CONFIG._SERVICIO.NOMBRE == "DEFAULT") LOADING.message("Cargado Datos guardados previamente, Espere por favor...");
							response = response.DATA;
							PRIV.set_tipo(response.TIPO);
							PRIV.loadForms(response.TIPO);
							PRIV.load_precio(response.MONEDA, response.MONTOESTIMADO);
							PRIV.set_num_lineas(response.CANTIDADITEMS);
							$("#lineas-proyecto-fin").html(response.CANTIDADITEMS);
							//BLOQUEAMOS LAS DEMAS HERRAMIENTAS
							if(PREV_STATUS.STATUS == 1 && _CONFIG._SERVICIO.NOMBRE == "DEFAULT"){
								$.SYNC.NEW("DRAW");
								$.SYNC.SYNC(3,"DRAW");
								$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn").css("background", "#CCC");
								// $("#uploadBtn").prop("disabled", true);
								$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#CCC");
							}
							//CARGAMOS LOS DATOS
							$.each(response.ITEMS, function(key,value){
								var fila = PRIV.load_in_table(value,value.Correlativo);
								settings.spatial[value.Correlativo] = new SPATIAL(fila, value, value.Correlativo);
								if(PREV_STATUS.STATUS == 1 && _CONFIG._SERVICIO.NOMBRE == "DEFAULT") settings.spatial[value.Correlativo].PUB.load_state(PREV_STATUS[value.Correlativo]);
								settings.form[value.Correlativo] = new FORMULARIOS(fila, value, value.Correlativo, settings.spatial[value.Correlativo], response.TIPO);
								if(PREV_STATUS.STATUS == 1 && _CONFIG._SERVICIO.NOMBRE == "DEFAULT") settings.form[value.Correlativo].PUB.load_state(PREV_STATUS[value.Correlativo]);
							});
							PRIV.actual_geom(settings.spatial[Object.keys(settings.spatial)[0]]);
							PRIV.actual_form(settings.form[Object.keys(settings.form)[0]]);
							LOADING.hide();
						}
						else if(response.STATUS == "ERROR" && response.CODE=="MPNC"){
							if(settings.DEBUG) console.log(response);
							
							var prompt = new PROMPT({
								texto: "La API  de Mercado P&uacute;blico no se encuentra operativa. Cont&aacute;ctese con Mercado P&uacute;blico para mayor informaci&oacute;n",
								first: function(e){
									window.close();
								}
							});
							prompt.PUB.add_css({"text-align" : "center"});
							prompt.PUB.add_css_btn({"margin-left": "-75px"});
							prompt.PUB.set_first('<i class="fa fa-check"></i> Aceptar');
							prompt.PUB.show();
						}
						else if(response.STATUS == "ERROR" && typeof response.CODE=="undefined")
						{
							if(settings.DEBUG) console.log(response);
							alert(response.ERROR);
							window.close();
						}
						if(typeof callback != "undefined") callback();
					}
				});
			},
			load_precio: function(moneda,monto){
				if(moneda !== "CLP"){
					$("#montosadjudicados").show();
					$("#montoAdjudicado").on('focus',function(){
						POP.PUB.show({
							element: $(this),
							pos: "TOP",
							content: "Su unidad monetaria no corresponde a pesos chilenos, realice la conversi&oacute;n correspondiente<br>Monto Adjudicado: "+monto+" "+moneda,
							css: {
								width: 300,
								height: "auto",
								"font-size": "0.8em",
								padding: "5px"
							}
						});
						POP.PUB.mov_pop(50,-15);
					});
					$("#montoAdjudicado").on('blur',function(){
						POP.PUB.hide();
					});
				}
				else{
					$("#montosadjudicados").hide();
					var scope = angular.element($("#montoAdjudicado")).scope();
					scope.$apply(function(){
						scope["formlinea"].montoAdjudicado.$setValidity("cctextbox", true);
						scope["formlinea"].fechaMontoAdjudicado.$setValidity("cctextbox", true);
					});
				}
			},
			getGET: function (){
			   var loc = document.location.href;
			   var getString = loc.split('?')[1];
			   var GET = getString.split('&');
			   var get = {};//this object will be filled with the key-value pairs and returned.

			   for(var i = 0, l = GET.length; i < l; i++){
			      var tmp = GET[i].split('=');
			      get[tmp[0]] = unescape(decodeURI(tmp[1]));
			   }
			   return get;
			},

			load_in_table: function(item,numeroitem){
				var fila = $('<div class="tr"></div>');
				$('<div class="td t2"></div>').html(item.Correlativo).appendTo(fila);
				// AGREAMOS LAS LINEAS
				if(!item.Descripcion) item.Descripcion = item.Producto;
				$('<div class="td t3"></div>').html((item.Descripcion.length > 30)?item.Descripcion.substring(0,27)+"...":item.Descripcion).appendTo(fila)
				.on('mouseenter', function(){
					POP.PUB.show({
						element: $(this),
						pos: "TOP",
						content: item.Descripcion,
						css: {
							width: 300,
							height: "auto",
							"font-size": "0.9em",
							padding: "5px"
						}
					});
				})
				.on('mouseleave', function(){
					POP.PUB.hide();
				})
				// ASIGNAMOS LOS SIMBOLOS
				$('<div class="td t4 geom rojo"></div>').html('<i class="fa fa-map-marker"></i>').appendTo(fila).on('click', function(){
					PRIV.actual_geom(settings.spatial[numeroitem]);
					$(".tabsitem").removeClass("active");
					$(".tab-content").hide();
					$("#tabubicacion").addClass("active");
					$(".content-ubicaciones").show();
				});
				$('<div class="td t5 form rojo"></div>').html('<i class="fa fa-file-text"></i>').appendTo(fila).on('click', function(){
					PRIV.actual_form(settings.form[numeroitem]);
					$(".tabsitem").removeClass("active");
					$(".tab-content").hide();
					$("#tabformulario").addClass("active");
					$(".content-formulario").show();
				});
				fila.appendTo(settings.tabla);
				return fila;
			},
			load_html_trick: function(){
				$(".tbody").perfectScrollbar();
				$("#picker-termino").datepicker({
					'onSelect': function(value){
						$("#"+$(this).attr('id')).val(value);
						var scope = angular.element($("#"+$(this).attr('id'))).scope();
						scope.$apply(function(){
					        scope.finishdate = value;
					    });
					}
				}).unbind();
				$("#picker-inicio").datepicker({
					'onSelect': function(value){
						$("#"+$(this).attr('id')).val(value);
						var scope = angular.element($("#"+$(this).attr('id'))).scope();
						scope.$apply(function(){
					        scope.initdate = value;
					    });
					}
				}).unbind();
				$("#fechaMontoAdjudicado").datepicker({
					'onSelect': function(value){
						$("#"+$(this).attr('id')).val(value);
						var scope = angular.element($("#"+$(this).attr('id'))).scope();
						scope.$apply(function(){
					        scope.ccfechaMontoAdjudicado = value;
					    });
					}
				}).unbind();

				$("#montoAdjudicado").on('keyup',function(){
					$(this).val(PRIV.number_format($(this).val(), 0, "", "."));
				});

				$("#termino-estimado").on('click', function(e){
					$("#picker-termino").datepicker("show");
				});
				
				$("#inicio-estimado").on('click', function(){
					$("#picker-inicio").datepicker("show");
				});

				$("#btn-fecha-adjudicacion").on('click', function(){
					$("#fechaMontoAdjudicado").datepicker("show");
				});
				
				$("#trazon-estimado").on('click', function(){
					$("#picker-trazon").datepicker("show");
				});
				
				$("#licitacion-fin").html(settings.url.codigo);
			},
			set_title: function(title){
				settings.titulo.html("LICITACI&Oacute;N "+title);
			},
			
			/***************** ojo *******************************************/			
			set_tipo: function(tipo){
				settings.tipo = tipo;
				switch (tipo)
				{
					case "L1": case "LE": case "LP": case "LS": case "LQ": case "LR": case "O1":
						$("#selecLicPrivada").hide();
						$("#selecTratoDir").hide();
						$("#tituloid2").hide();
						$("#normaproc").parent().hide();
						$("#normaproc").parent().parent().hide();
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
					case "A1": case "B1": case "E1": case "F1": case "J1": case "CO": case "B2": case "E2": case "H2": case "I2": case "O2":
						$("#selecLicPrivada").show();
						$("#selecTratoDir").hide();
						$("#normaproc").parent().show();
						$("#normaproc").parent().parent().show();
						$(".obra-publica-tipo").hide();
						//VALIDACIONES
						var scope = angular.element($("#selecTratoDir")).scope();
						scope.$apply(function(){
							scope["formlinea"].selecLicPrivada.$setValidity("ccselect", false);
							scope["formlinea"].selecTratoDir.$setValidity("ccselect", true);
							scope["formlinea"].normaproc.$setValidity("cctextbox", false);
						});
						break;
					case "A2": case "D1": case "C2": case "F2": case "SE":
						$("#selecLicPrivada").hide();
						$("#selecTratoDir").show();
						$("#normaproc").parent().show();
						$("#normaproc").parent().parent().show();
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
			/***************** ojo *******************************************/
			set_num_lineas: function(num){
				settings.numtotal = num;
			},
			actual_geom: function(element){
				try{
					settings.spatial_element.PUB.clear();
				}
				catch(e){

				}
				settings.spatial_element = element;
				element.PUB.print();
				settings.ubicaciones_slider.children(".bcontent").children(".titulos").children(".contador").html(element.PUB.get_code()+" DE "+settings.numtotal);
			},
			actual_form: function(element){
				settings.form_element = element;
				element.PUB.print();
				settings.formularios_slider.children(".bcontent").children(".titulos").children(".contador").html(element.PUB.get_code()+" DE "+settings.numtotal);
			},
			prev_geom: function(){
				var indexs = Object.keys(settings.spatial);
				var actual = indexs.indexOf(settings.spatial_element.PUB.get_code().toString());
				if(actual >0){
					var element = settings.spatial[indexs[(actual-1)]];
					PRIV.actual_geom(element);
				}
			},
			get_prev_geom: function(){
				var indexs = Object.keys(settings.spatial);
				var actual = indexs.indexOf(settings.spatial_element.PUB.get_code().toString());
				if(actual >0){
					var element = settings.spatial[indexs[(actual-1)]];
					return element;
				}
				else
				{
					return null;
				}
			},
			set_geom: function(num){
				var element = settings.spatial[num];
				PRIV.actual_geom(element);
			},
			next_geom: function(){
				var indexs = Object.keys(settings.spatial);
				var actual = indexs.indexOf(settings.spatial_element.PUB.get_code().toString());
				if(actual < (settings.numtotal-1)){
					var element = settings.spatial[indexs[(actual+1)]];
					PRIV.actual_geom(element);
				}
			},
			get_next_geom: function(k){
				var indexs = Object.keys(settings.spatial);
				var actual = indexs.indexOf(settings.spatial_element.PUB.get_code().toString());
				if((actual+k) < settings.numtotal){
					var element = settings.spatial[indexs[(actual+k)]];
					return element;
				}
				else
				{
					return null;
				}
			},
			prev_form: function(){
				var indexs = Object.keys(settings.form);
				var actual = indexs.indexOf(settings.form_element.PUB.get_code().toString());
				if(actual >0){
					var element = settings.form[indexs[(actual-1)]];
					PRIV.actual_form(element);
				}
			},
			get_prev_form: function(){
				var indexs = Object.keys(settings.form);
				var actual = indexs.indexOf(settings.form_element.PUB.get_code().toString());
				if(actual >0){
					var element = settings.form[indexs[(actual-1)]];
					return element;
				}
				else
				{
					return null;
				}
			},
			next_form: function(){
				var indexs = Object.keys(settings.form);
				var actual = indexs.indexOf(settings.form_element.PUB.get_code().toString());
				if(actual < (settings.numtotal-1)){
					var element = settings.form[indexs[(actual+1)]];
					PRIV.actual_form(element);
				}
			},
			get_next_form: function(k){
				var indexs = Object.keys(settings.form);
				var actual = indexs.indexOf(settings.form_element.PUB.get_code().toString());
				if((actual+k) < settings.numtotal){
					var element = settings.form[indexs[(actual+k)]];
					return element;
				}
				else
				{
					return null;
				}
			},
			active_slider: function(){
				settings.ubicaciones_slider.children(".bcontent").children(".botondere").on('click', function(){
					PRIV.next_geom();
				});
				settings.ubicaciones_slider.children(".bcontent").children(".botonizq").on('click', function(){
					PRIV.prev_geom();
				});
				settings.formularios_slider.children(".bcontent").children(".botondere").on('click', function(){
					PRIV.next_form();
				});
				settings.formularios_slider.children(".bcontent").children(".botonizq").on('click', function(){
					PRIV.prev_form();
				});
			},
			btn_ubicacion: function(){
				$("#guardargeom").on('click', function(){

				});
			},	
			btn_formulario: function(){

			},
			auto_comuna: function(){
				$("#selector-comuna").autocomplete({
			      	minLength: 3,
			      	focus: function( event, ui ) {
			       	 	$("#selector-comuna").val(ui.item.value);
			        	return false;
			      	},
			      	source: function( request, response ) {
				        var term = request.term;
				        if ( term in settings.cache ) {
				          response( settings.cache[ term ] );
				          return;
				        }
				        SOCKET.request({
							request: "comuna/getautocomplete", 
							data:{
								SEARCH: term
							},
							callback:function(result){
								settings.cache[ term ] = result;
				          		response(result);
							}
						});
			      	},
			      	select: function( event, ui ) {
				        $("#selector-comuna").val( ui.item.value);
				        $("#comuna-data-selector").val(ui.item.CENTROIDE);
				        return false;
			        }
			    });
			},
			auto_contratante: function(){
				$("#servtxtinput").autocomplete({
			      	minLength: 5,
			      	source: function( request, response ) {
				        var term = request.term;
				        if ( term in settings.cache ) {
				          response( settings.cache[ term ] );
				          return;
				        }
				        SOCKET.request({
							request: "utils/getServicios", 
							data:{
								SERVICIO: term
							},
							callback:function(result){
								settings.cache[ term ] = result;
				          		response(result);
							}
						});
			      	},
			      	select: function( event, ui ) {
			      		$("#servtxtinput").val(ui.item.value);
						var scope = angular.element($("#servtxtinput")).scope();
						scope.$apply(function(){
					        scope.servcontratante = ui.item.value;
					    });
			      	}
			    });
			},
			auto_mandante: function(){
				$("#servtxtinputs").autocomplete({
			      	minLength: 5,
			      	source: function( request, response ) {

				        var term = request.term;
				        if ( term in settings.cache ) {
				          response( settings.cache[ term ] );
				          return;
				        }
				        SOCKET.request({
							request: "utils/getServicios", 
							data:{
								SERVICIO: term
							},
							callback:function(result){
								settings.cache[ term ] = result;
				          		response(result);
							}
						});
			      	},
			      	select: function( event, ui ) {
			      		$("#servtxtinputs").val(ui.item.value);
						var scope = angular.element($("#servtxtinputs")).scope();
						scope.$apply(function(){
					        scope.servmandante = ui.item.value;
					    });
			      	}
			    });
			},
			load_files: function(){
				$(".kmlfile").on('click', function(e){
					var status = $.SYNC.STATUS("DRAW");
					if(status.ID_BUSY == 3){
						var prompt = new PROMPT({
							texto: "El sistema ha detectado que ya se seleccion&oacute; una alternativa de registro de ubicaci&oacute;n. Para adjuntar archivo KML, anule la alternativa anterior.",
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
						e.preventDefault();
						e.stopPropagation();
					}
					else if(status.ID_BUSY == 1){
						var prompt = new PROMPT({
							texto: "El sistema ha detectado que ya se seleccion&oacute; una alternativa de registro de ubicaci&oacute;n. Para adjuntar archivo KML, anule la alternativa anterior.",
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
						e.preventDefault();
						e.stopPropagation();
					}
				});
				$("#uploadBtn").on('change', function(e){
					MAPA.PUB.removeEvent('click');
					var prompt = new PROMPT({
						texto: "Al adjuntar archivo KML no podr&aacute; accionar el bot&oacute;n “Sin Ubicaci&oacute;n”, ni dibujar en el mapa de la pestaña ubicaci&oacute;n. ¿Desea continuar?",
						first: function(ex){
							$.SYNC.NEW("DRAW");
							if($.SYNC.SYNC(2,"DRAW")){
								ex.PUB.destroy();
								var files = e.target.files;
							 	for (var i = 0, f; f = files[i]; i++) {
						      	// Only process image files.
						      	if (!f.type.match('kml.*')) {
						      		POP.PUB.show({
										element: $(".kmlfile"),
										pos: "LEFT",
										content: ALERT({
											header: "Registro Incompleto",
											icon:'<i class="fa fa-exclamation"></i>', 
											body: "El archivo especificado no es un archivo kml valido."
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
						        	continue;
						     	}

						      	var reader = new FileReader();
						      	$(".visor").html("Archivo KML");
						      	
						      	// Closure to capture the file information.
						      	reader.onload = (function(theFile) {
						        	return function(e) {
							          	// Render thumbnail.
							          	parser=new DOMParser();
				   					    xmlDoc=parser.parseFromString(e.target.result,"text/xml");
				   					    var kml = xmlDoc.firstElementChild;
				   					    var patern = kml.children[0].getElementsByTagName("name")[0].innerHTML.toUpperCase().replace(/\..*/i, "").replace(/_/g,"-");
				   					    if(patern ==  settings.url.codigo.toUpperCase()){
				   					    	SELF.PUB.set_tool(2);
				   					    	var temp = kml.children[0].getElementsByTagName("Placemark");
				   					    	var totalprocess = 0;
				   					    	for(key in temp){
				   					    		var value = temp[key];
				   					    		if(typeof value == "object"){
						   					   		var name = value.getElementsByTagName("name")[0].innerHTML.toLowerCase();
						   					   		if(value.getElementsByTagName("Point").length > 0){
						   					   			var coord = value.getElementsByTagName("Point")[0].getElementsByTagName("coordinates")[0].innerHTML.split(",");
						   					   			var marker = new google.maps.Marker({
															position:  MAPA.PUB.getLatLng(coord[1],coord[0]),
															map: MAPA.PUB.getMap(),
															draggable: true
														});
						   					   			settings.spatial[name].PUB.set_point(marker);
						   					   			settings.spatial[name].PUB.set_type(2);
						   					   		}
						   					   		else if(value.getElementsByTagName("LineString").length > 0){
						   					   			var coord = value.getElementsByTagName("LineString")[0].getElementsByTagName("coordinates")[0].innerHTML.trim().split(" ");
						   					   			if(coord.length > 1)
					   					   				{
							   					   			var c = new google.maps.MVCArray();
							   					   			var status = true;
							   					   			for(i=0; i<coord.length; i++){
							   					   				var coordenada = coord[i].split(",");
							   					   				if(!(typeof coordenada[1] == "string" && typeof coordenada[0] == "string") && !isNaN(coordenada[0]) && !isNaN(coordenada[1])){
							   					   					status = false;
							   					   					break;
							   					   				}
							   					   				c.push(MAPA.PUB.getLatLng(coordenada[1],coordenada[0]));
							   					   			}
							   					   			if(status){
							   					   				totalprocess++;
								   					   			var line = new google.maps.Polyline({
																	path: c,
																	map: MAPA.PUB.getMap(),
																	strokeColor: '#ff0000',
																	strokeWeight: 4,
																	strokeOpacity: 0.5,
																	clickable: true,
																});
								   					   			settings.spatial[name].PUB.set_line(line);
								   					   			settings.spatial[name].PUB.set_type(2);
							   					   			}
					   					   				}
						   					   		}
						   					   		settings.spatial[name].PUB.clear();
						   					   	}
					   					    };
					   					    if(totalprocess == temp.length){
					   					    	PRIV.set_geom(1);
					   					    	settings.kmlfile = e.target.result;
												POP.PUB.show({
													element: $(".kmlfile"),
													pos: "LEFT",
													content: ALERT({
														header: "Carga Completa",
														icon:'<i class="fa fa-exclamation"></i>', 
														body: "El archivo ha sido cargado de forma correcta. Complete el formulario."
													}),
													css: {
														width: "auto",
														height: 100,
														"font-size": "0.9em",
														padding: "10px"
													}
												});
												if(theFile.name == "" || theFile.name == null || typeof theFile.name == "undefined"){
													$(".visor").html("Archivo KML");
												}
												else{
													$(".visor").html(theFile.name);
												}
												setTimeout(function(){ 
													POP.PUB.hide(); 
												}, 5000);
												GEOCGRCHI.PUB.set_control_spatial_state(true);
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
												$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#CCC");
												$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn .fa-upload").css("display", "none");
												$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn .fa-trash-o").css("display", "block");
												$("#uploadBtn").unbind().on('click',function(e){
													SELF.PUB.set_tool(1);
													settings.kmlfile = "No Existe";
													$.each($.infowindows,function(key,value){
														value.out();
													});
													settings.spatial[name].PUB.clear_check();
													GEOCGRCHI.PUB.set_control_spatial_state(false);
													$(".visor").html("Archivo KML");
													$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#4980BB");
													$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn .fa-upload").css("display", "block");
													$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn .fa-trash-o").css("display", "none");
													$.SYNC.FREE(2,"DRAW")
													$("#uploadBtn").unbind().val('');
													PRIV.load_files();
													e.preventDefault();
													
												});
					   					    }
					   					    else
				   					    	{
					   					    	PRIV.set_geom(1);
					   					    	settings.kmlfile = e.target.result;
												POP.PUB.show({
													element: $(".kmlfile"),
													pos: "LEFT",
													content: ALERT({
														header: "Carga Completa",
														icon:'<i class="fa fa-exclamation"></i>', 
														body: "Se han cargado "+totalprocess+" elementos de "+temp.length+" encontrados en el archivo. Verifique que las coordenadas de los elementos faltantes sean validas."
													}),
													css: {
														width: "400",
														height: 150,
														"font-size": "0.9em",
														padding: "10px"
													}
												});
												if(theFile.name == "" || theFile.name == null || typeof theFile.name == "undefined"){
													$(".visor").html("Archivo KML");
												}
												else{
													$(".visor").html(theFile.name);
												}
												setTimeout(function(){ 
													POP.PUB.hide(); 
												}, 7000);
												GEOCGRCHI.PUB.set_control_spatial_state(true);
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
												$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#CCC");
												$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn .fa-upload").css("display", "none");
												$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn .fa-trash-o").css("display", "block");
												$("#uploadBtn").unbind().on('click',function(e){
													SELF.PUB.set_tool(1);
													settings.kmlfile = "No Existe";
													$.each($.infowindows,function(key,value){
														value.out();
													});
													settings.spatial[name].PUB.clear_check();
													GEOCGRCHI.PUB.set_control_spatial_state(false);
													$(".visor").html("Archivo KML");
													$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#4980BB");
													$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn .fa-upload").css("display", "block");
													$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn .fa-trash-o").css("display", "none");
													$.SYNC.FREE(2,"DRAW")
													$("#uploadBtn").unbind().val('');
													PRIV.load_files();
													e.preventDefault();
												});
				   					    	}
					   					    
				   					    }
				   					    else
				   					    {
				   					    	SELF.PUB.set_tool(1);
				   					    	POP.PUB.show({
												element: $(".kmlfile"),
												pos: "LEFT",
												content: ALERT({
													header: "Registro Incompleto",
													icon:'<i class="fa fa-exclamation"></i>', 
													body: "El archivo especificado no posee las especificaciones de la licitaci&oacute;n actual."
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
						        	};
						      	})(f);

						      	// Read in the image file as a data URL.
						      	reader.readAsText(f);
							    }
							}
						},
						second: function(ex){
							e.stopPropagation();
							$("#uploadBtn").val('');
							ex.PUB.destroy();
						}
					});
					prompt.PUB.set_first('<i class="fa fa-check"></i> Aceptar');
					prompt.PUB.set_second('<i class="fa fa-times"></i> Cancelar');
					prompt.PUB.show();
				});
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
			get_spatial_element: function(){
				return settings.spatial_element;
			},
			get_form_element: function(){
				return settings.form_element;
			},
			get_id_mercado:function(){
			  return settings.url.codigo;	
			},
			get_kmlfile: function(){
				return settings.kmlfile;
			},
			get_formulario: function(){
				var formularios= [];
				for(key in settings.form){
					formularios.push({
						id: key,
						form: settings.form[key].PUB.get_info(),
						spatial: settings.spatial[key].PUB.get_spatial_send()
					});
				}
				return formularios;
			},
			set_spatial_null: function(boole){
				settings.noubication = boole;
				$.each(settings.spatial, function(key,value){
					value.PUB.set_noubication(boole);
					value.PUB.clear_check();
				});
			},
			get_spatial_num: function(num){
				return settings.spatial[num];
			},
			get_ubication: function(){
				return settings.noubication;
			},
			verify_all_info: function(){
				var status = true;
				$.each(settings.spatial, function(key,value){
					if(!value.PUB.verify_geom()) status = false;
				});
				$.each(settings.form, function(key,value){
					if(!value.PUB.verify_complete()) status = false;
				});
				return status;
			},		
			load_data: function(callback){
				if(settings.load == 0){
					settings.load = 1;
					PRIV.load_data(callback);
				}
				else
				{
					callback();
				}
			},
			set_control_spatial: function(value){
				if(value){
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
				settings.BLOCK_SPATIAL = value;
			},
			set_control_spatial_state: function(value){
				settings.BLOCK_SPATIAL = value;
			},
			get_control_spatial: function(){
				return settings.BLOCK_SPATIAL;
			},
			get_tipo: function(){
				return settings.tipo;
			},
			verify_form_clone: function(){
				var prev = PRIV.get_prev_form();
				var next = PRIV.get_next_form(1);
				if(prev != null && next != null){
					if(prev.PUB.compare(settings.form_element)){
						var prompt = new PROMPT({
							texto: "Los datos de dos l&iacute;neas de licitaci&oacute;n son coincidentes.<br><br>¿Desea autocompletar estos mismos datos en los formularios del resto de las l&iacute;neas de licitaci&oacute;n que le queda por registrar?",
							first: function(e){
								var k = 1;
								var next_form = PRIV.get_next_form(k);
								while(next_form != null){
									next_form.PUB.set_form(prev);
									next_form = PRIV.get_next_form(++k);
								}
								e.PUB.destroy();
							},
							second: function(e){
								e.PUB.destroy();
							}
						});
						prompt.PUB.set_first('<i class="fa fa-check"></i> Si');
						prompt.PUB.set_second('<i class="fa fa-times"></i> No');
						prompt.PUB.show();
					}	
				}
			},
			verify_spatial_clone: function(){
				var prev = PRIV.get_prev_geom();
				var next = PRIV.get_next_geom(1);
				if(prev != null && next != null){
					if(prev.PUB.compare(settings.spatial_element)){
						var prompt = new PROMPT({
							texto: "¿Desea replicar esta ubicaci&oacute;n en el resto de las l&iacute;neas de licitaci&oacute;n que le queda por registrar?",
							first: function(e){
								var k = 1;
								var next_form = PRIV.get_next_geom(k);
								while(next_form != null){
									next_form.PUB.set_geom(prev);
									next_form = PRIV.get_next_geom(++k);
								}
								e.PUB.destroy();
							},
							second: function(e){
								e.PUB.destroy();
							}
						});
						prompt.PUB.set_first('<i class="fa fa-check"></i> Si');
						prompt.PUB.set_second('<i class="fa fa-times"></i> No');
						prompt.PUB.show();
					}	
				}
			},
			set_tool: function(value){
				$.each(settings.spatial, function(key,valor){
					valor.PUB.set_tool(value)
				});
			}
		}
		_CONSTRUCT(args);
	}
})();