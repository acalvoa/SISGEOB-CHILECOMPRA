(function(){
	FICHA = function(args){
		var settings = {
			container: $("#ficha"),
			ficha_datos: $("#ficha_datos"),
			ficha_descripcion: $("#ficha_descripcion"),
			ficha_detalle: $("#ficha_detalle"),
			ficha_control: $("#ficha_control"),
			ficha_contratista: $("#ficha_contratista")
		}
		// CONSTRUCTOR
		var _CONSTRUCT = function(args){
			// CARGAMOS LAS VARIABLES TAB
			PRIV.click_action();
		}
		var PRIV = {
			make_row: function(r){
				var fila = $("<div></div>").addClass("fila");
				$("<div></div>").addClass("titulo").appendTo(fila).html(r.titulo);
				$("<div></div>").addClass("body").appendTo(fila).html(r.content);
				return fila;
			},
			make_row_extend: function(r){
				var fila = $("<div></div>").addClass("fila");
				$("<div></div>").addClass("bodyextend").appendTo(fila).html(r.content);
				return fila;
			},
			make_row_height_extend: function(r){
				var fila = $("<div></div>").addClass("fila");
				$("<div></div>").addClass("titulo").appendTo(fila).html(r.titulo);
				$("<div></div>").addClass("bodyextendheight").appendTo(fila).html(r.content);
				return fila;
			},
			reset: function(){
				$(".pbody").hide();
				$("#ficha_datos").show();
			},
			click_action: function(){
				$(".pheader").on('click',function(){
					if($(this).parent().children(".pbody").css('display') == "none"){
						$(".pbody").hide();
						$(this).parent().children(".pbody").show();
					}else{
						$(".pbody").hide();
					}
				});
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
			}
		}
		// METODOS PUBLICOS
		this.PUB = {
			load_data: function(a){
				//CARGAMOS LA FICHA DE DATOS
				settings.ficha_datos.empty();
				if(a.REGION != ""){
					settings.ficha_datos.append(PRIV.make_row({
						titulo: "REGI&Oacute;N",
						content: a.TREGION
					}));
				}
				if(a.TPROVINCIA != ""){
					settings.ficha_datos.append(PRIV.make_row({
						titulo: "PROVINCIA",
						content: a.TPROVINCIA
					}));
				}
				if(a.TCOMUNA != ""){
					var comuna = a.TCOMUNA;
					settings.ficha_datos.append(PRIV.make_row_height_extend({
						titulo: "COMUNA",
						content: comuna
					}));
					/*if(typeof b != "undefined"){
						var comunas = "";
						for(i=0;i<b.length;i++){
							if(i != 0) comunas += ", ";
							comunas += b[i];
						}
						comuna = comunas;
						settings.ficha_datos.append(PRIV.make_row_height_extend({
							titulo: "COMUNA",
							content: comuna
						}));
					}
					else
					{
						
					}*/
				}
				if(a.CLASIFICACION != ""){
					settings.ficha_datos.append(PRIV.make_row({
						titulo: "CLASIFICACI&Oacute;N",
						content: a.CLASIFICACION
					}));
				}
				/*
				if(a.AVANCE_FIN >= 0){
					settings.ficha_datos.append(PRIV.make_row({
						titulo: "AVANCE FINANCIERO",
						content: a.AVANCE_FIN+" %"
					}));
				}
				if(a.AVANCE_FIS >= 0){
					settings.ficha_datos.append(PRIV.make_row({
						titulo: "AVANCE FISICO",
						content: a.AVANCE_FIS+" %"
					}));
				} */
				if(a.FECHA_INI !== undefined){
					var fecha_real_inicio= (typeof a.F_INI_AVANCE != "undefined")? new Date(a.F_INI_AVANCE.replace(/-/g,"/")):null;
					var fecha_est_inicio = (typeof a.FECHA_INI != "undefined")? new Date(a.FECHA_INI.replace(/-/g,"/")):null;
					var dateobra = (fecha_real_inicio != null)? dateobra=fecha_real_inicio:dateobra=fecha_est_inicio;
					var dia = dateobra.getDate();
					var mes = dateobra.getMonth()+1;
					settings.ficha_datos.append(PRIV.make_row({
						titulo: "FECHA DE INICIO",
						content: (!isNaN(dateobra.getDate()) && !isNaN(dateobra.getMonth()) && !isNaN(dateobra.getFullYear()))? (dia<10 ? '0' : '') + dia +"/"+ (mes<10 ? '0' : '') + mes+"/"+dateobra.getFullYear(): "No registra"
					}));
				}
				if(a.FECHA_FIN !== undefined){
					var fecha_real_fin = (typeof a.F_TER_AVANCE != "undefined")? new Date(a.F_TER_AVANCE.replace(/-/g,"/")):null;
					var fecha_est_fin = (typeof a.FECHA_FIN != "undefined")? new Date(a.FECHA_FIN.replace(/-/g,"/")):null;
					var dateobra = (fecha_real_fin != null)? dateobra=fecha_real_fin:dateobra=fecha_est_fin;
					var dia = dateobra.getDate();
					var mes = dateobra.getMonth()+1;
					settings.ficha_datos.append(PRIV.make_row({
						titulo: "FECHA DE T&Eacute;RMINO",
						content: (!isNaN(dateobra.getDate()) && !isNaN(dateobra.getMonth()) && !isNaN(dateobra.getFullYear()))? (dia<10 ? '0' : '') + dia +"/"+ (mes<10 ? '0' : '') + mes+"/"+dateobra.getFullYear(): "No registra"
					}));
				}				
/*
					var dateobra = new Date(a.FECHA_FIN);
					var dia = (dateobra.getDate().toString().length < 2)? "0"+dateobra.getDate().toString(): dateobra.getDate().toString();
					var mes = (dateobra.getMonth().toString().length < 2)? "0"+(dateobra.getMonth()+1).toString(): (dateobra.getMonth().toString()+1);
					if(mes=="010"){mes="10"} else if (mes=="111"){mes="11"} else if (mes=="112"){mes="12"}
					settings.ficha_datos.append(PRIV.make_row({
						titulo: "FECHA DE T&Eacute;RMINO",
						content: (!isNaN(dateobra.getDate()) && !isNaN(dateobra.getMonth()) && !isNaN(dateobra.getFullYear()))? dia+"/"+mes+"/"+dateobra.getFullYear(): "No registra"
					}));
				}
*/
				if(a.PLAZO_EJE >=0){
					settings.ficha_datos.append(PRIV.make_row({
						titulo: "PLAZO DE EJECUCI&Oacute;N",
						content: a.PLAZO_EJE + " " + a.UNIDAD_EJE
					}));
				}
				//DESCRIPCION
				settings.ficha_descripcion.empty();
				if(a.DESCRIPCION != "Sin Descripci&oacute;n"){
					a.DESCRIPCION = a.DESCRIPCION.replace('á', '&aacute;');
					a.DESCRIPCION = a.DESCRIPCION.replace('é', '&eacute;');
					a.DESCRIPCION = a.DESCRIPCION.replace('í', '&iacute;');
					a.DESCRIPCION = a.DESCRIPCION.replace('ó', '&oacute;');
					a.DESCRIPCION = a.DESCRIPCION.replace('ú', '&uacute;');
					settings.ficha_descripcion.append(PRIV.make_row_extend({
						content: a.DESCRIPCION
					}));
				}
				// DETALLE DE LA OBRA
				settings.ficha_detalle.empty();
				if(a.ID_MERCADO_PUB != "No Existe Registro"){
					settings.ficha_detalle.append(PRIV.make_row({
						titulo: "C&Oacute;DIGO MERCADO P&Uacute;BLICO",
						content: a.ID_MERCADO_PUB
					}));
				}
				if(a.CODIGO_BIP != "No Existe Registro"){
					settings.ficha_detalle.append(PRIV.make_row({
						titulo: "C&Oacute;DIGO BIP",
						content: a.CODIGO_BIP
					}));
				}
				if(a.CODIGO_INI != "No Existe Registro"){
					settings.ficha_detalle.append(PRIV.make_row({
						titulo: "C&Oacute;DIGO INI",
						content: a.CODIGO_INI
					}));
				}
				if(a.TIPO_FIN != "No Existe Registro"){
					settings.ficha_detalle.append(PRIV.make_row({
						titulo: "TIPO DE FINANCIAMIENTO",
						content: a.TIPO_FIN
					}));
				}
				if(a.PROC_CONTRATACION != "NN"){
					if(a.PROC_CONTRATACION == "PR") a.PROC_CONTRATACION = "Propuesta privada.";
					if(a.PROC_CONTRATACION == "PU") a.PROC_CONTRATACION = "Propuesta p&uacute;blica.";
					if(a.PROC_CONTRATACION == "TD") a.PROC_CONTRATACION = "Trato directo.";
					if(a.PROC_CONTRATACION == "UN") a.PROC_CONTRATACION = "Precio Unitario.";
					settings.ficha_detalle.append(PRIV.make_row({
						titulo: "PROCEDIMIENTO DE CONTRATACI&Oacute;N",
						content: a.PROC_CONTRATACION
					}));
				}
				if(a.MONTO_CONTRATADO > 0){
					settings.ficha_detalle.append(PRIV.make_row({
						titulo: "MONTO CONTRATADO INICIAL",
						content: PRIV.number_format(a.MONTO_CONTRATADO,0,".","")
					}));
				}
				if(a.SERV_CONTR != "No Existe Registro"){
					settings.ficha_detalle.append(PRIV.make_row({
						titulo: "SERVICIO CONTRATANTE",
						content: (a.SERV_CONTR.length > 30)? a.SERV_CONTR.substring(0,27)+"...":a.SERV_CONTR
					}));
				}
				if(a.SERV_MAND != "No Existe Registro"){
					settings.ficha_detalle.append(PRIV.make_row({
						titulo: "SERVICIO MANDANTE",
						content: (a.SERV_MAND.length > 30)? a.SERV_MAND.substring(0,27)+"...":a.SERV_MAND
					}));
				}
				// CONTROL DE LA OBRA 
				settings.ficha_control.empty();
				if(a.RUN_INSP_FIS != "No Existe Registro"){
					settings.ficha_control.append(PRIV.make_row({
						titulo: "INSPECTOR FISCAL",
						content: (a.NOMBRE_INSP_FIS != "No Existe Registro")?(a.NOMBRE_INSP_FIS+" "+a.APELLIDO_P_INSP_FIS+" "+a.APELLIDO_M_INSP_FIS):"No Existe Registro"
					}));
					settings.ficha_control.append(PRIV.make_row({
						titulo: "RUN",
						content: a.RUN_INSP_FIS
					}));
				}
				// CONTRATISTA
				var contra_name;
				var contra_rut;
				if(a.NOMBRE_CONTRATIS == "No Existe Registro" && a.APELLIDOS_CONTRATIS == "No Existe Registro"){
					if(a.NOMBRE_CONSORCIO == "No Existe Registro" && a.APELLIDOS_CONSORCIO == "No Existe Registro"){
						contra_name = "No Existe Registro";
					}
					else
					{
						contra_name = (a.NOMBRE_CONSORCIO != "No Existe Registro")?a.NOMBRE_CONSORCIO:"";
						contra_name += (a.APELLIDOS_CONSORCIO != "No Existe Registro")?" "+a.APELLIDOS_CONSORCIO:"";
					}
				}
				else
				{
					contra_name = (a.NOMBRE_CONTRATIS != "No Existe Registro")?a.NOMBRE_CONTRATIS:"";
					contra_name += (a.APELLIDOS_CONTRATIS != "No Existe Registro")?" "+a.APELLIDOS_CONTRATIS:"";
				}
				if(a.RUT_CONTRATIS == "No Existe Registro"){
					if(a.RUT_CONS == "No Existe Registro"){
						contra_rut = a.RUT_CONS;
					}
					else{
						contra_rut = "No Existe Registro";
					}
				}
				else
				{
					contra_rut = a.RUT_CONTRATIS;
				}
				settings.ficha_contratista.empty();
				if(contra_rut != "No Existe Registro"){
					settings.ficha_contratista.append(PRIV.make_row({
						titulo: "NOMBRE/RAZ&Oacute;N SOCIAL",
						content: contra_name
					}));
					settings.ficha_contratista.append(PRIV.make_row({
						titulo: "RUT/RUN",
						content: contra_rut
					}));
				}
				//MOSTRAMOS LOS DATOS
				PRIV.reset();
			},
			clear_all: function(){
				$(".pbody").hide();
				settings.ficha_datos.empty();
				settings.ficha_contratista.empty();
				settings.ficha_control.empty();
				settings.ficha_detalle.empty();
				GEA.PUB.set_nobra();
			},
			select: function(){
				$(".tabpanel div").removeClass("borderdiv");
				$(".tabficha div").addClass("borderdiv");
				$(".panel-item").hide();
				$("#ficha").show();
			}
		}
		_CONSTRUCT(args);
	};
})()