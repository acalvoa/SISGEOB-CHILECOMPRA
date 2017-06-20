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

public class ControllerRanking extends ControllerBase{
	public static void getNacional(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		JSONObject retorno = new JSONObject();
		Model<ModelRankingNacional> ranking = new Model<ModelRankingNacional>(ModelRankingNacional.class,req);
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
		
		bus.put("LIMIT", 20);
		ModelResult<ModelRankingNacional> resultado = ranking.find(bus.toString());
		res.SendCallback(resultado.toJSON());
		
		
		/*Model<ModelRankingNacional> clasificacion = new Model<ModelRankingNacional>(ModelRankingNacional.class,req);
		ModelResult<ModelRankingNacional> resultado = clasificacion.getAll(20);
		retorno.put("ALL", resultado.toJSON());
		JSONObject query = new JSONObject();
		query.put("F_TRAZON", "BETWEEN TO_DATE('01/01/2015','DD/MM/YYYY') AND TO_DATE('31/12/2015','DD/MM/YYYY')");
		query.put("LIMIT", 10);
		resultado = clasificacion.match(query.toString());
		retorno.put("R2015", resultado.toJSON());
		query.put("F_TRAZON", ">= 01/01/2015");
		query.put("LIMIT", 10);
		resultado = clasificacion.match(query.toString());
		retorno.put("R2016", resultado.toJSON());
		res.SendCallback(retorno);*/
	}
	public static void getRegional(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelRankingNacional> ranking = new Model<ModelRankingNacional>(ModelRankingNacional.class,req);
		
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
		bus.put("LIMIT", 10);
		ModelResult<ModelRankingNacional> resultado = ranking.find(bus.toString());
		res.SendCallback(resultado.toJSON());
		
		/*Model<ModelRankingNacional> clasificacion = new Model<ModelRankingNacional>(ModelRankingNacional.class,req);
		 JSONObject retorno = new JSONObject();
		JSONObject query = new JSONObject();
		query.put("REGION", req.getData().getString("REGION"));
		query.put("LIMIT", 10);
		ModelResult<ModelRankingNacional> resultado = clasificacion.find(query.toString());
		retorno.put("ALL", resultado.toJSON());
		query.put("F_TRAZON", "BETWEEN TO_DATE('01/01/2015','DD/MM/YYYY') AND TO_DATE('31/12/2015','DD/MM/YYYY')");
		query.put("LIMIT", 10);
		resultado = clasificacion.match(query.toString());
		retorno.put("R2015", resultado.toJSON());
		query.put("F_TRAZON", ">= 01/01/2015");
		query.put("LIMIT", 10);
		resultado = clasificacion.match(query.toString());
		retorno.put("R2016", resultado.toJSON());
		res.SendCallback(retorno);*/
	}
	public static void getProvincial(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		
		Model<ModelRankingNacional> ranking = new Model<ModelRankingNacional>(ModelRankingNacional.class,req);
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
		bus.put("LIMIT", 10);
		ModelResult<ModelRankingNacional> resultado = ranking.find(bus.toString());
		res.SendCallback(resultado.toJSON());
		
		
		/*Model<ModelRankingNacional> clasificacion = new Model<ModelRankingNacional>(ModelRankingNacional.class,req);
		JSONObject retorno = new JSONObject();
		JSONObject query = new JSONObject();
		query.put("PROVINCIA", req.getData().getString("PROVINCIA"));
		query.put("LIMIT", 10);
		ModelResult<ModelRankingNacional> resultado = clasificacion.find(query.toString());
		retorno.put("ALL", resultado.toJSON());
		query.put("F_TRAZON", "BETWEEN TO_DATE('01/01/2015','DD/MM/YYYY') AND TO_DATE('31/12/2015','DD/MM/YYYY')");
		query.put("LIMIT", 10);
		resultado = clasificacion.match(query.toString());
		retorno.put("R2015", resultado.toJSON());
		query.put("F_TRAZON", ">= 01/01/2015");
		query.put("LIMIT", 10);
		resultado = clasificacion.match(query.toString());
		retorno.put("R2016", resultado.toJSON());
		res.SendCallback(retorno);*/
	}
	public static void getComunal(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		
		Model<ModelRankingNacional> ranking = new Model<ModelRankingNacional>(ModelRankingNacional.class,req);
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
		bus.put("LIMIT", 10);
		ModelResult<ModelRankingNacional> resultado = ranking.find(bus.toString());
		res.SendCallback(resultado.toJSON());
		
		
		/*Model<ModelRankingNacional> clasificacion = new Model<ModelRankingNacional>(ModelRankingNacional.class,req);
		JSONObject retorno = new JSONObject();
		JSONObject query = new JSONObject();
		query.put("COMUNA", req.getData().getString("COMUNA"));
		query.put("LIMIT", 10);
		ModelResult<ModelRankingNacional> resultado = clasificacion.find(query.toString());
		retorno.put("ALL", resultado.toJSON());
		query.put("F_TRAZON", "BETWEEN TO_DATE('01/01/2015','DD/MM/YYYY') AND TO_DATE('31/12/2015','DD/MM/YYYY')");
		query.put("LIMIT", 10);
		resultado = clasificacion.match(query.toString());
		retorno.put("R2015", resultado.toJSON());
		query.put("F_TRAZON", ">= 01/01/2015");
		query.put("LIMIT", 10);
		resultado = clasificacion.match(query.toString());
		retorno.put("R2016", resultado.toJSON());
		res.SendCallback(retorno);*/
	}
}
