package gea.model;

import java.util.ArrayList;

import gea.annotation.*;
@ModelParam(
		tableName="GEOCGR_KEY_AUTH",
		Find=true,
		FindOne=true,
		Update=false,
		Delete=false,
		Insert=true,
		ToJSON=true
)
public class ModelAuth extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	@ModelFieldRequired
	public String KEY;
	@ModelField
	@ModelFieldRequired
	public String ID;
	@ModelField
	@ModelFieldRequired
	public String CREATETIME;
	@ModelField
	@ModelFieldRequired
	public String FINISHTIME;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
}
