package gea.mercadopublico;

import org.json.JSONObject;

public class OCProveedor {
	public String ACTIVIDAD;
	public int CODIGO;
	public String PAIS;
	public String NOMBRE_CONTACTO;
	public String CARGO_CONTACTO;
	public String FONO_CONTACTO;
	public String CODIGO_SUCURSAL;
	public String DIRECCION;
	public String COMUNA;
	public String MAIL_CONTACTO;
	public String REGION;
	public String NOMBRE;
	public String NOMBRE_SUCURSAL;
	public String RUT_SUCURSAL;
	public OCProveedor(JSONObject data) {
		// TODO Auto-generated constructor stub
		if(data.has("Actividad") && !data.isNull("Actividad")) this.ACTIVIDAD = data.getString("Actividad");
		if(data.has("Codigo") && !data.isNull("Codigo")) this.CODIGO = data.getInt("Codigo");
		if(data.has("Pais") && !data.isNull("Pais")) this.PAIS = data.getString("Pais");
		if(data.has("NombreContacto") && !data.isNull("NombreContacto")) this.NOMBRE_CONTACTO = data.getString("NombreContacto");
		if(data.has("CargoContacto") && !data.isNull("CargoContacto")) this.CARGO_CONTACTO = data.getString("CargoContacto");
		if(data.has("FonoContacto") && !data.isNull("FonoContacto")) this.FONO_CONTACTO = data.getString("FonoContacto");
		if(data.has("CodigoSucursal") && !data.isNull("CodigoSucursal")) this.CODIGO_SUCURSAL = data.getString("CodigoSucursal");
		if(data.has("Direccion") && !data.isNull("Direccion")) this.DIRECCION = data.getString("Direccion");
		if(data.has("Comuna") && !data.isNull("Comuna")) this.COMUNA = data.getString("Comuna");
		if(data.has("MailContacto") && !data.isNull("MailContacto")) this.MAIL_CONTACTO = data.getString("MailContacto");
		if(data.has("Region") && !data.isNull("Region")) this.REGION = data.getString("Region");
		if(data.has("Nombre") && !data.isNull("Nombre")) this.NOMBRE = data.getString("Nombre");
		if(data.has("NombreSucursal") && !data.isNull("NombreSucursal")) this.NOMBRE_SUCURSAL = data.getString("NombreSucursal");
		if(data.has("RutSucursal") && !data.isNull("RutSucursal")) this.RUT_SUCURSAL = data.getString("RutSucursal");
	}
}
