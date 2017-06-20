(function() {
	ETIQUETA = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
			container: null
		}
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			SETTINGS.container = args.container;
			SETTINGS.container.children('.grafico').children('.chart').easyPieChart({
				onStep: function(from, to, percent) {
					$(this.el).find('.percent').text(Math.round(percent));
				},
				size:80
			});
			SETTINGS.chart = SETTINGS.container.children('.grafico').children('.chart').data('easyPieChart');
	
		}
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
		}
		// DEFINIMOS LOS EMTODOS PUBLICOS 
		this.PUB = {
			update: function(por){
				SETTINGS.chart.update(por);
			},
			show: function(){
				SETTINGS.container.show();
			},
			hide: function(){
				SETTINGS.container.hide();
			},
			pos: function(e){
				for (var key in e)
		        {
					if(e[key]=="[object MouseEvent]")
					{
						SETTINGS.container.css({
						top: e[key].pageY,
						left: e[key].pageX+10						
						});
						return;
					}
	        	}
			},
			setTitle: function(title){
				SETTINGS.container.children('.titulo').html(title);
			},
			setValue: function(value){
				SETTINGS.container.children('.datos').children('.totalinv').html("$"+PRIV.number_format(value,0,",","."));
			},
			setNumObras: function(value,TYPE){
				if(TYPE == 1){
					SETTINGS.container.children('.datos').children('.numobras').html("<b>"+value+"</b> obras solo en esta región.");
				}
				else if(TYPE == 2){
					SETTINGS.container.children('.datos').children('.numobras').html("<b>"+value+"</b> obras solo en esta comuna.");
				}
				else if(TYPE == 3){
					SETTINGS.container.children('.datos').children('.numobras').html("<b>"+value+"</b> obras solo en esta provincia.");
				}
			},
			setNumMultiObras: function(value,TYPE){
				if(TYPE == 1){
					SETTINGS.container.children('.datos').children('.numobrasmultidpa').html("<b>"+value+"</b> obras en esta y otra(s) región(es)");
				}
				else if(TYPE == 2){
					SETTINGS.container.children('.datos').children('.numobrasmultidpa').html("<b>"+value+"</b> obras en esta y otra(s) comuna(s)");
				}
				else if(TYPE == 3){
					SETTINGS.container.children('.datos').children('.numobrasmultidpa').html("<b>"+value+"</b> obras en esta y otra(s) provincia(s)");
				}
			},
			setNumLastMod: function(value){
				SETTINGS.container.children('.datos').children('.lastreg').html('<b><i class="fa fa-clock-o"></i> Último Registro: '+value);
			}
		}
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		_CONSTRUCT(args);	
	}
})();