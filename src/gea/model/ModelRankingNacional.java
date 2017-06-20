package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="PORTAL_RANKING_PROYECTOS_CGR",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelRankingNacional extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String F_TRAZON;
	@ModelField
	public String NOMBRE;
	@ModelField
	public int CODPROYECTO;
	@ModelField
	public String MONTO;
	@ModelField
	public String FECHA_INI;
	@ModelField
	public String REGION;
	@ModelField
	public String PROVINCIA;
	@ModelField
	public String COMUNA;
	@ModelField
	public String TCOMUNA;
	@ModelField
	public int MULTIDPA;
	@ModelField
	public int MULTIREG;
	@ModelField
	public int MULTIPROV;
	@ModelField
	public int MULTICOM;
	@ModelField
	public String FECHA;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
