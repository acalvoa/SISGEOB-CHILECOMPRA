package gea.controller;

import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.ResourceBundle;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import SPATIAL.SpatialInfo;
import gea.framework.*;
import gea.model.*;
import gea.packet.PacketErCode;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.ErrorCodeException;

public class ControllerRegiones extends ControllerBase{
	public static void get(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		/*ORIGINAL
		 * 
		 * Model<ModelRegional> chile = new Model<ModelRegional>(ModelRegional.class,req);
		ModelResult<ModelRegional> resultado = chile.getAll();
		JSONObject json = new JSONObject();
		json.put("regiones", resultado.toJSON());
		res.SendCallback(json);*/
		
		JSONObject bus = new JSONObject();
		JSONObject in = req.getData();
		String addSpatialInfo = "";
		try {
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
			if(in.getString("ADDSPATIALINFO") != null && !in.getString("ADDSPATIALINFO").equals("")){
				addSpatialInfo = in.getString("ADDSPATIALINFO");
			}
			
		} catch (Exception e) {
			// TODO: handle exception
		}  
		
		Model<ModelRegional> chile = new Model<ModelRegional>(ModelRegional.class,req);
		System.out.println("Previo a la consulta:" + new Date());
		long startC = System.currentTimeMillis();
		ModelResult<ModelRegional> resultado;
		if(bus.length() > 0){
			resultado = chile.match(bus.toString());
		}else{
			resultado = chile.getAll();
		}	
		long endC = System.currentTimeMillis();
		System.out.println("Después de la consulta:" + new Date() + ". Tiempo:" + (endC - startC) + " ms");
		JSONObject json = new JSONObject();
		
		JSONArray fakeJsonArray = resultado.toJSON();
		for (int i = 0; i < fakeJsonArray.length(); i++) {
			JSONObject jsonObj = fakeJsonArray.getJSONObject(i);
				if(addSpatialInfo.equals("TRUE")){
					String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("R", jsonObj.get("NOMBRE").toString());
					jsonObj.put("SPATIAL_OBJECT", spatialObject);
				}else{
					jsonObj.put("SPATIAL_OBJECT", "");
				}
		}
		json.put("regiones", fakeJsonArray);	

		long endCJSon = System.currentTimeMillis();
		//System.out.println("Después de la conversión a JSON:" + new Date() + ". Tiempo:" + (endCJSon - endC) + " ms");
		res.SendCallback(json);
		
	}
			
	
	public static void getOne(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelRegional> chile = new Model<ModelRegional>(ModelRegional.class,req);
		JSONObject bus = new JSONObject();
		JSONObject in = req.getData();
		try {
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
			
		} catch (Exception e) {
			// TODO: handle exception
		}  
		
		//ModelResult<ModelRegional> resultado = chile.find("{'NUMERO':'"+req.getData().getString("REGION")+"'}");
		//ModelResult<ModelRegional> resultado = chile.find("{'REGION':'"+req.getData().getString("REGION")+"'}");
		ModelResult<ModelRegional> resultado = chile.find(bus.toString());
		JSONObject region = resultado.toJSON().getJSONObject(0);
		String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("R", region.get("NOMBRE").toString());
		region.put("SPATIAL_OBJECT", spatialObject);
		
		//res.SendCallback(resultado.toJSON().getJSONObject(0));
		res.SendCallback(region);
	}
	
	public static void getCoberturasProvComun(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelProvincialCoberturas> chile = new Model<ModelProvincialCoberturas>(ModelProvincialCoberturas.class,req);
		Model<ModelComunalCoberturas> chileCom = new Model<ModelComunalCoberturas>(ModelComunalCoberturas.class,req);
		JSONObject bus = new JSONObject();
		JSONObject in = req.getData();
		String addSpatialInfo = "";
		try {
			if(in.getString("ADDSPATIALINFO") != null && !in.getString("ADDSPATIALINFO").equals("")){
				addSpatialInfo = in.getString("ADDSPATIALINFO");
			}
		} catch (Exception e) {
			// TODO: handle exception
		}  
		
		JSONObject json = new JSONObject();
		
		ModelResult<ModelProvincialCoberturas> resultado = chile.find(bus.toString());
		JSONArray fakeJsonArray = resultado.toJSON();
		for (int i = 0; i < fakeJsonArray.length(); i++) {
			JSONObject jsonObj = fakeJsonArray.getJSONObject(i);
			String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("P", jsonObj.get("NOMBRE").toString());
    		jsonObj.put("SPATIAL_OBJECT", spatialObject);
		}
		json.put("PROVINCIAS", fakeJsonArray);	
		
		ModelResult<ModelComunalCoberturas> resultadoCom = chileCom.find(bus.toString());
		JSONArray fakeJsonArrayCom = resultadoCom.toJSON();
		for (int i = 0; i < fakeJsonArrayCom.length(); i++) {
			JSONObject jsonObj = fakeJsonArrayCom.getJSONObject(i);
			String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", jsonObj.get("NOMBRE").toString());
    		jsonObj.put("SPATIAL_OBJECT", spatialObject);
		}
		json.put("COMUNAS", fakeJsonArrayCom);
		
		
		
		
		res.SendCallback(json);
	}
}
