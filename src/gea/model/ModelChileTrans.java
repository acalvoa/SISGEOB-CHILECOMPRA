package gea.model;

import java.util.ArrayList;

import gea.annotation.*;
@ModelParam(
		tableName="GEO_CHL_TRANS_REG",
		Find=false,
		FindOne=false,
		Update=false,
		Delete=false,
		Insert=true,
		ToJSON=true
)
public class ModelChileTrans extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String KEY;
	@ModelField
	public String ORDERS;
	@ModelField
	public String DATE_ANSWER;
	@ModelField
	public String DATE_REGISTER;
	@ModelField
	public String STATUS;
	@ModelField
	public String DATE_TRANS;
	@ModelField
	public String SERVICE_STATUS;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
}
