package gea.mercadopublico;

import gea.framework.Model;
import gea.framework.ModelResult;
import gea.model.ModelAdjudicacionContrato;
import gea.model.ModelCodigoBIP;
import gea.model.ModelCodigoINI;
import gea.model.ModelComunalComp;
import gea.model.ModelIdsMercadoUnico;
import gea.model.ModelProyectos;
import gea.model.ModelServicio;
import gea.model.ModelSpatial;
import gea.model.ModelTREWAA_EXPEDIENTES;
import gea.model.ModelTREWAA_TA_EXPEDIENTES;
import gea.model.ModelTREWAA_TR_CAMBIOS_EVOLEXPS;
import gea.model.ModelTREWAA_TR_EXPEDIENTES_EN_FASE;
import gea.model.ModelTomaRazon;
import gea.model.ModelUbicacionProyecto;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.ErrorDBDataErrorException;
import gea.utils.Exception.ErrorDBDataNotExistsException;
import gea.utils.Exception.ErrorDateConvertionException;
import gea.utils.Exception.ErrorJSONDataReadException;
import gea.utils.trewautils.Mapeo;
import gea.utils.trewautils.TrewaUtil;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Formulario {
	// PARAMETROS DE LA CLASE
	public String IDMERCADOPUBLICO; // ID MERCADO PUBLmICO
	public String TYPEPROJECT; // TIPO DE PROYECTO: OBRA PUBLICA
	public String TYPECONTRACT; //TIPO DE CONTRATO
	public String TYPEPROCED; // TIPO DE PROCEDIMIENTO LIC PUBLICA, TRATO DIRECTO, PRIVADA
	public String CODSISTRADOC_SERVCONTRATANTE; // CODIGO SISTRADOC SERVICIO CONTRATANTE
	public String CODSISTRADOC_SERVMANDANTE; // CODIGO SISTRADOC SERVICIO MANDANTE
	public String SERVCONTRATANTE; // SERVICIO CONTRATANTE
	public String SERVMANDANTE; // SERVICIO MANDANTE	
	public String SHORTNAME; // NOMBRE CORTO
	public Integer MODCONTRA; // MODALIDAD DE CONTRATACION
	public Integer TFOUNDING; // TIPO DE FINANCIAMIENTO
	public Integer LINE; // LINEA DE CONTRATACION // CAMPO A AGREGAR EN DB
	public String CODBIP; // CODIGO BIP
	public String CODINI; // CODIGO INI
	public Integer CLASIFICACTION; // CLASIFICACION DE LA OBRA
	public Integer SUBCLASIFICATION; // SUBCLASIFICACION DE LA OBRA
	public Integer CAUSEORDER = -1; // CAUSA DE LICITACION
	public Integer SELECTDIRECTDEAL = -1; // SELECTOR DE TRATO DIRECTO 
	public String NORMA; // NORMA    
	public String INIDATE; // FECHA DE INICIO
	public String FINISHDATE; // FECHA DE FIN
	public String CREATEDATE; // FECHA DE CREACION
	public String DEALPROCEDURE; // PROCEDIMIENTO DE CONTRATACION
	public String CAUSAFUND = ""; // CAUSA FUND
	public Integer N_ORDER = 1; // NUMERO DE ADJUDICACION
	public String CREATORUSER = "GEOCGR";
	public MercadoData MERCADO; // DATOS DE LA API DE MERCADO PUBLICO
	public String EXPETREWA; // EXPEDIENTE DE TREWAA
	public Integer X_PROY; // X_PROY
	public JSONArray COMUNA; // COMUNAS
	public Integer X_TORA; // LLAVE DE LA TOMA DE RAZON (SE COMPLETA EN CASO DE EXSITIR)
	public SpatialForm SPATIAL;
	public boolean ASIGNASERVICIOBADEJA=false;
	public RollbackMP ROLLBACK;
	public String FECHAMONTOADJU = null;
	public Long MONTOADJUCLP;
	public String ENTIDAD;
	public String CODIGO_ENTIDAD;
	public Integer ID_ENTIDAD;
	
	
	// GENERAMOS EL CONSTRUCTOR
	public Formulario(JSONObject form, MercadoData mercado) throws ErrorDBDataNotExistsException, ErrorDBDataErrorException, ErrorDateConvertionException, ErrorJSONDataReadException {
		try {
			// FORMATEADORES DE FECHA
			SimpleDateFormat sdf = new SimpleDateFormat("dd-M-yyyy");
			SimpleDateFormat sdf2 = new SimpleDateFormat("M/dd/yyyy");
			SimpleDateFormat sdf3 = new SimpleDateFormat("dd/MM/yyyy");
			// SETEAMOS LOS PARAMETROS
			this.IDMERCADOPUBLICO = mercado.MPSTRING.toUpperCase();
			this.TYPEPROJECT = form.getString("tipo");
			this.TYPECONTRACT = Mapeo.getMapeoS(Mapeo.TIPOCONTRATO, this.TYPEPROJECT);
			this.TYPEPROCED = Mapeo.getMapeoS(Mapeo.PROCEDCONTRATACION, mercado.TIPO);
			this.CODSISTRADOC_SERVCONTRATANTE = obtenerCodigoSistradoc(form.getString("contratante"));
			this.SERVCONTRATANTE = String.valueOf(obtenerIdServicio(form.getString("contratante")));
			this.CODSISTRADOC_SERVMANDANTE = obtenerCodigoSistradoc(form.getString("mandante"));
			this.SERVMANDANTE = String.valueOf(obtenerIdServicio(form.getString("mandante")));
			this.SHORTNAME = form.getString("shortName");
			this.MODCONTRA = form.getInt("modalidad");  
			if(!form.getString("monto_adjudicacion").equals("NOTREQ")) this.MONTOADJUCLP = form.getLong("monto_adjudicacion");
			if(!form.getString("fecha_adjudicacion").equals("NOTREQ")) this.FECHAMONTOADJU = form.getString("fecha_adjudicacion");
			this.TFOUNDING = form.getInt("financiamiento");
			this.LINE = form.getInt("linea");
			this.CODBIP = (form.has("codigobip") && form.has("vcodigobip") && !form.getString("codigobip").equals("") && !form.getString("vcodigobip").equals(""))?form.getString("codigobip")+"-"+form.getString("vcodigobip"):null;
			this.CODINI = (form.has("codigoini") && !form.getString("codigoini").equals(""))?form.getString("codigoini"):null;
			this.CLASIFICACTION = form.getInt("clasificacion");
			this.SUBCLASIFICATION = form.getInt("subclasificacion");
			if("PR".equals(this.TYPEPROCED)) this.CAUSEORDER = form.getInt("licPrivada"); 
			else if("TD".equals(this.TYPEPROCED)) this.CAUSEORDER = form.getInt("tratoDirec");
			this.NORMA = form.getString("fundamento");
			this.INIDATE = getDate(sdf3,sdf,form.getString("inidate"));
			this.FINISHDATE = getDate(sdf3,sdf,form.getString("finishdate"));
			this.CREATEDATE = sdf.format(new Date()); 
			this.COMUNA = form.getJSONArray("comuna");
			this.MERCADO = mercado;
			this.ENTIDAD = form.getString("entidad");
			this.CODIGO_ENTIDAD = form.getString("codigo_entidad");
			this.ID_ENTIDAD = form.getInt("id_entidad");
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			throw new ErrorJSONDataReadException("EXISTE UN ERROR AL LEER LOS DATOS DEL FORMULARIO DE REGISTRO. ERROR: "+e.getMessage());
		} 
	}
	// CODIGO DE SISTRADOC
	private String obtenerCodigoSistradoc(String glsServicio) throws ErrorDBDataNotExistsException, ErrorDBDataErrorException{
		Model<ModelServicio> servicio = new Model<ModelServicio>(ModelServicio.class);
		ModelResult<ModelServicio> resServicio;
		try {
			resServicio = servicio.find("{'SERVICIO':'"+glsServicio+"'}");
			if(resServicio.size() > 0){
				String codigoSistradoc =  resServicio.toJSON().getJSONObject(0).getString("NUMERO");
				return codigoSistradoc;
			}
			else
			{
				throw new ErrorDBDataNotExistsException("BUSQUEDA DE MAPEO ERRONEA: CODIGO DEL SERVICIO "+glsServicio);
			}
		} catch (Error403Exception e) {
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: CODIGO DEL SERVICIO "+glsServicio+". ERROR: "+e.getMessage());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: CODIGO DEL SERVICIO "+glsServicio+". ERROR: "+e.getMessage());
		}
	}
	// OBTENER ID DEL SERVICIO
	private Integer obtenerIdServicio(String glsServicio) throws ErrorDBDataErrorException{
		try {
			String codigoSistradoc =  obtenerCodigoSistradoc(glsServicio);
			TrewaUtil trewaUtil = new TrewaUtil();
			String pkServicioContratante = trewaUtil.obtenerServicioContratante(codigoSistradoc);
			int idServicio =  new Integer(pkServicioContratante).intValue();
			return idServicio;
		} catch (ErrorDBDataNotExistsException e) {
			// TODO Auto-generated catch block
			throw new ErrorDBDataErrorException("ERROR AL BUSCAR ID DEL SERVICIO EN TREWAA: CODIGO DEL SERVICIO "+glsServicio+". ERROR: "+e.getMessage());
		}
	}
	public void getTrewaaExp() throws ErrorDBDataErrorException{
		// CARGAMOS LOS MODELOS DE DATOS
		Model<ModelCodigoBIP> codBIP = new Model<ModelCodigoBIP>(ModelCodigoBIP.class);
		Model<ModelCodigoINI> codINI = new Model<ModelCodigoINI>(ModelCodigoINI.class);
		Model<ModelIdsMercadoUnico> idsMU = new Model<ModelIdsMercadoUnico>(ModelIdsMercadoUnico.class);
		Model<ModelComunalComp> comunas = new Model<ModelComunalComp>(ModelComunalComp.class);
		Model<ModelUbicacionProyecto> ubicProy = new Model<ModelUbicacionProyecto>(ModelUbicacionProyecto.class);
		Model<ModelSpatial> spa = new Model<ModelSpatial>(ModelSpatial.class);
		Model<ModelProyectos> proyecto = new Model<ModelProyectos>(ModelProyectos.class);
		Model<ModelTomaRazon> mTR = new Model<ModelTomaRazon>(ModelTomaRazon.class);
		Model<ModelAdjudicacionContrato> mAC = new Model<ModelAdjudicacionContrato>(ModelAdjudicacionContrato.class);
		// BUSCAR EL ID DE MERCADO PUBLICO
		JSONObject QMERCADO = new JSONObject();
		QMERCADO.put("C_ID_MERC_UNICO",this.IDMERCADOPUBLICO);
		QMERCADO.put("LINEA",this.LINE);
		try {
			ModelResult<ModelIdsMercadoUnico> antiguo = idsMU.find(QMERCADO.toString());
			// CREAMOS LA CONSULTA PARA ELIMINAR
			if(antiguo.size() > 0){
				JSONArray resultados = antiguo.toJSON();
				for(int k=0; k< resultados.length(); k++){
					JSONObject expediente = resultados.getJSONObject(k);
					this.X_PROY = expediente.getInt("PROY_X_PROY");
					this.ROLLBACK = new RollbackMP(this.X_PROY);
					JSONObject GEOQUERY = new JSONObject();
					GEOQUERY.put("PROY_X_PROY", this.X_PROY);
					JSONObject PROYQUERY = new JSONObject();
					PROYQUERY.put("X_PROY", this.X_PROY);
					// BUSCAMOS LOS PROYECTOS ANTERIORES Y LOS BORRAMOS
					ModelResult<ModelProyectos> old = proyecto.find(PROYQUERY.toString());
					this.EXPETREWA = old.toJSON().getJSONObject(0).getString("EXPE_X_EXPE_TREWA");
					this.delFromGeo();
				}
			}
			else
			{
				TrewaUtil trewaUtil = new TrewaUtil();
				this.EXPETREWA = trewaUtil.creacionContratoCambioEtapa(this.TYPECONTRACT, this.MERCADO.TITULOPROY, this.CODSISTRADOC_SERVMANDANTE);
				this.ASIGNASERVICIOBADEJA = trewaUtil.asignaservicioBandeja(this.CODSISTRADOC_SERVCONTRATANTE, this.EXPETREWA);
				if(!this.ASIGNASERVICIOBADEJA)
				{
					throw new ErrorDBDataErrorException("NO FUE POSIBLE ASIGNAR EL SERVICIO CONTRATANTE ("+ this.SERVCONTRATANTE +" ) al expediente " + this.EXPETREWA);
				}
			}
		} catch (Error403Exception e) {
			// TODO Auto-generated catch block
			throw new ErrorDBDataErrorException("ERROR CREACION DE EXPEDIENTE TREWA: CODIGO MERCADO PUBLICO "+this.IDMERCADOPUBLICO+". ERROR: "+e.getMessage());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			throw new ErrorDBDataErrorException("ERROR CREACION DE EXPEDIENTE TREWA: CODIGO MERCADO PUBLICO "+this.IDMERCADOPUBLICO+". ERROR: "+e.getMessage());
		}
	}
	private boolean delFromGeo() throws ErrorDBDataErrorException{
		// CARGAMOS LOS PARAMETROS
		if(this.X_PROY != null){
			JSONObject GEOQUERY = new JSONObject();
			GEOQUERY.put("PROY_X_PROY", this.X_PROY);
			JSONObject PROYQUERY = new JSONObject();
			PROYQUERY.put("X_PROY", this.X_PROY);
			// CARGAMOS LOS MODELOS DE DATOS
			Model<ModelCodigoBIP> codBIP = new Model<ModelCodigoBIP>(ModelCodigoBIP.class);
			Model<ModelCodigoINI> codINI = new Model<ModelCodigoINI>(ModelCodigoINI.class);
			Model<ModelIdsMercadoUnico> idsMU = new Model<ModelIdsMercadoUnico>(ModelIdsMercadoUnico.class);
			Model<ModelComunalComp> comunas = new Model<ModelComunalComp>(ModelComunalComp.class);
			Model<ModelUbicacionProyecto> ubicProy = new Model<ModelUbicacionProyecto>(ModelUbicacionProyecto.class);
			Model<ModelSpatial> spa = new Model<ModelSpatial>(ModelSpatial.class);
			Model<ModelProyectos> proyecto = new Model<ModelProyectos>(ModelProyectos.class);
			Model<ModelTomaRazon> mTR = new Model<ModelTomaRazon>(ModelTomaRazon.class);
			Model<ModelAdjudicacionContrato> mAC = new Model<ModelAdjudicacionContrato>(ModelAdjudicacionContrato.class);
			try {
				codBIP.delete(GEOQUERY.toString());
				codINI.delete(GEOQUERY.toString());
				idsMU.delete(GEOQUERY.toString());
				spa.delete(GEOQUERY.toString());
				ubicProy.delete(GEOQUERY.toString());
				mAC.delete(GEOQUERY.toString());
				mTR.delete(GEOQUERY.toString());
				proyecto.delete(PROYQUERY.toString());
				this.X_PROY = null;
				return true;
			} catch (Error403Exception e) {
				throw new ErrorDBDataErrorException("ERROR AL ELIMINAR REGISTROS DE DB GEO: CODIGO DE PROYECTO "+PROYQUERY.toString()+". ERROR: "+e.getMessage());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				throw new ErrorDBDataErrorException("ERROR AL ELEIMINAR REGISTROS DE DB GEO: CODIGO DE PROYECTO "+PROYQUERY.toString()+". ERROR: "+e.getMessage());
			}
		}
		else{
			return false;
		}
	}
	public boolean verifyAllData(){
		if(IDMERCADOPUBLICO != null && // ID MERCADO PUBLICO
		TYPEPROJECT != null && // TIPO DE PROYECTO: OBRA PUBLICA
		TYPECONTRACT != null && // TIPO DE CONTRATO
		CODSISTRADOC_SERVCONTRATANTE != null && // CODIGO SISTRADOC SERVICIO CONTRATANTE
		CODSISTRADOC_SERVMANDANTE != null && // CODIGO SISTRADOC SERVICIO CONTRATANTE
		SERVCONTRATANTE != null && // SERVICIO CONTRATANTE
		SERVMANDANTE != null && // SERVICIO MANDANTE	
		SHORTNAME != null && // NOMBRE CORTO
		MODCONTRA != null && // MODALIDAD DE CONTRATACION
		TFOUNDING != null && // TIPO DE FINANCIAMIENTO
		LINE != null && // LINEA DE CONTRATACION
		CLASIFICACTION != null && // CLASIFICACION DE LA OBRA
		SUBCLASIFICATION != null && // SUBCLASIFICACION DE LA OBRA
		CAUSEORDER != null && // CAUSA DE LICITACION
		NORMA != null && // NORMA    
		INIDATE != null && // FECHA DE INICIO
		FINISHDATE != null && // FECHA DE FIN
		CREATEDATE != null && // FECHA DE CREACION
		MERCADO != null && // MERCADO
		COMUNA != null){ //COMUNA
			return true;// DATOS DE LA API DE MERCADO PUBLICO)
		}
		else
		{
			return false;
		}
	}
	private String getDate(SimpleDateFormat format1, SimpleDateFormat format2, String date) throws ErrorDateConvertionException{
		try {
			return format2.format(format1.parse(date));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			throw new ErrorDateConvertionException("ERROR AL CONVERTIR LAS FECHAS EN EL FORMATO ADECUADO. ERROR: "+e.getMessage());
		}
	}
	private boolean delFromTrewaa() throws ErrorDBDataErrorException{
		// CARGAMOS LOS MODELOS DE DATOS
		if(this.EXPETREWA != null){
			Model<ModelTREWAA_EXPEDIENTES> EXPE = new Model<ModelTREWAA_EXPEDIENTES>(ModelTREWAA_EXPEDIENTES.class);
			Model<ModelTREWAA_TR_EXPEDIENTES_EN_FASE> EXPEFASE = new Model<ModelTREWAA_TR_EXPEDIENTES_EN_FASE>(ModelTREWAA_TR_EXPEDIENTES_EN_FASE.class);
			Model<ModelTREWAA_TA_EXPEDIENTES> TAREAFASE = new Model<ModelTREWAA_TA_EXPEDIENTES>(ModelTREWAA_TA_EXPEDIENTES.class);
			Model<ModelTREWAA_TR_CAMBIOS_EVOLEXPS> CAMBIOS = new Model<ModelTREWAA_TR_CAMBIOS_EVOLEXPS>(ModelTREWAA_TR_CAMBIOS_EVOLEXPS.class);
			JSONObject Equery = new JSONObject();
			Equery.put("EXPE_X_EXPE", this.EXPETREWA);
			JSONObject Tquery = new JSONObject();
			Tquery.put("X_EXPE", this.EXPETREWA);
			try {
				TAREAFASE.delete(Equery.toString());
				CAMBIOS.delete(Equery.toString());
				EXPEFASE.delete(Equery.toString());
				EXPE.delete(Tquery.toString());
				return true;
			} catch (Error403Exception e) {
				throw new ErrorDBDataErrorException("ERROR AL ELIMINAR REGISTROS DE DB TREWAA: CODIGO DE PROYECTO "+this.EXPETREWA+". ERROR: "+e.getMessage());
			} catch (IOException e) {
				throw new ErrorDBDataErrorException("ERROR AL ELIMINAR REGISTROS DE DB TREWAA: CODIGO DE TREWAA "+this.EXPETREWA+". ERROR: "+e.getMessage());
			}
			
		}
		else
		{
			return false;
		}
	}
	public void rollback() throws ErrorDBDataErrorException{
		if(ROLLBACK.isNEWREG()){
			if(this.delFromGeo()){
				this.delFromTrewaa();
			}
		}else{
			if(this.delFromGeo()){
				ROLLBACK.rollback();
			}
		}
		
	}
	public void setSPATIAL(JSONObject spatial){
		this.SPATIAL = new SpatialForm(spatial);
	}
	public void GENERATE_X_PROY() throws ErrorDBDataErrorException{
		// CARGAMOS LOS MODELOS DE DATOS
		Model<ModelProyectos> PROYECTO = new Model<ModelProyectos>(ModelProyectos.class);
		try {
			this.X_PROY = PROYECTO.getNextVal("SEQ_GEO_PROYECTOS");
		} catch (IllegalAccessException e) {
			throw new ErrorDBDataErrorException("ERROR AL GENERAR EL CODIGO DEL PROYECTO. "+this.EXPETREWA+". ERROR: "+e.getMessage());
		} catch (Error403Exception e) {
			throw new ErrorDBDataErrorException("ERROR AL GENERAR EL CODIGO DEL PROYECTO. "+this.EXPETREWA+". ERROR: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorDBDataErrorException("ERROR AL GENERAR EL CODIGO DEL PROYECTO. "+this.EXPETREWA+". ERROR: "+e.getMessage());
		}
	}
}
