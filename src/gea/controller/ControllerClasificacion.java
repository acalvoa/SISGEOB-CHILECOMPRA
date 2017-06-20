package gea.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import gea.framework.*;
import gea.model.*;
import gea.packet.PacketErCode;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.ErrorCodeException;

public class ControllerClasificacion extends ControllerBase{
	public static void getNacional(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelClasiNacional> clasificacion = new Model<ModelClasiNacional>(ModelClasiNacional.class,req);
		
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
		} catch (Exception e) {
			// TODO: handle exception
		}  
		System.out.println("CLASIFICACION NACIONAL");
		//ModelResult<ModelClasiNacional> resultado = clasificacion.getAll();
		ModelResult<ModelClasiNacional> resultado = clasificacion.find(bus.toString());
		
		// DEFINIMOS EL CAMPO DE RETORNO
		JSONArray retorno = resultado.toJSON();
		res.SendCallback(retorno);
	}
	public static void getRegional(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelClasiRegional> clasificacion = new Model<ModelClasiRegional>(ModelClasiRegional.class,req);
		
		
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
			if(!in.getString("REGION").equals("")){
				bus.put("REGION", in.getString("REGION"));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		//ModelResult<ModelClasiRegional> resultado = clasificacion.find("{'REGION':'"+req.getData().getString("REGION")+"'}");
		ModelResult<ModelClasiRegional> resultado = clasificacion.find(bus.toString());
		
		/*Model<ModelClasificaciones> clasificaciones = new Model<ModelClasificaciones>(ModelClasificaciones.class,req);
		ModelResult<ModelClasificaciones> resultadoclasi = clasificaciones.getAll();*/
		// DEFINIMOS EL CAMPO DE RETORNO
		JSONArray retorno = resultado.toJSON();
		res.SendCallback(retorno);
	}
	public static void getAllRegClasi(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelClasiRegional> clasificacion = new Model<ModelClasiRegional>(ModelClasiRegional.class,req);
		
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
		} catch (Exception e) {
			// TODO: handle exception
		}  
		ModelResult<ModelClasiRegional> resultado = clasificacion.find(bus.toString());
		//ModelResult<ModelClasiRegional> resultado = clasificacion.getAll();
		res.SendCallback(resultado.toJSON());
	}
	public static void getAllRegional(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		JSONObject reto = new JSONObject();
		for(int h=1; h<=15; h++){
			String reg = String.valueOf(h);
			if(reg.length() < 2) reg = "0"+reg;
			Model<ModelClasiRegional> clasificacion = new Model<ModelClasiRegional>(ModelClasiRegional.class,req);
			ModelResult<ModelClasiRegional> resultado = clasificacion.find("{'REGION':'"+reg+"'}");
			Model<ModelClasificaciones> clasificaciones = new Model<ModelClasificaciones>(ModelClasificaciones.class,req);
			ModelResult<ModelClasificaciones> resultadoclasi = clasificaciones.getAll();
			//RESCATAMOS EL TOTAL DE LA INVERSION
			double totalinversion = ControllerClasificacion.getTotalInv(resultado, "MONTO_CONTRATADO");
			// DEFINIMOS EL CAMPO DE RETORNO
			JSONArray retorno = resultado.toJSON();
			JSONArray clasi = resultadoclasi.toJSON();
			JSONObject veri = new JSONObject();
			for(int l=0; l< retorno.length(); l++){
				veri.put(retorno.getJSONObject(l).getString("NOMBRE"), "");
				Model<ModelNumClasificacion> NUMCLA = new Model<ModelNumClasificacion>(ModelNumClasificacion.class,req);
				ModelResult<ModelNumClasificacion> NUMCLARESU = NUMCLA.find("{'REGION':'"+reg+"', 'CCLASIFICACION':'"+retorno.getJSONObject(l).getString("NUMERO")+"'}");
				JSONArray CLA_TOTAL = NUMCLARESU.toJSON();
				int total_obras = 0;
				for(int g=0; g < CLA_TOTAL.length(); g++){
					total_obras += CLA_TOTAL.getJSONObject(g).getInt("NUMOBRAS");
				}
				retorno.getJSONObject(l).put("NUMERO", total_obras);
			}
			for(int l=0; l< clasi.length(); l++){
				if(!veri.has(clasi.getJSONObject(l).getString("NOMBRE"))){
					retorno.put(new JSONObject("{'NOMBRE':'"+clasi.getJSONObject(l).getString("NOMBRE")+"', 'MONTO_CONTRATADO':0, 'NUMERO':'"+clasi.getJSONObject(l).getInt("NUMERO")+"'}"));
				}
			}
			for(int l=0; l< retorno.length(); l++){
				if(totalinversion == 0){
					retorno.getJSONObject(l).put("POR", 0);
				}
				else
				{
					retorno.getJSONObject(l).put("POR", (retorno.getJSONObject(l).getDouble("MONTO_CONTRATADO")/totalinversion)*100);
				}
			}
			reto.put(reg, retorno);
		}
		res.SendCallback(reto);
	}
	public static void getComunal(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelClasiComunal> clasificacion = new Model<ModelClasiComunal>(ModelClasiComunal.class,req);
		
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
			if(!in.getString("COMUNA").equals("")){
				bus.put("COMUNA", in.getString("COMUNA"));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		//ModelResult<ModelClasiComunal> resultado = clasificacion.find("{'COMUNA':'"+req.getData().getString("COMUNA")+"'}");
		ModelResult<ModelClasiComunal> resultado = clasificacion.find(bus.toString());
		// DEFINIMOS EL CAMPO DE RETORNO
		JSONArray retorno = resultado.toJSON();
		res.SendCallback(retorno);
	}
	public static void getAllComunal(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelClasiComunal> clasificacion = new Model<ModelClasiComunal>(ModelClasiComunal.class,req);
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
			if(!in.getString("REGION").equals("")){
				bus.put("REGION", in.getString("REGION"));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
	
		//ModelResult<ModelClasiComunal> resultado = clasificacion.find("{'REGION':'"+req.getData().getString("REGION")+"'}");
		ModelResult<ModelClasiComunal> resultado = clasificacion.find(bus.toString());
		
		//Model<ModelClasificaciones> clasificaciones = new Model<ModelClasificaciones>(ModelClasificaciones.class,req);
		//ModelResult<ModelClasificaciones> resultadoclasi = clasificaciones.getAll();
		//RESCATAMOS EL TOTAL DE LA INVERSIONreq.getData().getString("REGION")
		// DEFINIMOS EL CAMPO DE RETORNO
		JSONArray retorno = resultado.toJSON();
		res.SendCallback(retorno);
	}
	public static void getAllProvincial(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelClasiProvincial> clasificacion = new Model<ModelClasiProvincial>(ModelClasiProvincial.class,req);
		
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
			if(!in.getString("REGION").equals("")){
				bus.put("REGION", in.getString("REGION"));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		//ModelResult<ModelClasiProvincial> resultado = clasificacion.find("{'REGION':'"+req.getData().getString("REGION")+"'}");
		ModelResult<ModelClasiProvincial> resultado = clasificacion.find(bus.toString());
		//Model<ModelClasificaciones> clasificaciones = new Model<ModelClasificaciones>(ModelClasificaciones.class,req);
		//ModelResult<ModelClasificaciones> resultadoclasi = clasificaciones.getAll();
		//RESCATAMOS EL TOTAL DE LA INVERSIONreq.getData().getString("REGION")
		// DEFINIMOS EL CAMPO DE RETORNO
		JSONArray retorno = resultado.toJSON();
		res.SendCallback(retorno);
	}
	public static void getProvincial(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelClasiProvincial> clasificacion = new Model<ModelClasiProvincial>(ModelClasiProvincial.class,req);
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
			if(!in.getString("PROVINCIA").equals("")){
				bus.put("PROVINCIA", in.getString("PROVINCIA"));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
			
		//ModelResult<ModelClasiProvincial> resultado = clasificacion.find("{'PROVINCIA':'"+req.getData().getString("PROVINCIA")+"'}");
		ModelResult<ModelClasiProvincial> resultado = clasificacion.find(bus.toString());
		//Model<ModelClasificaciones> clasificaciones = new Model<ModelClasificaciones>(ModelClasificaciones.class,req);
		//ModelResult<ModelClasificaciones> resultadoclasi = clasificaciones.getAll();
		// DEFINIMOS EL CAMPO DE RETORNO
		JSONArray retorno = resultado.toJSON();
		res.SendCallback(retorno);
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
	public static void getClasificacion(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelClasificaciones> clasificaciones = new Model<ModelClasificaciones>(ModelClasificaciones.class,req);
		ModelResult<ModelClasificaciones> retorno = clasificaciones.getAll();
		//RESCATAMOS EL TOTAL DE CLASIFICACIONES
		res.SendCallback(retorno.toJSON());
	}

}
