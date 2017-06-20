package gea.model;

import gea.annotation.ModelField;
import gea.annotation.ModelParam;

import java.sql.Date;
import java.util.ArrayList;

@ModelParam(
		tableName="GEO_RES_PROY",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)

public class ModelCFIResProy extends ModelBase {
	//ATRIBUTOS
	@ModelField public String CREADO;
	@ModelField public Date F_CREACION;
	@ModelField public Long X_RPROY;
	@ModelField public Long FIDI_X_FIDI;
	@ModelField public Date FECHA;
	@ModelField public String DURACION;
	@ModelField public Long B_MUJERES;
	@ModelField public Long B_HOMBRES;
	@ModelField public Long TMDA;
	@ModelField public Long VIDAUTIL;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> areaDesIndigena) {
	}
}
