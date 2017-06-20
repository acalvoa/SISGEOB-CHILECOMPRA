GEOCGRAPP
	.controller('control', function(){
		this.zoomIn = function(e){
			MAPA.publics.setZoom(MAPA.publics.getZoom()+1);
		}
		this.zoomOut = function(e){
			MAPA.publics.setZoom(MAPA.publics.getZoom()-1);
		//	alert();
		}
		this.country = function(e){
			GEA.PUB.dpaChile();
		}
		this.provincia = function(e){
			GEA.PUB.dpaProvincial();
		}
		this.region= function(e){
			GEA.PUB.dpaRegion();
		}
		this.comuna = function(e){
			GEA.PUB.dpaComunal();
		}
	});