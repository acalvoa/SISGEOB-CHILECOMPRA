package gea.mercadopublico;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

public class OrdenDeCompra {
	
	String parametro;
	OCData oc_data;
	private JSONObject jObject;
	private JSONObject lastJObject;
	
	public OrdenDeCompra(String parametro) throws IOException {
		this.parametro= parametro;
	}
	public JSONObject last() throws IOException{
		this.readJsonMP();
		this.readInfo();
		return lastJObject;
	}
	public JSONObject principal() throws IOException
	{
		this.readJsonMP();
		this.readInfo();
		return this.jObject;
	}
	public OCData adjudicacion() throws IOException
	{
		this.readJsonMP();
		this.readInfo();
		return this.oc_data;
	}
	private void readInfo(){
		// TODO Auto-generated method stub
		JSONArray json = this.jObject.getJSONArray("Listado");
		for(int i=0; i< json.length(); i++){
			this.lastJObject = json.getJSONObject(i);
			this.oc_data = new OCData(json.getJSONObject(i));
		}
		this.jObject.put("NOMBRE", ((this.oc_data.NOMBRE.replaceAll("[\"|\\?|\']+", "")).replaceAll("[\\r|\\n|\\t]+|^ +| +$|( )+", " ")));
		this.jObject.put("DESCRIPCION",((this.oc_data.DESCRIPCION.replaceAll("[\"|\\?|\']+", "")).replaceAll("[\\r|\\n|\\t]+|^ +| +$|( )+", " ")));
		this.jObject.put("TOMARAZON",this.oc_data.getTOMARAZON());
		this.jObject.put("CODIGOEXTERNO",this.oc_data.CODIGO_TIPO);
		this.jObject.put("PLAZOBRA",this.oc_data.getPLAZOBRA());
	    this.jObject.put("UNIDATIEMPO",this.oc_data.getUNIDATIEMPO());
	    this.jObject.put("MONEDA",this.oc_data.TIPO_MONEDA);
	    
		try{
		this.jObject.put("MONTOESTIMADO",this.oc_data.getMONTOESTIMADO());
		}catch(Exception e)
		{
			this.jObject.put("MONTOESTIMADO",0);
		}
		this.jObject.put("TIPO", this.oc_data.getTIPO());
		this.jObject.put("CANTIDADITEMS", this.oc_data.ITEMS.length);
		this.jObject.put("ITEMS", this.oc_data.getITEMS());
	}
	private void readJsonMP() throws IOException {
		// TODO Auto-generated method stub
		String url="";
		
		String resultado = "";
		
		JSONObject json = OrdenDeCompra.getConfig();
		url = "http://"+json.getJSONObject("MERCADOPUBLICO").getString("OC") +"codigo="+ this.parametro+"&"+json.getJSONObject("MERCADOPUBLICO").getString("TICKETOC");
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
}
