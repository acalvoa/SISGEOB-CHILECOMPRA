<%@ page import="java.util.*" %>
<%@ page import="org.json.*" %>
<%
    String value = request.getHeader("iv-remote-address");
    JSONObject retorno = new JSONObject();
    response.setCharacterEncoding("utf8");
    response.setContentType("application/json");
	if(value != null && !value.isEmpty()){
		retorno.put("STATUS", "OK");
		retorno.put("REMOTEADDR", value);
	}
	else
	{
		retorno.put("STATUS", "LOCAL");
	}
	out.print(retorno.toString());
%>