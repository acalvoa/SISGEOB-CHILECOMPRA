(function($){
	POPOVER = function(args){
		//SETTINGS
		var settings = {
			container: null
		};
		// DEFINIMOS EL CONSTRUCTOR
		var constructor = function(){
			settings.container = $("<div></div>").addClass("popove").addClass("top").appendTo($("body"));
			settings.content = $("<div></div>").appendTo(settings.container).addClass("content");
		}
		// METODOS PRIVADOS
		var PRIV = {
			set_content: function(text){
				settings.content.html(text);
			},
			set_content_div: function(div){
				settings.content.empty();
				div.appendTo(settings.content);
			},
			set_css: function(css){
				settings.content.css(css);
			}
		}
		// METODOS PUBLICOS
		this.PUB = {
			show: function(args){
				settings.container.removeClass("top left right bottom");
				if(typeof args.divcontent != "undefined"){
					PRIV.set_content_div(args.divcontent);
				}
				else
				{
					PRIV.set_content(args.content);
				}
				if(typeof args.css.width != "undefined") {
					settings.container.width(args.css.width);
					args.css.width = "100%"
				}
				if(typeof args.css.height != "undefined") {
					settings.container.height(args.css.height);
					args.css.height = "100%";
				}
				PRIV.set_css(args.css);
				if(args.pos == "TOP"){
					settings.container.addClass("top");
					settings.container.css({
						top: args.element.offset().top - settings.container.height() - args.element.height(),
						left: args.element.offset().left + (args.element.width()/2) - (settings.container.width()/2) -5
					});
				}
				else if(args.pos == "LEFT"){
					settings.container.addClass("left");
					settings.container.css({
						top: args.element.offset().top - (settings.container.height()/2) - 5 + (args.element.height()/2), 
						left: args.element.offset().left + (args.element.width()) + 25
					});
				}
				else if(args.pos == "RIGHT"){
					settings.container.addClass("right");
					settings.container.css({
						top: args.element.offset().top - (settings.container.height()/2) - 5 + (args.element.height()/2), 
						left: args.element.offset().left - settings.container.width() - 38	
					});
				}
				else if(args.pos == "BOTTOM"){
					settings.container.addClass("bottom");
					settings.container.css({
						top: args.element.offset().top + settings.container.height(),
						left: args.element.offset().left + (args.element.width()/2) - (settings.container.width()/2) -5
					});
				}
				settings.container.show();
			},
			hide: function(){
				settings.container.hide();
			},
			mov_pop: function(left,top){
				settings.container.css({
					"margin-top":top,
					"margin-left":left
				})
			}
		}
		// LLAMADA AL CONSTRUCTOR
		constructor();
	}
})(jQuery);