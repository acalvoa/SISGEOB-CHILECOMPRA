<header>
	<div class="col-xs-3 col-sm-3 col-md-3 col-lg-4" id="GEOCGR">
		<div class="logos">
			<object
				data="CHILECOMPRA/public_html/images/logos/sisgeob.svg"
				height="60"
				type="image/svg+xml">
				<img src="CHILECOMPRA/public_html/images/logos/png/sisgeob.png" height="60"/>
			</object>
			<img src="CHILECOMPRA/public_html/images/logos/png/chilecompra.png" height="60" style="vertical-align: top;" />
		</div>
	</div>
	<div class="col-xs-offset-8 col-sm-offset-8 col-md-offset-3 col-lg-offset-0 col-xs-6 col-sm-5 col-md-4 col-lg-3" id="controlsSearch">
		
		<div id="navbar" ng-controller="toolbar as t">
			<div class="first-block">
				<div class="item"><img src="CHILECOMPRA/public_html/images/undo-arrow-des.png" id="undo-des" class="DRAW_ELEMENT" data-toggle="tooltip" data-placement="bottom" title="Deshacer"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/undo-arrow.png" id="undo-nodes" style="display:none;" data-toggle="tooltip" data-placement="bottom" title="Deshacer" style="margin-right:5px;"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/redo-arrow-des.png" id="redo-des" class="DRAW_ELEMENT" data-toggle="tooltip" data-placement="bottom" title="Rehacer"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/redo-arrow.png" id="redo-nodes" style="display:none;" data-toggle="tooltip" data-placement="bottom" title="Rehacer"/></div>
			</div>
			<div class="second-block">
				<div class="item"><img src="CHILECOMPRA/public_html/images/pan-tool-des.png" id="pan-des" data-toggle="tooltip" data-placement="bottom" title="Mover"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/pan-tool.png" id="pan-nodes" style="display:none;" class="DRAW_ELEMENT" data-toggle="tooltip" data-placement="bottom" title="Mover"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/pin-tool-des.png" id="add-marker-des" style="display:none;" class="DRAW_ELEMENT" data-toggle="tooltip" data-placement="bottom" title="Agregar Marcador"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/pin-tool.png" id="add-marker" data-toggle="tooltip" data-placement="bottom" title="Agregar Marcador"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/poly-tool-three-des.png" id="add-linea-des" style="display:none;" class="DRAW_ELEMENT" data-toggle="tooltip" data-placement="bottom" title="Trazar una Linea"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/poly-tool-three.png" id="add-linea" data-toggle="tooltip" data-placement="bottom" title="Trazar una Linea"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/regla-des.png" id="regla-des" style="display:none;" class="DRAW_ELEMENT" data-toggle="tooltip" data-placement="bottom" title="Regla"/></div>
				<div class="item"><img src="CHILECOMPRA/public_html/images/regla.png" id="regla" data-toggle="tooltip" data-placement="bottom" title="Regla"/></div>
				<div class="item"><i class="fa fa-question-circle" ng-click="t.help($event)"></i></div>
			</div>
		</div>
	</div>
	<div class="changer col-xs-3 col-sm-3 col-md-3 col-lg-2 col-lg-offset-10 col-xs-offset-9 col-sm-offset-9 col-md-offset-9">
		<div class="divchanger" id="MAPAGEOOPTION">
			<div id="divmaptierra">
				<img src="CHILECOMPRA/public_html/images/tierra.png" id="tierraclick"/>
			</div>
			<div id="divmapgeo" style="display: none;">	
				<img src="CHILECOMPRA/public_html/images/mapageo.png" id="mapageoclick" />
			</div>
		</div>
		<div id="zoom">
				<div id="zoomIn" class="zoomBlock">+</div>
				<div id="zoomOut" class="zoomBlock">-</div>
		</div>
	</div>
</header>