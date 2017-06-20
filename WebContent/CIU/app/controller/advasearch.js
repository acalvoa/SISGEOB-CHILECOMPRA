(function(){
	ADVASEARCH = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
			cache: {},
			fields: []
		}
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			$("#fromdate").datepicker();
			$("#todate").datepicker();
			PRIV.set_clasifica();
			PRIV.filtro();
			PRIV.set_point_separator();
			PRIV.load_html_tricks();
		}
		// DEFINIMOS LOS EMTODOS PRIVADOS
		var PRIV = {
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
			},
			set_clasifica: function(){
				$("#clasif").append(new Option("Seleccione clasificación de la obra", -1));
				SOCKET.request({
					request: "clasificacion/getClasificacion",
					data:{
					},
					callback:function(response){
						$.each(response, function(key,value){
							$("#clasif").append(new Option(value.NOMBRE, value.NOMBRE));
						});
					},
					buffered: true
				});
			},
			load_html_tricks: function(){
				$("#advasearch .servtxt input").autocomplete({
					dataAction: function(e,request,response,cache){
						if(request in cache) {
				          	response(cache[request]);
				          return;
				        }
				        SOCKET.request({
							request: "utils/getServicios", 
							data:{
								SERVICIO: request
							},
							callback:function(result){
				          		response(result,request);
							}
						});
					},
					minLength:3
				});
			},
			filtro: function(){
				$("#ordenarinput").on('change',function(e){
					if($(this).val() == "valor"){
						self.PUB.filtro_monto();
					}
					else if($(this).val() == "nombre"){
						self.PUB.filtro_name();
					}
					else if($(this).val() == "fecha"){
						self.PUB.filtro_fecha();
					}

				})
			},
			set_result: function(num){
				$("#resultados-adva").html("<b>RESULTADOS</b><br>("+num+" coincidencias)");
			},
			add_row: function(num, name, amount){
				var fila = $("<tr></tr>").appendTo($("#advase-result"));
				$("<td></td>").appendTo(fila).html(num);
				$("<td></td>").appendTo(fila).html((name.length > 30)?name.substring(0,27)+"...":name);
				$("<td></td>").appendTo(fila).html(PRIV.number_format(amount,0,".",""));
				return fila;
			},
			set_point_separator: function(){
				$("#advasearch #valores #fromamount").on('keyup',function(){
					$(this).val(PRIV.number_format($(this).val(), 0, "", "."));
				});
				$("#advasearch #valores #toamount").on('keyup',function(){
					$(this).val(PRIV.number_format($(this).val(), 0, "", "."));
				});
			}
		}
		// DEFINIMOS LOS EMTODOS PUBLICOS 
		this.PUB = {
			get: function(){
				return SETTINGS.fields;
			},
			postSearch: function(e){
				$(".tabpanel div").removeClass("borderdiv");
				$(e.currentTarget).addClass("borderdiv");
				$(".panel-item").hide();
				$("#advasearch").show();
			},
			search: function(){
				SETTINGS.fields = [];
				LOADING.show("Efectuando B&uacute;squeda, Espere por favor...");
				SOCKET.request({
					request: "obras/advasearch", 
					data:{
						SERV_CONTR: ($("#servtxtinput").val() !== "")?$("#servtxtinput").val(): "NSET",
						CLASIFICACION: ($("#clasif").val() !== "-1")?$("#clasif").val(): "NSET",
						DESCRIPCION: ($("#destxtinput").val() !== "")?$("#destxtinput").val(): "NSET",
						MINAMOUNT: ($("#fromamount").val() !== "")?PRIV.number_format($("#fromamount").val(), 0, "", ""): "NSET",
						MAXAMOUNT: ($("#toamount").val() !== "")?PRIV.number_format($("#toamount").val(), 0, "", ""): "NSET",
						MINDATE: ($("#fromdate").val() !== "")?$("#fromdate").val(): "NSET",
						MAXDATE: ($("#todate").val() !== "")?$("#todate").val(): "NSET",
						MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
						MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"   
					},
					callback:function(result){
						var fecha_ini = $("#fromdate").val();
						var fecha_fin = $("#todate").val();
						var monto_ini = $("#fromamount").val();
						var monto_fin = $("#toamount").val();
						var monto_total = 0;
						var resultados = 0; 
						$.each(result,function(key,value){
							monto_total += value.MONTO_CONTRATADO;
							resultados++;
							SETTINGS.fields.push([value.TITULO, value.MONTO_CONTRATADO, value.FECHA_INI, value]);
						});
						$("#resultados-adva-monto .numero").html("$"+PRIV.number_format(monto_total.toString(),0,"","."));
						$("#resultados-adva-numero .numero").html(resultados);
						$('.result-tab').show();
						LOADING.hide();
					}
				});
			},
			filtro_monto: function(){
				$("#advase-result").empty();
				SETTINGS.fields.sort(function(a, b) {return a[1] - b[1]});
				$.each(SETTINGS.fields, function(key,value){
					var fila = PRIV.add_row((key+1),value[0], value[1]);
					var elemento = value[3];
					fila.on('click',function(){
						LOADING.show("Cargando Cartograf&iacute;a y Puntos, Espere por favor...");
						SOCKET.request({
							request: "regiones/getOne", 
							data:{
								REGION: elemento.REGION,
								MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
								MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
							},
							callback:function(result){
								SOCKET.request({
									request: "comuna/getOne", 
									data:{
										COMUNA: elemento.COMUNA,
										COMUNAS: elemento.REGION,
										MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
										MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
									},
									callback:function(result2){
										SOCKET.request({
											request: "obras/getOne", 
											data:{
												COD: elemento.CODPROYECTO,
												COMUNA: elemento.COMUNA
											},
											callback:function(result3){
												var elem = {
													'OBRAS':[result3],
													'COMUNA': result2.COMUNA,
													'REGION': result,
													'COMUNAS': result2.COMUNAS
												}
												$.clearBox();
												GEA.PUB.search(elem);
												LOADING.hide();
											}
										});
									}
								});
							}
						});
					});
				});
			},
			filtro_name: function(){
				$("#advase-result").empty();
				SETTINGS.fields.sort(function(a, b) {return a[0].toUpperCase().charCodeAt(0) - b[0].toUpperCase().charCodeAt(0)});
				$.each(SETTINGS.fields, function(key,value){
					var fila = PRIV.add_row((key+1),value[0], value[1]);
					var elemento = value[3];
					fila.on('click',function(){
						LOADING.show("Cargando Cartograf&iacute;a y Puntos, Espere por favor...");
						SOCKET.request({
							request: "regiones/getOne", 
							data:{
								REGION: elemento.REGION,
								MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
								MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
							},
							callback:function(result){
								SOCKET.request({
									request: "comuna/getOne", 
									data:{
										COMUNA: elemento.COMUNA,
										COMUNAS: elemento.REGION
									},
									callback:function(result2){
										SOCKET.request({
											request: "obras/getOne", 
											data:{
												COD: elemento.CODPROYECTO,
												COMUNA: elemento.COMUNA
											},
											callback:function(result3){
												var elem = {
													'OBRAS':[result3],
													'COMUNA': result2.COMUNA,
													'REGION': result,
													'COMUNAS': result2.COMUNAS
												}
												$.clearBox();
												GEA.PUB.search(elem);
												LOADING.hide();
											}
										});
									}
								});
							}
						});
					});
				});
			},
			filtro_fecha: function(){
				$("#advase-result").empty();
				SETTINGS.fields.sort(function(a, b) {return new Date(a[2]) - new Date(b[2])});
				$.each(SETTINGS.fields, function(key,value){
					var fila = PRIV.add_row((key+1),value[0], value[1]);
					var elemento = value[3];
					fila.on('click',function(){
						LOADING.show("Cargando Cartograf&iacute;a y Puntos, Espere por favor...");
						SOCKET.request({
							request: "regiones/getOne", 
							data:{
								REGION: elemento.REGION,
								MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
								MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
							},
							callback:function(result){
								SOCKET.request({
									request: "comuna/getOne", 
									data:{
										COMUNA: elemento.COMUNA,
										COMUNAS: elemento.REGION
									},
									callback:function(result2){
										SOCKET.request({
											request: "obras/getOne", 
											data:{
												COD: elemento.CODPROYECTO,
												COMUNA: elemento.COMUNA
											},
											callback:function(result3){
												var elem = {
													'OBRAS':[result3],
													'COMUNA': result2.COMUNA,
													'REGION': result,
													'COMUNAS': result2.COMUNAS
												}
												$.clearBox();
												GEA.PUB.search(elem);
												LOADING.hide();
											}
										});
									}
								});
							}
						});
					});
				});
			}
		}
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		_CONSTRUCT(args);
	}
})();