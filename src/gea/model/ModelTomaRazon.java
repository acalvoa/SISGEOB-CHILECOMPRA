package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="GEO_TOMAS_RAZON",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)
public class ModelTomaRazon extends ModelBase{
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
	public int X_TORA;
	@ModelField
    public int TDTR_X_TDTR;
	@ModelField
	public String F_DOCUMENTO;
	@ModelField
	public String C_NUMERO_DOCUMENTO;
	@ModelField
	public int N_ANHO_DOCUMENTO;
	@ModelField
	public int UORG_X_UORG;
	@ModelField
	public int RETR_X_RETR;
	@ModelField
	public String F_PROC_TOMA_RAZON;
	@ModelField
	public int PROY_X_PROY;	
		
}
