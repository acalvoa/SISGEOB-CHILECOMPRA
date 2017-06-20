package gea.model;

import java.sql.Date;
import java.util.ArrayList;

import gea.annotation.ModelField;
import gea.annotation.ModelParam;

@ModelParam(
		tableName="GEO_PROGRAMACION",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)

public class ModelCFIProgramacion extends ModelBase {
	//ATRIBUTOS
	@ModelField public String CREADO;
	@ModelField public Date F_CREACION;
	@ModelField public Long X_PROG;
	@ModelField public Long FIDI_X_FIDI;
	@ModelField public String TIPO;
	@ModelField public String ITEM_FUENTE;
	@ModelField public Long MONTOCLP;
	@ModelField public Long MONTOUSD;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> areaDesIndigena) {
	}
}
