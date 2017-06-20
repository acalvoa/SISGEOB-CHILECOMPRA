<div id="kmlmodal" ng-controller="descargas as n" class="descarga">
	<div class="background"></div>
	<div class="modalbox">
		<div class="header">
			<div class="logo">
				<img src="CIU/public_html/images/logo.png">
			</div>
		</div>
		<div class="body">
			<h3>Lista de KML descargables.</h3>
			<ol>
				<li><h2><a href="CIU/public_html/download/kml/DPA_Regional.kml" target=_blank><img src="CIU/public_html/images/kml.png"></a> KML Regional</h2></li>
				<li><h2><a href="CIU/public_html/download/kml/DPA_Provincial.kml" target=_blank><img src="CIU/public_html/images/kml.png"></a> KML Provincial</h2></li>
				<li><h2><a href="CIU/public_html/download/kml/DPA_Comunal.kml" target=_blank><img src="CIU/public_html/images/kml.png"></a> KML Comunal</h2></li>
			<ol>
		</div>
		<div class="footer">
			<div class="boton">
				<button class="enter" ng-click="n.close($event)">Volver</button>
			</div>
		</div>
	</div>
</div>
