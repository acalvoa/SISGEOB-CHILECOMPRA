// JavaScript Document
(function($){
	$.shutdown = function(argumentos, e){
		$.abstractCommand.call(this,"ShoutDown", "shoutdown",true, false, false,function(argumentos){
			$("#waitCap-capback").css({
				background: "#FFF",
				opacity: 0.5
			});
			$("#waitCap-title").html("Cerrando Sesion, Espere por favor...");
			$("#waitCap").show();
			$.ajax({
				type:"POST",
				url: "php/logout.php",
				success: function(resultado){
					var result = JSON.parse(resultado);
					if(result.response)
					{
						location.href = result.url;
					}
				}
			});
		});	
	};
	$.shutdown.prototype = new $.abstractCommand;
})(jQuery);