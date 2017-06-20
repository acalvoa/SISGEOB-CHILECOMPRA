// JavaScript Document
(function($){
	$.su = function(argumentos){
		$.abstractCommand.call(this,"su", "su",true, false, true, function(argumentos,e,sudo){
			if(argumentos == null)
			{
				e.console.gea_response("Argumentos incorrectos");
			}
			else
			{
				argumentos = (argumentos == "true");
				if(!sudo)
				{
					$.msgBox({ type: "prompt",
					    title: "Requerimiento de super usuario",
					    inputs: [
					    { header: "Digite Contraseña", type: "password", name: "password" }],
					    buttons: [
					    { value: "Aceptar" }],
					    success: function (result, values) {
					    	if($(values)[0].value == "shadowfax")
					    	{
					    		e.console.superUser(argumentos);
					    		e.console.gea_response("Operacion efectuada con exito");
					    	}
					    	else
					    	{
					    		e.console.gea_response("Contraseña Incorrecta, Intentelo otra vez.");
					    	}
					    }
					});
				}
				else
				{
					e.console.superUser(argumentos);
					e.console.gea_response("Operacion efectuada con exito");
				}
			}
			
		});	
	};
	$.su.prototype = new $.abstractCommand;
})(jQuery);