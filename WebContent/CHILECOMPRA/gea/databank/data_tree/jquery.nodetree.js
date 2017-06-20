(function($){
//NODE TREE
$.nodetree = function(padre){
	this.valor1 = null;
	this.valor2 = null;
	this.itsfull = function(){
		if(this.valor1 != null && this.valor2 != null){
			return true;
		}
		else
		{
			return false;
		}
	}
	this.hijo1 = null;
	this.hijo2 = null;
	this.hijo3 = null;
	this.padre = null;
	var methods = {
		constructor: function(padre){
			this.padre = padre;
		}	
	};
	//DEFINIMOS LOS METODOS PUBLICOS
	this.publics = {
	};
	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(padre);
}
$.nodedata = function(llave,valor){
	this.llave = llave;
	this.valor = valor;
}
}(jQuery));