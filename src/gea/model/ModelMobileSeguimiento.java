package gea.model;
import java.util.ArrayList;

import gea.annotation.*;
import gea.types.GEOM;
import gea.types.OBRA;
@ModelParam(
		tableName="MOBILE_SEGUIMIENTO",
		Find=true,
		FindOne=true,
		Update=true,
		Delete=true,
		ToJSON=true
)
public class ModelMobileSeguimiento extends ModelBase{
	//DEFINIMOS LOS ATRIBUTOS
	@ModelField
	public int CODIGO;
	@ModelField
	public String FECHA;
	@ModelField
	public String TITULO;
	@ModelField
	public String VALORPROM;
	@ModelField
	public String VALOR;
	@ModelField
	public String COMPARTIR ;
	@ModelField
	public String ALERTA;
	@ModelField
	public String VISUALIZO;
	
	@Override
	protected void toJSON(ArrayList<String> mapa){
	}
}
