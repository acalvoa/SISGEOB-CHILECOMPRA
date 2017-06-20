(function(){
	ALERT = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
		}
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			SETTINGS = $.extend({}, SETTINGS, args);
			var container = $('<div></div>');
			var body = $('<div></div>').addClass("alertbox").appendTo(container);
			var header = $('<div></div>').addClass("bheader").appendTo(body).html(args.header);
			var content = $('<div></div>').addClass("bcontent").appendTo(body);
			$('<div></div>').addClass("icon").appendTo(content).html(args.icon);
			$('<div></div>').addClass("body").appendTo(content).html(args.body);
			return container.html();
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
		}
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		return _CONSTRUCT(args);
	}
})();