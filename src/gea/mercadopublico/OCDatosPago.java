package gea.mercadopublico;

import org.json.JSONObject;

public class OCDatosPago {
	public String MONEDA_PAGO;
    public String RUT_COMPRADOR;
    public String COMUNA_COMPRADOR;
    public String CORREO_RESPONSABLE;
    public String FECHA_ENTREGA_PRODUCTOS;
    public String RAZONSOCIAL_COMPRADOR;
    public String REGION_COMPRADOR;
    public String TIPO_DESPACHO;
    public String NOMBRE_RESPONSABLE_PAGO;
    public String FORMA_PAGO;
    public String DIRECCION_FACTURACION;
    public String TELEFONO_RESPONSABLE;
    public String DIRECCION_DESPACHO;
    public OCDatosPago(JSONObject data) {
		if(data.has("MonedaPago") && !data.isNull("MonedaPago")) this.MONEDA_PAGO = data.getString("MonedaPago");
		if(data.has("RutComprador") && !data.isNull("RutComprador")) this.RUT_COMPRADOR = data.getString("RutComprador");
		if(data.has("ComunaComprador") && !data.isNull("ComunaComprador")) this.COMUNA_COMPRADOR = data.getString("ComunaComprador");
		if(data.has("CorreoResponsable") && !data.isNull("CorreoResponsable")) this.CORREO_RESPONSABLE = data.getString("CorreoResponsable");
		if(data.has("FechaEntregaProductos") && !data.isNull("FechaEntregaProductos")) this.FECHA_ENTREGA_PRODUCTOS = data.getString("FechaEntregaProductos");
		if(data.has("RazonSocialComprador") && !data.isNull("RazonSocialComprador")) this.RAZONSOCIAL_COMPRADOR = data.getString("RazonSocialComprador");
		if(data.has("RegionComprador") && !data.isNull("RegionComprador")) this.REGION_COMPRADOR = data.getString("RegionComprador");
		if(data.has("TipoDespacho") && !data.isNull("TipoDespacho")) this.TIPO_DESPACHO = data.getString("TipoDespacho");
		if(data.has("NombreResponsablePago") && !data.isNull("NombreResponsablePago")) this.NOMBRE_RESPONSABLE_PAGO = data.getString("NombreResponsablePago");
		if(data.has("FormaPago") && !data.isNull("FormaPago")) this.FORMA_PAGO = data.getString("FormaPago");
		if(data.has("DireccionFacturacion") && !data.isNull("DireccionFacturacion")) this.DIRECCION_FACTURACION = data.getString("DireccionFacturacion");
		if(data.has("TelefonoResponsable") && !data.isNull("TelefonoResponsable")) this.TELEFONO_RESPONSABLE = data.getString("TelefonoResponsable");
		if(data.has("DireccionDespacho") && !data.isNull("DireccionDespacho")) this.DIRECCION_DESPACHO = data.getString("DireccionDespacho");
	}
}
