GEOCGRAPP
	.controller('control', function(){
		this.zoomIn = function(e){
			MAPA.publics.setZoom(MAPA.publics.getZoom()+1);
		}
		this.zoomOut = function(e){
			MAPA.publics.setZoom(MAPA.publics.getZoom()-1);
		}
		this.country = function(e){
			RESUPOP.PUB.RESTORE_LVL();
			GEA.PUB.dpaChile();
		}
		this.provincia = function(e){
			RESUPOP.PUB.RESTORE_LVL();
			GEA.PUB.dpaProvincial();
		}
		this.region= function(e){
			RESUPOP.PUB.RESTORE_LVL();
			GEA.PUB.dpaRegion();
		}
		this.comuna = function(e){
			RESUPOP.PUB.RESTORE_LVL();
			GEA.PUB.dpaComunal();
		}
	});