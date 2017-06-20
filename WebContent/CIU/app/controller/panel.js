GEOCGRAPP
	.controller('switch-tab', function(){
		this.search = function(e){
			$(".tabpanel div").removeClass("borderdiv");
			$(e.currentTarget).addClass("borderdiv");
			$(".panel-item").hide();
			$("#search").show();
		};
		this.advasearch = function(e){
			$(".tabpanel div").removeClass("borderdiv");
			$(e.currentTarget).addClass("borderdiv");
			$(".panel-item").hide();
			$("#advasearch").show();
		};
		this.inve = function(e){
			$(".tabpanel div").removeClass("borderdiv");
			$(e.currentTarget).addClass("borderdiv");
			$(".panel-item").hide();
			$("#clasificatab").show();
		};
		this.listado = function(e){
			$(".tabpanel div").removeClass("borderdiv");
			$(e.currentTarget).addClass("borderdiv");
			$(".panel-item").hide();
			$("#ranking").show();
		};
		this.ficha = function(e){
			if(GEA.PUB.get_dpalvl() == 4){
				$(".tabpanel div").removeClass("borderdiv");
				$(e.currentTarget).addClass("borderdiv");
				$(".panel-item").hide();
				$("#ficha").show();
			}
		};
		this.hide = function(e){
			$(".panel").animate({
			    left: "+="+$("#panelcontent").width()+"px"
			}, 1000, function() {
				$(e.currentTarget).hide();
			    $(e.currentTarget).parent().children("#show").show();
			});
		};
		this.show = function(e){
			$(".panel").animate({
			    left: "-="+$("#panelcontent").width()+"px"
			}, 1000, function() {
			    $("#switchpanel").children("#show").hide();
			    $("#switchpanel").children("#hide").show();
			});
		};
	})
	.controller('ficha', function(){
		this.fiscaliza = function(e){
			window.open('http://www.contraloria.cl/sisdocconsulta/SistradocCiudadano/Sistradoc_Denuncia.nsf/cgrExpedienteSugerenciaWeb?OpenForm&SO=GEO-CGR','_blank');
		};
		this.denuncia = function(e){
			window.open('http://www.contraloria.cl/sisdocconsulta/SistradocCiudadano/Sistradoc_Denuncia.nsf/cgrExpedienteDenunciaWeb?OpenForm&SO=GEO-CGR','_blank');
		};
	})
	.controller('ranking', function(){
		this.fecha = function(e){
			// RANK.PUB.fecha();
			// $(".btn-ranking").css({
			// 	background: "#EEE"
			// });
			// $(".fecha_ranking").css({
			// 	background: "#999"
			// });
			if($(e.currentTarget).attr("data-sort") == 0){
				RANK.PUB.fecha_inverso();
				$(e.currentTarget).attr("data-sort",1);
				// $(e.currentTarget).children('.fa').hide();
				// $(e.currentTarget).children('.arriba').show();
			}
			else
			{
				RANK.PUB.fecha();
				$(e.currentTarget).attr("data-sort",0);
				// $(e.currentTarget).children('.fa').hide();
				// $(e.currentTarget).children('.abajo').show();
			}
			
		};
		this.nombre = function(e){
			$(".btn-ranking").css({
				background: "#EEE"
			});
			$(".nombre_ranking").css({
				background: "#999"
			});
			if($(e.currentTarget).attr("data-sort") == 0){
				RANK.PUB.nombre_inverso();
				$(e.currentTarget).attr("data-sort",1);
				$(e.currentTarget).children('.fa').hide();
				$(e.currentTarget).children('.arriba').show();
			}
			else
			{
				RANK.PUB.nombre();
				$(e.currentTarget).attr("data-sort",0);
				$(e.currentTarget).children('.fa').hide();
				$(e.currentTarget).children('.abajo').show();
			}
		};
		this.monto = function(e){
			// RANK.PUB.inversion();
			if($(e.currentTarget).attr("data-sort") == 0){
				RANK.PUB.inversion_inverso();
				$(e.currentTarget).attr("data-sort",1);
				// $(e.currentTarget).children('.fa').hide();
				// $(e.currentTarget).children('.arriba').show();
			}
			else
			{
				RANK.PUB.inversion();
				$(e.currentTarget).attr("data-sort",0);
				// $(e.currentTarget).children('.fa').hide();
				// $(e.currentTarget).children('.abajo').show();
			}
		};
		this.erase = function(e){
			$("#ranking .listado_obras").show();
			$("#ranking #erasesearch").hide();
			$("#advasearch #destxtinput").val('');
			$("#advasearch #servtxtinput").val('');
			$("#advasearch #clasif").val(-1)
			$("#advasearch #fromamount").val('');
			$("#advasearch #toamount").val('');
			$("#advasearch #fromdate").val('');
			$("#advasearch #todate").val('');
			$('.result-tab').hide();
			RANK.PUB.clear_search()
		}
	})
	.controller('advasearch', function(){
		this.busqueda = function(e){
			if(GEA.PUB.getDatesChanged() == "true"){
				GEA.PUB.dpaNewHeaderFilter();
				$("#fromadvsearch").val('true');
			}else{
				BUSQUEDA.PUB.search();
			}	
		}
		this.borrar = function(e){
			$("#advasearch #destxtinput").val('');
			$("#advasearch #servtxtinput").val('');
			$("#advasearch #clasif").val(-1)
			$("#advasearch #fromamount").val('');
			$("#advasearch #toamount").val('');
			$("#advasearch #fromdate").val('');
			$("#advasearch #todate").val('');
			$('.result-tab').hide();
		}
		this.results = function(e){
			$(".tabpanel div").removeClass("borderdiv");
			$(".tabranking div").addClass("borderdiv");
			$(".panel-item").hide();
			$("#ranking .listado_obras").hide();
			$("#ranking #erasesearch").show();
			$("#ranking").show();
			RANK.PUB.set_search(BUSQUEDA.PUB.get());
		}
	})
	.controller('descargas', function(){
		this.xls = function(e){
			var lvldpa = GEA.PUB.get_dpalvl();
			var dpa = GEA.PUB.get_dpa();
			if(lvldpa == 0){
				XLSD.PUB.xls(1);
			}
			else if(lvldpa == 1){
				if(dpa == 0){
					XLSD.PUB.xls(2);
				}
				else if(dpa == 1){
					XLSD.PUB.xls(3);
				}
			} 
			else if(lvldpa == 2){
				XLSD.PUB.xls(4);
			} 	
			else if(lvldpa == 3){
				XLSD.PUB.xls(5);
			} 
			else if(lvldpa == 4){
				XLSD.PUB.xls(6);
			} 			
			e.preventDefault();
			e.stopPropagation();
			/*if(!XLSD.PUB.get_status()){
				e.preventDefault();
				e.stopPropagation();
				new ALERT("Debe seleccionar una obra en los niveles comunal o provincial.");
			}*/
		};
		this.pdf = function(e){
			var lvldpa = GEA.PUB.get_dpalvl();
			var dpa = GEA.PUB.get_dpa();
			if(lvldpa == 0){
				XLSD.PUB.pdf(1);
			}
			else if(lvldpa == 1){
				if(dpa == 0){
					XLSD.PUB.pdf(2);
				}
				else if(dpa == 1){
					XLSD.PUB.pdf(3);
				}
			} 
			else if(lvldpa == 2){
				XLSD.PUB.pdf(4);
			} 	
			else if(lvldpa == 3){
				XLSD.PUB.pdf(5);
			} 	
			else if(lvldpa == 4){
				XLSD.PUB.pdf(6);
			} 			
			e.preventDefault();
			e.stopPropagation();
		};
		this.kml = function(e){
			var lvldpa = GEA.PUB.get_dpalvl();
			var dpa = GEA.PUB.get_dpa();
			if(lvldpa == 0){
				XLSD.PUB.kml(1);
			}
			else if(lvldpa == 1){
				if(dpa == 0){
					XLSD.PUB.kml(2);
				}
				else if(dpa == 1){
					XLSD.PUB.kml(3);
				}
			} 
			else if(lvldpa == 2){
				XLSD.PUB.kml(4);
			} 	
			else if(lvldpa == 3){
				XLSD.PUB.kml(5);
			} 	
			else if(lvldpa == 4){
				XLSD.PUB.kml(6);
			} 			
			e.preventDefault();
			e.stopPropagation();
		};
		this.close = function(e){
			$("#kmlmodal").hide();
		};
	});