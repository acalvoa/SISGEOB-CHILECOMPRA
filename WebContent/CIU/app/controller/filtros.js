(function() {
	FILTRO = function(args){
		// DEFINIMOS LAS SETTINGS
		var self = this;
		var SETTINGS ={
			filtros : [],
			clear: true
		}
		// DEFINIMOS EL CONSTRUCTOR
		var _CONSTRUCT = function(args){
	
		}
		// DEFINIMOS LOS EMTODOS PRIVADOS
		var PRIV = {
			clear_btn: function(){
				if(SETTINGS.clear){
					$(".close-filter").children("i").css({
						color: "#FA9747"
					});
				}
				else
				{
					$(".close-filter").children("i").css({
						color: "#999"
					});
				}
			},
			filtrar: function(){
				$.clearBox();
				MAPA_GRILLA.CLEAN();
				for(g=0; g<SETTINGS.filtros.length; g++){
					MAPA_GRILLA.RENDER_BY("CCLASIFICACION",SETTINGS.filtros[g]);
				}
			},
			limpiar: function(){
				$.clearBox();
				MAPA_GRILLA.CLEAN();
				MAPA_GRILLA.RENDER();
			}
		}
		// DEFINIMOS LOS EMTODOS PUBLICOS 
		this.PUB = {
			filter: function(e, all){
				if(typeof all == "undefined") all = false;
				var tipo = e.attr("id");
				switch(tipo){
					case "edipublico":
						if(SETTINGS.filtros.indexOf("25") == -1 && !all)
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/publico-activo.png');
							SETTINGS.filtros.push("25");
						}
						else
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/publico.png');
							SETTINGS.filtros.splice(SETTINGS.filtros.indexOf("25"),1);
						}
						break;
					case "areaverde":
						if(SETTINGS.filtros.indexOf("28") == -1 && !all)
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/areas-activo.png');
							SETTINGS.filtros.push("28");
						}
						else
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/areas.png');
							SETTINGS.filtros.splice(SETTINGS.filtros.indexOf("28"),1);
						}
						break;
					case "deporte":
						if(SETTINGS.filtros.indexOf("29") == -1 && !all)
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/deporte-activo.png');
							SETTINGS.filtros.push("29");
						}
						else
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/deporte.png');
							SETTINGS.filtros.splice(SETTINGS.filtros.indexOf("29"),1);
						}
						break;
					case "cultura":
						if(SETTINGS.filtros.indexOf("27") == -1 && !all)
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/cultura-activo.png');
							SETTINGS.filtros.push("27");
						}
						else
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/cultura.png');
							SETTINGS.filtros.splice(SETTINGS.filtros.indexOf("27"),1);
						}
						break;
					case "habitacional":
						if(SETTINGS.filtros.indexOf("31") == -1 && !all)
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/habitacional-activo.png');
							SETTINGS.filtros.push("31");
						}
						else
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/habitacional.png');
							SETTINGS.filtros.splice(SETTINGS.filtros.indexOf("31"),1);
						}
						break;
					case "hidraulica":
						if(SETTINGS.filtros.indexOf("30") == -1 && !all)
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/hidraulica-activo.png');
							SETTINGS.filtros.push("30");
						}
						else
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/hidraulica.png');
							SETTINGS.filtros.splice(SETTINGS.filtros.indexOf("30"),1);
						}
						break;
					case "areayportuaria":
						if(SETTINGS.filtros.indexOf("24") == -1 && !all)
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/aereaymaritima-activo.png');
							SETTINGS.filtros.push("24");
						}
						else
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/aereaymaritima.png');
							SETTINGS.filtros.splice(SETTINGS.filtros.indexOf("24"),1);
						}
						break;
					case "salud":
						if(SETTINGS.filtros.indexOf("26") == -1 && !all)
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/salud-activo.png');
							SETTINGS.filtros.push("26");
						}
						else
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/salud.png');
							SETTINGS.filtros.splice(SETTINGS.filtros.indexOf("26"),1);
						}
						break;
					case "transterrerstre":
						if(SETTINGS.filtros.indexOf("23") == -1 && !all)
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/terrestre-activo.png');
							SETTINGS.filtros.push("23");
						}
						else
						{
							e.children('img').attr('src', 'CIU/public_html/images/iconos/terrestre.png');
							SETTINGS.filtros.splice(SETTINGS.filtros.indexOf("23"),1);
						}
						break;
				}
				if(SETTINGS.filtros.length > 0){
					PRIV.filtrar();
					SETTINGS.clear = true;
					PRIV.clear_btn();
				}
				else{
					PRIV.limpiar();
					SETTINGS.clear = false;
					PRIV.clear_btn();
				}
			},
			clear_all: function(e){
				$(".filter").each(function(){
					self.PUB.filter($(this).children('div'), true);
				});
				PRIV.limpiar();
				SETTINGS.clear = false;
				PRIV.clear_btn();
			}
		}
		// LLAMAMOS AL CONSTRUCTOR DE LA CLASE
		_CONSTRUCT(args);	
	}
	FILTER = new FILTRO();
})();