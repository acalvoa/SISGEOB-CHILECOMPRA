package gea.mercadopublico;

import java.io.IOException;

import gea.utils.Exception.ErrorDBDataErrorException;
import gea.utils.Exception.ErrorDBDataNotExistsException;
import gea.utils.trewautils.Mapeo;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class OCData  implements MPData{
    // DEFINIMOS TODAS LAS PROPIEDADES PRESENTES EN EL OBJETO JSON
	public String CODIGO_MP;
	public String PAIS;
	public String TIPO_MONEDA;
	public String TIPO_JUSTIFICACION;
    public int CODIGO_TIPO;
    public int TIENE_ITEMS;
    public int DESCUENTOS;
    public JSONObject REQUERIMIENTOS_ENTREGA;
    public double PROMEDIO_CALIFICACION;
    public String TIPO_ORDEN_COMPRA;
    public int IMPUESTOS;
    public String NOMBRE;
    public OCDatosPago DATOS_PAGO;
    public String CODIGO_LICITACION;
    public JSONObject DATOS_APROBACIONES;
    public JSONObject PAC_ASOSICADOS;
    public int CODIGO_ESTADO;
    public String ESTADO_PROVEEDOR;
    public OCProveedor PROVEEDOR;
    public OCItems[] ITEMS;
    public int TOTAL_NETO;
    public String OBSERVACIONES_DESCUENTO;
    public String OBSERVACIONES_CARGOS;
    public JSONObject DOCUMENTOS_ANEXOS;
    public int CANTIDA_DE_VALUACION;
    public int PORCENTAJE_IVA;
    public String FINANCIAMIENTO;
    public int CODIGO_TIPO_JUSTIFICACION;
    public int ES_OBRA_PUBLICA;
    public String DESCRIPCION;
    public OCComprador COMPRADOR;
    public String ESTADO;
    public String TIPO;
    public String FECHA_ULTIMA_MODIFICACION;
    public String FECHA_CREACION;
    public String FECHA_ACEPTACION;
    public String FECHA_CANCELACION;
    public String FECHA_ENVIO;
    public int CODIGO_ESTADO_PROVEEDOR;
    public OCAutorizador[] AUTORIZADORES_ORDEN_COMPRA;
    public String ID_COMPROMISO;
    public int CARGOS;
    public int TOTAL;
    public JSONObject COTIZACIONES;
    //EL OBJETO JSON EN SU TOTALIDAD
    public JSONObject Jobject;
	public String PROCECONTRATACION;
	public String TIPODOC;
	public int TOMARAZON;
	public int UNIDATIEMPO;
	public int MONEDA;
    //DEFINIMOS EL CONSTRUCTOR
    public OCData(JSONObject data){
        this.Jobject = data;
        if(data.has("Codigo") && !data.isNull("Codigo")) this.CODIGO_MP = data.getString("Codigo");
        if(data.has("Pais") && !data.isNull("Pais")) this.PAIS = data.getString("Pais");
        if(data.has("TipoMoneda") && !data.isNull("TipoMoneda")) this.TIPO_MONEDA = data.getString("TipoMoneda");
        if(data.has("TipoJustificacion") && !data.isNull("TipoJustificacion")) this.TIPO_JUSTIFICACION = data.getString("TipoJustificacion");
        if(data.has("CodigoTipo") && !data.isNull("CodigoTipo")) this.CODIGO_TIPO = data.getInt("CodigoTipo");
        if(data.has("TieneItems") && !data.isNull("TieneItems")) this.TIENE_ITEMS = data.getInt("TieneItems");
        if(data.has("Descuentos") && !data.isNull("Descuentos")) this.DESCUENTOS = data.getInt("Descuentos");
        if(data.has("RequerimientosEntrega") && !data.isNull("RequerimientosEntrega")) this.REQUERIMIENTOS_ENTREGA = data.getJSONObject("RequerimientosEntrega");
        if(data.has("PromedioCalificacion") && !data.isNull("PromedioCalificacion")) this.PROMEDIO_CALIFICACION = data.getDouble("PromedioCalificacion");
        if(data.has("TipoOrdenCompra") && !data.isNull("TipoOrdenCompra")) this.TIPO_ORDEN_COMPRA = data.getString("TipoOrdenCompra");
        if(data.has("Impuestos") && !data.isNull("Impuestos")) this.IMPUESTOS = data.getInt("Impuestos");
        if(data.has("Nombre") && !data.isNull("Nombre")) this.NOMBRE = data.getString("Nombre");
        if(data.has("DatosPago") && !data.isNull("DatosPago")) this.DATOS_PAGO = new OCDatosPago(data.getJSONObject("DatosPago"));
        if(data.has("CodigoLicitacion") && !data.isNull("CodigoLicitacion")) this.CODIGO_LICITACION = data.getString("CodigoLicitacion");
        if(data.has("DatosAprobaciones") && !data.isNull("DatosAprobaciones")) this.DATOS_APROBACIONES = data.getJSONObject("DatosAprobaciones");
        if(data.has("PacAsociados") && !data.isNull("PacAsociados")) this.PAC_ASOSICADOS = data.getJSONObject("PacAsociados");
        if(data.has("CodigoEstado") && !data.isNull("CodigoEstado")) this.CODIGO_ESTADO = data.getInt("CodigoEstado");
        //
        if(data.has("EstadoProveedor") && !data.isNull("EstadoProveedor")) this.ESTADO_PROVEEDOR = data.getString("EstadoProveedor");
        if(data.has("Proveedor") && !data.isNull("Proveedor")) this.PROVEEDOR = new OCProveedor(data.getJSONObject("Proveedor"));
        if(data.has("Items") && !data.isNull("Items")){
        	JSONArray items = data.getJSONObject("Items").getJSONArray("Listado");
        	this.ITEMS = new OCItems[items.length()];
        	for(int i=0; i<items.length();i++){
        		this.ITEMS[i] = new OCItems(items.getJSONObject(i));
        	}
        }
        if(data.has("TotalNeto") && !data.isNull("TotalNeto")) this.TOTAL_NETO = data.getInt("TotalNeto");
        if(data.has("ObservacionesDescuento") && !data.isNull("ObservacionesDescuento")) this.OBSERVACIONES_DESCUENTO = data.getString("ObservacionesDescuento");
        if(data.has("ObservacionesCargos") && !data.isNull("ObservacionesCargos")) this.OBSERVACIONES_CARGOS = data.getString("ObservacionesCargos");
        if(data.has("DocumentosAnexos") && !data.isNull("DocumentosAnexos")) this.DOCUMENTOS_ANEXOS = data.getJSONObject("DocumentosAnexos");
        if(data.has("CantidadEvaluacion") && !data.isNull("CantidadEvaluacion")) this.CANTIDA_DE_VALUACION = data.getInt("CantidadEvaluacion");
        if(data.has("PorcentajeIva") && !data.isNull("PorcentajeIva")) this.PORCENTAJE_IVA = data.getInt("PorcentajeIva");
        if(data.has("Financiamiento") && !data.isNull("Financiamiento")) this.FINANCIAMIENTO = data.getString("Financiamiento");
        if(data.has("CodigoTipoJustificacion") && !data.isNull("CodigoTipoJustificacion")) this.CODIGO_TIPO_JUSTIFICACION = data.getInt("CodigoTipoJustificacion");
        if(data.has("EsObraPublica") && !data.isNull("EsObraPublica")) this.ES_OBRA_PUBLICA = data.getInt("EsObraPublica");
        if(data.has("Descripcion") && !data.isNull("Descripcion")) this.DESCRIPCION = data.getString("Descripcion");
        if(data.has("Comprador") && !data.isNull("Comprados")) this.COMPRADOR = new OCComprador(data.getJSONObject("Comprador"));
        if(data.has("Estado") && !data.isNull("Estado")) this.ESTADO = data.getString("Estado");
        if(data.has("Tipo") && !data.isNull("Tipo")) this.TIPO = data.getString("Tipo");
        if(data.has("Fechas") && data.getJSONObject("Fechas").has("FechaUltimaModificacion") && !data.getJSONObject("Fechas").isNull("FechaUltimaModificacion")) this.FECHA_ULTIMA_MODIFICACION = data.getJSONObject("Fechas").getString("FechaUltimaModificacion");
        if(data.has("Fechas") && data.getJSONObject("Fechas").has("FechaEnvio") && !data.getJSONObject("Fechas").isNull("FechaEnvio")) this.FECHA_ENVIO= data.getJSONObject("Fechas").getString("FechaEnvio");
        if(data.has("Fechas") && data.getJSONObject("Fechas").has("FechaAceptacion") && !data.getJSONObject("Fechas").isNull("FechaAceptacion")) this.FECHA_ACEPTACION = data.getJSONObject("Fechas").getString("FechaAceptacion");
        if(data.has("Fechas") && data.getJSONObject("Fechas").has("FechaCancelacion") && !data.getJSONObject("Fechas").isNull("FechaCancelacion")) this.FECHA_CANCELACION = data.getJSONObject("Fechas").getString("FechaCancelacion");
        if(data.has("Fechas") && data.getJSONObject("Fechas").has("FechaCreacion") && !data.getJSONObject("Fechas").isNull("FechaCreacion")) this.FECHA_CREACION = data.getJSONObject("Fechas").getString("FechaCreacion");
        if(data.has("CodigoEstadoProveedor") && !data.isNull("CodigoEstadoProveedor")) this.CODIGO_ESTADO_PROVEEDOR = data.getInt("CodigoEstadoProveedor");
        if(data.has("AutorizadoresOrdenCompra") && !data.isNull("AutorizadoresOrdenCompra")){
        	JSONArray items = data.getJSONObject("AutorizadoresOrdenCompra").getJSONArray("Listado");
        	this.AUTORIZADORES_ORDEN_COMPRA = new OCAutorizador[items.length()];
        	for(int i=0; i<items.length();i++){
        		this.AUTORIZADORES_ORDEN_COMPRA[i] = new OCAutorizador(items.getJSONObject(i));
        	}
        }
        if(data.has("IdCompromiso") && !data.isNull("IdCompromiso")) this.ID_COMPROMISO = data.getString("IdCompromiso");
        if(data.has("Cargos") && !data.isNull("Cargos")) this.CARGOS = data.getInt("Cargos");
        if(data.has("Total") && !data.isNull("Total")) this.TOTAL = data.getInt("Total");
        if(data.has("Cotizaciones") && !data.isNull("Cotizaciones")) this.COTIZACIONES = data.getJSONObject("Cotizaciones");
        try {
			this.PROCECONTRATACION = Mapeo.getMapeoS(Mapeo.PROCEDCONTRATACION,  this.TIPO);
			String tomarazon = Mapeo.getMapeoS(Mapeo.TIPODOCUMENTO, String.valueOf(0));
			this.TIPODOC = tomarazon;
			this.TOMARAZON = Mapeo.getMapeoI(Mapeo.TOMARAZON,tomarazon);
			this.UNIDATIEMPO = Mapeo.getMapeoI(Mapeo.UNIDADTIEMPO,String.valueOf(0));
			this.MONEDA = Mapeo.getMapeoI(Mapeo.UNIDADMONEDA,this.TIPO_MONEDA);
		} catch (ErrorDBDataNotExistsException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ErrorDBDataErrorException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
  //DEFINIMOS EL CONSTRUCTOR
    public OCData(String id){
    	OrdenDeCompra mercado;
		try {
			mercado = new OrdenDeCompra(id);
			JSONObject data = mercado.last();
	        this.Jobject = data;
	        if(data.has("Codigo") && !data.isNull("Codigo")) this.CODIGO_MP = data.getString("Codigo");
	        if(data.has("Pais") && !data.isNull("Pais")) this.PAIS = data.getString("Pais");
	        if(data.has("TipoMoneda") && !data.isNull("TipoMoneda")) this.TIPO_MONEDA = data.getString("TipoMoneda");
	        if(data.has("TipoJustificacion") && !data.isNull("TipoJustificacion")) this.TIPO_JUSTIFICACION = data.getString("TipoJustificacion");
	        if(data.has("CodigoTipo") && !data.isNull("CodigoTipo")) this.CODIGO_TIPO = data.getInt("CodigoTipo");
	        if(data.has("TieneItems") && !data.isNull("TieneItems")) this.TIENE_ITEMS = data.getInt("TieneItems");
	        if(data.has("Descuentos") && !data.isNull("Descuentos")) this.DESCUENTOS = data.getInt("Descuentos");
	        if(data.has("RequerimientosEntrega") && !data.isNull("RequerimientosEntrega")) this.REQUERIMIENTOS_ENTREGA = data.getJSONObject("RequerimientosEntrega");
	        if(data.has("PromedioCalificacion") && !data.isNull("PromedioCalificacion")) this.PROMEDIO_CALIFICACION = data.getDouble("PromedioCalificacion");
	        if(data.has("TipoOrdenCompra") && !data.isNull("TipoOrdenCompra")) this.TIPO_ORDEN_COMPRA = data.getString("TipoOrdenCompra");
	        if(data.has("Impuestos") && !data.isNull("Impuestos")) this.IMPUESTOS = data.getInt("Impuestos");
	        if(data.has("Nombre") && !data.isNull("Nombre")) this.NOMBRE = data.getString("Nombre");
	        if(data.has("DatosPago") && !data.isNull("DatosPago")) this.DATOS_PAGO = new OCDatosPago(data.getJSONObject("DatosPago"));
	        if(data.has("CodigoLicitacion") && !data.isNull("CodigoLicitacion")) this.CODIGO_LICITACION = data.getString("CodigoLicitacion");
	        if(data.has("DatosAprobaciones") && !data.isNull("DatosAprobaciones")) this.DATOS_APROBACIONES = data.getJSONObject("DatosAprobaciones");
	        if(data.has("PacAsociados") && !data.isNull("PacAsociados")) this.PAC_ASOSICADOS = data.getJSONObject("PacAsociados");
	        if(data.has("CodigoEstado") && !data.isNull("CodigoEstado")) this.CODIGO_ESTADO = data.getInt("CodigoEstado");
	        //
	        if(data.has("EstadoProveedor") && !data.isNull("EstadoProveedor")) this.ESTADO_PROVEEDOR = data.getString("EstadoProveedor");
	        if(data.has("Proveedor") && !data.isNull("Proveedor")) this.PROVEEDOR = new OCProveedor(data.getJSONObject("Proveedor"));
	        if(data.has("Items") && !data.isNull("Items")){
	        	JSONArray items = data.getJSONObject("Items").getJSONArray("Listado");
	        	this.ITEMS = new OCItems[items.length()];
	        	for(int i=0; i<items.length();i++){
	        		this.ITEMS[i] = new OCItems(items.getJSONObject(i));
	        	}
	        }
	        if(data.has("TotalNeto") && !data.isNull("TotalNeto")) this.TOTAL_NETO = data.getInt("TotalNeto");
	        if(data.has("ObservacionesDescuento") && !data.isNull("ObservacionesDescuento")) this.OBSERVACIONES_DESCUENTO = data.getString("ObservacionesDescuento");
	        if(data.has("ObservacionesCargos") && !data.isNull("ObservacionesCargos")) this.OBSERVACIONES_CARGOS = data.getString("ObservacionesCargos");
	        if(data.has("DocumentosAnexos") && !data.isNull("DocumentosAnexos")) this.DOCUMENTOS_ANEXOS = data.getJSONObject("DocumentosAnexos");
	        if(data.has("CantidadEvaluacion") && !data.isNull("CantidadEvaluacion")) this.CANTIDA_DE_VALUACION = data.getInt("CantidadEvaluacion");
	        if(data.has("PorcentajeIva") && !data.isNull("PorcentajeIva")) this.PORCENTAJE_IVA = data.getInt("PorcentajeIva");
	        if(data.has("Financiamiento") && !data.isNull("Financiamiento")) this.FINANCIAMIENTO = data.getString("Financiamiento");
	        if(data.has("CodigoTipoJustificacion") && !data.isNull("CodigoTipoJustificacion")) this.CODIGO_TIPO_JUSTIFICACION = data.getInt("CodigoTipoJustificacion");
	        if(data.has("EsObraPublica") && !data.isNull("EsObraPublica")) this.ES_OBRA_PUBLICA = data.getInt("EsObraPublica");
	        if(data.has("Descripcion") && !data.isNull("Descripcion")) this.DESCRIPCION = data.getString("Descripcion");
	        if(data.has("Comprador") && !data.isNull("Comprados")) this.COMPRADOR = new OCComprador(data.getJSONObject("Comprador"));
	        if(data.has("Estado") && !data.isNull("Estado")) this.ESTADO = data.getString("Estado");
	        if(data.has("Tipo") && !data.isNull("Tipo")) this.TIPO = data.getString("Tipo");
	        if(data.has("Fecha") && data.getJSONObject("Fecha").has("FechaUltimaModificacion") && !data.getJSONObject("Fecha").isNull("FechaUltimaModificacion")) this.FECHA_ULTIMA_MODIFICACION = data.getJSONObject("Fecha").getString("FechaUltimaModificacion");
	        if(data.has("Fecha") && data.getJSONObject("Fecha").has("FechaEnvio") && !data.getJSONObject("Fecha").isNull("FechaEnvio")) this.FECHA_ENVIO= data.getJSONObject("Fecha").getString("FechaEnvio");
	        if(data.has("Fecha") && data.getJSONObject("Fecha").has("FechaAceptacion") && !data.getJSONObject("Fecha").isNull("FechaAceptacion")) this.FECHA_ACEPTACION = data.getJSONObject("Fecha").getString("FechaAceptacion");
	        if(data.has("Fecha") && data.getJSONObject("Fecha").has("FechaCancelacion") && !data.getJSONObject("Fecha").isNull("FechaCancelacion")) this.FECHA_CANCELACION = data.getJSONObject("Fecha").getString("FechaCancelacion");
	        if(data.has("Fecha") && data.getJSONObject("Fecha").has("FechaCreacion") && !data.getJSONObject("Fecha").isNull("FechaCreacion")) this.FECHA_CREACION = data.getJSONObject("Fecha").getString("FechaCreacion");
	        if(data.has("CodigoEstadoProveedor") && !data.isNull("CodigoEstadoProveedor")) this.CODIGO_ESTADO_PROVEEDOR = data.getInt("CodigoEstadoProveedor");
	        if(data.has("AutorizadoresOrdenCompra") && !data.isNull("AutorizadoresOrdenCompra")){
	        	JSONArray items = data.getJSONObject("AutorizadoresOrdenCompra").getJSONArray("Listado");
	        	this.AUTORIZADORES_ORDEN_COMPRA = new OCAutorizador[items.length()];
	        	for(int i=0; i<items.length();i++){
	        		this.AUTORIZADORES_ORDEN_COMPRA[i] = new OCAutorizador(items.getJSONObject(i));
	        	}
	        }
	        if(data.has("IdCompromiso") && !data.isNull("IdCompromiso")) this.ID_COMPROMISO = data.getString("IdCompromiso");
	        if(data.has("Cargos") && !data.isNull("Cargos")) this.CARGOS = data.getInt("Cargos");
	        if(data.has("Total") && !data.isNull("Total")) this.TOTAL = data.getInt("Total");
	        if(data.has("Cotizaciones") && !data.isNull("Cotizaciones")) this.COTIZACIONES = data.getJSONObject("Cotizaciones");
	        try {
				this.PROCECONTRATACION = Mapeo.getMapeoS(Mapeo.PROCEDCONTRATACION,  this.TIPO);
				String tomarazon = Mapeo.getMapeoS(Mapeo.TIPODOCUMENTO, String.valueOf(0));
				this.TIPODOC = tomarazon;
				this.TOMARAZON = Mapeo.getMapeoI(Mapeo.TOMARAZON,tomarazon);
				this.UNIDATIEMPO = Mapeo.getMapeoI(Mapeo.UNIDADTIEMPO,String.valueOf(0));
				this.MONEDA = Mapeo.getMapeoI(Mapeo.UNIDADMONEDA,this.TIPO_MONEDA);
			} catch (ErrorDBDataNotExistsException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (ErrorDBDataErrorException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
    }
	@Override
	public String getDESCRIPCION() {
		// TODO Auto-generated method stub
		return this.DESCRIPCION;
	}
	@Override
	public Integer getTOMARAZON() {
		// TODO Auto-generated method stub
		return this.TOMARAZON;
	}
	@Override
	public Integer getPLAZOBRA() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public Integer getUNIDATIEMPO() {
		// TODO Auto-generated method stub
		return this.UNIDATIEMPO;
	}
	@Override
	public Integer getMONEDA() {
		// TODO Auto-generated method stub
		return this.MONEDA;
	}
	@Override
	public String getTIPO() {
		// TODO Auto-generated method stub
		return this.TIPO;
	}
	@Override
	public JSONArray getITEMS() {
		JSONArray retorno = new JSONArray();
		for(int i=0; i<this.ITEMS.length;i++){
			retorno.put(this.ITEMS[i].toJSON());
		}
		return retorno;
	}
	@Override
	public String getTITULOPROY() {
		// TODO Auto-generated method stub
		return this.NOMBRE;
	}
	@Override
	public String getCODIGOMP() {
		// TODO Auto-generated method stub
		return this.CODIGO_MP;
	}
	@Override
	public String getPROCECONTRATACION() {
		// TODO Auto-generated method stub
		return this.PROCECONTRATACION;
	}
	@Override
	public String getTIPODOC() {
		// TODO Auto-generated method stub
		return this.TIPODOC;
	}
	@Override
	public String getMPSTRING() {
		// TODO Auto-generated method stub
		return this.CODIGO_MP;
	}
	@Override
	public String getMONTOESTIMADO() {
		// TODO Auto-generated method stub
		return String.valueOf(this.TOTAL);
	}
	@Override
	public boolean verifyData() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	public boolean isOC() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	public JSONObject getData() {
		// TODO Auto-generated method stub
		return this.Jobject;
	}
}