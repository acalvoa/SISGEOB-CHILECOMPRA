	<div id="modal1" ng-controller="modal1 as m">
	<div class="background"></div>
	<div class="modalbox">
		<div class="header">
			<div class="logo text-center">
				<object
					data="CHILECOMPRA/public_html/images/logos/sisgeob.svg"
					height="100"
					type="image/svg+xml">
					<img height="100" src="CHILECOMPRA/public_html/images/logos/png/sisgeob.png" />
				</object>
			</div>
		</div>
		<div class="body">
			<div class="tab">
				<div class="active tabitem" ng-click="m.why($event)" id="whygeocgr">&iquest;Qu&eacute; es SISGEOB?</div>
				<div class="inactive tabitem" ng-click="m.ayuda($event)" id="ayuda">Ayuda</div>
				<div class="inactive tabitem" ng-click="m.contacto($event)" id="contacto">Contacto</div>
			</div>
			<div class="content">
				<div class="whygeocgr modal-ini-content">
					<p>SISGEOB son las siglas del Sistema de Gesti&oacute;n de Obras, que permite almacenar, articular, publicar y consultar informaci&oacute;n sobre la inversi&oacute;n de recursos en obras p&uacute;blicas, el cual est&aacute; en la l&iacute;nea de la Contralor&iacute;a General de la Rep&uacute;blica, de resguarda la probidad, la transparencia y el correcto uso del patrimonio p&uacute;blico.</p>
					<p>SISGEOB en conjunto con el portal GEO-CGR, buscan promover el control ciudadano mediante la entrega de instrumentos para el an&aacute;lisis y monitoreo de informaci&oacute;n confiable, oportuna y con contexto territorial a trav&eacute;s de su georreferenciaci&oacute;n.</p>
					<p>La informaci&oacute;n que se registre en esta etapa por medio de SISGEOB, ser&aacute; transparentada en el Portal GEOCGR, desarrollados por la Contralor&iacute;a General de la Rep&uacute;blica. El portal puede ser visitado en el siguiente link &nbsp;<a href="http://www.contraloria.cl/geocgrappcgr/GEOCGR/index.jsp"><span>www.contraloria.cl/geocgr</span></a>.</p>
				</div>
				<div class="ayuda modal-ini-content">
					<div class="tabs">
						<div class="tab" data-tab="1" ng-click="m.tab($event)">Portal GEO-CGR Control Ciudadano de Obras</div>
						<div class="tab" data-tab="2" ng-click="m.tab($event)">Acerca del Formulario GEO-CGR</div>
						<div class="tab" data-tab="3" ng-click="m.tab($event)">C&oacute;mo y qu&eacute; se registra</div>
						<div class="tab" data-tab="4" ng-click="m.tab($event)">Acerca de la Localizaci&oacute;n de la Obra</div>
						<div class="manual">
							<div class="item">
								<div class="titulo">Manual SISGEOB</div>
								<div class="file"><a href="CHILECOMPRA/public_html/download/Manual-SISGEOB.pdf" target="_blank"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></div>
							</div>
						</div>
					</div>
					<div class="tcontent">
						<div class="tabcontent tab1">
							<div class="titulo" ng-click="m.tcontent($event)">Portal GEO-CGR Control Ciudadano de Obras</div>
							<div class="content" style="display:block;">
								<h4>&iquest;Qu&eacute; es el Portal GEO-CGR?</h4>
								<p>GEO-CGR, es una plataforma que permite publicar y consultar informaci&oacute;n georreferenciada de la inversi&oacute;n de recursos en obras p&uacute;blicas, permitiendo transparentar la informaci&oacute;n registrada en SISGEOB, con el objetivo de promover el control ciudadano mediante la entrega de instrumentos para el an&aacute;lisis y monitoreo de informaci&oacute;n confiable, oportuna y con contexto territorial, &uacute;til para la autoridad, entregando la posibilidad de realizar denuncias y sugerencias de fiscalizaci&oacute;n, facilitando su participaci&oacute;n activa en el control del uso de los recursos p&uacute;blicos.</p>
								<h4>&iquest;Qu&eacute; es un contrato de obra p&uacute;blica?</h4>
								<p>Se entender&aacute; por contrato de obra aquel por el cual se encarga la construcci&oacute;n, conservaci&oacute;n, modificaci&oacute;n, restauraci&oacute;n, mejoramiento o demolici&oacute;n de un bien inmueble, salvo las mantenciones y reparaciones de edificaciones imputables al subt&iacute;tulo 22 del clasificador presupuestario, o su equivalente, sobre bienes y servicios de consumo.</p>
								<p>En todo caso, se asumir&aacute; siempre ese car&aacute;cter respecto de todo aquel contrato financiado total o parcialmente con cargo al subt&iacute;tulo 31, &iacute;tem 02, asignaci&oacute;n 004, del referido clasificador.</p>
								<h4>&iquest;Qu&eacute; obras se registran en SISGEOB?</h4>
								<p>Se registran los datos de los contratos de obras p&uacute;blicas que ejecutan o financian las entidades p&uacute;blicas y que de acuerdo con la ley N&deg;19.886 les asiste el deber de publicarlos en el portal Mercado P&uacute;blico (Sistema Nacional de Compras P&uacute;blicas) y de los contratos de obras que han sido objeto de toma de raz&oacute;n por parte de Contralor&iacute;a.</p>
								<h4>&iquest;Por qu&eacute; se agreg&oacute; SISGGEOB en el Sistema de Mercado Publico?</h4>
								<p>En ese sentido el Sistema Nacional de Compras P&uacute;blicas se perfila como un actor clave que permite captar el mayor porcentaje de contratos de obra p&uacute;blica que se generan en el pa&iacute;s.</p>
							</div>
						</div>
						<div class="tabcontent tab2">
							<div class="titulo" ng-click="m.tcontent($event)">Acerca del Formulario GEO-CGR</div>
							<div class="content">
								<h4>&iquest;Qui&eacute;nes deben registrar en SISGEOB?</h4>
								<p>Deben registrar en SISGEOB, todas las Entidades P&uacute;blicas que efect&uacute;en sus licitaciones en el sistema <a href="http://www.mercadopublico.cl"><span>www.mercadopublico.cl</span></a> y que marquen la opci&oacute;n &ldquo;Licitaci&oacute;n de Contrato de Obra&rdquo;, siguiendo para ello la definici&oacute;n de Contrato de Obra P&uacute;blica establecida por la Contralor&iacute;a General de la Rep&uacute;blica.</p>
								<h4>&iquest;En qu&eacute; momento debo identificar mi licitaci&oacute;n como Contrato de Obra?</h4>
								<p>La opci&oacute;n de Licitaci&oacute;n de Contrato de Obra o marca de obra est&aacute; disponible para ser seleccionada en la etapa de creaci&oacute;n de licitaci&oacute;n, dentro del sistema www.mercadopublico.cl.</p>
								<p>Para m&aacute;s detalles respecto de la visualizaci&oacute;n de esta opci&oacute;n, puede consultar el siguiente v&iacute;nculo que contiene el manual elaborado por la Direcci&oacute;n ChileCompra:</p>
								<p><a href="http://formacion.chilecompra.cl/Default.aspx?option=com_documents&amp;task=download&amp;id=2I1c0elbVe0%3d"><span>http://formacion.chilecompra.cl/Default.aspx?option=com_documents&amp;task=download&amp;id=2I1c0elbVe0%3d</span></a></p>
								<h4>Una vez que marque mi licitaci&oacute;n como contrato de obra &iquest;Es obligatorio registrar SISGEOB?</h4>
								<p>La opci&oacute;n de Licitaci&oacute;n de Contrato de Obra o marca de obra est&aacute; disponible para ser seleccionada en la etapa de creaci&oacute;n de licitaci&oacute;n, dentro del sistema www.mercadopublico.cl.</p>
								<p>Para m&aacute;s detalles respecto de la visualizaci&oacute;n de esta opci&oacute;n, puede consultar el siguiente v&iacute;nculo que contiene el manual elaborado por la Direcci&oacute;n ChileCompra:</p>
								<p><a href="http://formacion.chilecompra.cl/Default.aspx?option=com_documents&amp;task=download&amp;id=2I1c0elbVe0%3d"><span>http://formacion.chilecompra.cl/Default.aspx?option=com_documents&amp;task=download&amp;id=2I1c0elbVe0%3d</span></a></p>
								<h4>&iquest;En qu&eacute; momento del proceso de licitaci&oacute;n se habilita la posibilidad de registrar SISGEOB?</h4>
								<p>El acceso a SISGEOB se produce en el sistema www.mercadopublico.cl, durante la adjudicaci&oacute;n de la licitaci&oacute;n, dentro del paso denominado Acta de Adjudicaci&oacute;n, esto es antes de la validaci&oacute;n y confirmaci&oacute;n de dicho proceso.</p>
								<p>Para m&aacute;s detalles respecto de la visualizaci&oacute;n de esta opci&oacute;n, puede consultar el siguiente v&iacute;nculo que contiene el manual elaborado por la Direcci&oacute;n ChileCompra:</p>
								<p><a href="http://formacion.chilecompra.cl/Default.aspx?option=com_documents&amp;task=download&amp;id=2I1c0elbVe0%3d"><span>http://formacion.chilecompra.cl/Default.aspx?option=com_documents&amp;task=download&amp;id=2I1c0elbVe0%3d</span></a></p>
								<h4>&iquest;C&oacute;mo accedo a SISGEOB?</h4>
								<p>El acceso se efect&uacute;a mediante un bot&oacute;n denominado "Registrar en", ubicado en la parte inferior del paso Acta de Adjudicaci&oacute;n, contenido en la etapa de Adjudicaci&oacute;n de la Licitaci&oacute;n.</p>
							</div>
						</div> 
						<div class="tabcontent tab3">
							<div class="titulo" ng-click="m.tcontent($event)">C&oacute;mo y qu&eacute; se registra</div>
							<div class="content">
								<h4>&iquest;Qu&eacute; datos debo ingresar al SISGEOB?</h4>
								<p>SISGEOB, contempla un mapa y un panel de registro con 3 pesta&ntilde;as. En t&eacute;rminos generales la primera de ellas sirve de ayuda para completar los datos, la segunda pesta&ntilde;a tiene por objeto captar la localizaci&oacute;n de la obra y en la tercera pesta&ntilde;a se ingresan 11 datos vinculados con el contrato de obra propiamente tal (Modalidad de Contrataci&oacute;n, Tipo de Financiamiento, Servicio Contratante, Servicio Mandante, C&oacute;digo BIP, C&oacute;digo INI, C&oacute;digo, Clasificaci&oacute;n de la Obra, Comuna, Inicio Estimado y T&eacute;rmino Estimado).</p>
								<h4>&iquest;C&oacute;mo se completa SISGEOB?</h4>
								<p>No posee una estructura lineal de llenado, por lo que se puede iniciar el registro de datos a conveniencia del usuario. En la pesta&ntilde;a inicial, se mostrar&aacute; un resumen de completitud de los datos. Una vez que se hayan ingresado todos los datos obligatorios se podr&aacute; finalizar el registro con &eacute;xito.</p>
								<h4>&iquest;Cu&aacute;les datos son obligatorios que debo ingresar en SISGEOB?</h4>
								<p>Los datos obligatorios corresponden a la localizaci&oacute;n Geogr&aacute;fica, Modalidad de Contrataci&oacute;n, Tipo de Financiamiento, Servicio Contratante, Servicio Mandante, Clasificaci&oacute;n de la obra, Comuna, Inicio Estimado y T&eacute;rmino Estimado.</p>
								<h4>&iquest;De qu&eacute; forma puedo ingresar el dato de Localizaci&oacute;n Geogr&aacute;fica de la obra que estoy contratando?</h4>
								<p>Existen 3 alternativas de registro para conseguir el dato de Localizaci&oacute;n Geogr&aacute;fica, cada una con un procedimiento particular para su compleci&oacute;n:</p>
								<ol>
								<li> Dibujar en Mapa. Esta alternativa permitir&aacute; dibujar directamente sobre el mapa, siguiendo una serie de pasos hasta obtener la Localizaci&oacute;n Geogr&aacute;fica definitiva, seg&uacute;n lo dispuesto en el manual adjunto en esta misma secci&oacute;n de ayuda.</li>
								<li> Adjuntar Archivo KML. La segunda alternativa, disponible desde la pesta&ntilde;a Inicio, permitir&aacute; subir directamente el dato de localizaci&oacute;n para aquellos casos en que ya se haya confeccionado un archivo espec&iacute;fico, construido en base a las instrucciones dispuestas en este manual.</li>
								<li> Sin Ubicaci&oacute;n Definida. Esta opci&oacute;n se dispone para aquellas obras que poseen una ubicaci&oacute;n imprecisa, variable o indeterminada. Ser&aacute; accesible desde la pesta&ntilde;a Inicio mediante un bot&oacute;n que estar&aacute; directamente vinculado con el campo Comuna de la pesta&ntilde;a Formulario.</li>
								</ol>
								<h4>&iquest;Es posible modificar el registro una vez que ya ha sido enviado a SISGEOB?</h4>
								<p>S&oacute;lo se podr&aacute; modificar el registro de SISGEOB para aquellos casos en que no se valide ni confirme la adjudicaci&oacute;n en el sistema Mercado P&uacute;blico. Para aquellas situaciones se volver&aacute; a habilitar el bot&oacute;n de acceso a SISGEOB pudiendo de ese modo efectuar las modificaciones que sean necesarias.</p>
							</div>
						</div>
						<div class="tabcontent tab4">
							<div class="titulo" ng-click="m.tcontent($event)">Acerca de la Localizaci&oacute;n de la Obra</div>
							<div class="content">
								<h4>&iquest;Con qu&eacute; precisi&oacute;n debo registrar la localizaci&oacute;n de las obras del contrato?</h4>
								<p>La escala de registro y publicaci&oacute;n es de 1:5.000, por cuanto se estima que con ello se le otorga al ciudadano la suficiente precisi&oacute;n y detalle para visualizar hitos reconocibles dentro de un barrio en particular. A esta escala, una manzana t&iacute;pica de 100 por 100 metros, se visualiza en un computador de escritorio como un cuadrado de 2 cms. de lado aproximadamente.</p>
								<h4>&iquest;C&oacute;mo saber cu&aacute;ndo graficar la localizaci&oacute;n de la obra como punto o l&iacute;nea?</h4>
								<p>La l&iacute;nea corresponde a una forma de representaci&oacute;n geom&eacute;trica aplicable a aquellas obras destinadas al desplazamiento, circulaci&oacute;n o tr&aacute;nsito de personas o cargas y las redes de distribuci&oacute;n de energ&iacute;a y agua que poseen una disposici&oacute;n longitudinal, donde su largo es mayor a 25 metros y la proporci&oacute;n entre su largo y ancho es de 5 a 1. Asimismo, en el evento que la obra contemple una secuencia de intervenciones puntuales continuas, corresponder&aacute; dibujar una l&iacute;nea. El punto se usar&aacute; como una forma de representaci&oacute;n geom&eacute;trica aplicable a aquellas obras que poseen una disposici&oacute;n focal y que no se condicen con la definici&oacute;n de l&iacute;nea. Para m&aacute;s detalle consultar las ilustraciones del Manual de Usuario para Entidades P&uacute;blicas.</p>
								<h4>&iquest;Qu&eacute; es la Localizaci&oacute;n Geogr&aacute;fica de la obra?</h4>
								<p>Informaci&oacute;n georreferenciada referida al lugar de emplazamiento de todas las faenas contempladas en un contrato de obra, compuesta por una o m&aacute;s intervenciones y/o agrupaciones, representadas sobre una base cartogr&aacute;fica mediante puntos, l&iacute;neas o ambas geometr&iacute;as, utilizando para ello un sistema de coordenadas u otra referencia espacial.</p>
								<h4>&iquest;Qu&eacute; es una intervenci&oacute;n?</h4>
								<p>Se refiere al evento de ejecutar una obra determinada o parte de ella, en una localizaci&oacute;n espec&iacute;fica, cuya disposici&oacute;n para efectos de SISGEOB, ser&aacute; exclusivamente de car&aacute;cter puntual o lineal.</p>
								<h4>&iquest;Qu&eacute; es una agrupaci&oacute;n?</h4>
								<p>Corresponde a la uni&oacute;n de m&uacute;ltiples intervenciones para aquellos casos en que estas se encuentran distanciadas a menos de 25 metros entre s&iacute;. Dicha combinaci&oacute;n se representar&aacute; mediante un punto o una l&iacute;nea conforme a su disposici&oacute;n. En caso que una obra tenga simult&aacute;neamente intervenciones puntuales y lineales distanciadas a menos de 25 metros, prevalecer&aacute; la representaci&oacute;n lineal de la agrupaci&oacute;n. Para el caso de intervenciones lineales, solo podr&aacute;n agruparse aquellas en que una sea la continuaci&oacute;n de otra. Para m&aacute;s detalle consultar las ilustraciones del Manual de Usuario para Entidades P&uacute;blicas.</p>
								<h4>&iquest;Qu&eacute; condiciones debe cumplir el archivo kml para poder subirlo al sistema?</h4>
								<p>El archivo KML puede crearse directamente en el programa Google Earth siguiendo las instrucciones contenidas en el Manual de Usuario para Entidades P&uacute;blicas. En caso de que el archivo se genere a partir de un software SIG, este debe tener las siguientes caracter&iacute;sticas:</p>
								<ol>
								<li> El archivo KML debe incluir campo ID_MP en el que se indique el c&oacute;digo de licitaci&oacute;n de Mercado P&uacute;blico.</li>
								<li> Debe estar proyectado en coordenadas geogr&aacute;ficas.</li>
								<li> Debe estar referido al sistema WGS84.</li>
								<li> Luego, se debe incluir campo LIN_ADJ en el que se indique para cada intervenci&oacute;n la numeraci&oacute;n de la l&iacute;nea de adjudicaci&oacute;n respectiva.</li>
								</ol>
								<p>Para m&aacute;s detalle consultar las ilustraciones del Manual de Usuario para Entidades P&uacute;blicas.</p>
							</div>
						</div>
					</div>
				</div>
				<div class="contacto modal-ini-content">
					<h4>Datos de Contacto</h4>
					<br>
					En caso de dudas o consultas, puede contactarse a trav&eacute;s del siguiente correo electr&oacute;nico: <a href="mailto:mesadeayuda@contraloria.cl ">mesadeayuda@contraloria.cl</a>  
				</div>
			</div>
		</div>
		<div class="footer">
			<div class="boton">
				<button class="enter" ng-click="m.close($event)">Entrar</button>
				<div class="checkbtn">
					<input type="checkbox" id="checkcookie" ng-click="m.remember($event)" data-cookie="0" /> No volver a mostrar esta pantalla
				</div>
			</div>
		</div>
	</div>
</div>
<div id="modal2" ng-controller="modal2 as m">
	<div class="background"></div>
	<div class="modalbox">
		<div class="header">
			<div class="logo text-center">
				<object
					data="CHILECOMPRA/public_html/images/logos/sisgeob.svg"
					height="60"
					type="image/svg+xml">
					<img src="CHILECOMPRA/public_html/images/logos/png/sisgeob.png" height="60"/>
				</object>
				<img src="CHILECOMPRA/public_html/images/logos/png/chilecompra.png" height="60" style="vertical-align: top;" />
			</div>
		</div>
		<div class="body">
			<div class="content">
				Se han registrado las ubicaciones y datos asociados a <span id="lineas-proyecto-fin"></span> l&iacute;neas pertenecientes a la licitaci&oacute;n <span id="licitacion-fin"></span>
		</div>
		</div>
		<div class="footer">
			<!--<button id="finish-cancel" ng-click="m.close($event)"><i class="fa fa-times"></i> Cancelar</button>-->
			<button id="finish-acept" ng-click="m.mercadopublico()"><i class="fa fa-check"></i> Aceptar y volver a Mercado Publico</button>
		</div>
	</div>
</div>

<div id="modal3" ng-controller="modal3 as m">
	<div class="background"></div>
	<div class="modalbox">
		<div class="header">
			<div class="logo text-center">
				<object
					data="CHILECOMPRA/public_html/images/logos/sisgeob.svg"
					height="60"
					type="image/svg+xml">
					<img src="CHILECOMPRA/public_html/images/logos/png/sisgeob.png" height="60"/>
				</object>
				<img src="CHILECOMPRA/public_html/images/logos/png/chilecompra.png" height="60" style="vertical-align: top;" />
			</div>
		</div>
		<div class="body">
			<div class="content">
				<div class="icon"><i class="fa fa-exclamation"></i></div>
				<div class="body">
					<h3>Registro Incompleto</h3><br>
					A&uacute;n no se han registrado todos los datos del presente formulario.
				</div>
			</div>
		</div>
		<div class="footer">
			<button id="finish-acept" ng-click="m.close($event)"><i class="fa fa-check"></i> Aceptar y volver a Mercado Publico</button>
		</div>
	</div>
</div>

<div id="modal4" ng-controller="modal3 as m">
	<div class="background"></div>
	<div class="modalbox">
		<div class="header">
			<div class="logo text-center">
				<object
					data="CHILECOMPRA/public_html/images/logos/sisgeob.svg"
					height="60"
					type="image/svg+xml">
					<img src="CHILECOMPRA/public_html/images/logos/png/sisgeob.png" height="60"/>
				</object>
				<img src="CHILECOMPRA/public_html/images/logos/png/chilecompra.png" height="60" style="vertical-align: top;" />
			</div>
		</div>
		<div class="body">
			<div class="content">
				<div class="conditions-form">
						
				</div>
			</div>
		</div>
		<div class="footer">
			<button id="finish-acept" ng-click="m.close4($event)"><i class="fa fa-check"></i> Aceptar y volver al formulario.</button>
		</div>
	</div>
</div>

<div id="modal_SERVICIOS" ng-controller="modalServicios as m">
	<div class="background"></div>
	<div class="modalbox">
		<div class="header">
			<div class="logo text-center"> 
				<object
					data="CHILECOMPRA/public_html/images/logos/sisgeob.svg"
					height="60"
					type="image/svg+xml">
					<img src="CHILECOMPRA/public_html/images/logos/png/sisgeob.png" height="60"/>
				</object>
				<img src="CHILECOMPRA/public_html/images/logos/png/chilecompra.png" height="60" style="vertical-align: top;" />
			</div>
		</div>
		<form name="formServicio">
		<div class="body">
			<div class="content">
				<div class="conditions-form" id="SERVICIOS_CONTENT">
						
				</div>
				<div class="CODIGO_SERVICIO">
					<div class="input"><input type="text" id="SERVICIO_ID_CODIGO" ng-model="codigo" placeholder="Codigo unico de la obra o Codigo WFS"/></div>
					<div class="button"><button id="finish-acept" ng-click="m.read($event)"><i class="fa fa-check"></i> Cargar Informaci&oacute;n.</button></div>
				</div>
			</div>
		</div>
		<div class="footer">
			<div class="fecha_servicio"></div>
		</div>
		</form>
	</div>
</div>

<div id="modal5" ng-controller="modal3 as m">
	<div class="background"></div>
	<div class="modalbox">
		<div class="header">
			<div class="logo text-center">
				<object
					data="CHILECOMPRA/public_html/images/logos/sisgeob.svg"
					height="60"
					type="image/svg+xml">
					<img src="CHILECOMPRA/public_html/images/logos/png/sisgeob.png" height="60"/>
				</object>
				<img src="CHILECOMPRA/public_html/images/logos/png/chilecompra.png" height="60" style="vertical-align: top;" />
			</div>
		</div>
		<div class="body">
			<div class="content">
				<div class="icon"><i class="fa fa-exclamation"></i></div>
				<div class="body">
					<h3>Registro Incompleto</h3><br>
					SISGEOB detect&oacute; un incidente con el servicio de verificaci&oacute;n de Mercado P&uacute;blico. Contactese con Mercado P&uacute;blico
				</div>
			</div>
		</div>
		<div class="footer">
			<button 
				class="enter"
				id="finish-acept"
				ng-click="m.close5($event)">
				<i class="fa fa-check"></i> Aceptar y volver a Mercado Publico
			</button>
		</div>
	</div>
</div>