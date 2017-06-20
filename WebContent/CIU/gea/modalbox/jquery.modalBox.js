(function($){
//DEFINIMOS LA CLASE GEOBOX QUE PERMITE GENERAR VENTANAS MODALES
$.modalBox = function(opt){
	//LAS VARIABLES DEFAULT REEMPLAZAN A LAS SETTINGS CUANDO ESTAS NO SON ENTREGADAS 
	//COMO PARAMETRO DE INICIALIZACION
	//DEFINIMOS LAS VARIABLES DEFAULT
	var that = this;
	var defaults = {
		libname: "jquery.modalBox.js",
		modalbox: null,
		height: null,
		width: null,
		dialog:null,
		content: null,
		header: null,
		body: null,
		footer: null,
		onSuccess: null,
		onLoad: null,
		onClose: null,
		title: null,
		txtBtn: null,
		container: null,
		bodyHeight: "auto",
		noSuccessBtn:null
	};
	//DEFINIMOS LAS SETTINGS
	var settings = {
	};
	//DEFINIMOS EL CONTENEDOR MODAL
	//DEFINIMOS LOS METODOS PRIVADOS Y EL CONSTRUCTOR EN ESTA AREA OBJETO
	var methods = {
		constructor: function(opt){
			settings = $.extend({}, defaults, opt);
			//INSTANCIAMOS EL MAPA
			methods.make_modal();
			methods.make_body();
			methods.make_header();
			methods.make_button();
			settings.modalbox.modal('toggle');
			settings.modalbox.on('hidden.bs.modal', function(){
				methods.destroy();
			});
			if(settings.onLoad != null){
				settings.onLoad();
			}
		},
		make_modal: function(){
			settings.modalbox = $('<div class="modal fade"></div>').appendTo($('body'));
			settings.dialog = $('<div class="modal-dialog"></div>').appendTo(settings.modalbox)
			settings.container = $('<div class="modal-content"></div>').appendTo(settings.dialog);
			if(settings.height != null){
				settings.container.css({
					height: settings.height
				});
				settings.dialog.css({
					height: settings.height
				});
			}
			if(settings.width != null){
				settings.dialog.css({
					width: settings.width
				});
				settings.container.css({
					width: settings.width
				});
			}
			settings.header = $('<div class="modal-header"></div>').appendTo(settings.container);
			settings.body = $('<div class="modal-body"></div>').appendTo(settings.container).css({
				height: settings.bodyHeight
			});
			settings.footer = $('<div class="modal-footer"></div>').appendTo(settings.container);
		},
		make_button: function(){
			if(settings.closebutton){
				$('<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>').on('click', function(){
					if(settings.onClose != "null"){
						settings.onClose();
						methods.destroy();
					}
				}).appendTo(settings.footer);
			}
			if(!settings.noSuccessBtn){
				$('<button type="button" class="btn btn-primary">'+settings.txtBtn+'</button>').on('click', function(){
					if(settings.onSuccess != "null"){
						settings.onSuccess(methods);
						methods.hide();
					}
				}).appendTo(settings.footer);
			}
		},
		make_header: function(){
			$('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>').appendTo(settings.header);
			$('<h4 class="modal-title">'+settings.title+'</h4>').appendTo(settings.header);
		},
		make_body: function(){
			$(settings.content).appendTo(settings.body);
		},
		hide: function(){
			settings.modalbox.modal('hide');
		},
		destroy: function(){
			settings.modalbox.remove();
			$(".modal-backdrop").remove();
			delete that
		}
	};
	//DEFINIMOS LOS METODOS PUBLICOS
	this.publics = {
	};
	//LLAMAMOS AL CONSTRUCTOR POR DEFECTO
	methods.constructor(opt);
}
}(jQuery));
