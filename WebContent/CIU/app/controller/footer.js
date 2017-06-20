GEOCGRAPP	
	.controller('footer', function(){
		this.contraloria = function() {
			window.open("http://www.contraloria.cl","_blank");
		};
		this.ciudadano = function() {
			window.open("http://www.contraloria.cl/NewPortal2/portal2/ShowProperty/BEA%20Repository/Sitios/Ciudadano/Inicio","_blank");
		};
		this.fb = function() {
			window.open("https://es-la.facebook.com/contraloriachile", "_blank");
		}
		this.tw = function(){
			window.open("https://twitter.com/Contraloriacl", "_blank");
		};
		this.rss = function(){
			window.open("http://www.contraloria.cl/NewPortal2/portal2/ShowProperty/BEA%20Repository/Portal/Rss/Canal2.html", "_blank");
		};
		this.noticias = function(e,element){
			if($("#noticiasbtn").attr('active') == 1){
				$(".f9").animate({
					bottom: "-"+($(".f9").height()+$("footer").height()+15)+"px"
				}, function(){
					$(".fi").hide();
				});
				$("#noticiasbtn").attr('active',0);
				$("#noticiasbtn").removeClass("active");
				$("#noticiasbtn").html("Noticias<i class=\"fa fa-caret-down\" aria-hidden=\"true\" active=\"0\"></i>");
				
			}
			else
			{
				$(".fi").show();
				$(".f9").animate({
					bottom: "20px"
				});
				$("#noticiasbtn").addClass("active");
				$("#noticiasbtn").attr('active',1);
				$("#noticiasbtn").html("Noticias <i class=\"fa fa-caret-up\" aria-hidden=\"true\" active=\"1\"></i>");
			}
		}
	});
