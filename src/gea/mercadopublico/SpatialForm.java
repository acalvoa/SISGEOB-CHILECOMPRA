package gea.mercadopublico;

import org.json.JSONArray;
import org.json.JSONObject;

public class SpatialForm {
	public JSONArray POINTS;
	public JSONArray LINES;
	public String SPATIAL_TOOL; 
	
	public SpatialForm(JSONObject spatial) {
		this.POINTS = spatial.getJSONArray("point");
		this.LINES = spatial.getJSONArray("line");
		if(spatial.getInt("spatial_tool") == 1){
			this.SPATIAL_TOOL = "DRAW";
		}
		if(spatial.getInt("spatial_tool") == 2){
			this.SPATIAL_TOOL = "KML";
		}
		if(spatial.getInt("spatial_tool") == 3){
			this.SPATIAL_TOOL = "NOUBICATION";
		}
	}
}
