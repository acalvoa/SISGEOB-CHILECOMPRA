(function() {
	RESUMEN = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
			container: null
		}
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			SETTINGS.container = args.container;
			/*SETTINGS.container.children('.grafico').children('.chart').easyPieChart({
				onStep: function(from, to, percent) {
					$(this.el).find('.percent').text(Math.round(percent));
				},
				size: 90
			});
			SETTINGS.chart = SETTINGS.container.children('.grafico').children('.chart').data('easyPieChart');
			*/
			self.PUB.pos();
			self.PUB.css();
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
				self.PUB.pos();
				SETTINGS.container.show();
			},
			hide: function(){
				SETTINGS.container.hide();
			},
			pos: function(){
				SETTINGS.container.css({
					//top: ($(".panel").offset().top - SETTINGS.container.height() - 10),
					//left: $(".panel").offset().left
				});
			},
			css: function(){
				SETTINGS.container.css({
					width: $(".panel").width()
				});
			},
			setTitle: function(title){
				SETTINGS.container.children('.datos').children('.titulo').html(title);
			},
			setValue: function(value){
				SETTINGS.container.children('.datos').children('.totalinv').html("Inversión total: $"+PRIV.number_format(value,0,",","."));
			},
			setNumObras: function(value){
				SETTINGS.container.children('.datos').children('.numobras').show();
				SETTINGS.container.children('.datos').children('.numobras').html("Obras Registradas: "+value);
			},
			hideNumObras: function(){
				SETTINGS.container.children('.datos').children('.numobras').hide();
			},
			setSubGrafico: function(value){
				$(".subgrafico").html(value);
			}
		}
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		_CONSTRUCT(args);	
	}
})();