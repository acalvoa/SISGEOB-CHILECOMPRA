(function(){
	PROMPT = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
			body: null,
			content: null,
			first: null,
			second: null,
			third: null,
			centro:null,
			float: null,
			float2: null
		}
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
			SETTINGS = $.extend({}, SETTINGS, args);
			SETTINGS.body = $('<div></div>').addClass("prompt").appendTo($('body'));
			var background = $('<div></div>').addClass("background").appendTo(SETTINGS.body);
			var box = $('<div></div>').addClass("box").appendTo(SETTINGS.body);
			// CONTENIDO
			var header = $('<div></div>').addClass("header").appendTo(box);
			var content = $('<div></div>').addClass("body").appendTo(box);
			var footer = $('<div></div>').addClass("footer").appendTo(box);
			// DEFINIMOS EL LOGO
			var logo = $('<div></div>').addClass("logo text-center").appendTo(header);
			
			var object = $("<object></object>")
				.attr("data", "CHILECOMPRA/public_html/images/logos/sisgeob.svg")
				.attr("height", "60")
				.attr("type", "image/svg+xml")
				.appendTo(logo);
			$("<img></img>")
				.attr("src","CHILECOMPRA/public_html/images/logos/png/sisgeob.png")
				.attr("height","60")
				.appendTo(object);
			$("<img></img>")
				.attr("src","CHILECOMPRA/public_html/images/logos/png/chilecompra.png")
				.attr("height","60")
				.attr("style","vertical-align: top;")
				.appendTo(logo);
			
			//DEFINIMOS EL CONTENIDO
			SETTINGS.content = $('<div></div>').addClass("content").appendTo(content).html(args.texto);
			//DEFINIMOS LOS BOTONES
			// PRIMER BOTON
			var boxfoo = $('<div></div>').addClass("float").appendTo(footer);
			SETTINGS.float = boxfoo;
			if(typeof args.first != "undefined"){
				SETTINGS.first = $('<div></div>').addClass("boton").appendTo(boxfoo);	
				$("<button></button>").appendTo(SETTINGS.first);
				SETTINGS.first.children('button').on('click', function(){
					args.first(self);
				});
			}
			// SEGUNDO BOTON
			if(typeof args.second != "undefined"){
				SETTINGS.second = $('<div></div>').addClass("boton").appendTo(boxfoo);
				$("<button></button>").appendTo(SETTINGS.second);
				SETTINGS.second.children('button').on('click', function(){
					args.second(self);
				});
			}
			// TERCER BOTON
			if(typeof args.third != "undefined"){
				SETTINGS.third = $('<div></div>').addClass("boton").appendTo(boxfoo);
				$("<button></button>").appendTo(SETTINGS.third);
				SETTINGS.third.children('button').on('click', function(){
					args.third(self);
				});
			}
			// Cuarto BOTON centrado
			var boxfoo2 = $('<div></div>').addClass("float2").appendTo(footer);
			SETTINGS.float2 = boxfoo2;
			if(typeof args.centro != "undefined"){
				SETTINGS.centro = $('<div></div>').addClass("botoncentro").appendTo(boxfoo2);
				$("<button></button>").appendTo(SETTINGS.centro);
				SETTINGS.centro.children('button').on('click', function(){
					args.centro(self);
				});
			}

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
		}
		// DEFINIMOS LOS EMTODOS PUBLICOS 
		this.PUB = {
			show: function(){
				SETTINGS.body.show();
			},
			destroy: function(){
				SETTINGS.body.remove();
			},
			add_css: function(style){
				SETTINGS.content.css(style);
			},
			add_css_btn: function(style){
				SETTINGS.float.css(style);
			},
			set_first: function(txt){
				SETTINGS.first.children('button').html(txt);
			},
			set_first_class: function(txt){
				SETTINGS.first.children('button').addClass(txt);
			},
			set_second: function(txt){
				SETTINGS.second.children('button').html(txt);
			},
			set_second_class: function(txt){
				SETTINGS.second.children('button').addClass(txt);
			},
			set_third: function(txt){
				SETTINGS.third.children('button').html(txt);
			},
			set_third_class: function(txt){
				SETTINGS.third.children('button').addClass(txt);
			},
			set_centro: function(txt){
				SETTINGS.centro.children('button').html(txt);
			},
			set_centro_class: function(txt){
				SETTINGS.centro.children('button').addClass(txt);
			}
		}
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		_CONSTRUCT(args);
	}
})();