package gea.model;

import java.util.ArrayList;

import gea.annotation.*;
@ModelParam(
		tableName="GEO_TIPOS_MODALIDAD_CONTRATAC",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelFModalidad extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String X_MODC;
	@ModelField
	public String C_MODALIDAD_CONT;
	@ModelField
	public String T_MODALIDAD_CONT;
	@ModelField
	public String D_MODALIDAD_CONT;
	@ModelField
	public String C_ESTADO_OP;
	@ModelField
	public String C_ESTADO_CS;
	@ModelField
	public String C_ESTADO_CC;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
