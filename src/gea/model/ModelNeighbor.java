package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
import gea.types.OBRAMOBILE;
@ModelParam(
		tableName="FICHAMOBILE",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelNeighbor extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public int CODIGO;
	@ModelField
	public String TITULO;
	@ModelField
	public OBRAMOBILE SPATIAL_OBJECT;
	@ModelField
	public double DISTANCIA;
	@ModelField
	public double VALOR;
	@ModelField
	public double VALORPROM;
	@ModelField
	public int TIPO;
	@ModelField
	public double AVANCE;
	@ModelField
	public double MONTO;
	
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
