// JavaScript Document
(function($){
	$.listCommands = function(argumentos){
		$.abstractCommand.call(this,"listCommands", "listCommands",true, false, false,function(e){
			e.console.gea_response("Mostrando lista de comandos...",false,false)
			$.each(e.commands, function(key,value){
				e.console.gea_response("- "+key,false,false);
			});
		});	
	};
	$.listCommands.prototype = new $.abstractCommand;
})(jQuery);