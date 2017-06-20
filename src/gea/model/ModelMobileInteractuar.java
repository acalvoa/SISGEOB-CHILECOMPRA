package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
@ModelParam(
		tableName="GEO_MOBILE_OBRA_VISITADA",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelMobileInteractuar extends ModelBase{
	//DEFINIMOS LOS ATRIBUTOS
	@ModelField
	public int X_ID;
	@ModelField
	public int USER_X_USER;
	@ModelField
	public int PROY_X_PROY;
	@ModelField
	public int ID_VALOR;
	@ModelField
	public int ID_COMPARTIR;
	@ModelField
	public int ID_ALERTA ;
	@ModelField
	public int X_VISUALIZADA;

	
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}