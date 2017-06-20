package gea.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Iterator;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import gea.framework.*;
import gea.model.*;
import gea.packet.PacketErCode;
import gea.types.GEOM;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.Error404Exception;
import gea.utils.Exception.ErrorCodeException;
import gea.utils.geoutils.Base64;
import gea.utils.geoutils.EncodingUtil;
import gea.utils.geoutils.UrlSigner;

public class ControllerFormulario extends ControllerBase{
	public static void FModalidad(Request req, Response res) throws Error403Exception, IOException, ErrorCodeException {
		Model<ModelFModalidad> modalidad = new Model<ModelFModalidad>(ModelFModalidad.class,req);
		JSONObject where = new JSONObject();
		where.put("C_ESTADO_OP", "S");
		ModelResult<ModelFModalidad> resultado = modalidad.find(where.toString());
		res.SendCallback(resultado.toJSON());
	}
	public static void FLPrivada(Request req, Response res) throws Error403Exception, IOException, ErrorCodeException {
		Model<ModelFLPrivada> modalidad = new Model<ModelFLPrivada>(ModelFLPrivada.class,req);
		JSONObject where = new JSONObject();
		where.put("C_ESTADO", "S");
		where.put("C_CAUSA", String.valueOf(req.getData().getInt("CAUSA_PRIV")));
		ModelResult<ModelFLPrivada> resultado = modalidad.find(where.toString());
		res.SendCallback(resultado.toJSON());
	}
	public static void FClasificacion(Request req, Response res) throws Error403Exception, IOException, ErrorCodeException {
		Model<ModelFClasificacion> modalidad = new Model<ModelFClasificacion>(ModelFClasificacion.class,req);
		JSONObject where = new JSONObject();
		where.put("C_ESTADO", "S");
		ModelResult<ModelFClasificacion> resultado = modalidad.find(where.toString());
		res.SendCallback(resultado.toJSON());
	}
	public static void FSubclasificacion(Request req, Response res) throws Error403Exception, IOException, ErrorCodeException {
		Model<ModelFSubclasificacion> modalidad = new Model<ModelFSubclasificacion>(ModelFSubclasificacion.class,req);
		JSONObject where = new JSONObject();
		where.put("C_ESTADO", "S");
		where.put("CLAS_X_CLAS", req.getData().getString("CLASIFICACION"));
		ModelResult<ModelFSubclasificacion> resultado = modalidad.find(where.toString());
		res.SendCallback(resultado.toJSON());
	}
	public static void FTFinanciamiento(Request req, Response res) throws Error403Exception, IOException, ErrorCodeException {
		Model<ModelFTFinanciamiento> modalidad = new Model<ModelFTFinanciamiento>(ModelFTFinanciamiento.class,req);
		JSONObject where = new JSONObject();
		where.put("C_ESTADO_OP", "S");
		ModelResult<ModelFTFinanciamiento> resultado = modalidad.find(where.toString());
		res.SendCallback(resultado.toJSON());
	}
	private static String getIpTrad(String ip){
		String[] ipS = ip.split("\\.");
		String ipF = "";
		for(int i=0; i < ipS.length; i++){
			for(int l=ipS[i].length(); l<3; l++){
				ipS[i] = "0".concat(ipS[i]);
			}
			ipF = ipF.concat(ipS[i]);
		}
		return ipF;
	}
	public static void servicio(Request req, Response res) throws Error403Exception, IOException, ErrorCodeException{
		// EXTRAEMOS LA IP DE SERVICIO
    	String ip = getIpTrad(req.getData().getString("IP"));
    	Model<ModelServiceReg> modelo = new Model<ModelServiceReg>(ModelServiceReg.class,req);
    	JSONObject query = new JSONObject();
    	query.put("IPBEGIN", "<= ".concat(ip));
    	query.put("IPFINISH", ">= ".concat(ip));
    	ModelResult<ModelServiceReg> re = modelo.match(query.toString());
    	JSONObject servicio = new JSONObject();
    	if(re.size() > 0){
    		JSONObject obj = re.toJSON().getJSONObject(0);
    		System.out.println(obj);
    		servicio.put("SERVICIO", obj.getString("T_SERVICIO"));
    		servicio.put("X_SERVICIO", obj.getInt("X_ENTIDAD"));
    		servicio.put("WFS", obj.getString("WFS"));
    		servicio.put("FECHA", obj.getString("F_MODIFICACION"));
    	}
    	else
    	{
    		servicio.put("SERVICIO", "DEFAULT");
    		servicio.put("X_SERVICIO", "-1");
    		servicio.put("WFS", "");
    		servicio.put("FECHA", "");
    	}
    	res.SendCallback(servicio);
	}
	
}

