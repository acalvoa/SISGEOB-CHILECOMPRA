(function(){
	LOADINGBOX = function(args){
		var self = this;
		var obj = ".loading";
		var titulo = ".loading .loading-box .message";
		// DEFINIMOS EL CONSTRUCTOR
		var constructor = function(){
			console.log("Dependecia Loading Box - Cargada");
		}
		// DEFINIMOS METODOS PUBLIOS DE ENTRADA
		this.message = function(message){
			$(titulo).html(message);
		}
		this.show = function(message,callback){
			self.message(message);
			$(".loading").fadeIn();
			if(typeof callback != "undefined") callback();
		}
		this.hide = function(callback){
			$(obj).fadeOut();
			if(typeof callback != "undefined") callback();
		}
		// EJECUTAMOS EL CONSTRUCTOR
		constructor();
	}
	LOADING = new LOADINGBOX();
})();
