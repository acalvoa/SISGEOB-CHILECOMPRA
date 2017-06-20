(function($){
//
$.console = function(opt, handler){
	//LAS VARIABLES DEFAULT REEMPLAZAN A LAS SETTINGS CUANDO ESTAS NO SON ENTREGADAS 
	//COMO PARAMETRO DE INICIALIZACION
	//DEFINIMOS LAS VARIABLES DEFAULT
	var defaults = {
		libname: "jquery.console.js"
	};
	var that = this;
	//DEFINIMOS LAS SETTINGS
	var settings = {
	};
	//DEFINIMOS EL OBJETO ROOT SUPERIOR
	var root = null;
	//DEFINIMOS EL OBJETO QUE CONTIENE LOS COMANDOS
	var commands = {};
	//DEFINIMOS LOS METODOS PRIVADOS Y EL CONSTRUCTOR EN ESTA AREA OBJETO
	var methods = {
		constructor: function(opt, handler){
			settings = $.extend({}, defaults, opt);
			//SETEAMOS EL OBJETO HANDLER
			root = handler;
			//CARGAMOS LA HOJA DE ESTILOS
			that.utils.add_css_sheet(settings.libname);
			//INSTANCIAMOS EL MAPA
			that.console.load(settings);
			//INICIAMOS LAS FUNCIONES
			that.console.command_load();
			//INCRIBIENDO MENSAJE
			that.console.send_message("Gea Developer Console - V1.0")
		}		
	};
	//DEFINIMOS LOS METODOS PUBLICOS
	this.console = {
		load: function(opt){
			var self = this;
			var container = $("<div></div>",{
				id: "Geocgr-Console",
				title: "Consola Geo CGR"
			}).appendTo($("body")).ventana({
				height:352,
				zindex:2,
				name:"Console",
				resize: function(){
					settings.consoleBody.css({height: "100%"});
					settings.consoleBody.css({height: "-=30px"});
					container.css({
						height:"100%",
						width: "100%"
					});
					container.css({
						height: "-="+container.parent().children(".ui-dialog-titlebar").height()
					});
					leter.css({
						top: "100%"
					});
				},
				appServer:opt.app,
				WidgetStatus: true
			});
			settings.consoleBody = $('<div id="Geocgr-Console-body"><div>').appendTo(container).addClass('Geocgr-Console-body')
			.css({
				height: "275px",
				width: "100%"
			});
			var leter = $('<div id="Geocgr-Console-leter"><div>').appendTo(container);
			$("<input type='text' placeholder='Escriba el comando' id='Geocgr-Console-input'/>")
			.appendTo(leter)
			.change(function(){
				self.send_message($(this).val());
				try
				{
					self.console_analisis($(this).val(), false);
				}
				catch(error)
				{
					console.log(error);
					self.gea_response("Sintaxis o Comando incorrecto");
				}
				document.getElementById("Geocgr-Console-body").scrollTop += $("#Geocgr-Console-body").height();
				$(this).val('');
			});
			container.parent().css({
				"z-index" : opt.zindex
			});
		},
		console_analisis: function(command,sudo){
			var self = this;
			try
			{
				var tesis  = command.split(" ",1);
				var argument = command.split("--");
				argument.splice(0,1);
				if(tesis[0] == "sudo")
				{
					commands[tesis[0]].exec(command.replace("sudo ",""),self.get_elements(), false);
				}
				else
				{
					if(settings.su)
					{
						sudo = true;
					}
					commands[tesis[0]].exec((argument.length>1)?argument:[],self.get_elements(),(typeof sudo!="undefined")?sudo:false);	
				}
			}
			catch(e)
			{
				alert(e);
				this.console.gea_response(e,false,true);
			 	eval(command);
			}
			
		},
		command_load: function(){
			$.include("gea/lib.console/command/jquery.abstract.js",{dom:true, before: "geacore"}, function(){
				$.ajax({
					type:"POST",
					async: false,
					data: {
						method: "commandsReader"
					},
					url:"gea/lib.console/jsp/commandsReader.jsp",
					success: function(resultado){
						var elementos = JSON.parse(resultado);
						$.each(elementos,function(key,value){
							$.include("gea/lib.console/command/"+value.filename,{dom:true, before: "geacore", oncomplete: function(){
								commands[value.name] = new $[value.name];
							}});
						});
					}
				});
			});
		},
		send_message: function(message){
			var contenido = settings.consoleBody.html();
			settings.consoleBody.html(contenido+'<b>></b> '+message+'<br />');
		},
		gea_response: function(message,endl,gea){
			var contenido = settings.consoleBody.html();
			var membrete = (typeof gea == "undefined" || gea == true)?"<b>GeoCgr:</b> ":"";
			if(typeof endl == "undefined" || endl == true)
			{
				settings.consoleBody.html(contenido+membrete+message+"<br /><br />");
			}
			else
			{
				settings.consoleBody.html(contenido+membrete+message+"<br />");
			}
		},
		get_elements: function(){
			return {
				console: this,
				commands: commands
			}
		},
		load_function: function(names, funcion, require_param, sudo){
			var comando = function(){
				this.exec = function(){
					this.action(argument, e, sudo);
				};
				this.name = names;
				this.sudo = sudo;
				this.command = funcion;
				this.require_params = require_param;
				this.params = that.reflection.get_params_method(funcion);
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
				
			}
			commands[names] = new comando; 
		},
		superUser:function(opt){
			settings.su = opt;
		},
		getApp:function(){
			return opt.app;
		}
	};
	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(opt, handler);
}
$.console.prototype = new $.geautils();
}(jQuery));