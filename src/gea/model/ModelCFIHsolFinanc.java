package gea.model;

import gea.annotation.ModelField;
import gea.annotation.ModelParam;

import java.sql.Date;
import java.util.ArrayList;

@ModelParam(
		tableName="GEO_HSOL_FINANC",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)

public class ModelCFIHsolFinanc extends ModelBase {
	//ATRIBUTOS
	@ModelField public String CREADO;
	@ModelField public Date F_CREACION;
	@ModelField public Long X_HSOLFIN;
	@ModelField public Long FIDI_X_FIDI;
	@ModelField public Long A_PRES;
	@ModelField public String RATE;
	@ModelField public Long PAGADO;
	@ModelField public Long SOL_ANIO_CLP;
	@ModelField public Long SOL_ANIO_USD;
	@ModelField public Long S_PORINV_CLP;
	@ModelField public Long S_PORINV_USD;
	@ModelField public Long C_TOT_CLP;
	@ModelField public Long C_TOT_USD;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> areaDesIndigena) {
	}
}
