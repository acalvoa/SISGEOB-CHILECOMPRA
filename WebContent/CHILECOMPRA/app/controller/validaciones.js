var app = GEOCGRAPP;

app.directive('ccselect', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			$(elm[0]).css({
				"padding-left":"20px"
			})
			
			var conte = $("<div></div>").addClass("checkout").appendTo($(elm[0]).parent());
			$("<i></i>").addClass("fa fa-times error").appendTo(conte);
			
			// VALIDADOR
			ctrl.$validators.ccselect = function(modelValue, viewValue) {
				if(modelValue == "-1" || typeof modelValue == "undefined") {
					$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
					
					return false;
				} else {
					$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
					
					return true;
				}
			};
		}
	};
});

app.directive('cctextbox', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			$(elm[0]).css({
				"padding-left":"20px"
			})
			
			var conte = $("<div></div>").addClass("checkout").appendTo($(elm[0]).parent());
			$("<i></i>").addClass("fa fa-times error").appendTo(conte);
			
			// VALIDADOR
			ctrl.$validators.cctextbox = function(modelValue, viewValue) {
				if(modelValue == "" || typeof modelValue == "undefined" || modelValue == " " || modelValue == null) {
					$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
					
					return false;
				} else {
					$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
					
					return true;
				}
			};
		}
	};
});

app.directive('cctextboxnumber', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			$(elm[0]).css({
				"padding-left": "20px"
			})
			
			var conte = $("<div></div>").addClass("checkout").appendTo($(elm[0]).parent());
			$("<i></i>").addClass("fa fa-times error").appendTo(conte);
			
			// VALIDADOR
			ctrl.$validators.cctextbox = function(modelValue, viewValue) {
				if( modelValue == "" || typeof modelValue == "undefined" || modelValue == " " || modelValue == null || isNaN(modelValue.replace(/\./g,"")) ) {
					$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
					return false;
				} else {
					$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
					return true;
				}
			};
		}
	};
});

app.directive('ccservicios', function($q) {
	return {
		require: '?ngModel',
		link: function(scope, elm, attrs, ngModel) {
			$(elm[0]).css({
				"padding-left":"20px"
			})
			
			var conte = $("<div></div>").addClass("checkout").appendTo($(elm[0]).parent());
			$("<i></i>").addClass("fa fa-times error").appendTo(conte);
			scope["formlinea"][elm.attr('name')].$setValidity("cctextbox", false);
			
			// VALIDADOR
			ngModel.$validators.cctextbox = function(modelValue, viewValue) {
				if( modelValue != "" && typeof modelValue != "undefined" ) {
					return true;
				} else {
					$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
					return false;
				}
			}
			
			ngModel.$asyncValidators.ccservicio = function(modelValue, viewValue) {
				var def = $q.defer();
				
				if( typeof modelValue == "undefined" || modelValue.length <= 5 ) {
					return $q.when();
				}
				
				SOCKET.request({
					request: "utils/validateService",
					data: {
						SERVICIO: modelValue
					},
					callback: function(result) {
						if( result.status ) {
							$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
							def.resolve();
						} else {
							$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
							def.reject();
						}
					}
				});
				
				return def.promise;
			};
		}
	};
});

app.directive('cccomuna', function($q) {
	return {
		require: '?ngModel',
		link: function(scope, elm, attrs, ngModel) {
			$(elm[0]).css({
				"padding-left":"20px"
			})
			
			var conte = $("<div></div>").addClass("checkout").appendTo($(elm[0]).parent());
			$("<i></i>").addClass("fa fa-times error").appendTo(conte);
			scope["formlinea"].comunas.$setValidity("cccomuna", false);
			
			// VALIDADOR
		}
	};
});

app.directive('ccdatefinish', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			$(elm[0]).css({
				"padding-left":"20px"
			})
			
			var conte = $("<div></div>").addClass("checkout").appendTo($(elm[0]).parent());
			$("<i></i>").addClass("fa fa-times error").appendTo(conte);
			
			// VALIDADOR
			ctrl.$validators.cctextbox = function(modelValue, viewValue) {
				if( modelValue == "" || typeof modelValue == "undefined" || modelValue == " " || modelValue == null ) {
					$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
					return false;
				} else {
					$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
					return true;
				}
			};
			
			ctrl.$validators.validdate = function(modelValue,viewValue) {
				if(modelValue != "" && typeof modelValue != "undefined" && modelValue.length > 0) {
					var fechainit = $("#picker-inicio").val().split("/");
					var fechafinish = modelValue.split("/");
					
					if(Date.parse(fechainit[1]+"/"+fechainit[0]+"/"+fechainit[2]) <= Date.parse(fechafinish[1]+"/"+fechafinish[0]+"/"+fechafinish[2])) {
						return true;
					} else {
						$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
						
						return false;
					}
				}
				
				return true;
			}
		}
	};
});

app.directive('cccodigobip', function($q) {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			$(elm[0]).css({
				"padding-left":"20px"
			})
			
			var conte = $("<div></div>").addClass("checkout").appendTo($(elm[0]).parent());
			scope["formlinea"].codigobip.$setValidity("codigo", true);
			
			
			// VALIDADOR DE FORMATO
			ctrl.$validators.codigo = function(modelValue, viewValue) {
				if((isNaN(modelValue)  && typeof modelValue != "undefined" && modelValue.length > 0) || (typeof modelValue != "undefined" && modelValue.length > 0 && modelValue.length != 8)){
					if(scope["formlinea"].vcodigobip.$valid && scope["formlinea"].vcodigobip.$modelValue != "" && typeof scope["formlinea"].vcodigobip.$modelValue != "undefined") {
						$("<i></i>").addClass("fa fa-times error").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".vcodigobip").children(".checkout").empty());
					} else {
						$("<i></i>").addClass("fa fa-times error").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-times error").appendTo($(".vcodigobip").children(".checkout").empty());
						scope["formlinea"].vcodigobip.$setValidity("codigo", false);
					}
					
					return false;
				}  else {
					if((typeof modelValue == "undefined" || modelValue.length == 0) && (isNaN(scope["formlinea"].vcodigobip.$modelValue ) || typeof scope["formlinea"].vcodigobip.$modelValue == "undefined" || scope["formlinea"].vcodigobip.$modelValue.length == 0)) {
						$(".codigobip").children(".checkout").empty();
						$(".vcodigobip").children(".checkout").empty();
						scope["formlinea"].vcodigobip.$setValidity("codigo", true);
						scope["formlinea"].vcodigobip.$setValidity("mideso", true);
					} else if((modelValue.length == 0 || typeof modelValue == "undefined") && scope["formlinea"].vcodigobip.$valid && (typeof scope["formlinea"].vcodigobip.$modelValue != "undefined" && scope["formlinea"].vcodigobip.$modelValue.length != 0)) {
						$("<i></i>").addClass("fa fa-times error").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigobip").children(".checkout").empty());
						
						return false;
					} else if(scope["formlinea"].vcodigobip.$valid && (typeof scope["formlinea"].vcodigobip.$modelValue != "undefined" && scope["formlinea"].vcodigobip.$modelValue.length != 0)) {
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".vcodigobip").children(".checkout").empty());
					} else if(!scope["formlinea"].vcodigobip.$valid && (typeof scope["formlinea"].vcodigobip.$modelValue != "undefined" && scope["formlinea"].vcodigobip.$modelValue.length != 0)) {
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-times error").appendTo($(".vcodigobip").children(".checkout").empty());
						scope["formlinea"].vcodigobip.$setValidity("codigo", false);
					} else if((modelValue.length != 0 && typeof modelValue != "undefined") && (typeof scope["formlinea"].vcodigobip.$modelValue == "undefined" || scope["formlinea"].vcodigobip.$modelValue.length == 0)) {
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-times error").appendTo($(".vcodigobip").children(".checkout").empty());
						scope["formlinea"].vcodigobip.$setValidity("codigo", false);
					}
					
					return true;
				}
			};
			
			// VALIDADOR DE EXISTENCIA
			ctrl.$asyncValidators.mideso = function(modelValue, viewValue) {
				var def = $q.defer();
				
				if( typeof modelValue == "undefined" || modelValue.length <= 7 ) {
					return $q.when();
				}
				if(typeof scope["formlinea"].vcodigobip.$error.codigo != "undefined" && scope["formlinea"].vcodigobip.$error.codigo){
					return $q.when();
				}
				//INGRESANDO MENSAJE
				LOADING.message("Validando codigo BIP, espere por favor...");
				LOADING.show();	
				//VALIDANDO EL CODIGO
				SOCKET.request({
					request: "mideso/consultaIDI", 
					data: {
						SERVICIO: modelValue,
						VCODBIP: scope["formlinea"].vcodigobip.$modelValue
					},
					callback: function(result) {
						LOADING.hide();
						if( result.status==1 || result.status=="") {
							$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
							scope["formlinea"].vcodigobip.$setValidity("mideso", true);
							$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigobip").children(".checkout").empty());
							$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".vcodigobip").children(".checkout").empty());
							def.resolve();
						} else {
							$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
							$("<i></i>").addClass("fa fa-times error").appendTo($(".codigobip").children(".checkout").empty());
							$("<i></i>").addClass("fa fa-times error").appendTo($(".vcodigobip").children(".checkout").empty());
							scope["formlinea"].vcodigobip.$setValidity("mideso", false);
							def.reject();
						}
					}
				});
				
				return def.promise;
			};
		}
	};
});

app.directive('ccvbip', function($q) {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			$(elm[0]).css({
				"padding-left":"20px"
			})
			
			var conte = $("<div></div>").addClass("checkout").appendTo($(elm[0]).parent());
			scope["formlinea"].vcodigobip.$setValidity("codigo", true);
			
			// VALIDADOR
			ctrl.$validators.codigo = function(modelValue, viewValue) {
				if(modelValue == 0 || modelValue == 1 || modelValue == "" || typeof modelValue == "undefined") {
					if((modelValue == "" || typeof modelValue == "undefined" || isNaN(modelValue))  && (scope["formlinea"].codigobip.$modelValue == "" || typeof scope["formlinea"].codigobip.$modelValue == "undefined")) {
						$(".codigobip").children(".checkout").empty();
						$(".vcodigobip").children(".checkout").empty();
						scope["formlinea"].codigobip.$setValidity("codigo", true);
						scope["formlinea"].codigobip.$setValidity("mideso", true);
					} else if((modelValue == "" || typeof modelValue == "undefined") && scope["formlinea"].codigobip.$valid && (scope["formlinea"].codigobip.$modelValue != "" && typeof scope["formlinea"].codigobip.$modelValue != "undefined")) {
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-times error").appendTo($(".vcodigobip").children(".checkout").empty());
						
						return false;
					} else if(scope["formlinea"].codigobip.$valid && (scope["formlinea"].codigobip.$modelValue != "" && typeof scope["formlinea"].codigobip.$modelValue != "undefined")) {
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".vcodigobip").children(".checkout").empty());
					} else if(!scope["formlinea"].codigobip.$valid && (scope["formlinea"].codigobip.$modelValue != "" && typeof scope["formlinea"].codigobip.$modelValue != "undefined")) {
						$("<i></i>").addClass("fa fa-times error").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".vcodigobip").children(".checkout").empty());
						scope["formlinea"].codigobip.$setValidity("codigo", false);
					} else if((modelValue != "" && typeof modelValue != "undefined")&& (scope["formlinea"].codigobip.$modelValue == "" || typeof scope["formlinea"].codigobip.$modelValue == "undefined")) {
						$("<i></i>").addClass("fa fa-times error").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".vcodigobip").children(".checkout").empty());
						scope["formlinea"].codigobip.$setValidity("codigo", false);
					}
					
					return true;
				} else {
					if(scope["formlinea"].codigobip.$valid && scope["formlinea"].codigobip.$modelValue != "") {
						$("<i></i>").addClass("fa fa-times error").appendTo($(".vcodigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigobip").children(".checkout").empty());
					} else {
						$("<i></i>").addClass("fa fa-times error").appendTo($(".codigobip").children(".checkout").empty());
						$("<i></i>").addClass("fa fa-times error").appendTo($(".vcodigobip").children(".checkout").empty());
						scope["formlinea"].codigobip.$setValidity("codigo", false);
					}
					
					return false;
				}
			};

			// VALIDADOR DE EXISTENCIA
			ctrl.$asyncValidators.mideso = function(modelValue, viewValue) {
				var def = $q.defer();
				if( typeof modelValue == "undefined" || modelValue.length != 1) {
					return $q.when();
				}
				if(typeof scope["formlinea"].codigobip.$error.codigo != "undefined" && scope["formlinea"].codigobip.$error.codigo){
					return $q.when();
				}
				//MENSAJE
				LOADING.message("Validando codigo BIP, espere por favor...");
				LOADING.show();
				//VALIDANDO
				SOCKET.request({
					request: "mideso/consultaIDI", 
					data: {
						SERVICIO: scope["formlinea"].codigobip.$modelValue,
						VCODBIP: modelValue
					},
					callback: function(result) {
						LOADING.hide();
						if( result.status==1 || result.status=="") {
							$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-times error").addClass("fa-check-circle valid");
							scope["formlinea"].codigobip.$setValidity("mideso", true);
							$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigobip").children(".checkout").empty());
							$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".vcodigobip").children(".checkout").empty());
							def.resolve();
						} else {
							$(elm[0]).parent().children(".checkout").children("i").removeClass("fa-check-circle valid").addClass("fa-times error");
							scope["formlinea"].codigobip.$setValidity("mideso", false);
							$("<i></i>").addClass("fa fa-times error").appendTo($(".codigobip").children(".checkout").empty());
							$("<i></i>").addClass("fa fa-times error").appendTo($(".vcodigobip").children(".checkout").empty());
							def.reject();
						}
					}
				});
				
				return def.promise;
			};
		}
	};
});

app.directive('cccodigoini', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			$(elm[0]).css({
				"padding-left":"20px"
			})
			
			var conte = $("<div></div>").addClass("checkout").appendTo($(elm[0]).parent());
			scope["formlinea"].codigoini.$setValidity("codigo", true);
			
			// VALIDADOR
			ctrl.$validators.codigo = function(modelValue, viewValue) {
				if(modelValue == "" || typeof modelValue == "undefined") {
					$(".codigoini_input").children(".checkout").empty();
					
					return true;
				}
				
				if(modelValue == " " || modelValue == null || modelValue.length != 12 || isNaN(modelValue)) {
					$("<i></i>").addClass("fa fa-times error").appendTo($(".codigoini_input").children(".checkout").empty());
					
					return false;
				} else {
					$("<i></i>").addClass("fa fa-check-circle valid").appendTo($(".codigoini_input").children(".checkout").empty());
					
					return true;
				}
			};
		}
	};
});
