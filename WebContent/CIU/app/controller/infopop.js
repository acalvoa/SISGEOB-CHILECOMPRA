(function(){
	INFOPOP = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
			titulo: "Sin Titulo",
			monto: 0,
			ava_fin: 60
		}
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			if(Array.isArray(args)){
				return PRIV.MULTI_VIEW(args);
			}
			else{
				return PRIV.MONO_VIEW(args);
			}
		}
		var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
		// DEFINIMOS LOS EMTODOS PRIVADOS
		var PRIV = {
			MULTI_VIEW: function(args){
				var container = $("<div></div>");
				var contenedor = $("<div></div>").addClass("multi_infopop").appendTo(container);
				var titulo = $("<div></div>").addClass("header_selector").appendTo(contenedor);
				var content1 = $("<div></div>").addClass('contenedor_list').appendTo(contenedor);
				var content2 = $("<div></div>").addClass('infocont').appendTo(contenedor);
				var footer1 = $("<div></div>").addClass('footer_list').appendTo(contenedor);
				var btn_selector_1 = $("<div></div>").addClass("btn_selector").addClass("active").appendTo(titulo).html("LISTADO DE OBRAS").on('click', function(){
					content1.show();
					$(this).addClass("active");
					btn_selector_2.removeClass("active");
					content2.hide();
					footer1.show();
					$(".panel-item").hide();
					$("#clasificatab").show();
					RESUPOP.PUB.RESTORE();
				});
				var btn_selector_2 = $("<div></div>").addClass("btn_selector").appendTo(titulo).html("DETALLE DE LA OBRA");
				var monto = $("<div></div>").addClass('footer_element').appendTo(footer1);
				$("<div></div>").addClass('footer_element_header').appendTo(monto).html('<i class="fa fa-usd" aria-hidden="true"></i> Monto:');
				$("<div></div>").addClass('footer_element_value').addClass('amount_value').appendTo(monto).html('- - -');
				var fecha = $("<div></div>").addClass('footer_element').appendTo(footer1);
				$("<div></div>").addClass('footer_element_header').addClass('f_title').appendTo(fecha).html('<i class="fa fa-calendar" aria-hidden="true"></i> Fecha:');
				$("<div></div>").addClass('footer_element_value').addClass('fecha_value').appendTo(fecha).html('- - -');
				
				function ficha(arg,active){
					var _DATA = arg.DATA;
					var fecha_first=null;
					var fecha_last=null;
					var adjudicada=false;
					var construccion=false;
					var finalizada=false;
					var fecha_avance=null;
					var fecha_termino = (typeof _DATA.FEC_TERMINO != "undefined")? new Date(_DATA.FEC_TERMINO.replace(/-/g,"/")):null;
					var fecha_recepcion = (typeof _DATA.FEC_RECEPCION != "undefined")? new Date(_DATA.FEC_RECEPCION.replace(/-/g,"/")):null;
					var fecha_liquidacion = (typeof _DATA.FEC_LIQUIDACION != "undefined")? new Date(_DATA.FEC_LIQUIDACION.replace(/-/g,"/")):null;
					var fecha_adju_value = ((new Date(_DATA.F_TRAZON.replace(/-/g, "/"))) != (new Date("1900-01-01T00:00:00")))?(new Date(_DATA.F_TRAZON.replace(/-/g, "/"))):(new Date(_DATA.F_ADJUDICACION.replace(/-/g, "/")));
					var fecha_real_inicio= (typeof _DATA.F_INI_AVANCE != "undefined")? new Date(_DATA.F_INI_AVANCE.replace(/-/g,"/")):null;
					var fecha_est_inicio = (typeof _DATA.FECHA_INI != "undefined")? new Date(_DATA.FECHA_INI.replace(/-/g,"/")):null;
					var fecha_real_fin = (typeof _DATA.F_TER_AVANCE != "undefined")? new Date(_DATA.F_TER_AVANCE.replace(/-/g,"/")):null;
					var fecha_est_fin = (typeof _DATA.FECHA_FIN != "undefined")? new Date(_DATA.FECHA_FIN.replace(/-/g,"/")):null;
					
					var fecha_inicio = (fecha_real_inicio != null)? fecha_inicio=fecha_real_inicio:fecha_inicio=fecha_est_inicio;
					var fecha_fin = (fecha_real_fin != null)? fecha_fin=fecha_real_fin:fecha_fin=fecha_est_fin;
					
					if(typeof _DATA.F_AVANCE_FIS != "undefined" && typeof _DATA.F_AVANCE_FIN != "undefined")
					{	
						var fecha_fisico =new Date(_DATA.F_AVANCE_FIS.replace(/-/g,"/"));
						var fecha_financiero = new Date(_DATA.F_AVANCE_FIN.replace(/-/g,"/"));
						fecha_avance= (fecha_fisico >= fecha_financiero)?fecha_avance=fecha_fisico:fecha_avance=fecha_financiero;
					}
					else if(typeof _DATA.F_AVANCE_FIS != "undefined")
					{
						var fecha_fisico =new Date(_DATA.F_AVANCE_FIS.replace(/-/g,"/"));
						fecha_avance=fecha_fisico;
					}
					else if(typeof _DATA.F_AVANCE_FIN != "undefined")
					{
						var fecha_financiero = new Date(_DATA.F_AVANCE_FIN.replace(/-/g,"/"));
						fecha_avance=fecha_financiero;
					}
					var f_hoy = new Date();
					if(fecha_inicio <= f_hoy || parseInt(_DATA.AVANCE_FIN) > 0 || parseInt(_DATA.AVANCE_FIS) > 0){
						if(_DATA.RECEPCION != -1 || _DATA.LIQUIDACION != -1 || _DATA.T_ANTICIPADO != -1){
							finalizada=true;
							if(fecha_liquidacion!= null)
								fecha_first = fecha_liquidacion;
							else if(fecha_recepcion != null) 
								fecha_first = fecha_recepcion;
							else if(fecha_termino!=null)
								fecha_first = fecha_termino;
							else
								fecha_first=fecha_fin;
						}
						else if (fecha_inicio <= f_hoy){
							construccion=true;
							fecha_first=fecha_inicio;
						}
						else{
							adjudicada=true;
							fecha_first =fecha_adju_value;
						}
					} 
					else
					{
						adjudicada=true;
						fecha_first =fecha_adju_value;
					}
					$("<div></div>").addClass("element_list").appendTo(content1).html(_DATA.TITULO).on('mouseenter', function(){
						$(".footer_element .amount_value").html("$ "+PRIV.number_format(_DATA.MONTO_CONTRATADO,0,",","."));
						var fecha = (fecha_first!=null)?fecha_first:fecha_adju_value;
						if(adjudicada){
							$('.footer_element .f_title').html('<i class="fa fa-calendar" aria-hidden="true"></i> Adjudicada:');
						}
						else if(construccion){
							$('.footer_element .f_title').html('<i class="fa fa-calendar" aria-hidden="true"></i> Inicio:');
						}
						else{
							$('.footer_element .f_title').html('<i class="fa fa-calendar" aria-hidden="true"></i> Término:');
						}
						$(".footer_element .fecha_value").html(fecha.getDate()+" de "+meses[fecha.getMonth()]+" del "+fecha.getFullYear());
					}).on('click', function(){
						if(arg.TYPE == "C"){
							RESUPOP.PUB.SET_COMUNAL_VIEW(arg.DATA, arg.UPPER_LAYER);
						}
						else if(arg.TYPE == "P"){
							RESUPOP.PUB.SET_PROVINCIAL_VIEW(arg.DATA, arg.UPPER_LAYER);
						}
						args = {
							titulo: arg.DATA.TITULO,
							monto: arg.DATA.MONTO_CONTRATADO,
							ava_fin: arg.DATA.AVANCE_FIN,
							ava_fis: arg.DATA.AVANCE_FIS,
							f_adju: arg.DATA.F_ADJUDICACION,
							f_trazon: arg.DATA.F_TRAZON,
							f_ava_fis: arg.DATA.F_AVANCE_FIS,
							f_ava_fin: arg.DATA.F_AVANCE_FIN,
							f_ini: arg.DATA.FECHA_INI,
							f_fin: arg.DATA.FECHA_FIN,
							recepcion: arg.DATA.RECEPCION,
							liquidacion: arg.DATA.LIQUIDACION,
							t_anticipado: arg.DATA.T_ANTICIPADO,
							f_termino: arg.DATA.FEC_TERMINO,
							f_recepcion: arg.DATA.FEC_RECEPCION,
							f_liquidacion: arg.DATA.FEC_LIQUIDACION,
							f_real_ini: arg.DATA.F_INI_AVANCE,
							f_real_fin: arg.DATA.F_TER_AVANCE
						};
						//FECHAS OBJETOS
						var fecha_first=null;
						var fecha_last=null;
						var adjudicada=false;
						var construccion=false;
						var finalizada=false;
						var fecha_avance=null;
						var fecha_termino = (typeof args.f_termino != "undefined")? new Date(args.f_termino.replace(/-/g,"/")):null;
						var fecha_recepcion = (typeof args.f_recepcion != "undefined")? new Date(args.f_recepcion.replace(/-/g,"/")):null;
						var fecha_liquidacion = (typeof args.f_liquidacion != "undefined")? new Date(args.f_liquidacion.replace(/-/g,"/")):null;
						var fecha_adju_value = ((new Date(args.f_trazon.replace(/-/g, "/"))) != (new Date("1900-01-01T00:00:00")))?(new Date(args.f_trazon.replace(/-/g, "/"))):(new Date(args.f_adju.replace(/-/g, "/")));
						var fecha_real_inicio= (typeof args.f_real_ini != "undefined")? new Date(args.f_real_ini.replace(/-/g,"/")):null;
						var fecha_est_inicio = (typeof args.f_ini != "undefined")? new Date(args.f_ini.replace(/-/g,"/")):null;
						var fecha_real_fin = (typeof args.f_real_fin != "undefined")? new Date(args.f_real_fin.replace(/-/g,"/")):null;
						var fecha_est_fin = (typeof args.f_fin != "undefined")? new Date(args.f_fin.replace(/-/g,"/")):null;
						
						var fecha_inicio = (fecha_real_inicio != null)? fecha_inicio=fecha_real_inicio:fecha_inicio=fecha_est_inicio;
						var fecha_fin = (fecha_real_fin != null)? fecha_fin=fecha_real_fin:fecha_fin=fecha_est_fin;
						
						if(typeof args.f_ava_fis != "undefined" && typeof args.f_ava_fin != "undefined")
						{	
							var fecha_fisico =new Date(args.f_ava_fis.replace(/-/g,"/"));
							var fecha_financiero = new Date(args.f_ava_fin.replace(/-/g,"/"));
							fecha_avance= (fecha_fisico >= fecha_financiero)?fecha_avance=fecha_fisico:fecha_avance=fecha_financiero;
						}
						else if(typeof args.f_ava_fis != "undefined")
						{
							var fecha_fisico =new Date(args.f_ava_fis.replace(/-/g,"/"));
							fecha_avance=fecha_fisico;
						}
						else if(typeof args.f_ava_fin != "undefined")
						{
							var fecha_financiero = new Date(args.f_ava_fin.replace(/-/g,"/"));
							fecha_avance=fecha_financiero;
						}
						var f_hoy = new Date();
						
						//EL ESTILO CSS QUEDARA DEFINIDO EN MAPA
						content2.empty();
						var titulo = $("<div></div>").addClass("titulo").appendTo(content2);
						$("<div></div>").addClass('title_content').appendTo(titulo).html((args.titulo.length > 60)?args.titulo.substring(0,57)+"...": args.titulo);
						
						if(fecha_inicio <= f_hoy || parseInt(args.ava_fin) > 0 || parseInt(args.ava_fis) > 0){
							if(args.recepcion != -1 || args.liquidacion != -1 || args.t_anticipado != -1){
								$("<div></div>").addClass('status_content').appendTo(titulo).html("FINALIZADO");
								finalizada=true;
								fecha_first = fecha_inicio;
								if(fecha_liquidacion!= null)
									fecha_last = fecha_liquidacion;
								else if(fecha_recepcion != null) 
									fecha_last = fecha_recepcion;
								else if(fecha_termino!=null)
									fecha_last = fecha_termino;
								else
									fecha_last=fecha_fin;
							}
							else if (fecha_inicio <= f_hoy){
								$("<div></div>").addClass('status_content').appendTo(titulo).html("EN CONSTRUCCIÓN");
								construccion=true;
								fecha_first =(fecha_inicio!=null)?fecha_first=fecha_inicio:fecha_first=fecha_adju_value;
								fecha_last=(fecha_avance!=null)?fecha_last=fecha_avance:fecha_last=null;
							}
							else{
								$("<div></div>").addClass('status_content').appendTo(titulo).html("ADJUDICADO");
								adjudicada=true;
								fecha_first =fecha_adju_value;
								fecha_last=(fecha_fin!=null)?fecha_last=fecha_fin:fecha_last=fecha_adju_value;
							}
						} 
						else
						{
							$("<div></div>").addClass('status_content').appendTo(titulo).html("ADJUDICADO");
							adjudicada=true;
							fecha_first =fecha_adju_value;
							fecha_last=(fecha_fin!=null)?fecha_last=fecha_fin:fecha_last=fecha_adju_value;
						}
						var content = $("<div></div>").addClass('contenedor').appendTo(content2);
						var monto = $("<div></div>").addClass("monto").appendTo(content);
						$("<div></div>").addClass("monto_numero").appendTo(monto).html("$ "+PRIV.number_format(args.monto,0,"","."));
						//PORCENTAJES
						var porcentaje = $("<div></div>").addClass("porcentaje").appendTo(content);
						var porcentaje_container = $("<div></div>").addClass("porcentaje_container").appendTo(porcentaje);
						var p0 = $("<div></div>").addClass("p0").appendTo(porcentaje_container).html("0%");
						var p50 = $("<div></div>").addClass("p50").appendTo(porcentaje_container).html("50%");
						var p100 = $("<div></div>").addClass("p100").appendTo(porcentaje).html("100%");
						//AVANCE FISICO
						var ava_fis = $("<div></div>").addClass("avance").appendTo(content);
						$("<div></div>").addClass("titulo_ava").appendTo(ava_fis).html("AVANCE F&Iacute;SICO");
						var barra_fis = $("<div></div>").addClass("barra_ava").appendTo(ava_fis);
						$("<div></div>").addClass("relleno_barra").appendTo(barra_fis).css({
							width: args.ava_fis+"%"
						});
						$("<div></div>").addClass("porcentaje_ava").appendTo(ava_fis).html(PRIV.number_format(args.ava_fis,1,".")+"%");
						//AVANCE FINANCIERO
						var ava_fin = $("<div></div>").addClass("avance").addClass("avance_fin").appendTo(content);
						$("<div></div>").addClass("titulo_ava").appendTo(ava_fin).html("AV. FINANCIERO");
						var barra_fin = $("<div></div>").addClass("barra_ava").appendTo(ava_fin);
						$("<div></div>").addClass("relleno_barra").appendTo(barra_fin).css({
							width: ((args.ava_fin/args.monto)*100)+"%"
						});
						$("<div></div>").addClass("porcentaje_ava").appendTo(ava_fin).html(PRIV.number_format(((args.ava_fin/args.monto)*100),1,".")+"%");
						//FECHAS
						var fechas = $("<div></div>").addClass("fechas").appendTo(content);
						//ULTIMA ACTUALIZACION
						if(adjudicada)
						{
							var f_adju = $("<div></div>").addClass("fecha").appendTo(fechas);
							$("<div></div>").addClass("f_title").appendTo(f_adju).html('<i class="fa fa-calendar"></i> Adjudicación:');
							$("<div></div>").addClass("f_fecha").appendTo(f_adju).html(fecha_first.getDate()+" "+PRIV.get_mes((fecha_first.getMonth()+1))+" "+fecha_first.getFullYear());
							var f_acta = $("<div></div>").addClass("fecha").appendTo(fechas);
							$("<div></div>").addClass("f_title").appendTo(f_acta).html('<i class="fa fa-calendar"></i> Término:');
							var te_fecha = (fecha_last == null)?"No Registra":fecha_last.getDate()+" "+PRIV.get_mes((fecha_last.getMonth()+1))+" "+fecha_last.getFullYear();
							$("<div></div>").addClass("f_fecha").appendTo(f_acta).html(te_fecha);
						}
						else if(construccion)
						{
							var f_adju = $("<div></div>").addClass("fecha").appendTo(fechas);
							$("<div></div>").addClass("f_title").appendTo(f_adju).html('<i class="fa fa-calendar"></i> Inicio:');
							$("<div></div>").addClass("f_fecha").appendTo(f_adju).html(fecha_first.getDate()+" "+PRIV.get_mes((fecha_first.getMonth()+1))+" "+fecha_first.getFullYear());
							var f_acta = $("<div></div>").addClass("fecha").appendTo(fechas);
							$("<div></div>").addClass("f_title").appendTo(f_acta).html('<i class="fa fa-calendar"></i> Última Actualización:');
							var te_fecha = (fecha_last == null)?"No Registra":fecha_last.getDate()+" "+PRIV.get_mes((fecha_last.getMonth()+1))+" "+fecha_last.getFullYear();
							$("<div></div>").addClass("f_fecha").appendTo(f_acta).html(te_fecha);
						}
						else
						{
							var f_adju = $("<div></div>").addClass("fecha").appendTo(fechas);
							$("<div></div>").addClass("f_title").appendTo(f_adju).html('<i class="fa fa-calendar"></i> Inicio:');
							$("<div></div>").addClass("f_fecha").appendTo(f_adju).html(fecha_first.getDate()+" "+PRIV.get_mes((fecha_first.getMonth()+1))+" "+fecha_first.getFullYear());
							var f_acta = $("<div></div>").addClass("fecha").appendTo(fechas);
							$("<div></div>").addClass("f_title").appendTo(f_acta).html('<i class="fa fa-calendar"></i> Término:');
							var te_fecha = (fecha_last == null)?"No Registra":fecha_last.getDate()+" "+PRIV.get_mes((fecha_last.getMonth()+1))+" "+fecha_last.getFullYear();
							$("<div></div>").addClass("f_fecha").appendTo(f_acta).html(te_fecha);
						}
						content2.show();
						content1.hide();
						footer1.hide();
						btn_selector_2.addClass("active");
						btn_selector_1.removeClass("active");
					});
				}
				for(k=0; k<args.length; k++){
					ficha(args[k],(k==0)?true:false);
				}
				return container;
			},
			MONO_VIEW: function(args){
				args = {
					titulo: args.TITULO,
					monto: args.MONTO_CONTRATADO,
					ava_fin: args.AVANCE_FIN,
					ava_fis: args.AVANCE_FIS,
					f_adju: args.F_ADJUDICACION,
					f_trazon: args.F_TRAZON,
					f_ava_fis: args.F_AVANCE_FIS,
					f_ava_fin: args.F_AVANCE_FIN,
					f_ini: args.FECHA_INI,
					f_fin: args.FECHA_FIN,
					recepcion: args.RECEPCION,
					liquidacion: args.LIQUIDACION,
					t_anticipado: args.T_ANTICIPADO,
					f_termino: args.FEC_TERMINO,
					f_recepcion: args.FEC_RECEPCION,
					f_liquidacion: args.FEC_LIQUIDACION,
					f_real_ini: args.F_INI_AVANCE,
					f_real_fin: args.F_TER_AVANCE
				};
				SETTINGS = $.extend({}, SETTINGS, args);
				var container = $("<div></div>");
				var contenedor = $("<div></div>").addClass("infopop").appendTo(container);
				//FECHAS OBJETOS

				var fecha_first=null;
				var fecha_last=null;
				var adjudicada=false;
				var construccion=false;
				var finalizada=false;
				var fecha_avance=null;
				var fecha_termino = (typeof args.f_termino != "undefined")? new Date(args.f_termino.replace(/-/g,"/")):null;
				var fecha_recepcion = (typeof args.f_recepcion != "undefined")? new Date(args.f_recepcion.replace(/-/g,"/")):null;
				var fecha_liquidacion = (typeof args.f_liquidacion != "undefined")? new Date(args.f_liquidacion.replace(/-/g,"/")):null;
				var fecha_adju_value = ((new Date(args.f_trazon.replace(/-/g, "/"))) != (new Date("1900-01-01T00:00:00")))?(new Date(args.f_trazon.replace(/-/g, "/"))):(new Date(args.f_adju.replace(/-/g, "/")));
				var fecha_real_inicio= (typeof args.f_real_ini != "undefined")? new Date(args.f_real_ini.replace(/-/g,"/")):null;
				var fecha_est_inicio = (typeof args.f_ini != "undefined")? new Date(args.f_ini.replace(/-/g,"/")):null;
				var fecha_real_fin = (typeof args.f_real_fin != "undefined")? new Date(args.f_real_fin.replace(/-/g,"/")):null;
				var fecha_est_fin = (typeof args.f_fin != "undefined")? new Date(args.f_fin.replace(/-/g,"/")):null;
				
				var fecha_inicio = (fecha_real_inicio != null)? fecha_inicio=fecha_real_inicio:fecha_inicio=fecha_est_inicio;
				var fecha_fin = (fecha_real_fin != null)? fecha_fin=fecha_real_fin:fecha_fin=fecha_est_fin;
				
				if(typeof args.f_ava_fis != "undefined" && typeof args.f_ava_fin != "undefined")
				{	
					var fecha_fisico =new Date(args.f_ava_fis.replace(/-/g,"/"));
					var fecha_financiero = new Date(args.f_ava_fin.replace(/-/g,"/"));
					fecha_avance= (fecha_fisico >= fecha_financiero)?fecha_avance=fecha_fisico:fecha_avance=fecha_financiero;
				}
				else if(typeof args.f_ava_fis != "undefined")
				{
					var fecha_fisico =new Date(args.f_ava_fis.replace(/-/g,"/"));
					fecha_avance=fecha_fisico;
				}
				else if(typeof args.f_ava_fin != "undefined")
				{
					var fecha_financiero = new Date(args.f_ava_fin.replace(/-/g,"/"));
					fecha_avance=fecha_financiero;
				}
				var f_hoy = new Date();
				
				//EL ESTILO CSS QUEDARA DEFINIDO EN MAPA

				var titulo = $("<div></div>").addClass("titulo").appendTo(contenedor);
				$("<div></div>").addClass('title_content').appendTo(titulo).html((SETTINGS.titulo.length > 60)?SETTINGS.titulo.substring(0,57)+"...": SETTINGS.titulo);
				
				if(fecha_inicio <= f_hoy || parseInt(args.ava_fin) > 0 || parseInt(args.ava_fis) > 0){
					if(args.recepcion != -1 || args.liquidacion != -1 || args.t_anticipado != -1){
						$("<div></div>").addClass('status_content').appendTo(titulo).html("FINALIZADO");
						finalizada=true;
						fecha_first = fecha_inicio;
						if(fecha_liquidacion!= null)
							fecha_last = fecha_liquidacion;
						else if(fecha_recepcion != null) 
							fecha_last = fecha_recepcion;
						else if(fecha_termino!=null)
							fecha_last = fecha_termino;
						else
							fecha_last=fecha_fin;
					}
					else if (fecha_inicio <= f_hoy){
						$("<div></div>").addClass('status_content').appendTo(titulo).html("EN CONSTRUCCIÓN");
						construccion=true;
						fecha_first =(fecha_inicio!=null)?fecha_first=fecha_inicio:fecha_first=fecha_adju_value;
						fecha_last=(fecha_avance!=null)?fecha_last=fecha_avance:fecha_last=null;
					}
					else{
						$("<div></div>").addClass('status_content').appendTo(titulo).html("ADJUDICADO");
						adjudicada=true;
						fecha_first =fecha_adju_value;
						fecha_last=(fecha_fin!=null)?fecha_last=fecha_fin:fecha_last=fecha_adju_value;
					}
				} 
				else
				{
					$("<div></div>").addClass('status_content').appendTo(titulo).html("ADJUDICADO");
					adjudicada=true;
					fecha_first =fecha_adju_value;
					fecha_last=(fecha_fin!=null)?fecha_last=fecha_fin:fecha_last=fecha_adju_value;
				}
				var content = $("<div></div>").addClass('contenedor').appendTo(contenedor);
				var monto = $("<div></div>").addClass("monto").appendTo(content);
				$("<div></div>").addClass("monto_numero").appendTo(monto).html("$ "+PRIV.number_format(SETTINGS.monto,0,"","."));
				//PORCENTAJES
				var porcentaje = $("<div></div>").addClass("porcentaje").appendTo(content);
				var porcentaje_container = $("<div></div>").addClass("porcentaje_container").appendTo(porcentaje);
				var p0 = $("<div></div>").addClass("p0").appendTo(porcentaje_container).html("0%");
				var p50 = $("<div></div>").addClass("p50").appendTo(porcentaje_container).html("50%");
				var p100 = $("<div></div>").addClass("p100").appendTo(porcentaje).html("100%");
				//AVANCE FISICO
				var ava_fis = $("<div></div>").addClass("avance").appendTo(content);
				$("<div></div>").addClass("titulo_ava").appendTo(ava_fis).html("AVANCE F&Iacute;SICO");
				var barra_fis = $("<div></div>").addClass("barra_ava").appendTo(ava_fis);
				$("<div></div>").addClass("relleno_barra").appendTo(barra_fis).css({
					width: args.ava_fis+"%"
				});
				$("<div></div>").addClass("porcentaje_ava").appendTo(ava_fis).html(PRIV.number_format(args.ava_fis,1,".")+"%");
				//AVANCE FINANCIERO
				var ava_fin = $("<div></div>").addClass("avance").addClass("avance_fin").appendTo(content);
				$("<div></div>").addClass("titulo_ava").appendTo(ava_fin).html("AV. FINANCIERO");
				var barra_fin = $("<div></div>").addClass("barra_ava").appendTo(ava_fin);
				$("<div></div>").addClass("relleno_barra").appendTo(barra_fin).css({
					width: ((args.ava_fin/SETTINGS.monto)*100)+"%"
				});
				$("<div></div>").addClass("porcentaje_ava").appendTo(ava_fin).html(PRIV.number_format(((args.ava_fin/SETTINGS.monto)*100),1,".")+"%");
				//FECHAS
				var fechas = $("<div></div>").addClass("fechas").appendTo(content);
				//ULTIMA ACTUALIZACION
				if(adjudicada)
				{
					var f_adju = $("<div></div>").addClass("fecha").appendTo(fechas);
					$("<div></div>").addClass("f_title").appendTo(f_adju).html('<i class="fa fa-calendar"></i> Adjudicación:');
					$("<div></div>").addClass("f_fecha").appendTo(f_adju).html(fecha_first.getDate()+" "+PRIV.get_mes((fecha_first.getMonth()+1))+" "+fecha_first.getFullYear());
					var f_acta = $("<div></div>").addClass("fecha").appendTo(fechas);
					$("<div></div>").addClass("f_title").appendTo(f_acta).html('<i class="fa fa-calendar"></i> Término:');
					var te_fecha = (fecha_last == null)?"No Registra":fecha_last.getDate()+" "+PRIV.get_mes((fecha_last.getMonth()+1))+" "+fecha_last.getFullYear();
					$("<div></div>").addClass("f_fecha").appendTo(f_acta).html(te_fecha);
				}
				else if(construccion)
				{
					var f_adju = $("<div></div>").addClass("fecha").appendTo(fechas);
					$("<div></div>").addClass("f_title").appendTo(f_adju).html('<i class="fa fa-calendar"></i> Inicio:');
					$("<div></div>").addClass("f_fecha").appendTo(f_adju).html(fecha_first.getDate()+" "+PRIV.get_mes((fecha_first.getMonth()+1))+" "+fecha_first.getFullYear());
					var f_acta = $("<div></div>").addClass("fecha").appendTo(fechas);
					$("<div></div>").addClass("f_title").appendTo(f_acta).html('<i class="fa fa-calendar"></i> Última Actualización:');
					var te_fecha = (fecha_last == null)?"No Registra":fecha_last.getDate()+" "+PRIV.get_mes((fecha_last.getMonth()+1))+" "+fecha_last.getFullYear();
					$("<div></div>").addClass("f_fecha").appendTo(f_acta).html(te_fecha);
				}
				else
				{
					var f_adju = $("<div></div>").addClass("fecha").appendTo(fechas);
					$("<div></div>").addClass("f_title").appendTo(f_adju).html('<i class="fa fa-calendar"></i> Inicio:');
					$("<div></div>").addClass("f_fecha").appendTo(f_adju).html(fecha_first.getDate()+" "+PRIV.get_mes((fecha_first.getMonth()+1))+" "+fecha_first.getFullYear());
					var f_acta = $("<div></div>").addClass("fecha").appendTo(fechas);
					$("<div></div>").addClass("f_title").appendTo(f_acta).html('<i class="fa fa-calendar"></i> Término:');
					var te_fecha = (fecha_last == null)?"No Registra":fecha_last.getDate()+" "+PRIV.get_mes((fecha_last.getMonth()+1))+" "+fecha_last.getFullYear();
					$("<div></div>").addClass("f_fecha").appendTo(f_acta).html(te_fecha);
				}
				
				/*
				 var ava_fis = $("<div></div>").appendTo(contenedor).addClass("avance");
				$("<div></div>").addClass("tituloavance").html("Avance Financiero:").appendTo(ava_fis);
				var barra = $("<div></div>").addClass("progress barra").appendTo(ava_fis);
				// BARRA DE PROGRESO
				$("<div></div>").addClass("progress-bar")
				.attr("role", "progressbar")
				.attr("aria-valuenow", SETTINGS.ava_fin)
				.attr("aria-valuemin", 0)
				.attr("aria-valuemax", 100)
				.css({
					width: SETTINGS.ava_fin+"%"
				})
				.html(SETTINGS.ava_fin+"%")
				.appendTo(barra);
				*/
				 return container;
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
			get_mes:function(value){
				switch(value){
					case 1:
						return "Enero";
						break;
					case 2:
						return "Febrero";
						break;
					case 3:
						return "Marzo";
						break;
					case 4:
						return "Abril";
						break;
					case 5:
						return "Mayo";
						break;
					case 6:
						return "Junio";
						break;
					case 7:
						return "Julio";
						break;
					case 8:
						return "Agosto";
						break;
					case 9:
						return "Septiembre";
						break;
					case 10:
						return "Octubre";
						break;
					case 11:
						return "Noviembre";
						break;
					case 12:
						return "Diciembre";
						break;
				}
				return null;
			}
		}
		// DEFINIMOS LOS EMTODOS PUBLICOS 
		this.PUB = {
		}
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		return _CONSTRUCT(args);
	}
})();