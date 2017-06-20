package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
@ModelParam(
		tableName="GEO_IDS_MERCADO_UNICO",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true,
		NextVal=true
)
public class ModelIdsMercadoUnico extends ModelBase{
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
	public int X_IDMU;
	@ModelField
	public String C_ID_MERC_UNICO;
	@ModelField
	public int PROY_X_PROY;
	@ModelField
	public int LINEA;
	@ModelField
	public String ENTIDAD;
	@ModelField
	public String CODIGO_ENTIDAD;
	@ModelField
	public int X_ENTIDAD;
			
}
