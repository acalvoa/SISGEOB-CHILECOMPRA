package gea.framework;

import java.nio.channels.NotYetConnectedException;
import java.util.Enumeration;
import java.util.Hashtable;

import gea.packet.*;
import gea.utils.Exception.Error500Exception;
import gea.utils.Exception.ErrorCodeException;

import org.apache.commons.codec.digest.DigestUtils;
import org.java_websocket.WebSocket;
import org.json.JSONArray;
import org.json.JSONObject;

public class Response {
	WebSocket conn;
	String callback;
	private Hashtable<WebSocket,Session> sesiones;
	PacketBase packet;
	long time_start;
	Cache cache;
	private String reqcache;
	
	public Response(WebSocket conn, Hashtable<WebSocket,Session> sesiones, Cache cache){
		// TODO Auto-generated constructor stub
		time_start = System.currentTimeMillis();
		this.conn = conn;
		this.sesiones = sesiones;
		this.cache = cache;
		this.setPacketType(200);
	}
	public void setPacketType(int code){
		try {
			packet = (PacketBase) Class.forName("gea.packet.Packet"+code).newInstance();
			packet.setConn(this.conn);
			packet.setSession(sesiones.get(this.conn));
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			System.out.println("Error al inicializar packet de repuesta");
			this.er500();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			System.out.println("Error al inicializar packet de repuesta");
			this.er500();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			System.out.println("Error al inicializar packet de repuesta");
			this.er500();
		}
	}
	public void er500(){
		// TODO Auto-generated method stub
		PacketEr500.getInstance(conn).sendDefaultResponse(time_start);
	}
	public void erCode(String code){
		// TODO Auto-generated method stub
		PacketErCode.getInstance(conn, code).sendDefaultResponse(time_start);
	}
	public void er403() {
		// TODO Auto-generated method stub
		PacketEr403.getInstance(conn).sendDefaultResponse(time_start);
	}
	public void er404(){
		// TODO Auto-generated method stub
		PacketEr404.getInstance(conn).sendDefaultResponse(time_start);
	}
	public void broadcast(String message) {
		Enumeration<WebSocket> con = sesiones.keys();
		while(con.hasMoreElements()){
			WebSocket w = con.nextElement();
			w.send(message);
		}
	}
	public void SendCallback(JSONObject response) throws ErrorCodeException{
		this.saveCache(response);
		packet.setCallback(callback);
		packet.setResponse(response);
		packet.sendDefaultResponse(time_start);
	}
	public void SendCallback(JSONArray response) throws ErrorCodeException{
		this.saveCache(response);
		packet.setCallback(callback);
		packet.setResponse(response);
		packet.sendDefaultResponse(time_start);
	}
	private void saveCache(JSONObject response) {
		// TODO Auto-generated method stub
		if(reqcache != null){
			cache.setCache(reqcache, response);
		}
	}
	private void saveCache(JSONArray response) {
		// TODO Auto-generated method stub
		if(reqcache != null){
			cache.setCache(reqcache, response);
		}
	}
	public void Send(){
		
	}
	public void setCallback(String callback) {
		this.callback = callback;
	}
	public void sendCache(String strCache) {
		// TODO Auto-generated method stub
		if(cache.verifyCacheType(strCache).equals("A")){
			try {
				packet.setResponse(cache.getACache(strCache));
			} catch (ErrorCodeException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		else if(cache.verifyCacheType(strCache).equals("O")){
			try {
				packet.setResponse(cache.getOCache(strCache));
			} catch (ErrorCodeException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		packet.setCallback(callback);
		packet.sendCacheResponse(time_start);
	}
	public void setupCache(String hash) {
		// TODO Auto-generated method stub
		this.reqcache = hash;
	}

}
