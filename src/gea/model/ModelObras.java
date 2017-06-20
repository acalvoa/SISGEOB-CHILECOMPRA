package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
@ModelParam(
		tableName="PORTAL_OBRAS_CGR",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelObras extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String CREADOPOR;
	@ModelField
	public String REGION;
	@ModelField
	public String PROVINCIA;
	@ModelField
	public String COMUNA;
	@ModelField
	public String TREGION;
	@ModelField
	public String TPROVINCIA;
	@ModelField
	public String TCOMUNA;
	@ModelField
	public String SERV_MAND;
	@ModelField
	public String SERV_CONTR;
	@ModelField
	public String CCLASIFICACION;
	@ModelField
	public String CLASIFICACION;
	@ModelField
	public double AVANCE_FIN;
	@ModelField
	public String F_AVANCE_FIN;
	@ModelField
	public double AVANCE_FIS;
	@ModelField
	public String F_AVANCE_FIS;
	@ModelField
	public String FECHA_INI;
	@ModelField
	public String FECHA_FIN;
	@ModelField
	public int PLAZO_EJE;
	@ModelField
	public String UNIDAD_EJE;
	@ModelField
	public String DESCRIPCION;
	@ModelField
	public String ID_MERCADO_PUB;
	@ModelField
	public String CODIGO_BIP;
	@ModelField
	public String CODIGO_INI;
	@ModelField
	public String TIPO_FIN;
	@ModelField
	public String PROC_CONTRATACION;
	@ModelField
	public double MONTO_CONTRATADO;
	@ModelField
	public String NOMBRE_INSP_FIS;
	@ModelField
	public String APELLIDO_P_INSP_FIS;
	@ModelField
	public String APELLIDO_M_INSP_FIS;
	@ModelField
	public String RUN_INSP_FIS;
	@ModelField
	public String NOMBRE_CONTRATIS;
	@ModelField
	public String APELLIDOS_CONTRATIS;
	@ModelField
	public String RUT_CONTRATIS;
	@ModelField
	public String NOMBRE_CONSORCIO;
	@ModelField
	public String APELLIDOS_CONSORCIO;
	@ModelField
	public String RUT_CONS;
	@ModelField
	public OBRA SPATIAL_OBJECT;
	@ModelField
	public int CODPROYECTO;
	@ModelField
	public String X_EXPE;
	@ModelField
	public String TITULO;
	@ModelField
	public int MULTIDPA;
	@ModelField
	public int MULTIREG;
	@ModelField
	public int MULTIPROV;
	@ModelField
	public int MULTICOM;
	@ModelField
	public String F_ADJUDICACION;
	@ModelField
	public String F_TRAZON;
	@ModelField
	public int LIQUIDACION;
	@ModelField
	public int T_ANTICIPADO;
	@ModelField
	public int RECEPCION;
	@ModelField
	public String SPATIAL_TOOL;
	@ModelField
	public String FEC_TERMINO;
	@ModelField
	public String FEC_RECEPCION;
	@ModelField
	public String FEC_LIQUIDACION;
	@ModelField
	public String F_INI_AVANCE;
	@ModelField
	public String F_TER_AVANCE;
	@ModelField
	public String FECHA;
	
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
