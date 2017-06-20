(function(){
	GRAFICOCLA = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
			container: null,
			category:{},
			READY: false
		}
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			SETTINGS.container = args.container;
			SOCKET.request({
				request: "clasificacion/getClasificacion",
				data:{
				},
				callback:function(response){
					for(i=0;i<response.length;i++){
						SETTINGS.category[response[i].NUMERO] = {
							NOMBRE: response[i].NOMBRE,
							MONTO_CONTRATADO: 0
						}
					}
					SETTINGS.READY = true;
				},
				buffered: true
			});
		}
		// DEFINIMOS LOS EMTODOS PRIVADOS
		var PRIV = {
			isReady: function(){
				while(true){
					if(SETTINGS.READY){
						break;
					}
				}
			},
			make_row: function(data,METADATA){
				//ESTRUCTURA DOM DE UNA FILA
				PRIV.isReady();
				var row = $("<div></div>").addClass("rowgrafico");
				var por = $("<div></div>").addClass("porcentaje").appendTo(row);
				var info = $("<div></div>").addClass("info").appendTo(row);
				var barra = $("<div></div>").addClass("barra").appendTo(info).on('mouseenter', function(){
					POP.PUB.show({
						element: $(this),
						pos: "TOP",
						content: "<b>Monto Total</b><br>$"+PRIV.number_format(data.MONTO_CONTRATADO,0,"","."),
						css: {
							width: "auto",
							height: 50,
							"font-size": "0.7em",
							padding: "5px"
						}
					});
				}).on('mouseleave', function(){
					POP.PUB.hide();
				});
				var clas = $("<div></div>").addClass("clasificacion").appendTo(info);
				//CARGAMOS LOS DATOS
				clas.html((data.NOMBRE.length >55)?data.NOMBRE.substring(0,52)+"...":data.NOMBRE);
				if(data.MONTO_CONTRATADO > 0 && METADATA._TOTAL_MONTO_CLASI > 0){
					barra.css({
						//width: Math.floor(data.MONTO_CONTRATADO/METADATA._TOTAL_MONTO*100)+"%"
						width: Math.floor(data.MONTO_CONTRATADO/METADATA._TOTAL_MONTO_CLASI*100)+"%"
					});
				}else{
					barra.css({width: "0%"});
				}	
				//por.html(Math.floor(data.MONTO_CONTRATADO/METADATA._TOTAL_MONTO*100)+"%");
				if(data.MONTO_CONTRATADO > 0 && METADATA._TOTAL_MONTO_CLASI > 0){
					por.html(Math.floor(data.MONTO_CONTRATADO/METADATA._TOTAL_MONTO_CLASI*100)+"%");
				}else{
					por.html("0%");
				}		
				//AÑADIMOS AL CONTAINER
				row.appendTo(SETTINGS.container);
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
		// DEFINIMOS LOS EMTODOS PUBLICOS 
		this.PUB = {
			clear: function(){
				PRIV.isReady();
				for(key in SETTINGS.category){
					SETTINGS.category[key].MONTO_CONTRATADO = 0
				}
				SETTINGS.container.empty();
			},
			make: function(data,METADATA){
				PRIV.isReady();
				self.PUB.clear();
				var TEMP = SETTINGS.category;
				if(METADATA._TOTAL_MONTO == 0) METADATA._TOTAL_MONTO = 1;
				METADATA._TOTAL_MONTO_CLASI = 0;
				for(i=0;i<data.length;i++){
					TEMP[data[i].NUMERO].MONTO_CONTRATADO = data[i].MONTO_CONTRATADO;
					METADATA._TOTAL_MONTO_CLASI += data[i].MONTO_CONTRATADO; 
				}
				$.each(TEMP, function(key,value){
					PRIV.make_row(value,METADATA);
				});
			},
			update: function(data){
				PRIV.isReady();
				var busqueda = {};
				for(value in data){
					busqueda[value.name] = value;
				}
				SETTINGS.container.children("rowgrafico").each(function(key,value){
				});
			}
		}
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		_CONSTRUCT(args);
	}
})();