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
	public static void getregion(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelComunal> comunas = new Model<ModelComunal>(ModelComunal.class,req);
		
		JSONObject bus = new JSONObject();
		JSONObject in = req.getData();
		String addSpatialInfo = "";
		try{
			if(!in.getString("MINDATEHEADER").equals("NSET")){
				SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
				Date prev = f.parse(req.getData().getString("MINDATEHEADER"));
				f.applyPattern("dd/MM/yyyy");
				bus.put("FECHA_FROM", f.format(prev));
			}
			if(!in.getString("MAXDATEHEADER").equals("NSET")){
				SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
				Date prev = f.parse(req.getData().getString("MAXDATEHEADER"));
				f.applyPattern("dd/MM/yyyy");
				bus.put("FECHA_TO", f.format(prev));
			}
			if(!in.getString("REGION").equals("")){
				bus.put("REGION", in.getString("REGION"));
			}
			if(in.getString("ADDSPATIALINFO") != null && !in.getString("ADDSPATIALINFO").equals("")){
				addSpatialInfo = in.getString("ADDSPATIALINFO");
			}
		} catch (Exception e) {
			// TODO: handle exception
		}  
		
		//ModelResult<ModelComunal> resultado = comunas.find("{'REGION':'"+req.getData().getString("REGION")+"'}");
		ModelResult<ModelComunal> resultado = comunas.find(bus.toString());
		JSONObject json = new JSONObject();
		
		JSONArray fakeJsonArray = resultado.toJSON();
		for (int i = 0; i < fakeJsonArray.length(); i++) {
			JSONObject jsonObj = fakeJsonArray.getJSONObject(i);
			if(addSpatialInfo.equals("TRUE")){
				String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", jsonObj.get("NOMBRE").toString());
				jsonObj.put("SPATIAL_OBJECT", spatialObject);
			}else{
				jsonObj.put("SPATIAL_OBJECT", "");
			}
		}
		json.put("COMUNAS", fakeJsonArray);
		Model<ModelRegional> chile = new Model<ModelRegional>(ModelRegional.class,req);
		res.SendCallback(json);	
		
		
	}
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
	public static void getOne(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelComunal> chile = new Model<ModelComunal>(ModelComunal.class,req);
		
		JSONObject bus = new JSONObject();
		JSONObject in = req.getData();
		try{
			if(!in.getString("MINDATEHEADER").equals("NSET")){
				SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
				Date prev = f.parse(req.getData().getString("MINDATEHEADER"));
				f.applyPattern("dd/MM/yyyy");
				bus.put("FECHA_FROM", f.format(prev));
			}
			if(!in.getString("MAXDATEHEADER").equals("NSET")){
				SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
				Date prev = f.parse(req.getData().getString("MAXDATEHEADER"));
				f.applyPattern("dd/MM/yyyy");
				bus.put("FECHA_TO", f.format(prev));
			}
			if(!in.getString("COMUNAS").equals("")){
				bus.put("REGION", in.getString("COMUNAS"));
			}
			if(!in.getString("COMUNA").equals("")){
				bus.put("COMUNA", in.getString("COMUNA"));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}  
		
		
		//ModelResult<ModelComunal> resultado = chile.find("{'NUMERO':'"+req.getData().getString("COMUNA")+"'}");
		ModelResult<ModelComunal> resultado = chile.find(bus.toString());
		Model<ModelComunal> comunas = new Model<ModelComunal>(ModelComunal.class,req);
		//ModelResult<ModelComunal> resultado_comunas = comunas.find("{'REGION':'"+req.getData().getString("COMUNAS")+"'}");
		JSONObject comuna = resultado.toJSON().getJSONObject(0);
		String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", comuna.get("NOMBRE").toString());
		comuna.put("SPATIAL_OBJECT", spatialObject);
		
		bus.remove("COMUNA");
		ModelResult<ModelComunal> resultado_comunas = comunas.find(bus.toString());
		JSONArray fakeJsonArrayComunas = resultado_comunas.toJSON();
		for (int i = 0; i < fakeJsonArrayComunas.length(); i++) {
			JSONObject jsonObj = fakeJsonArrayComunas.getJSONObject(i);
			spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", jsonObj.get("NOMBRE").toString());
			jsonObj.put("SPATIAL_OBJECT", spatialObject);
		}	
		
		JSONObject retorno = new JSONObject();
		//retorno.put("COMUNA", resultado.toJSON().getJSONObject(0));
		retorno.put("COMUNA", comuna);
		//retorno.put("COMUNAS", resultado_comunas.toJSON());
		retorno.put("COMUNAS", fakeJsonArrayComunas);
		res.SendCallback(retorno);
	}
	
}
