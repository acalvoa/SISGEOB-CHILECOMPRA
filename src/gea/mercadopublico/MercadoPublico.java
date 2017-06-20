package gea.mercadopublico;

import gea.utils.Exception.Error403Exception;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.JsonParser;

public class MercadoPublico {
	
	String contenido;
	String parametro;
	
	String nombreContrato;
	String tipo;
	Integer cantidadlinea;
	JSONObject jObject;
	String idMercadoPublico;
	Integer coddocumento;
	Integer folio;
	String fecha;
	String codservContratante;
	String nombreservContratante;
	String moneda;
	
	public MercadoPublico(String parametro) throws IOException {
	
		this.contenido = contenido;
		this.parametro= parametro;
	
		// TODO Auto-generated constructor stub
	}

	public JSONObject principal() throws IOException
	{
		this.readJsonMP();
		this.readInfoJson();
		return this.jObject;
	}
	public JSONObject adjudicacion() throws IOException, Error403Exception
	{
		this.readJsonMP();
		this.readAdjudicacion();
		return this.jObject;
	}

	private void readInfoJson() throws IOException {
		// TODO Auto-generated method stub
		
		JSONArray json = this.jObject.getJSONArray("Listado");
		this.jObject.put("NOMBRE", ((json.getJSONObject(0).getString("Nombre").replaceAll("[\"|\\?|\']+", "")).replaceAll("[\\r|\\n|\\t]+|^ +| +$|( )+", " ")));
		this.jObject.put("DESCRIPCION",((json.getJSONObject(0).getString("Descripcion").replaceAll("[\"|\\?|\']+", "")).replaceAll("[\\r|\\n|\\t]+|^ +| +$|( )+", " ")));
		this.jObject.put("TOMARAZON",json.getJSONObject(0).getString("TomaRazon"));
		this.jObject.put("CODIGOEXTERNO",json.getJSONObject(0).getString("CodigoExterno"));
		this.jObject.put("PLAZOBRA",json.getJSONObject(0).getInt("TiempoDuracionContrato"));
	    this.jObject.put("UNIDATIEMPO",json.getJSONObject(0).getInt("UnidadTiempoDuracionContrato"));
	    this.jObject.put("MONEDA",json.getJSONObject(0).getString("Moneda"));
	    
		try{
		this.jObject.put("MONTOESTIMADO",json.getJSONObject(0).getDouble("MontoEstimado"));
		}catch(Exception e)
		{
			this.jObject.put("MONTOESTIMADO",0);
		}
		this.jObject.put("TIPO", json.getJSONObject(0).getString("Tipo"));
		this.jObject.put("CANTIDADITEMS", json.getJSONObject(0).getJSONObject("Items").getInt("Cantidad"));
		this.jObject.put("ITEMS", json.getJSONObject(0).getJSONObject("Items").getJSONArray("Listado"));
	}
	private void readAdjudicacion() throws IOException, Error403Exception {
		// TODO Auto-generated method stub
		JSONArray json = this.jObject.getJSONArray("Listado");
		DateFormat format = new SimpleDateFormat("yyyy-M-dd", Locale.ENGLISH);
	    this.jObject.put("MONEDA",json.getJSONObject(0).getString("Moneda"));
		try{
			this.jObject.put("DURACIONCONTRATO", json.getJSONObject(0).getString("TiempoDuracionContrato"));
			this.jObject.put("CODDOCUMENTO", json.getJSONObject(0).getJSONObject("Adjudicacion").getInt("Tipo"));
		    this.jObject.put("FOLIO", json.getJSONObject(0).getJSONObject("Adjudicacion").getString("Numero"));
			this.jObject.put("FECHA", json.getJSONObject(0).getJSONObject("Adjudicacion").getString("Fecha"));
			this.jObject.put("ITEMS", json.getJSONObject(0).getJSONObject("Items").getJSONArray("Listado"));
		}
		catch(Exception e){
			//	throw new Error403Exception(e.getMessage());
			this.jObject.put("DURACIONCONTRATO", json.getJSONObject(0).getString("TiempoDuracionContrato"));
			this.jObject.put("CODDOCUMENTO", 1);
		    this.jObject.put("FOLIO", "");
			this.jObject.put("FECHA", format.format(new Date()).toString() );
			this.jObject.put("ITEMS", json.getJSONObject(0).getJSONObject("Items").getJSONArray("Listado"));
		}		
	}
	private void readJsonMP() throws IOException {
		// TODO Auto-generated method stub
		String url="";
		
		String resultado = "";
		
		JSONObject json = MercadoPublico.getConfig();
		url = "http://"+json.getJSONObject("MERCADOPUBLICO").getString("MP") +"codigo="+ this.parametro+json.getJSONObject("MERCADOPUBLICO").getString("TICKET");
		URL urlMP = new URL(url);
		// Se llama la API y se guarda su contenido 
        BufferedReader reader = new BufferedReader(new InputStreamReader(urlMP.openStream(),"UTF-8"),8);
        StringBuilder sb = new StringBuilder();
        String inputLine= null;
        while ((inputLine = reader.readLine()) != null) {
            	sb.append(inputLine);
        }
        urlMP.openStream().close();
		resultado=sb.toString();
	   this.jObject = new JSONObject(resultado);
		
	}
	
	public static JSONObject getConfig() throws IOException{
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
	    InputStream stream = classLoader.getResourceAsStream("config_cc.json");
	    //LEEMOS EL ARCHIVO DE CONFIGURACION
	    byte[] contents = new byte[4096];
	    int bytesRead=0;
	    String config = ""; 
	    while( (bytesRead = stream.read(contents)) != -1){ 
	      String linea = new String(contents, 0, bytesRead);
	      if(linea.trim().indexOf("//") == 0){
	    	  continue;
	      }
	      config += linea;
	    }
	    //ELIMINAMOS LOS COMENTARIOS
	    config = config.replaceAll("//.*[\r\n]", "");
	    try
	    {
	    	return new JSONObject(config);
	    }
	    catch(Exception e)
	    {
	    	System.out.println("Existe un error en la hoja de configuraciones del portal config.json");
	    	return null;
	    }
	}
	
	
	public static JSONObject getDatosFicha() throws IOException{
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
	    InputStream stream = classLoader.getResourceAsStream("ficha.json");
	    //LEEMOS EL ARCHIVO DE CONFIGURACION
	    byte[] contents = new byte[4096];
	    int bytesRead=0;
	    String config = ""; 
	    while( (bytesRead = stream.read(contents)) != -1){ 
	      String linea = new String(contents, 0, bytesRead);
	      if(linea.trim().indexOf("//") == 0){
	    	  continue;
	      }
	      config += linea;
	    }
	    //ELIMINAMOS LOS COMENTARIOS
	    config = config.replaceAll("//.*[\r\n]", "");
	    try
	    {
	    	return new JSONObject(config);
	    }
	    catch(Exception e)
	    {
	    	System.out.println("Existe un error en la hoja de configuraciones del portal config.json");
	    	return null;
	    }
	}
	

}
