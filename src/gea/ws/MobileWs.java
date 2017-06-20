package gea.ws;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import oracle.jdbc.OraclePreparedStatement;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import SPATIAL.Coordinate;
import SPATIAL.PointType;
import SPATIAL.Spatial;
import gea.adapters.OracleConnector;
import gea.annotation.ModelField;
import gea.framework.Model;
import gea.framework.ModelResult;
import gea.mercadopublico.MercadoPublico;
import gea.model.ModelCompartirMobile;
import gea.model.ModelDenunciaMobile;
import gea.model.ModelFichaMobile;
import gea.model.ModelImageMobile;
import gea.model.ModelMobileInteractuar;
import gea.model.ModelMobileSeguimiento;
import gea.model.ModelNeighbor;
import gea.model.ModelTypeDenunciaMobile;
import gea.model.ModelUserMobile;
import gea.model.ModelValueMobile;
import gea.model.ModelValueMobileObra;
import gea.utils.Exception.Error403Exception;

public class MobileWs {
	public static JSONObject GETNEIGHBOR(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String LAT = req.getParameter("LAT");
		String LONG = req.getParameter("LONG");
		String DISTANCE = req.getParameter("DIST");
		String USER = req.getParameter("USER");
		//HACEMOS DISCRIMINACION POR PARAMETROS
		if(LAT == null || LONG == null || DISTANCE == null || USER == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else{
			Double D_LAT = Double.valueOf(LAT);
			Double D_LONG = Double.valueOf(LONG);
			Double D_DISTANCE = Double.valueOf(DISTANCE);
			if(!(D_LAT >= -90 && D_LAT <= 90)){
				retorno.put("STATUS", "ERROR");
				retorno.put("ERROR", "LA LATITUD ESTA FUERA DE LOS LIMITES PERMITIDOS. MIN: -90 Y MAX 90.");
				return retorno;
			}
			if(!(D_LONG >= -180 && D_LONG <= 180)){
				retorno.put("STATUS", "ERROR");
				retorno.put("ERROR", "LA LONGITUD ESTA FUERA DE LOS LIMITES PERMITIDOS. MIN: -180 Y MAX 180.");
				return retorno;
			}
			if(!(D_DISTANCE > 0)){
				retorno.put("STATUS", "ERROR");
				retorno.put("ERROR", "DISTANCIA DEBE SER MAYOR A 0.");
				return retorno;
			}
		}
		try {
			OracleConnector ora = new OracleConnector();
			ora.connect();
			OraclePreparedStatement sta = ora.prepare("SELECT PROY.X_PROY AS CODIGO, SUBSTR(NVL(PROY.TITULO_CORTO,PROY.T_TITULO_PROYECTO),0,50) AS TITULO, SDO_UTIL.TO_GMLGEOMETRY(SPATIAL_OBJECT) AS SPATIAL_OBJECT, SDO_NN_DISTANCE(1) DISTANCIA, NVL(MOBVALUE.VALUE,-1) AS VALOR, NVL(VALUEPROM,-1) AS VALORPROM, SPA.SPATIAL_OBJECT.GET_GTYPE() AS TIPO, FICHA.AVANCE_FISICO AS AVANCE, FICHA.MONTO_CONTRATADO AS MONTO FROM SPATIAL_DATA SPA  INNER JOIN GEO_PROYECTOS PROY ON SPA.PROY_X_PROY = PROY.X_PROY INNER JOIN FICHAMOBILE FICHA ON FICHA.CODIGO = PROY.X_PROY LEFT JOIN GEO_MOBILE_VALUE MOBVALUE ON PROY.X_PROY = MOBVALUE.PROY_X_PROY AND MOBVALUE.USER_X_USER = ? LEFT JOIN (SELECT PROY_X_PROY,AVG(VALUE) AS VALUEPROM FROM GEO_MOBILE_VALUE GROUP BY PROY_X_PROY) VALPROM ON VALPROM.PROY_X_PROY = PROY.X_PROY WHERE SDO_NN(SPA.SPATIAL_OBJECT, ?, ?,1) = 'TRUE'");
			List<Coordinate> lista = new ArrayList<Coordinate>();
			lista.add(new Coordinate(Double.valueOf(req.getParameter("LAT")),Double.valueOf(req.getParameter("LONG"))));
			Spatial ingreso = new PointType(lista);
			sta.setInt(1, Integer.valueOf(USER));
			sta.setObject(2, ingreso.toObject(ora));
			sta.setString(3, "distance=".concat(req.getParameter("DIST")).concat(" unit=KM"));
			
			Model<ModelNeighbor> consulta = new Model<ModelNeighbor>(ModelNeighbor.class);
			ModelResult<ModelNeighbor> resultado = consulta.specialQuery(sta, ora);
			if(resultado.size()>0){
				retorno.put("STATUS", "OK");
				retorno.put("RESULT_SIZE", resultado.size());
				retorno.put("LOCATION", resultado.toJSON());
				return retorno;
			}
			else{
				retorno.put("STATUS", "OK");
				retorno.put("RESULT_SIZE", 0);
				return retorno;
			}
		} catch (IOException e) {
			System.out.println("Error de acceso a la base de datos, verifique la conexión");
			System.out.println("Error: "+e.getMessage());
		} catch (SQLException e) {
			System.out.println("Error en sentencia SQL y preparación de Statement");
			System.out.println("Error: "+e.getMessage());
		} catch (Error403Exception e) {
			// TODO Auto-generated catch block
			System.out.println("Error al ejecutar consulta SQL");
			System.out.println("Error: "+e.getMessage());
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			System.out.println("Error al ejecutar consulta SQL");
			System.out.println("Error: "+e.getMessage());
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			System.out.println("Error al ejecutar consulta SQL");
			System.out.println("Error: "+e.getMessage());
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			System.out.println("Error al ejecutar consulta SQL");
			System.out.println("Error: "+e.getMessage());
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			System.out.println("Error al ejecutar consulta SQL");
			System.out.println("Error: "+e.getMessage());
		} catch (NoSuchFieldException e) {
			// TODO Auto-generated catch block
			System.out.println("Error al ejecutar consulta SQL");
			System.out.println("Error: "+e.getMessage());
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject GETSEGUIMIENTO(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String USER = req.getParameter("USER");
		if(USER == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{

			JSONObject query = new JSONObject();
			try {
				if(USER != null){
					OracleConnector ora = new OracleConnector();
					ora.connect();
					OraclePreparedStatement sta = ora.prepare("SELECT SEGUIMIENTO.CODIGO AS CODIGO, SUBSTR(NVL(PROY.TITULO_CORTO,PROY.T_TITULO_PROYECTO),0,50) AS TITULO, FICHA.ULTIMO_REG AS FECHA, VALOR_PROM.VALUEPROM AS VALORPROM, SEGUIMIENTO.VALOR AS VALOR, SEGUIMIENTO.COMPARTIR AS COMPARTIR, SEGUIMIENTO.ALERTA AS ALERTA, SEGUIMIENTO.VISUALIZO AS VISUALIZO FROM FICHAMOBILE FICHA, GEO_PROYECTOS PROY, MOBILE_SEGUIMIENTO SEGUIMIENTO INNER JOIN(SELECT AVG(VALOR.VALUE) AS VALUEPROM,VALOR.PROY_X_PROY AS CODIGO FROM GEO_MOBILE_VALUE VALOR GROUP BY VALOR.PROY_X_PROY ) VALOR_PROM  ON SEGUIMIENTO.CODIGO = VALOR_PROM.CODIGO WHERE SEGUIMIENTO.USER_X_USER = ? AND SEGUIMIENTO.CODIGO = FICHA.CODIGO AND SEGUIMIENTO.CODIGO = PROY.X_PROY");
					sta.setInt(1, Integer.valueOf(USER));
					Model<ModelMobileSeguimiento> consulta = new Model<ModelMobileSeguimiento>(ModelMobileSeguimiento.class);
					ModelResult<ModelMobileSeguimiento> resultado = consulta.specialQuery(sta, ora);

					if(resultado.size() > 0){
						retorno.put("SEGUIMIENTO", resultado.toJSON());
						retorno.put("STATUS", "OK");
						return retorno;
					}
					else
					{
						retorno.put("STATUS", "NOTRESULT");
						return retorno;
					}
				}
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (NoSuchFieldException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject SETCOMPARTIR(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		SimpleDateFormat f_creacion = new SimpleDateFormat("dd/MM/yyyy");
		boolean UPDATE_RESUMEN = false;
		//VERIFICAMOS LOS PARAMETROS
		String USER = req.getParameter("USER");
		String CODIGO = req.getParameter("CODIGO");
	//	String COMMENT = req.getParameter("COMMENT");
		if(CODIGO == null  || USER == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			// VERIFICAMOS QUE EL USUARIO EXISTA Y EL PROYECTO SEA REAL
			JSONObject Q_USER = new JSONObject();
			Q_USER.put("X_USER",USER);
			JSONObject Q_PROY = new JSONObject();
			Q_PROY.put("CODIGO", CODIGO);
			//CREAMOS LOS OBJETOS A ANALIZAR MODELOS
			Model<ModelUserMobile> V_USER = new Model<ModelUserMobile>(ModelUserMobile.class);
			Model<ModelMobileInteractuar> UPDATE_OBRA = new Model<ModelMobileInteractuar>(ModelMobileInteractuar.class);

			try {
				if(V_USER.find(Q_USER.toString()).size() == 0){
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EL USUARIO NO EXISTE");
					return retorno;
				}

				// CREAMOS EL OBJETO DE INGRESO
				JSONObject compartir = new JSONObject();
				compartir.put("PROY_X_PROY", CODIGO);
				compartir.put("USER_X_USER", USER);

				// INGRESAMOS EL OBJETO
				Model<ModelCompartirMobile> OBRA_COMPARTIR = new Model<ModelCompartirMobile>(ModelCompartirMobile.class);
				if(OBRA_COMPARTIR.insert(compartir.toString())){
					JSONObject Q_VALUE = new JSONObject();
					Q_VALUE.put("ID_COMPARTIR", 1);
					if(UPDATE_OBRA.find(compartir.toString()).size()==0)
					{
						compartir.put("ID_VALOR", 0);
						compartir.put("ID_COMPARTIR", 1);
						compartir.put("ID_ALERTA",0);
						UPDATE_OBRA.insert(compartir.toString());
					}
					else UPDATE_OBRA.update(Q_VALUE.toString(),compartir.toString());
					
					retorno.put("STATUS", "OK");
					return retorno;
				}
				else
				{
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EXISTE UN ERROR AL REGISTRAR EN LA BASE DE DATOS LA OBRA COMPARTIDA");
					return retorno;
				}
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject GETTYPESDENUNCIA(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		// INGRESAMOS EL OBJETO
		Model<ModelTypeDenunciaMobile> TYPE = new Model<ModelTypeDenunciaMobile>(ModelTypeDenunciaMobile.class);
		try {
			ModelResult<ModelTypeDenunciaMobile> resultado = TYPE.getAll();
			retorno.put("STATUS", "OK");
			retorno.put("TYPE", resultado.toJSON());
			return retorno;
		} catch (Error403Exception e) {
			// TODO Auto-generated catch block
			System.out.println("Error al obtener la lista de tipos de denuncia");
			System.out.println("Error: "+e.getMessage());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("Error al obtener la lista de tipos de denuncia");
			System.out.println("Error: "+e.getMessage());
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject REGUSER(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String MACHINE = req.getParameter("ID_MACHINE");
		String TYPE = req.getParameter("TYPE");
		String EMAIL = req.getParameter("EMAIL");
		if(MACHINE == null || TYPE == null || EMAIL == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			if(Integer.valueOf(TYPE) == 1 || Integer.valueOf(TYPE) == 2){
				// CREAMOS EL OBJETO DE INGRESO
				JSONObject Q_USER = new JSONObject();
				Q_USER.put("ID_MACHINE", MACHINE);
				Q_USER.put("TYPE", TYPE);
				Q_USER.put("EMAIL", EMAIL);
				// CREACION DEL USUARIO
				Model<ModelUserMobile> IN_USER = new Model<ModelUserMobile>(ModelUserMobile.class);
				try {
					if(IN_USER.insert(Q_USER.toString())){
						retorno.put("STATUS", "OK");
						return retorno;
					}
					else
					{
						retorno.put("STATUS", "ERROR");
						retorno.put("ERROR", "EXISTE UN ERROR AL CREAR UN USUARIO EN LA DB");
						return retorno;
					}
				} catch (Error403Exception e) {
					// TODO Auto-generated catch block
					System.out.println("Error al crear el usuario en la db");
					System.out.println("Error: "+e.getMessage());
				} catch (IOException e) {
					// TODO Auto-generated catch block
					System.out.println("Error al crear el usuario en la db");
					System.out.println("Error: "+e.getMessage());
				}
			}
			else
			{
				retorno.put("STATUS", "ERROR");
				retorno.put("ERROR", "EL PARAMETRO TYPE NO RECIBIO UN VALOR CORRECTO");
				return retorno;
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject GETUSER(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String MACHINE = req.getParameter("ID_MACHINE");
		if(MACHINE == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			JSONObject Q_USER = new JSONObject();
			Q_USER.put("ID_MACHINE", MACHINE);
			Model<ModelUserMobile> GET_USER = new Model<ModelUserMobile>(ModelUserMobile.class);
			try {
				ModelResult<ModelUserMobile> R_USER = GET_USER.find(Q_USER.toString());
				if(R_USER.size() > 0){
					retorno.put("STATUS", "OK");
					retorno.put("USER", R_USER.toJSON().getJSONObject(0));
					return retorno;
				}
				else{
					retorno.put("STATUS", "NOTFOUND");
					return retorno;
				}
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener el usuario en la db");
				System.out.println("Error: "+e.getMessage());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener el usuario en la db");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject SETVALUE(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String USER = req.getParameter("USER");
		String CODIGO = req.getParameter("CODIGO");
		String VALUE = req.getParameter("VALUE");
		//VERIFICAMOS LOS PARAMETROS
		if(USER == null || CODIGO == null || VALUE == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			if(Integer.valueOf(VALUE) < 0 || Integer.valueOf(VALUE) > 5){
				retorno.put("STATUS", "ERROR");
				retorno.put("ERROR", "EL PARAMETRO VALUE DEBE SER MAYOR O IGUAL A CERO Y MENOR O IGUAL QUE 5.");
				return retorno;
			}
			else
			{
				Model<ModelValueMobile> VALUE_MOBILE = new Model<ModelValueMobile>(ModelValueMobile.class);
				// VERIFICAMOS VALUE MOBILE EXISTENTE
				JSONObject Q_USER = new JSONObject();
				Q_USER.put("USER_X_USER", USER);
				Q_USER.put("PROY_X_PROY", CODIGO);
				try {
					if(VALUE_MOBILE.find(Q_USER.toString()).size() == 0){
						Q_USER.put("VALUE", VALUE);
						if(VALUE_MOBILE.insert(Q_USER.toString())){
							JSONObject OBRA_USER = new JSONObject();
							OBRA_USER.put("PROY_X_PROY", CODIGO);
							OBRA_USER.put("USER_X_USER", USER);
							Model<ModelMobileInteractuar> UPDATE_OBRA = new Model<ModelMobileInteractuar>(ModelMobileInteractuar.class);
							JSONObject Q_VALUE = new JSONObject();
							Q_VALUE.put("ID_VALOR", 1);
							if(UPDATE_OBRA.find(OBRA_USER.toString()).size()==0)
							{
								OBRA_USER.put("ID_VALOR", 1);
								OBRA_USER.put("ID_COMPARTIR", 0);
								OBRA_USER.put("ID_ALERTA",0);
								UPDATE_OBRA.insert(OBRA_USER.toString());
							}
							else UPDATE_OBRA.update(Q_VALUE.toString(),OBRA_USER.toString());
							retorno.put("STATUS", "OK");
							return retorno;
						}
						else
						{
							retorno.put("STATUS", "ERROR");
							retorno.put("ERROR", "EXISTE UN ERROR AL INTENTAR INGRESAR LA VALORACIÓN EN LA BASE DE DATOS.");
							return retorno;
						}
					}
					else
					{
						JSONObject Q_VALUE = new JSONObject();
						Q_VALUE.put("VALUE", VALUE);
						if(VALUE_MOBILE.update(Q_VALUE.toString(), Q_USER.toString())){
							JSONObject OBRA_USER = new JSONObject();
							Model<ModelMobileInteractuar> UPDATE_OBRA = new Model<ModelMobileInteractuar>(ModelMobileInteractuar.class);
							JSONObject Q_VALUE2 = new JSONObject();
							Q_VALUE2.put("ID_VALOR", 1);
							OBRA_USER.put("PROY_X_PROY", CODIGO);
							OBRA_USER.put("USER_X_USER", USER);
							if(UPDATE_OBRA.find(OBRA_USER.toString()).size()==0)
							{
								OBRA_USER.put("ID_VALOR", 1);
								OBRA_USER.put("ID_COMPARTIR", 0);
								OBRA_USER.put("ID_ALERTA",0);
								UPDATE_OBRA.insert(OBRA_USER.toString());
							}
							else UPDATE_OBRA.update(Q_VALUE2.toString(),OBRA_USER.toString());
							retorno.put("STATUS", "OK");
							return retorno;
						}
						else
						{
							retorno.put("STATUS", "ERROR");
							retorno.put("ERROR", "EXISTE UN ERROR AL INTENTAR ACTUALIZAR LA VALORACIÓN EN LA BASE DE DATOS.");
							return retorno;
						}
					}
				} catch (Error403Exception e) {
					// TODO Auto-generated catch block
					System.out.println("Error al obtener ingresa una valoración en la base de datos");
					System.out.println("Error: "+e.getMessage());
				} catch (IOException e) {
					// TODO Auto-generated catch block
					System.out.println("Error al obtener ingresa una valoración en la base de datos");
					System.out.println("Error: "+e.getMessage());
				}
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject SENDPHOTO(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String USER = req.getParameter("USER");
		String IMG = req.getParameter("IMAGE");
		String CODIGO = req.getParameter("CODIGO");
		//VERIFICAMOS LOS PARAMETROS
		if(USER == null || IMG == null || CODIGO == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			try {
				Model<ModelUserMobile> USER_MOBILE = new Model<ModelUserMobile>(ModelUserMobile.class);
				Model<ModelFichaMobile> OBRA_MOBILE = new Model<ModelFichaMobile>(ModelFichaMobile.class);
				JSONObject Q_USER = new JSONObject();
				Q_USER.put("X_USER", USER);
				JSONObject Q_OBRA_MOBILE = new JSONObject();
				Q_OBRA_MOBILE.put("CODIGO", CODIGO);
				if(USER_MOBILE.find(Q_USER.toString()).size() > 0){
					if(OBRA_MOBILE.find(Q_OBRA_MOBILE.toString()).size() > 0){
						Model<ModelImageMobile> IMAGE_MOBILE = new Model<ModelImageMobile>(ModelImageMobile.class);
						// INGRESAMOS LA IMAGEN ASOCIADA AL USUARIO Y EL CODIGO DE OBRA
						JSONObject Q_IMAGE = new JSONObject();
						Q_IMAGE.put("USER_X_USER", USER);
						Q_IMAGE.put("PROY_X_PROY", CODIGO);
						Q_IMAGE.put("IMAGE", IMG);
					
						if(IMAGE_MOBILE.insert(Q_IMAGE.toString())){
							retorno.put("STATUS", "OK");
							return retorno;
						}
						else
						{
							retorno.put("STATUS", "ERROR");
							retorno.put("ERROR", "EXISTE UN ERROR AL INTENTAR INGRESAR LA IMAGEN A LA BASE DE DATOS.");
							return retorno;
						}
					}
					else{
						retorno.put("STATUS", "ERROR");
						retorno.put("ERROR", "LA OBRA INDICADA NO EXISTE.");
						return retorno;
					}
				}
				else{
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EL USUARIO PROPORCIONADO NO EXISTE.");
					return retorno;
				}
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ingresar la imagen de ficha en la base de datos");
				System.out.println("Error: "+e.getMessage());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ingresar la imagen de ficha en la base de datos");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject GETPHOTO(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String CODIGO = req.getParameter("CODIGO");
		//VERIFICAMOS LOS PARAMETROS
		if(CODIGO == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			Model<ModelImageMobile> IMAGE_MOBILE = new Model<ModelImageMobile>(ModelImageMobile.class);
			// INGRESAMOS LA IMAGEN ASOCIADA AL USUARIO Y EL CODIGO DE OBRA
			JSONObject Q_IMAGE = new JSONObject();
			Q_IMAGE.put("PROY_X_PROY", CODIGO);
			try {
				ModelResult<ModelImageMobile> IMAGE_RETURN = IMAGE_MOBILE.find(Q_IMAGE.toString());
				if(IMAGE_RETURN.size() > 0){
					retorno.put("STATUS", "OK");
					retorno.put("SIZE", IMAGE_RETURN.size());
					retorno.put("IMAGES", IMAGE_RETURN.toJSON());
					return retorno;
				}
				else
				{
					retorno.put("STATUS", "OK");
					retorno.put("SIZE", IMAGE_RETURN.size());
					return retorno;
				}
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener las imagenes de la base de datos");
				System.out.println("Error: "+e.getMessage());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener las imagenes de la base de datos");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	//METODO PUBLICO QUE DEVUELVE LA VALORACION DE UNA OBRA EN PARTICULAR
	public static JSONObject GETVALUE(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String USER = req.getParameter("USER");
		String CODIGO = req.getParameter("CODIGO");
		//VERIFICAMOS LOS PARAMETROS
		if(USER == null || CODIGO == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			try {
				OracleConnector ora = new OracleConnector();
				ora.connect();
				OraclePreparedStatement sta = ora.prepare("SELECT V.PROY_X_PROY, V.VALUEPROM, NVL(VP.VALUE,-1) AS VALUE FROM (SELECT AVG(V.VALUE) AS VALUEPROM, V.PROY_X_PROY FROM GEO_MOBILE_VALUE V WHERE V.PROY_X_PROY = ? GROUP BY V.PROY_X_PROY) V LEFT OUTER JOIN (SELECT V.PROY_X_PROY, V.VALUE AS VALUE FROM GEO_MOBILE_VALUE V WHERE V.USER_X_USER = ? AND V.PROY_X_PROY = ?) VP ON V.PROY_X_PROY = VP.PROY_X_PROY");
				// VERIFICAMOS VALUE MOBILE EXISTENTE
				sta.setInt(1, Integer.valueOf(CODIGO));
				sta.setInt(2, Integer.valueOf(USER));
				sta.setInt(3, Integer.valueOf(CODIGO));
				// DEFINIMOS EL VALOR PROMEDIO Y ESPECIFICO SEGUN EL USUARIO
				Model<ModelValueMobileObra> consulta = new Model<ModelValueMobileObra>(ModelValueMobileObra.class);
				ModelResult<ModelValueMobileObra> resultado = consulta.specialQuery(sta, ora);
				if(resultado.size() > 0){
					JSONObject obj = resultado.toJSON().getJSONObject(0);
					retorno.put("STATUS", "OK");
					retorno.put("VALUE", obj.getDouble("VALUE"));
					retorno.put("VALUEPROM", obj.getDouble("VALUEPROM"));
					retorno.put("CODIGO", obj.getInt("PROY_X_PROY"));
					return retorno;
				}
				else
				{
					retorno.put("STATUS", "OK");
					retorno.put("VALUE", -1);
					retorno.put("VALUEPROM", -1);
					retorno.put("CODIGO", CODIGO);
					return retorno;
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener la valoracion desde la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener la valoracion desde la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener la valoracion desde la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener la valoracion desde la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener la valoracion desde la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener la valoracion desde la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (NoSuchFieldException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al obtener la valoracion desde la base de datos.");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	//METODO PUBLICO QUE DEVUELVE LA VALORACION DE UNA OBRA EN PARTICULAR
	public static JSONObject SETOBRA(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String USER = req.getParameter("USER");
		String LAT = req.getParameter("LAT");
		String LONG = req.getParameter("LONG");
		String IMAGE = req.getParameter("IMAGE");
		String TITULO = req.getParameter("TITULO");
		String DESCRIPCION = req.getParameter("DESCRIPCION");
		//VERIFICAMOS LOS PARAMETROS
		if(USER == null || LAT == null || LONG == null || IMAGE == null || TITULO == null || DESCRIPCION == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			try {
				// VERIFICAMOS QUE EL USUARIO EXISTA
				JSONObject Q_USER = new JSONObject();
				Q_USER.put("X_USER",USER);
				Model<ModelUserMobile> V_USER = new Model<ModelUserMobile>(ModelUserMobile.class);
				if(V_USER.find(Q_USER.toString()).size() == 0){
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EL USUARIO NO EXISTE");
					return retorno;
				}
				//ABRIMOS LA CONSULTA
				OracleConnector ora = new OracleConnector();
				ora.connect();
				OraclePreparedStatement sta = ora.prepare("INSERT INTO GEO_MOBILE_NEW_OBRA (IMAGE,USER_X_USER,SPATIAL_OBJECT, TITULO, DESCRIPCION) VALUES (?,?,?,?,?)");
				// VERIFICAMOS VALUE MOBILE EXISTENTE
				sta.setString(1, IMAGE);
				sta.setInt(2, Integer.valueOf(USER));
				List<Coordinate> lista = new ArrayList<Coordinate>();
				lista.add(new Coordinate(Double.valueOf(LAT),Double.valueOf(LONG)));
				Spatial ingreso = new PointType(lista);
				sta.setObject(3, ingreso.toObject(ora));
				sta.setString(4, TITULO);
				sta.setString(5, DESCRIPCION);
				// DEFINIMOS EL VALOR PROMEDIO Y ESPECIFICO SEGUN EL USUARIO
				if(ora.update())
				{
					ora.commit();
					ora.closeOP();
					retorno.put("STATUS", "OK");
					return retorno;
				}
				else
				{
					ora.closeOP();
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EXISTE UN ERROR AL INGRESAR EL REGISTRO A LA BASE DE DATOS, INTENTE OTRA VEZ");
					return retorno;
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ingresa una obra a la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ingresa una obra a la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ingresa una obra a la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ingresa una obra a la base de datos.");
				System.out.println("Error: "+e.getMessage());
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				// TODO Auto-generated catch block
				System.out.println("Error al ingresa una obra a la base de datos.");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject SETDENUNCIA(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String CODIGO = req.getParameter("CODIGO");
		String IMAGEN = req.getParameter("IMAGEN");
		String TYPE = req.getParameter("TYPE");
		String USER = req.getParameter("USER");
		String COMMENT = req.getParameter("COMMENT");
		if(CODIGO == null || IMAGEN == null || TYPE == null || USER == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			// VERIFICAMOS QUE EL USUARIO EXISTA Y EL PROYECTO SEA REAL
			JSONObject Q_USER = new JSONObject();
			Q_USER.put("X_USER",USER);
			JSONObject Q_PROY = new JSONObject();
			Q_PROY.put("CODIGO", CODIGO);
			//CREAMOS LOS OBJETOS A ANALIZAR MODELOS
			Model<ModelUserMobile> V_USER = new Model<ModelUserMobile>(ModelUserMobile.class);
			Model<ModelFichaMobile> V_PROY = new Model<ModelFichaMobile>(ModelFichaMobile.class);
			try {
				if(V_USER.find(Q_USER.toString()).size() == 0){
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EL USUARIO NO EXISTE");
					return retorno;
				}
				if(V_PROY.find(Q_PROY.toString()).size() == 0){
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EL PROYECTO NO EXISTE");
					return retorno;
				}
				// CREAMOS EL OBJETO DE INGRESO
				JSONObject denuncia = new JSONObject();
				denuncia.put("PROY_X_PROY", CODIGO);
				denuncia.put("IMAGE", IMAGEN);
				denuncia.put("TDENUNCIA_X_TDENUNCIA", TYPE);
				denuncia.put("USER_X_USER", USER);
				if(COMMENT !=null )denuncia.put("COMMENT", COMMENT);
				// INGRESAMOS EL OBJETO
				Model<ModelDenunciaMobile> IN_DENUNCIA = new Model<ModelDenunciaMobile>(ModelDenunciaMobile.class);
				if(IN_DENUNCIA.insert(denuncia.toString())){
					JSONObject OBRA_USER = new JSONObject();
					Model<ModelMobileInteractuar> UPDATE_OBRA = new Model<ModelMobileInteractuar>(ModelMobileInteractuar.class);
					JSONObject Q_VALUE = new JSONObject();
					Q_VALUE.put("ID_VALOR", 1);
					OBRA_USER.put("PROY_X_PROY", CODIGO);
					OBRA_USER.put("USER_X_USER", USER);
					if(UPDATE_OBRA.find(OBRA_USER.toString()).size()==0)
					{
						OBRA_USER.put("ID_VALOR", 1);
						OBRA_USER.put("ID_COMPARTIR", 0);
						OBRA_USER.put("ID_ALERTA",0);
						UPDATE_OBRA.insert(OBRA_USER.toString());
					}
					else UPDATE_OBRA.update(Q_VALUE.toString(),OBRA_USER.toString());
					retorno.put("STATUS", "OK");
					return retorno;
				}
				else
				{
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EXISTE UN ERROR AL INGRESAR LA DENUNCIA EN LA BASE DE DATOS");
					return retorno;
				}
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject GETLOCATION(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String CODIGO = req.getParameter("CODIGO");
		String USER = req.getParameter("USER");
		if(CODIGO == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			Model<ModelFichaMobile> model = new Model<ModelFichaMobile>(ModelFichaMobile.class); 
			JSONObject query = new JSONObject();
			query.put("CODIGO", CODIGO);
			try {
				if(USER != null){
					OracleConnector ora = new OracleConnector();
					ora.connect();
					OraclePreparedStatement sta = ora.prepare("SELECT V.PROY_X_PROY, V.VALUEPROM, NVL(VP.VALUE,-1) AS VALUE FROM (SELECT AVG(V.VALUE) AS VALUEPROM, V.PROY_X_PROY FROM GEO_MOBILE_VALUE V WHERE V.PROY_X_PROY = ? GROUP BY V.PROY_X_PROY) V LEFT OUTER JOIN (SELECT V.PROY_X_PROY, V.VALUE AS VALUE FROM GEO_MOBILE_VALUE V WHERE V.USER_X_USER = ? AND V.PROY_X_PROY = ?) VP ON V.PROY_X_PROY = VP.PROY_X_PROY");
					sta.setInt(1, Integer.valueOf(CODIGO));
					sta.setInt(2, Integer.valueOf(USER));
					sta.setInt(3, Integer.valueOf(CODIGO));
					Model<ModelValueMobileObra> consulta = new Model<ModelValueMobileObra>(ModelValueMobileObra.class);
					ModelResult<ModelValueMobileObra> resultado = consulta.specialQuery(sta, ora);
					JSONObject resvalue;
					if(resultado.size() > 0){
						resvalue = resultado.toJSON().getJSONObject(0);
						resvalue.remove("PROY_X_PROY");
					}
					else
					{
						resvalue = new JSONObject();
						resvalue.put("VALUEPROM", -1);
						resvalue.put("VALUE", -1);
					}
					retorno.put("VALUE", resvalue);
				}
				// DEFINIMOS EL VALOR PROMEDIO Y ESPECIFICO SEGUN EL USUARIO
				ModelResult<ModelFichaMobile> result = model.findOne(query.toString());
				if(result.size() > 0){
					JSONObject ficha = result.toJSON().getJSONObject(0);
					double fin = ficha.getDouble("AVANCE_FINANCIERO")/ficha.getDouble("MONTO_CONTRATADO")*100;
					ficha.put("AVANCE_FINANCIERO", fin);
					retorno.put("STATUS", "OK");
					retorno.put("FICHA", ficha);
					
					return retorno;
				}
				else
				{
					retorno.put("STATUS", "NOTRESULT");
					return retorno;
				}
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (NoSuchFieldException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject SETELIMINAR(HttpServletRequest req, HttpServletResponse res) throws SQLException, IllegalArgumentException, SecurityException, InstantiationException, IllegalAccessException, NoSuchFieldException, Error403Exception, JSONException, IOException{
		JSONObject retorno = new JSONObject();
		//VERIFICAMOS LOS PARAMETROS
		String USER = req.getParameter("USER");
		String CODIGO = req.getParameter("CODIGO");

		//VERIFICAMOS LOS PARAMETROS
		if(USER == null || CODIGO == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			Model<ModelMobileInteractuar> DELETE_OBRA_MOBILE = new Model<ModelMobileInteractuar>(ModelMobileInteractuar.class);
			
			JSONObject Q_USER = new JSONObject();
			Q_USER.put("USER_X_USER", USER);
			Q_USER.put("PROY_X_PROY", CODIGO);
			try {
	
				if(DELETE_OBRA_MOBILE.delete(Q_USER.toString())){
					retorno.put("STATUS", "OK");
					return retorno;
				}
				else
				{
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EXISTE UN ERROR AL ELIMINAR LA OBRA DE LISTA DE SEGUIMIENTO");
					return retorno;
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error eliminar la obra de la lista de seguimiento");
				System.out.println("Error: "+e.getMessage());
			}

		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
	public static JSONObject SETVISUALIZAROBRA(HttpServletRequest req, HttpServletResponse res){
		JSONObject retorno = new JSONObject();
		SimpleDateFormat f_creacion = new SimpleDateFormat("dd/MM/yyyy");
		//VERIFICAMOS LOS PARAMETROS
		String USER = req.getParameter("USER");
		String CODIGO = req.getParameter("CODIGO");
	//	String COMMENT = req.getParameter("COMMENT");
		if(CODIGO == null  || USER == null){
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "LA FUNCION NO RECIBIO TODOS LOS PARAMETROS REQUERIDOS.");
			return retorno;
		}
		else
		{
			// VERIFICAMOS QUE EL USUARIO EXISTA Y EL PROYECTO SEA REAL
			JSONObject Q_USER = new JSONObject();
			Q_USER.put("X_USER",USER);
			JSONObject Q_PROY = new JSONObject();
			Q_PROY.put("CODIGO", CODIGO);
			//CREAMOS LOS OBJETOS A ANALIZAR MODELOS
			Model<ModelUserMobile> V_USER = new Model<ModelUserMobile>(ModelUserMobile.class);
	
			try {
				if(V_USER.find(Q_USER.toString()).size() == 0){
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EL USUARIO NO EXISTE");
					return retorno;
				}
	
				// CREAMOS EL OBJETO DE INGRESO
				JSONObject VISUALIZADA_OBRA = new JSONObject();
				VISUALIZADA_OBRA.put("PROY_X_PROY", CODIGO);
				VISUALIZADA_OBRA.put("USER_X_USER", USER);
	
				// INGRESAMOS EL OBJETO
				Model<ModelMobileInteractuar> OBRA_VISUALIZAR = new Model<ModelMobileInteractuar>(ModelMobileInteractuar.class);
				JSONObject Q_VALUE = new JSONObject();
				Q_VALUE.put("X_VISUALIZADA", 1);
				if(OBRA_VISUALIZAR.update(Q_VALUE.toString(),VISUALIZADA_OBRA.toString())){
					retorno.put("STATUS", "OK");
					return retorno;
				}
				else
				{
					retorno.put("STATUS", "ERROR");
					retorno.put("ERROR", "EXISTE UN ERROR AL REGISTRAR EN LA BASE DE DATOS LA OBRA COMPARTIDA");
					return retorno;
				}
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("Error al ejecutar consulta SQL");
				System.out.println("Error: "+e.getMessage());
			}
		}
		retorno.put("STATUS", "ERROR");
		retorno.put("ERROR", "NOT INFO");
		return retorno;
	}
}
