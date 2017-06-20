GEOCGRAPP
.controller('slider-content',function(){
		this.next = function(e){
			var content=$(e.currentTarget).parent().children(".contentimagen");
			var div = content.children(".imagen-slider").first();
			div.detach();
			div.appendTo(content);
			
		};
		this.prev = function(e){
			var content=$(e.currentTarget).parent().children(".contentimagen");
			var div = content.children(".imagen-slider").last();
			div.detach();
			div.prependTo(content);
		};
	});