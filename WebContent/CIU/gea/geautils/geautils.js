(function($){
//GEO CGR UTILS CLASS
//EN ESTA CLASE DEFINIMOS METODOS Y ESTRUCTURAS DE ALMACENAMIENTO DE DATOS
//CON ESTOS DATOS EL SIG MANTIENE DE FORMA CENTRALIZADA SU CAPA DE DATOS EN EL CLIENTE
GEAUTILS = function(opt){
	//LAS VARIABLES DEFAULT REEMPLAZAN A LAS SETTINGS CUANDO ESTAS NO SON ENTREGADAS 
	//COMO PARAMETRO DE INICIALIZACION
	//DEFINIMOS LAS VARIABLES DEFAULT
	var defaults = {
	};
	//DEFINIMOS LAS SETTINGS
	var settings = {
	};
	var methods = {
		constructor: function(opt){
		}
	}
	//DEFINIMOS LOS METODOS PUBLICOS
	this.utils = {
		//METODO QUE AGREGA DE FORMA AUTOMATICA LOS CSS DOCUMENTS DE CADA PLUGIN
		//PARA QUE ESTO SEA POSIBLE EL DOCUEMNTO CSS DEBE LLAMARSE DE IGUAL FORMA QUE EL PLUGIN
		//LA UNICA DIFERENCIA RADICAL ES QUE DEBE TERMINAR EN CSS.
		//EJEMPLO DE USO:
		//SI LA LIBRERIA SE LLAMA : JQUERY.GEOMAP.JS
		//EL CSS DOCUMENT DEBE LLAMARSE JQUERY.GEOMAP.CSS SI ES CSS
		//O
		//EL CSS DOCUMENT DEBE LLAMARSE JQUERY.GEOMAP.LESS SI ES LESS
		//ESTE SCRIPT CARGA DE FORMA AUTOMATICA EL CSS DOCUMENT.
		add_css_sheet: function(lib){
			$("script").each(function(key,value){
				if($(value).attr('src').search(lib) != -1){
					if(settings.isLess)
					{
						var lessSheet = '<link rel="stylesheet/less" type="text/css" href="'+$(value).attr('src').replace(".js", ".less")+'">';
						$("head").append(lessSheet);
					}
					else
					{
						var cssSheet = '<link rel="stylesheet" href="'+$(value).attr('src').replace(".js", ".css")+'">';
						$("head").append(cssSheet);
					}
				}
			});
		},
		//FIN METODO CARGA CSS
		//FUNCION AUXILIAR PARA CARGAR LIBRERIAS JS
		loadScript: function(url, callback){
		
		 var script = document.createElement("script")
		 script.type = "text/javascript";
		
		 if (script.readyState){  //IE
		    script.onreadystatechange = function(){
		     if (script.readyState == "loaded" ||
		         script.readyState == "complete"){
		           script.onreadystatechange = null;
		           callback();
		        }
		     };
		 } else {  //OTROS EXPLORADORES
		   script.onload = function(){
		     callback();
		   };
		 }
		
		 script.src = url;
		 $("head").append(script);
		},
	};
	this.reflection = {
		get_params_method: function(fn){
			var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
			var FN_ARG_SPLIT = /,/;
			var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
			var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
			var fnText,argDecl;
		    var args=[];
		    fnText = fn.toString().replace(STRIP_COMMENTS, '');
		    argDecl = fnText.match(FN_ARGS); 
		
		    var r = argDecl[1].split(FN_ARG_SPLIT);
		    for(var a in r){
		      var arg = r[a];
		      arg.replace(FN_ARG, function(all, underscore, name){
		         args.push(name);
		      });
		    }
		    return args;
		}
	}
	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(opt);
}
}(jQuery));