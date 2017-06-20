package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="GEO_UBICACIONES_PROYECTO",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)
public class ModelUbicacionProyecto extends ModelBase{
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
	public int X_UBIC;
	@ModelField
	public int PROY_X_PROY;
	@ModelField
	public int REGI_X_REGI;
	@ModelField
	public int PROV_X_PROV;
	@ModelField
	public int COMU_X_COMU;
	
		
}
