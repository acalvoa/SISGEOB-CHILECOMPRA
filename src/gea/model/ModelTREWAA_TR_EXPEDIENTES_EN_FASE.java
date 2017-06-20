package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="TREWAV160.TR_EXPEDIENTES_EN_FASE", // DESAROLLO Y TESTING
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelTREWAA_TR_EXPEDIENTES_EN_FASE extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int EXPE_X_EXPE;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
