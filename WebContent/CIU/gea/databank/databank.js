(function($){
//DATABAK CLASS
//EN ESTA CLASE DEFINIMOS METODOS Y ESTRUCTURAS DE ALMACENAMIENTO DE DATOS
//CON ESTOS DATOS EL SIG MANTIENE DE FORMA CENTRALIZADA SU CAPA DE DATOS EN EL CLIENTE
DATABANK = function(opt, handler){
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
		markers: [],
		markersi: [],
		polygons: [],
		polylines: [],
		poly_spa: [],
		polylinesi: [],
		overlays: [],
		points: [],
		rasters: [],
		others: [],
		hashtag: {} 
	};
	//DEFINIMOS LOS METODOS PRIVADOS Y EL CONSTRUCTOR EN ESTA AREA OBJETO
	var methods = {
		constructor: function(opt){
			settings = $.extend({}, defaults, opt);
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
	this.PUB = {
		add_polygon: function(poly,spa,fit){
			data.polygons.push(poly);
			if(spa && (fit == 1)) that.PUB.add_poly_spa(poly);
			return poly;
		},
		add_marker: function(point){
			data.markers.push(point);
			return point;
		},
		add_line: function(line,spa){
			data.polylines.push(line);
			if(spa) that.PUB.add_poly_spa(line);
			return line;
		},
		add_poly_spa: function(line){
			data.poly_spa.push(line);
		},
		get_poly_spa: function(){
			return data.poly_spa;
		},
		get_polygon: function(){
			return data.polygons;
		},
		get_lines: function(){
			return data.polylines;
		},
		get_markers: function(){
			return data.markers;
		},
		clear_poly_spa: function(){
			data.poly_spa = [];
		},
		clear_polygons: function(){
			for(i=0; i<data.polygons.length; i++){
				data.polygons[i].element.setMap(null);
			}
			data.polygons = [];
		},
		clear_markers: function(){
			for(i=0; i<data.markers.length; i++){
				data.markers[i].element.setMap(null);
			}
			data.markers = [];
			data.markersi = [];
		},
		clear_lines: function(){
			for(i=0; i<data.polylines.length; i++){
				data.polylines[i].element.line1.setMap(null);
				data.polylines[i].element.line2.setMap(null);
			}
			data.polylines = [];
			data.polylinesi = [];
		},
		restore_color: function(){
			for(i=0; i<data.markersi.length; i++){
				data.markersi[i].setIcon(data.markersi[i].uicon);
				data.markersi[i].setZIndex(1);
				data.markersi[i].busy = 0;
			}
			for(i=0; i<data.polylinesi.length; i++){
				data.polylinesi[i].setOptions({
					strokeColor: data.polylinesi[i].ucolor
				});
				data.polylinesi[i].busy = 0;
			}
			data.polylinesi = [];
			data.markersi = [];
		},
		add_ipoint: function(point){
			data.markersi.push(point);
		},
		add_iline: function(line){
			data.polylinesi.push(line);
		}
	};
	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(opt, handler);
}
DATA = new DATABANK();
}(jQuery));