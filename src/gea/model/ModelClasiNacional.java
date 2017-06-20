package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="MONTOS_CLASI_PAIS",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelClasiNacional extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int NUMERO;
	@ModelField
	public String NOMBRE;
	@ModelField
	public double MONTO;
	@ModelField
	public int OBRAS;
	/*@ModelField
	public double MONTO2016;
	@ModelField
	public int OBRAS2016;*/
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
