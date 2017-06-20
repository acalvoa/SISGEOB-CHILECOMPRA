GEOCGRAPP
	.controller('dpa', function(){
		this.setComunal = function(){
			if(GEA.PUB.setComunal()){
				$("#dpa-provincial").removeClass("active").addClass("inactive");
				$("#dpa-comunal").addClass("active").removeClass("inactive");
			}
		}
		this.setProvincial = function(){
			if(GEA.PUB.setProvincial()){
				$("#dpa-comunal").removeClass("active").addClass("inactive");
				$("#dpa-provincial").addClass("active").removeClass("inactive");
			}
		}
	})
	.controller('cgr', function(){
		this.contraloria = function(){
			window.open("http://www.contraloria.cl","_blank");
		}
		this.ciudadano = function(){
			window.open("http://www.contraloria.cl/NewPortal2/portal2/ShowProperty/BEA%20Repository/Sitios/Ciudadano/Inicio","_blank");
		}
	})
	.controller('noticias', function(){
		this.n1 = function(e){
			$("#noticia1").show();
			e.currentTarget.className += " activenotice";
		};
		this.n2 = function(e){
			$("#noticia2").show();
			e.currentTarget.className += " activenotice";
		};
		this.n3 = function(e){
			$("#noticia3").show();
			e.currentTarget.className += " activenotice";
		};
		this.descarga = function(e){
			$("#descarga").show();
		};
		this.close = function(e){
			$(".noticia").hide();
			$(".activenotice").removeClass("activenotice");
		};
	})
	.controller('leyenda', function(){
		this.inversion = function(e){
			POP.PUB.show({
				element: $(e.currentTarget),
				pos: "BOTTOM",
				content: "Montos de Inversión en Obras ordenados menor a mayor.",
				css: {
					width: 200,
					height: 40,
					"font-size": "0.8em",
					padding: "5px"
				}
			});
			// POP.PUB.mov_pop(0,0);
		};
		this.multidpa = function(e){
			POP.PUB.show({
				element: $(e.currentTarget),
				pos: "BOTTOM",
				content: "Obras excluidas de las sumatorias de Inversión",
				css: {
					width: 200,
					height: 40,
					"font-size": "0.8em",
					padding: "5px"
				}
			});
			// POP.PUB.mov_pop(0,0);
		};
		this.sede = function(e){
			POP.PUB.show({
				element: $(e.currentTarget),
				pos: "BOTTOM",
				content: "Agrupación de Obras sin Ubicación (Sedes Consistoriales)",
				css: {
					width: 200,
					height: 40,
					"font-size": "0.8em",
					padding: "5px"
				}
			});
			// POP.PUB.mov_pop(0,0);
		};
		this.hide = function(e){
			POP.PUB.hide();
		}
	});