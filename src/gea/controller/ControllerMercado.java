package gea.controller;

import gea.annotation.ModelField;
import gea.framework.Model;
import gea.framework.ModelResult;
import gea.framework.Request;
import gea.framework.Response;
import gea.mercadopublico.Formulario;
import gea.mercadopublico.MercadoData;
import gea.mercadopublico.MercadoPublico;
import gea.model.ModelAdjudicacionContrato;
import gea.model.ModelCodigoBIP;
import gea.model.ModelCodigoINI;
import gea.model.ModelComunalComp;
import gea.model.ModelConsultaIdi;
import gea.model.ModelContratista;
import gea.model.ModelIdsMercadoUnico;
import gea.model.ModelProyectos;
import gea.model.ModelServicio;
import gea.model.ModelServicios;
import gea.model.ModelSpatial;
import gea.model.ModelSpatialQuery;
import gea.model.ModelTomaRazon;
import gea.model.ModelUbicacionProyecto;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.ErrorChileCompraRegException;
import gea.utils.Exception.ErrorCodeException;
import gea.utils.Exception.ErrorDBDataErrorException;
import gea.utils.Exception.ErrorDBDataNotExistsException;
import gea.utils.Exception.ErrorDateConvertionException;
import gea.utils.Exception.ErrorJSONDataReadException;
import gea.utils.Exception.ErrorReadServiceException;
import gea.utils.trewautils.Mapeo;
import gea.utils.trewautils.TrewaUtil;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import SPATIAL.Coordinate;
import SPATIAL.LineType;
import SPATIAL.MultiGeometryType;
import SPATIAL.PointType;
import SPATIAL.Spatial;

@SuppressWarnings("unused")
public class ControllerMercado extends ControllerBase{
	// ACTION PARA GENERAR GET DE MERCADO
	public static void get(Request req, Response res) throws ErrorCodeException{
		MercadoPublico mercado;
		try {
			mercado = new MercadoPublico(req.getData().getString("id").toUpperCase());
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "OK");
			retorno.put("DATA", mercado.principal());
			retorno.put("DATAREG", GETEXISTS(req.getData().getString("id").toUpperCase()));
			res.SendCallback(retorno);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "La licitacion indicada no posee datos validos en Mercado Publico. Contacte con los administradores de la plataforma.");
			res.SendCallback(retorno);
		} catch (IOException e) {
			JSONObject retorno = new JSONObject();
			retorno.put("STATUS", "ERROR");
			retorno.put("CODE", "MPNC");
			retorno.put("ERROR", "No se puede acceder al servicio de datos de Mercado Publico. Contacte con los administradores de la plataforma.");
			res.SendCallback(retorno);
		}
	}
	// ACTION PARA RESCATAR EL FORMULARIO
	private static JSONObject GETEXISTS(String id){
		JSONObject retorno = new JSONObject();
		//BUSCAMOS LAS COINCIDENCIAS DE REGISTRO DE MP
		Model<ModelIdsMercadoUnico> IDMEPUBLIC = new Model<ModelIdsMercadoUnico>(ModelIdsMercadoUnico.class);
		JSONObject query = new JSONObject();
		query.put("C_ID_MERC_UNICO", id);
		try {
			ModelResult<ModelIdsMercadoUnico> registros = IDMEPUBLIC.find(query.toString());
			if(registros.size() > 0){
				retorno.put("STATUS", 1);
				JSONArray resultado = registros.toJSON();
				for(int i=0; i< resultado.length(); i++){
					JSONObject LINEA = new JSONObject();
					query = new JSONObject();
					int ge = 1;
					query.put("X_PROY", resultado.getJSONObject(i).getInt("PROY_X_PROY"));
					Model<ModelProyectos> PROYECTO = new Model<ModelProyectos>(ModelProyectos.class);
					ModelResult<ModelProyectos> proyecto = PROYECTO.find(query.toString());
					JSONObject registro = proyecto.toJSON().getJSONObject(0);
					if(registro.has("UORG_X_UORG")) LINEA.put("SERVMANDANTE", getServicio(registro.getInt("UORG_X_UORG")));
					if(registro.has("CLAS_X_CLAS")) LINEA.put("CLASIFICATION", registro.getInt("CLAS_X_CLAS"));
					if(registro.has("SUBC_X_SUBC")) LINEA.put("SUBCLASIFICATION", registro.getInt("SUBC_X_SUBC"));
					if(registro.has("TITULO_CORTO")) LINEA.put("SHORTNAME", registro.getString("TITULO_CORTO"));
					if(registro.has("C_TIPO_PROYECTO")) LINEA.put("TYPECONTRACT", Mapeo.getMapeoInversoS(Mapeo.TIPOCONTRATO, registro.getString("C_TIPO_PROYECTO")));
					if(registro.has("LINEA")) LINEA.put("LINE", resultado.getJSONObject(i).getInt("LINEA"));
					query = new JSONObject();
					query.put("PROY_X_PROY", resultado.getJSONObject(i).getInt("PROY_X_PROY"));
					//DEFINIMOS LOS MODELOS DE DONDE OBTENER DATOS
					Model<ModelCodigoBIP> CODBIP = new Model<ModelCodigoBIP>(ModelCodigoBIP.class);
					Model<ModelCodigoINI> CODINI = new Model<ModelCodigoINI>(ModelCodigoINI.class);
					Model<ModelUbicacionProyecto> UBICPROY = new Model<ModelUbicacionProyecto>(ModelUbicacionProyecto.class);
					Model<ModelComunalComp> COMUNAS = new Model<ModelComunalComp>(ModelComunalComp.class);
					Model<ModelTomaRazon> TOMARAZON = new Model<ModelTomaRazon>(ModelTomaRazon.class);
					Model<ModelAdjudicacionContrato> ADJUCONTRACT = new Model<ModelAdjudicacionContrato>(ModelAdjudicacionContrato.class);
					Model<ModelSpatialQuery> SPA = new Model<ModelSpatialQuery>(ModelSpatialQuery.class);
					//GENERAMOS LOS RESULTADOS DE CODIGOS INI Y BIP, TOMA DE RAZON Y ADJUDICACION
					ModelResult<ModelCodigoBIP> REBIP = CODBIP.find(query.toString());
					ModelResult<ModelCodigoINI> REINI = CODINI.find(query.toString());
					ModelResult<ModelTomaRazon> RETRAZON = TOMARAZON.find(query.toString());
					ModelResult<ModelAdjudicacionContrato> READJU = ADJUCONTRACT.find(query.toString());
					ModelResult<ModelSpatialQuery> RESPATIAL = SPA.find(query.toString());
					//ASIGNAMOS LOS RESULTADOS DE LA CONSULTA
					if(REBIP.size() > 0) LINEA.put("CODBIP", REBIP.toJSON().getJSONObject(0).getString("C_BIP"));
					if(REINI.size() > 0) LINEA.put("CODINI", REINI.toJSON().getJSONObject(0).getString("C_INI"));
					if(RETRAZON.size() > 0){
						JSONObject RE_TRAZON = RETRAZON.toJSON().getJSONObject(0);
						if(RE_TRAZON.has("UORG_X_UORG")) LINEA.put("SERVCONTRATANTE",getServicio(RE_TRAZON.getInt("UORG_X_UORG")));
					}
					if(READJU.size() > 0){
						JSONObject RE_ADJU = READJU.toJSON().getJSONObject(0);
						if(RE_ADJU.has("TIFI_X_TIFI")) LINEA.put("TFOUNDING",RE_ADJU.getInt("TIFI_X_TIFI"));
						if(RE_ADJU.has("C_PROCEDIMIENTO_CONTRATACION")) LINEA.put("PROCECONTRATACION",RE_ADJU.getString("C_PROCEDIMIENTO_CONTRATACION"));
						if(RE_ADJU.has("CAPP_X_CAPP")) LINEA.put("CAUSEORDER",RE_ADJU.getInt("CAPP_X_CAPP"));
						if(RE_ADJU.has("N_MONTO_CONTRATADO")) LINEA.put("MONTOADJUCLP",RE_ADJU.getLong("N_MONTO_CONTRATADO"));
						if(RE_ADJU.has("FECHA_MONTO_ADJUDICADO")) LINEA.put("FECHAMONTOADJU",RE_ADJU.getString("FECHA_MONTO_ADJUDICADO"));
						if(RE_ADJU.has("MODC_X_MODC")) LINEA.put("MODCONTRA",RE_ADJU.getInt("MODC_X_MODC"));
						if(RE_ADJU.has("D_NORMA")) LINEA.put("NORMA",RE_ADJU.getString("D_NORMA"));
						if(RE_ADJU.has("D_CAUSA_FUNDAMENTO_NORMATIVO")) LINEA.put("CAUSAFUND",RE_ADJU.getString("D_CAUSA_FUNDAMENTO_NORMATIVO"));
						if(RE_ADJU.has("C_TIPO_DOCUMENTO")) LINEA.put("TIPODOC",RE_ADJU.getString("C_TIPO_DOCUMENTO"));
						if(RE_ADJU.has("F_INICIO_OBRA")) LINEA.put("INITDATE",RE_ADJU.getString("F_INICIO_OBRA"));
						if(RE_ADJU.has("F_FIN_OBRA")) LINEA.put("FINISHDATE",RE_ADJU.getString("F_FIN_OBRA"));
						
					}
					// DETERMINAMOS LA COMUNA
					JSONArray COMUNA = new JSONArray();
					ModelResult<ModelUbicacionProyecto> REUBI = UBICPROY.find(query.toString());
					if(REUBI.size() > 0){
						for(int j=0;j<REUBI.size();j++){
							query = new JSONObject();
							query.put("COMUNA", REUBI.toJSON().getJSONObject(0).getInt("COMU_X_COMU"));
							ModelResult<ModelComunalComp> RECOMUNA = COMUNAS.find(query.toString());
							JSONObject COM = new JSONObject();
							COM.put("NOMBRE", RECOMUNA.toJSON().getJSONObject(0).getString("NOMBRE"));
							COM.put("CODIGO", RECOMUNA.toJSON().getJSONObject(0).getString("NUMERO"));
							COMUNA.put(COM);
						}
					}
					LINEA.put("COMUNAS", COMUNA);
					LINEA.put("SPATIAL", RESPATIAL.toJSON().getJSONObject(0).get("SPATIAL_OBJECT"));
					retorno.put(String.valueOf(resultado.getJSONObject(i).getInt("LINEA")), LINEA);
				}
			}
			else{
				retorno.put("STATUS", 0);
			}
		} catch (Error403Exception e) {
			System.out.println("EXISTE UN ERROR AL RESCATAR LOS DATOS PREVIAMENTE GUARDADOS POR LA PLATAFORMA");
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "EXISTE UN ERROR AL RESCATAR LOS DATOS PREVIAMENTE GUARDADOS POR LA PLATAFORMA");
			return retorno;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("EXISTE UN ERROR AL RESCATAR LOS DATOS PREVIAMENTE GUARDADOS POR LA PLATAFORMA");
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "EXISTE UN ERROR AL RESCATAR LOS DATOS PREVIAMENTE GUARDADOS POR LA PLATAFORMA");
			return retorno;
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			System.out.println("MAPEO ERRONEO DE DATOS, VERIFIQUE LOS CAMPOS");
			System.out.println(e.getMessage());
			retorno.put("STATUS", "ERROR");
			retorno.put("ERROR", "EXISTE UN ERROR AL RESCATAR LOS DATOS PREVIAMENTE GUARDADOS POR LA PLATAFORMA");
			return retorno;
		} catch (ErrorDBDataNotExistsException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ErrorDBDataErrorException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return retorno;
	}
	// METODO PARA OBTENER SERVICIOS
	private static JSONObject getServicio(int codigo){
		try {
			Model<ModelServicio> chile = new Model<ModelServicio>(ModelServicio.class);
			ModelResult<ModelServicio> resul = chile.find("{'CODIGO':'"+codigo+"'}");
			if(resul.size() > 0){
				return resul.toJSON().getJSONObject(0);
			}
			else
			{
				JSONObject servicio = new JSONObject();
				servicio.put("NUMERO","NOTMATCH");
				servicio.put("NOMBRE","NOTMATCH");
				return servicio;
			}
		} catch (Error403Exception e) {
			System.out.println("EXISTE UN ERROR AL MAPEAR EL SERVICIO CON CODIGO: "+codigo);
			return null;
		} catch (IOException e) {
			System.out.println("EXISTE UN ERROR AL MAPEAR EL SERVICIO CON CODIGO: "+codigo);
			return null;
		}
	}
	//METODO PARA IDENTIFICAR UNA OC
	private static boolean isOC(String licitacion){
		if(licitacion.matches("(-OC.*|-SE.*|-D1.*|-C1.*|-F3.*|-G1.*|-R1.*|-CA.*|-CM.*|-FG.*|-TL.*)")){
			return true;
		}
		return false;
	}
	public static void oc(Request req, Response res) throws ErrorDBDataNotExistsException, ErrorCodeException{
		
	}
	// ACTION PARA GUARDAR LOS DATOS DEL FORMULARIO
	public static void set(Request req, Response res) throws ErrorDBDataNotExistsException, ErrorCodeException{
		// FORMULARIOS DE ROLLBACK
		ArrayList<Formulario> FORM_ROLL =  new ArrayList<Formulario>();
		//DEFINIMOS EL OBJETO QUE USAREMOS PARA EFECTOS DE RETORNO
		JSONObject retorno = new JSONObject();
		//EN PRIMER CASO CAMPUTAREMOS LA INFORMACION DE MERCADO PUBLICO
		MercadoData mercado = null;
		JSONArray formulario = new JSONArray();
		String KMLFILE = null;
		try {
			// LLAMADA A LA API DE MERCADO PUBLICO
			mercado = new MercadoData(req.getData().getString("id_mercado"));
			// OBTENGO LOS FORMULARIOS ENTREGADOS POR EL FORMULARIO DE CHILECOMPRA
			formulario = req.getData().getJSONArray("formulario");
			// OBTENGO LOS FORMULARIOS ENTREGADOS POR EL FORMULARIO DE CHILECOMPRA
			KMLFILE = req.getData().getString("kmlfile");
		} catch (ErrorJSONDataReadException e) {
			retorno.put("STATUS", "ERROR JSON FETCH EXCEPTION");
			retorno.put("ERROR", "ERROR AL LEER DATOS EN LA ESTRUCTURA JSON DURANTE LA ETAPA DE CAPTURA DE DATOS DE LA API DE MERCADO PUBLICO");
			retorno.put("ERRORMESSAGE", e.getMessage());
			res.SendCallback(retorno);
			return;
		} catch (ErrorReadServiceException e) {
			retorno.put("STATUS", "READ SERVICE FAIL");
			retorno.put("ERROR", "ERROR AL LEER DATOS EN LA API DE MERCADO PUBLICO. ES POSIBLE QUE SEA UNA LICITACION SIN DATOS, VERIFICAR.");
			retorno.put("ERRORMESSAGE", e.getMessage());
			res.SendCallback(retorno);
			return;
		} catch (ErrorDBDataNotExistsException e) {
			retorno.put("STATUS", "DB DATA NOT EXISTS IN MAPING");
			retorno.put("ERROR", "ERROR AL LEER MAPEAR DATOS DE LA API DE MERCADO PUBLICO CON DATABASE DE GEO.");
			retorno.put("ERRORMESSAGE", e.getMessage());
			res.SendCallback(retorno);
			return;
		} catch (ErrorDBDataErrorException e) {
			retorno.put("STATUS", "DB DATA ERROR");
			retorno.put("ERROR", "ERROR AL EFECTUAR OPERACIONES EN LA BASE DE DATOS DE GEO.");
			retorno.put("ERRORMESSAGE", e.getMessage());
			res.SendCallback(retorno);
			return;
		}		
		// EMPEZAMOS CON LAS OPERACIONES
		// ITERAMOS LOS FORMULARIOS
		for(int i =0; i < formulario.length() ; i++){
			//CREAMOS EL FORMULARIO
			Formulario _FORM = null;
			try {
				_FORM = new Formulario(formulario.getJSONObject(i).getJSONObject("form"), mercado);
				FORM_ROLL.add(_FORM);
				try {
					if(_FORM.verifyAllData() && mercado.verifyData()){
						// GENERAMOS EL EXPEDIENTE DE TREWAA
						_FORM.getTrewaaExp();
						// GENERAMOS EL CODIGO DEL PROYECTO
						_FORM.GENERATE_X_PROY();
						// EXTRAEMOS EL OBJETO GEOESPACIAL
						_FORM.setSPATIAL(formulario.getJSONObject(i).getJSONObject("spatial"));
						// GENERAMOS EL INSERT EN LA TABLA DE CODIGOS BIP
						if(INPROYECTO(_FORM,mercado)){
							//AGREGAMOS LOS CODIGOS BIP EN CASO DE QUE EXISTAN
							INBIP(_FORM, mercado);
							//AGREGAMOS LOS CODIGOS INI EN CASO DE EXISTIR
							ININI(_FORM, mercado);
							//INTENTAMOS CREAR EL REGISTROS DE ID DE MERCADO PUBLICO
							if(INCODMERCADOPUB(_FORM,mercado)){
								if(INUBICATION(_FORM,mercado)){
									if(INTOMARAZON(_FORM,mercado)){
										if(INADJUDICACION(_FORM,mercado)){
											if(INSPATIAL(_FORM,mercado, req,KMLFILE)){
												retorno.put("STATUS", "OK");
											}
										}
									}
								}
							}
						}
					}
					else{
						retorno.put("STATUS", "DATA ERROR COMPLETE");
						retorno.put("ERROR", "NO SE PUEDE EFECTUAR LA TRANSACCION DEBIDO A QUE NO SE PUDO OBTENER TODOS LOS DATOS NECESARIOS");
					}
				} catch (ErrorChileCompraRegException e) {
					_FORM.rollback();
					retorno.put("STATUS", "DATA ERROR COMPLETE");
					retorno.put("ERROR", "EXISTE UN ERROR AL INTENTAR REGISTRAR EL PROYECTO EN LA BASE DE DATOS GEO");
					retorno.put("ERRORMESSAGE", e.getMessage());
				} catch (ErrorDBDataErrorException e) {
					_FORM.rollback();
					retorno.put("STATUS", "DATA ERROR COMPLETE");
					retorno.put("ERROR", "NO SE PUEDE EFECTUAR LA TRANSACCION DEBIDO A UN ERROR EN LA DB.");
					retorno.put("ERRORMESSAGE", e.getMessage());
				} catch ( Exception e ) {
					e.printStackTrace();
				}
			} catch (JSONException e) {
				retorno.put("STATUS", "FORM LOAD ERROR");
				retorno.put("ERROR", "NO SE PUEDE CARGAR DE FORMA ADECUADA LA INFORMACION DEL FORMULARIO DEBIDO A UN ERROR DE LECTURA EN UNA ESTRUCTURA JSON");
				retorno.put("ERRORMESSAGE", e.getMessage());
			} catch (ErrorDBDataErrorException e) {
				retorno.put("STATUS", "FORM LOAD ERROR");
				retorno.put("ERROR", "NO SE PUEDE CARGAR DE FORMA ADECUADA LA INFORMACION DEL FORMULARIO DEBIDO A UN ERROR EN LA BASE DE DATOS");
				retorno.put("ERRORMESSAGE", e.getMessage());
			} catch (ErrorDateConvertionException e) {
				retorno.put("STATUS", "FORM LOAD ERROR");
				retorno.put("ERROR", "NO SE PUEDE CARGAR DE FORMA ADECUADA LA INFORMACION DEL FORMULARIO DEBIDO A UN ERROR EN LA CONVERSION DE FECHAS");
				retorno.put("ERRORMESSAGE", e.getMessage());
			} catch (ErrorJSONDataReadException e) {
				retorno.put("STATUS", "FORM LOAD ERROR");
				retorno.put("ERROR", "NO SE PUEDE CARGAR DE FORMA ADECUADA LA INFORMACION DEL FORMULARIO DEBIDO A UN ERROR DE LECTURA EN UNA ESTRUCTURA JSON");
				retorno.put("ERRORMESSAGE", e.getMessage());
			} 
		}
		res.SendCallback(retorno);
	}
	private static boolean INPROYECTO(Formulario _FORM, MercadoData mercado) throws ErrorChileCompraRegException{
		try{
			// CARGAMOS EL MODELO DE DATOS
			Model<ModelProyectos> PROYECTO = new Model<ModelProyectos>(ModelProyectos.class);
			// GENERAMOS EL OBJETO DE INGRESO
			// CORRESPONDE AL INSERT DE PROYECTO
			
			JSONObject PROY = new JSONObject();
			PROY.put("CREADO", _FORM.CREATORUSER);
			PROY.put("MODIFICADO", "N");
			PROY.put("F_MODIFICA", "01-01-1900");
			PROY.put("C_TIPO_REGISTRO", "N");
			PROY.put("F_CREACION", _FORM.CREATEDATE);
			PROY.put("D_DESCRIPCION", mercado.DESCRIPCION);
			PROY.put("C_EXENTO_AFECTO", mercado.TIPODOC);
			PROY.put("X_PROY", _FORM.X_PROY);
			PROY.put("C_TIPO_PROYECTO", _FORM.TYPECONTRACT);
			PROY.put("T_TITULO_PROYECTO", mercado.TITULOPROY);
			PROY.put("UORG_X_UORG", _FORM.SERVMANDANTE);
			PROY.put("CLAS_X_CLAS", _FORM.CLASIFICACTION);
			PROY.put("SUBC_X_SUBC", _FORM.SUBCLASIFICATION);
			PROY.put("C_NO_BIP", "S");
			PROY.put("C_NO_INI", "S");
			PROY.put("EXPE_X_EXPE_TREWA", _FORM.EXPETREWA);
			PROY.put("TITULO_CORTO", _FORM.SHORTNAME);
			return PROYECTO.insert(PROY.toString());
		}
		catch(Error403Exception e){
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE PROYECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 1 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE PROYECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 1 DE REGISTRO. ERROR: "+e.getMessage());
		}
	}
	private static void INBIP(Formulario _FORM, MercadoData mercado) throws ErrorChileCompraRegException{
		if(_FORM.CODBIP != null){
			try{
				Model<ModelCodigoBIP> CODBIP = new Model<ModelCodigoBIP>(ModelCodigoBIP.class);
				// GENERAMOS EL OBJETO DE INGRESO
				// CORRESPONDE AL INSERT DE CODIGO BIP
				JSONObject BIP = new JSONObject();
				BIP.put("X_CBIP", CODBIP.getNextVal("SEQ_GEO_CODIGOS_BIP"));
				BIP.put("CREADO", _FORM.CREATORUSER);
				BIP.put("MODIFICADO", "N");
				BIP.put("F_MODIFICA", "01-01-1900");
				BIP.put("F_CREACION", _FORM.CREATEDATE);
				BIP.put("C_BIP", _FORM.CODBIP);
				BIP.put("PROY_X_PROY", _FORM.X_PROY);
				CODBIP.insert(BIP.toString());
			}
			catch(Error403Exception e){
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO BIP PARA EL PROYECTO "+_FORM.X_PROY+". FASE 2 DE REGISTRO. ERROR: "+e.getMessage());
			} catch (IOException e) {
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO BIP PARA EL PROYECTO "+_FORM.X_PROY+". FASE 2 DE REGISTRO. ERROR: "+e.getMessage());
			} catch (JSONException e) {
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO BIP PARA EL PROYECTO "+_FORM.X_PROY+". FASE 2 DE REGISTRO. ERROR: "+e.getMessage());
			} catch (IllegalAccessException e) {
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO BIP PARA EL PROYECTO "+_FORM.X_PROY+". FASE 2 DE REGISTRO. ERROR: "+e.getMessage());
			}
		}
	}
	
	private static void INBIPWS(Formulario _FORM, MercadoData mercado) throws Exception {
		Integer largo = -1;
		String[] anio = null;
		String[] codigoEtapa = null;
		String[] nombreEtapa = null;
		
		if( _FORM.CODBIP != null ) {
			try {
				// INSERT DEL CODIGO IDI - METODO CONSULTA IDI
				Model<ModelConsultaIdi> CONIDI = new Model<ModelConsultaIdi>(ModelConsultaIdi.class);
				JSONObject IDIReg = new JSONObject();
				JSONObject IDIData = ControllerMideso.validaIDI(_FORM.CODBIP.substring(0, 8), _FORM.CODBIP.substring(9, 1));
				
				if ( IDIData.getInt("EXISTEIDI") == 1 ) {
					largo = IDIData.getInt("TAMANIO");
					anio  = (String[]) IDIData.get("ANIO");
					codigoEtapa = (String[]) IDIData.get("C_ETAPA");
					nombreEtapa = (String[]) IDIData.get("N_ETAPA");
					
					for ( int j = 0; j < largo; j++ ) {
						IDIReg.put("CREADO", _FORM.CREATORUSER);
						IDIReg.put("F_CREACION", _FORM.CREATEDATE);
						IDIReg.put("X_CIDI", CONIDI.getNextVal("GEO_CONSULTA_IDI_SEQ"));
						IDIReg.put("CBIP_X_CBIP", _FORM.CODBIP);
						IDIReg.put("PROY_X_PROY", _FORM.X_PROY);
						IDIReg.put("ANIO", anio[j]);
						IDIReg.put("C_ETAPA", codigoEtapa[j]);
						IDIReg.put("N_ETAPA", nombreEtapa[j]);
						
						CONIDI.insert(IDIReg.toString());
					}
				}
			} catch ( Error403Exception e ) {
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO BIP PARA EL PROYECTO " + _FORM.X_PROY + ". FASE 2 DE REGISTRO. ERROR: " + e.getMessage());
			} catch ( JSONException e ) {
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO BIP PARA EL PROYECTO " + _FORM.X_PROY + ". FASE 2 DE REGISTRO. ERROR: " + e.getMessage());
			}
		}
	}
	
	private static void ININI(Formulario _FORM, MercadoData mercado) throws ErrorChileCompraRegException{
		if(_FORM.CODINI != null){
			try{
				Model<ModelCodigoINI> CODINI = new Model<ModelCodigoINI>(ModelCodigoINI.class);
				// GENERAMOS EL OBJETO DE INGRESO
				// CORRESPONDE AL INSERT DE CODIGO INI
				JSONObject INI = new JSONObject();
				INI.put("X_CINI", CODINI.getNextVal("SEQ_GEO_CODIGOS_INI"));
				INI.put("CREADO", _FORM.CREATORUSER);
				INI.put("MODIFICADO", "N");
				INI.put("F_MODIFICA", "01-01-1900");
				INI.put("F_CREACION", _FORM.CREATEDATE);
				INI.put("C_INI", _FORM.CODINI);
				INI.put("PROY_X_PROY", _FORM.X_PROY);
				CODINI.insert(INI.toString());
			}
			catch(Error403Exception e){
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO INI PARA EL PROYECTO "+_FORM.X_PROY+". FASE 3 DE REGISTRO. ERROR: "+e.getMessage());
			} catch (IllegalAccessException e) {
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO INI PARA EL PROYECTO "+_FORM.X_PROY+". FASE 3 DE REGISTRO. ERROR: "+e.getMessage());
			} catch (JSONException e) {
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO INI PARA EL PROYECTO "+_FORM.X_PROY+". FASE 3 DE REGISTRO. ERROR: "+e.getMessage());
			} catch (IOException e) {
				throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE CODIGO INI PARA EL PROYECTO "+_FORM.X_PROY+". FASE 3 DE REGISTRO. ERROR: "+e.getMessage());
			}
		}
	}
	private static boolean INCODMERCADOPUB(Formulario _FORM, MercadoData mercado) throws ErrorChileCompraRegException{
		try{
			Model<ModelIdsMercadoUnico> IDMEPUBLIC = new Model<ModelIdsMercadoUnico>(ModelIdsMercadoUnico.class);
			// GENERAMOS EL OBJETO DE INGRESOLIN
			// CORRESPONDE AL INSERT DE CODIGO INI
			JSONObject MU = new JSONObject();
			MU.put("CREADO", _FORM.CREATORUSER);
			MU.put("F_CREACION", _FORM.CREATEDATE);
			MU.put("MODIFICADO", "N");
			MU.put("F_MODIFICA", "01-01-1900");
			MU.put("PROY_X_PROY", _FORM.X_PROY);
			MU.put("X_IDMU", IDMEPUBLIC.getNextVal("SEQ_GEO_IDS_MERCADO_UNICO"));
			MU.put("C_ID_MERC_UNICO", mercado.CODIGOMP);
			MU.put("LINEA", _FORM.LINE);
			MU.put("ENTIDAD", _FORM.ENTIDAD);
			MU.put("CODIGO_ENTIDAD", _FORM.CODIGO_ENTIDAD);
			MU.put("X_ENTIDAD", _FORM.ID_ENTIDAD);
			return IDMEPUBLIC.insert(MU.toString());
		}
		catch(Error403Exception e){
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE ID MERCADO PUBLICO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 4 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE ID MERCADO PUBLICO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 4 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (JSONException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE ID MERCADO PUBLICO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 4 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IllegalAccessException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE ID MERCADO PUBLICO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 4 DE REGISTRO. ERROR: "+e.getMessage());
		}
	}
	private static boolean INUBICATION(Formulario _FORM, MercadoData mercado) throws ErrorChileCompraRegException{
		try{
			if(_FORM.COMUNA.length() > 0){
				Model<ModelComunalComp> COMUNAS = new Model<ModelComunalComp>(ModelComunalComp.class);
				Model<ModelUbicacionProyecto> UBICPROY = new Model<ModelUbicacionProyecto>(ModelUbicacionProyecto.class);
				
				for(int x =0; x < _FORM.COMUNA.length() ; x++){
					ModelResult<ModelComunalComp> resultado = COMUNAS.find("{'NUMERO':'"+_FORM.COMUNA.getJSONObject(x).getString("codigo")+"'}");
					JSONObject MU = new JSONObject();
					MU.put("CREADO", _FORM.CREATORUSER);
					MU.put("F_CREACION", _FORM.CREATEDATE);
					MU.put("MODIFICADO", "N");
					MU.put("F_MODIFICA", "01-01-1900");
					MU.put("X_UBIC", UBICPROY.getNextVal("SEQ_GEO_UBICACIONES_PROYECTO"));
					MU.put("PROY_X_PROY", _FORM.X_PROY);
					MU.put("REGI_X_REGI", resultado.toJSON().getJSONObject(0).getInt("REGION"));
					MU.put("PROV_X_PROV", resultado.toJSON().getJSONObject(0).getInt("PROVINCIA"));
					MU.put("COMU_X_COMU", resultado.toJSON().getJSONObject(0).getInt("COMUNA"));
					UBICPROY.insert(MU.toString());
				}
				return true;
			}
			else{
				return false;
			}
		}
		catch(Error403Exception e){
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE UBICACION DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 5 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE UBICACION DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 5 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (JSONException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE UBICACION DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 5 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IllegalAccessException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE UBICACION DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 5 DE REGISTRO. ERROR: "+e.getMessage());
		}
	}
	private static boolean INTOMARAZON(Formulario _FORM, MercadoData mercado) throws ErrorChileCompraRegException{
		try{
			// CARGAMOS EL MODELO DE DATOS
			Model<ModelTomaRazon> TOMARAZON = new Model<ModelTomaRazon>(ModelTomaRazon.class);
			// CREAMOS EL INGRESO A LA TOMA DE RAZON
			_FORM.X_TORA = TOMARAZON.getNextVal("SEQ_GEO_TOMAS_RAZON");
			JSONObject TRAZON = new JSONObject();
			TRAZON.put("CREADO", _FORM.CREATORUSER);
			TRAZON.put("F_CREACION", _FORM.CREATEDATE);
			TRAZON.put("MODIFICADO", "N");
			TRAZON.put("F_MODIFICA", "01-01-1900");
			TRAZON.put("X_TORA", _FORM.X_TORA);
			TRAZON.put("TDTR_X_TDTR", "72"); // CAMPO AGREGADO A LA DB QUE INDICA SIN DOCUMENTO SIN ADJUDICAR
			TRAZON.put("F_DOCUMENTO", "01-01-1900");
			TRAZON.put("C_NUMERO_DOCUMENTO", "");
			TRAZON.put("N_ANHO_DOCUMENTO", 0);
			TRAZON.put("UORG_X_UORG", _FORM.SERVCONTRATANTE);
			TRAZON.put("RETR_X_RETR", mercado.TOMARAZON);
			TRAZON.put("F_PROC_TOMA_RAZON", "01-01-1900");
			TRAZON.put("PROY_X_PROY", _FORM.X_PROY);
			return TOMARAZON.insert(TRAZON.toString());
		}
		catch(Error403Exception e){
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE TOMA DE RAZON DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 6 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE TOMA DE RAZON DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 6 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (JSONException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE TOMA DE RAZON DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 6 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IllegalAccessException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE TOMA DE RAZON DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 6 DE REGISTRO. ERROR: "+e.getMessage());
		}
	}
	private static boolean INADJUDICACION(Formulario _FORM, MercadoData mercado) throws ErrorChileCompraRegException{
		try{
			// CARGAMOS EL MODELO DE DATOS
			Model<ModelAdjudicacionContrato> ADJUCONTRACT = new Model<ModelAdjudicacionContrato>(ModelAdjudicacionContrato.class);
			// CREAMOS EL INGRESO DE LA ADJUDICACION EN BORRADOR
			int x_opac = ADJUCONTRACT.getNextVal("SEQ_GEO_OP_ADJUDICACIONES_CONT");
			JSONObject ADJU = new JSONObject();
			ADJU.put("CREADO", _FORM.CREATORUSER);
			ADJU.put("F_CREACION", _FORM.CREATEDATE);
			ADJU.put("MODIFICADO", "N");
			ADJU.put("F_MODIFICA", "01-01-1900");
			ADJU.put("X_OPAC", ADJUCONTRACT.getNextVal("SEQ_GEO_OP_ADJUDICACIONES_CONT"));
			ADJU.put("C_TIPO_DOCUMENTO", mercado.TIPODOC);
			ADJU.put("TORA_X_TORA", _FORM.X_TORA);
			ADJU.put("C_INSPECTOR_FISCAL", "N");
			ADJU.put("C_PROCEDIMIENTO_CONTRATACION", mercado.PROCECONTRATACION);
			ADJU.put("MODC_X_MODC", _FORM.MODCONTRA);
			ADJU.put("D_CAUSA_FUNDAMENTO_NORMATIVO", _FORM.CAUSAFUND);
			ADJU.put("CAPP_X_CAPP", _FORM.CAUSEORDER);
			ADJU.put("D_NORMA", _FORM.NORMA);
			ADJU.put("CONT_X_CONT", "6730"); // CAMPO AGREGADO A LA DB QUE INDICA SIN CONTRATISTA
			ADJU.put("N_PLAZO_EJECUCION", 0);
			ADJU.put("UNTI_X_UNTI_PLAZO_EJEC",mercado.UNIDATIEMPO);
			ADJU.put("COPL_X_COPL", 50);
			ADJU.put("D_COMPUTO_PLAZO", "NO POSEE");
			ADJU.put("F_INICIO_OBRA", _FORM.INIDATE);
			ADJU.put("F_FIN_OBRA", _FORM.FINISHDATE);
			ADJU.put("TIFI_X_TIFI", _FORM.TFOUNDING);
			ADJU.put("D_TIPO_FINANCIAMIENTO", "");
			ADJU.put("MONTO_ADJUDICADO_CLP", -1);
			ADJU.put("MONEDA_MONTO_MP", mercado.MONEDA);
			ADJU.put("TIMO_X_TIMO_MONTO_CONTRATO",1);
			ADJU.put("SIRE_X_SIRE", "60");
			ADJU.put("D_SISTEMA_REAJUSTE", "NO POSEE");
			ADJU.put("N_MONTO_ANTICIPO", 0);
			ADJU.put("PROY_X_PROY", _FORM.X_PROY);
			ADJU.put("N_ADJUDICACION", _FORM.N_ORDER);
			if(_FORM.MONTOADJUCLP == null) { 
				ADJU.put("N_MONTO_CONTRATADO", -1); 
			}
			else{
				ADJU.put("N_MONTO_CONTRATADO", _FORM.MONTOADJUCLP);
			}
			if(_FORM.FECHAMONTOADJU == null) { ADJU.put("FECHA_MONTO_ADJUDICADO", "01-01-1900"); }
			else ADJU.put("FECHA_MONTO_ADJUDICADO", _FORM.FECHAMONTOADJU);
			ADJU.put("C_OPE_BORRADOR", "S");
			return ADJUCONTRACT.insert(ADJU.toString());
		}
		catch(Error403Exception e){
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE ADJUDICACION DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 7 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE ADJUDICACION DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 7 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (JSONException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE ADJUDICACION DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 7 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IllegalAccessException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO DE ADJUDICACION DE PROJECTO PARA EL PROYECTO "+_FORM.X_PROY+". FASE 7 DE REGISTRO. ERROR: "+e.getMessage());
		}
	}
	private static boolean INSPATIAL(Formulario _FORM, MercadoData mercado, Request req, String kMLFILE) throws ErrorChileCompraRegException{
		try{
			// CARGAMOS EL MODELO DE DATOS
			Model<ModelSpatial> SPA = new Model<ModelSpatial>(ModelSpatial.class, req);
			//CREAMOS LA SERIE DE PETICIONES
			Spatial ingreso;
			if(_FORM.SPATIAL.POINTS.length() == 1 && _FORM.SPATIAL.LINES.length() == 0){
				JSONObject QSPA = new JSONObject();
				List<Coordinate> lista = new ArrayList<Coordinate>();
				lista.add(new Coordinate(_FORM.SPATIAL.POINTS.getJSONArray(0).getDouble(0), _FORM.SPATIAL.POINTS.getJSONArray(0).getDouble(1)));
				ingreso = new PointType(lista);
				QSPA.put("PROY_X_PROY", _FORM.X_PROY);
				QSPA.put("SPATIAL_OBJECT", req.getSesion().saveTemp(ingreso));
				QSPA.put("ORIGEN", "CHILECOMPRA");
				QSPA.put("SPATIAL_TOOL", _FORM.SPATIAL.SPATIAL_TOOL);
				QSPA.put("KML", kMLFILE);
				System.out.println(QSPA.toString());
				return SPA.insert(QSPA.toString());
				
			}
			else if(_FORM.SPATIAL.POINTS.length() == 0 && _FORM.SPATIAL.LINES.length() == 1){
				JSONObject QSPA = new JSONObject();
				List<Coordinate> lista = new ArrayList<Coordinate>();
				JSONArray temp = _FORM.SPATIAL.LINES.getJSONArray(0);
				for(int k=0; k< temp.length(); k++){
					lista.add(new Coordinate(temp.getJSONArray(k).getDouble(0), temp.getJSONArray(k).getDouble(1)));
				}
				ingreso = new LineType(lista);
				QSPA.put("PROY_X_PROY", _FORM.X_PROY);
				QSPA.put("SPATIAL_OBJECT", req.getSesion().saveTemp(ingreso));
				QSPA.put("ORIGEN", "CHILECOMPRA");
				QSPA.put("SPATIAL_TOOL", _FORM.SPATIAL.SPATIAL_TOOL);
				QSPA.put("KML", kMLFILE);
				System.out.println(QSPA.toString());
				return SPA.insert(QSPA.toString());
			}
			else
			{
				JSONObject QSPA = new JSONObject();
				List<Spatial> lista = new ArrayList<Spatial>();
				for(int k=0; k< _FORM.SPATIAL.POINTS.length(); k++){
					List<Coordinate> aux = new ArrayList<Coordinate>();
					aux.add(new Coordinate(_FORM.SPATIAL.POINTS.getJSONArray(k).getDouble(0), _FORM.SPATIAL.POINTS.getJSONArray(k).getDouble(1)));
					lista.add(new PointType(aux));
				}
				for(int k=0; k< _FORM.SPATIAL.LINES.length(); k++){
					List<Coordinate> aux = new ArrayList<Coordinate>();
					JSONArray temp = _FORM.SPATIAL.LINES.getJSONArray(k);
					for(int j=0; j< temp.length(); j++){
						aux.add(new Coordinate(temp.getJSONArray(j).getDouble(0), temp.getJSONArray(j).getDouble(1)));

					}
					lista.add(new LineType(aux));
				}
				ingreso = new MultiGeometryType(lista);
				QSPA.put("PROY_X_PROY", _FORM.X_PROY);
				QSPA.put("SPATIAL_OBJECT", req.getSesion().saveTemp(ingreso));
				QSPA.put("ORIGEN", "CHILECOMPRA");
				QSPA.put("SPATIAL_TOOL", _FORM.SPATIAL.SPATIAL_TOOL);
				QSPA.put("KML", kMLFILE);
				return SPA.insert(QSPA.toString());
			}
		}
		catch(Error403Exception e){
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO SPATIAL PARA EL PROYECTO "+_FORM.X_PROY+". FASE 8 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO SPATIAL PARA EL PROYECTO "+_FORM.X_PROY+". FASE 8 DE REGISTRO. ERROR: "+e.getMessage());
		} catch (JSONException e) {
			throw new ErrorChileCompraRegException("NO SE HA PODIDO CREAR EL REGISTRO SPATIAL PARA EL PROYECTO "+_FORM.X_PROY+". FASE 8 DE REGISTRO. ERROR: "+e.getMessage());
		} 
	}
	private static void ROLLBACK(ArrayList<Formulario> ROLLBACK){
		for(int i=0; i<ROLLBACK.size(); i++){
			try {
				ROLLBACK.get(i).rollback();
			} catch (ErrorDBDataErrorException e) {
				System.out.println("ERROR AL EJECUTAR ROLLBACK");
			}
		}
	}
}

