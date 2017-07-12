package gea.model;

import java.util.ArrayList;

import gea.annotation.*;
@ModelParam(
		tableName="SISGEOB_OC_REG",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=false,
		Insert=true,
		ToJSON=true
)
public class ModelSISGEOBOC extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int X_OC;
	@ModelField
	@ModelFieldRequired
	public int PROY_X_PROY;
	@ModelField
	@ModelFieldRequired
	public int TORA_X_TORA;
	@ModelField
	@ModelFieldRequired
	public String DATA;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
}
