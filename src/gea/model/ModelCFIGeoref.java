package gea.model;

import java.sql.Date;
import java.util.ArrayList;

import gea.annotation.ModelField;
import gea.annotation.ModelParam;

@ModelParam(
		tableName="GEO_GEOREF",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)

public class ModelCFIGeoref extends ModelBase {
	//ATRIBUTOS
	@ModelField public String CREADO;
	@ModelField public Date F_CREACION;
	@ModelField public Long X_GEOREF;
	@ModelField public Long FIDI_X_FIDI;
	@ModelField public Long CRD_ORDEN;
	@ModelField public Long CRD_EJEX;
	@ModelField public Long CRD_EJEY;
	@ModelField public String CRD_NOMBRE;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> areaDesIndigena) {
	}
}
