(function(){
	/**
	* AUTHOR: ANGELO CALVO A
	* DEPENDENCY = GEOMAP
	* DESCRIPTION: Libreria para clusterizar los puntos en el mapa y evitar sobreposicion.
	*/
	GRILLA = function(args){
		/* LIBRARY VARS */
		var _SELF = this;
		var _COORD_MAP;
		var _COORD_LIST;
		var _GEOMAP;
		var _MULTIPOINT;
		var _BUSY;
		// CONSTRUCTOR
		var _CONSTRUCT = function(args){
			_COORD_MAP = {};
			_LINE_LIST = [];
			_COORD_LIST = [];
			_MULTIGEO = {};
			_BUSY = [];
			_ELEMENTS = 0;
			_GEOMAP = args._GEOMAP;
		};
		/*PROTOTIPO DE OBJETO DE UBICACIÓN*/ 
		var GOBJECT = {
			ICON: null,
			INFOWIN: null,
			SICON:
			{
				"PT": {
					path: google.maps.SymbolPath.CIRCLE,
			      	scale: 8,
				  	strokeWeight: 1,
				  	strokeColor: "#FFF",
				  	fillColor: "#FF9C00",
				  	fillOpacity: 1
			    },
			    "PL": {
			    	CONTENT: "#FF9C00",
			    	BORDER: "#FFF"
			    }
			},
		    CLASIFICACION: null,
		    DATA: {},
		    EVENTS: {},
		    MULTIGEO: null
		};
		/*PRIVATE METHODS*/
		var PRIV = {
			/*METODO PARA AGREGAR UN PUNTO A LA GRILLA, LIGADO A UN OBJETO EN PARTICULAR*/
			ADD_ELEMENT_POINT: function(LAT, LONG){
				return _GEOMAP.publics.load_point(LAT,LONG);
			},
			ADD_ELEMENT_LINE: function(LINE){
				return _GEOMAP.publics.load_line(LINE);
			},
			MAKE_COORD: function(ELEMENT, GEOELEMENT){
				GEOELEMENT.GPOINTER = function(){
					return ELEMENT;
				};
				return GEOELEMENT;
			},
			CHANGE_USED: function(DATA,ELEMENT){
				if(DATA.MULTIGEO != null){
					for(l=0;l<DATA.MULTIGEO.length;l++){
						if(typeof DATA.ICON.USED != "undefined" && typeof DATA.ICON.USED != "undefined"){
							if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.ICON.USED);
						}
						else{
							if(DATA.MULTIGEO[l].GTYPE == "PT") DATA.MULTIGEO[l].setIcon(DATA.SICON.PT);
							if(DATA.MULTIGEO[l].GTYPE == "PL") DATA.MULTIGEO[l]._SET_COLOR(DATA.SICON.PL.CONTENT,DATA.SICON.PL.BORDER);
						}							
					}
				}
				else
				{
					if(typeof DATA.ICON.USED != "undefined" && typeof DATA.ICON.USED != "undefined"){
						if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.ICON.USED);
					}
					else{
						if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.SICON.PT);
						if(DATA.GTYPE == "PL") ELEMENT._SET_COLOR(DATA.SICON.PL.CONTENT,DATA.SICON.PL.BORDER);
					}
				}
			},
			CHANGE_UNUSED: function(DATA,ELEMENT, DEL){
				if(DATA.MULTIGEO != null && typeof DEL == "undefined"){
					for(l=0;l<DATA.MULTIGEO.length;l++){
						if(typeof DATA.ICON.USED != "undefined" && typeof DATA.ICON.UNUSED != "undefined"){
							if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.ICON.UNUSED);
						}
						else{
							if(DATA.MULTIGEO[l].GTYPE == "PT") DATA.MULTIGEO[l].setIcon(DATA.ICON);
							if(DATA.MULTIGEO[l].GTYPE == "PL") DATA.MULTIGEO[l]._SET_COLOR(DATA.ICON.CONTENT,DATA.ICON.BORDER);
						}
					}
				}
				else
				{
					if(typeof DATA.ICON.USED != "undefined" && typeof DATA.ICON.UNUSED != "undefined"){
						if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.ICON.UNUSED);
					}
					else{
						if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.ICON);
						if(DATA.GTYPE == "PL") ELEMENT._SET_COLOR(DATA.ICON.CONTENT,DATA.ICON.BORDER);
					}
				}
			},
			MAKE_MULTI_VIEW: function(ELEMENT, DATA_F, CLEAN){
				ELEMENT.BUSY = false;
				var DATA = (typeof DATA_F != "undefined")? DATA_F[0]:ELEMENT.GPOINTER()[0];
				if(typeof DATA.ICON.USED != "undefined" && typeof DATA.ICON.UNUSED != "undefined"){
					if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.ICON.UNUSED);
				}
				else
				{
					if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.ICON);
					if(DATA.GTYPE == "PL") ELEMENT._SET_COLOR(DATA.ICON.CONTENT,DATA.ICON.BORDER);
				}
				if(typeof CLEAN != "undefined") ELEMENT._CLEAR_EVENT();
				ELEMENT._EVENT('click',function(){
					PUB.RESTORE_BUSY();
					RESUPOP.PUB.RESTORE(1);
					PRIV.CREATE_MULTI_WIN(DATA,ELEMENT);
					if(DATA.INFOWIN != null && DATA.GTYPE == "PT") ELEMENT._SHOW_INFOWIN(DATA.INFOWIN,"point");
					if(DATA.INFOWIN != null && DATA.GTYPE == "PL") ELEMENT._SHOW_INFOWIN(DATA.INFOWIN,"line");
					PRIV.CHANGE_USED(DATA,ELEMENT);
					if(DATA.MULTIGEO != null){
						for(g=0;g<DATA.MULTIGEO.length;g++){
							DATA.MULTIGEO[g].BUSY = true;
							_BUSY.push(DATA.MULTIGEO[g]);
						}
					}
					else{
						ELEMENT.BUSY = true;
						_BUSY.push(ELEMENT);
					}
				});
				ELEMENT._EVENT('mouseover',function(){
					if(!ELEMENT.BUSY){
						PRIV.CHANGE_USED(DATA,ELEMENT);
					}
				});
				ELEMENT._EVENT('mouseout',function(){
					if(!ELEMENT.BUSY){
						PRIV.CHANGE_UNUSED(DATA,ELEMENT);
					}
				});
				//CARGAMOS LOS EVENTOS.
				for(key in DATA.EVENTS){
					ELEMENT._EVENT(key,DATA.EVENTS[key]);
				}
				ELEMENT.RESTORE = function(){
					ELEMENT.BUSY = false;
					PRIV.CHANGE_UNUSED(DATA,ELEMENT);
				}
				ELEMENT.RESTOREONCE = function(){
					ELEMENT.BUSY = false;
					PRIV.CHANGE_UNUSED(DATA,ELEMENT, true);
				}
			},
			MAKE_MONO_VIEW: function(ELEMENT, DATA_F, CLEAN){
				ELEMENT.BUSY = false;
				var DATA = (typeof DATA_F != "undefined")? DATA_F[0]:ELEMENT.GPOINTER()[0];
				if(typeof DATA.ICON.USED != "undefined" && typeof DATA.ICON.UNUSED != "undefined"){
					if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.ICON.UNUSED);
				}
				else
				{
					if(DATA.GTYPE == "PT") ELEMENT.setIcon(DATA.ICON);
					if(DATA.GTYPE == "PL") ELEMENT._SET_COLOR(DATA.ICON.CONTENT,DATA.ICON.BORDER);
				}
				if(typeof CLEAN != "undefined") ELEMENT._CLEAR_EVENT();
				ELEMENT._EVENT('click',function(){
					PUB.RESTORE_BUSY();
					RESUPOP.PUB.RESTORE(1);
					PRIV.CREATE_MONO_WIN(DATA,ELEMENT);
					if(DATA.INFOWIN != null && DATA.GTYPE == "PT") ELEMENT._SHOW_INFOWIN(DATA.INFOWIN,"point");
					if(DATA.INFOWIN != null && DATA.GTYPE == "PL") ELEMENT._SHOW_INFOWIN(DATA.INFOWIN,"line");
					PRIV.CHANGE_USED(DATA,ELEMENT);
					if(DATA.TYPE == "C"){
						RESUPOP.PUB.SET_COMUNAL_VIEW(DATA.DATA, DATA.UPPER_LAYER);
					}
					else if(DATA.TYPE == "P"){
						RESUPOP.PUB.SET_PROVINCIAL_VIEW(DATA.DATA, DATA.UPPER_LAYER);
					}
					if(DATA.MULTIGEO != null){
						for(g=0;g<DATA.MULTIGEO.length;g++){
							DATA.MULTIGEO[g].BUSY = true;
							_BUSY.push(DATA.MULTIGEO[g]);
						}
					}
					else{
						ELEMENT.BUSY = true;
						_BUSY.push(ELEMENT);
					}
				});
				ELEMENT._EVENT('mouseover',function(){
					if(!ELEMENT.BUSY){
						PRIV.CHANGE_USED(DATA,ELEMENT);
					}
				});
				ELEMENT._EVENT('mouseout',function(){
					if(!ELEMENT.BUSY){
						PRIV.CHANGE_UNUSED(DATA,ELEMENT);
					}
				});
				//CARGAMOS LOS EVENTOS.
				for(key in DATA.EVENTS){
					ELEMENT._EVENT(key,DATA.EVENTS[key]);
				}
				ELEMENT.RESTORE = function(){
					ELEMENT.BUSY = false;
					PRIV.CHANGE_UNUSED(DATA,ELEMENT);
				}
				ELEMENT.RESTOREONCE = function(){
					ELEMENT.BUSY = false;
					PRIV.CHANGE_UNUSED(DATA,ELEMENT, true);
				}
			},
			CREATE_MONO_WIN: function(DATA, ELEMENT){
				
				DATA.SET_INFOWIN(new GEOBOX({
			        content: INFOPOP(DATA.DATA),
			        height: 250,
			        width: 400,
			        close: function(){
			        	if(DATA.MULTIGEO != null) {
			        		PUB.RESTORE_BUSY();
			        	}
			        	else
			        	{
			        		ELEMENT.RESTORE();
			        		
			        	}
						RESUPOP.PUB.RESTORE();
						
						$(".panel-item").hide();
						$("#clasificatab").show();
			        }
			    }));
			},
			CREATE_MULTI_WIN: function(DATA, ELEMENT, DATA_F){
				DATA.SET_INFOWIN(new GEOBOX({
			        content: INFOPOP((typeof DATA_F != "undefined")?DATA_F:ELEMENT.GPOINTER()),
			        height: 310,
			        width: 400,
			        close: function(){
			        	if(DATA.MULTIGEO != null) {
			        		PUB.RESTORE_BUSY();
			        	}
			        	else
			        	{
			        		ELEMENT.RESTORE();
			        	}
						RESUPOP.PUB.RESTORE();
						$(".panel-item").hide();
						$("#clasificatab").show();
			        }
			    }));
			}
		};
		/*PUBLIC METHODS*/
		var PUB = {
			SET_MICON: function(ICON){
				_MULTIPOINT = ICON;
			},
			ADD_POINT: function(LAT, LONG, PROPS){
				if(typeof _COORD_MAP[LAT+","+LONG] == "undefined"){
					_COORD_MAP[LAT+","+LONG] = {
						G: null,
						O: []
					};
					_COORD_MAP[LAT+","+LONG].G = PRIV.MAKE_COORD(_COORD_MAP[LAT+","+LONG].O, PRIV.ADD_ELEMENT_POINT(LAT,LONG));
					_COORD_LIST.push(_COORD_MAP[LAT+","+LONG].G);
				}
				PROPS.GTYPE = "PT";
				_COORD_MAP[LAT+","+LONG].O.push(PROPS);
				_ELEMENTS++;
				return _COORD_MAP[LAT+","+LONG];
			},
			ADD_LINE: function(LINE, PROPS){
				PROPS.GTYPE = "PL";
				var TELEMENT = {
					G: null,
					O: [PROPS]
				};
				TELEMENT.G = PRIV.MAKE_COORD(TELEMENT.O, PRIV.ADD_ELEMENT_LINE(LINE));
				_COORD_LIST.push(TELEMENT.G);
				_LINE_LIST[_LINE_LIST.length] = TELEMENT.O;
				_ELEMENTS++;
				return TELEMENT;
			},
			ADD_MULTIGEO: function(){
				var key = Object.keys(_MULTIGEO).length;
				_MULTIGEO[key] = [];
				return key;
			},
			ADD_MULTIGEO_LINE: function(LINE, PROPS, HASH){
				PROPS.GTYPE = "PL";
				PROPS.MULTIGEO = _MULTIGEO[HASH];
				var TELEMENT = {
					G: null,
					O: [PROPS]
				};
				// _LINE_LIST[_LINE_LIST.length] = [PROPS];
				TELEMENT.G = PRIV.MAKE_COORD(TELEMENT.O, PRIV.ADD_ELEMENT_LINE(LINE));
				TELEMENT.G.GTYPE = "PL";
				_MULTIGEO[HASH].push(TELEMENT.G);
				_COORD_LIST.push(TELEMENT.G);
				_LINE_LIST[_LINE_LIST.length] = TELEMENT.O;
				_ELEMENTS++;
				return TELEMENT;
			},
			ADD_MULTIGEO_POINT: function(LAT, LONG, PROPS, HASH){
				PROPS.GTYPE = "PT";
				PROPS.MULTIGEO = _MULTIGEO[HASH];
				if(typeof _COORD_MAP[LAT+","+LONG] == "undefined"){
					_COORD_MAP[LAT+","+LONG] = {
						G: null,
						O: []
					};
					_COORD_MAP[LAT+","+LONG].G = PRIV.MAKE_COORD(_COORD_MAP[LAT+","+LONG].O, PRIV.ADD_ELEMENT_POINT(LAT,LONG));
					_COORD_MAP[LAT+","+LONG].G.GTYPE = "PT";
					_MULTIGEO[HASH].push(_COORD_MAP[LAT+","+LONG].G);
					_COORD_LIST.push(_COORD_MAP[LAT+","+LONG].G);
				}
				_COORD_MAP[LAT+","+LONG].O.push(PROPS);
				_ELEMENTS++;
				return _COORD_MAP[LAT+","+LONG];
			},
			RENDER: function(activate){
				for(k=0; k<_COORD_LIST.length; k++){
					if(_COORD_LIST[k].GPOINTER().length == 1){

						PRIV.MAKE_MONO_VIEW(_COORD_LIST[k]);
					}
					else
					{
						PRIV.MAKE_MULTI_VIEW(_COORD_LIST[k]);
					}
					if(k == (_COORD_LIST.length-1)){
						_COORD_LIST[k]._RENDER(activate);
					} 
					else
					{
						_COORD_LIST[k]._RENDER();
					}
				}
			},
			RENDER_BY: function(CAT,VALUE){
				for(k=0; k<_COORD_LIST.length; k++){
					var temp = [];
					var ob = _COORD_LIST[k].GPOINTER();
					for(j=0;j<ob.length;j++){
						if(ob[j].DATA[CAT] == VALUE){
							temp.push(ob[j]);
						}
					}
					if(temp.length == 1){

						PRIV.MAKE_MONO_VIEW(_COORD_LIST[k],temp,true);
						_COORD_LIST[k]._RENDER();
					}
					else if(temp.length > 1)
					{
						PRIV.MAKE_MULTI_VIEW(_COORD_LIST[k],temp,true);
						_COORD_LIST[k]._RENDER();
					}
				}
			},
			CLEAN: function(){
				for(l=0; l<_COORD_LIST.length; l++){
					_COORD_LIST[l]._CLEAN();
				}
			},
			FULL_CLEAN: function(){
				PUB.CLEAN();
				_COORD_MAP = {};
				_LINE_LIST = [];
				_COORD_LIST = [];
				_MULTIGEO = {};
				_BUSY = [];
				_ELEMENTS = 0;
			},
			MAKE_GOBJECT: function(ICON,DATA,TYPE, UPPER_LAYER, UPPER_METADATA){
				var NEW_GOBJECT = $.extend({}, GOBJECT, {
					CLASIFICACION : DATA.CLASIFICACION,
					ICON: ICON,
					DATA: DATA,
					TYPE: TYPE,
					UPPER_LAYER: UPPER_LAYER,
					UPPER_METADATA: UPPER_METADATA
				});
				NEW_GOBJECT.SET_ICON = function(ICON){
					NEW_GOBJECT.SICON = ICON;
				};
				NEW_GOBJECT.SET_SICON = function(ICON){
					NEW_GOBJECT.ICON = ICON;
				};
				NEW_GOBJECT.SET_EVENT = function(EVENT, ACTION){
					NEW_GOBJECT.EVENTS[EVENT] = ACTION;
				};
				NEW_GOBJECT.SET_INFOWIN = function(ACTION){
					NEW_GOBJECT.INFOWIN = ACTION;
				};
				return NEW_GOBJECT;
			},
			RESTORE_BUSY: function(){
				for(i=0;i<_BUSY.length;i++){
					_BUSY[i].RESTOREONCE();
				}
				_BUSY = [];
			}
		};

		/* INSTANCE PUBLIC METHODS */
		var _INIT = function(){
			for(key in PUB){
				if(typeof PUB[key] == "function"){
					_SELF[key] = PUB[key];
				}
			}	
		}
		/* CALL TO CONSTRUCTOR*/
		_INIT();
		_CONSTRUCT(args);
	}
})();