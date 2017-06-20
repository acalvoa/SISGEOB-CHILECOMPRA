package gea.model;

import java.util.ArrayList;

import gea.annotation.*;
@ModelParam(
		tableName="GEO_TIPOS_FINACIAMIENTO",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelFTFinanciamiento extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int X_TIFI;
	@ModelField
	public String C_TIPO_FINANCIAMIENTO;
	@ModelField
	public String T_TIPO_FINANCIAMIENTO;
	@ModelField
	public String D_TIPO_FINANCIAMIENTO;
	@ModelField
	public String C_ESTADO_OP;
	@ModelField
	public String C_ESTADO_CS;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
