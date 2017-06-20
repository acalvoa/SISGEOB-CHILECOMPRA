package gea.packet;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.channels.NotYetConnectedException;
import java.util.zip.GZIPOutputStream;

import gea.framework.Session;
import gea.utils.Exception.Error500Exception;
import gea.utils.Exception.ErrorCodeException;

import org.java_websocket.WebSocket;
import org.json.JSONArray;
import org.json.JSONObject;

public abstract class PacketBase {
	//DEFINIMOS LAS VARIABLES QUE DEBEN EXISTIR
	Session session = null;
	protected WebSocket conn;
	JSONObject responseo = null;
	JSONArray responsea = null;
	String callback;
	int code;
	
	//DEFINIMOS LOS METODOS QUE DEBEN SER DEFINIDOS EN LAS CLASE HEREDERAS
	public abstract String toString();
	public abstract void setAction();
	public abstract void sendResponse();
	
	//DEFINIMOS LOS METODOS HEREDABLES
	//DEFINIMOS EL METODO PARA ENVIAR PACKETES PREDETERMINADOS
	//ESTE METODO NO SE VUELVE A DEFINIR
	public final void sendDefaultResponse(long time_init){
		String packet= this.makePacket().toString();
		
		double size = packet.length()*8/1024;
		double size_comp = (compress(packet).length()*8)/1024;
		this.send(packet);
		long time_end = System.currentTimeMillis();
		System.out.println("Packet send: Time aprox "+(time_end-time_init)+ "ms - Weight:"+size+" KB - With Compresion : "+size_comp+" KB");
	};
	private String compress(String packet){
		ByteArrayOutputStream obj=new ByteArrayOutputStream();
        GZIPOutputStream gzip;
		try {
			gzip = new GZIPOutputStream(obj);
			gzip.write(packet.getBytes("UTF-8"));
	        gzip.close();
	        String outStr = obj.toString("UTF-8");
	        return outStr;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        return null;
	}
	//INSCRIBIMOS EL METODO QUE HACE EL CALLBACK
	public void setCallback(String callback){
		this.callback = callback;
	}
	public void setSession(Session s){
		this.session = s;
	}
	protected void send(String sendp){
		try{
			if(!this.session.isEncrypt()){
				conn.send(sendp);
			}
			else
			{
				conn.send(session.encriptarPacket(sendp));
			}
		}catch(Exception e){
			
		}
	}
	//INDICAMOS EL METODO QUE CREAR EL PACKETE POR DEFECTO
	//ESTE METODO NO SE VUELVE A DEFINIR
	private final JSONObject makePacket(){

		JSONObject json = new JSONObject();
		json.put("code", this.code);
		json.put("callback", this.callback);
		if(this.responseo != null) json.put("response", this.responseo);
		if(this.responsea != null) json.put("response", this.responsea);
		return json;
	}
	//INDICAMOS EL METODO QUE SE UTILIZARA
	public void setResponse(JSONObject response) throws ErrorCodeException{
		try
		{
			this.responseo = response;
			this.responsea = null;
		}
		catch(Exception e)
		{
			throw new ErrorCodeException("601");
		}
	}
	public void setResponse(JSONArray response) throws ErrorCodeException{
		try
		{
			this.responsea = response;
			this.responseo = null;
		}
		catch(Exception e)
		{
			throw new ErrorCodeException("601");
		}
	}
	public void setConn(WebSocket conn){
		this.conn = conn;
	}
	public void sendCacheResponse(long time_init) {
		// TODO Auto-generated method stub
		String packet= this.makePacket().toString();
		double size = packet.length()*8/1024;
		double size_comp = (compress(packet).length()*8)/1024;
		this.send(packet);
		long time_end = System.currentTimeMillis();
		System.out.println("Packet send by Cache: Time aprox "+(time_end-time_init)+ "ms - Weight:"+size+" KB - With Compresion : "+size_comp+" KB");
	}
}
