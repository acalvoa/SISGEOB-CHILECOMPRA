autodetect = function (){
	if(AUTODETECT()){
		// ACA CARGAMOS TODOS LOS OBJETOS QUE NECESITAN LA CONDICION DE 
		// DOCUMENTO LISTO A NIVEL DE ARBOL DOM
		// GENERALMENTE ESTE PARAMETRO CORRESPONDE A FUNCIONES QUE OPERAN CON EL ARBOL DOM Y SELECTORES
		
		//INTEGRAMOS LA COOKIE GEOCGR
		function setCookie(cname, cvalue) 
		{
		    document.cookie = cname + "=" + cvalue + ";"
		}
		setCookie('GEOCGR','OK');
		var getUrlParameter = function getUrlParameter(sParam) {
		    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		        sURLVariables = sPageURL.split('&'),
		        sParameterName,
		        i;

		    for (i = 0; i < sURLVariables.length; i++) {
		        sParameterName = sURLVariables[i].split('=');

		        if (sParameterName[0] === sParam) {
		            return sParameterName[1] === undefined ? true : sParameterName[1];
		        }
		    }
		};
		function mysql_real_escape_string (str) {
			return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
			    switch (char) {
			        case "\0":
			            return "\\0";
			        case "\x08":
			            return "\\b";
			        case "\x09":
			            return "\\t";
			        case "\x1a":
			            return "\\z";
			        case "\n":
			            return "\\n";
			        case "\r":
			            return "\\r";
			        case "\"":
			        case "'":
			        case "\\":
			        case "%":
			            return "\\"+char; // prepends a backslash to backslash, percent,
			                              // and double/single quotes
			    }
			});
		}
		//DECODIFICAMOS EL MENSAJE DE MP
		var MP = getUrlParameter('MP');
		MP = (MP != "" &&  typeof MP != "undefined")?getUrlParameter('MP'):"NOTMP";
		// INTEGRAMOS EL OBJETO GEOMAP
		MAPA = new GEOMAP({
			target: "gea",
			initLat: _CONFIG._MAP.LAT,
			initLng: _CONFIG._MAP.LNG,
			initZoom: _CONFIG._MAP.ZOOM,
			maxZoom: _CONFIG._MAP.MAXZOOM,
			minZoom: _CONFIG._MAP.MINZOOM,
			styled:true
		});
		MAPA_GRILLA = new GRILLA({
			_GEOMAP:MAPA
		});
		LEYENDA = new LEYEND();
		// INTEGRAMOS EL GRAFICO
		GRAFICOPANEL = new GRAFICOCLA({
			container: $("#clasificatab .grafico")
		});
		// INTEGRAMOS EL RANKING
		RANK = new RANKING({
			container: $("#ranking-table"),
			container_f: $("#ranking-f-table")
		});
		// CARGAMOS AL APP POPOVER
		POP = new POPOVER();
		// CARGAMOS EL APP DE ETIQUETA SUPERIOR DERECHA
		ETIPOP = new ETIQUETA({
			container: $(".etiqueta")
		});
		// CARGAMOS EL APP RESUMEN
		RESUPOP = new RESUMEN({
			container: $(".resumen")
		});
		//CARGAMOS LOS BUSCADORES
		SEARCHSIMPLE = new SEARCH();
		//CARGAMOS LA FICHA
		FICHAS = new FICHA();
		//CARGAMOS EL ADVA SEARCH
		BUSQUEDA = new ADVASEARCH();
		//CARGAMOS EL CLUSTER
		MCLUSTER = new CLUSTER();
		// INTEGRAMOS GEA
		GEA = new GEOCGR();
		if(MP == "NOTMP"){
			GEA.PUB._INIT(true);
		}
		else{
			GEA.PUB._SEARCH(mysql_real_escape_string(MP), function(){
				GEA.PUB._INIT(true);
			}, function(){
				GEA.PUB._INIT(true);
				GEA.PUB._SEARCH(mysql_real_escape_string(MP));
			});
		}
	}
}