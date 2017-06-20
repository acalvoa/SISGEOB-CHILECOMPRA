// JavaScript Document
(function($){
	$.loadCommands = function(argumentos){
		$.abstractCommand.call(this,"loadCommands", "loadCommands",true, false, true, function(e){
			$.ajax({
				type:"POST",
				async: false,
				url:"cl/contraloria/geocgr_core/lib.console/jsp/commandsReader.jsp",
				data:{
					method: "commandsReader"
				},
				success: function(resultado){
					var elementos = JSON.parse(resultado);
					e.console.gea_response("Deteniendo procesos...",false,false);
					$.each(e.commands, function(key1,value1){
						try
						{
							document.getElementById("cl/contraloria/geocgr_core/lib.console/command/jquery."+key1+".js").remove();
						}
						catch(e)
						{
							
						}
					});
					e.console.gea_response("Cargando comandos...",false,false);
					$.each(elementos,function(key,value){
						e.console.gea_response("Cargando comando "+value.name,false,false);
						$.include("cl/contraloria/geocgr_core/lib.console/command/"+value.filename,{dom:true, before: "geacore", oncomplete: function(){
							e.commands[value.name] = new $[value.name];
						}});
					});
				}
			});
		});	
	};
	$.loadCommands.prototype = new $.abstractCommand;
})(jQuery);