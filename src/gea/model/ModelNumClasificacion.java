package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.CENTROID;
import gea.types.GEOM;
@ModelParam(
		tableName="NUM_CLASIFICACION",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelNumClasificacion extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String NUMOBRAS;
	@ModelField
	public String CCLASIFICACION;
	@ModelField
	public String REGION;
	@ModelField
	public String COMUNA;
	@ModelField
	public String PROVINCIA;
		/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
