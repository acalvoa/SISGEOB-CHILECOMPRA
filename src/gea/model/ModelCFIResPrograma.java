package gea.model;

import gea.annotation.ModelField;
import gea.annotation.ModelParam;

import java.sql.Date;
import java.util.ArrayList;

@ModelParam(
		tableName="GEO_RES_PROGRAMA",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)

public class ModelCFIResPrograma extends ModelBase {
	//ATRIBUTOS
	@ModelField public String CREADO;
	@ModelField public Date F_CREACION;
	@ModelField public Long X_RPROG;
	@ModelField public Long FIDI_X_FIDI;
	@ModelField public Date FECHA;
	@ModelField public Long B_MUJER;
	@ModelField public Long B_HOMBRE;
	@ModelField public String DURACION;
	@ModelField public String PROPOSITO;
	@ModelField public String I_PROPOSITO;
	@ModelField public String COMPONENTE;
	@ModelField public String I_COMPONENTE;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> areaDesIndigena) {
	}
}
