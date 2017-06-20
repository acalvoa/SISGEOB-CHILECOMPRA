<%@page import="gea.tasklist.Tasklist"%>
<%@page import="org.json.*"%>
<%@page import="java.net.URLDecoder"%>
<%
JspWriter o = out;
String context = request.getRequestURL().toString().replaceAll(request.getServletPath(), "") + "/";
JSONObject reqe = new JSONObject();
reqe.put("KEY",(request.getParameter("key") != null || request.getParameter("key") != "")?request.getParameter("key"):"NOTKEY"); 
reqe.put("ID",(request.getParameter("codigo") != null || request.getParameter("codigo") != "")?request.getParameter("codigo"):"NOTID");
Tasklist task = new Tasklist(o, context, reqe,"config_cc.json");
task.chileGrunt();
%>
