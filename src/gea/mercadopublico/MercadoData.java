package gea.mercadopublico;

import java.io.IOException;

import gea.utils.Exception.ErrorDBDataErrorException;
import gea.utils.Exception.ErrorDBDataNotExistsException;
import gea.utils.Exception.ErrorJSONDataReadException;
import gea.utils.Exception.ErrorReadServiceException;
import gea.utils.trewautils.Mapeo;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MercadoData {
	public String DESCRIPCION;
	public Integer TOMARAZON;
	public Integer PLAZOBRA;
	public Integer UNIDATIEMPO;
	public Integer MONEDA;
	public String TIPO;
	public JSONArray ITEMS;
	public String TITULOPROY;
	public String CODIGOMP;
	public String PROCECONTRATACION;
	public String TIPODOC;
	public String MPSTRING;
	public String MONTOESTIMADO;
	// GENERAMOS EL CONSTRUCTOR
	public MercadoData(String idMP) throws ErrorJSONDataReadException, ErrorReadServiceException, ErrorDBDataNotExistsException, ErrorDBDataErrorException{
		try {
			MercadoPublico mercado = new MercadoPublico(idMP);
			JSONObject data = mercado.principal();
			this.MPSTRING = idMP;
			this.TITULOPROY = data.getString("NOMBRE");
			this.DESCRIPCION = data.getString("DESCRIPCION");
			this.CODIGOMP = data.getString("CODIGOEXTERNO");
			this.PLAZOBRA = data.getInt("PLAZOBRA");
			this.PROCECONTRATACION = Mapeo.getMapeoS(Mapeo.PROCEDCONTRATACION,  data.getString("TIPO"));
			String tomarazon = Mapeo.getMapeoS(Mapeo.TIPODOCUMENTO, data.getString("TOMARAZON"));
			this.TIPODOC = tomarazon;
			this.TOMARAZON = Mapeo.getMapeoI(Mapeo.TOMARAZON,tomarazon);
			this.UNIDATIEMPO = Mapeo.getMapeoI(Mapeo.UNIDADTIEMPO,String.valueOf(data.getInt("UNIDATIEMPO")));
			this.MONEDA = Mapeo.getMapeoI(Mapeo.UNIDADMONEDA,data.getString("MONEDA"));
			this.TIPO = data.getString("TIPO");
			this.ITEMS = data.getJSONArray("ITEMS");
		} catch (JSONException e) {
			throw new ErrorJSONDataReadException(e.getMessage());
		} catch (IOException e) {
			throw new ErrorReadServiceException(e.getMessage());
		}
	}
	public boolean verifyData(){
		if(DESCRIPCION != null && TOMARAZON != null 
			&& PLAZOBRA != null 
			&& UNIDATIEMPO != null && MONEDA != null 
			&& TIPO != null && ITEMS != null 
			&&  TITULOPROY != null && CODIGOMP != null
			&& PROCECONTRATACION != null && TIPODOC != null){
			return true;
		}
		else{
			return false;
		}
	}
}
