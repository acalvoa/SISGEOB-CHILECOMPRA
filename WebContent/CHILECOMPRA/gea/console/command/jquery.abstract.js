// JavaScript Document
(function($){
	$.abstractCommand = function(name, sentence, loader, require_param, sudo, funcion){
		if(typeof name != "undefined")
		{
			this.name = name;
			this.commandSentence = sentence;
			this.gea_load = loader;
			this.sudo = sudo;
			this.command = funcion;
			this.action = function(argument, e, sudo){
				var arg = {};
				$.each(argument, function(key,value){
					var tesis = value.split(" ");
					arg[tesis[0]] = tesis[1];
				});
				if(this.sudo && !sudo)
				{
					e.console.gea_response("Se requieren permisos de superusuario para ejecutar este comando.",false,true);
					return;
				}
				var string_builder = "this.command(e,";
				if($.each(this.params, function(key,value){
					if(this.require_params){
						if(typeof arg[value] != "undefined"){
							string_builder += "arg["+value+"],"
						}
						else
						{
							string_builder += "null,"
						}
					}
					else
					{
						if(typeof arg[value] != "undefined"){
							string_builder += "arg['"+value+"'],"
						}
						else
						{
							e.console.gea_response("Numero de parametros incorrecto. Utilice commando --help para mas ayuda.",false,true);
							return false;
						}
					}
				}) === false){ return false; }
				string_builder = string_builder.substring(0,string_builder.length-1)+");";
				eval(string_builder);
			}
			this.exec = function(argument, e, sudo){
				if(this.name == "sudo"){
					this.command(e, function(){
						e.console.console_analisis(argument, true);
					});
				}
				else
				{
					this.action(argument, e, sudo);
				}
			}
			this.require_params = require_param;
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
			this.params = this.reflection.get_params_method(funcion);
			this.params.splice(0,1);
		}		
	};
})(jQuery);