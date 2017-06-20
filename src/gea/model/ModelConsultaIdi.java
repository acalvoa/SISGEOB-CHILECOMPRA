package gea.model;

import java.sql.Date;

import gea.annotation.ModelField;
import gea.annotation.ModelParam;

@ModelParam(
		tableName="GEO_CONSULTA_IDI",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)

public class ModelConsultaIdi extends ModelBase {
	//ATRIBUTOS
	@ModelField public String CREADO;
	@ModelField public String F_CREACION;
	@ModelField public int X_CIDI;
	@ModelField public String CBIP_X_CBIP;
	@ModelField public int PROY_X_PROY;
	@ModelField public int ANIO;
	@ModelField public String C_ETAPA;
	@ModelField public String N_ETAPA;
}
