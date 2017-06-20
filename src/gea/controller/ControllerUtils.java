package gea.controller;

import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import gea.framework.*;
import gea.model.*;
import gea.packet.PacketErCode;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.Error404Exception;
import gea.utils.Exception.ErrorCodeException;

public class ControllerUtils extends ControllerBase{
	public static void getServicios(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelServicios> chile = new Model<ModelServicios>(ModelServicios.class,req);
		ModelResult<ModelServicios> resul = chile.match("{'SERVICIO':'"+req.getData().getString("SERVICIO")+"'}");
		JSONArray retorno = new JSONArray();
		JSONArray datos = resul.toJSON();
		for(int i=0; i<datos.length(); i++){
			JSONObject temp = new JSONObject();
			temp.put("label",datos.getJSONObject(i).getString("SERVICIO"));
			temp.put("data",datos.getJSONObject(i).getString("SERVICIO"));
			retorno.put(temp);
		}
		res.SendCallback(retorno);
	}
	public static void validateService(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelServicios> chile = new Model<ModelServicios>(ModelServicios.class,req);
		ModelResult<ModelServicios> resul = chile.find("{'SERVICIO':'"+req.getData().getString("SERVICIO")+"'}");
		JSONObject retorno = new JSONObject();
		if(resul.size() == 1){
			retorno.put("status", true);
		}
		else
		{
			retorno.put("status", false);
		}
		res.SendCallback(retorno);
	}
}
