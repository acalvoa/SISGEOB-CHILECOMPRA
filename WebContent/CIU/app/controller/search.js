(function() {
	SEARCH = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
			cache: {}
		}
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			PRIV.autocomplete();
			PRIV.botoneras();
		}
		// DEFINIMOS LOS EMTODOS PRIVADOS
		var PRIV = {
			autocomplete: function(){
				$("#comunatext").autocomplete({
					dataAction: function(e,request,response,cache){
						if(request in cache) {
				          	response(cache[request]);
				          return;
				        }
				        SOCKET.request({
							request: "comuna/getautocomplete", 
							data:{
								SEARCH: request
							},
							callback:function(result){
								var resultado = [];
								for(i=0;i<result.length;i++){
									resultado.push({
										label: result[i].value,
										data: result[i].value
									});
								}
				          		response(resultado,request);
							}
						});
					},
					minLength:3
				});
				$("#obratext").autocomplete({
					dataAction: function(e,request,response,cache){
						if(request in cache) {
				          	response(cache[request]);
				          return;
				        }
				        SOCKET.request({
							request: "obras/getautocomplete", 
							data:{
								SEARCH: request
							},
							callback:function(result){
								var coincidencias = {};
								for(i=0;i<result.length;i++){
									if(typeof coincidencias[result[i].label] == "undefined"){
										coincidencias[result[i].label] = result[i];
									}
								}
								var coin = $.map(coincidencias, function(value, index) {
								    return [value];
								});
								response(coin,request);
				          		//response(result,request);
							}
						});
					},
					minLength:5
				});
			    $("#idetext").autocomplete({
					dataAction: function(e,request,response,cache){
						if(request in cache) {
				          	response(cache[request]);
				          return;
				        }
						
				        SOCKET.request({
							request: "obras/getautocompletes", 
							data:{
								SEARCH: request
							},
							callback:function(result){
								var coincidencias = {};
								for(i=0;i<result.length;i++){
									if(typeof coincidencias[result[i].label] == "undefined"){
										coincidencias[result[i].label] = result[i];
									}
								}
								var coin = $.map(coincidencias, function(value, index) {
								    return [value];
								});
				          		response(coin,request);
							}
						});
					},
					minLength:3
				});    
			},
			botoneras: function(){
				$("#obrabtn").on('click', function(){
					LOADING.show("Efectuando b&uacute;squeda, 	Espere por favor...");
					$.clearBox();
					SOCKET.request({
						request: "obras/getObrasBuscador", 
						data:{
							SEARCH: $("#obratext").val(),
							MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
							MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
						},
						callback:function(result){

							if(result.STATUS == 1){
								//Se obtiene el periodo de fechas que comprenden las obras devueltas.
								/*var fechaFrom = new Date($("#fromdateHeader").val());
								fechaFrom = Date.parse(fechaFrom);*/
								//var fechaTo = Date.parse($("#todateHeader").val());
								/*var fechaTo = new Date($("#todateHeader").val());
								fechaTo = Date.parse(fechaTo);*/
								
								var fechaFromTmp = $("#fromdateHeader").val().split("/");
								// var fechaFrom = Date.parse(fechaFromTmp[2] + "-" + fechaFromTmp[1] + "-" + fechaFromTmp[0] + "T00:00:00.000Z");
								var fechaFrom = Date.parse(fechaFromTmp[2] + "/" + fechaFromTmp[1] + "/" + fechaFromTmp[0]);
								if(isNaN(fechaFrom)){
									fechaFrom = Date.parse($("#fromdateHeader").val());
								}
								var fechaToTmp = $("#todateHeader").val().split("/");
								// var fechaTo = Date.parse(fechaToTmp[2] + "-" + fechaToTmp[1] + "-" + fechaToTmp[0] + "T00:00:00.000Z");
								var fechaTo = Date.parse(fechaToTmp[2] + "/" + fechaToTmp[1] + "/" + fechaToTmp[0]);
								if(isNaN(fechaTo)){
									fechaTo = Date.parse($("#todateHeader").val());
								}
								
								var obrasFechaFROM = "";
								var obrasFechaTO = "";
								for(f=0;f<result.OBRAS.length;f++){
									if(obrasFechaFROM == ""){
										//obrasFechaFROM = Date.parse(result.OBRAS[f].FECHA);
										//if(isNaN(obrasFechaFROM)){
											var tmp = result.OBRAS[f].FECHA.replace(" 00:00:00", "");
											tmp = tmp.split("-");
											// obrasFechaFROM = Date.parse(tmp[0] + "-" + tmp[1] + "-" + tmp[2] + "T00:00:00.000Z");
											obrasFechaFROM = Date.parse(tmp[0] + "/" + tmp[1] + "/" + tmp[2]);
										//}	
										//obrasFechaTO = Date.parse(result.OBRAS[f].FECHA);
										//if(isNaN(obrasFechaTO)){
											//var tmp = result.OBRAS[f].FECHA.replace(" 00:00:00", "");
											//tmp = tmp.split("-");
											// obrasFechaTO = Date.parse(tmp[0] + "-" + tmp[1] + "-" + tmp[2] + "T00:00:00.000Z");
											obrasFechaTO = Date.parse(tmp[0] + "/" + tmp[1] + "/" + tmp[2]);
										//}	
									}else{
										if(Date.parse(result.OBRAS[f].FECHA) < obrasFechaFROM){
											//obrasFechaFROM = Date.parse(result.OBRAS[f].FECHA);
											//if(isNaN(obrasFechaFROM)){
												var tmp = result.OBRAS[f].FECHA.replace(" 00:00:00", "");
												tmp = tmp.split("-");
												// obrasFechaFROM = Date.parse(tmp[0] + "-" + tmp[1] + "-" + tmp[2] + "T00:00:00.000Z");
												obrasFechaFROM = Date.parse(tmp[0] + "/" + tmp[1] + "/" + tmp[2]);
											//}	
										}
										if(Date.parse(result.OBRAS[f].FECHA) > obrasFechaTO){
											//obrasFechaTO = Date.parse(result.OBRAS[f].FECHA);
											//if(isNaN(obrasFechaTO)){
												var tmp = result.OBRAS[f].FECHA.replace(" 00:00:00", "");
												tmp = tmp.split("-");
												// obrasFechaTO = Date.parse(tmp[0] + "-" + tmp[1] + "-" + tmp[2] + "T00:00:00.000Z");
												obrasFechaTO = Date.parse(tmp[0] + "/" + tmp[1] + "/" + tmp[2]);
											//}	
										}
									}
								}		
								var mostrarMensajeObraFueraRango = false;
								if(obrasFechaFROM < fechaFrom || obrasFechaTO > fechaTo){
									//Se cambia el periodo de fechas de la cabecera.
									var fromDate = new Date(obrasFechaFROM);
									var toDate = new Date(obrasFechaTO);
									$("#fromdateHeader").val(("0"+(fromDate.getDate())).slice(-2) + "/" + ("0"+(fromDate.getMonth()+1)).slice(-2) + "/" + fromDate.getFullYear());
									$("#todateHeader").val(("0"+(toDate.getDate())).slice(-2) + "/" + ("0"+(toDate.getMonth()+1)).slice(-2) + "/" + toDate.getFullYear());
									$("#alternateFrom").val(("0"+(fromDate.getDate())).slice(-2) + "/" + ("0"+(fromDate.getMonth()+1)).slice(-2) + "/" + fromDate.getFullYear());
									$("#alternateTo").val(("0"+(toDate.getDate())).slice(-2) + "/" + ("0"+(toDate.getMonth()+1)).slice(-2) + "/" + toDate.getFullYear());
									$("#alternateFromAS").val(("0"+(fromDate.getDate())).slice(-2) + "/" + ("0"+(fromDate.getMonth()+1)).slice(-2) + "/" + fromDate.getFullYear());
									$("#alternateToAS").val(("0"+(toDate.getDate())).slice(-2) + "/" + ("0"+(toDate.getMonth()+1)).slice(-2) + "/" + toDate.getFullYear());
									var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
									$("#alternateFromASValue").val(("0"+(fromDate.getDate())).slice(-2) + " " + meses[fromDate.getMonth()]+ " " + fromDate.getFullYear());
									$("#alternateFromValue").val(("0"+(fromDate.getDate())).slice(-2) + " " + meses[fromDate.getMonth()]+ " " + fromDate.getFullYear());
									$("#alternateToValue").val(("0"+(toDate.getDate())).slice(-2) + " " + meses[toDate.getMonth()]+ " " + toDate.getFullYear());
									$("#alternateToASValue").val(("0"+(toDate.getDate())).slice(-2) + " " + meses[toDate.getMonth()]+ " " + toDate.getFullYear());
									$("#fromdateHeaderValue").val(("0"+(fromDate.getDate())).slice(-2) + " " + meses[fromDate.getMonth()]+ " " + fromDate.getFullYear());
									$("#todateHeaderValue").val(("0"+(toDate.getDate())).slice(-2) + " " + meses[toDate.getMonth()]+ " " + toDate.getFullYear());
									GEA.PUB.setFromSearchObraDirecta("S");
									GEA.PUB.dpaNewHeaderFilter();
									mostrarMensajeObraFueraRango = true
								}
								GEA.PUB.search(result,true);
								if(mostrarMensajeObraFueraRango){
									new ALERT("La obra requerida se encuentra fuera del rango de fechas preseleccionado, por lo que éstas se han modificado.");
								}
							}
							else
							{
								LOADING.hide();
								new ALERT("No se encuentran resultados de obras para la búsqueda especificada.");
							}
						}
					});
				});
				$("#comunabtn").on('click', function(){
					
					
					
					//Se limpia la caja pop de info de una obra concreta si estuviera seleccionada.
					$.clearBox();
					
					LOADING.show("Efectuando b&uacute;squeda, Espere por favor...");
					SOCKET.request({
						request: "obras/getComunaBuscador", 
						data:{
							SEARCH: $("#comunatext").val().trim().toUpperCase(),
							MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
							MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"   
						},
						callback:function(result){		
							if(result.STATUS == 1 || result.STATUS == 2){					
								
								if(GEA.PUB.getDatesChanged()){
									GEA.PUB.dpaNewHeaderFilter();
								}
								GEA.PUB.search(result);
							}
							else
							{
								LOADING.hide();
								new ALERT("No se encuentran resultados de obras para la búsqueda especificada.");
							}
						}
					});
				});
				$("#idebtn").on('click', function(){
					LOADING.show("Efectuando b&uacute;squeda, 	Espere por favor...");
					$.clearBox();
					SOCKET.request({
						request: "obras/getObrasBuscadors", 
						data:{
							SEARCH: $("#idetext").val().trim().toUpperCase(),
							MINDATEHEADER: ($("#fromdateHeader").val() !== "")?$("#fromdateHeader").val(): "NSET",
							MAXDATEHEADER: ($("#todateHeader").val() !== "")?$("#todateHeader").val(): "NSET"
						},
						callback:function(result){
							if(result.STATUS == 1){
								//Se obtiene el periodo de fechas que comprenden las obras devueltas.
								/*var fechaFrom = Date.parse($("#fromdateHeader").val());
								var fechaTo = Date.parse($("#todateHeader").val());*/
								var fechaFromTmp = $("#fromdateHeader").val().split("/");
								// var fechaFrom = Date.parse(fechaFromTmp[2] + "-" + fechaFromTmp[1] + "-" + fechaFromTmp[0] + "T00:00:00.000Z");
								var fechaFrom = Date.parse(fechaFromTmp[2] + "/" + fechaFromTmp[1] + "/" + fechaFromTmp[0]);
								if(isNaN(fechaFrom)){
									fechaFrom = Date.parse($("#fromdateHeader").val());
								}
								var fechaToTmp = $("#todateHeader").val().split("/");
								// var fechaTo = Date.parse(fechaToTmp[2] + "-" + fechaToTmp[1] + "-" + fechaToTmp[0] + "T00:00:00.000Z");
								var fechaTo = Date.parse(fechaToTmp[2] + "/" + fechaToTmp[1] + "/" + fechaToTmp[0]);
								if(isNaN(fechaTo)){
									fechaTo = Date.parse($("#todateHeader").val());
								}
								
								var obrasFechaFROM = "";
								var obrasFechaTO = "";
								for(f=0;f<result.OBRAS.length;f++){
									if(obrasFechaFROM == ""){
										//obrasFechaFROM = Date.parse(result.OBRAS[f].FECHA);
										//if(isNaN(obrasFechaFROM)){
											var tmp = result.OBRAS[f].FECHA.replace(" 00:00:00", "");
											tmp = tmp.split("-");
											// obrasFechaFROM = Date.parse(tmp[0] + "-" + tmp[1] + "-" + tmp[2] + "T00:00:00.000Z");
											obrasFechaFROM = Date.parse(tmp[0] + "/" + tmp[1] + "/" + tmp[2]);
										//}	
										//obrasFechaTO = Date.parse(result.OBRAS[f].FECHA);
										//if(isNaN(obrasFechaTO)){
										//	var tmp = result.OBRAS[f].FECHA.replace(" 00:00:00", "");
										//	tmp = tmp.split("-");
											// obrasFechaTO = Date.parse(tmp[0] + "-" + tmp[1] + "-" + tmp[2] + "T00:00:00.000Z");
											obrasFechaTO = Date.parse(tmp[0] + "/" + tmp[1] + "/" + tmp[2]);
										//}	
									}else{
										if(Date.parse(result.OBRAS[f].FECHA) < obrasFechaFROM){
											//obrasFechaFROM = Date.parse(result.OBRAS[f].FECHA);
											//if(isNaN(obrasFechaFROM)){
												var tmp = result.OBRAS[f].FECHA.replace(" 00:00:00", "");
												tmp = tmp.split("-");
												// obrasFechaFROM = Date.parse(tmp[0] + "-" + tmp[1] + "-" + tmp[2] + "T00:00:00.000Z");
												obrasFechaFROM = Date.parse(tmp[0] + "/" + tmp[1] + "/" + tmp[2]);
											//}	
										}
										if(Date.parse(result.OBRAS[f].FECHA) > obrasFechaTO){
											//obrasFechaTO = Date.parse(result.OBRAS[f].FECHA);
											//if(isNaN(obrasFechaTO)){
												var tmp = result.OBRAS[f].FECHA.replace(" 00:00:00", "");
												tmp = tmp.split("-");
												// obrasFechaTO = Date.parse(tmp[0] + "-" + tmp[1] + "-" + tmp[2] + "T00:00:00.000Z");
												obrasFechaTO = Date.parse(tmp[0] + "/" + tmp[1] + "/" + tmp[2]);
											//}	
										}
									}
								}			
								var mostrarMensajeObraFueraRango = false;
								if(obrasFechaFROM < fechaFrom || obrasFechaTO > fechaTo){
									//Se cambia el periodo de fechas de la cabecera.
									var fromDate = new Date(obrasFechaFROM);
									var toDate = new Date(obrasFechaTO);
									$("#fromdateHeader").attr("noaction",true).val(("0"+(fromDate.getDate())).slice(-2) + "/" + ("0"+(fromDate.getMonth()+1)).slice(-2) + "/" + fromDate.getFullYear());
									$("#todateHeader").attr("noaction",true).val(("0"+(toDate.getDate())).slice(-2) + "/" + ("0"+(toDate.getMonth()+1)).slice(-2) + "/" + toDate.getFullYear());
									$("#alternateFrom").val(("0"+(fromDate.getDate())).slice(-2) + "/" + ("0"+(fromDate.getMonth()+1)).slice(-2) + "/" + fromDate.getFullYear());
									$("#alternateTo").val(("0"+(toDate.getDate())).slice(-2) + "/" + ("0"+(toDate.getMonth()+1)).slice(-2) + "/" + toDate.getFullYear());
									$("#alternateFromAS").val(("0"+(fromDate.getDate())).slice(-2) + "/" + ("0"+(fromDate.getMonth()+1)).slice(-2) + "/" + fromDate.getFullYear());
									$("#alternateToAS").val(("0"+(toDate.getDate())).slice(-2) + "/" + ("0"+(toDate.getMonth()+1)).slice(-2) + "/" + toDate.getFullYear());
									var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
									$("#alternateFromASValue").val(("0"+(fromDate.getDate())).slice(-2) + " " + meses[fromDate.getMonth()]+ " " + fromDate.getFullYear());
									$("#alternateFromValue").val(("0"+(fromDate.getDate())).slice(-2) + " " + meses[fromDate.getMonth()]+ " " + fromDate.getFullYear());
									$("#alternateToValue").val(("0"+(toDate.getDate())).slice(-2) + " " + meses[toDate.getMonth()]+ " " + toDate.getFullYear());
									$("#alternateToASValue").val(("0"+(toDate.getDate())).slice(-2) + " " + meses[toDate.getMonth()]+ " " + toDate.getFullYear());
									$("#fromdateHeaderValue").attr("noaction",true).val(("0"+(fromDate.getDate())).slice(-2) + " " + meses[fromDate.getMonth()]+ " " + fromDate.getFullYear());
									$("#todateHeaderValue").attr("noaction",true).val(("0"+(toDate.getDate())).slice(-2) + " " + meses[toDate.getMonth()]+ " " + toDate.getFullYear());
									GEA.PUB.setFromSearchObraDirecta("S");
									GEA.PUB.dpaNewHeaderFilter(function(){
										GEA.PUB._SEARCH($("#idetext").val().trim().toUpperCase(), function(){
											new ALERT("No se encuentran resultados de obras para la búsqueda especificada."); 
										});
									});
									mostrarMensajeObraFueraRango = true;
								}
								else
								{
									GEA.PUB._SEARCH($("#idetext").val().trim().toUpperCase(), function(){
										new ALERT("No se encuentran resultados de obras para la búsqueda especificada."); 
									});
								}
								if(mostrarMensajeObraFueraRango){
									new ALERT("La obra requerida se encuentra fuera del rango de fechas preseleccionado, por lo que éstas se han modificado.");
								}
								
							}
							else
							{
								LOADING.hide();
								new ALERT("No se encuentran resultados de obras para la búsqueda especificada.");
							}
						}
					});
				});
				/*$("#idebtn").on('click', function(){
					GEA.PUB._SEARCH($("#idetext").val().trim().toUpperCase(), function(){
						new ALERT("No se encuentran resultados de obras para la búsqueda especificada."); 
					});
				});*/
				
			}
		}
		// DEFINIMOS LOS EMTODOS PUBLICOS 
		this.PUB = {
			
		}
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		_CONSTRUCT(args);	
	}
	
})();