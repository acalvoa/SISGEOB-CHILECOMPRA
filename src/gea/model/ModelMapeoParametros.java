package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="DATOS_MAPEO",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)
public class ModelMapeoParametros extends ModelBase{
	//DEFINIMOS LOS ATRIBUTOS
	@ModelField
	public int NUMERO;
	@ModelField
	public int CODIGO;
	@ModelField
	public String VALORIGEN;
	@ModelField
	public String VALDESTINO;
	
		
}
