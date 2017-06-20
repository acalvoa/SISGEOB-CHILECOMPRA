<section class="mapa">
	<div id="gea" class="col-xs-12 col-sm-12 col-md-12 col-lg-12"></div>
	<jsp:include page="panel.jsp" />
	
	<div class="leyenda col-md-offset-1 col-xs-offset-1 col-sm-offset-1 col-lg-offset-1 col-xs-2 col-sm-2 col-md-2 col-lg-2">
		<div class="leyenda-info">-Inversi&oacute;n</div>
		<div id="leyenda-color">
			<div id="q1">&nbsp;</div>
			<div id="q2">&nbsp;</div>
			<div id="q3">&nbsp;</div>
			<div id="q4">&nbsp;</div>
			<div id="q5">&nbsp;</div>
		</div>
		<div class="leyenda-info">+Inversi&oacute;n</div>
	</div>
	<div class="leyendaobra col-md-offset-1 col-xs-offset-1 col-sm-offset-1 col-lg-offset-1 col-xs-2 col-sm-2 col-md-2 col-lg-2" ng-controller="leyenda as l">
		<div id="leyenda-color">
			<div class="simbologia">
				<div class="inversion" ng-mouseover="l.inversion($event)" ng-mouseout="l.hide($event)">
					<div class="eje1"></div>
					<div class="eje2"></div>
					<div class="eje3"></div>
				</div>
				<div class="multidpa" ng-mouseover="l.multidpa($event)" ng-mouseout="l.hide($event)">
					<div class="multi"></div>
				</div>
				<div class="sede" ng-mouseover="l.sede($event)" ng-mouseout="l.hide($event)">
				  <div class="sedecon">
				    <div class="sedeconci">
				      <div class="sedeconci2"></div>
				    </div>
				  </div>
				</div>
			</div>
		</div>
	</div>
	<div class="filtro col-xs-6 col-sm-6 col-md-6 col-lg-6" ng-controller="filtro as f">
		<div id="filtro-tab">
			<div class="close-filter" data-content="Quitar filtros" ng-mouseenter="f.popover($event, 'LEFT');" ng-mouseleave="f.hide($event);" ng-click="f.remove($event)"><i class="fa fa-times-circle"></i> Filtrar por:</div>
			<div class="filter"><div id="edipublico" data-content="Edificaciones p&uacute;blicas" ng-mouseenter="f.popover($event);" ng-mouseleave="f.hide($event);" ng-click="f.filter($event)"><img src="CIU/public_html/images/iconos/publico.png" /></div></div>
			<div class="filter"><div id="areaverde" data-content="Areas verdes y esparcimiento" ng-mouseenter="f.popover($event);" ng-mouseleave="f.hide($event);" ng-click="f.filter($event)"><img src="CIU/public_html/images/iconos/areas.png" /></div></div>
			<div class="filter"><div id="deporte" data-content="Deporte" ng-mouseenter="f.popover($event);" ng-mouseleave="f.hide($event);" ng-click="f.filter($event)"><img src="CIU/public_html/images/iconos/deporte.png" style="width:20px; margin-left:5px"/></div></div>
			<div class="filter"><div id="cultura" data-content="Educaci&oacute;n y cultura" ng-mouseenter="f.popover($event);" ng-mouseleave="f.hide($event);" ng-click="f.filter($event)"><img src="CIU/public_html/images/iconos/cultura.png" style="width:40px; margin-left:-5px" /></div></div>
			<div class="filter"><div id="habitacional" data-content="Habitacional" ng-mouseenter="f.popover($event);" ng-mouseleave="f.hide($event);" ng-click="f.filter($event)"><img src="CIU/public_html/images/iconos/habitacional.png" /></div></div>
			<div class="filter"><div id="hidraulica" data-content="Hidr&aacute;ulicas" ng-mouseenter="f.popover($event);" ng-mouseleave="f.hide($event);" ng-click="f.filter($event)"><img src="CIU/public_html/images/iconos/hidraulica.png" /></div></div>
			<div class="filter"><div id="areayportuaria" data-content="Portuarias y Aeroportuarias" ng-mouseenter="f.popover($event);" ng-mouseleave="f.hide($event);" ng-click="f.filter($event)"><img src="CIU/public_html/images/iconos/aereaymaritima.png" /></div></div>
			<div class="filter"><div id="salud" data-content="Salud y sanidad" ng-mouseenter="f.popover($event);" ng-mouseleave="f.hide($event);" ng-click="f.filter($event)"><img src="CIU/public_html/images/iconos/salud.png" /></div></div>
			<div class="filter"><div id="transterrerstre" data-content="Transporte terrestre" ng-mouseenter="f.popover($event);" ng-mouseleave="f.hide($event);" ng-click="f.filter($event)"><img src="CIU/public_html/images/iconos/terrestre.png" /></div></div>
		</div>
	</div>
	<div class="dpa col-md-offset-5 col-xs-offset-5 col-sm-offset-5 col-lg-offset-5 col-xs-2 col-sm-2 col-md-2 col-lg-2" ng-controller="dpa as d">
		<div id="dpa-comunal" class="dpablock active" ng-click="d.setComunal()">Comunal</div>
		<div id="dpa-provincial" class="dpablock inactive" ng-click="d.setProvincial()">Provincial</div>
	</div>
	<div class="changer col-xs-1 col-sm-1 col-md-1 col-lg-1" ng-controller="control as d">
		<div id="zoom">
			<div id="zoomIn" class="zoomBlock" ng-click="d.zoomIn()">+</div>
			<div id="zoomOut" class="zoomBlock" ng-click="d.zoomOut()">-</div>
		</div>
		<div id="dpapanel">
			<div class="dpaview" id="pais" ng-click="d.country()"><img src="CIU/public_html/images/chileview.png" /></div>
			<div class="dpaview" id="region" ng-click="d.region()"><img src="CIU/public_html/images/regview.png" /></div>
			<div class="dpaview" id="provincia" ng-click="d.provincia()"><img src="CIU/public_html/images/provview.png" /></div>
			<div class="dpaview" id="comuna" ng-click="d.comuna()"><img src="CIU/public_html/images/comview.png" /></div>
		</div>
	</div>
</section>