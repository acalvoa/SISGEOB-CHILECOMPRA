package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
@ModelParam(
		tableName="GEO_MOBILE_COMPARTIR",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelCompartirMobile extends ModelBase{
	//DEFINIMOS LOS ATRIBUTOS
	@ModelField
	public int X_COM;
	@ModelField
	public String USER_X_USER;
	@ModelField
	public String PROY_X_PROY;
	@ModelField
	public String F_CREACION;

	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
