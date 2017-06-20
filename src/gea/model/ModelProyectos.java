package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="GEO_PROYECTOS",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)
public class ModelProyectos extends ModelBase{
	//DEFINIMOS LOS ATRIBUTOS
	@ModelField
	@FieldDefaultString(defaults="GEOCGR")
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
	@FieldDefaultString(defaults="N")
	public String C_TIPO_REGISTRO;
	@ModelField
	public String D_DESCRIPCION;
	@ModelField
	public String C_EXENTO_AFECTO;
	@ModelField
	public int X_PROY;
	@ModelField
	public String C_TIPO_PROYECTO;
	@ModelField
	public String T_TITULO_PROYECTO;
	@ModelField
	public int UORG_X_UORG;
	@ModelField
	public int CLAS_X_CLAS;
	@ModelField
	public int SUBC_X_SUBC;
	@ModelField
	@FieldDefaultString(defaults="S")
	public String C_NO_BIP;
	@ModelField
	@FieldDefaultString(defaults="S")
	public String C_NO_INI;
	@ModelField
	public String EXPE_X_EXPE_TREWA;
	@ModelField
	public String TITULO_CORTO;
	
}
