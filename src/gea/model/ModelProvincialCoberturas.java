package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.CENTROID;
import gea.types.GEOM;
import gea.types.PRESITIONGEOM;
@ModelParam(
		tableName="COBERTURAS_PROVINCIALES",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelProvincialCoberturas extends ModelBase{
	//DEFINIMOS LOS STRIBUTOS
	@ModelField
	public PRESITIONGEOM SPATIAL_OBJECT;
	@ModelField
	public String NUMERO;
	@ModelField
	public String NOMBRE;

	@Override
	protected void toJSON(ArrayList<String> mapa){
		mapa.remove("REGION");
	}
}