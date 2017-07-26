package gea.mercadopublico;

import org.json.JSONArray;
import org.json.JSONObject;

public interface MPData {
	public String getDESCRIPCION();
	public Integer getTOMARAZON();
	public Integer getPLAZOBRA();
	public Integer getUNIDATIEMPO();
	public Integer getMONEDA();
	public String getTIPO();
	public JSONArray getITEMS();
	public String getTITULOPROY();
	public String getCODIGOMP();
	public String getPROCECONTRATACION();
	public String getTIPODOC();
	public String getMPSTRING();
	public String getMONTOESTIMADO();
	public boolean verifyData();
	public boolean isOC();
	public JSONObject getData();
}
