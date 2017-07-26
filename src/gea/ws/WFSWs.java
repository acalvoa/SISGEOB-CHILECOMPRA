package gea.ws;

import gea.framework.Cache;
import gea.framework.Model;
import gea.framework.ModelResult;
import gea.model.ModelIdsMercadoUnico;
import gea.model.ModelObras;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;


public class WFSWs {
	public static JSONObject GETINFOBYID(HttpServletRequest req, HttpServletResponse res) throws Exception {
		if(req.getParameter("CODE") != null && req.getParameter("ENTIDAD") != null){
			String code = req.getParameter("CODE");
			String entidad = req.getParameter("ENTIDAD");
			Model<ModelIdsMercadoUnico> geo_mercado = new Model<ModelIdsMercadoUnico>(ModelIdsMercadoUnico.class);
			Model<ModelObras> geo_obras = new Model<ModelObras>(ModelObras.class);
			JSONObject query = new JSONObject();
			query.put("CODIGO_ENTIDAD", code);
			query.put("X_ENTIDAD", entidad);
			ModelResult<ModelIdsMercadoUnico> result = geo_mercado.find(query.toString());
			if(result.size() > 0){
				JSONArray retorno = new JSONArray();
				JSONArray resultados = result.toJSON();
				for(int i=0; i<resultados.length();i++){
					JSONObject query_o = new JSONObject();
					query_o.put("CODPROYECTO", resultados.getJSONObject(i).get("PROY_X_PROY"));
					ModelResult<ModelObras> expediente = geo_obras.findOne(query_o.toString());
					JSONObject element = new JSONObject();
					JSONObject expediente_r = expediente.toJSON().getJSONObject(0);
					element.put("CODIGO_GEOCGR", expediente_r.getString("X_EXPE"));
					element.put("ID_MERCADO_PUBLICO", resultados.getJSONObject(i).get("C_ID_MERC_UNICO"));
					retorno.put(element);
				}
				JSONObject retorno_final = new JSONObject();
				retorno_final.put("STATUS", "OK");
				retorno_final.put("DATA", retorno);
				return retorno_final;
			}
			else{
				JSONObject retorno = new JSONObject();
				retorno.put("STATUS", "NOTFOUND");
				retorno.put("ERROR", "NO HAY OBRAS ASOCIADAS A LA ENTIDAD INDICADA CON EL CODIGO PROVEIDO.");
				return retorno;
			}
			
		}
		else{
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "FALTAN PARAMETROS EN LA LLAMADA DEL SERVICIO");
			return retorno;
		}
	}
	public static JSONObject GETSTATUSBYMP(HttpServletRequest req, HttpServletResponse res) throws Exception {
		if(req.getParameter("MP") != null){
			String code = req.getParameter("MP");
			Model<ModelIdsMercadoUnico> geo_mercado = new Model<ModelIdsMercadoUnico>(ModelIdsMercadoUnico.class);
			JSONObject query = new JSONObject();
			query.put("C_ID_MERC_UNICO", code);
			ModelResult<ModelIdsMercadoUnico> result = geo_mercado.find(query.toString());
			if(result.size() > 0){
				JSONObject retorno = new JSONObject();
				retorno.put("STATUS", "OK");
				retorno.put("INFO", "LA LICITACION PRESENTA REGISTROS GEOREFERENCIADOS EN SISGEOB.");
				return retorno;
			}
			else{
				JSONObject retorno = new JSONObject();
				retorno.put("STATUS", "NOTFOUND");
				retorno.put("INFO", "NO HAY OBRAS ASOCIADAS AL ID DE MERCADO PUBLICO.");
				return retorno;
			}
			
		}
		else{
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "FALTAN PARAMETROS EN LA LLAMADA DEL SERVICIO");
			return retorno;
		}
	}
}