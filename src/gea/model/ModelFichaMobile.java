package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
@ModelParam(
		tableName="FICHAMOBILE",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelFichaMobile extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int CODIGO;
	@ModelField
	public double AVANCE_FINANCIERO;
	@ModelField
	public double AVANCE_FISICO;
	@ModelField
	public String FECHA_INI;
	@ModelField
	public String FECHA_FIN;
	@ModelField
	public int MONTO_CONTRATADO;
	@ModelField
	public String ULTIMO_REG;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
