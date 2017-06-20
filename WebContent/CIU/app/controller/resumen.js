(function() {
	RESUMEN = function(args) {
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS = {
			container: null
		}
		var value_act = 0;
		var STACK;
		var RESUMEN_ACTUAL;
		var RESUMEN_OBJ = function(TITLE,GRAF_VALUE,VALUE,LEYEND,NUMBER_OBRAS,NUMBER_MULTI_OBRA,TYPE){
			this.TITLE = TITLE;
			this.GRAF_VALUE = GRAF_VALUE;
			this.VALUE = VALUE;
			this.LEYEND = LEYEND;
			this.NUMBER_OBRAS = NUMBER_OBRAS;
			this.NUMBER_MULTI_OBRA = NUMBER_MULTI_OBRA;
			this.TYPE = TYPE;
		};
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args) {
			STACK = [];
			RESUMEN_ACTUAL = null;
			SETTINGS.container = args.container;
			SETTINGS.container.children('.grafico').children('.chart').easyPieChart({
				onStep: function(from, to, percent) {
					if(isNaN(percent) || !isFinite(percent)) percent = 100;
					$(this.el).find('.percent').text(Math.round(percent));
				},
				size: 90
			});
			SETTINGS.chart = SETTINGS.container.children('.grafico').children('.chart').data('easyPieChart');
			self.PUB.pos();
			self.PUB.css();
		}
		// DEFINIMOS LOS METODOS PRIVADOS
		var PRIV = {
			number_format: function(number, decimals, dec_point, thousands_sep) {
				number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
				var n =	!isFinite(+number) ? 0 : +number,
					prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
					sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
					dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
					s = '',
					toFixedFix = function(n, prec) {
						var k = Math.pow(10, prec);
						return '' + (Math.round(n * k) / k).toFixed(prec);
					};
					
				// Fix for IE parseFloat(0.55).toFixed(0) = 0;
				s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
				
				if (s[0].length > 3) {
					s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
				}
				
				if ((s[1] || '').length < prec) {
					s[1] = s[1] || '';
					s[1] += new Array(prec - s[1].length + 1).join('0');
				}
				
				return s.join(dec);
			}
		}
		
		// DEFINIMOS LOS METODOS PUBLICOS 
		this.PUB = {
			RESTORE: function(NUM){
				if(typeof NUM != "undefined" && STACK.length > NUM){
					var element = STACK.pop();
					self.PUB.PRINT(element);
				}
				else if(typeof NUM != "undefined" && STACK.length <= NUM)
				{

				}
				else
				{
					var element = STACK.pop();
					self.PUB.PRINT(element);
				}
			},
			RESTORE_LVL: function(NUM){
				STACK = [];
				RESUMEN_ACTUAL = null;
			},
			CREATE_AND_SET: function(TITLE,GRAF_VALUE,VALUE,LEYEND,NUMBER_OBRAS,NUMBER_MULTI_OBRA, TYPE){
				var NEWRESUMEN = new RESUMEN_OBJ(TITLE,GRAF_VALUE,VALUE,LEYEND,NUMBER_OBRAS,NUMBER_MULTI_OBRA,TYPE);
				if(RESUMEN_ACTUAL != null){
					STACK.push(RESUMEN_ACTUAL);
				}
				self.PUB.PRINT(NEWRESUMEN);
			},
			update: function(por) {
				var percent = por;
				if(isNaN(percent) || !isFinite(percent)){
					percent = 100;
				}
				if(percent != value_act){
					value_act = percent;
					SETTINGS.chart.update(percent);
				}
			},
			
			show: function() {
				self.PUB.pos();
				SETTINGS.container.show();
			},
			
			hide: function() {
				SETTINGS.container.hide();
			},
		
			pos: function() {
				SETTINGS.container.css({
					top: ($(".panel").offset().top - SETTINGS.container.height() - 10), 
					//left: $(".panel").offset().left	});
					right: 0
				})
			},
				
			css: function() {
				SETTINGS.container.css({width: $(".panel").width()});
			},
		
			setTitle: function(title, obra) {
				if(typeof obra != "undefined") {
					SETTINGS.container.children('.datos').children('.titulo').addClass('titulotriple');
					$("#tabla_resumen_pdf").children('.datos').children('.titulo').addClass('titulotriple');
					SETTINGS.container.children('.datos').children('.totalinv').addClass('noborderbot');
					$(".tabla_resumen_reg_pdf").children('.datos').children('.totalinv').addClass('noborderbot');
				} else {
					SETTINGS.container.children('.datos').children('.titulo').removeClass('titulotriple');
					$("#tabla_resumen_pdf").children('.datos').children('.titulo').removeClass('titulotriple');
					SETTINGS.container.children('.datos').children('.totalinv').removeClass('noborderbot');
					$(".tabla_resumen_reg_pdf").children('.datos').children('.totalinv').removeClass('noborderbot');
				}
					
				//VEMOS EL TAMAÑO DE LA OBRA
				if(title.length > 40 && typeof obra == "undefined") {
					SETTINGS.container.children('.datos').children('.titulo').addClass('titulodoble');
					$("#tabla_resumen_pdf").children('.datos').children('.titulo').addClass('titulodoble');
				} else if(title.length > 55 && typeof obra != "undefined") {
					SETTINGS.container.children('.datos').children('.titulo').addClass('titulodoble');
					$("#tabla_resumen_pdf").children('.datos').children('.titulo').addClass('titulodoble');
				} else {
					SETTINGS.container.children('.datos').children('.titulo').removeClass('titulodoble');
					$("#tabla_resumen_pdf").children('.datos').children('.titulo').removeClass('titulodoble');
				}
					
				SETTINGS.container.children('.datos').children('.titulo').html(title.toUpperCase());
				$("#tabla_resumen_pdf").children('.datos').children('.titulo').html(title.toUpperCase());
			},
				
			setValue: function(value) {
				SETTINGS.container.children('.datos').children('.totalinv').html("$"+PRIV.number_format(value,0,",","."));
				$(".tabla_resumen_reg_pdf").children('.datos').children('.totalinv').html("Inversi&oacute;n total: $"+PRIV.number_format(value,0,",","."));
			},
				
			setNumObras: function(value,type) {
				SETTINGS.container.children('.datos').children('.numobras').show();
				$("#tabla_resumen_pdf").children('.datos').children('.numobras').show();
				
				if(type == 1) {
					SETTINGS.container.children('.datos').children('.numobras').html(value+" Obras solo en esta región.");
					$(".tabla_resumen_reg_pdf").each(function() {
						$(this).children('.datos').children('.numobras').html(value+" Obras solo en esta región.");
					})
				} else if(type == 2) {
					SETTINGS.container.children('.datos').children('.numobras').html(value+" Obras solo en esta comuna.");
					$(".tabla_resumen_reg_pdf").each(function() {
						$(this).children('.datos').children('.numobras').html(value+" Obras solo en esta comuna.");	
					})
				} else if(type == 3) {
					SETTINGS.container.children('.datos').children('.numobras').html(value+" Obras solo en esta provincia.");
					$(".tabla_resumen_reg_pdf").each(function() {
						$(this).children('.datos').children('.numobras').html(value+" Obras solo en esta provincia.");	
					})
				}
			},
			
			setMultiObras: function(value, type) {
				SETTINGS.container.children('.datos').children('.multidpa').show();
				$("#tabla_resumen_pdf").children('.datos').children('.multidpa').show();
				
				if(type == 1) {
					SETTINGS.container.children('.datos').children('.multidpa').html(value+" Obras en esta y otra(s) region(es)");
					$(".tabla_resumen_reg_pdf").each(function() {
						$(this).children('.datos').children('.multidpa').html(value+" Obras en esta y otra(s) region(es)");	
					});
				} else if(type == 2) {
					SETTINGS.container.children('.datos').children('.multidpa').html(value+" Obras en esta y otra(s) comuna(s)");
					$(".tabla_resumen_reg_pdf").each(function() {
						$(this).children('.datos').children('.multidpa').html(value+" Obras en esta y otra(s) comuna(s)");	
					});
				} else if(type == 3) {
					SETTINGS.container.children('.datos').children('.multidpa').html(value+" Obras en esta y otra(s) provincia(s)");
					$(".tabla_resumen_reg_pdf").each(function() {
						$(this).children('.datos').children('.multidpa').html(value+" Obras en esta y otra(s) provincia(s)");	
					});
				}
			},
			
			hideNumObras: function() {
				SETTINGS.container.children('.datos').children('.numobras').hide();
				$(".tabla_resumen_reg_pdf").children('.datos').children('.numobras').hide();
				SETTINGS.container.children('.datos').children('.multidpa').hide();
				$("#tabla_resumen_pdf").children('.datos').children('.multidpa').hide();
			},
			
			setSubGrafico: function(value) {
				$(".subgrafico").html(value);
			},
			SET_REGIONAL: function(UPPER_LAYER,UPPER_METADATA){
				self.PUB.CREATE_AND_SET(
					UPPER_LAYER.NOMBRE.substring(0,1).toUpperCase() + UPPER_LAYER.NOMBRE.substring(1,UPPER_LAYER.NOMBRE.length).toLowerCase(),
					Math.floor(UPPER_LAYER.MONTO_CONTRATADO/UPPER_METADATA._TOTAL_MONTO*100),
					UPPER_LAYER.MONTO_CONTRATADO,
					"Del Total Nacional",
					UPPER_LAYER.NUMOBRAS,
					UPPER_LAYER.MULTIREG,
					1
				);
			},
			SET_PROVINCIAL: function(UPPER_LAYER,UPPER_METADATA, OBRAS){
				if(UPPER_LAYER.MULTIPROV > 0 && OBRAS.length == 1 && OBRAS[0].MULTIPROV > 1){
					var resumen = (((UPPER_LAYER.MONTO_CONTRATADO)/UPPER_METADATA._TOTAL_MONTO*100)>100?100:(UPPER_LAYER.MONTO_CONTRATADO)/UPPER_METADATA._TOTAL_MONTO*100);
					self.PUB.CREATE_AND_SET(
						"Provincia de "+UPPER_LAYER.NOMBRE.substring(0,1).toUpperCase() + UPPER_LAYER.NOMBRE.substring(1,UPPER_LAYER.NOMBRE.length).toLowerCase(),
						Math.floor(resumen),
						UPPER_LAYER.MONTO_CONTRATADO+OBRAS[0].MONTO_CONTRATADO,
						"Del Total Regional",
						UPPER_LAYER.NUMOBRAS,
						UPPER_LAYER.MULTIPROV,
						3
					);
					new ALERT("El monto de inversión de la Obra seleccionada solo se incluye en la sumatoria de montos de la Provincia o Región en que ésta se emplaza.");
				}
				else{
					self.PUB.CREATE_AND_SET(
						"Provincia de "+UPPER_LAYER.NOMBRE.substring(0,1).toUpperCase() + UPPER_LAYER.NOMBRE.substring(1,UPPER_LAYER.NOMBRE.length).toLowerCase(),
						Math.floor(UPPER_LAYER.MONTO_CONTRATADO/UPPER_METADATA._TOTAL_MONTO*100),
						UPPER_LAYER.MONTO_CONTRATADO,
						"Del Total Regional",
						UPPER_LAYER.NUMOBRAS,
						UPPER_LAYER.MULTIPROV,
						3
					);
				}
			},
			SET_COMUNAL: function(UPPER_LAYER,UPPER_METADATA, OBRAS){
				if(UPPER_LAYER.MULTICOM > 0 && OBRAS.length == 1 && OBRAS[0].MULTICOM > 1){
					var resumen = (((UPPER_LAYER.MONTO_CONTRATADO)/UPPER_METADATA._TOTAL_MONTO*100)>100?100:(UPPER_LAYER.MONTO_CONTRATADO)/UPPER_METADATA._TOTAL_MONTO*100);
					self.PUB.CREATE_AND_SET(
						"Comuna de "+UPPER_LAYER.NOMBRE.substring(0,1).toUpperCase() + UPPER_LAYER.NOMBRE.substring(1,UPPER_LAYER.NOMBRE.length).toLowerCase(),
						Math.floor(resumen),
						UPPER_LAYER.MONTO_CONTRATADO+OBRAS[0].MONTO_CONTRATADO,
						"Del Total Regional",
						UPPER_LAYER.NUMOBRAS,
						UPPER_LAYER.MULTICOM,
						2
					);
					new ALERT("El monto de inversión de la Obra seleccionada solo se incluye en la sumatoria de montos de la Provincia o Región en que ésta se emplaza.");
				}
				else{
					self.PUB.CREATE_AND_SET(
						"Comuna de "+UPPER_LAYER.NOMBRE.substring(0,1).toUpperCase() + UPPER_LAYER.NOMBRE.substring(1,UPPER_LAYER.NOMBRE.length).toLowerCase(),
						Math.floor(UPPER_LAYER.MONTO_CONTRATADO/UPPER_METADATA._TOTAL_MONTO*100),
						UPPER_LAYER.MONTO_CONTRATADO,
						"Del Total Regional",
						UPPER_LAYER.NUMOBRAS,
						UPPER_LAYER.MULTICOM,
						2
					);
				}
			},
			SET_COMUNAL_VIEW: function(OBRA,UPPER_LAYER){
				if(OBRA.MULTICOM > 1){
					var resumen;
					if(UPPER_LAYER.MONTO_CONTRATADO<=0)
					{
						resumen=0;
						new ALERT("El monto de inversión de la Obra seleccionada solo se incluye en la sumatoria de montos de la Provincia o Región en que ésta se emplaza.");
					}
					else
						resumen= (OBRA.MONTO_CONTRATADO/(UPPER_LAYER.MONTO_CONTRATADO))*100;
					self.PUB.CREATE_AND_SET(
						((OBRA.TITULO.length>120)?OBRA.TITULO.substring(0,117)+"...":OBRA.TITULO),
						Math.floor(resumen),
						OBRA.MONTO_CONTRATADO,
						"Del Total Comunal",
						null,
						null,
						2
					);
					
				}
				else{
					self.PUB.CREATE_AND_SET(
						((OBRA.TITULO.length>120)?OBRA.TITULO.substring(0,117)+"...":OBRA.TITULO),
						Math.floor((OBRA.MONTO_CONTRATADO/UPPER_LAYER.MONTO_CONTRATADO)*100),
						OBRA.MONTO_CONTRATADO,
						"Del Total Comunal",
						null,
						null,
						2
					);
				}
				FICHAS.PUB.load_data(OBRA);
				FICHAS.PUB.select();
			},
			SET_PROVINCIAL_VIEW: function(OBRA,UPPER_LAYER){
				var resumen;
				if(UPPER_LAYER.MONTO_CONTRATADO<=0)
				{
					resumen=0;
					new ALERT("El monto de inversión de la Obra seleccionada solo se incluye en la sumatoria de montos de la Provincia o Región en que ésta se emplaza.");
				}
				else
					resumen=(OBRA.MONTO_CONTRATADO/(UPPER_LAYER.MONTO_CONTRATADO+OBRA.MONTO_CONTRATADO))*100;
				if(OBRA.MULTICOM > 1){
					self.PUB.CREATE_AND_SET(
						((OBRA.TITULO.length>120)?OBRA.TITULO.substring(0,117)+"...":OBRA.TITULO),
						Math.floor(resumen),
						OBRA.MONTO_CONTRATADO,
						"Del Total Provincial",
						null,
						null,
						3
					);
					
				}
				else{
					self.PUB.CREATE_AND_SET(
						((OBRA.TITULO.length>120)?OBRA.TITULO.substring(0,117)+"...":OBRA.TITULO),
						Math.floor((OBRA.MONTO_CONTRATADO/UPPER_LAYER.MONTO_CONTRATADO)*100),
						OBRA.MONTO_CONTRATADO,
						"Del Total Provincial",
						null,
						null,
						3
					);
				}
				FICHAS.PUB.load_data(OBRA);
				FICHAS.PUB.select();
			},
			PRINT: function(ROBJECT){
				RESUMEN_ACTUAL = ROBJECT;
				RESUPOP.PUB.hideNumObras();
				self.PUB.setTitle(ROBJECT.TITLE);
				self.PUB.update(ROBJECT.GRAF_VALUE);
				self.PUB.setValue(ROBJECT.VALUE);
				if(ROBJECT.NUMBER_OBRAS != null) self.PUB.setNumObras(ROBJECT.NUMBER_OBRAS,ROBJECT.TYPE);
				if(ROBJECT.NUMBER_MULTI_OBRA != null) self.PUB.setMultiObras(ROBJECT.NUMBER_MULTI_OBRA,ROBJECT.TYPE);
				RESUPOP.PUB.setSubGrafico(ROBJECT.LEYEND);
			}
		}
		
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		_CONSTRUCT(args);	
	}
})();
