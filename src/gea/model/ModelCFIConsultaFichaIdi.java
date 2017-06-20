package gea.model;

import java.sql.Date;
import java.util.ArrayList;

import gea.annotation.ModelField;
import gea.annotation.ModelParam;

@ModelParam(
		tableName="GEO_CONSULTA_FICHAIDI",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)

public class ModelCFIConsultaFichaIdi extends ModelBase {
	//ATRIBUTOS
	@ModelField public String CREADO;
	@ModelField public Date F_CREACION;
	@ModelField public Long X_FIDI;
	@ModelField public Long ANIO_PRESUP;
	@ModelField public Long C_ETAPA;
	@ModelField public String N_ETAPA;
	@ModelField public Date FECHA_P_SNI;
	@ModelField public Date FECHA_I_SNI;
	@ModelField public String CBIP_X_CBIP;
	@ModelField public String N_INI_INV;
	@ModelField public Long C_TIPOLOGIA;
	@ModelField public String N_TIPOLOGIA;
	@ModelField public Long C_IDI_REL;
	@ModelField public Long P_IDI_REL;
	@ModelField public Long C_SEIA;
	@ModelField public String LOC_GEOGRAF;
	@ModelField public String COMPETENCIA;
	@ModelField public String DISTRITO;
	@ModelField public String CIRCUNSCRIPCION;
	@ModelField public String PRIORIDAD;
	@ModelField public String JUSTIFICACION;
	@ModelField public String D_ACT;
	@ModelField public String SITUACION;
	@ModelField public String CONCLUSIONES;
	@ModelField public String INSTFORMULADORA;
	@ModelField public String INSTTECNICA;
	@ModelField public String INSTFINANCIERA;
	@ModelField public Long RESPONSABLE;
	@ModelField public Long CIDI_X_CIDI;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> fichaIDI) {
	}
}
