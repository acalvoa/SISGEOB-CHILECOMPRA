<%@page import="org.json.*"%>
<%@page import="gea.tasklist.Tasklist"%>
<%
	String context = request.getRequestURL().toString().replaceAll(request.getServletPath(), "")+"/";
	JSONObject c = Tasklist.getConfig("config_cc.json");
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
		},
		_CUSTOM:{
			BLOCK: 0
		}
	};
})();
