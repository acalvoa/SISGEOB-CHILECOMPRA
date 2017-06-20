GEOCGRAPP	
	.controller('filtro', function(){
		this.popover = function(e, pos){
			POP.PUB.show({
				element: $(e.currentTarget),
				pos: (typeof pos != "undefined")? pos: "TOP",
				content: $(e.currentTarget).attr("data-content"),
				css: {
					width: 150,
					height: 50,
					"font-size": "0.9em",
					padding: "5px"
				}
			});
			
		}
		this.hide = function(){
			POP.PUB.hide();
		}
		this.filter = function(e){
			FILTER.PUB.filter($(e.currentTarget));
		}
		this.remove = function(e){
			FILTER.PUB.clear_all($(e.currentTarget));
		}
	});