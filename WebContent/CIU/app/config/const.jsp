<%@page import="org.json.*"%>
<%@page import="gea.tasklist.Tasklist"%>
<%
	System.out.println("getRequesURL:" + request.getRequestURL());
	System.out.println("getRequesPath:" + request.getServletPath());
	
	String context = request.getRequestURL().toString().replaceAll(request.getServletPath(), "")+"/";
	Tasklist.setContextoDespliegue(context);
	JSONObject c = Tasklist.getConfig();
	
%>
(function(){
	_CONFIG = {
		_WEBSOCKET: {
			HOST: "<% out.print(c.getJSONObject("WEBSOCKET").getString("HOST")); %>",
			PORT: <% out.print(c.getJSONObject("WEBSOCKET").getInt("CLIENTPORT")); %>,
		},
		_MAP:{
			LAT: <% out.print(c.getJSONObject("MAP").getDouble("LAT")); %>,
			LNG: <% out.print(c.getJSONObject("MAP").getDouble("LNG")); %>,
			ZOOM: <% out.print(c.getJSONObject("MAP").getDouble("ZOOM")); %>,
			MAXZOOM: <% out.print(c.getJSONObject("MAP").getDouble("MAXZOOM")); %>,
			MINZOOM: <% out.print(c.getJSONObject("MAP").getDouble("MINZOOM")); %>
		}
	};
})();
