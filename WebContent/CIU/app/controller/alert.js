(function(){
	ALERT = function(args){
		var _self = this;
		var box = null;
		// DEFINIMOS EL CONSTRUCTOR
		var constructor = function(args){
			$(".alert").remove();
			box = $("<div></div>").addClass("alert").appendTo($("body"));
			var header = $("<div></div>").addClass("header-box").appendTo(box);
			$('<i class="fa fa-times" aria-hidden="true"></i>').appendTo(header).on('click', function(){
				$(".alert").remove();
				PUB.destroy();
			});
			var body = $("<div></div>").addClass("body-box").appendTo(box);
			var info = $("<div></div>").addClass("info-box").appendTo(body);
			var message = $("<div></div>").addClass("message-box").appendTo(body).html(args);
			$('<i class="fa fa-info-circle" aria-hidden="true"></i>').appendTo(info);
		};
		PUB = {
			destroy: function(){
				if(box != null){
					box.remove();
				}
			}
		}
		constructor(args);
	}
})();