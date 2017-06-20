package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
@ModelParam(
		tableName="GEO_MOBILE_USERS",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelUserMobile extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int X_USER;
	@ModelField
	public String ID_MACHINE;
	@ModelField
	public String TYPE;
	@ModelField
	public String EMAIL;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
