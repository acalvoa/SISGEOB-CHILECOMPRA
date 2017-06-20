package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.CENTROID;
import gea.types.GEOM;
@ModelParam(
		tableName="GEO_SERVICIOS_PUBLICOS_RANGE",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelServiceReg extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String T_SERVICIO;
	@ModelField
	public String WFS;
	@ModelField
	public long IPBEGIN;
	@ModelField
	public long IPFINISH;
	@ModelField
	public String F_MODIFICACION;
	@ModelField
	public int X_ENTIDAD;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
