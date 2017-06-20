package gea.mercadopublico;

import java.io.IOException;

import gea.framework.Model;
import gea.model.ModelAdjudicacionContrato;
import gea.model.ModelCodigoBIP;
import gea.model.ModelCodigoINI;
import gea.model.ModelComunalComp;
import gea.model.ModelIdsMercadoUnico;
import gea.model.ModelProyectos;
import gea.model.ModelSpatial;
import gea.model.ModelTomaRazon;
import gea.model.ModelUbicacionProyecto;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.ErrorDBDataErrorException;

import org.json.JSONArray;
import org.json.JSONObject;

public class RollbackMP {
	// ROLLBACK MP
	JSONObject BIP = null;
	JSONObject INI = null;
	JSONObject IDMPUB = null;
	JSONArray UBIPROY = null;
	JSONObject SPA = null;
	JSONObject PROYECTO = null;
	JSONObject TOMARAZON = null;
	JSONObject ADJUDICACION = null;
	Integer X_PROY;
	// VARIABLE QUE DETERMINA SI ES UN REGISTRO NUEVO
	boolean NEWREG = true;
	// GENERAMOS EL CONSTRUCTOR
	public RollbackMP(int X_PROY) throws ErrorDBDataErrorException {
		this.X_PROY = X_PROY;
		// ROLLBACK GUARDADO
		JSONObject GEOQUERY = new JSONObject();
		GEOQUERY.put("PROY_X_PROY", X_PROY);
		JSONObject PROYQUERY = new JSONObject();
		PROYQUERY.put("X_PROY", X_PROY);
		// GENERAMOS LOS MODELOS DE DATOS
		Model<ModelCodigoBIP> codBIP = new Model<ModelCodigoBIP>(ModelCodigoBIP.class);
		Model<ModelCodigoINI> codINI = new Model<ModelCodigoINI>(ModelCodigoINI.class);
		Model<ModelIdsMercadoUnico> idsMU = new Model<ModelIdsMercadoUnico>(ModelIdsMercadoUnico.class);
		Model<ModelUbicacionProyecto> ubicProy = new Model<ModelUbicacionProyecto>(ModelUbicacionProyecto.class);
		Model<ModelSpatial> spa = new Model<ModelSpatial>(ModelSpatial.class);
		Model<ModelProyectos> proyecto = new Model<ModelProyectos>(ModelProyectos.class);
		Model<ModelTomaRazon> mTR = new Model<ModelTomaRazon>(ModelTomaRazon.class);
		Model<ModelAdjudicacionContrato> mAC = new Model<ModelAdjudicacionContrato>(ModelAdjudicacionContrato.class);
		// GENERAMOS LAS RESPUESTAS
		try {
			JSONArray BIP = codBIP.find(GEOQUERY.toString()).toJSON();
			JSONArray INI = codINI.find(GEOQUERY.toString()).toJSON();
			JSONArray IDMPUB = idsMU.find(GEOQUERY.toString()).toJSON();
			JSONArray UBIPROY = ubicProy.find(GEOQUERY.toString()).toJSON();
			JSONArray SPA = spa.find(GEOQUERY.toString()).toJSON();
			JSONArray PROYECTO = proyecto.find(PROYQUERY.toString()).toJSON();
			JSONArray TOMARAZON = mTR.find(GEOQUERY.toString()).toJSON();
			JSONArray ADJUDICACION = mAC.find(GEOQUERY.toString()).toJSON();
			//GUARDAMOS LOS REGISTROS
			if(BIP.length() > 0) this.BIP = BIP.getJSONObject(0); this.NEWREG = false;
			if(INI.length() > 0) this.INI = INI.getJSONObject(0); this.NEWREG = false;
			if(IDMPUB.length() > 0) this.IDMPUB = IDMPUB.getJSONObject(0); this.NEWREG = false;
			if(UBIPROY.length() > 0) this.UBIPROY = UBIPROY; this.NEWREG = false;
			if(SPA.length() > 0) this.SPA = SPA.getJSONObject(0); this.NEWREG = false;
			if(PROYECTO.length() > 0) this.PROYECTO = PROYECTO.getJSONObject(0); this.NEWREG = false;
			if(TOMARAZON.length() > 0) this.TOMARAZON = TOMARAZON.getJSONObject(0); this.NEWREG = false;
			if(ADJUDICACION.length() > 0) this.ADJUDICACION = ADJUDICACION.getJSONObject(0); this.NEWREG = false;
		} catch (Error403Exception e) {
			JSONObject error = new JSONObject();
			error.put("BIP", this.BIP);
			error.put("INI", this.INI);
			error.put("IDMPUB", this.IDMPUB);
			error.put("UBIPROY", this.UBIPROY);
			error.put("SPA", this.SPA);
			error.put("PROYECTO", this.PROYECTO);
			error.put("TOMARAZON", this.TOMARAZON);
			error.put("ADJUDICACION", this.ADJUDICACION);
			// RETORNAMOS LA EXCEPTION
			throw new ErrorDBDataErrorException("EXISTIO UN ERROR AL GUARDAR LOS DATOS DE ROLLBACK DEL REGISTRO "+X_PROY+" EN LA LICITACION " + this.IDMPUB , error);
		} catch (IOException e) {
			JSONObject error = new JSONObject();
			error.put("BIP", this.BIP);
			error.put("INI", this.INI);
			error.put("IDMPUB", this.IDMPUB);
			error.put("UBIPROY", this.UBIPROY);
			error.put("SPA", this.SPA);
			error.put("PROYECTO", this.PROYECTO);
			error.put("TOMARAZON", this.TOMARAZON);
			error.put("ADJUDICACION", this.ADJUDICACION);
			// RETORNAMOS LA EXCEPTION
			throw new ErrorDBDataErrorException("EXISTIO UN ERROR AL GUARDAR LOS DATOS DE ROLLBACK DEL REGISTRO "+X_PROY+" EN LA LICITACION " + this.IDMPUB,error);
		}
	}
	public boolean isNEWREG() {
		return NEWREG;
	}
	public void rollback() throws ErrorDBDataErrorException{
		// GENERAMOS LOS MODELOS DE DATOS
		Model<ModelCodigoBIP> BIP = new Model<ModelCodigoBIP>(ModelCodigoBIP.class);
		Model<ModelCodigoINI> INI = new Model<ModelCodigoINI>(ModelCodigoINI.class);
		Model<ModelIdsMercadoUnico>IDMPUB = new Model<ModelIdsMercadoUnico>(ModelIdsMercadoUnico.class);
		Model<ModelUbicacionProyecto> UBIPROY = new Model<ModelUbicacionProyecto>(ModelUbicacionProyecto.class);
		Model<ModelSpatial> SPA = new Model<ModelSpatial>(ModelSpatial.class);
		Model<ModelProyectos> PROYECTO = new Model<ModelProyectos>(ModelProyectos.class);
		Model<ModelTomaRazon> TOMARAZON = new Model<ModelTomaRazon>(ModelTomaRazon.class);
		Model<ModelAdjudicacionContrato> ADJUDICACION = new Model<ModelAdjudicacionContrato>(ModelAdjudicacionContrato.class);
		//GENERAMOS EL ROLLBACK
		try {
			if(this.PROYECTO != null) PROYECTO.insert(this.PROYECTO.toString());
			if(this.BIP != null) BIP.insert(this.BIP.toString());
			if(this.INI != null) INI.insert(this.INI.toString());
			if(this.IDMPUB != null) IDMPUB.insert(this.IDMPUB.toString());
			if(this.UBIPROY != null){
				for(int i=0; i<this.UBIPROY.length(); i++){
					 UBIPROY.insert(this.UBIPROY.getJSONObject(i).toString());
				}
			}
			if(this.TOMARAZON != null) TOMARAZON.insert(this.TOMARAZON.toString());
			if(this.ADJUDICACION != null) ADJUDICACION.insert(this.ADJUDICACION.toString());
			if(this.SPA != null) SPA.insert(this.SPA.toString());
		} catch (Error403Exception e) {
			// TODO Auto-generated catch block
			throw new ErrorDBDataErrorException("EXISTIO UN ERROR EJECUTAR EL ROLLBACK DEL REG "+this.X_PROY);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			throw new ErrorDBDataErrorException("EXISTIO UN ERROR EJECUTAR EL ROLLBACK DEL REG "+this.X_PROY);
		}
	}
}
