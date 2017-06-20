<%@page import="gea.auth.Authprocess"%>
<%@page import="org.json.*"%>
<%
	Authprocess a = new Authprocess(request.getParameter("id"));
	JSONObject json = a.negotiate();
	response.setContentType("application/json");
	out.println(json.toString());
%>