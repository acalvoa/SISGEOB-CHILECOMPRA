package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.CENTROID;
import gea.types.GEOM;
@ModelParam(
		tableName="PORTAL_DATOS_REGIONALES",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelRegional extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String NOMBRE;
	@ModelField
	public GEOM SPATIAL_OBJECT;
	@ModelField
	public String NUMERO;
	@ModelField
	public long MONTO;
	/*@ModelField
	public long MONTO2015;
	@ModelField
	public long MONTO2016;*/
	@ModelField
	public CENTROID CENTROIDE;
	@ModelField
	public int OBRAS;
	/*@ModelField
	public int OBRAS2015;
	@ModelField
	public int OBRAS2016;*/
	@ModelField
	public int FIT;
	@ModelField
	public int MULTIREG;
	@ModelField
	public String FECHA_ADJU;
	@ModelField
	public String FECHA_TRAZON;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL COIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
