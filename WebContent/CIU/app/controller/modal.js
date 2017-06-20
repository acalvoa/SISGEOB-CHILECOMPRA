GEOCGRAPP	
	.controller('modal1', function(){
		this.terminos = function(e){
			$(".tabitem").removeClass("active").addClass("inactive");
			$(e.currentTarget).addClass("active").removeClass("inactive");
			$(".modal-ini-content").hide();
			$(".terminos").show();
		};
		this.geocgr = function(e){
			$(".tabitem").removeClass("active").addClass("inactive");
			$(e.currentTarget).addClass("active").removeClass("inactive");
			$(".modal-ini-content").hide();
			$(".geocgr").show();
		};
		this.datos = function(e){
			$(".tabitem").removeClass("active").addClass("inactive");
			$(e.currentTarget).addClass("active").removeClass("inactive");
			$(".modal-ini-content").hide();
			$(".origendatos").show();
		};
		this.remember = function(e){
			if($(e.currentTarget).attr("data-cookie") == 0){
				$.cookie("modal-ini", 1);
				$(e.currentTarget).attr("data-cookie",1);
			}
			else
			{
				$.cookie("modal-ini", 0);
				$(e.currentTarget).attr("data-cookie",0);
			}
		}
		this.close = function(e){
			//$("#modal1").fadeOut(1000);
			$("#modal1").remove();
		};
		this.download1 = function(e){
			$.ajax({
				method: "GET",
				url: "gateway/video",
				data: {	GeoIdItem: "201502110004" },
				success: function(result) {
					var resultado = JSON.parse(result);
					location.href = resultado.urlvideo;
				}
			});
		};
		this.download2 = function(e){
			$.ajax({
				method: "GET",
				url: "gateway/video",
				data: {	GeoIdItem: "20150323001" },
				success: function(result) {
					var resultado = JSON.parse(result);
					location.href = resultado.urlvideo;
				}
			});
		};
		this.download3 = function(e){
			$.ajax({
				method: "GET",
				url: "gateway/video",
				data: {	GeoIdItem: "20150323002" },
				success: function(result) {
					var resultado = JSON.parse(result);
					location.href = resultado.urlvideo;
				}
			});
		};
		this.urlvideo1 = function(e){
			$.ajax({
				method: "GET",
				url: "gateway/video",
				data: {	GeoIdItem: "201502110004" },
				success: function(result) {
					var resultado = JSON.parse(result);
					$("#btnvideo1").hide();
					document.getElementById("url1").innerHTML = "<video src='" + resultado.urlvideo + "' width='255' height='175' controls autoplay poster='CIU/public_html/images/video1.png'></video>";
				}
			});
		};
		this.urlvideo2 = function(e){
			$.ajax({
				method: "GET",
				url: "gateway/video",
				data: {	GeoIdItem: "20150323001" },
				success: function(result) {
					var resultado = JSON.parse(result);
					$("#btnvideo2").hide();
					document.getElementById("url2").innerHTML = "<video src='" + resultado.urlvideo + "' width='255' height='175' controls autoplay poster='CIU/public_html/images/video2.png'></video>";
				}
			});
		};
		this.urlvideo3 = function(e){
			$.ajax({
				method: "GET",
				url: "gateway/video",
				data: {	GeoIdItem: "20150323002" },
				success: function(result) {
					var resultado = JSON.parse(result);
					$("#btnvideo3").hide();
					document.getElementById("url3").innerHTML = "<video src='" + resultado.urlvideo + "' width='255' height='175' controls autoplay poster='CIU/public_html/images/video3.png'></video>";
				}
			});
		};
	})
	.controller('modal2', function(){
		this.close = function(e){
			$("#modal2").fadeOut(1000);
		};
		this.tab = function(e){
			$(".tabcontent").children(".content").hide();
			$(".tab"+$(e.currentTarget).attr("data-tab")).children(".content").show();
		}
		this.tcontent = function(e){
			$(".tabcontent").children(".content").hide();
			$(e.currentTarget).parent().children(".content").show();
		}
	});
