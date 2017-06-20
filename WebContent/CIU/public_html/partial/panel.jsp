<div class="panel col-xs-offset-8 col-sm-offset-8 col-md-offset-8 col-lg-offset-9 col-xs-4 col-sm-3 col-md-3 col-lg-3">
	<!-- css listo -->
	<div id="paneltabs" ng-controller="switch-tab as t">
		<div id="switchpanel">
			<div id="hide" ng-click="t.hide($event)"><i class="fa fa-chevron-right"></i></div>
			<div id="show" ng-click="t.show($event)"><i class="fa fa-chevron-left"></i></div>
		</div>
		<div class="tabpanel tabsearch"><div class="borderdiv" ng-click="t.search($event)">B&uacute;squeda Simple</div></div>
		<div class="tabpanel tabadvsearch"><div ng-click="t.advasearch($event)">B&uacute;squeda Avanzada</div></div>
		<div class="tabpanel tabinicio"><div ng-click="t.inve($event)">Inversi&oacute;n por Clasificaci&oacute;n</div></div>
		<div class="tabpanel tabranking"><div ng-click="t.listado($event)">Listado de Obras</div></div>
		<div class="tabpanel tabficha"><div ng-click="t.ficha($event)">Ficha de Obra</div></div>
	</div>
	<!-- css listo -->
	<div id="panelcontent">
		<!-- CSS LISTO -->
		<div id="descargas">
			<div id="titulo">Descargas</div>
			<div id="download" ng-controller="descargas as d">
				<div id="pdf"><a ng-click="d.pdf($event)"	><img src="CIU/public_html/images/icono_pdf.png" /></a></div>
				<div id="xls"><a download="obra.xls" href="#" ng-click="d.xls($event)" id="xlsids"><img src="CIU/public_html/images/icono_xls.png" /></a></div>
				<div id="kml" ng-click="d.kml($event)"><img src="CIU/public_html/images/icono_kml.png" /></div>
			</div>
		</div>
		<!-- CSS LISTO -->
		<div id="search" class="panel-item">
			<div class="picker">
				<font>TODAS LAS B&Uacute;SQUEDAS EST&Aacute;N RESTRINGIDAS AL RANGO DE TIEMPO SELECCIONADO EN EL ENCABEZADO DEL PORTAL</font>
				<div class="dataswitch">
					<div class="divcenter">
						<label class="labeldate">
							<i class="fa fa-calendar" aria-hidden="true"></i>
							<input readonly="readonly" type="text" value="" id="alternateFromValue" class="datefrom" />
							<input id="alternateFrom" type="hidden" />
						</label>
						<label class="tituloHasta">Hasta</label>
						<label class="labeldateright">
							<input readonly="readonly" type="text" value="" id="alternateToValue" class="dateto" />
							<input id="alternateTo" type="hidden" />
							<i class="fa fa-calendar" aria-hidden="true"></i>
						</label>
					</div>
				</div>
			</div>	
			<div>
				<div class="titulo">Ingrese el nombre de una COMUNA</div>
				<div class="inputs">
					<input id="comunatext" type="text"/>
					<button id="comunabtn" type="text">Ir</button>
				</div>
			</div>
			<div>
				<div class="titulo">Ingrese el nombre de una OBRA</div>
				<div class="inputs">
					<input id="obratext" type="text"/>
					<button id="obrabtn" type="text">Ir</button>
				</div>
			</div>
			<div>
				<div class="titulo">Ingrese ID de Mercado P&uacute;blico</div>
				<div class="inputs">
					<input id="idetext" type="text"/>
					<button id="idebtn" type="text">Ir</button>
				</div>
			</div>
		</div>
		<!-- CSS NO LISTO -->
		<div id="clasificatab" class="panel-item">
			<div class="titulo">Clasificaci&oacute;n de la inversi&oacute;n</div>
			<div class="grafico">
				<div class="rowgrafico">
					<div class="porcentaje">22%</div>
					<div class="info">
						<div class="barra"></div>
						<div class="clasificacion">Transporte Terrestre</div>
					</div>
				</div>
			</div>
		</div>
		<!-- CSS LISTO -->
		<div id="advasearch" class="panel-item" ng-controller="advasearch as a">
			<div class="picker">
				<font>TODAS LAS B&Uacute;SQUEDAS EST&Aacute;N RESTRINGIDAS AL RANGO DE TIEMPO SELECCIONADO EN EL ENCABEZADO DEL PORTAL</font>
				<div class="dataswitch">
					<div class="divcenter">
						<label class="labeldate">
							<i class="fa fa-calendar" aria-hidden="true"></i>
							<input readonly="readonly" type="text" value="" id="alternateFromASValue" class="datefrom" />
							<input id="alternateFromAS" type="hidden" />
						</label>
						<label class="tituloHasta">Hasta</label>
						<label class="labeldateright">
							<input readonly="readonly" type="text" value="" id="alternateToASValue" class="dateto" />
							<input id="alternateToAS" type="hidden" />
							<i class="fa fa-calendar" aria-hidden="true"></i>
						</label>
					</div>
				</div>
			</div>	
			<div class="inputs">
				<div class="titulo">Descripci&oacute;n de la Obra</div>
				<div class="destxt"><input type="text" id="destxtinput" placeholder='Ej: "Areas Verdes"'/></div>
			</div>
			<div class="inputs">
				<div class="titulo">Servicio P&uacute;blico</div>
				<div class="servtxt"><input type="text" id="servtxtinput" placeholder='Ej: "Junji"'/></div>
			</div>
			<div id="clasificacion">
				<div class="titulo">Clasificaci&oacute;n y Subclasificaci&oacute;n</div>
				<select id="clasif"></select>
			</div>
			<div id="valores">
				<div class="valorestab">
					<div class="titulo">Monto</div>
					<div class="valorestabsub">
						<input type="text" id="fromamount" />
						<span class="destext">Desde</span>
					</div> 
					<div class="valorestabsub">
						<input type="text" id="toamount" />
						<span class="destext">Hasta</span>
					</div>
				</div>
				<div class="valorestab">
					<div class="titulo">Fecha</div>
					<div class="valorestabsub">
						<input type="text" id="fromdate" />
						<span class="destext">Desde</span>
					</div> 
					<div class="valorestabsub">
						<input type="text" id="todate" />
						<span class="destext">Hasta</span>
					</div>
				</div>
			</div>
			<div id="actions">
				<div class="actiontab">
					<button class="advabtn" ng-click="a.busqueda($event)">BUSCAR</button>
					<button class="advdeletebtn" ng-click="a.borrar($event)">BORRAR</button>
					<input id="fromadvsearch" value="" hidden="hidden" type="text"/>
				</div>
				<div class="result-tab" ng-click="a.results($event)">
					<div class="resultados-adva" id="resultados-adva-numero">
						<div class="numero">197</div>
						<div class="detail">Resultados</div>
					</div>
					<div class="godetail">
						<div class="title">VER DETALLE</div>
						<div class="etiqueta-detail"><i class="fa fa-chevron-circle-right"></i></div>
					</div>
				</div>
				<div class="result-tab" ng-click="a.results($event)">
					<div class="resultados-adva" id="resultados-adva-monto">
						<div class="numero">$342.567.432.456</div>
						<div class="detail">Monto Total</div>
					</div>
					<div class="godetail">
						<div class="title">VER DETALLE</div>
						<div class="etiqueta-detail"><i class="fa fa-chevron-circle-right"></i></div>
					</div>
				</div>
			</div>
		</div>
		<!-- CSS LISTO -->
		<div id="ranking" class="panel-item" ng-controller="ranking as r">
			<div class="titulo listado_obras">
				<div>Listado Total de Obras</div>
			</div>
			<div class="titulo" id="erasesearch" ng-click="r.erase($event)">
				<div>Borrar Busqueda <i class="fa fa-times"></i></div>
			</div>
			<div class="listado">
				<table id="ranking-table">
					<thead>
						<tr>
							<th colspan="2">
								<div class="name">Nombre</div>
								<div class="monto activo" ng-click="r.monto($event)">Monto <i class="fa fa-sort-desc"></i></div>
								<div class="fecha" ng-click="r.fecha($event)">Fecha <i class="fa fa-sort"></i></div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Lorem ipsum ets dolor sit ameter… </td>
							<td>623.342.211</td>
						</tr>
						<tr>
							<td>Lorem ipsum ets dolor sit ameter… </td>
							<td>623.342.211</td>
						</tr>
						<tr>
							<td>Lorem ipsum ets dolor sit ameter… </td>
							<td>623.342.211</td>
						</tr>
					</tbody>
				</table>
			</div>
			
		</div>
		<div id="ficha" class="panel-item" ng-controller="ficha as f">
			<div class="botones">
				<button id="sugerencia-fis" ng-click="f.fiscaliza($event)">Sugerencia de Fiscalizaci&oacute;n</button>
				<button id="denunca-online" ng-click="f.denuncia($event)">Denuncia en L&iacute;nea</button>
			</div>
			<div class="acordeon">
				<div class="ptab">
					<div class="pheader">
						<div class="titulo">Datos de la Obra</div>
						<div class="flecha"><i class="fa fa-chevron-right"></i></div>
					</div>
					<div class="pbody" id="ficha_datos">
					</div>
				</div>
				<div class="ptab">
					<div class="pheader">
						<div class="titulo">Descripci&oacute;n de la Obra.</div>
						<div class="flecha"><i class="fa fa-chevron-right"></i></div>
					</div>
					<div class="pbody" id="ficha_descripcion">
					</div>
				</div>
				<div class="ptab">
					<div class="pheader">
						<div class="titulo">Detalle de la Obra.</div>
						<div class="flecha"><i class="fa fa-chevron-right"></i></div>
					</div>
					<div class="pbody" id="ficha_detalle">
					</div>
				</div>
				<div class="ptab">
					<div class="pheader">
						<div class="titulo">Control de la Obra</div>
						<div class="flecha"><i class="fa fa-chevron-right"></i></div>
					</div>
					<div class="pbody" id="ficha_control">
					</div>
				</div>
				<div class="ptab">
					<div class="pheader">
						<div class="titulo">Contratista.</div>
						<div class="flecha"><i class="fa fa-chevron-right"></i></div>
					</div>
					<div class="pbody" id="ficha_contratista">
						
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script>
		$( document ).ready(function() {
			$("#alternateFromValue").datepicker(
			{
     			altField: "#fromdateHeader, #alternateFromAS",
     			format: 'dd M yyyy',
     			onSelect: function(dateText) {
   					 $("#datesChanged").val('true');
  				}
		    }).on('changeDate',function(value){
				var data = value.date.getDate()+"/"+(value.date.getMonth()+1)+"/"+value.date.getFullYear()
				$("#alternateFrom").val(data);
				//LOS DEMAS
				$("#alternateFromAs").val(data);
				$("#fromdateHeader").val(data);
				// LAS FECHAS
				var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
				$("#alternateFromASValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				$("#fromdateHeaderValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				var fechaf = $("#alternateFromValue").val().split("/");
				var fechat = $("#alternateToValue").val().split("/");
				var fechaFrom = Date.parse(fechaf[1]+"/"+fechaf[0]+"/"+fechaf[2]);
				var fechaTo = Date.parse(fechat[1]+"/"+fechat[0]+"/"+fechat[2]);
				if(fechaFrom > fechaTo){
					new ALERT("El periodo de fechas indicado no es correcto. Revise, por favor.")
				}
				$("#alternateFromValue").datepicker('hide');
			}).on('hide',function(value){
				if($("#alternateFromValue").val().trim().length == ""){
					var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
					var fecha = $("#alternateFrom").val().split("/");
					var data = new Date(fecha[1]+"/"+fecha[0]+"/"+fecha[2]);
					$("#alternateFromValue").val(("0"+(data.getDate())).slice(-2)+" "+meses[data.getMonth()]+" "+data.getFullYear());
				}
			});
        });
		
		$( document ).ready(function() {
			$("#alternateToValue").datepicker({
				altField: "#todateHeader, #alternateToAS",
				format: 'dd M yyyy',
				onSelect: function(dateText) {
   					 $("#datesChanged").val('true');
  				}
			}).on('changeDate',function(value){
				var data = value.date.getDate()+"/"+(value.date.getMonth()+1)+"/"+value.date.getFullYear()
				$("#alternateTo").val(data);
				//LOS DEMAS
				$("#alternateToAs").val(data);
				$("#todateHeader").val(data);
				// LAS FECHAS
				var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
				$("#alternateToASValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				$("#todateHeaderValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				var fechaf = $("#alternateFromValue").val().split("/");
				var fechat = $("#alternateToValue").val().split("/");
				var fechaFrom = Date.parse(fechaf[1]+"/"+fechaf[0]+"/"+fechaf[2]);
				var fechaTo = Date.parse(fechat[1]+"/"+fechat[0]+"/"+fechat[2]);
				if(fechaFrom > fechaTo){
					new ALERT("El periodo de fechas indicado no es correcto. Revise, por favor.")
				}
				$("#alternateToValue").datepicker('hide');
			}).on('hide',function(value){
				if($("#alternateToValue").val().trim().length == ""){
					var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
					var fecha = $("#alternateTo").val().split("/");
					var data = new Date(fecha[1]+"/"+fecha[0]+"/"+fecha[2]);
					$("#alternateToValue").val(("0"+(data.getDate())).slice(-2)+" "+meses[data.getMonth()]+" "+data.getFullYear());
				}
			});
        });
        $( document ).ready(function() {
			$("#alternateFromASValue").datepicker(
			{
     			altField: "#fromdateHeader, #alternateFrom",
     			format: 'dd M yyyy',
     			onSelect: function(dateText) {
   					 $("#datesChanged").val('true');
  				}
		    }).on('changeDate',function(value){
				var data = value.date.getDate()+"/"+(value.date.getMonth()+1)+"/"+value.date.getFullYear()
				$("#alternateFromAS").val(data);
				//LOS DEMAS
				$("#alternateFrom").val(data);
				$("#fromdateHeader").val(data);
				// LAS FECHAS
				var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
				$("#alternateFromValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				$("#fromdateHeaderValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				var fechaf = $("#alternateFromASValue").val().split("/");
				var fechat = $("#alternateToASValue").val().split("/");
				var fechaFrom = Date.parse(fechaf[1]+"/"+fechaf[0]+"/"+fechaf[2]);
				var fechaTo = Date.parse(fechat[1]+"/"+fechat[0]+"/"+fechat[2]);
				if(fechaFrom > fechaTo){
					new ALERT("El periodo de fechas indicado no es correcto. Revise, por favor.")
				}
				$("#alternateFromASValue").datepicker('hide');
			}).on('hide',function(value){
				if($("#alternateFromASValue").val().trim().length == ""){
					var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
					var fecha = $("#alternateFromAS").val().split("/");
					var data = new Date(fecha[1]+"/"+fecha[0]+"/"+fecha[2]);
					$("#alternateFromASValue").val(("0"+(data.getDate())).slice(-2)+" "+meses[data.getMonth()]+" "+data.getFullYear());
				}
			});
        });
		
		$( document ).ready(function() {
			$("#alternateToASValue").datepicker({
				altField: "#todateHeader, #alternateTo",
				format: 'dd M yyyy',
				onSelect: function(dateText) {
   					 $("#datesChanged").val('true');
  				}
			}).on('changeDate',function(value){
				var data = value.date.getDate()+"/"+(value.date.getMonth()+1)+"/"+value.date.getFullYear()
				$("#alternateToAS").val(data);
				//LOS DEMAS
				$("#alternateTo").val(data);
				$("#todateHeader").val(data);
				// LAS FECHAS
				var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
				$("#alternateToValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				$("#todateHeaderValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				var fechaf = $("#alternateFromASValue").val().split("/");
				var fechat = $("#alternateToASValue").val().split("/");
				var fechaFrom = Date.parse(fechaf[1]+"/"+fechaf[0]+"/"+fechaf[2]);
				var fechaTo = Date.parse(fechat[1]+"/"+fechat[0]+"/"+fechat[2]);
				if(fechaFrom > fechaTo){
					new ALERT("El periodo de fechas indicado no es correcto. Revise, por favor.")
				}
				$("#alternateToASValue").datepicker('hide');
			}).on('hide',function(value){
				if($("#alternateToASValue").val().trim().length == ""){
					var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
					var fecha = $("#alternateToAS").val().split("/");
					var data = new Date(fecha[1]+"/"+fecha[0]+"/"+fecha[2]);
					$("#alternateToASValue").val(("0"+(data.getDate())).slice(-2)+" "+meses[data.getMonth()]+" "+data.getFullYear());
				}
			});
        });
	</script>
