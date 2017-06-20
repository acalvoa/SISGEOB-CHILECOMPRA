package gea.auth;

import gea.framework.Model;
import gea.model.ModelAuth;
import gea.utils.Exception.Error403Exception;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Random;

import org.json.JSONException;
import org.json.JSONObject;

public class Authprocess {
	String key;
	String id;
	String begin;
	String finish;
	public Authprocess(String id) {
		super();
		this.id = id;
		this.genetatekey();
		this.setTime();
	}
	public Authprocess(String id,String key) {
		super();
		this.id = id;
		this.key = key;
	}
	private void setTime() {
		SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		Date t1 = new Date(System.currentTimeMillis());
		Date t2 = new Date(System.currentTimeMillis()+(3600*1000*3));
		this.begin = format.format(t1);
		this.finish = format.format(t2);
	}
	private void genetatekey() {
		BigInteger p = BigInteger.probablePrime(127, new Random());
		String key = p+this.key+(p.pow((int)(Math.random()*100)));
		this.key = this.getMD5(key);
	}
	private String getMD5(String input) {
	    try {
	      MessageDigest md = MessageDigest.getInstance("MD5");
	      md.update(input.getBytes());
	      byte[] enc = md.digest();
	      String md5Sum = new sun.misc.BASE64Encoder().encode(enc);
	      return md5Sum;
	    } catch (NoSuchAlgorithmException nsae) {
	      System.out.println(nsae.getMessage());
	      return null;
	    }
	}
	public JSONObject negotiate() throws Error403Exception, IOException{
		if(this.id != "" && this.id != null){
			Model<ModelAuth> auth = new Model<ModelAuth>(ModelAuth.class);
			JSONObject json = new JSONObject();
			json.put("KEY", this.key);
			json.put("ID", this.id);
			json.put("CREATETIME", this.begin);
			json.put("FINISHTIME", this.finish);
			return this.getResponse(auth.insert(json.toString()), "Error al registrar llave en servidor.");
		}
		else
		{
			return this.getResponse(false, "El ID de mercado publico no puede estar vacio.");
		}
	}
	private JSONObject getResponse(boolean b, String code) throws JSONException, UnsupportedEncodingException {
		JSONObject json = new JSONObject();
		if(b){
			json.put("KEY", URLEncoder.encode(this.key,"UTF-8"));
			json.put("STATUS", "OK");
		}
		else
		{
			json.put("ID", this.id);
			json.put("STATUS", "FAIL");
			json.put("ERROR", code);
		}
		return json;
	}

}
