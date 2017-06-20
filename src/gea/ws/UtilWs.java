package gea.ws;

import gea.framework.Cache;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

public class UtilWs {
	public static JSONObject CleanCache(HttpServletRequest req, HttpServletResponse res) throws Exception {
		Cache cache = Cache.getInstance();
		cache.Clean();
		JSONObject retorno = new JSONObject();
		retorno.put("STATUS", "OK");
		retorno.put("TASK", "CACHE LIMPIADO");
		return retorno;
	}	
}
