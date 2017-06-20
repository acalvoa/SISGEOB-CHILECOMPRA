GEOCGRAPP	
	.controller('header', function(){
		this.popover = function(e, pos){
			var f = new Date();
			POP.PUB.show({
				element: $(e.currentTarget),
				pos: (typeof pos != "undefined")? pos: "TOP",
				content: GEA.SWITCH.popResu(),
				css: {
					width: 280,
					height: "auto",
					"font-size": "0.8em",
					padding: "5px"
				}
			});
			
		};
		this.popover2015 = function(e, pos){
			var f = new Date();
			POP.PUB.show({
				element: $(e.currentTarget),
				pos: (typeof pos != "undefined")? pos: "TOP",
				content: "Adjudicaciones de obra provenientes de Mercado P&uacute;blico entre el 01.01.2015 y el 31.12.2015.",
				css: {
					width: 200,
					height: 70,
					"font-size": "0.8em",
					padding: "1px"
				}
			});
			POP.PUB.mov_pop(0,0);
		};
		this.popover2016 = function(e, pos){
			var f = new Date();
			POP.PUB.show({
				element: $(e.currentTarget),
				pos: (typeof pos != "undefined")? pos: "TOP",
				content: "Adjudicaciones de obra provenientes de Mercado P&uacute;blico a partir del 01.01.2016.",
				css: {
					width: 200,
					height: 70,
					"font-size": "0.8em",
					padding: "1px"
				}
			});
			POP.PUB.mov_pop(0,20);
		};
		this.popoverhide = function(){
			POP.PUB.hide();
		};
		this.faq = function(){
			$(".cont-modal-header").hide();
			$(".faq").show();
			$("#modal2").show();
		};
		this.links = function(){
			$(".cont-modal-header").hide();
			$(".links").show();
			$("#modal2").show();
		};
		this.normativa = function(){
			$(".cont-modal-header").hide();
			$(".normativa").show();
			$("#modal2").show();
		};
		this.registradores = function(){
			$(".cont-modal-header").hide();
			$(".registradores").show();
			$("#modal2").show();
		};
		this.inicio = function(){
			GEA.PUB.dpaChile();
					};
		this.inicioRefreshHeaderFilter = function(){
			var fechaFrom = Date.parse($("#fromdateHeader").val());
			var fechaTo = Date.parse($("#todateHeader").val());
			if(fechaFrom > fechaTo){
				new ALERT("El periodo de fechas indicado no es correcto. Revise, por favor.")
			}else{
				GEA.PUB.dpaNewHeaderFilter();
			}
			
		};
		this.switching = function(year){
			switch(year){
				case 2016:
					GEA.SWITCH.set_2016();
					break;
				case 2015:
					GEA.SWITCH.set_2015();
					break;
			}
		};
		
	});