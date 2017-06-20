package gea.model;

import java.sql.Date;
import java.util.ArrayList;

import gea.annotation.ModelField;
import gea.annotation.ModelParam;

@ModelParam(
		tableName="GEO_SOL_FINANC",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)

public class ModelCFISolFinanc extends ModelBase {
	//ATRIBUTOS
	@ModelField public String CREADO;
	@ModelField public Date F_CREACION;
	@ModelField public Long X_SFIN;
	@ModelField public Long FIDI_X_FIDI;
	@ModelField public String FUENTE;
	@ModelField public String ITEM;
	@ModelField public String MONEDA;
	@ModelField public Long PAGADO;
	@ModelField public Long SOLICITADO;
	@ModelField public Long SALDO_X_INVERTIR;
	@ModelField public Long COSTO_TOTAL;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> areaDesIndigena) {
	}
}
