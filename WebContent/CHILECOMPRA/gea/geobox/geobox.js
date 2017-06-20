// JavaScript Document
(function($) {
	$.numinfowindows = 0;
	$.infowindows = [];
	$.clearBox = function(){
		$.each($.infowindows,function(key,value){
			this.out();
		});
		$.infowindows = [];
	}
	GEOBOX = function(opts)
	{
		this.content = opts.content;
		this.height = opts.height || 250;
		this.width = opts.width || 250;
		this.close = opts.close;
		this.type = "point";
	};
	GEOBOX.prototype = new google.maps.OverlayView();
	GEOBOX.prototype.open = function(map,marker,line){
		//google.maps.event.clearListeners(map, 'zoom_changed');
		if(line) this.type = "polyline";
		this.setMap(map);
		$.clearBox();
		var that = this;
		if (this.div) {
			this.div.remove();
			this.div = null;
	  	};
		this.marker = marker;
		this.div = $('<div></div>')
		.addClass('geoBox')
		.css({
			'z-index': $.numinfowindows,
			height: this.height,
			width: this.width
		})
		.click(function(e){
			e.stopPropagation();
		});
		this.geoback = $('<div></div>').addClass('geoBox-back').appendTo(this.div);
		this.contenido = $('<div></div>').addClass('geoBox-content').appendTo(this.div).html(this.content);
		this.closebutton = $('<div></div>').addClass('geoBox-closebutton').appendTo(this.div).html('<img style="position: absolute; left: -18px; top: -44px; width: 68px; height: 67px; -webkit-user-select: none; border: 0px; padding: 0px; margin: 0px;" src="https://maps.gstatic.com/mapfiles/mv/imgs8.png" draggable="false">');
		this.closebutton.click(function(e){
			$(this).parent().remove()
			that.close();
			$.clearBox();
			//google.maps.event.clearListeners(map, 'zoom_changed');
			e.stopPropagation();
		});
		this.zoom = google.maps.event.addListener(map, 'zoom_changed', function(){
			if(typeof that.panes != "undefined"){
				var position;
				if(that.type == "point"){
					position = that.marker.position;
				}
				else if(that.type = "polyline"){
					var pos = Math.floor(that.marker.getPath().getArray().length/2)
					position = that.marker.getPath().getArray()[pos];
				}
				else if(that.type = "polygon"){
					var pos = Math.floor(that.marker.getPath().getArray().length/2)
					position = that.marker.getPath().getArray()[pos];
				}
		 		that.div.appendTo(that.panes.floatPane);
				that.pixPosition = that.getProjection().fromLatLngToDivPixel(position);
				if(that.type == "point"){
					that.div.css({
						left: (that.pixPosition.x-(that.width/2)) + "px",
						top: (that.pixPosition.y - that.height - 70) + "px"
					});
				}
				else
				{
					that.div.css({
						left: (that.pixPosition.x-(that.width/2)) + "px",
						top: (that.pixPosition.y - that.height-24) + "px"
					});
				}
			}
		});
		$.infowindows.push(this);
	};
	GEOBOX.prototype.onRemove = function(){

	};
	GEOBOX.prototype.clearEvent = function(){
		google.maps.event.removeListener(this.zoom);
	};
	GEOBOX.prototype.out = function(){
		this.clearEvent();
		this.div.remove();
		this.onRemove();
	};
	GEOBOX.prototype.onAdd = function() {
		this.panes = this.getPanes();
	 	this.div.appendTo(this.panes.floatPane);
	 	var position;
	 	if(this.type == "polyline"){
			var pos = Math.floor(this.marker.getPath().getArray().length/2)
			position = this.marker.getPath().getArray()[pos];
		}
		else
		{
			position = this.marker.position;
		}
		this.pixPosition = this.getProjection().fromLatLngToDivPixel(position);
	 	this.draw();
	};
	GEOBOX.prototype.draw = function(){
		if(this.type == "point"){
			this.div.css({
				left: (this.pixPosition.x-(this.width/2)) + "px",
				top: (this.pixPosition.y - this.height - 70) + "px"
			});
		}
		else
		{
			this.div.css({
				left: (this.pixPosition.x-(this.width/2)) + "px",
				top: (this.pixPosition.y - this.height-24) + "px"
			});
		}
		this.div.fadeIn();
	};
})(jQuery);