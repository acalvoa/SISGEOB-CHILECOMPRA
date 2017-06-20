package gea.model;

import java.sql.Date;
import java.util.ArrayList;

import gea.annotation.ModelField;
import gea.annotation.ModelParam;

@ModelParam(
		tableName="GEO_AREA_DES_INDIGENA",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)

public class ModelCFIAreaDesIndigena extends ModelBase {
	//ATRIBUTOS
	@ModelField public String CREADO;
	@ModelField public Date F_CREACION;
	@ModelField public Long X_ADI;
	@ModelField public Long FIDI_X_FIDI;
	@ModelField public String N_ADI;
	@ModelField public String T_ADI;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> areaDesIndigena) {
	}
}
