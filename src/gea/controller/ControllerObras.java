package gea.controller;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.ResourceBundle;

import org.apache.axis.utils.StringUtils;
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

public class ControllerObras extends ControllerBase{
	public static void getObrasComuna(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelObras> obrasComuna = new Model<ModelObras>(ModelObras.class,req);
		
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
		
		
		
		
		//ModelResult<ModelObras> resultado = clasificacion.find("{"
		//		+ "'COMUNA':'"+req.getData().getString("COMUNA")+"'}");
		ModelResult<ModelObras> resultado = obrasComuna.find(bus.toString());
		
		JSONArray ar = resultado.toJSON();
		if(ar.toString() == null && ar.length() > 0) System.out.println("EXCEPTION NULL OBJECT PARSE");
		JSONObject retorno = new JSONObject();
		retorno.put("OBRAS", ar);
		res.SendCallback(retorno);
	}
	public static void getObrasProvincia(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelObras> obrasProvincia = new Model<ModelObras>(ModelObras.class,req);
		
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
		
		
		//ModelResult<ModelObras> resultado = obrasProvincia.find("{"
		//		+ "'PROVINCIA':'"+req.getData().getString("PROVINCIA")+"'}");
		ModelResult<ModelObras> resultado = obrasProvincia.find(bus.toString());
		JSONArray ar = resultado.toJSON();
		JSONObject retorno = new JSONObject();
		retorno.put("OBRAS", ar);
		res.SendCallback(retorno);
	}
	public static void getautocomplete(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelObrasAuto> clasificacion = new Model<ModelObrasAuto>(ModelObrasAuto.class,req);
		ModelResult<ModelObrasAuto> resultado = clasificacion.match("{'TITULO':'"+req.getData().getString("SEARCH")+"'}");
		JSONArray retorno = new JSONArray();
		JSONArray datos = resultado.toJSON();
		for(int i=0; i<datos.length(); i++){
			JSONObject temp = new JSONObject();
			temp.put("label",datos.getJSONObject(i).getString("TITULO"));
			temp.put("data",datos.getJSONObject(i).getString("TITULO"));
			retorno.put(temp);
		}
		res.SendCallback(retorno);
	}
	public static void getautocompletes(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelIdesAuto> clasificacion = new Model<ModelIdesAuto>(ModelIdesAuto.class,req);
		ModelResult<ModelIdesAuto> resultado = clasificacion.match("{'ID_MERCADO_PUB':'"+(req.getData().getString("SEARCH")).trim()+"'}");
		JSONArray retorno = new JSONArray();
		JSONArray datos = resultado.toJSON();
		for(int i=0; i<datos.length(); i++){
			JSONObject temp = new JSONObject();
			temp.put("label", datos.getJSONObject(i).getString("ID_MERCADO_PUB").trim());
			temp.put("data", datos.getJSONObject(i).getString("ID_MERCADO_PUB").trim());
			retorno.put(temp);
		}
		res.SendCallback(retorno);
	}
	public static void getObrasBuscador(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelObras> obras = new Model<ModelObras>(ModelObras.class,req);
		JSONObject bus = new JSONObject();
		JSONObject in = req.getData();
		Date fromDate = null;
		Date toDate = null;
		SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
		try{
			if(!in.getString("MINDATEHEADER").equals("NSET")){
				fromDate = f.parse(req.getData().getString("MINDATEHEADER"));
				//f.applyPattern("dd/MM/yyyy");
				//bus.put("FECHA_FROM", f.format(prev));
			}
			if(!in.getString("MAXDATEHEADER").equals("NSET")){
				toDate = f.parse(req.getData().getString("MAXDATEHEADER"));
				//f.applyPattern("dd/MM/yyyy");
				//bus.put("FECHA_TO", f.format(prev));
			}
			if(!in.getString("SEARCH").equals("")){
				bus.put("TITULO", in.getString("SEARCH"));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}  
		
		
		//ModelResult<ModelObras> resultado = obras.match("{'TITULO':'"+req.getData().getString("SEARCH")+"'}");
		ModelResult<ModelObras> resultado = obras.find(bus.toString());
		if(resultado.size() > 0){
			Model<ModelComunal> chile = new Model<ModelComunal>(ModelComunal.class,req);
			try{
				bus.put("COMUNA", resultado.toJSON().getJSONObject(0).getString("COMUNA"));
				bus.put("REGION", resultado.toJSON().getJSONObject(0).getString("REGION"));
			} catch (Exception e) {
				// TODO: handle exception
			}  
			
			//Se establece el periodo de fechas comprendido por las obras devueltas.
			Date fechaFromObras = null;
			Date fechaToObras = null;
			try {
				f.applyPattern("yyyy-MM-dd HH:mm:ss");
				for(int i = 0; i < resultado.size(); i++) {
					if (fechaFromObras == null || f.parse(resultado.toJSON().getJSONObject(0).getString("FECHA")).before(fechaFromObras)){
						fechaFromObras = f.parse(resultado.toJSON().getJSONObject(0).getString("FECHA"));
					}	
					if(fechaToObras == null || f.parse(resultado.toJSON().getJSONObject(0).getString("FECHA")).after(fechaToObras)){
						fechaToObras = f.parse(resultado.toJSON().getJSONObject(0).getString("FECHA"));
					}
				}
			 } catch (JSONException e) {
				e.printStackTrace();
		    } catch (ParseException e) {
				e.printStackTrace();
			}
			
			//Y se comprueba si está dentro del periodo de fechas establecido en la cabecera.
			f.applyPattern("dd/MM/yyyy");
			if(fechaFromObras.before(fromDate) || fechaToObras.after(toDate)){
				//Si no lo está, se establece en la cabecera el nuevo periodo indicado por las obras, y los datos
				//de comunas y regiones se consultan en base a este nuevo periodo.
				bus.put("FECHA_FROM", f.format(fechaFromObras));
				bus.put("FECHA_TO", f.format(fechaToObras));
			}else{
				//Si lo está, las fechas de la cabecera se añaden al bus para las consultas de comunas y regiones.
				bus.put("FECHA_FROM", f.format(fromDate));
				bus.put("FECHA_TO", f.format(toDate));
			}
			
			//ModelResult<ModelComunal> resul = chile.find("{'NUMERO':'"+resultado.toJSON().getJSONObject(0).getString("COMUNA")+"'}");
			ModelResult<ModelComunal> resul = chile.find(bus.toString());
			if(resul.size() > 0){
				JSONArray ar = resultado.toJSON();
				JSONObject comuna = resul.toJSON().getJSONObject(0);
				//ResourceBundle rb = SpatialInfo.getRbComunas();
				/*String nameTmp = comuna.get("NOMBRE").toString();
				nameTmp = nameTmp.replace(" ", "");
				nameTmp = nameTmp.replace("Ñ", "N");
				System.out.println(nameTmp);*/
				String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", comuna.get("NOMBRE").toString());
				comuna.put("SPATIAL_OBJECT", spatialObject);
				JSONObject retorno = new JSONObject();
				
				Model<ModelRegional> chile3 = new Model<ModelRegional>(ModelRegional.class,req);
				//ModelResult<ModelRegional> resultado3 = chile3.find("{'NUMERO':'"+resultado.toJSON().getJSONObject(0).getString("REGION")+"'}");
				ModelResult<ModelRegional> resultado3 = chile3.find(bus.toString());
				JSONObject region = resultado3.toJSON().getJSONObject(0);
				/*ResourceBundle rbRegion = SpatialInfo.getRbRegiones();
				nameTmp = region.get("NOMBRE").toString();
				nameTmp = nameTmp.replace(" ", "");
				nameTmp = nameTmp.replace("Ñ", "N");
				System.out.println(nameTmp);*/
				spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("R", region.get("NOMBRE").toString());
				region.put("SPATIAL_OBJECT", spatialObject);
				Model<ModelComunal> chile2 = new Model<ModelComunal>(ModelComunal.class,req);
				//ModelResult<ModelComunal> resultado2 = chile2.find("{'REGION':'"+resultado.toJSON().getJSONObject(0).getString("REGION")+"'}");
				bus.remove("COMUNA");
				ModelResult<ModelComunal> resultado2 = chile2.find(bus.toString());
				JSONArray fakeJsonArrayComunas = resultado2.toJSON();
				for (int i = 0; i < fakeJsonArrayComunas.length(); i++) {
					JSONObject jsonObj = fakeJsonArrayComunas.getJSONObject(i);
					
					/*nameTmp = jsonObj.get("NOMBRE").toString();
					//System.out.println(nameTmp);
					nameTmp = nameTmp.replace(" ", "");
					nameTmp = nameTmp.replace("Ñ", "N");
					System.out.println(nameTmp);*/
					spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", jsonObj.get("NOMBRE").toString());
					jsonObj.put("SPATIAL_OBJECT", spatialObject);
				}
				retorno.put("OBRAS", ar);
				retorno.put("STATUS", "1");
				retorno.put("COMUNA", comuna);
				//retorno.put("REGION", resultado3.toJSON().getJSONObject(0));
				retorno.put("REGION", region);
				//retorno.put("COMUNAS", resultado2.toJSON());
				retorno.put("COMUNAS", fakeJsonArrayComunas);
				
				res.SendCallback(retorno);
			}
			else{
				JSONObject retorno = new JSONObject();
				retorno.put("STATUS", "0");
				res.SendCallback(retorno);
			}
		}
		else{
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "0");
			res.SendCallback(retorno);
		}
	}
	public static void getObrasBuscadors(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelObras> clasificacion = new Model<ModelObras>(ModelObras.class,req);
		JSONObject bus = new JSONObject();
		JSONObject in = req.getData();
		Date fromDate = null;
		Date toDate = null;
		SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
		try{
			if(!in.getString("MINDATEHEADER").equals("NSET")){
				fromDate = f.parse(req.getData().getString("MINDATEHEADER"));
				//f.applyPattern("dd/MM/yyyy");
				//bus.put("FECHA_FROM", f.format(prev));
			}
			if(!in.getString("MAXDATEHEADER").equals("NSET")){
				toDate = f.parse(req.getData().getString("MAXDATEHEADER"));
				//f.applyPattern("dd/MM/yyyy");
				//bus.put("FECHA_TO", f.format(prev));
			}
			if(!in.getString("SEARCH").equals("")){
				bus.put("ID_MERCADO_PUB", in.getString("SEARCH"));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}  
		
		
		//ModelResult<ModelObras> resultado = clasificacion.find("{'ID_MERCADO_PUB':'"+req.getData().getString("SEARCH")+"'}");
		ModelResult<ModelObras> resultado = clasificacion.find(bus.toString());
		if(resultado.size() > 0){
			Model<ModelComunal> chile = new Model<ModelComunal>(ModelComunal.class,req);
			try{
				bus.put("COMUNA", resultado.toJSON().getJSONObject(0).getString("COMUNA"));
				bus.put("REGION", resultado.toJSON().getJSONObject(0).getString("REGION"));
			} catch (Exception e) {
				// TODO: handle exception
			}  
			
			//Se establece el periodo de fechas comprendido por las obras devueltas.
			Date fechaFromObras = null;
			Date fechaToObras = null;
			try {
				f.applyPattern("yyyy-MM-dd HH:mm:ss");
				for(int i = 0; i < resultado.size(); i++) {
					if (fechaFromObras == null || f.parse(resultado.toJSON().getJSONObject(0).getString("FECHA")).before(fechaFromObras)){
						fechaFromObras = f.parse(resultado.toJSON().getJSONObject(0).getString("FECHA"));
					}	
					if(fechaToObras == null || f.parse(resultado.toJSON().getJSONObject(0).getString("FECHA")).after(fechaToObras)){
						fechaToObras = f.parse(resultado.toJSON().getJSONObject(0).getString("FECHA"));
					}
				}
			 } catch (JSONException e) {
				e.printStackTrace();
		    } catch (ParseException e) {
				e.printStackTrace();
			}
			
			//Y se comprueba si está dentro del periodo de fechas establecido en la cabecera.
			f.applyPattern("dd/MM/yyyy");
			if(fechaFromObras.before(fromDate) || fechaToObras.after(toDate)){
				//Si no lo está, se establece en la cabecera el nuevo periodo indicado por las obras, y los datos
				//de comunas y regiones se consultan en base a este nuevo periodo.
				bus.put("FECHA_FROM", f.format(fechaFromObras));
				bus.put("FECHA_TO", f.format(fechaToObras));
			}else{
				//Si lo está, las fechas de la cabecera se añaden al bus para las consultas de comunas y regiones.
				bus.put("FECHA_FROM", f.format(fromDate));
				bus.put("FECHA_TO", f.format(toDate));
			}
			
			//ModelResult<ModelComunal> resul = chile.find("{'NUMERO':'"+resultado.toJSON().getJSONObject(0).getString("COMUNA")+"'}");
			ModelResult<ModelComunal> resul = chile.find(bus.toString());
			if(resul.size() > 0){
				JSONArray ar = resultado.toJSON();
				JSONObject comuna = resul.toJSON().getJSONObject(0);
				/*ResourceBundle rb = SpatialInfo.getRbComunas();
				String nameTmp = comuna.get("NOMBRE").toString();
				nameTmp = nameTmp.replace(" ", "");
				nameTmp = nameTmp.replace("Ñ", "N");
				System.out.println(nameTmp);*/
				String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", comuna.get("NOMBRE").toString());
				comuna.put("SPATIAL_OBJECT", spatialObject);
				
				JSONObject retorno = new JSONObject();
				Model<ModelRegional> chile3 = new Model<ModelRegional>(ModelRegional.class,req);
				//ModelResult<ModelRegional> resultado3 = chile3.find("{'NUMERO':'"+resultado.toJSON().getJSONObject(0).getString("REGION")+"'}");
				ModelResult<ModelRegional> resultado3 = chile3.find(bus.toString());
				JSONObject region = resultado3.toJSON().getJSONObject(0);
				/*ResourceBundle rbRegion = SpatialInfo.getRbRegiones();
				nameTmp = region.get("NOMBRE").toString();
				nameTmp = nameTmp.replace(" ", "");
				nameTmp = nameTmp.replace("Ñ", "N");
				System.out.println(nameTmp);*/
				spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("R", region.get("NOMBRE").toString());
				region.put("SPATIAL_OBJECT", spatialObject);
				
				Model<ModelComunal> chile2 = new Model<ModelComunal>(ModelComunal.class,req);
				bus.remove("COMUNA");
				//ModelResult<ModelComunal> resultado2 = chile2.find("{'REGION':'"+resultado.toJSON().getJSONObject(0).getString("REGION")+"'}");
				ModelResult<ModelComunal> resultado2 = chile2.find(bus.toString());
				JSONArray fakeJsonArrayComunas = resultado2.toJSON();
				for (int i = 0; i < fakeJsonArrayComunas.length(); i++) {
					JSONObject jsonObj = fakeJsonArrayComunas.getJSONObject(i);
					
					/*nameTmp = jsonObj.get("NOMBRE").toString();
					//System.out.println(nameTmp);
					nameTmp = nameTmp.replace(" ", "");
					nameTmp = nameTmp.replace("Ñ", "N");
					System.out.println(nameTmp);*/
					spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", jsonObj.get("NOMBRE").toString());
					jsonObj.put("SPATIAL_OBJECT", spatialObject);
				}
				
				retorno.put("OBRAS", ar);
				retorno.put("STATUS", "1");
				retorno.put("COMUNA", comuna);
				//retorno.put("REGION", resultado3.toJSON().getJSONObject(0));
				retorno.put("REGION", region);
				//retorno.put("COMUNAS", resultado2.toJSON());
				retorno.put("COMUNAS", fakeJsonArrayComunas);
				res.SendCallback(retorno);
			}
			else{
				JSONObject retorno = new JSONObject();
				retorno.put("STATUS", "0");
				res.SendCallback(retorno);
			}
		}
		else{
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "0");
			res.SendCallback(retorno);
		}
	}	
	
	
	public static void getComunaBuscador(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
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
			
			if(!in.getString("SEARCH").equals("")){
				bus.put("NOMBRE", in.getString("SEARCH"));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		//ModelResult<ModelComunal> resul = chile.find("{'NOMBRE':'"+req.getData().getString("SEARCH")+"'}");
		ModelResult<ModelComunal> resul = chile.find(bus.toString());
		if(resul.size() > 0){
			Model<ModelObras> obras = new Model<ModelObras>(ModelObras.class,req);

			try{
				bus.put("COMUNA", resul.toJSON().getJSONObject(0).getString("NUMERO"));
				bus.put("REGION", resul.toJSON().getJSONObject(0).getString("REGION"));
			} catch (Exception e) {
				// TODO: handle exception
			}  
			
			//ModelResult<ModelObras> resultado = obras.find("{'COMUNA':'"+resul.toJSON().getJSONObject(0).getString("NUMERO")+"'}");
			ModelResult<ModelObras> resultado = obras.find(bus.toString());
			//if(resultado.size() > 0){
				JSONObject comuna = resul.toJSON().getJSONObject(0);
				/*ResourceBundle rb = SpatialInfo.getRbComunas();
				String nameTmp = comuna.get("NOMBRE").toString();
				nameTmp = nameTmp.replace(" ", "");
				nameTmp = nameTmp.replace("Ñ", "N");
				System.out.println(nameTmp);*/
				String spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", comuna.get("NOMBRE").toString());
				comuna.put("SPATIAL_OBJECT", spatialObject);
				
				JSONObject retorno = new JSONObject();
				Model<ModelComunal> chile2 = new Model<ModelComunal>(ModelComunal.class,req);
				Model<ModelRegional> chile3 = new Model<ModelRegional>(ModelRegional.class,req);
				//ModelResult<ModelRegional> resultado3 = chile3.find("{'NUMERO':'"+resultado.toJSON().getJSONObject(0).getString("REGION")+"'}");
				ModelResult<ModelRegional> resultado3 = chile3.find(bus.toString());
				JSONObject region = resultado3.toJSON().getJSONObject(0);
				/*ResourceBundle rbRegion = SpatialInfo.getRbRegiones();
				nameTmp = region.get("NOMBRE").toString();
				nameTmp = nameTmp.replace(" ", "");
				nameTmp = nameTmp.replace("Ñ", "N");
				System.out.println(nameTmp);*/
				spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("R", region.get("NOMBRE").toString());
				region.put("SPATIAL_OBJECT", spatialObject);
				//ModelResult<ModelComunal> resultado2 = chile2.find("{'REGION':'"+resul.toJSON().getJSONObject(0).getString("REGION")+"'}");
				//Se quita el nombre de la comuna para que busque todas las comunas de la region.
				bus.remove("NOMBRE");
				ModelResult<ModelComunal> resultado2 = chile2.find(bus.toString());
				JSONArray fakeJsonArrayComunas = resultado2.toJSON();
				for (int i = 0; i < fakeJsonArrayComunas.length(); i++) {
					JSONObject jsonObj = fakeJsonArrayComunas.getJSONObject(i);
					
					/*nameTmp = jsonObj.get("NOMBRE").toString();
					//System.out.println(nameTmp);
					nameTmp = nameTmp.replace(" ", "");
					nameTmp = nameTmp.replace("Ñ", "N");
					System.out.println(nameTmp);*/
					spatialObject = SpatialInfo.getInstance().getSpatialInfoRequest("C", jsonObj.get("NOMBRE").toString());
					jsonObj.put("SPATIAL_OBJECT", spatialObject);
				}	
				
				retorno.put("COMUNA", comuna);
				//retorno.put("REGION", resultado3.toJSON().getJSONObject(0));
				retorno.put("REGION", region);
				if(resultado.size() > 0){
					retorno.put("STATUS", "1");
					JSONArray ar = resultado.toJSON();
					retorno.put("OBRAS", ar);
				}else{
					retorno.put("STATUS", "2");
					retorno.put("OBRAS", new JSONArray());
				}
				
				//retorno.put("COMUNAS", resultado2.toJSON());
				retorno.put("COMUNAS", fakeJsonArrayComunas);
				res.SendCallback(retorno);
		//	}
			/*else
			{
				Model<ModelComunal> chile2 = new Model<ModelComunal>(ModelComunal.class,req);
				Model<ModelRegional> chile3 = new Model<ModelRegional>(ModelRegional.class,req);
				//ModelResult<ModelRegional> resultado3 = chile3.find("{'NUMERO':'"+resultado.toJSON().getJSONObject(0).getString("REGION")+"'}");
				ModelResult<ModelRegional> resultado3 = chile3.find(bus.toString());
				//ModelResult<ModelComunal> resultado2 = chile2.find("{'REGION':'"+resul.toJSON().getJSONObject(0).getString("REGION")+"'}");
				ModelResult<ModelComunal> resultado2 = chile2.find(bus.toString());
				JSONObject comuna = resul.toJSON().getJSONObject(0);
				JSONObject retorno = new JSONObject();
				retorno.put("STATUS", "2");
				
				retorno.put("COMUNA", comuna);
				retorno.put("REGION", resultado3.toJSON().getJSONObject(0));
				retorno.put("COMUNAS", resultado2.toJSON());
				res.SendCallback(retorno);
			}*/
		}
		else{
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "0");
			res.SendCallback(retorno);
		}
	}
	public static void advasearch(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException, JSONException, ParseException{
		Model<ModelObrasAdva> search = new Model<ModelObrasAdva>(ModelObrasAdva.class,req);
		JSONObject bus = new JSONObject();
		JSONObject in = req.getData();
		
		if(!in.getString("SERV_CONTR").equals("NSET")) bus.put("SERV_CONTR", req.getData().getString("SERV_CONTR"));
		if(!in.getString("SERV_CONTR").equals("NSET")) bus.put("SERV_MAND", req.getData().getString("SERV_CONTR"));
		if(!in.getString("DESCRIPCION").equals("NSET")) bus.put("DESCRIPCION", req.getData().getString("DESCRIPCION"));
		if(!in.getString("CLASIFICACION").equals("NSET")) bus.put("CLASIFICACION", req.getData().getString("CLASIFICACION"));
		if(!in.getString("MINAMOUNT").equals("NSET")) bus.put("MONTO_CONTRATADO_MIN", ">= "+req.getData().getString("MINAMOUNT"));
		if(!in.getString("MAXAMOUNT").equals("NSET")) bus.put("MONTO_CONTRATADO_MAX", "<= "+req.getData().getString("MAXAMOUNT"));
		if(!in.getString("MINDATE").equals("NSET")){
			SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
			Date prev = f.parse(req.getData().getString("MINDATE"));
			f.applyPattern("MM/dd/yyyy");
			bus.put("FECHA_INI", ">= '"+f.format(prev)+"'");
		}
		if(!in.getString("MAXDATE").equals("NSET")){
			SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
			Date prev = f.parse(req.getData().getString("MAXDATE"));
			f.applyPattern("MM/dd/yyyy");
			bus.put("FECHA_FIN", "<= '"+f.format(prev)+"'");
		}
		
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
		//System.out.println(bus.toString());
		ModelResult<ModelObrasAdva> resul;
		if(bus.length() > 0){
			resul = search.match(bus.toString());
		}
		else
		{
			resul = search.getAll();
		}
		JSONArray ar = resul.toJSON();
		double max = 0;
		for(int i=0; i<ar.length(); i++){
			double val = ar.getJSONObject(i).getDouble("MONTO_CONTRATADO");
			if(val > max){
				max = val;
			}
		}
		for(int i=0; i<ar.length(); i++){
			if(max > 0){
				ar.getJSONObject(i).put("C_CLAS", Math.ceil((ar.getJSONObject(i).getDouble("MONTO_CONTRATADO")/max)*3));
			}
			else
			{
				ar.getJSONObject(i).put("C_CLAS", 1);
			}
			
		}
		res.SendCallback(ar);
	}
	public static void getOne(Request req, Response res) throws ErrorCodeException, Error403Exception, IOException{
		Model<ModelObras> chile = new Model<ModelObras>(ModelObras.class,req);
		ModelResult<ModelObras> resultado = chile.find("{'CODPROYECTO':'"+req.getData().getInt("COD")+"'}");
		JSONObject ob = resultado.toJSON().getJSONObject(0);
		res.SendCallback(ob);
	}
}
