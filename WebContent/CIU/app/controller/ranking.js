(function(){
	RANKING = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
			container: null,
			container_f: null,
			listado: null,
			aux_listado: null
		};
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			SETTINGS.container = args.container;
			SETTINGS.container_f = args.container_f;
			$("#th-nombre").on('mouseenter',function(e){
				POP.PUB.show({
					element: $(this),
					pos: "TOP",
					content: "Ordenar por Nombre",
					css: {
						width: "auto",
						height: "auto",
						"font-size": "0.7em",
						padding: "5px"
					}
				});
			}).on('mouseleave',function(){
				POP.PUB.hide();
			});
			$("#th-fecha").on('mouseenter',function(e){
				POP.PUB.show({
					element: $(this),
					pos: "TOP",
					content: "Ordenar por Fecha",
					css: {
						width: "auto",
						height: "auto",
						"font-size": "0.7em",
						padding: "5px"
					}
				});
			}).on('mouseleave',function(){
				POP.PUB.hide();
			});
		};
		// DEFINIMOS LOS EMTODOS PRIVADOS
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
			}
		};
		// DEFINIMOS LOS METODOS PUBLICOS
		this.PUB = {
			set: function(LISTADO){
				SETTINGS.listado = [];
				$.each(LISTADO, function(key,value){
					SETTINGS.listado.push([value.NOMBRE, value.MONTO, value.FECHA_INI, value])
				});
				$("#ranking .listado_obras").show();
				$("#ranking #erasesearch").hide();
				$("#advasearch #destxtinput").val('');
				$("#advasearch #servtxtinput").val('');
				$("#advasearch #clasif").val(-1)
				$("#advasearch #fromamount").val('');
				$("#advasearch #toamount").val('');
				$("#advasearch #fromdate").val('');
				$("#advasearch #todate").val('');
				$('.result-tab').hide();
				self.PUB.inversion();
			},
			set_search: function(LISTADO){
				SETTINGS.aux_listado = SETTINGS.listado;
				SETTINGS.listado = [];
				$.each(LISTADO, function(key,value){
					SETTINGS.listado.push([value[0], value[1], value[2], value[3]])
				});
				$("#ranking .listado_obras").hide();
				$("#ranking #erasesearch").show();
				self.PUB.inversion();
			},
			clear_search: function(){
				SETTINGS.listado = SETTINGS.aux_listado;
				SETTINGS.aux_listado = [];
				$("#ranking .listado_obras").show();
				$("#ranking #erasesearch").hide();
				$("#advasearch #destxtinput").val('');
				$("#advasearch #servtxtinput").val('');
				$("#advasearch #clasif").val(-1)
				$("#advasearch #fromamount").val('');
				$("#advasearch #toamount").val('');
				$("#advasearch #fromdate").val('');
				$("#advasearch #todate").val('');
				$('.result-tab').hide();
				self.PUB.inversion();
			},
			inversion_T: function(){
				
				SETTINGS.container.children('tbody').empty();
				var i = 1;
				$.each(SETTINGS.listado, function(key,value){
					var fila = $("<tr></tr>").appendTo(SETTINGS.container.children('tbody'));
					var ele = value[3];
					if(ele.MULTIDPA == 1) fila.addClass('multidpa');
					if((i++%2) == 0) fila.addClass('d2');
					$('<td></td>').html(value[0].substring(0,27)+"...").attr("data",value[0]).appendTo(fila);
					fila.on('mouseenter',function(e){
						var div = $("<div></div>").addClass('popranking');
						$('<div class="titulo"></div>').appendTo(div).html(value[0]);
						var stats = $('<div class="stats"></div>').appendTo(div);
						$('<div class="lheader">Ubicación en mas de una:</div>').appendTo(stats);
						if(parseInt(value[3].MULTIREG) > 1){ $('<div class="mregion">R</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mregion">R</div>').appendTo(stats); }
						if(parseInt(value[3].MULTIPROV) > 1){ $('<div class="mprovincia">P</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mprovincia">P</div>').appendTo(stats); }
						if(parseInt(value[3].MULTICOM) > 1){ $('<div class="mcomuna">C</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mcomuna">C</div>').appendTo(stats); }
						POP.PUB.show({
							element: $(this),
							pos: "TOP",
							divcontent: div,
							css: {
								width: "auto",
								height: "auto",
								"min-height": "85px",
								"font-size": "0.7em",
								padding: "5px"
							}
						});
					}).on('mouseleave',function(){
						POP.PUB.hide();
					}).on('click', function(){
						LOADING.show("Cargando Cartograf&iacute;a y Puntos, Espere por favor...");
						SOCKET.request({
							request: "regiones/getOne", 
							data:{
								REGION: ele.REGION
							},
							callback:function(result){
								SOCKET.request({
									request: "comuna/getOne", 
									data:{
										COMUNA: ele.COMUNA,
										COMUNAS: ele.REGION
									},
									callback:function(result2){
										SOCKET.request({
											request: "obras/getOne", 
											data:{
												COD: ele.CODPROYECTO,
												COMUNA: ele.COMUNA
											},
											callback:function(result3){
												var elem = {
													'OBRAS': [result3],
													'COMUNA': result2.COMUNA,
													'REGION': result,
													'COMUNAS': result2.COMUNAS
												}
												$.clearBox();
												GEA.PUB.search(elem,true,false);
												LOADING.hide();
											}
										});
									}
								});
							}
						});
					});
					$('<td></td>').html("$ "+PRIV.number_format(value[1],0,".","")).appendTo(fila);
				});
			},
			inversion: function(){
				$("#ranking-table .fecha").removeClass('activo').html('Fecha <i class="fa fa-sort">');
				$("#ranking-table .monto").addClass('activo').html('Monto <i class="fa fa-sort-asc">');
				SETTINGS.container.children('tbody').empty();
				var i = 1;
				SETTINGS.listado.sort(function(a, b) {return a[1] - b[1]});
				$.each(SETTINGS.listado, function(key,value){
					var fila = $("<tr></tr>").appendTo(SETTINGS.container.children('tbody'));
					var ele = value[3];
					if(ele.MULTIDPA == 1) fila.addClass('multidpa');
					if((i++%2) == 0) fila.addClass('d2');
					$('<td></td>').html(value[0].substring(0,27)+"...").attr("data",value[0]).appendTo(fila);
					fila.on('mouseenter',function(e){
						var div = $("<div></div>").addClass('popranking');
						$('<div class="titulo"></div>').appendTo(div).html(value[0]);
						var stats = $('<div class="stats"></div>').appendTo(div);
						$('<div class="lheader">Ubicación en mas de una:</div>').appendTo(stats);
						if(parseInt(value[3].MULTIREG) > 1){ $('<div class="mregion">R</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mregion">R</div>').appendTo(stats); }
						if(parseInt(value[3].MULTIPROV) > 1){ $('<div class="mprovincia">P</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mprovincia">P</div>').appendTo(stats); }
						if(parseInt(value[3].MULTICOM) > 1){ $('<div class="mcomuna">C</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mcomuna">C</div>').appendTo(stats); }
						POP.PUB.show({
							element: $(this),
							pos: "TOP",
							divcontent: div,
							css: {
								width: "auto",
								height: "auto",
								"min-height": "85px",
								"font-size": "0.7em",
								padding: "5px"
							}
						});
					}).on('mouseleave',function(){
						POP.PUB.hide();
					}).on('click', function(){
						LOADING.show("Cargando Cartograf&iacute;a y Puntos, Espere por favor...");
						SOCKET.request({
							request: "regiones/getOne", 
							data:{
								REGION: ele.REGION,
								MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
								MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
							},
							callback:function(result){
								SOCKET.request({
									request: "comuna/getOne", 
									data:{
										COMUNA: ele.COMUNA,
										COMUNAS: ele.REGION,
										MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
										MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
									},
									callback:function(result2){
										SOCKET.request({
											request: "obras/getOne", 
											data:{
												COD: ele.CODPROYECTO,
												COMUNA: ele.COMUNA
											},
											callback:function(result3){
												var elem = {
													'OBRAS': [result3],
													'COMUNA': result2.COMUNA,
													'REGION': result,
													'COMUNAS': result2.COMUNAS
												};
												$.clearBox();
												GEA.PUB.search(elem,true,false);
												LOADING.hide();
											}
										});
									}
								});
							}
						});
					});
					$('<td></td>').html("$"+PRIV.number_format(value[1],0,"",".")).appendTo(fila);
				});
			},
			inversion_inverso: function(){
				$("#ranking-table .fecha").removeClass('activo').html('Fecha <i class="fa fa-sort">');
				$("#ranking-table .monto").addClass('activo').html('Monto <i class="fa fa-sort-desc">');
				SETTINGS.container.children('tbody').empty();
				var i = 1;
				SETTINGS.listado.sort(function(a, b) {return b[1] - a[1]});
				$.each(SETTINGS.listado, function(key,value){
					var fila = $("<tr></tr>").appendTo(SETTINGS.container.children('tbody'));
					var ele = value[3];
					if(ele.MULTIDPA == 1) fila.addClass('multidpa');
					if((i++%2) == 0) fila.addClass('d2');
					$('<td></td>').html(value[0].substring(0,27)+"...").attr("data",value[0]).appendTo(fila);
					fila.on('mouseenter',function(e){
						var div = $("<div></div>").addClass('popranking');
						$('<div class="titulo"></div>').appendTo(div).html(value[0]);
						var stats = $('<div class="stats"></div>').appendTo(div);
						$('<div class="lheader">Ubicación en mas de una:</div>').appendTo(stats);
						if(parseInt(value[3].MULTIREG) > 1){ $('<div class="mregion">R</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mregion">R</div>').appendTo(stats); }
						if(parseInt(value[3].MULTIPROV) > 1){ $('<div class="mprovincia">P</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mprovincia">P</div>').appendTo(stats); }
						if(parseInt(value[3].MULTICOM) > 1){ $('<div class="mcomuna">C</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mcomuna">C</div>').appendTo(stats); }
						POP.PUB.show({
							element: $(this),
							pos: "TOP",
							divcontent: div,
							css: {
								width: "auto",
								height: "auto",
								"min-height": "85px",
								"font-size": "0.7em",
								padding: "5px"
							}
						});
					}).on('mouseleave',function(){
						POP.PUB.hide();
					}).on('click', function(){
						LOADING.show("Cargando Cartograf&iacute;a y Puntos, Espere por favor...");
						SOCKET.request({
							request: "regiones/getOne", 
							data:{
								REGION: ele.REGION
							},
							callback:function(result){
								SOCKET.request({
									request: "comuna/getOne", 
									data:{
										COMUNA: ele.COMUNA,
										COMUNAS: ele.REGION
									},
									callback:function(result2){
										SOCKET.request({
											request: "obras/getOne", 
											data:{
												COD: ele.CODPROYECTO,
												COMUNA: ele.COMUNA
											},
											callback:function(result3){
												var elem = {
													'OBRAS': [result3],
													'COMUNA': result2.COMUNA,
													'REGION': result,
													'COMUNAS': result2.COMUNAS
												}
												$.clearBox();
												GEA.PUB.search(elem,true,false);
												LOADING.hide();
											}
										});
									}
								});
							}
						});
					});
					$('<td></td>').html("$"+PRIV.number_format(value[1],0,"",".")).appendTo(fila);
				});
			},
			nombre_inverso: function(){
				SETTINGS.container_f.children('tbody').empty();
				var i = 1;
				SETTINGS.listado.sort(function(a, b) {return b[0].toUpperCase().charCodeAt(0) - a[0].toUpperCase().charCodeAt(0)});
				$.each(SETTINGS.listado, function(key,value){
					var fila = $("<tr></tr>").appendTo(SETTINGS.container_f.children('tbody'));
					var ele = value[3];
					if(ele.MULTIDPA == 1) fila.addClass('multidpa');
					if((i++%2) == 0) fila.addClass('d2');
					$('<td></td>').html(i++).appendTo(fila);
					$('<td></td>').html(value[0].substring(0,27)+"...").attr("data",value[0]).appendTo(fila);
					fila.on('mouseenter',function(e){
						POP.PUB.show({
							element: $(this),
							pos: "TOP",
							content: $(this).attr("data"),
							css: {
								width: "auto",
								height: "auto",
								"font-size": "0.7em",
								padding: "5px"
							}
						});
					}).on('mouseleave',function(){
						POP.PUB.hide();
					}).on('click', function(){
						LOADING.show("Cargando Cartograf&iacute;a y Puntos, Espere por favor...");
						SOCKET.request({
							request: "regiones/getOne", 
							data:{
								REGION: ele.REGION
							},
							callback:function(result){
								SOCKET.request({
									request: "comuna/getOne", 
									data:{
										COMUNA: ele.COMUNA,
										COMUNAS: ele.REGION
									},
									callback:function(result2){
										SOCKET.request({
											request: "obras/getOne", 
											data:{
												COD: ele.CODPROYECTO,
												COMUNA: ele.COMUNA
											},
											callback:function(result3){
												var elem = {
													'OBRAS': [result3],
													'COMUNA': result2.COMUNA,
													'REGION': result,
													'COMUNAS': result2.COMUNAS
												}
												$.clearBox();
												GEA.PUB.search(elem,true,false);
												LOADING.hide();
											}
										});
									}
								});
							}
						});
					});
					$('<td></td>').html(value[2]).appendTo(fila);
				});
			},
			fecha: function(){
				$("#ranking-table .monto").removeClass('activo').html('Monto <i class="fa fa-sort">');
				$("#ranking-table .fecha").addClass('activo').html('Fecha <i class="fa fa-sort-asc"></i>');
				SETTINGS.container.children('tbody').empty();
				var i = 1;
				SETTINGS.listado.sort(function(a, b) {
					var ad = new Date(a[2]);
					var bd = new Date(b[2]);
					return ad.getTime() - bd.getTime();
				});
				$.each(SETTINGS.listado, function(key,value){
					var fila = $("<tr></tr>").appendTo(SETTINGS.container.children('tbody'));
					var ele = value[3];
					if(ele.MULTIDPA == 1) fila.addClass('multidpa');
					if((i++%2) == 0) fila.addClass('d2');
					$('<td></td>').html(value[0].substring(0,27)+"...").attr("data",value[0]).appendTo(fila);
					fila.on('mouseenter',function(e){
						var div = $("<div></div>").addClass('popranking');
						$('<div class="titulo"></div>').appendTo(div).html(value[0]);
						var stats = $('<div class="stats"></div>').appendTo(div);
						$('<div class="lheader">Ubicación en mas de una:</div>').appendTo(stats);
						if(parseInt(value[3].MULTIREG) > 1){ $('<div class="mregion">R</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mregion">R</div>').appendTo(stats); }
						if(parseInt(value[3].MULTIPROV) > 1){ $('<div class="mprovincia">P</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mprovincia">P</div>').appendTo(stats); }
						if(parseInt(value[3].MULTICOM) > 1){ $('<div class="mcomuna">C</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mcomuna">C</div>').appendTo(stats); }
						POP.PUB.show({
							element: $(this),
							pos: "TOP",
							divcontent: div,
							css: {
								width: "auto",
								height: "auto",
								"min-height": "85px",
								"font-size": "0.7em",
								padding: "5px"
							}
						});
					}).on('mouseleave',function(){
						POP.PUB.hide();
					}).on('click', function(){
						LOADING.show("Cargando Cartograf&iacute;a y Puntos, Espere por favor...");
						SOCKET.request({
							request: "regiones/getOne", 
							data:{
								REGION: ele.REGION
							},
							callback:function(result){
								SOCKET.request({
									request: "comuna/getOne", 
									data:{
										COMUNA: ele.COMUNA,
										COMUNAS: ele.REGION
									},
									callback:function(result2){
										SOCKET.request({
											request: "obras/getOne", 
											data:{
												COD: ele.CODPROYECTO,
												COMUNA: ele.COMUNA
											},
											callback:function(result3){
												var elem = {
													'OBRAS': [result3],
													'COMUNA': result2.COMUNA,
													'REGION': result,
													'COMUNAS': result2.COMUNAS
												}
												$.clearBox();
												GEA.PUB.search(elem,true,false);
												LOADING.hide();
											}
										});
									}
								});
							}
						});
					});
					$('<td></td>').html(value[2]).appendTo(fila);
				});
			},
			fecha_inverso: function(){
				$("#ranking-table .monto").removeClass('activo').html('Monto <i class="fa fa-sort">');
				$("#ranking-table .fecha").addClass('activo').html('Fecha <i class="fa fa-sort-desc">');
				SETTINGS.container.children('tbody').empty();
				var i = 1;
				SETTINGS.listado.sort(function(a, b) {
					var ad = new Date(a[2]);
					var bd = new Date(b[2]);
					return bd.getTime() - ad.getTime();
				});
				$.each(SETTINGS.listado, function(key,value){
					var fila = $("<tr></tr>").appendTo(SETTINGS.container.children('tbody'));
					var ele = value[3];
					if(ele.MULTIDPA == 1) fila.addClass('multidpa');
					if((i++%2) == 0) fila.addClass('d2');
					$('<td></td>').html(value[0].substring(0,27)+"...").attr("data",value[0]).appendTo(fila);
					fila.on('mouseenter',function(e){
						var div = $("<div></div>").addClass('popranking');
						$('<div class="titulo"></div>').appendTo(div).html(value[0]);
						var stats = $('<div class="stats"></div>').appendTo(div);
						$('<div class="lheader">Ubicación en mas de una:</div>').appendTo(stats);
						if(parseInt(value[3].MULTIREG) > 1){ $('<div class="mregion">R</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mregion">R</div>').appendTo(stats); }
						if(parseInt(value[3].MULTIPROV) > 1){ $('<div class="mprovincia">P</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mprovincia">P</div>').appendTo(stats); }
						if(parseInt(value[3].MULTICOM) > 1){ $('<div class="mcomuna">C</div>').css({
							"background":"#00A8E2",
							"color": "#FFF",
							"border": "none"
						}).appendTo(stats); } else { $('<div class="mcomuna">C</div>').appendTo(stats); }
						POP.PUB.show({
							element: $(this),
							pos: "TOP",
							divcontent: div,
							css: {
								width: "auto",
								height: "auto",
								"min-height": "85px",
								"font-size": "0.7em",
								padding: "5px"
							}
						});
					}).on('mouseleave',function(){
						POP.PUB.hide();
					}).on('click', function(){
						LOADING.show("Cargando Cartograf&iacute;a y Puntos, Espere por favor...");
						SOCKET.request({
							request: "regiones/getOne", 
							data:{
								REGION: ele.REGION
							},
							callback:function(result){
								SOCKET.request({
									request: "comuna/getOne", 
									data:{
										COMUNA: ele.COMUNA,
										COMUNAS: ele.REGION
									},
									callback:function(result2){
										SOCKET.request({
											request: "obras/getOne", 
											data:{
												COD: ele.CODPROYECTO,
												COMUNA: ele.COMUNA
											},
											callback:function(result3){
												var elem = {
													'OBRAS': [result3],
													'COMUNA': result2.COMUNA,
													'REGION': result,
													'COMUNAS': result2.COMUNAS
												}
												$.clearBox();
												GEA.PUB.search(elem,true, false);
												LOADING.hide();
											}
										});
									}
								});
							}
						});
					});
					$('<td></td>').html(value[2]).appendTo(fila);
				});
			}
		};
		// LLAMAOS AL CONSTRUCTOR
		_CONSTRUCT(args);
	}
})();