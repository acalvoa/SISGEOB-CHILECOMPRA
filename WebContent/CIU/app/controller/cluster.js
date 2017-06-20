(function(){
	CLUSTER = function(args){
		var cluster = {};
		// DEFINIMOS EL CONSTRUCTOR
		var constructor = function(){
			cluster = {};
		};
		this.PUB = {
			clear: function(){
				cluster = {};
			},
			add: function(key,value){
				if(typeof cluster[key] == "undefined") cluster[key] = [];
				cluster[key].push(value);
			},
			get: function(key){
				return cluster[key];
			}
		}
		constructor();
	}
})();