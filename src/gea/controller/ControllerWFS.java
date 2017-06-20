package gea.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.security.InvalidKeyException;
import java.util.Iterator;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONML;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.google.gson.JsonArray;

import gea.framework.*;
import gea.model.*;
import gea.packet.PacketErCode;
import gea.utils.Exception.Error403Exception;
import gea.utils.Exception.Error404Exception;
import gea.utils.Exception.Error500Exception;
import gea.utils.Exception.ErrorCodeException;

public class ControllerWFS extends ControllerBase{
	public static void request(Request req, Response res) throws ErrorCodeException, JSONException, Error500Exception, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
		String service = req.getData().getString("SERVICE");
		String id = req.getData().getString("ID");
		if(service.indexOf("{{ID}}") != -1){
			//CORREGIMOS EL SERVICIO
			service = service.replace("{{ID}}", id);
			// LEEMOS EL XML
			JSONObject data = new JSONObject();
			data.put("DATA", new JSONObject());
			data.put("SPATIAL", new JSONArray());
			try{
				DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
				DocumentBuilder builder = factory.newDocumentBuilder();
				Document document = builder.parse(service);
				JSONObject wfs = JSONML.toJSONObject(DocumentToString(document));
				JSONArray p = wfs.getJSONArray("childNodes");
				JSONArray features = p.getJSONObject(0).getJSONArray("childNodes");
				for(int i=0; i<features.length(); i++){
					JSONArray feature = features.getJSONObject(i).getJSONArray("childNodes");
					for(int l=0; l<feature.length(); l++){
						String name = feature.getJSONObject(l).getString("tagName");
						if(name.equals("GEOCGR_DATA_WFS:MODALIDAD_CONTRATACION")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("MODALIDAD", feature.getJSONObject(l).getJSONArray("childNodes").getInt(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:FINANCIAMIENTO")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("FINANCIAMIENTO", feature.getJSONObject(l).getJSONArray("childNodes").getInt(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:NOMBRE_CORTO")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("SHORTNAME", feature.getJSONObject(l).getJSONArray("childNodes").getString(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:COMUNA")){
							if(data.getJSONObject("DATA").has("COMUNA")){
								if(feature.getJSONObject(l).has("childNodes")){
									JSONArray a_comunas = feature.getJSONObject(l).getJSONArray("childNodes");
									for(int k=0; k< a_comunas.length(); k++){
										JSONObject e_comuna = a_comunas.getJSONObject(k);
										if(e_comuna.getString("tagName").equals("GEOCGR_DATA_WFS:COMUNAS")){
											Model<ModelComuna> comuna = new Model<ModelComuna>(ModelComuna.class,req);
											JSONObject query = new JSONObject();
											System.out.println(e_comuna);
											if(e_comuna.getJSONArray("childNodes").get(0).getClass().getName().equals("java.lang.Long") || e_comuna.getJSONArray("childNodes").get(0).getClass().getName().equals("java.lang.Integer")){
												query.put("NUMERO", String.valueOf(e_comuna.getJSONArray("childNodes").getInt(0)));
											}
											else
											{
												query.put("NUMERO", e_comuna.getJSONArray("childNodes").getString(0));
											}
											ModelResult<ModelComuna> resultado = comuna.find(query.toString());
											JSONObject com = new JSONObject();
											com.put("NOMBRE", resultado.toJSON().getJSONObject(0).getString("NOMBRE"));
											com.put("CENTROIDE", resultado.toJSON().getJSONObject(0).get("CENTROIDE"));
											com.put("NUMERO", resultado.toJSON().getJSONObject(0).getString("NUMERO"));
											if(!data.getJSONObject("DATA").getJSONObject("COMUNA").has(resultado.toJSON().getJSONObject(0).getString("NOMBRE"))){
												data.getJSONObject("DATA").getJSONObject("COMUNA").put(resultado.toJSON().getJSONObject(0).getString("NOMBRE"), com);
											}
										}
									}
								}
							}
							else
							{
								data.getJSONObject("DATA").put("COMUNA", new JSONObject());
								if(feature.getJSONObject(l).has("childNodes")){
									JSONArray a_comunas = feature.getJSONObject(l).getJSONArray("childNodes");
									for(int k=0; k< a_comunas.length(); k++){
										JSONObject e_comuna = a_comunas.getJSONObject(k);
										if(e_comuna.getString("tagName").equals("GEOCGR_DATA_WFS:COMUNAS")){
											Model<ModelComuna> comuna = new Model<ModelComuna>(ModelComuna.class,req);
											JSONObject query = new JSONObject();
											if(e_comuna.getJSONArray("childNodes").get(0).getClass().getName().equals("java.lang.Long") || e_comuna.getJSONArray("childNodes").get(0).getClass().getName().equals("java.lang.Integer")){
												query.put("NUMERO", String.valueOf(e_comuna.getJSONArray("childNodes").getInt(0)));
											}
											else
											{
												query.put("NUMERO", e_comuna.getJSONArray("childNodes").getString(0));
											}
											ModelResult<ModelComuna> resultado = comuna.find(query.toString());
											JSONObject com = new JSONObject();
											com.put("NOMBRE", resultado.toJSON().getJSONObject(0).getString("NOMBRE"));
											com.put("CENTROIDE", resultado.toJSON().getJSONObject(0).get("CENTROIDE"));
											com.put("NUMERO", resultado.toJSON().getJSONObject(0).getString("NUMERO"));
											if(!data.getJSONObject("DATA").getJSONObject("COMUNA").has(resultado.toJSON().getJSONObject(0).getString("NOMBRE"))){
												data.getJSONObject("DATA").getJSONObject("COMUNA").put(resultado.toJSON().getJSONObject(0).getString("NOMBRE"), com);
											}
										}
									}
								}
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:FECHA_INI")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("FECHA_INI", feature.getJSONObject(l).getJSONArray("childNodes").getString(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:FECHA_FIN")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("FECHA_FIN", feature.getJSONObject(l).getJSONArray("childNodes").getString(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:CLASIFICACION")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("CLASIFICACION", feature.getJSONObject(l).getJSONArray("childNodes").getInt(0));			
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:SUBCLASIFICACION")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("SUBCLASIFICACION", feature.getJSONObject(l).getJSONArray("childNodes").getInt(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:TIPO_LICITACION")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("TIPO_LICITACION", feature.getJSONObject(l).getJSONArray("childNodes").getString(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:CAUSA_LICITACION")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("CAUSA_LICITACION", feature.getJSONObject(l).getJSONArray("childNodes").getInt(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:NORMA")){
							if(feature.getJSONObject(l).has("childNodes")){
								if(feature.getJSONObject(l).getJSONArray("childNodes").get(0).getClass().getName().equals("java.lang.Long") || feature.getJSONObject(l).getJSONArray("childNodes").get(0).getClass().getName().equals("java.lang.Integer")){
									data.getJSONObject("DATA").put("NORMA", feature.getJSONObject(l).getJSONArray("childNodes").getInt(0));
								}
								else
								{
									data.getJSONObject("DATA").put("NORMA", feature.getJSONObject(l).getJSONArray("childNodes").getString(0));
								}
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:MONTO_CONTRATADO")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("MONTO_CONTRATADO", feature.getJSONObject(l).getJSONArray("childNodes").getInt(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:ADJUDICACION_DATE")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("ADJUDICACION_DATE", feature.getJSONObject(l).getJSONArray("childNodes").getString(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:CODIGO_BIP")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("CODIGO_BIP", feature.getJSONObject(l).getJSONArray("childNodes").getLong(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:DV_BIP")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("DV_BIP", feature.getJSONObject(l).getJSONArray("childNodes").getInt(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:CODIGO_INI")){
							if(feature.getJSONObject(l).has("childNodes")){
								data.getJSONObject("DATA").put("CODIGO_INI", feature.getJSONObject(l).getJSONArray("childNodes").getLong(0));
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:POINT")){
							if(feature.getJSONObject(l).has("childNodes")){
								if(feature.getJSONObject(l).getJSONArray("childNodes").length() > 0){
									JSONObject spatial = feature.getJSONObject(l).getJSONArray("childNodes").getJSONObject(0);
									if(spatial.has("childNodes")){
										JSONArray puntos = spatial.getJSONArray("childNodes");
										for(int k=0; k<puntos.length(); k++){
											JSONArray point = puntos.getJSONObject(k).getJSONArray("childNodes").getJSONObject(0).getJSONArray("childNodes");
											String[] coordenadas = point.getJSONObject(0).getJSONArray("childNodes").getString(0).replaceAll(", ", ",").split(",");
											JSONObject coord = new JSONObject();
											coord.put("LAT", Double.valueOf(coordenadas[1].trim()));
											coord.put("LNG", Double.valueOf(coordenadas[0].trim()));
											coord.put("TYPE", "POINT");
											data.getJSONArray("SPATIAL").put(coord);
										}
									}
								}
							}
						}
						else if(name.equals("GEOCGR_DATA_WFS:LINE")){
							if(feature.getJSONObject(l).has("childNodes")){
								if(feature.getJSONObject(l).getJSONArray("childNodes").length() > 0){
									JSONArray spatial = feature.getJSONObject(l).getJSONArray("childNodes");
									for(int k=0; k<spatial.length(); k++){
										String point = spatial.getJSONObject(k).getJSONArray("childNodes").getJSONObject(0).getJSONArray("childNodes").getJSONObject(0).getJSONArray("childNodes").getJSONObject(0).getJSONArray("childNodes").getString(0);
										point = point.replaceAll(", ", ",");
										String[] coordenadas = point.split(" ");
										JSONArray coords = new JSONArray();
										for(int j=0; j<coordenadas.length; j++){
											String[] puntos = coordenadas[j].split(",");
											JSONObject spa = new JSONObject();
											spa.put("LAT", Double.valueOf(puntos[1]));
											spa.put("LNG", Double.valueOf(puntos[0]));
											coords.put(spa);
										}
										JSONObject coord = new JSONObject();
										coord.put("SPATIAL", coords);
										coord.put("TYPE", "LINESTRING");
										data.getJSONArray("SPATIAL").put(coord);
									}
								}
							}
						}
					}
					
				}
				JSONObject response = new JSONObject();
				response.put("STATUS",1);
				response.put("ERROR", "NOTERROR");
				response.put("DATA", data);
				res.SendCallback(response);
			}
			catch (SAXException e) {
				// TODO Auto-generated catch blockS
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				JSONObject response = new JSONObject();
				response.put("STATUS",0);
				response.put("ERROR", "ERROR");
				res.SendCallback(response);
			} catch (ParserConfigurationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Error403Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}		
		}
		else{
			JSONObject response = new JSONObject();
			response.put("STATUS",-1);
			response.put("ERROR", "El servicio indicado no posee un campo ID que utilizar.");
			res.SendCallback(response);
		}
	}
	public static String DocumentToString(Document doc) {
	    ByteArrayOutputStream baos = new ByteArrayOutputStream();
	    ElementToStream(doc.getDocumentElement(), baos);
	    return new String(baos.toByteArray());
	}
	public static void ElementToStream(Element element, OutputStream out) {
	    try {
	      DOMSource source = new DOMSource(element);
	      StreamResult result = new StreamResult(out);
	      TransformerFactory transFactory = TransformerFactory.newInstance();
	      Transformer transformer = transFactory.newTransformer();
	      transformer.transform(source, result);
	    } catch (Exception ex) {
	    }
	}
}
