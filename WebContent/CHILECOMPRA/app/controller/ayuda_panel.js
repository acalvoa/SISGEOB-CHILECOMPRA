GEOCGRAPP
	.controller('switch-tab', function(){
		this.search = function(e){
			$(".tabayuda div").removeClass("borderdiv");
			$(e.currentTarget).addClass("borderdiv");
			$(".ayuda-item").show();
			$("#search").hide();
		};
		this.hide = function(e){
			$(".ayuda_panel").animate({
			    left: "+="+($("#ayudacontent").width()+20)+"px"
			}, 1000, function() {
				$(e.currentTarget).hide();
			    $(e.currentTarget).parent().children("#show").show();
			});
		};
		this.show = function(e){
			$(".ayuda_panel").animate({
			    left: "-="+($("#ayudacontent").width()+20)+"px"
			}, 1000, function() {
			    $("#switchayuda").children("#show").hide();
			    $("#switchayuda").children("#hide").show();
			});
		};
	});
	
