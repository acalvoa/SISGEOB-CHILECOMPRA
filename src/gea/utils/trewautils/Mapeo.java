package gea.utils.trewautils;

import gea.framework.Model;
import gea.framework.ModelResult;
import gea.model.ModelMapeoParametros;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.ErrorDBDataErrorException;
import gea.utils.Exception.ErrorDBDataNotExistsException;

import java.io.IOException;

public class Mapeo {

	public static final int TIPODOCUMENTO = 1;
	public static final int TOMARAZON = 2;
	public static final int TDOCHILECOMPRA = 3;
	public static final int FORMATOFECHACHILECOMPRA = 4;
	public static final int FORMATOFECHAINTERNO = 5;
	public static final int UNIDADTIEMPO = 6;
	public static final int UNIDADMONEDA = 7;
	public static final int PROCEDCONTRATACION = 8;
	public static final int TIPOCONTRATO = 9;

	public static String getMapeoS(int codigo, String codMapeo) throws ErrorDBDataNotExistsException, ErrorDBDataErrorException{
		Model<ModelMapeoParametros> mp = new Model<ModelMapeoParametros>(ModelMapeoParametros.class);
		ModelResult<ModelMapeoParametros> resMapeo;
		String glsMapeo = null;
		try {
			resMapeo = mp.find("{'CODIGO':'"+codigo+"','VALORIGEN':'"+codMapeo+"'}");
			if(resMapeo.size() > 0){
				glsMapeo =  resMapeo.toJSON().getJSONObject(0).getString("VALDESTINO");
			}
			else{
				throw new ErrorDBDataNotExistsException("BUSQUEDA DE MAPEO ERRONEA: MAPA "+codigo+" Y CODIGO DE ORIGEN: "+codMapeo);
			}
		} catch (Error403Exception e) {
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: MAPA "+codigo+" Y CODIGO DE ORIGEN "+codMapeo+". Error: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: MAPA "+codigo+" Y CODIGO DE ORIGEN: "+codMapeo+". Error: "+e.getMessage());
		}
		return glsMapeo;
	}
	
	public static String getMapeoInversoS(int codigo, String codMapeo) throws ErrorDBDataNotExistsException, ErrorDBDataErrorException{
		Model<ModelMapeoParametros> mp = new Model<ModelMapeoParametros>(ModelMapeoParametros.class);
		ModelResult<ModelMapeoParametros> resMapeo;
		String glsMapeo = null;
		try {
			resMapeo = mp.find("{'CODIGO':'"+codigo+"','VALDESTINO':'"+codMapeo+"'}");
			if(resMapeo.size() > 0){
				glsMapeo =  resMapeo.toJSON().getJSONObject(0).getString("VALORIGEN");
			}
			else{
				throw new ErrorDBDataNotExistsException("BUSQUEDA DE MAPEO ERRONEA: MAPA "+codigo+" Y CODIGO DE ORIGEN: "+codMapeo);
			}
		} catch (Error403Exception e) {
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: MAPA "+codigo+" Y CODIGO DE ORIGEN "+codMapeo+". Error: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: MAPA "+codigo+" Y CODIGO DE ORIGEN: "+codMapeo+". Error: "+e.getMessage());
		}
		return glsMapeo;
	}
	
	public static int getMapeoI(int codigo, String codMapeo) throws ErrorDBDataNotExistsException, ErrorDBDataErrorException{
		Model<ModelMapeoParametros> mp = new Model<ModelMapeoParametros>(ModelMapeoParametros.class);
		ModelResult<ModelMapeoParametros> resMapeo;
		Integer idMapeo = null;
		try {
			resMapeo = mp.find("{'CODIGO':'"+codigo+"','VALORIGEN':'"+codMapeo+"'}");
			if(resMapeo.size() > 0){
				idMapeo =  new Integer(resMapeo.toJSON().getJSONObject(0).getString("VALDESTINO")).intValue();
			}
			else{
				throw new ErrorDBDataNotExistsException("BUSQUEDA DE MAPEO ERRONEA: MAPA "+codigo+" Y CODIGO DE ORIGEN: "+codMapeo);
			}
		} catch (Error403Exception e) {
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: MAPA "+codigo+" Y CODIGO DE ORIGEN "+codMapeo+". Error: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: MAPA "+codigo+" Y CODIGO DE ORIGEN "+codMapeo+". Error: "+e.getMessage());
		}
		return idMapeo;
	}
	
	public static int getMapeoInversoI(int codigo, String codMapeo) throws ErrorDBDataNotExistsException, ErrorDBDataErrorException{
		Model<ModelMapeoParametros> mp = new Model<ModelMapeoParametros>(ModelMapeoParametros.class);
		ModelResult<ModelMapeoParametros> resMapeo;
		Integer idMapeo = null;
		try {
			resMapeo = mp.find("{'CODIGO':'"+codigo+"','VALDESTINO':'"+codMapeo+"'}");
			if(resMapeo.size() > 0){
				idMapeo =  new Integer(resMapeo.toJSON().getJSONObject(0).getString("VALORIGEN")).intValue();
			}
			else{
				throw new ErrorDBDataNotExistsException("BUSQUEDA DE MAPEO ERRONEA: MAPA "+codigo+" Y CODIGO DE ORIGEN: "+codMapeo);
			}
		} catch (Error403Exception e) {
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: MAPA "+codigo+" Y CODIGO DE ORIGEN "+codMapeo+". Error: "+e.getMessage());
		} catch (IOException e) {
			throw new ErrorDBDataErrorException("ERROR EN BUSQUEDA DB: MAPA "+codigo+" Y CODIGO DE ORIGEN "+codMapeo+". Error: "+e.getMessage());
		}
		return idMapeo;
	}
}
