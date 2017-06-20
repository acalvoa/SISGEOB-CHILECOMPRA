package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
@ModelParam(
		tableName="GEO_MOBILE_DENUNCIA",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelDenunciaMobile extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String IMAGE;
	@ModelField
	public String TDENUNCIA_X_TDENUNCIA;
	@ModelField
	public int COMMENTS;
	@ModelField
	public int USER_X_USER;
	@ModelField
	public int PROY_X_PROY;
	/*
	 *	FUNCION DE TRANSFORMACION A TEXTO JSON HEREDA LA ESTRUCTURA COMPLETA DE CAMPOS
	 *	EN ESTE PUNTO A TRAVES DEL CODIGO REMOVE SE PUEDEN EXTRAER LOS CAMPOS QUE NO SE REQUIERAN
	 *	A LA HORA DE EXPORTAR LOS DATOS A FORMATO JSON
	 */
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
