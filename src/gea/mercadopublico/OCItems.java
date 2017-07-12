package gea.mercadopublico;

import org.json.JSONArray;
import org.json.JSONObject;

public class OCItems {
	public int TOTAL_IMPUESTOS;
	public int CORRELATIVO;
	public String PRODUCTO;
	public String MONEDA;
	public int TOTAL_DESCUENTOS;
	public String CATEGORIA;
	public int CANTIDAD;
	public int PRECIO_NETO;
	public int CODIGO_PRODUCTO;
	public String UNIDAD;
	public int CODIGO_CATEGORIA;
	public String ESPECIFICACION_PROVEEDOR;
	public int TOTAL;
	public String ESPECIFICACION_COMPRADOR;
	public int TOTAL_CARGOS;
	private JSONObject obj;
	public OCItems(JSONObject data) {
		this.obj = data;
		if(data.has("TotalImpuestos")&& !data.isNull("TotalImpuestos")) this.TOTAL_IMPUESTOS = data.getInt("TotalImpuestos");
		if(data.has("Correlativo")&& !data.isNull("Correlativo")) this.CORRELATIVO = data.getInt("Correlativo");
		if(data.has("Producto")&& !data.isNull("Producto")) this.PRODUCTO = data.getString("Producto");
		if(data.has("Moneda")&& !data.isNull("Moneda")) this.MONEDA = data.getString("Moneda");
		if(data.has("Categoria")&& !data.isNull("Categoria")) this.CATEGORIA = data.getString("Categoria");
		if(data.has("Cantidad")&& !data.isNull("Cantidad")) this.CANTIDAD = data.getInt("Cantidad");
		if(data.has("PrecioNeto")&& !data.isNull("PrecioNeto")) this.PRECIO_NETO = data.getInt("PrecioNeto");
		if(data.has("CodigoProducto")&& !data.isNull("CodigoProducto")) this.CODIGO_PRODUCTO = data.getInt("CodigoProducto");
		if(data.has("Unidad")&& !data.isNull("Unidad")) this.UNIDAD = data.getString("Unidad");
		if(data.has("CodigoCategoria")&& !data.isNull("CodigoCategoria")) this.CODIGO_CATEGORIA = data.getInt("CodigoCategoria");
		if(data.has("EspecificacionProveedor")&& !data.isNull("EspecificacionProveedor")) this.ESPECIFICACION_PROVEEDOR = data.getString("EspecificacionProveedor");
		if(data.has("Total")&& !data.isNull("Total")) this.TOTAL = data.getInt("Total");
		if(data.has("EspecificacionComprador")&& !data.isNull("EspecificacionComprador")) this.ESPECIFICACION_COMPRADOR = data.getString("EspecificacionComprador");
		if(data.has("TotalCargos")&& !data.isNull("TotalCargos")) this.TOTAL_CARGOS = data.getInt("TotalCargos");
	}
	public JSONObject toJSON(){
		return this.obj;
	}
}
