package SPATIAL;

import gea.properties.PropertyManager;
import gea.tasklist.Tasklist;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Properties;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServlet;

import org.json.JSONObject;



public class SpatialInfo {
	private ResourceBundle rbRegiones;
	private ResourceBundle rbProvincias;
	private ResourceBundle rbComunas;
	
	private static SpatialInfo instance=null;
	
	public static synchronized SpatialInfo getInstance()
	{
		instance = new SpatialInfo();
		
		return instance;
	}
	
	public SpatialInfo(){
		this.rbRegiones	= ResourceBundle.getBundle("spatialInfo.spatialREGIONES");
        this.rbProvincias = ResourceBundle.getBundle("spatialInfo.spatialPROVINCIAS");
        this.rbComunas	= ResourceBundle.getBundle("spatialInfo.spatialCOMUNAS");
	}
	
	public String getSpatialInfoRequest(String infoType, String name) {
	
	   	String spatialInfo="";
	    try {
	    	/*ResourceBundle configProperties = ResourceBundle.getBundle("config.properties");
	        String appHost = configProperties.getString("APPHOST");
	        String appPort = configProperties.getString("APPPORT");*/
	    	/*Properties configProperties = gea.properties.PropertyManager.GEOCGR_FILE;
	    	String appHost = configProperties.getProperty("APPHOST");
	        String appPort = configProperties.getProperty("APPPORT");*/
	    	
			//R - Regiones
			//P - Provincias
			//C - Comunas
	    	
			//Se quitan espacios en blanco y se sustituyen Ñs por Ns.
			name = name.replace(" ", "");
			name = name.replace("Ñ", "N");
			
			String respuesta = "";
			if(infoType.equals("R")){
				respuesta = rbRegiones.getString(name);
			}else if(infoType.equals("P")){
				respuesta = rbProvincias.getString(name);
			}else if(infoType.equals("C")){
				respuesta = rbComunas.getString(name);
			}
			spatialInfo=respuesta;
			

			
	    } catch (Exception e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }
	    return spatialInfo;
	}
	
	
	
	
	
}
