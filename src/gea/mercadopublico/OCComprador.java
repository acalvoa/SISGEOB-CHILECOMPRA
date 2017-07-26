package gea.mercadopublico;

import org.json.JSONObject;

public class OCComprador {
	public String ACTIVIDAD;
	public String CODIGOORGANISMO;
	public String DIRECCIONUNIDAD;
	public String COMUNAUNIDAD;
	public String PAIS;
	public String NOMBRECONTACTO;
	public String CARGOCONTACTO;
	public String FONOCONTACTO;
	public String CODIGOUNIDAD;
	public String NOMBREUNIDAD;
	public String MAILCONTACTO;
	public String REGIONUNIDAD;
	public String RUTUNIDAD;
	public String NOMBREORGANISMO;
	public OCComprador(JSONObject data) {
		if(data.has("Actividad") && !data.isNull("Actividad")) this.ACTIVIDAD = data.getString("Actividad");
		if(data.has("CodigoOrganismo") && !data.isNull("CodigoOrganismo")) this.CODIGOORGANISMO = data.getString("CodigoOrganismo");
		if(data.has("DireccionUnidad") && !data.isNull("DireccionUnidad")) this.DIRECCIONUNIDAD = data.getString("DireccionUnidad");
		if(data.has("ComunaUnidad") && !data.isNull("ComunaUnidad")) this.COMUNAUNIDAD = data.getString("ComunaUnidad");
		if(data.has("Pais") && !data.isNull("Pais")) this.PAIS = data.getString("Pais");
		if(data.has("NombreContacto") && !data.isNull("NombreContacto")) this.NOMBRECONTACTO = data.getString("NombreContacto");
		if(data.has("CargoContacto") && !data.isNull("CargoContacto")) this.CARGOCONTACTO = data.getString("CargoContacto");
		if(data.has("FonoContacto") && !data.isNull("FonoContacto")) this.FONOCONTACTO = data.getString("FonoContacto");
		if(data.has("CodigoUnidad") && !data.isNull("CodigoUnidad")) this.CODIGOUNIDAD = data.getString("CodigoUnidad");
		if(data.has("NombreUnidad") && !data.isNull("NombreUnidad")) this.NOMBREUNIDAD = data.getString("NombreUnidad");
		if(data.has("MailContacto") && !data.isNull("MailContacto")) this.MAILCONTACTO = data.getString("MailContacto");
		if(data.has("RegionUnidad") && !data.isNull("RegionUnidad")) this.REGIONUNIDAD = data.getString("RegionUnidad");
		if(data.has("RutUnidad") && !data.isNull("RutUnidad")) this.RUTUNIDAD = data.getString("RutUnidad");
		if(data.has("NombreOrganismo") && !data.isNull("NombreOrganismo")) this.NOMBREORGANISMO = data.getString("NombreOrganismo");
	}
}
