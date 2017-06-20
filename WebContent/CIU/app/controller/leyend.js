(function(){
	/**
	* AUTHOR: ANGELO CALVO A
	* DEPENDENCY = 
	* DESCRIPTION: LIBRARY TO SET THE LEYEND AND THE ICON DESITION COLOR AND SELECTION
	*/
	LEYEND = function(args){
		/* LIBRARY VARS */
		var _SELF = this;
		var _ACTIVE_TYPE;
		var _LEYEND_COLOR;
		var _TYPE_ELEMENT;
		// CONSTRUCTOR
		var _CONSTRUCT = function(args){
			_LEYEND_COLOR = {};
			_TYPE_ELEMENT = {};
			_ACTIVE_TYPE = null;
		};
		/*PRIVATE METHODS*/
		var PRIV = {
		};
		/*PUBLIC METHODS*/
		var PUB = {
			SET_LEYEND_TYPE: function(TYPE,CE){
				_LEYEND_COLOR[TYPE] = {
					NORMAL:{},
					SPECIAL:{},
					CE:CE
				};
			},
			SET_ELEMENT_TYPE: function(TYPE, CALLBACK){
				_TYPE_ELEMENT[TYPE] = CALLBACK;
			},
			ADD_LEYEND: function(TYPE,COLOR){
				if(typeof _LEYEND_COLOR[TYPE] == "undefined"){
					throw new Error("ERROR LIB LEYEND: TYPE NOT FOUND");
				}
				var size = Object.keys(_LEYEND_COLOR[TYPE].NORMAL).length;
				_LEYEND_COLOR[TYPE].NORMAL[(size+1)] = COLOR;
			},
			ADD_SPECIAL_LEYEND: function(TYPE, ELEMENT, LABEL){
				if(typeof _LEYEND_COLOR[TYPE] == "undefined" && LABEL == "undefined"){
					throw new Error("ERROR LIB LEYEND: TYPE OR LABEL NOT FOUND");
				}
				_LEYEND_COLOR[TYPE].SPECIAL[LABEL] = ELEMENT;
			},
			GET_ELEMENT: function(TYPE,AMOUNT,TOTAL){
				if(!_LEYEND_COLOR[_ACTIVE_TYPE].CE){
					throw new Error("CAN'T GENERATE ELEMENT IN THIS LEVEL.");
				}
				var key = Object.keys(_LEYEND_COLOR[_ACTIVE_TYPE].NORMAL).length;
				var segmento = Math.floor(TOTAL/key);
				var T_segmento = Math.ceil(AMOUNT/segmento);
				if(T_segmento == 0) T_segmento = 1;
				if(T_segmento > key) T_segmento = key;
				return _TYPE_ELEMENT[TYPE](_LEYEND_COLOR[_ACTIVE_TYPE].NORMAL[T_segmento]);
			},
			GET_SPECIAL_ELEMENT: function(TYPE,ETYPE){
				if(typeof _LEYEND_COLOR[_ACTIVE_TYPE].SPECIAL[ETYPE] == "undefined" || typeof _TYPE_ELEMENT[TYPE] == "undefined"){
					throw new Error("ERROR LIB LEYEND: TYPE NOT FOUND OR SPECIAL NOT A COLOR");
				}
				return _TYPE_ELEMENT[TYPE](_LEYEND_COLOR[_ACTIVE_TYPE].SPECIAL[ETYPE]);
			},
			GET_COLOR: function(AMOUNT,TOTAL){
				if(_ACTIVE_TYPE == null || !_LEYEND_COLOR[_ACTIVE_TYPE].NORMAL){
					throw new Error("CAN'T GET COLOR. LEVEL IS NOT DEFINED");
				}
				var key = Object.keys(_LEYEND_COLOR[_ACTIVE_TYPE].NORMAL).length;
				var segmento = Math.floor(TOTAL/key);
				var T_segmento = Math.ceil(AMOUNT/segmento);
				return _LEYEND_COLOR[_ACTIVE_TYPE].NORMAL[T_segmento];
			},
			RENDER: function(TYPE){
				if(typeof _LEYEND_COLOR[TYPE] == "undefined"){
					throw new Error("ERROR LIB LEYEND: TYPE NOT FOUND");
				}
				_ACTIVE_TYPE = TYPE;
			}
		};

		/* INSTANCE PUBLIC METHODS */
		var _INIT = function(){
			for(key in PUB){
				if(typeof PUB[key] == "function"){
					_SELF[key] = PUB[key];
				}
			}	
		};
		/* CALL TO CONSTRUCTOR*/
		_INIT();
		_CONSTRUCT(args);
	};
})();