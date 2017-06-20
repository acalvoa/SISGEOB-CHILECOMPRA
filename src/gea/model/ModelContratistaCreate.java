package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="GEO_CONTRATISTAS",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)
public class ModelContratistaCreate extends ModelBase{
	//DEFINIMOS LOS ATRIBUTOS
	@ModelField
	public String CREADO;
	@ModelField
	public String C_ESTADO;
	@ModelField
	public String C_RUT;
	@ModelField
	public String F_CREACION;
	@ModelField
	public String F_MODIFICA;
	@ModelField
	public String MODIFICADO;
	@ModelField
	public String T_APELLIDOS;	
	@ModelField
	public String T_NOMBRE;
	@ModelField
	public int X_CONT;
}
