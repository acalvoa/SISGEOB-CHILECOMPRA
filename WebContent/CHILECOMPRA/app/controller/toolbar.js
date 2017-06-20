GEOCGRAPP
	.controller('toolbar', function(){
		this.help = function(e){
			$("#modal1").fadeIn(500);
			$(".tabitem").removeClass("active").addClass("inactive");
			$("#ayuda").addClass("active").removeClass("inactive");
			$(".modal-ini-content").hide();
			$(".ayuda").show();
		}
	});