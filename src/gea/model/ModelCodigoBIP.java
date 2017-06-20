package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="GEO_CODIGOS_BIP",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)
public class ModelCodigoBIP extends ModelBase{
	//DEFINIMOS LOS ATRIBUTOS
	@ModelField
	public String CREADO;
	@ModelField
	public String F_CREACION;
	@ModelField
	@FieldDefaultString(defaults="N")
	public String MODIFICADO;
	@ModelField
	@FieldDefaultString(defaults="01-01-1900")
	public String F_MODIFICA;
	@ModelField
	public int X_CBIP;
	@ModelField
	public String C_BIP;
	@ModelField
	public int PROY_X_PROY;            
	
		
}
