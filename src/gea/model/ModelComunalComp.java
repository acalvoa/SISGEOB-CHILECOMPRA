package gea.model;
import gea.annotation.ModelField;
import gea.annotation.ModelParam;
import gea.types.CENTROID;
import gea.types.PRESITIONGEOM;
@ModelParam(
		tableName="DATOS_COMUNALES_COMP",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelComunalComp extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public String NOMBRE;
	@ModelField
	public int PROVINCIA;
	@ModelField
	public int REGION;
	@ModelField
	public int COMUNA;
	@ModelField
	public String NUMERO;
	
}