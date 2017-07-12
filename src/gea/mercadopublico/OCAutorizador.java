package gea.mercadopublico;

import org.json.JSONObject;

public class OCAutorizador {
	public String CORREO;
	public String COMENTARIOS;
	public String PERFIL;
	public int CORRELATIVO;
	public String NOMBRE;
	public OCAutorizador(JSONObject data) {
		// TODO Auto-generated constructor stub
		if(data.has("Correo") && !data.isNull("Correo")) this.CORREO = data.getString("Correo");
		if(data.has("Comentarios") && !data.isNull("Comentarios")) this.COMENTARIOS = data.getString("Comentarios");
		if(data.has("Perfil") && !data.isNull("Perfil")) this.PERFIL = data.getString("Perfil");
		if(data.has("Correlativo") && !data.isNull("Correlativo")) this.CORRELATIVO = data.getInt("Correlativo");
		if(data.has("Nombre") && !data.isNull("Nombre")) this.NOMBRE = data.getString("Nombre");
	}
}
