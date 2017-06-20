package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
@ModelParam(
		tableName="GEO_MOBILE_IMAGES",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelImageMobile extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int X_IMAGE;
	@ModelField
	public int PROY_X_PROY;
	@ModelField
	public int USER_X_USER;
	@ModelField
	public String IMAGE;
	@ModelField
	public int APROBACION;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
		mapa.remove("X_IMAGE");
		mapa.remove("PROY_X_PROY");
		mapa.remove("USER_X_USER");
		mapa.remove("APROBACION");
	}
}
