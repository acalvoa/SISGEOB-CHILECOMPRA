package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
import gea.types.SDO_GEOMETRY;
@ModelParam(
		tableName="SPATIAL_DATA",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelSpatialQuery extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int PROY_X_PROY;
	@ModelField
	public OBRA SPATIAL_OBJECT;
	@ModelField
	public String ORIGEN;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
		mapa.remove("NUMERO");
		mapa.remove("PROVINCIA");
	}
}
