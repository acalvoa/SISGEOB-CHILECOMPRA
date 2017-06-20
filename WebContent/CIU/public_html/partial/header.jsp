<header ng-controller="header as h">
	
	<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3" id="GEOCGR">
		<img src="CIU/public_html/images/logo.png" ng-click="h.inicio($event)"/>
	</div>
	<div class="col-md-offset-1 col-xs-offset-1 col-sm-offset-1 col-lg-offset-1 col-xs-3 col-sm-4 col-md-4 col-lg-4" id="menu">
		<nav id="navbar">
			<ul>
				<li ng-click="h.inicio($event)">Inicio</li>
				<!--<li>Reportes</li>-->
				<li ng-click="h.normativa($event)">Normativa</li>
				<li ng-click="h.links($event)">Links</li>
				<li ng-click="h.faq($event)">FAQ</li>
				<li ng-click="h.registradores($event)">Registradores</li>
			</ul>
		</nav>
	</div>
	<div class="col-md-offset-1 col-xs-offset-1 col-sm-offset-1 col-lg-offset-1 col-xs-3 col-sm-3 col-md-3 col-lg-3" id="stats">
		<div class="switch">
			
				<div id="inversiontotal">
					<!-- div class="titulo">Inversi&oacute;n Total Nacional</div-->
					<div class="data">$ -</div>
				</div>
				<div id="numobras">
					<!-- div class="data">- Nuevas obras registradas desde el</div-->
					<label class="data">- </label>
					<label>Nuevas obras registradas desde el:</label>
				</div>
				<div class="dataswitch">
					<div class="divcenter">
						<label class="labeldate">
							<i class="fa fa-calendar" aria-hidden="true"></i>
							<input readonly="readonly" type="text" value="" id="fromdateHeaderValue" class="datefrom" />
							<input id="fromdateHeader" type="hidden" />
						</label>
						<label class="tituloHasta">Hasta</label>
						<label class="labeldateright">
							<input readonly="readonly" type="text" value="" id="todateHeaderValue" class="dateto" />
							<input id="todateHeader" type="hidden" />
							<i class="fa fa-calendar" aria-hidden="true"></i>
						</label>
						<input  hidden="hidden" type="text" value="" id="datesChanged"/>
					</div>
				</div>
			</div>	
			
		</div>
	
	<script>
		$( document ).ready(function() {
			$("#fromdateHeaderValue").datepicker(
			{
     			altField: "#alternateFrom, #alternateFromAS",
     			format: 'dd M yyyy',
     			onSelect: function(dateText) {
   					 $("#datesChanged").val('true');
  				}
		    }).on('changeDate',function(value){
				var data = value.date.getDate()+"/"+(value.date.getMonth()+1)+"/"+value.date.getFullYear()
				$("#fromdateHeader").val(data);
				//LOS DEMAS
				$("#alternateFrom").val(data);
				$("#alternateFromAS").val(data);
				// LAS FECHAS
				var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
				$("#alternateFromValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				$("#alternateFromASValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());


				var fechaf = $("#fromdateHeader").val().split("/");
				var fechat = $("#todateHeader").val().split("/");
				var fechaFrom = Date.parse(fechaf[1]+"/"+fechaf[0]+"/"+fechaf[2]);
				var fechaTo = Date.parse(fechat[1]+"/"+fechat[0]+"/"+fechat[2]);
				if(fechaFrom > fechaTo){
					new ALERT("El periodo de fechas indicado no es correcto. Revise, por favor.")
				}else{
					GEA.PUB.dpaNewHeaderFilter();
				}
				$("#fromdateHeaderValue").datepicker('hide');
			}).on('hide',function(value){
				if($("#fromdateHeaderValue").val().trim().length == ""){
					var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
					var fecha = $("#fromdateHeader").val().split("/");
					var data = new Date(fecha[1]+"/"+fecha[0]+"/"+fecha[2]);
					$("#fromdateHeaderValue").val(("0"+(data.getDate())).slice(-2)+" "+meses[data.getMonth()]+" "+data.getFullYear());
				}
			});
        });
		
		$( document ).ready(function() {
			$("#todateHeaderValue").datepicker({
				altField: "#alternateTo, #alternateToAS",
				format: 'dd M yyyy',
				onSelect: function(dateText) {
   					 $("#datesChanged").val('true');
  				}
			}).on('changeDate',function(value){
				var data = value.date.getDate()+"/"+(value.date.getMonth()+1)+"/"+value.date.getFullYear()
				$("#todateHeader").val(data);

				//LOS DEMAS
				$("#alternateTo").val(data);
				$("#alternateToAS").val(data);
				// LAS FECHAS
				var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
				$("#alternateToValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());
				$("#alternateToASValue").val(("0"+(value.date.getDate())).slice(-2) + " " + meses[value.date.getMonth()]+ " " + value.date.getFullYear());

				var fechaf = $("#fromdateHeader").val().split("/");
				var fechat = $("#todateHeader").val().split("/");
				var fechaFrom = Date.parse(fechaf[1]+"/"+fechaf[0]+"/"+fechaf[2]);
				var fechaTo = Date.parse(fechat[1]+"/"+fechat[0]+"/"+fechat[2]);
				if(fechaFrom > fechaTo){
					new ALERT("El periodo de fechas indicado no es correcto. Revise, por favor.")
				}else{
					GEA.PUB.dpaNewHeaderFilter();
				}
				$("#todateHeaderValue").datepicker('hide');
			}).on('hide',function(value){
				if($("#todateHeaderValue").val().trim().length == ""){
					var meses = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'];
					var fecha = $("#todateHeader").val().split("/");
					var data = new Date(fecha[1]+"/"+fecha[0]+"/"+fecha[2]);
					$("#todateHeaderValue").val(("0"+(data.getDate())).slice(-2)+" "+meses[data.getMonth()]+" "+data.getFullYear());
				}
			});
        });
	</script>
	
	
</header>