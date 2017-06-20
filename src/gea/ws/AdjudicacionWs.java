package gea.ws;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import gea.annotation.ModelField;
import gea.framework.Cache;
import gea.framework.Model;
import gea.framework.ModelResult;
import gea.mercadopublico.MercadoPublico;
import gea.model.ModelAdjudicacionContrato;
import gea.model.ModelAuth;
import gea.model.ModelChileTrans;
import gea.model.ModelComunalComp;
import gea.model.ModelContratista;
import gea.model.ModelContratistaCreate;
import gea.model.ModelIdsMercadoUnico;
import gea.model.ModelProyectos;
import gea.model.ModelSpatial;
import gea.model.ModelTomaRazon;
import gea.model.ModelUbicacionProyecto;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.ErrorCodeException;
import gea.utils.Exception.ErrorDBDataErrorException;
import gea.utils.Exception.ErrorDBDataNotExistsException;
import gea.utils.trewautils.Mapeo;

public class AdjudicacionWs {
	public static JSONObject Adjudicacion(HttpServletRequest req, HttpServletResponse res) throws IOException{
		JSONObject retorno = new JSONObject();
		String ORDERS = null;
		String DATE_TRANS = null;
		Calendar calendar = Calendar.getInstance();
		java.util.Date now = calendar.getTime();
		java.sql.Timestamp currentTimestamp = new java.sql.Timestamp(now.getTime());

		if(req.getParameter("ORDERS") == null){
			ORDERS = (String) req.getAttribute("ORDERS");
		}
		else
		{
			ORDERS = req.getParameter("ORDERS");
		}
		if(req.getParameter("DATE_TRANS") == null){
			DATE_TRANS = (String) req.getAttribute("DATE_TRANS");
		}
		else{
			DATE_TRANS = req.getParameter("DATE_TRANS");
		}
		if(ORDERS != null && DATE_TRANS != null){
			try {
				DateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.ENGLISH);
				JSONArray orders = new JSONArray(ORDERS);
				Date date = format.parse(DATE_TRANS);
				int status = 1;
				JSONArray ordes_back = new JSONArray();
				JSONArray impact = new JSONArray();
				// CREAMOS LOS OBJECTOS DE VERIFICACION DE LLAVE Y DE INGRESO DE LOS REGISTROS TRANSACCIONALES
				Model<ModelAuth> KEY = new Model<ModelAuth>(ModelAuth.class);
				Model<ModelChileTrans> TRANS = new Model<ModelChileTrans>(ModelChileTrans.class);
				for(int i=0; i<orders.length(); i++){
					JSONObject mercado;
					try { 
						//TRANSFERIMOS A ORDERS SI EXISTE
						if(orders.getJSONObject(i).has("ORDER"))
						{
							orders.getJSONObject(i).put("ORDERS",orders.getJSONObject(i).getString("ORDER"));
							orders.getJSONObject(i).put("DATE_TRANS",format.format(date));
						}
						//PROCESAMOS EL RESTO DE LOS CAMPOS
						if(orders.getJSONObject(i).has("ORDER") && orders.getJSONObject(i).has("KEY") && orders.getJSONObject(i).has("DATE_ANSWER") && orders.getJSONObject(i).has("DATE_REGISTER") && orders.getJSONObject(i).has("STATUS")){
							// VERIFICAMOS QUE EXISTA LA LLAVE Y GENERAMOS LA TRANSACCION TEMPORAL
							JSONObject KeyQuery = new JSONObject();
							KeyQuery.put("KEY",orders.getJSONObject(i).getString("KEY"));
							KeyQuery.put("ID",orders.getJSONObject(i).getString("ORDER"));
							if(KEY.find(KeyQuery.toString()).size() > 0){
								mercado = getMercadoPublico(orders.getJSONObject(i).getString("ORDER"));
								//EN ESTE SEGMENTO VA LA OPERACION DE ADJUDICACION
								JSONArray lineas = mercado.getJSONArray("ITEMS");
								for(int l=0; l<lineas.length(); l++){
									try
									{
										if(lineas.getJSONObject(l).has("LINEA") && lineas.getJSONObject(l).has("MONTO") && lineas.getJSONObject(l).has("IDPROVEEDOR")){
											//CARGAMOS LOS MODELOS DE DATOS A UTILIZAR
											Model<ModelTomaRazon> TOMARAZON = new Model<ModelTomaRazon>(ModelTomaRazon.class);
											Model<ModelAdjudicacionContrato> ADJUDICACION = new Model<ModelAdjudicacionContrato>(ModelAdjudicacionContrato.class);
											Model<ModelIdsMercadoUnico> IDMERCADO = new Model<ModelIdsMercadoUnico>(ModelIdsMercadoUnico.class);
											Model<ModelProyectos> PROYECTO = new Model<ModelProyectos>(ModelProyectos.class);
											// BUSCAMOS LA LINEA Y LA LICITACION EN LA TABLA DE CODIGOS MERCADO PUBLICO SU ID
											JSONObject query = new JSONObject();
											query.put("C_ID_MERC_UNICO", orders.getJSONObject(i).getString("ORDER"));
											query.put("LINEA", lineas.getJSONObject(l).getInt("LINEA"));
											//OBTENEMOS EL X_PROY
											
											ModelResult<ModelIdsMercadoUnico> qResult = IDMERCADO.find(query.toString());
											if(qResult.size() > 0){
												for(int k=0; k< qResult.size(); k++){
													//SI EXISTE EN IF MERCADO UNICO POR LOGICA EXISTE EN PROYECTO
													int X_PROY = qResult.toJSON().getJSONObject(k).getInt("PROY_X_PROY");
													query = new JSONObject();
													query.put("X_PROY", X_PROY);
													ModelResult<ModelProyectos> PROY = PROYECTO.find(query.toString());
													if(PROY.size() > 0){
														query = new JSONObject();
														query.put("PROY_X_PROY", X_PROY);
														JSONObject TRUPDATE = new JSONObject();
														JSONObject ADJUDUPDATE = new JSONObject();
														DateFormat formato = new SimpleDateFormat("dd/MM/yyyy", Locale.ENGLISH);
														//GENERAMOS LOS RESPALDOS CORRESPONDIENTES
														JSONObject RESP_TOMARAZON = TOMARAZON.find(query.toString()).toJSON().getJSONObject(0);
														JSONObject RESP_ADJUDICACION = ADJUDICACION.find(query.toString()).toJSON().getJSONObject(0);
														//CARGAMOS LOS CAMPOS A MODIFICAR EN LA TOMA DE RAZON
														TRUPDATE.put("TDTR_X_TDTR", mercado.getInt("TIPOTOMARAZON"));
														TRUPDATE.put("F_DOCUMENTO", mercado.getString("FECHADOCUMENTO"));
														TRUPDATE.put("C_NUMERO_DOCUMENTO", mercado.getString("FOLIO"));
														TRUPDATE.put("N_ANHO_DOCUMENTO", mercado.getInt("ANIODOCUMENTO"));
														TRUPDATE.put("F_PROC_TOMA_RAZON", formato.format(new Date()).toString());
														//CARGAMOS LOS CAMPOS A MODIFICAR EN LA ADJUDICACION DEL CONTRATO DE OBRAS PUBLICAS
														ADJUDUPDATE.put("CONT_X_CONT",lineas.getJSONObject(l).getInt("IDPROVEEDOR"));
														ADJUDUPDATE.put("N_PLAZO_EJECUCION",mercado.getInt("DURACIONCONTRATO"));
														ADJUDUPDATE.put("MONTO_ADJUDICADO_CLP",lineas.getJSONObject(l).getLong("MONTO"));
														if( mercado.getInt("MONEDA") == 1)
															ADJUDUPDATE.put("N_MONTO_CONTRATADO",lineas.getJSONObject(l).getLong("MONTO"));
														if(mercado.getInt("TIPOTOMARAZON")==73 && lineas.getJSONObject(l).getInt("IDPROVEEDOR") == 6730){
															ADJUDUPDATE.put("C_OPE_BORRADOR","S");
														}
														else if(lineas.getJSONObject(l).getInt("IDPROVEEDOR") == 6730){
															ADJUDUPDATE.put("C_OPE_BORRADOR","S");
														}
														else {
															ADJUDUPDATE.put("C_OPE_BORRADOR","N");
															ADJUDUPDATE.put("F_MODIFICA", formato.format(currentTimestamp).toString());
														}
														//PROCEDEMOS CON LA OPERACION
														if(TOMARAZON.update(TRUPDATE.toString(), query.toString())){
															if(ADJUDICACION.update(ADJUDUPDATE.toString(), query.toString())){
																JSONObject Rorder = new JSONObject();
																Rorder.put("ORDER", orders.getJSONObject(i).getString("ORDER"));
																Rorder.put("STATUS", "OK");
																ordes_back.put(Rorder);
																
															}
															else
															{
																TOMARAZON.update(RESP_TOMARAZON.toString(), query.toString());
																throw new Error403Exception("ERROR IN THE UPDATE OF 'ADJUDICACION', VERIFY THE SQL STATEMENT. ROLLBACK APPLY " + orders.getJSONObject(i).getString("ORDER"));
															}
														}
														else
														{
															throw new Error403Exception("ERROR IN THE UPDATE OF 'TOMA DE RAZON', VERIFY THE SQL STATEMENT. ROLLBACK APPLY" + orders.getJSONObject(i).getString("ORDER"));
														}
													}
													else
													{
														throw new Error403Exception("THE RESOURCE HAVE A INCONSISTENCY, NO DATA EXISTS IN THE TABLE PROYECTO. TRY AGAIN" + orders.getJSONObject(i).getString("ORDER"));
													}
												}
											}
											else
											{
												throw new Error403Exception("THE PROJECT NOT EXISTS IN THE DATABASE. TRY AGAIN" + orders.getJSONObject(i).getString("ORDER"));
											}
										}
										else
										{
											throw new JSONException("NOT EXISTS MINIMUN PARAMETERS LINEA, MONTO AND IDPROVEEDOR IN THE LINE OBJECT" + orders.getJSONObject(i).getString("ORDER"));
										}
									}
									catch(JSONException e){
										// ERROR POR MAL FORMATO DE DATOS JSON EN LINEA ESPECIFICA DE LA ADJUDICACION
										status = 2;
										JSONObject Rorder = new JSONObject();
										Rorder.put("ORDER", orders.getJSONObject(i).getString("ORDER"));
										Rorder.put("STATUS", "DATA ERROR");
										impact.put("ERROR EN JSON DATA READ IN LINE "+lineas.getJSONObject(l).getInt("LINEA")+" OF ORDER "+orders.getJSONObject(i).getString("ORDER")+". ERROR: "+e.getMessage());
										ordes_back.put(Rorder);
									}
									catch(Error403Exception e){
										// ERROR POR MAL FORMATO DE DATOS JSON EN LINEA ESPECIFICA DE LA ADJUDICACION
										status = 2;
										JSONObject Rorder = new JSONObject();
										Rorder.put("ORDER", orders.getJSONObject(i).getString("ORDER"));
										Rorder.put("STATUS", "DATA ERROR");
										impact.put("ERROR IN LINE "+lineas.getJSONObject(l).getInt("LINEA")+" OF ORDER "+orders.getJSONObject(i).getString("ORDER")+". ERROR: "+e.getMessage());
										ordes_back.put(Rorder);
									}
								}
							}
							else
							{
								// ERROR POR LLAVE INCORRECTA
								status = 2;
								JSONObject Rorder = new JSONObject();
								Rorder.put("ORDER", orders.getJSONObject(i).getString("ORDER"));
								Rorder.put("STATUS", "KEY INVALID");
								impact.put("KEY NOT FOUND IN DATABASE. ORDER "+orders.getJSONObject(i).getString("ORDER"));
								ordes_back.put(Rorder);
								orders.getJSONObject(i).put("SERVICE_STATUS", "KEY INVALID");
							}
						}
						else{
							throw new Error403Exception("THE FORMAT OF ORDER OBJECT IS INVALID");
						}
					} catch (JSONException e) {
						status = 2;
						JSONObject Rorder = new JSONObject();
						Rorder.put("ORDER", orders.getJSONObject(i).getString("ORDER"));
						Rorder.put("STATUS", "DATA ERROR");
						impact.put("ERROR EN LICITACION "+orders.getJSONObject(i).getString("ORDER")+" EN FORMATO O INTERPRETACION DE DATOS"+". ERROR: "+e.getMessage());
						ordes_back.put(Rorder);
						orders.getJSONObject(i).put("SERVICE_STATUS", "DATA ERROR."+e.getMessage());
					} catch (Error403Exception e) {
						status = 2;
						JSONObject Rorder = new JSONObject();
						Rorder.put("ORDER", orders.getJSONObject(i).getString("ORDER"));
						Rorder.put("STATUS", "DATA ERROR");
						impact.put("ERROR EN LICITACION "+orders.getJSONObject(i).getString("ORDER")+" EN FORMATO O INTERPRETACION DE DATOS"+". ERROR: "+e.getMessage());
						ordes_back.put(Rorder);
						orders.getJSONObject(i).put("SERVICE_STATUS", "DATA ERROR."+e.getMessage());
					} catch (IllegalAccessException e) {
						status = 2;
						JSONObject Rorder = new JSONObject();
						Rorder.put("ORDER", orders.getJSONObject(i).getString("ORDER"));
						Rorder.put("STATUS", "DATA ERROR");
						impact.put("ERROR EN LICITACION "+orders.getJSONObject(i).getString("ORDER")+" EN FORMATO O INTERPRETACION DE DATOS"+". ERROR: "+e.getMessage());
						ordes_back.put(Rorder);
						orders.getJSONObject(i).put("SERVICE_STATUS", "DATA ERROR."+e.getMessage());
					} catch (ErrorDBDataNotExistsException e) {
						status = 2;
						JSONObject Rorder = new JSONObject();
						Rorder.put("ORDER", orders.getJSONObject(i).getString("ORDER"));
						Rorder.put("STATUS", "DATA ERROR");
						impact.put("ERROR EN LICITACION "+orders.getJSONObject(i).getString("ORDER")+" EN MAPEO DE DATOS"+". ERROR: "+e.getMessage());
						ordes_back.put(Rorder);
						orders.getJSONObject(i).put("SERVICE_STATUS", "DATA ERROR."+e.getMessage());
					} catch (ErrorDBDataErrorException e) {
						status = 2;
						JSONObject Rorder = new JSONObject();
						Rorder.put("ORDER", orders.getJSONObject(i).getString("ORDER"));
						Rorder.put("STATUS", "DATA ERROR");
						impact.put("ERROR EN LICITACION "+orders.getJSONObject(i).getString("ORDER")+" EN BUSQUEDA EN DB"+". ERROR: "+e.getMessage());
						ordes_back.put(Rorder);
						orders.getJSONObject(i).put("SERVICE_STATUS", "DATA ERROR."+e.getMessage());
					}
					//INSERTAMOS EL REGISTRO TEMPORAL
					TRANS.insert(orders.getJSONObject(i).toString());
				}
				//RETORNAMOS LA RESPUESTA
				if(status == 1){
					Cache cache = Cache.getInstance();
					cache.Clean();
					return response(ordes_back,"NOERROR","OK");
				}
				else if(status == 2){
					boolean revs = false;
					for(int h=0;h<ordes_back.length();h++){
						if(ordes_back.getJSONObject(h).getString("STATUS").equals("OK")){
							revs = true;
						}
					}
					if(revs){
						return response(ordes_back,impact,"IMPACT");
					}
					else
					{
						return response(ordes_back,impact,"FAIL");
					}
				}
				else if(status == 3){
					return response(ordes_back,impact,"FAIL");
				}
			} catch (ParseException e) {
				return fatalError("ERROR DATA FORMAT");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				return fatalError("FATAL ERROR IN TEMPORAL REG");
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				return fatalError("FATAL ERROR IN TEMPORAL REG");
			}
		}
		else
		{
			return fatalError("PARAM MISS");
		}
		return retorno;
	}
	private static JSONObject fatalError(String message){
		JSONObject retorno = new JSONObject();
		retorno.put("STATUS", "FAIL");
		retorno.put("ERROR", message);
		retorno.put("ORDERS", "[]");
		return retorno;
	}
	private static JSONObject response(JSONArray orders, String message,String status){
		JSONObject retorno = new JSONObject();
		retorno.put("STATUS", status);
		retorno.put("ERROR", message);
		retorno.put("ORDERS", orders);
		return retorno;
	}
	private static JSONObject response(JSONArray orders, JSONArray message,String status){
		JSONObject retorno = new JSONObject();
		retorno.put("STATUS", status);
		retorno.put("ERROR", message);
		retorno.put("ORDERS", orders);
		return retorno;
	}
	// SE OBTIENE LA INFORMACION DE ADJUDICACIONES DE MERCADO PUBLICO
	private static JSONObject getMercadoPublico(String idMP) throws IOException, JSONException, ParseException, Error403Exception, IllegalAccessException, ErrorDBDataNotExistsException, ErrorDBDataErrorException{
		JSONObject resultado = new JSONObject();
		MercadoPublico mercado = new MercadoPublico(idMP);
		JSONObject mer = mercado.adjudicacion();
		//ADJUNTAMOS LOS DOCUMENTOS Y EXTRAEMOS LOS CAMPOS BASICOS DE LA ADJUDICACION
		String codigoDocumento = String.valueOf(mer.getInt("CODDOCUMENTO"));
		resultado.put("DURACIONCONTRATO",mer.getInt("DURACIONCONTRATO"));
		resultado.put("TIPOTOMARAZON", Mapeo.getMapeoI(Mapeo.TDOCHILECOMPRA,codigoDocumento));
		SimpleDateFormat sdf = new SimpleDateFormat("dd-M-yyyy");
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-M-dd");
		String fechaDocumento      = sdf.format(sdf1.parse(mer.getString("FECHA")));
		resultado.put("FECHADOCUMENTO",  fechaDocumento);
		resultado.put("FOLIO", mer.getString("FOLIO"));
		resultado.put("MONEDA",Mapeo.getMapeoI(Mapeo.UNIDADMONEDA, mer.getString("MONEDA")));
		Calendar fecha = Calendar.getInstance();
		fecha.setTime(sdf1.parse(mer.getString("FECHA")));
		int anioDocumento = fecha.get(Calendar.YEAR);
		resultado.put("ANIODOCUMENTO", anioDocumento);
		JSONArray lineas = new JSONArray();
		for(int i=0; i< mer.getJSONArray("ITEMS").length(); i++){
			//EXTRAEMOS LOS DATOS DE ADJUDICACION DE CADA LINEA DEL CONTRATO
			JSONObject item = new JSONObject();
			try{
				item.put("LINEA", mer.getJSONArray("ITEMS").getJSONObject(i).getInt("Correlativo"));
				item.put("IDPROVEEDOR", obtenerIdContratista(mer.getJSONArray("ITEMS").getJSONObject(i).getJSONObject("Adjudicacion").getString("RutProveedor").replaceAll("\\.", ""),mer.getJSONArray("ITEMS").getJSONObject(i).getJSONObject("Adjudicacion").getString("NombreProveedor")));
				item.put("MONTO", mer.getJSONArray("ITEMS").getJSONObject(i).getJSONObject("Adjudicacion").getLong("MontoUnitario"));
				
			}
			catch(Exception e)
			{
				item.put("LINEA", mer.getJSONArray("ITEMS").getJSONObject(i).getInt("Correlativo"));
				item.put("IDPROVEEDOR", 6730);
				item.put("MONTO",0);
			}
			lineas.put(item);
		}
		resultado.put("ITEMS", lineas);
		return resultado;
	}  
	private static int  obtenerIdContratista(String rutContratista, String razon) throws IllegalAccessException{
		Model<ModelContratista> contratista = new Model<ModelContratista>(ModelContratista.class);
		ModelResult<ModelContratista> resContratista;
		int idContratista = 0;
		try {
			resContratista = contratista.find("{'RUT':'"+rutContratista+"'}");
			if(resContratista.size() > 0){
				idContratista =  resContratista.toJSON().getJSONObject(0).getInt("NUMERO");
				return idContratista;
			}
			else{
				JSONObject contratistaSQL = new JSONObject();
				contratistaSQL.put("C_ESTADO", "S");
				contratistaSQL.put("CREADO", "GEOCGR");
				contratistaSQL.put("C_RUT", rutContratista);
				DateFormat format = new SimpleDateFormat("dd/MM/yyyy", Locale.ENGLISH);
				contratistaSQL.put("F_CREACION", format.format(new Date()).toString());
				contratistaSQL.put("F_MODIFICA", format.format(new Date()).toString());
				contratistaSQL.put("MODIFICADO", "GEOCGR");
				contratistaSQL.put("T_APELLIDOS", "-");
				contratistaSQL.put("T_NOMBRE", razon);
				Model<ModelContratistaCreate> contra = new Model<ModelContratistaCreate>(ModelContratistaCreate.class);
				int idcontra = contra.getNextVal("SEQ_GEO_CONTRATISTAS");
				contratistaSQL.put("X_CONT", idcontra);
				contra.insert(contratistaSQL.toString());
				return idcontra;
			}
		} catch (Error403Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return idContratista;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return idContratista;
		}
	} 
}
