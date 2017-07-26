package gea.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.ResourceBundle;

import org.apache.commons.lang3.StringEscapeUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import SPATIAL.SpatialInfo;
import gea.framework.*;
import gea.model.*;
import gea.packet.PacketErCode;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.ErrorCodeException;

public class ControllerComunal extends ControllerBase{
	public static void getautocomplete(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelComunalAuto> comunas = new Model<ModelComunalAuto>(ModelComunalAuto.class,req);
		JSONObject query = new JSONObject();
		String consulta = req.getData().getString("SEARCH");
		query.put("NOMBRE", req.getData().getString("SEARCH").replaceAll("'", "\'"));
		ModelResult<ModelComunalAuto> resultado = comunas.match(query.toString());
		JSONArray retorno = new JSONArray();
		JSONArray datos = resultado.toJSON();
		for(int i=0; i<datos.length(); i++){
			JSONObject temp = new JSONObject();
			temp.put("value", datos.getJSONObject(i).getString("NOMBRE"));
			temp.put("CENTROIDE", datos.getJSONObject(i).get("CENTROIDE"));
			retorno.put(temp);
		}
		res.SendCallback(retorno);
	}
	public static void getcomunaone(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelComunalAuto> comunas = new Model<ModelComunalAuto>(ModelComunalAuto.class,req);
		JSONObject query = new JSONObject();
		query.put("NOMBRE", req.getData().getString("SEARCH"));
		ModelResult<ModelComunalAuto> resultado = comunas.find(query.toString());
		JSONObject retorno = new JSONObject();
		JSONArray datos = resultado.toJSON();
		for(int i=0; i<datos.length(); i++){
			JSONObject temp = new JSONObject();
			temp.put("value", datos.getJSONObject(i).getString("NOMBRE"));
			temp.put("CENTROIDE", datos.getJSONObject(i).get("CENTROIDE"));
			temp.put("NUMERO", datos.getJSONObject(i).getString("NUMERO"));
			retorno = temp;
		}
		res.SendCallback(retorno);
	}
}
