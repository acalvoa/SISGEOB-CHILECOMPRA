package gea.controller;

import org.json.JSONObject;

import gea.framework.Request;
import gea.framework.Response;

public class ControllerVideo  extends ControllerBase {
	// ACTION PARA RECUPERAR LA URL DEL VIDEO
	public static void get(Request req, Response res) throws Exception {
		String urlVideo;
		
		try {
			urlVideo = req.getData().getString("id");
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "OK");
			retorno.put("DATA", urlVideo);
			res.SendCallback(retorno);
		} catch (Exception e) {
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "No se puede acceder al servicio. Contacte con los administradores de la plataforma.");
			res.SendCallback(retorno);
		}
	}
}
