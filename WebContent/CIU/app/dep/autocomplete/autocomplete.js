(function($){
    //DEFINIMOS LA ENTRADA DEL CODIGO EN JQUERY
    $.fn.autocomplete = function(PARAMS){
        //ACCIONES DEFAULT
        var _DEFAULTS =  {
            onChange: function(e){},
            onKeyup: function(e){},
            onFocus: function(e){},
            onBlur: function(e){},
            dataAction: function(e,request,handler,cache){},
            handler: function(data){},
            maxVisible: 10,
            content: null,
            minLength: 1,
            suggestHeight: 30,
            suggestArray: [],
            index:-1,
            selected: null,
            KEYPRESS: false,
            cache: {}
        };
        return this.each(function() {
            //ESTRTCTURA DE SINCRONIZACION
            var SYNC_STRUCT = {
                _BUSY: false,
                _ALLOCATE: 1,
                _QUEUED: [],
                _DO: function(action){
                    var args = [];
                    for(i=1;i<arguments.length;i++){
                        args.push(arguments[i]);
                    }
                    SYNC_STRUCT._QUEUED.push({
                        handler: action,
                        arg: args
                    });
                    SYNC_STRUCT._UNQUEUED();
                },
                _UNQUEUED: function(){
                    if(SYNC_STRUCT._QUEUED.length > 0){
                        var action = SYNC_STRUCT._QUEUED[0];
                        SYNC_STRUCT._QUEUED.splice(0,1);
                        action.handler.apply(this,action.arg);
                    }
                    SYNC_STRUCT._BUSY = !SYNC_STRUCT._BUSY;
                    return;
                },
                _FREE: function(){
                    if(SYNC_STRUCT._BUSY) return;
                    SYNC_STRUCT._BUSY = !SYNC_STRUCT._BUSY;
                    if(SYNC_STRUCT._ALLOCATE > 0){
                        SYNC_STRUCT._ALLOCATE--;    
                        var action = SYNC_STRUCT._QUEUED.splice(0,1);
                    }
                    else{
                        return;
                    }
                    if(SYNC_STRUCT._QUEUED > 0){
                        SYNC_STRUCT._UNQUEUED();
                    }
                },
                _FREEALL: function(){
                    SYNC_STRUCT._BUSY = false;
                    SYNC_STRUCT._ALLOCATE = 1;
                    SYNC_STRUCT._QUEUED = [];
                },
                _FFUNC: function(func){
                    var func_txt = func.toString();
                    var patt = new RegExp(/(\(.*\))/);
                    var args = patt.exec(func_txt)[0].replace(/(\(|\))/gi,"");
                    var args = (args !== "")? args+", SYNC":"SYNC";
                    func_txt = func_txt.replace(/function(.*){/i, '');
                    func_txt = func_txt.replace(/}$/gi,'\nSYNC._FREE();');
                    return new Function(args,func_txt);
                }
            }
            //DEFINIMOS LAS VARIABLES LOCALES
            var _SELF = this;
            //SETTINGS
            var _SETTINGS = {};
            //DEFINIMOS EL CONSTRUCTOR
            var _CONSTRUCT = function(PARAMS){
                //REEMPLAZAMOS LOS DEFAULTS CON LOS SETTINGS
                _SETTINGS = $.extend({},_DEFAULTS,PARAMS);
                // TRANSFORMAMOS LAS FUNCIONES
                    _SETTINGS.onKeyup = SYNC_STRUCT._FFUNC(_SETTINGS.onKeyup);
                    _SETTINGS.onChange = SYNC_STRUCT._FFUNC(_SETTINGS.onChange);
                    _SETTINGS.onFocus = SYNC_STRUCT._FFUNC(_SETTINGS.onFocus);
                    _SETTINGS.onBlur = SYNC_STRUCT._FFUNC(_SETTINGS.onBlur);
                    _SETTINGS.dataAction = SYNC_STRUCT._FFUNC(_SETTINGS.dataAction);
                //ASIGNAMOS LOS HANDLER DE EVENTOS
                $(_SELF).on('change',function(e,free){
                    SYNC_STRUCT._DO(_SETTINGS.onChange,e,SYNC_STRUCT);
                });
                $(_SELF).on('keyup',function(e){
                    if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13){
                        _SETTINGS.KEYPRESS = true;
                        e.preventDefault();
                        PRIV._ANALIZE_MOV(e.keyCode);
                    }
                    else
                    {
                        SYNC_STRUCT._DO(_SETTINGS.onKeyup,e,SYNC_STRUCT);
                        _SETTINGS.index = -1;
                        _SETTINGS.suggestArray = [];
                        _SETTINGS.content = $(_SELF).val();
                        if(_SETTINGS.content.length >= _SETTINGS.minLength){
                            SYNC_STRUCT._DO(_SETTINGS.dataAction,e,_SETTINGS.content,PRIV._HANDLER,_SETTINGS.cache,SYNC_STRUCT);
                        }
                        else
                        {
                            SYNC_STRUCT._DO(PRIV._NOT_FOCUS,e,SYNC_STRUCT);
                        }
                    }
                });
                $(_SELF).on('focus',function(e,free){
                    SYNC_STRUCT._DO(_SETTINGS.onFocus,e,SYNC_STRUCT);
                    SYNC_STRUCT._DO(PRIV._FOCUS,e,SYNC_STRUCT);
                });
                $(_SELF).on('blur',function(e,free){
                    SYNC_STRUCT._DO(_SETTINGS.onBlur,e,SYNC_STRUCT);
                    SYNC_STRUCT._DO(PRIV._NOT_FOCUS,e,SYNC_STRUCT);
                });
            };
            //DEFINIMOS LOS METODOS PRIVADOS
            var PRIV = {
                _HANDLER: function(data,request){
                    if(typeof request != "undefined")  _SETTINGS.cache[request] = data;
                    PRIV.display(data,SYNC_STRUCT);
                },
                display: function(data,SYNC_STRUCT){
                    //CARGAMOS POSICICONES RELATIVAS AL ELEMENTO
                    var offset = $(_SELF).offset();
                    var width = $(_SELF).css('width').replace("px","");
                    var height = $(_SELF).css('height').replace("px","");
                    //CCREAMOS EL OBJETO CON LAS VARIABLES CSS
                    var auto_css = {
                        top: (offset.top + parseInt(height)),
                        left: (offset.left - 1),
                        width: parseInt(width),
                        "max-height": (_SETTINGS.suggestHeight*_SETTINGS.maxVisible)+10
                    };
                    //CREAMOS EL ELEMENTO
                    $(".autocomplete-handler").remove();
                    var container = $("<div></div>",{
                        class: "autocomplete-handler" 
                    }).appendTo($('body')).css(auto_css).on('mouseleave',function(){
                        _SETTINGS.index = -1;
                    });
                    //INICIAMOS LOS CAMPOS INTEGRADOS
                    var elements = 0;
                    _SETTINGS.suggestArray = [];
                    for(i=0;i<data.length;i++){
                        var p = function(data,i){
                            // CREAMOS NUEVAS EXPRESIONES
                            var regex = new RegExp(_SETTINGS.content, "gi");
                            if(regex.test(data[i].data) && _SETTINGS.content != ""){
                                elements++;
                                var datastr = data[i].label.replace(regex,"<strong>"+_SETTINGS.content+"</strong>").toUpperCase();
                                var sug = $("<div>"+datastr+"</div>",{
                                    "data-id": i
                                }).css('height',(_SETTINGS.suggestHeight)).addClass('autocomplete-suggest').on('click',function(){
                                    $(_SELF).val(data[i].data);
                                    _SETTINGS.content = data[i].data;
                                    container.remove();
                                }).on('mouseenter',function(){
                                    if(!_SETTINGS.KEYPRESS){
                                        _SETTINGS.index = i;
                                        PRIV._RESET_SELECTED(_SETTINGS.suggestArray[i]);
                                    }
                                }).on('mouseleave',function(){
                                    if(!_SETTINGS.KEYPRESS){
                                    }
                                }).on('mousemove',function(e){
                                    _SETTINGS.KEYPRESS = false;
                                    e.stopPropagation();
                                }).appendTo(container);
                                if(sug.width > width){
                                    container.css("overflow-x","scroll");
                                }
                                _SETTINGS.suggestArray.push(sug);
                            }
                            return; 
                        }
                        p(data,i);
                    }
                    if(elements > 10){
                        container.css("overflow-y","scroll");
                    }
                    else if(elements == 0){
                        $(".autocomplete-handler").remove();
                    }
                    //LIBERAMOS EL SEGURO
                    SYNC_STRUCT._FREE();
                },
                _ANALIZE_MOV: function(code){
                    if(_SETTINGS.suggestArray.length == 0) return;
                    if(code == 13)
                    {
                        if(_SETTINGS.selected == null) return;
                        _SETTINGS.selected.trigger('click');
                    }
                    else if(code == 38){
                        //UP BOTTON
                        if(_SETTINGS.index <= 0) return;
                        PRIV._RESET_SELECTED(_SETTINGS.suggestArray[--_SETTINGS.index]);
                        if(_SETTINGS.index < 10) $(".autocomplete-handler").scrollTop(0);
                        if(_SETTINGS.index >= 10) $(".autocomplete-handler").scrollTop((_SETTINGS.index-(_SETTINGS.maxVisible-1))*_SETTINGS.suggestHeight);
                    }
                    else if(code == 40)
                    {
                        //DOWN BOTTON
                        if(_SETTINGS.index >= _SETTINGS.suggestArray.length) return;
                        PRIV._RESET_SELECTED(_SETTINGS.suggestArray[++_SETTINGS.index]);
                        if(_SETTINGS.index >= 10) $(".autocomplete-handler").scrollTop((_SETTINGS.index-(_SETTINGS.maxVisible-1))*_SETTINGS.suggestHeight);
                    }
                },
                _RESET_SELECTED: function(SELECTED){
                    if(_SETTINGS.selected != null) _SETTINGS.selected.css('background','#FFF');
                    _SETTINGS.selected = SELECTED;
                    if(typeof _SETTINGS.selected.css != "undefined") _SETTINGS.selected.css('background',"#EEE");
                },
                _NOT_FOCUS: function(e,SYNC_STRUCT){
                    if(_SETTINGS.index != -1){
                        _SETTINGS.selected.trigger('click');
                    }
                    else{
                        $(".autocomplete-handler").remove();
                    }   
                    SYNC_STRUCT._FREEALL();
                },
                _FOCUS: function(e,SYNC_STRUCT){
                     if(_SETTINGS.content != "" && _SETTINGS.content != null && _SETTINGS.content.length >= _SETTINGS.minLength){
                        _SETTINGS.index = -1;
                        _SETTINGS.suggestArray = [];
                        SYNC_STRUCT._DO(_SETTINGS.dataAction,e,_SETTINGS.content,PRIV._HANDLER,_SETTINGS.cache,SYNC_STRUCT);
                    }
                }
            }
            //DEFINIMOS METODOS PUBLICOS
            this.PUB = {

            }
            _CONSTRUCT(PARAMS);
        });
    }
}(jQuery));