package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="GEO_OP_ADJUDICACIONES_CONTRATO",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)
public class ModelAdjudicacionContrato extends ModelBase{
	//DEFINIMOS LOS ATRIBUTOS
	@ModelField
	public String CREADO;
	@ModelField
	public String F_CREACION;
	@ModelField
	public String MODIFICADO;
	@ModelField
	public String F_MODIFICA;
	@ModelField
	public int COPL_X_COPL;
	@ModelField
	public int X_OPAC;
	@ModelField
	public String C_TIPO_DOCUMENTO;
	@ModelField
	public int TORA_X_TORA;
	@ModelField
	public String C_INSPECTOR_FISCAL;
	@ModelField
	public String C_PROCEDIMIENTO_CONTRATACION;
	@ModelField
	public int MODC_X_MODC;
	@ModelField
	public String D_CAUSA_FUNDAMENTO_NORMATIVO;
	@ModelField
	public int CAPP_X_CAPP;
	@ModelField
	public String D_NORMA;
	@ModelField
	public int CONT_X_CONT;
	@ModelField
	public int N_PLAZO_EJECUCION;
	@ModelField
	public int UNTI_X_UNTI_PLAZO_EJEC;
	@ModelField
	public String F_INICIO_OBRA;
	@ModelField
	public String F_FIN_OBRA;
	@ModelField
	public int TIFI_X_TIFI;
	@ModelField
	public String D_TIPO_FINANCIAMIENTO;
	@ModelField
	public long N_MONTO_CONTRATADO;
	@ModelField
	public int TIMO_X_TIMO_MONTO_CONTRATO;
	@ModelField
	public int PROY_X_PROY;
	@ModelField
	public int N_ADJUDICACION;
	@ModelField
	public String SIRE_X_SIRE;
	@ModelField
	public int N_MONTO_ANTICIPO;
	@ModelField
	public String D_COMPUTO_PLAZO;
	@ModelField
	public String D_SISTEMA_REAJUSTE;
	@ModelField
	public String C_OPE_BORRADOR;
	@ModelField
	public long MONTO_ADJUDICADO_CLP;
	@ModelField
	public String FECHA_MONTO_ADJUDICADO;
	@ModelField
	public int MONEDA_MONTO_MP;
}
