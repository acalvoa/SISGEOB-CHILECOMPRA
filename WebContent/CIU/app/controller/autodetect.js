(function(){
	AUTODETECT = function(args){
		var settings = {
		}
		// CONSTRUCTOR
		var _CONSTRUCT = function(args){
			var BROWSER = new AGENT();
			var modal = document.getElementById("modal3");
			var content = document.getElementById("detect-content");
			var white = document.getElementById("detect-white");
			var background = document.getElementById("detect-background");
			var body = document.body;
			// CARGAMOS LAS VARIABLES TAB
			if(BROWSER.mobile){
				body.innerHTML = "";
				var modal = document.createElement("div");
				modal.id = "modal3";
				body.appendChild(modal);
				var background = document.createElement("div");
				background.className = "background"
				modal.appendChild(background);
				var content = document.createElement("div");
				content.className = "modalbox"
				modal.appendChild(content);
				var header = document.createElement("div");
				header.className = "header";
				var logo = document.createElement("div");
				logo.className = "logo";
				header.appendChild(logo);
				var img = document.createElement("img");	
				img.src = "CIU/public_html/images/logo.png";
				logo.appendChild(img);
				content.appendChild(header);	
				var body = document.createElement("div");
				body.className = "body";
				body.innerHTML = "Estimado usuario,<br><br>Informamos a usted que durante esta primera etapa el portal no cuenta con una versi&oacute;n disponible para dispositivos m&oacute;viles, por lo que lo invitamos a visitar GEO-CGR utilizando un equipo de escritorio.<br><br> Para comunicarse con el equipo responsable del portal, puede enviar sus comentarios y sugerencias al correo geocgr@contraloria.cl";
				content.appendChild(body);
				return false;
			}
			else{
				if(BROWSER.msie){
					if(!(parseInt(BROWSER.version) > 10)){
						body.innerHTML = "";
						var modal = document.createElement("div");
						modal.id = "modal3";
						body.appendChild(modal);
						var background = document.createElement("div");
						background.className = "background"
						modal.appendChild(background);
						var content = document.createElement("div");
						content.className = "modalbox"
						modal.appendChild(content);
						var header = document.createElement("div");
						header.className = "header";
						var logo = document.createElement("div");
						logo.className = "logo";
						header.appendChild(logo);
						var img = document.createElement("img");	
						img.src = "CIU/public_html/images/logo.png";
						logo.appendChild(img);
						content.appendChild(header);	
						var body = document.createElement("div");
						body.className = "body";
						body.innerHTML = "Estimado usuario.<br><br>Informamos a usted que la versi&oacute;n de su navegador no es compatible con nuestro portal GEO-CGR Ciudadano.<br><br>Le recomendamos actualizar su navegador o utilizar Google Chrome, Mozilla Firefox e Internet Explorer en sus &uacute;ltimas versiones.<br><br> Para realizar sus consultas escribanos a nuestro correo geocgr@contraloria.cl";
						content.appendChild(body);
						return false;
					}
					else
					{
						modal.style.display = "none";
						return true;
					}
				}
				else if(BROWSER.mozilla){
					if(!(parseInt(BROWSER.version) > 8)){
						body.innerHTML = "";
						var modal = document.createElement("div");
						modal.id = "modal3";
						body.appendChild(modal);
						var background = document.createElement("div");
						background.className = "background"
						modal.appendChild(background);
						var content = document.createElement("div");
						content.className = "modalbox"
						modal.appendChild(content);
						var header = document.createElement("div");
						header.className = "header";
						var logo = document.createElement("div");
						logo.className = "logo";
						header.appendChild(logo);
						var img = document.createElement("img");	
						img.src = "CIU/public_html/images/logo.png";
						logo.appendChild(img);
						content.appendChild(header);	
						var body = document.createElement("div");
						body.className = "body";
						body.innerHTML = "Estimado usuario.<br><br>Informamos a usted que la versi&oacute;n de su navegador no es compatible con nuestro portal GEO-CGR Ciudadano.<br><br>Le recomendamos actualizar su navegador o utilizar Google Chrome, Mozilla Firefox e Internet Explorer en sus &uacute;ltimas versiones.<br><br> Para realizar sus consultas escribanos a nuestro correo geocgr@contraloria.cl";
						content.appendChild(body);
						return false;
					}
					else
					{
						modal.style.display = "none";
						return true;
					}
				}
				else if(BROWSER.webkit){
					if(!(parseInt(BROWSER.version) > 5)){
						body.innerHTML = "";
						var modal = document.createElement("div");
						modal.id = "modal3";
						body.appendChild(modal);
						var background = document.createElement("div");
						background.className = "background"
						modal.appendChild(background);
						var content = document.createElement("div");
						content.className = "modalbox"
						modal.appendChild(content);
						var header = document.createElement("div");
						header.className = "header";
						var logo = document.createElement("div");
						logo.className = "logo";
						header.appendChild(logo);
						var img = document.createElement("img");	
						img.src = "CIU/public_html/images/logo.png";
						logo.appendChild(img);
						content.appendChild(header);	
						var body = document.createElement("div");
						body.className = "body";
						body.innerHTML = "Estimado usuario.<br><br>Informamos a usted que la versi&oacute;n de su navegador no es compatible con nuestro portal GEO-CGR Ciudadano.<br><br>Le recomendamos actualizar su navegador o utilizar Google Chrome, Mozilla Firefox e Internet Explorer en sus &uacute;ltimas versiones.<br><br> Para realizar sus consultas escribanos a nuestro correo geocgr@contraloria.cl";
						content.appendChild(body);
						return false;
					}
					else
					{
						modal.style.display = "none";
						return true;
					}
				}
			}
		}
		var PRIV = {
			
		}
		// METODOS PUBLICOS
		this.PUB = {
			
		}
		return _CONSTRUCT(args);
	};
})();