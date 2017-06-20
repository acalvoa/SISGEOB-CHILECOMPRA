package gea.framework;

import gea.websocket.GEOWebSocketHandler;
import org.json.JSONArray;
import org.json.JSONObject;

public class Cache {
	//DEFINIMOS LA SENTENCIA GLOBAL
	private static Cache instance = null;
	//DEFINIMOS LA TABLA DE HASH
	private JSONObject table;
	private GEOWebSocketHandler Handler;
	//DEFINIMOS EL CONSTRUCTOR
	public Cache(){
		System.out.println("Servicio de Cache Iniciado");
		this.table = new JSONObject();
		this.cleantask();
	}
	//CREAMOS EL CONSTRUCTOR
	public Cache(GEOWebSocketHandler Handler){
		instance = this;
		System.out.println("Servicio de Cache Iniciado");
		this.table = new JSONObject();
		this.Handler = Handler;
		this.cleantask();
	}
	public static Cache getInstance() {
		if(instance == null) {
			instance = new Cache();
		}
		return instance;
	}
	//LIMPIADOR DE CACHE
	public void Clean(){
		System.out.println("Limpiando "+(table.length())+" registros del cache.");
		this.table = null;
		this.table = new JSONObject();
	}
	//TIMMER DEL CHACHE
	private void cleantask(){
		Runnable cachetask = new CacheControl(this,Handler);
		Thread hilo_cache = new Thread(cachetask);
		hilo_cache.start();
	}
	// VERIFICACION DEL CACHE PRESENTE
	public boolean verifyCache(String request){
		if(table.has(request)){
			return true;
		}
		return false;
	}
	public String verifyCacheType(String request){
		if(table.has(request) && table.getJSONObject(request).getString("t").equals("O")){
			return "O";
		}
		else if(table.has(request) && table.getJSONObject(request).getString("t").equals("A"))
		{
			return "A";
		}
		return "N";
	}
	// RESCATE DEL CACHE PRESENTE
	public JSONArray getACache(String request){
		if(table.has(request) && table.getJSONObject(request).getString("t").equals("A")){
			System.out.println("Obteniendo registro del cache. "+request);
			return table.getJSONObject(request).getJSONArray("d");
		}
		return null;
	}
	public JSONObject getOCache(String request){
		if(table.has(request) && table.getJSONObject(request).getString("t").equals("O")){
			System.out.println("Obteniendo registro del cache. "+request);
			return table.getJSONObject(request).getJSONObject("d");
		}
		return null;
	}
	// INSCRIPCION DE NUEVO REGISTRO
	public void setCache(String request, JSONObject cache){
		if(!table.has(request)){
			System.out.println("Añadiendo registro al cache. "+request);
			JSONObject cache_reg = new JSONObject();
			cache_reg.put("t","O");
			cache_reg.put("d",cache);
			table.put(request,cache_reg);
		}
	}
	public void setCache(String request, JSONArray cache){
		if(!table.has(request)){
			System.out.println("Añadiendo registro al cache. "+request);
			JSONObject cache_reg = new JSONObject();
			cache_reg.put("t","A");
			cache_reg.put("d",cache);
			table.put(request,cache_reg);
		}
	}
}
