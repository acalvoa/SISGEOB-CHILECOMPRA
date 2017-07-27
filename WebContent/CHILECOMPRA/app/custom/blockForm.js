(function() {
	$(document).on('ready', function() {
		$("#modal1").remove();
		$(".input_tec").attr('disabled', true);
		$(".input_tec_btn").remove();
		$("#navbar").remove();
		$("#GEOCGR").children('img').attr("src", "CHILECOMPRA/public_html/images/logo.png");
		$("logo").children('img').attr("src", "CHILECOMPRA/public_html/images/logo.png");
		$(".panelnav .panel-content .content-inicio .content .kml .bcontent .kmlfile .uploadbtn").css("background", "#CCC");
		$(".panelnav .panel-content .content-inicio .content .kml .bcontent .noubication").css("background", "#CCC");
		
		_CONFIG._CUSTOM.BLOCK = 1;
		
		//INDICAMOS LA VENTANA
		var prompt = new PROMPT({
			texto	: "<div class='infoparagraph'>"
					+ "<div class='informacion'>"
					+ "<i class='fa fa-info-circle'></i>"
					+ "</div>"
					+ "<div class='iparagraph'>"
					+ "La informaci&oacute;n desplegada en este visor puede ser modificada ingresando al formulario "
					+ "SISGEOB desde el mismo bot&oacute;n de acceso dispuesto en el paso 5 del proceso de "
					+ "adjudicaci&oacute;n, denominado &quot;Acta de Adjudicaci&oacute;n&quot;<br><br>"
					+ "</div>"
					+ "</div>"
					+ "<div class='exclparagraph'>"
					+ "<div class='exclamacion'>"
					+ "<i class='fa fa-exclamation-triangle'></i>"
					+ "</div>"
					+ "<div class='eparagraph'>"
					+ "<br>Se informa a los usuarios; que por el momento, el sistema posee una incidencia que solicita completar "
					+ "informaci&oacute;n relacionada con L&iacute;neas de Licitaci&oacute;n que han quedado en estado Desierta "
					+ "(o art. 3 ó 9 Ley 19.886). Dicho inconveniente ser&aacute; solucionado prontamente, por lo que "
					+ "agradecemos su comprensión.<br>"
					+ "Por el momento, solicitamos hacer caso omiso de dicha informaci&oacute;n durante el proceso de "
					+ "revisi&oacute;n.<br>"
					+ "</div>"
					+ "</div>",
			first	: function(e) {
						e.PUB.destroy();
					  }
		});
		
		prompt.PUB.add_css({"text-align" : "justify"});
		prompt.PUB.add_css_btn({"margin-left": "-75px"});
		prompt.PUB.set_first('<i class="fa fa-check"></i> Aceptar');
		prompt.PUB.show();
	})
}) ();
