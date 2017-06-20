package gea.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
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

public class ControllerProvincial extends ControllerBase{
	public static void getregion(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelProvincial> provincias = new Model<ModelProvincial>(ModelProvincial.class,req);
		
		//json.put("PROVINCIAS", resultado.toJSON());
		//res.SendCallback(json);
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
		//ModelResult<ModelProvincial> resultado = provincias.find("{'REGION':'"+req.getData().getString("REGION")+"'}");
		ModelResult<ModelProvincial> resultado = provincias.find(bus.toString());
		JSONObject json = new JSONObject();
		
		JSONArray fakeJsonArray = resultado.toJSON();
		for (int i = 0; i < fakeJsonArray.length(); i++) {
			JSONObject jsonObj = fakeJsonArray.getJSONObject(i);
			String nameTmp = jsonObj.get("NOMBRE").toString();

			if(addSpatialInfo.equals("TRUE")){
				if(nameTmp.equals("VALPARAISO") && jsonObj.get("FIT").toString().equals("0")){
					nameTmp = "VALPARAISO_ISLAS";	
				}
				String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("P", nameTmp);
				jsonObj.put("SPATIAL_OBJECT", spatialObject);
			}else{
				jsonObj.put("SPATIAL_OBJECT", "");
			}

		}
		json.put("PROVINCIAS", fakeJsonArray);	
		res.SendCallback(json);
	}
	public static double getTotalInv(ModelResult result, String campo){
		JSONArray total = result.toJSON();
		//RESCATAMOS EL TOTAL DE LA INVERSION
		double totalinversion = 0;
		for(int i=0; i < total.length(); i++){
			totalinversion += total.getJSONObject(i).getDouble(campo);
		}
		return totalinversion;
	}
}
