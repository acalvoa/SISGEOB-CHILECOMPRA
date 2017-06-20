(function($){
//NODE TREE
$.treemap = function(padre){
	var root = null;
	var num = 0;
	var methods = {
		constructor: function(padre){
			this.padre = padre;
		}	
	};
	//DEFINIMOS LOS METODOS PUBLICOS
	this.publics = {
		add_node: function(llave, value){
			var newnode = new $.nodedata(llave,value);
			if(root == null){
				root = new $.nodetree(null);
				root.valor1 = newnode;
			}
			else
			{
				
			}
		}
	};
	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(padre);
}
}(jQuery));