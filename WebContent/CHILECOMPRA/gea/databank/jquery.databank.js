(function($){
//DATABAK CLASS
//EN ESTA CLASE DEFINIMOS METODOS Y ESTRUCTURAS DE ALMACENAMIENTO DE DATOS
//CON ESTOS DATOS EL SIG MANTIENE DE FORMA CENTRALIZADA SU CAPA DE DATOS EN EL CLIENTE
$.databank = function(opt, handler){
	//LAS VARIABLES DEFAULT REEMPLAZAN A LAS SETTINGS CUANDO ESTAS NO SON ENTREGADAS 
	//COMO PARAMETRO DE INICIALIZACION
	//DEFINIMOS LAS VARIABLES DEFAULT
	var defaults = {
		libname: "jquery.databank.js"
	};
	//DEFINIMOS EL THAT
	var that = this;
	//DEFINIMOS LAS SETTINGS
	var settings = {
	};
	//GEOMAP
	var geomap;
	//EL OBJETO ROOT HANDLER
	var root = null;
	//DATA INTERNA DEL NUCLEO GEOCGR
	//ACA SE GUARDA EL BANCO DE DATOS INTERNO
	var data = {
		markers: {},
		polygons: [],
		polylines: [],
		overlays: [],
		points: [],
		rasters: [],
		others: [],
		hashtag: {} 
	};
	var primos_exp;
	//DEFINIMOS LOS METODOS PRIVADOS Y EL CONSTRUCTOR EN ESTA AREA OBJETO
	var methods = {
		constructor: function(opt, handler){
			settings = $.extend({}, defaults, opt);
			//SETEAMOS EL OBJETO HANDLER
			root = handler;
			geomap = root.handler.get_lib_method('geomap');
			primos_exp = methods.make_primos(0,6000);
			//REGISTRAMOS LOS METODOS PUBLICOS
			root.handler.reg_all_methods('databank', that.publics);
		},
		make_primos: function(init, end){
			var primos = [];
			var n1 = init; // Dese 
			var n2 = end;// Hasta 
			for(i = n1; i <= n2; i++) 
			{ 
				var nDiv = 0; // Número de divisores 
				for (n = 1; n <= i; n++) // Desde 1 hasta el valor que tenga $i 
				{ 
					if(i%n == 0) // $n es un divisor de $i 
					{ 
						nDiv = nDiv + 1; // Agregamos un divisor mas. 
					} 
				} 
				if(nDiv == 2 || i == 1)// Si tiene 2 divisores ó es 1 --> Es primo 
				{ 
					primos.push(i);
				} 
			}
			return primos;		 
		},
		make_grilla_geografica: function(lat,lng){
			data.markers[Math.floor(lat).toString().concat(Math.ceil(lat).toString()).concat(Math.floor(lng).toString()).concat(Math.ceil(lng).toString())] = new Array(0,3,2,5);
		},
		is_grilla_exists: function(lat,lng){
			if(typeof data.markers[Math.floor(lat).toString().concat(Math.ceil(lat).toString()).concat(Math.floor(lng).toString()).concat(Math.ceil(lng).toString())] == "undefined"){
				return false;
			}
			return true;
		}
	};
	//DEFINIMOS LOS METODOS PUBLICOS
	this.publics = {
		add_data: function(databank, data){
			if(typeof data[databank] != "undefined"){
				data[databank].push(data);
				return true;
			}
			else
			{
				return true;
			}
		},
		add_category_reference: function(category, data){
		},
		geocgr_hash: function(str){
			var hash = "0";
			for(i=1; i <= str.length; i++){
				hash = (parseFloat(hash) + (Math.pow(3,primos_exp[parseInt((i/str.length)*(primos_exp.length-1))]))*((str.charCodeAt(i-1)))).toString();
			}
			var numero = parseFloat(hash)%57885161;
			var numero2 = parseInt((numero%1)*10000);
			return parseInt(numero).toString().concat(numero2.toString()).substring(0,8);		
		},
		get_marker_info: function(marker){
		//FUNCION DEBE SER MEJORADA
			var lat = marker.getPosition().lat();
			var lng = marker.getPosition().lng();
			var array = data.markers[Math.floor(lat).toString().concat(Math.ceil(lat).toString()).concat(Math.floor(lng).toString()).concat(Math.ceil(lng).toString())];
			for(i=0; i < array.length; i++){
				if(array[i].obj === marker){
					return array[i];
				}
			}
			return null;
		},
		add_marker: function(datas,lat,lng){
			ficha = root.handler.get_lib_method('ficha');
			if(methods.is_grilla_exists(lat,lng)){
				var marker = {
					data:datas,
					lat: lat,
					lng: lng,
					obj: geomap.load_marker(lat,lng,{
						clickAction:{
							action: function(e){
								ficha.open(e);
							},
							data:datas
						}
					})
				};
				data.markers[Math.floor(lat).toString().concat(Math.ceil(lat).toString()).concat(Math.floor(lng).toString()).concat(Math.ceil(lng).toString())].push(marker);
				return marker;
			}
			else
			{
				methods.make_grilla_geografica(lat,lng);
				var marker = {
					data:datas,
					lat: lat,
					lng: lng,
					obj: geomap.load_marker(lat,lng,{
						clickAction:{
							action: function(e){
								ficha.open(e);
							},
							data:datas
						}
					})
				};
				data.markers[Math.floor(lat).toString().concat(Math.ceil(lat).toString()).concat(Math.floor(lng).toString()).concat(Math.ceil(lng).toString())].push(marker);
				return marker;
			}
		},
		add_marker_category: function(datas,lat,lng, hash){
			var hashing = hash;
			if(typeof data.hashtag[hashing] == "undefined")
			{
				data.hashtag[hashing] = [];
				var retorno = that.publics.add_marker(datas,lat,lng);
				data.hashtag[hashing].push(retorno);
				return retorno;	
			}
			else
			{
				var retorno = that.publics.add_marker(datas,lat,lng);
				data.hashtag[hashing].push(retorno);
				return retorno;
			}
		},
		clear_data: function(){
		},
		reset_bank: function(){
		},
		get_data: function(){
		},
		update_all_data: function(){
		},
		get_markers: function(){
			return data.markers;
		}
	};
	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(opt, handler);
}
}(jQuery));