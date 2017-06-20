// JavaScript Document
(function($){
	$.sudo = function(argumentos){
		$.abstractCommand.call(this,"sudo", "sudo",true, false, false, function(e, metodo){
			$.modalBox({
				title: "Requerimiento de super usuario.",
				txtBtn: "Verificar",
				onClose: function(){
					e.console.gea_response("Acceso incorrecto.", false, true);
				},
				onSuccess: function(e){
					if($("#modal-sudo-password").val() == "geocgr")
					{
						metodo();
						e.destroy();
					}
					else
					{
						e.console.gea_response("Acceso incorrecto.", false, true);
					}
				},
				closebutton: true,
				content: '<input type="password" placeholder="Digite el password de administrador" id="modal-sudo-password" style="width:100%; height:30px;"/>',
				noSuccessBtn: false
				
			});
		});	
	};
	$.sudo.prototype = new $.abstractCommand;
})(jQuery);