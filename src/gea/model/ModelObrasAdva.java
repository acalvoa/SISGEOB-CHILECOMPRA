package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
@ModelParam(
		tableName="PORTAL_OBRAS_CGR",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelObrasAdva extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String REGION;
	@ModelField
	public String PROVINCIA;
	@ModelField
	public String COMUNA;
	@ModelField
	public String TCOMUNA;
	@ModelField
	public int CODPROYECTO;
	@ModelField
	public String FECHA_INI;
	@ModelField
	public String FECHA_FIN;
	@ModelField
	public double MONTO_CONTRATADO;
	@ModelField
	public String TITULO;
	@ModelField
	public String SERV_CONTR;
	@ModelField
	public String SERV_MAND;
	@ModelField
	public String CLASIFICACION;
	@ModelField
	public int MULTIDPA;
	@ModelField
	public int MULTIREG;
	@ModelField
	public int MULTIPROV;
	@ModelField
	public int MULTICOM;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
