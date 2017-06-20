package gea.model;

import java.util.ArrayList;

import gea.annotation.*;
@ModelParam(
		tableName="GEO_OP_TIPOS_SUBCLASIFICACION",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelFSubclasificacion extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int X_SUBC;
	@ModelField
	public String C_SUBCLASIFICACION;
	@ModelField
	public String T_SUBCLASIFICACION;
	@ModelField
	public String D_SUBCLASIFICACION;
	@ModelField
	public String CLAS_X_CLAS;
	@ModelField
	public String C_ESTADO;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
