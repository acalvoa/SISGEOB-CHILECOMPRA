package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="DATOS_CONTRATISTAS",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)
public class ModelContratista extends ModelBase{
	//DEFINIMOS LOS ATRIBUTOS
	@ModelField
	public int NUMERO;
	@ModelField
	public String RUT;
	@ModelField
	public String NOMBRE;
	@ModelField
	public String APELLIDOS;
	
		
}
