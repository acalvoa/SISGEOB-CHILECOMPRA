<div class="f9" ng-controller="noticias as n">
	<div class="contenedor">
		<article id="new1" class="new" ng-click="n.n1($event)">
			<div class="titulo">Terminaci&oacute;n Reposici&oacute;n Puente Bicentenario Oriente y Poniente.</div>
			<div class="more">
				<div class="pag">1/3</div> 
				<div class="fecha">Viernes, 13 de Mayo 2016</div>
			</div>
		</article>
		<article id="new2" class="new" ng-click="n.n2($event)">
			<div class="titulo">Dise&ntilde;o Urbano Alameda-Providencia.</div>
			<div class="more">
				<div class="pag">2/3</div> 
				<div class="fecha">Viernes, 13 de Mayo 2016</div>
			</div>
		</article>
		<article id="new3" class="new" ng-click="n.n3($event)">
			<div class="titulo">Contralor&iacute;a publica informe sobre Irregularidades en la construcci&oacute;n del Puente Cau Cau.</div>
			<div class="more">
				<div class="pag">3/3</div> 
				<div class="fecha">Jueves, 16 de Junio 20165</div>
			</div>
		</article>
	</div>
</div>
<footer ng-controller="footer as f">
	<section class="f2 col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<div class="col-xs-3 col-sm-2 col-md-2  col-lg-1  newbtn" id="noticiasbtn" ng-click="f.noticias($event)" active="0">Noticias<i class="fa fa-caret-down" active="0" aria-hidden="true" ></i></div>
		<div id="logos">
			<div id="contraloria" ng-click="f.contraloria()">www.contraloria.cl</div>
			<div id="contraloriayciu" ng-click="f.ciudadano()"><img src="CIU/public_html/images/contraloriaCiudadana2.png" /></div>
			<div><address><a href="mailto:geocgr@contraloria.cl">geocgr@contraloria.cl</a></address></div>
			<div id="fb" ng-click="f.fb()"><i class="fa fa-facebook-square"></i></div>
			<div id="tw" ng-click="f.tw()"><i class="fa fa-twitter-square"></i></div>
			<div id="rss" ng-click="f.rss()"><i class="fa fa-rss"></i></div>
		</div>
	</section>
</footer>