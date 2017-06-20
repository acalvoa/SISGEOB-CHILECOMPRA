package gea.model;

import java.util.ArrayList;

import gea.annotation.*;
@ModelParam(
		tableName="GEO_OP_TIPOS_CLASIFICACIONES",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelFClasificacion extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int X_CLAS;
	@ModelField
	public String C_CLASIFICACION;
	@ModelField
	public String T_CLASIFICACION;
	@ModelField
	public String D_CLASIFICACION;
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
