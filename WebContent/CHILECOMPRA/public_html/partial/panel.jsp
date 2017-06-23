
<%@page import="gea.mercadopublico.MercadoPublico"%>
<%@page import="java.util.*;" %>

<div class="panelnav col-xs-5 col-sm-5 col-md-4 col-lg-3">
	<div class="panel-content">
		<div class="header">
			<div class="tabs" ng-controller="tabs as t">
				<div class="tabsitem active" ng-click="t.inicio($event)" id="tabinicio">Inicio</div>
				<div class="tabsitem" ng-click="t.ubicacion($event)" id="tabubicacion">Ubicaci&oacute;n</div>
				<div class="tabsitem" ng-click="t.formulario($event)" id="tabformulario">Formulario</div>
			</div>
		</div>
		<div class="content-inicio tab-content" ng-controller="inicio as i">
			<div class="content">
				<div class="licitacion">
					<div class="bcontent" id="tituloid">
						LICITACIO�N 573-11-PL14
					</div>
				</div>
				<div class="kml">
					<div class="bcontent">
						<div class="noubication input_tec" data-value="false" ng-click="i.noubication($event)">Sin Ubicaci&oacute;n</div>
						<div class="kmlfile">
							<div class="visor">Archivo KML</div>
							<div class="uploadbtn">
							    <i class="fa fa-upload" style="display:block;"></i>
							    <i class="fa fa-trash-o" style="display:none;"></i>
							    <input  id="uploadBtn" type="file" class="upload input_tec" />
							</div>
						</div>
					</div>
				</div>
				<div class="listado">
					<div class="bheader">LISTADO DE LINEAS DE ADJUDICACI&Oacute;N</div>
					<div class="bcontent">
						<div class="table">
							<div class="thead">
								<div class="tr">
									<div class="th t2">Linea</div>
									<div class="th t3">Descripci&oacute;n</div>
									<div class="th t4">Geo.</div>
									<div class="th t5">Form.</div>
								</div>
							</div>
							<div class="tbody" id="tablaitems">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="footer">
				<div class="botonfin input_tec_btn" id="finishbtn" ng-click="i.finish($event)"><i class="fa fa-cloud-upload"></i> Enviar y Finalizar</div>
			</div>
		</div>
		<div class="content-ubicaciones tab-content" ng-controller="ubicaciones as u">
			<div class="lineas-slider" id="ubicaciones-slider">
				<div class="bcontent">
					<div class="botonizq"><i class="fa fa-chevron-left"></i></div>
					<div class="titulos">
						<div class="header">L&Iacute;NEA DE ADJUDICACI&Oacute;N</div>
						<div class="contador">05 DE 11</div>
					</div>
					<div class="botondere"><i class="fa fa-chevron-right"></i></div>
				</div>
			</div>
			<div class="listado">
				<div class="bheader">LISTADO DE UBICACIONES</div>
				<div class="bcontent" id="listadogeoms">
					
				</div>
			</div>
			<div class="resumenU">
				<div class="bheader">RESUMEN DE UBICACIONES</div>
				<div class="bcontent">
					<div class="puntos" id="numspuntos">0 PUNTOS</div>
					<div class="lineas" id="numslineas">0 LINEA</div>
				</div>
			</div>
			<div class="footer">
				<div class="bcontent">
					<div class="guardar input_tec_btn" id="guardargeom" ng-click="u.savegeom($event)"><i class="fa fa-floppy-o"></i> Guardar Ubicaci&oacute;n</div>
				</div>
			</div>
		</div>
		<div class="content-formulario tab-content" ng-controller="formulario as f">
			<div class="lineas-slider" id="formularios-slider">
				<div class="bcontent">
					<div class="botonizq"><i class="fa fa-chevron-left"></i></div>
					<div class="titulos">
						<div class="header">L&Iacute;NEA DE ADJUDICACI&Oacute;N</div>
						<div class="contador">05 DE 11</div>
					</div>
					<div class="botondere" ><i class="fa fa-chevron-right"></i></div>
				</div>
			</div>
			<form name="formlinea" style="height: 100%">
				<div class="formulario">	
					<div class="bcontent">
						<div class="form-tabs">
							<div class="tabs active" ng-click="f.changetab($event,'DATOS')">Datos de obra</div>
							<div class="tabs" ng-click="f.changetab($event,'DETALLES')">Detalles de Obra</div>
						</div>
						<div class="form-datos form-tabs-info">
							<div class="campo" style="display:none;">
								<label class="select typeobra">
									<select class="input_tec" id="tipo" name="tipoobra" ng-model="tipoobra">
										<option value="1" selected="selected">OBRA P&Uacute;BLICA</option>
									</select>
								</label>
							</div>
							<div class="campo">
								<label class="select modalidad" >
									<select class="input_tec" name="modalidad" ng-model="modalidad" ccselect>
										
									</select>
								</label>
							</div>
							<div class="campo">
								<label class="select financiamiento">
									<select class="input_tec" name="financiamiento" ng-model="financiamiento" ccselect>
									</select>
								</label>
							</div>
							<div class="campo-largo">
								<div class="textbox shortName">
									<input class="input_tec" type="text" placeholder="Nombre Corto" id="shortName" name="shortname" ng-model="shortname"/ cctextbox>
								</div>
							</div>
							<!--<div class="campo"><label id="nametipolicitacion"></label></div>-->
							<!--<div class="obra-publica-tipo">No se requiere ingresar informaci&oacute;n adicional en esta pesta&ntilde;a, cuando la licitaci&oacute;n hace referencia a una obra p&uacute;blica.</div>-->
							<div class="campo" id="tituloid2">
								<label class="select causalicitacionprivada">
									<select class="input_tec" name="selecLicPrivada" id="selecLicPrivada" style="display:none;" ng-model="selecLicPrivada" ccselect>
									</select>
									<select class="input_tec" name="selecTratoDir" id="selecTratoDir" style="display:none;" ng-model="selecTratoDir" ccselect>
									</select>
		 						</label>
							</div>
							<div class="campo-largo" style="display:none;">
								<div class="textbox normaproc" style="display:none;">
									<input class="input_tec" id="normaproc" name="normaproc" type="text" placeholder="Norma" ng-model="normaproc" cctextbox/>
								</div>
							</div>
							<div class="campo-largo" id="montosadjudicados" style="display:none;">
								<div class="textbox montoAdjudicado">
									<input class="input_tec" maxlength="18" type="text" placeholder="Monto Adjudicado" id="montoAdjudicado" name="montoAdjudicado" ng-model="ccmontoAdjudicado"/ cctextboxnumber>
								</div>
								<div class="date textbox fechaMontoAdjudicado">
									<input class="input_tec" type="text" placeholder="Fecha Adjudicacion" id="fechaMontoAdjudicado" disabled="disabled" name="fechaMontoAdjudicado" ng-model="ccfechaMontoAdjudicado"/ cctextbox>
									<button class="input_tec" class="picker" id="btn-fecha-adjudicacion"><i class="fa fa-calendar"></i></button>
								</div>
							</div>
						</div>
						<div class="form-detalles form-tabs-info">
							<!--<div class="campo-largo">
								<input id="descrip" type="text" placeholder="Descripci&oacute;n" style="display:none;"/>
							</div>-->
							<div class="campo">	
								<div class="ftextbox">
									<div class="codigobip bip">
										<input class="input_tec" type="text" placeholder="C&oacute;digo BIP" id="codigobip" maxlength="8" ng-model="codigobip" name="codigobip" cccodigobip/>
									</div>
									<div class="vcodigobip dbip">
										<input class="input_tec" type="text" name="vcodigobip" maxlength="1" id="vcodigobip" placeholder="DV" class="verifi-codbip" style="width:60px;" value="0" maxlength="1" ng-model="vcodigobip" ccvbip/>
									</div>
									<div class="codigoini ini">
										<input class="input_tec" type="text" placeholder="C&oacute;digo INI" id="codigoini" class="codigoini_input" maxlength="12" ng-model="codigoini" name="codigoini" cccodigoini/>
									</div>
								</div>
							</div>
							<div class="campo">
								<label class="select clasificacion">
									<select class="input_tec" id="selecClasif" name="clasificacion" ng-model="clasificacion" ccselect>
									</select>
								</label>
							</div>
							<div class="campo">
								<label class="select subclasificacion">
									<select class="input_tec" name="selectSubClasificacion" name="subclasificacion" ng-model="subclasificacion" ccselect>
										<option value="-1" selected="selected">Sub-Clasificaci&oacute;n de la Obra</option>
									</select>
								</label>
							</div>
							<div class="campo-largo">
								<div class="textbox servtxt">
									<input class="input_tec" type="text" placeholder="Servicio Contratante" id="servtxtinput" name="servcontratante" ng-model="servcontratante" ccservicios/>
								</div>
							</div>
			 				<div class="campo-largo">
								<div class="textbox servtxt">
									<input class="input_tec" type="text" placeholder="Servicio Mandante" id="servtxtinputs" name="servmandante" ng-model="servmandante" ccservicios/>
								</div>
							</div>
						</div>
						<!--<div class="campo-largo">
							<div class="date">
								<input type="text" placeholder="Fecha toma raz&oacute;n" class="pickerinput" id="picker-trazon" disabled="disabled" />
								<button class="picker" id="trazon-estimado"><i class="fa fa-calendar"></i></button>	
	 						</div>
						</div>-->
					</div>
				</div>
				<div class="form-comuna">
					<div class="bcontent">
						<div class="comuna-campo">
							<div class="input-comuna">
								<input class="input_tec" type="text" placeholder="Comuna" id="selector-comuna" ng-model="comunas" name="comunas" cccomuna/>
								<input type="hidden" id="comuna-data-selector" />
								<button class="input_tec" ng-click="f.addcomuna($event)" id="add_comuna_button"><i class="fa fa-plus"></i></button>
							</div>
							<div class="leyenda-comuna">
								Ingrese el Nombre o C&oacute;digo de la Comuna.
							</div>
						</div>
						<div class="comuna-listado">
							<div class="comuna-listado-text"></div>
						</div>
					</div>
				</div>
				<div class="form-tecnicos">
					<div class="bcontent">
						<div class="campo">
							<div class="date textbox">
								<input type="text" placeholder="Inicio Estimado" class="pickerinput input_tec" id="picker-inicio" disabled="disabled" name="initdate" ng-model="initdate" cctextbox/>
								<button class="picker input_tec" id="inicio-estimado"><i class="fa fa-calendar"></i></button>
							</div>
							<div class="date textbox">
								<input type="text" placeholder="Termino Estimado" class="pickerinput input_tec" id="picker-termino" disabled="disabled" name="finishdate" ng-model="finishdate" ccdatefinish/>
								<button class="picker input_tec" id="termino-estimado"><i class="fa fa-calendar"></i></button>
							</div>
						</div>
					</div>
				</div>
				<div class="footer">
					<div class="bcontent">
						<div class="guardar input_tec_btn" id="saveform" ng-click="f.save($event, formlinea)"><i class="fa fa-floppy-o"></i> Guardar Datos</div>
					</div>
				</div>
			<form>
		</div>
	</div>
</div>
