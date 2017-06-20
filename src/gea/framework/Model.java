package gea.framework;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;

import oracle.jdbc.OraclePreparedStatement;
import oracle.spatial.geometry.JGeometry;
import oracle.sql.STRUCT;

import org.apache.commons.lang3.StringEscapeUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import SPATIAL.LineType;
import SPATIAL.MultiGeometryType;
import SPATIAL.PointType;
import SPATIAL.Spatial;
import SPATIAL.SpatialBase;
import gea.adapters.OracleConnector;
import gea.annotation.FieldDefaultInt;
import gea.annotation.FieldDefaultString;
import gea.annotation.ModelField;
import gea.annotation.ModelFieldRequired;
import gea.annotation.ModelParam;
import gea.model.*;
import gea.types.GEOM;
import gea.types.OBJECT;
import gea.types.OBRA;
import gea.types.PRESITIONGEOM;
import gea.types.SDO_GEOMETRY;
import gea.utils.Exception.Error403Exception;

public class Model<T extends ModelBase> extends ModelConfig{
	Class attributes;
	boolean DEBUG = false;
	ArrayList<String> fields = new ArrayList<String>();
	private Request req = null;
	//DEFINIMOS EL CONSTRUCTOR
	public Model(Class c, Request req){
		this.attributes = c;
		this.config();
		this.loadField();
		this.req = req;
	}
	//DEFINIMOS EL CONSTRUCTOR
		public Model(Class c){
			this.attributes = c;
			this.config();
			this.loadField();
		}
	//DEFINIMOS EL METODO QUE SETEA LOS FIELD
	private void loadField(){
		for(Field a:attributes.getFields()){
			if(a.getAnnotation(ModelField.class) == null) 
			{
				continue;
			}
			fields.add(a.getName());
		}
	}
	// METODO PARA EXTRAER TODO EL CONTENIDO DE LA BASE DE DATOS EN TORNO AL MODELO
	public ModelResult<T> getAll() throws Error403Exception, IOException{
		if(!this.Getall) throw new Error403Exception("Operacion no permitida en modelo de datos");
		ModelResult<T> retorno = new ModelResult<T>();
		try{
			StringBuilder query;
			
						
				query = new StringBuilder("SELECT ");
				for(int i=0; i<fields.size(); i++){
					Field f = attributes.getField(fields.get(i));
					if(f.getType().isPrimitive() || f.getType() == String.class)
					{
						query.append(fields.get(i)+",");
					}
					else{
						try{
							
							Method method = f.getType().getMethod("GetSQL", String.class);
							query.append(method.invoke(null, fields.get(i)));
						}
						catch(Exception e){
							new Error403Exception("Error al convertir al objeto del modelo.\n" + e.getMessage());
						}
					}
				}
				query.deleteCharAt(query.length()-1);
				query.append(" FROM "+this.TableName);
				
			
			OracleConnector ora;
			ora = new OracleConnector();
			ora.connect();
			if(DEBUG) System.out.println(query.toString());
			ResultSet res = ora.query(query.toString());
			if(res != null){
				while(res.next()){
					T aux = (T)attributes.newInstance();
					for(String g:fields){
						Field f = attributes.getField(g);
						if(f.getType() == int.class){
							aux.getClass().getField(g).set(aux, res.getInt(g));
						}
						else if(f.getType() == double.class){
							aux.getClass().getField(g).set(aux, res.getDouble(g));
						}
						else if(f.getType() == long.class){
							aux.getClass().getField(g).set(aux, res.getLong(g));
						}
						else if(f.getType() == String.class){
							aux.getClass().getField(g).set(aux, res.getString(g));
						}
						else{
							try{
								aux.getClass().getField(g).set(aux, f.getType().getConstructor(String.class).newInstance(res.getString(g)));
							}
							catch(Exception e)
							{
								new Error403Exception("Error al convertir al objeto del modelo.\n" + e.getMessage());
							}
						}
					}
					retorno.add(aux);
				}
			}
			ora.close();
		}
		catch (SecurityException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (NoSuchFieldException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return retorno;
	}
	// METODO PARA CONSULTAS AVANZADAS
	public ModelResult<T> specialQuery(OraclePreparedStatement sta, OracleConnector ora) throws SQLException, InstantiationException, IllegalAccessException, IllegalArgumentException, SecurityException, NoSuchFieldException{
		ModelResult<T> retorno = new ModelResult<T>();
		ResultSet res = sta.executeQuery();
		if(res != null){
			while(res.next()){
				T aux = (T)attributes.newInstance();
				for(String g:fields){
					Field f = attributes.getField(g);
					if(f.getType() == int.class){
						aux.getClass().getField(g).set(aux, res.getInt(g));
					}
					else if(f.getType() == double.class){
						aux.getClass().getField(g).set(aux, res.getDouble(g));
					}
					else if(f.getType() == long.class){
						aux.getClass().getField(g).set(aux, res.getLong(g));
					}
					else if(f.getType() == String.class){
						aux.getClass().getField(g).set(aux, res.getString(g));
					}
					else{
						try{
							aux.getClass().getField(g).set(aux, f.getType().getConstructor(String.class).newInstance(res.getString(g)));
						}
						catch(Exception e)
						{
							new Error403Exception("Error al convertir al objeto del modelo.\n"+e.getMessage());
						}
					}
				}
				retorno.add(aux);
			}
		}
		ora.closeQuery();
		return retorno;
	}
	// METODO PARA EXTRAER TODO EL CONTENIDO DE LA BASE DE DATOS EN TORNO AL MODELO
		public ModelResult<T> getAll(int limit) throws Error403Exception, IOException{
			if(!this.Getall) throw new Error403Exception("Operacion no permitida en modelo de datos");
			ModelResult<T> retorno = new ModelResult<T>();
			try{
				StringBuilder query = new StringBuilder("SELECT ");
				StringBuilder limite = new StringBuilder("SELECT ");
				for(int i=0; i<fields.size(); i++){
					Field f = attributes.getField(fields.get(i));
					limite.append(fields.get(i)+",");
					if(f.getType().isPrimitive() || f.getType() == String.class)
					{
						query.append(fields.get(i)+",");
					}
					else{
						try{
							
							Method method = f.getType().getMethod("GetSQL", String.class);
							query.append(method.invoke(null, fields.get(i)));
						}
						catch(Exception e){
							new Error403Exception("Error al convertir al objeto del modelo. \n"+e.getMessage());
						}
					}
				}
				query.deleteCharAt(query.length()-1);
				limite.deleteCharAt(limite.length()-1);
				query.append(" FROM "+this.TableName);
				limite.append(" FROM ("+query.toString()+") where ROWNUM <= "+limit);
				query = limite;
				OracleConnector ora;
				ora = new OracleConnector();
				ora.connect();
				if(DEBUG) System.out.println(query.toString());
				ResultSet res = ora.query(query.toString());
				if(res != null){
					while(res.next()){
						T aux = (T)attributes.newInstance();
						for(String g:fields){
							Field f = attributes.getField(g);
							if(f.getType() == int.class){
								aux.getClass().getField(g).set(aux, res.getInt(g));
							}
							else if(f.getType() == double.class){
								aux.getClass().getField(g).set(aux, res.getDouble(g));
							}
							else if(f.getType() == long.class){
								aux.getClass().getField(g).set(aux, res.getLong(g));
							}
							else if(f.getType() == String.class){
								aux.getClass().getField(g).set(aux, res.getString(g));
							}
							else{
								try{
									aux.getClass().getField(g).set(aux, f.getType().getConstructor(String.class).newInstance(res.getString(g)));
								}
								catch(Exception e)
								{
									new Error403Exception("Error al convertir al objeto del modelo.\n"+e.getMessage());
								}
							}
						}
						retorno.add(aux);
					}
				}
				ora.close();
			}
			catch (SecurityException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (NoSuchFieldException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			return retorno;
		}
	// DEFINIMOS EL METODO FIND
	public ModelResult<T> find(String p) throws Error403Exception, IOException{
		if(!this.Find) throw new Error403Exception("Operacion no permitida en modelo de datos");
		ModelResult<T> retorno = new ModelResult<T>();
		try{
			JSONObject s = new JSONObject(p);
			int limit = -1;
			if(s.has("LIMIT")){
				limit = s.getInt("LIMIT");
				s.remove("LIMIT");
			}
			StringBuilder query = new StringBuilder("SELECT ");
			if(this.TableName.equals("PORTAL_DATOS_PROVINCIALES") || this.TableName.equals("PORTAL_DATOS_COMUNALES") || this.TableName.equals("PORTAL_OBRAS_CGR")
					|| this.TableName.equals("MONTOS_CLASI_PAIS") || this.TableName.equals("MONTOS_CLASI_REGI") || this.TableName.equals("MONTOS_CLASI_COMU") || this.TableName.equals("MONTOS_CLASI_PROV")
					|| this.TableName.equals("PORTAL_DATOS_REGIONALES") || this.TableName.equals("PORTAL_RANKING_PROYECTOS_CGR") || this.TableName.equals("COBERTURAS_PROVINCIALES") || this.TableName.equals("COBERTURAS_COMUNALES")){
				Iterator i = s.keys();
				String fechaFrom="";
				String fechaTo="";
				String region="";
				String provincia="";
				String comuna="";
				String nombre="";
				String titulo="";
				String idMercadoPublico="";
				String codProyecto="";
				while(i.hasNext()){
					String llave = i.next().toString();
					if(llave.equals("FECHA_FROM")){
						fechaFrom = s.getString(llave); 
					}else if(llave.equals("FECHA_TO")){
						fechaTo = s.getString(llave);
					}else if(llave.equals("REGION")){
						region = s.getString(llave);
					}else if(llave.equals("PROVINCIA")){
						provincia = s.getString(llave);
					}else if(llave.equals("COMUNA")){
						comuna = s.getString(llave);		
					}else if(llave.equals("NOMBRE")){
						nombre = s.getString(llave);	
					}else if(llave.equals("TITULO")){
						titulo = s.getString(llave);
					}else if(llave.equals("ID_MERCADO_PUB")){
						idMercadoPublico = s.getString(llave);	
					}else if(llave.equals("CODPROYECTO")){
						codProyecto = s.getString(llave);	
					}	
				}	
				
				if(this.TableName.equals("PORTAL_DATOS_PROVINCIALES")){
					
					query = new StringBuilder("SELECT PROV.C_PROV_SUBDERE AS NUMERO, NVL(MONTO,0) AS MONTO, FECHA_ADJU, FECHA_TRAZON, PROV.T_PROVINCIA AS NOMBRE, NVL(OBRAS,0) AS OBRAS, NVL(MULTIPROV,0) AS MULTIPROV, NULL AS SPATIAL_OBJECT, SPA.CENTROIDE, SPA.FIT, PROV.C_REG_SUBDERE AS REGION ");
					query.append("FROM GEO_PROVINCIAS PROV "
							+ "INNER JOIN SPATIAL_DATA_PROVINCIAL SPA ON  SPA.CINE_PROV = PROV.C_PROV_SUBDERE "
							+ "LEFT OUTER JOIN(SELECT NUMERO, MONTO, FECHA_ADJU, FECHA_TRAZON, OBRAS, MULTIPROV ");
					query.append("FROM (SELECT NUMERO, SUM(MONTO) AS MONTO, MAX(FECHA_ADJU) AS FECHA_ADJU, MAX(FECHA_TRAZON) AS FECHA_TRAZON, SUM(OBRAS) AS OBRAS, SUM(MULTIPROV) AS MULTIPROV FROM PORTAL_DATOS_PROVINCIALES ");
					query.append("WHERE TRUNC(FECHA) BETWEEN to_date('" + fechaFrom + "','DD/MM/YYYY') AND to_date('" + fechaTo + "','DD/MM/YYYY') AND REGION = '" + region + "' ");
					query.append("GROUP BY NUMERO)) DATOS_PROV ON PROV.C_PROV_SUBDERE = DATOS_PROV.NUMERO WHERE PROV.C_ESTADO = 'S' AND PROV.C_REG_SUBDERE = '"+ region +"'");
					
				
				}else if(this.TableName.equals("PORTAL_DATOS_COMUNALES")){
					
					if(nombre.equals("") && comuna.equals("")){
											
						query = new StringBuilder("SELECT COM.C_COMUNA_SUBDERE AS NUMERO, NVL(MONTO,0) AS MONTO, FECHA_ADJU, FECHA_TRAZON, COM.T_COMUNA AS NOMBRE, NVL(OBRAS,0) AS OBRAS, NVL(MULTICOM,0) AS MULTICOM, NULL AS SPATIAL_OBJECT, SPA.CENTROIDE, SPA.FIT, P.C_REG_SUBDERE AS REGION ");
						query.append("FROM GEO_COMUNAS COM INNER JOIN GEO_PROVINCIAS P ON P.C_PROV_SUBDERE = COM.C_PROV_SUBDERE "
								+ "INNER JOIN SPATIAL_DATA_COMUNAL SPA ON  SPA.CINE_COM = COM.C_COMUNA_SUBDERE "
								+ "LEFT OUTER JOIN(SELECT NUMERO, MONTO, FECHA_ADJU, FECHA_TRAZON, OBRAS, MULTICOM ");
						query.append("FROM (SELECT NUMERO, SUM(MONTO) AS MONTO, MAX(FECHA_ADJU) AS FECHA_ADJU, MAX(FECHA_TRAZON) AS FECHA_TRAZON, SUM(OBRAS) AS OBRAS, SUM(MULTICOM) AS MULTICOM FROM PORTAL_DATOS_COMUNALES ");
						query.append("WHERE TRUNC(FECHA) BETWEEN to_date('" + fechaFrom + "','DD/MM/YYYY') AND to_date('" + fechaTo + "','DD/MM/YYYY') AND REGION = '" + region + "' GROUP BY NUMERO)) DATOS_COMU ON COM.C_COMUNA_SUBDERE = DATOS_COMU.NUMERO ");
						query.append("WHERE COM.C_ESTADO = 'S' AND P.C_REG_SUBDERE = '" + region + "'");
						
					}else{
						//Para la búsqueda Y para getOne.
						boolean prevAddedAttribute = false;
						
						query = new StringBuilder("SELECT NUMERO, MONTO, FECHA_ADJU, FECHA_TRAZON, OBRAS, MULTICOM, NULL AS SPATIAL_OBJECT, SPA.CENTROIDE, SPA.FIT, COM.T_COMUNA AS NOMBRE, REGION ");
						query.append("FROM (SELECT NUMERO, SUM(MONTO) AS MONTO, MAX(FECHA_ADJU) AS FECHA_ADJU, MAX(FECHA_TRAZON) AS FECHA_TRAZON, SUM(OBRAS) AS OBRAS, SUM(MULTICOM) AS MULTICOM, REGION FROM PORTAL_DATOS_COMUNALES WHERE ");
						if(!fechaFrom.equals("") && !fechaTo.equals("")){
							query.append("TRUNC(FECHA) BETWEEN to_date('" + fechaFrom + "','DD/MM/YYYY') AND to_date('" + fechaTo + "','DD/MM/YYYY') ");
							prevAddedAttribute=true;
						}
						
						if(!comuna.equals("")){
							if(prevAddedAttribute){
								query.append("AND ");
							}else{
								prevAddedAttribute=true;
							}
							query.append("NUMERO = '" + comuna + "' ");
						}
						if(!region.equals("")){
							if(prevAddedAttribute){
								query.append("AND ");
							}
							query.append("REGION = '" + region + "' ");
						}
						query.append("GROUP BY NUMERO, REGION)  PDR, (SELECT CENTROIDE, FIT, CINE_COM FROM SPATIAL_DATA_COMUNAL) SPA "); 
						query.append("INNER JOIN GEO_COMUNAS COM ON COM.C_COMUNA_SUBDERE = SPA.CINE_COM WHERE SPA.CINE_COM = PDR.NUMERO");
						if(!nombre.equals("")){
							query.append(" AND COM.T_COMUNA LIKE '" + nombre + "' ");
						}
					}
				
				}else if(this.TableName.equals("PORTAL_OBRAS_CGR")){
					boolean prevAddedAttribute = false;
					
					query = new StringBuilder("SELECT CREADOPOR, REGION, PROVINCIA, COMUNA, TREGION, TPROVINCIA, TCOMUNA, SERV_MAND, SERV_CONTR, CCLASIFICACION, CLASIFICACION, AVANCE_FIN, F_AVANCE_FIN, AVANCE_FIS, F_AVANCE_FIS, FECHA_INI, FECHA_FIN, PLAZO_EJE, UNIDAD_EJE, DESCRIPCION, ID_MERCADO_PUB, CODIGO_BIP, CODIGO_INI, TIPO_FIN, PROC_CONTRATACION, MONTO_CONTRATADO, NOMBRE_INSP_FIS, APELLIDO_P_INSP_FIS, APELLIDO_M_INSP_FIS, RUN_INSP_FIS, NOMBRE_CONTRATIS, APELLIDOS_CONTRATIS, RUT_CONTRATIS, NOMBRE_CONSORCIO, APELLIDOS_CONSORCIO, RUT_CONS, SDO_UTIL.TO_GMLGEOMETRY(SPATIAL_OBJECT) AS SPATIAL_OBJECT, CODPROYECTO, X_EXPE, TITULO, MULTIDPA, MULTIREG, MULTIPROV, MULTICOM, F_ADJUDICACION, F_TRAZON, LIQUIDACION, T_ANTICIPADO, RECEPCION, SPATIAL_TOOL, FEC_TERMINO, FEC_RECEPCION, FEC_LIQUIDACION, F_INI_AVANCE, F_TER_AVANCE, TRUNC(FECHA) FECHA " + 
					"FROM " + this.TableName + " WHERE ");
					
					if(!fechaFrom.equals("") && !fechaTo.equals("")){
						query.append("TRUNC(FECHA) BETWEEN to_date('" + fechaFrom + "','DD/MM/YYYY') AND to_date('" + fechaTo + "','DD/MM/YYYY') ");
						prevAddedAttribute=true;
					}
					if(!comuna.equals("")){
						if(prevAddedAttribute){
							query.append("AND ");
						}else{
							prevAddedAttribute=true;
						}
						query.append("COMUNA = " + comuna);
					} 
					if (!provincia.equals("")){
						if(prevAddedAttribute){
							query.append("AND ");
						}else{
							prevAddedAttribute=true;
						}
						query.append("PROVINCIA = " + provincia);
					}
					if (!titulo.equals("")){
						if(prevAddedAttribute){
							query.append("AND ");
						}else{
							prevAddedAttribute=true;
						}
						query.append("TITULO LIKE '" + titulo + "'");	
					}
					if (!idMercadoPublico.equals("")){
						if(prevAddedAttribute){
							query.append("AND ");
						}else{
							prevAddedAttribute=true;
						}
						query.append("ID_MERCADO_PUB LIKE '" + idMercadoPublico + "'");	
					}
					if (!codProyecto.equals("")){
						if(prevAddedAttribute){
							query.append("AND ");
						}
						query.append("CODPROYECTO = " + codProyecto);	
					}
				}else if(this.TableName.equals("MONTOS_CLASI_PAIS")){
					
					query = new StringBuilder("SELECT OP.X_CLAS AS NUMERO, OP.T_CLASIFICACION AS NOMBRE, NVL(PAIS.MONTO,0) MONTO, NVL(PAIS.OBRAS,0) OBRAS ");
					query.append("FROM GEO_OP_TIPOS_CLASIFICACIONES OP LEFT OUTER JOIN (SELECT PROY.NUMERO AS NUMERO, PROY.MONTO AS MONTO, PROY.OBRAS AS OBRAS FROM (SELECT OBRAS.CCLASIFICACION AS NUMERO, OBRAS.CLASIFICACION AS NOMBRE, NVL(SUM(OBRAS.MONTO_CONTRATADO),0) AS MONTO, COUNT(OBRAS.X_EXPE) AS OBRAS ");
					query.append("FROM (SELECT DISTINCT X_EXPE,CCLASIFICACION,CLASIFICACION, MONTO_CONTRATADO FROM PORTAL_OBRAS_CGR ");
					query.append("WHERE TRUNC(FECHA) BETWEEN TO_DATE('" + fechaFrom + "','DD/MM/YYYY') AND TO_DATE('" + fechaTo + "','DD/MM/YYYY')) OBRAS GROUP BY CCLASIFICACION, CLASIFICACION) PROY) PAIS ON PAIS.NUMERO = OP.X_CLAS WHERE OP.C_ESTADO = 'S'");	
					
				}else if(this.TableName.equals("MONTOS_CLASI_REGI")){
				
					query = new StringBuilder("SELECT OBRAS.CLASIFICACION AS NOMBRE, OBRAS.CCLASIFICACION AS NUMERO, OBRAS.REGION AS REGION, OBRAS.TREGION AS NOMBRE_REG, NVL(OBRAS.MONTO_CONTRATADO,0) AS MONTO, NVL(OBRAS.NUMOBRAS,0) AS OBRAS ");
					query.append("FROM (SELECT COUNT(*) AS NUMOBRAS, CCLASIFICACION, CLASIFICACION, REGION, TREGION, SUM(MONTO_CONTRATADO) AS MONTO_CONTRATADO FROM (SELECT DISTINCT OBRA.X_EXPE, OBRA.CCLASIFICACION, OBRA.CLASIFICACION, OBRA.REGION,OBRA.TREGION, OBRA.MONTO_CONTRATADO FROM PORTAL_OBRAS_CGR OBRA ");
					
					query.append("WHERE TRUNC(FECHA) BETWEEN TO_DATE('" + fechaFrom + "','DD/MM/YYYY') AND TO_DATE('" + fechaTo + "','DD/MM/YYYY')");
					if(region != null && !region.equals("")){
						query.append(" AND REGION = " + region);
					}
					query.append(") OBRA GROUP BY OBRA.CCLASIFICACION, OBRA.REGION, OBRA.TREGION, OBRA.CLASIFICACION) OBRAS");
					
				}else if(this.TableName.equals("MONTOS_CLASI_COMU")){
					
					query = new StringBuilder("SELECT OBRAS.CLASIFICACION AS NOMBRE, OBRAS.CCLASIFICACION AS NUMERO, OBRAS.REGION AS REGION, OBRAS.COMUNA AS COMUNA, OBRAS.TCOMUNA AS NOMBRE_PROVI, NVL(OBRAS.MONTO_CONTRATADO,0) AS MONTO, NVL(OBRAS.NUMOBRAS,0) AS OBRAS ");
					query.append("FROM (SELECT COUNT(*) AS NUMOBRAS, CCLASIFICACION, CLASIFICACION, REGION, TREGION, COMUNA, TCOMUNA, SUM(MONTO_CONTRATADO) AS MONTO_CONTRATADO FROM (SELECT DISTINCT OBRA.X_EXPE, OBRA.CCLASIFICACION, OBRA.CLASIFICACION, OBRA.REGION,OBRA.TREGION, OBRA.COMUNA, OBRA.TCOMUNA, OBRA.MONTO_CONTRATADO ");
					query.append("FROM PORTAL_OBRAS_CGR OBRA WHERE TRUNC(FECHA) BETWEEN TO_DATE('" + fechaFrom + "','DD/MM/YYYY') AND TO_DATE('" + fechaTo + "','DD/MM/YYYY')");
					if(region != null && !region.equals("")){
						query.append(" AND REGION = " + region);
					}
					if(comuna != null && !comuna.equals("")){
						query.append(" AND COMUNA = " + comuna);
					}
					query.append(") OBRAS GROUP BY OBRAS.CCLASIFICACION, OBRAS.REGION, OBRAS.TREGION, OBRAS.CLASIFICACION, OBRAS.COMUNA, OBRAS.TCOMUNA) OBRAS");
				}else if(this.TableName.equals("MONTOS_CLASI_PROV")){
					
					query = new StringBuilder("SELECT OBRAS.CLASIFICACION AS NOMBRE, OBRAS.CCLASIFICACION AS NUMERO, OBRAS.REGION AS REGION, OBRAS.PROVINCIA AS PROVINCIA, OBRAS.TPROVINCIA AS NOMBRE_PROVI, NVL(OBRAS.MONTO_CONTRATADO,0) AS MONTO, NVL(OBRAS.NUMOBRAS,0) AS OBRAS ");
					query.append("FROM (SELECT COUNT(*) AS NUMOBRAS, CCLASIFICACION, CLASIFICACION, REGION, TREGION, PROVINCIA, TPROVINCIA, SUM(MONTO_CONTRATADO) AS MONTO_CONTRATADO FROM (SELECT DISTINCT OBRA.X_EXPE, OBRA.CCLASIFICACION, OBRA.CLASIFICACION, OBRA.REGION,OBRA.TREGION, OBRA.PROVINCIA, OBRA.TPROVINCIA, OBRA.MONTO_CONTRATADO ");
					query.append("FROM PORTAL_OBRAS_CGR OBRA WHERE TRUNC(FECHA) BETWEEN TO_DATE('" + fechaFrom + "','DD/MM/YYYY') AND TO_DATE('" + fechaTo + "','DD/MM/YYYY')");
					if(region != null && !region.equals("")){
						query.append(" AND REGION = " + region);
					}
					if(provincia != null && !provincia.equals("")){
						query.append(" AND PROVINCIA = " + provincia);
					}
					query.append(") OBRAS GROUP BY OBRAS.CCLASIFICACION, OBRAS.REGION, OBRAS.TREGION, OBRAS.CLASIFICACION, OBRAS.PROVINCIA, OBRAS.TPROVINCIA) OBRAS");	
					
				}else if(this.TableName.equals("PORTAL_DATOS_REGIONALES")){
					
					query = new StringBuilder("SELECT  REG.C_REGION_SUBDERE AS NUMERO, NVL(MONTO,0) AS MONTO, FECHA_ADJU, FECHA_TRAZON, REG.T_REGION AS NOMBRE, NVL(OBRAS,0) AS OBRAS, NVL(MULTIREG, 0) AS MULTIREG, NULL AS SPATIAL_OBJECT, DATOS_REGI.CENTROIDE, DATOS_REGI.FIT FROM GEO_REGIONES REG ");
					query.append("LEFT OUTER JOIN(SELECT NUMERO, MONTO, FECHA_ADJU, FECHA_TRAZON, OBRAS, MULTIREG, SPA.CENTROIDE, SPA.FIT ");
					query.append("FROM (SELECT NUMERO, SUM(MONTO) AS MONTO, MAX(FECHA_ADJU) AS FECHA_ADJU, MAX(FECHA_TRAZON) AS FECHA_TRAZON, SUM(OBRAS) AS OBRAS, SUM(MULTIREG) AS MULTIREG FROM PORTAL_DATOS_REGIONALES WHERE ");
					if(!fechaFrom.equals("") && !fechaTo.equals("")){		
						query.append("TRUNC(FECHA) BETWEEN to_date('" + fechaFrom + "','DD/MM/YYYY') AND to_date('" + fechaTo + "','DD/MM/YYYY') ");
					}
					if(!region.equals("")){			
						if(!fechaFrom.equals("") && !fechaTo.equals("")){
							query.append("AND");
						}
						query.append(" NUMERO = '" + region + "' ");
					}	
					query.append("GROUP BY NUMERO)  PDR, (SELECT CENTROIDE, FIT, C_REG FROM SPATIAL_DATA_REGIONAL) SPA WHERE SPA.C_REG = PDR.NUMERO) DATOS_REGI ON REG.C_REGION_SUBDERE = DATOS_REGI.NUMERO WHERE C_ESTADO = 'S'");
					
				}else if(this.TableName.equals("PORTAL_RANKING_PROYECTOS_CGR")){	
				
					query = new StringBuilder("SELECT F_TRAZON, CODPROYECTO, NOMBRE, FECHA_INI, MONTO, REGION, PROVINCIA, COMUNA, TCOMUNA, MULTIDPA, MULTIREG, MULTIPROV, MULTICOM, FECHA FROM " + this.TableName + " WHERE ");
					query.append("TRUNC(FECHA) BETWEEN to_date('" + fechaFrom + "','DD/MM/YYYY') AND to_date('" + fechaTo + "','DD/MM/YYYY') ");
					if(limit > -1){
						query.append(" AND ROWNUM <= " + limit);
					}
					if(!region.equals("")){
						query.append(" AND REGION = " + region);
					}
					if(!provincia.equals("")){
						query.append(" AND PROVINCIA = " + provincia);
					}
					if(!comuna.equals("")){
						query.append(" AND COMUNA = " + comuna);
					}
				}else if(this.TableName.equals("COBERTURAS_PROVINCIALES")){	
					
					query = new StringBuilder("SELECT DISTINCT C_PROV_SUBDERE AS NUMERO, T_PROVINCIA AS NOMBRE, NULL AS SPATIAL_OBJECT FROM GEO_PROVINCIAS WHERE C_ESTADO = 'S'");
					query.append(" AND C_REG_SUBDERE IN ('11', '12') ");
				
				}else if(this.TableName.equals("COBERTURAS_COMUNALES")){	
					
					query = new StringBuilder("SELECT DISTINCT COM.C_COMUNA_SUBDERE AS NUMERO, COM.T_COMUNA AS NOMBRE, NULL AS SPATIAL_OBJECT FROM GEO_COMUNAS COM INNER JOIN GEO_PROVINCIAS PROV ON COM.C_PROV_SUBDERE = PROV.C_PROV_SUBDERE WHERE COM.C_ESTADO = 'S'");
					query.append(" AND PROV.C_REG_SUBDERE IN ('11', '12') ");	
					
				}	
			}else{
			
				StringBuilder limite = new StringBuilder("SELECT ");
				for(int i=0; i<fields.size(); i++){
					Field f = attributes.getField(fields.get(i));
					limite.append(fields.get(i)+",");
					if(f.getType().isPrimitive() || f.getType() == String.class)
					{
						query.append(fields.get(i)+",");
					}
					else{
						try{
							
							Method method = f.getType().getMethod("GetSQL", String.class);
							query.append(method.invoke(null, fields.get(i)));
						}
						catch(Exception e){
							new Error403Exception("Error al convertir al objeto del modelo.\n"+e.getMessage());
						}
					}
				}
				query.deleteCharAt(query.length()-1);
				limite.deleteCharAt(limite.length()-1);
				if(limit == -1){
					query.append(" FROM "+this.TableName+" "+this.wheretxt(s));
				}
				else
				{
					
					query.append(" FROM "+this.TableName+" "+this.wheretxt(s));
					limite.append(" FROM ("+query.toString()+") where ROWNUM <= "+limit);
					query = limite;
				}
			}
			OracleConnector ora;
			ora = new OracleConnector();
			ora.connect();
			if(DEBUG) System.out.println(query.toString());
			
			
			//System.out.println("Previo a la consulta:" + new Date());
			//long startC = System.currentTimeMillis();
			
			ResultSet res = ora.query(query.toString());
			
			//long endC = System.currentTimeMillis();
			//System.out.println("Después de la consulta:" + new Date() + ". Tiempo:" + (endC - startC));
			
			//System.out.println("PRE " + query.toString());
			if(res != null){
				while(res.next()){
					T aux = (T)attributes.newInstance();
					for(String g:fields){
						Field f = attributes.getField(g);
						if(f.getType() == int.class){
							aux.getClass().getField(g).set(aux, res.getInt(g));
						}
						else if(f.getType() == double.class){
							aux.getClass().getField(g).set(aux, res.getDouble(g));
						}
						else if(f.getType() == long.class){
							aux.getClass().getField(g).set(aux, res.getLong(g));
						}
						else if(f.getType() == String.class){
							aux.getClass().getField(g).set(aux, res.getString(g));
						}
						else{
							try{
								aux.getClass().getField(g).set(aux, f.getType().getConstructor(String.class).newInstance(res.getString(g)));
							}
							catch(Exception e)
							{
								new Error403Exception("Error al convertir al objeto del modelo.\n"+e.getMessage());
							}
						}
					}
					retorno.add(aux);
				}
			}
			ora.close();
		}
		catch (SecurityException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (NoSuchFieldException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return retorno;
	}
	//DEFINIMOS EL MOTOD MATCH PARA GENERAR CAMPOS POR PATRON
	// DEFINIMOS EL METODO FIND
		public ModelResult<T> match(String p) throws Error403Exception, IOException{
			if(!this.Find) throw new Error403Exception("Operacion no permitida en modelo de datos");
			ModelResult<T> retorno = new ModelResult<T>();
			try{
				JSONObject s = new JSONObject(p);
				int limit = -1;
				if(s.has("LIMIT")){
					limit = s.getInt("LIMIT");
					s.remove("LIMIT");
				}
				StringBuilder query = new StringBuilder("SELECT ");
				Iterator i = s.keys();
				String fechaFrom="";
				String fechaTo="";
				String servicioContr="";
				String descrip = "";
				String clasif = "";
				String minAmount = "";
				String maxAmount = "";
				String minDate = "";
				String maxDate = "";
				while(i.hasNext()){
					String llave = i.next().toString();
					if(llave.equals("FECHA_FROM")){
						fechaFrom = s.getString(llave); 
					}else if(llave.equals("FECHA_TO")){
						fechaTo = s.getString(llave);
					}else if(llave.equals("SERV_CONTR")){
						servicioContr = s.getString(llave);
					}else if(llave.equals("DESCRIPCION")){
						descrip = s.getString(llave);
					}else if(llave.equals("CLASIFICACION")){
						clasif = s.getString(llave);
					}else if(llave.equals("MONTO_CONTRATADO_MIN")){
						minAmount = s.getString(llave);
					}else if(llave.equals("MONTO_CONTRATADO_MAX")){
						maxAmount = s.getString(llave);	
					}else if(llave.equals("FECHA_INI")){
						minDate = s.getString(llave);		
					}else if(llave.equals("FECHA_FIN")){
						maxDate = s.getString(llave);
					}	
				}	
				
				
				if(this.TableName.equals("PORTAL_DATOS_REGIONALES")){
					/*query = new StringBuilder("SELECT NUMERO, MONTO, FECHA_ADJU, FECHA_TRAZON, NOMBRE, OBRAS, MULTIREG, NULL AS SPATIAL_OBJECT, SPA.CENTROIDE, SPA.FIT FROM (SELECT NUMERO, SUM(MONTO) AS MONTO, MAX(FECHA_ADJU) AS FECHA_ADJU, MAX(FECHA_TRAZON) AS FECHA_TRAZON, NOMBRE, SUM(OBRAS) AS OBRAS, SUM(MULTIREG) AS MULTIREG FROM PORTAL_DATOS_REGIONALES "
					+ "WHERE FECHA BETWEEN to_date('" + fechaFrom + "','DD/MM/YYYY') AND to_date('" + fechaTo + "','DD/MM/YYYY') GROUP BY NUMERO, NOMBRE )  PDR, (SELECT CENTROIDE, FIT, C_REG FROM SPATIAL_DATA_REGIONAL) SPA WHERE SPA.C_REG = PDR.NUMERO");*/
					query = new StringBuilder("SELECT  REG.C_REGION_SUBDERE AS NUMERO, NVL(MONTO,0) AS MONTO, FECHA_ADJU, FECHA_TRAZON, REG.T_REGION AS NOMBRE, NVL(OBRAS,0) AS OBRAS, NVL(MULTIREG, 0) AS MULTIREG, NULL AS SPATIAL_OBJECT, DATOS_REGI.CENTROIDE, DATOS_REGI.FIT FROM GEO_REGIONES REG ");
					query.append("LEFT OUTER JOIN(SELECT NUMERO, MONTO, FECHA_ADJU, FECHA_TRAZON, OBRAS, MULTIREG, SPA.CENTROIDE, SPA.FIT ");
					query.append("FROM (SELECT NUMERO, SUM(MONTO) AS MONTO, MAX(FECHA_ADJU) AS FECHA_ADJU, MAX(FECHA_TRAZON) AS FECHA_TRAZON, SUM(OBRAS) AS OBRAS, SUM(MULTIREG) AS MULTIREG FROM PORTAL_DATOS_REGIONALES WHERE ");
					if(!fechaFrom.equals("") && !fechaTo.equals("")){		
						query.append("TRUNC(FECHA) BETWEEN to_date('" + fechaFrom + "','DD/MM/YYYY') AND to_date('" + fechaTo + "','DD/MM/YYYY') ");
					}
					query.append("GROUP BY NUMERO)  PDR, (SELECT CENTROIDE, FIT, C_REG FROM SPATIAL_DATA_REGIONAL) SPA WHERE SPA.C_REG = PDR.NUMERO) DATOS_REGI ON REG.C_REGION_SUBDERE = DATOS_REGI.NUMERO WHERE C_ESTADO = 'S'");
					
								
				}else if(this.TableName.equals("PORTAL_OBRAS_CGR")){
					
					query = new StringBuilder("SELECT REGION, PROVINCIA, COMUNA, TCOMUNA, SERV_MAND, SERV_CONTR, CLASIFICACION, FECHA_INI, FECHA_FIN, MONTO_CONTRATADO, CODPROYECTO, TITULO, MULTIDPA, MULTIREG, MULTIPROV, MULTICOM " + 
							"FROM PORTAL_OBRAS_CGR "+
							"WHERE TRUNC(FECHA) BETWEEN to_date('" + fechaFrom + "','DD/MM/YYYY') AND to_date('" + fechaTo + "','DD/MM/YYYY') ");  
							if(!servicioContr.equals("")){
								query.append(" AND (SERV_CONTR = '" + servicioContr + "' OR SERV_MAND= '"+ servicioContr + "')");
							}
							if (!descrip.equals("")){
								query.append(" AND UPPER(DESCRIPCION) LIKE UPPER('%" + descrip + "%')");
							}
							if (!clasif.equals("")){
								query.append(" AND CLASIFICACION LIKE '" + clasif + "'");	
							}
							if (!minAmount.equals("")){
								query.append(" AND MONTO_CONTRATADO " + minAmount );	
							}
							if (!maxAmount.equals("")){
								query.append(" AND MONTO_CONTRATADO " + maxAmount );
							}
							if (!minDate.equals("")){
								query.append(" AND FECHA_INI " + minDate);
							}
							if (!maxDate.equals("")){
								query.append(" AND FECHA_FIN " + maxDate);
							}
					
				}else{
					StringBuilder limite = new StringBuilder("SELECT ");
					for(int j=0; j<fields.size(); j++){
						Field f = attributes.getField(fields.get(j));
						limite.append(fields.get(j)+",");
						if(f.getType().isPrimitive() || f.getType() == String.class)
						{
							query.append(fields.get(j)+",");
						}
						else{
							try{
								
								Method method = f.getType().getMethod("GetSQL", String.class);
								query.append(method.invoke(null, fields.get(j)));
							}
							catch(Exception e){
								new Error403Exception("Error al convertir al objeto del modelo.\n"+e.getMessage());
							}
						}
					}
					query.deleteCharAt(query.length()-1);
					limite.deleteCharAt(limite.length()-1);
					
					if(limit == -1){
						query.append(" FROM "+this.TableName+" "+this.matchtxt(s));
					}
					else
					{
						query.append(" FROM "+this.TableName+" "+this.matchtxt(s));
						limite.append(" FROM ("+query.toString()+") where ROWNUM <= "+limit);
						query = limite;
					}
				}
				OracleConnector ora;
				ora = new OracleConnector();
				ora.connect();
				
				//System.out.println(query.toString());
				
				if(DEBUG) System.out.println(query.toString());
				ResultSet res = ora.query(query.toString());
				if(res != null){
					while(res.next()){
						T aux = (T)attributes.newInstance();
						for(String g:fields){
							Field f = attributes.getField(g);
							if(f.getType() == int.class){
								aux.getClass().getField(g).set(aux, res.getInt(g));
							}
							else if(f.getType() == double.class){
								aux.getClass().getField(g).set(aux, res.getDouble(g));
							}
							else if(f.getType() == long.class){
								aux.getClass().getField(g).set(aux, res.getLong(g));
							}
							else if(f.getType() == String.class){
								aux.getClass().getField(g).set(aux, res.getString(g));
							}
							else{
								try{
									aux.getClass().getField(g).set(aux, f.getType().getConstructor(String.class).newInstance(res.getString(g)));
								}
								catch(Exception e)
								{
									new Error403Exception("Error al convertir al objeto del modelo.\n"+e.getMessage());
								}
							}
						}
						retorno.add(aux);
					}
				}
				ora.close();
			}
			catch (SecurityException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (NoSuchFieldException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			return retorno;
		}
	//DEFINIMOS UN METODO PARA EXTRACCION DE LOS CAMPOS WHERE
	private String wheretxt(JSONObject json) throws SecurityException, NoSuchFieldException{
		StringBuilder query = new StringBuilder("WHERE ");
		Iterator i = json.keys();
		while(i.hasNext()){
			String llave = i.next().toString();
			try
			{
				JSONArray a = json.getJSONArray(llave);
				query.append(campoB(llave,json, a, true));
			}
			catch(Exception e){
				query.append(campoB(llave,json, null, false));
			}
			if(i.hasNext())
			{
				query.append(" AND ");
			}
		}
		return query.toString();
	}
	//DEFINIMOS UN METODO PARA EXTRACCION DE LOS CAMPOS WHERE
	private String matchtxt(JSONObject json) throws SecurityException, NoSuchFieldException{
		StringBuilder query = new StringBuilder("WHERE ");
		Iterator i = json.keys();
		while(i.hasNext()){
			String llave = i.next().toString();
			try
			{
				JSONArray a = json.getJSONArray(llave);
				query.append(campoBmatch(llave,json, a, true));
			}
			catch(Exception e){
				query.append(campoBmatch(llave,json, null, false));
			}
			if(i.hasNext())
			{
				query.append(" AND ");
			}
		}
		return query.toString();
	}
	//METODO PARA ANALISIS DE LOS CAMPOS A INGRESAR EN WHERE
	private String campoB(String llave, JSONObject json, JSONArray jsona, boolean isarray) throws SecurityException, NoSuchFieldException
	{
		StringBuilder query = new StringBuilder();
		if(fields.indexOf(llave) >= 0){
			Field f = attributes.getField(llave);
			if(f.getType() == int.class){
				try{
					if(isarray){
						query.append("(");
						for(int i=0; i< jsona.length(); i++){
							if(i!=0){ 
								query.append(" OR "); 
							}
							query.append(this.TableName+"."+llave+"="+jsona.getInt(i));
						}
						query.append(")");
					}
					else
					{
						query.append(this.TableName+"."+llave+"="+json.getInt(llave));
					}
				}
				catch(Exception e){
					System.out.println("Campo de busqueda "+llave+" con tipo incorrecto en contraste con modelo definido.");
					return null;
				}
			}
			else if(f.getType() == double.class){
				try{
					if(isarray){
						query.append("(");
						for(int i=0; i< jsona.length(); i++){
							if(i!=0){ 
								query.append(" OR "); 
							}
							query.append(this.TableName+"."+llave+"="+jsona.getDouble(i));
						}
						query.append(")");
					}
					else
					{
						query.append(this.TableName+"."+llave+"="+json.getDouble(llave));
					}
				}
				catch(Exception e){
					System.out.println("Campo de busqueda "+llave+" con tipo incorrecto en contraste con modelo definido.");
					return null;
				}
			}
			else if(f.getType() == String.class){
				try{
					if(isarray){
						query.append("(");
						for(int i=0; i< jsona.length(); i++){
							if(i!=0){ 
								query.append(" OR "); 
							}
							query.append(this.TableName+"."+llave+"='"+getSqlRealScapeString(jsona.getString(i))+"'");
						}
						query.append(")");
					}
					else
					{
						query.append(this.TableName+"."+llave+"='"+getSqlRealScapeString(json.getString(llave))+"'");
					}
				}
				catch(Exception e){
					System.out.println("Campo de busqueda "+llave+" con tipo incorrecto en contraste con modelo definido.");
					return null;
				}
			}
		}
		return query.toString();
	}
	private String campoBmatch(String llave, JSONObject json, JSONArray jsona, boolean isarray) throws SecurityException, NoSuchFieldException
	{
		StringBuilder query = new StringBuilder();
		if(fields.indexOf(llave) >= 0){
			Field f = attributes.getField(llave);
			if(f.getType() == int.class){
				try{
					if(isarray){
						query.append("(");
						for(int i=0; i< jsona.length(); i++){
							if(i!=0){ 
								query.append(" OR "); 
							}
							if(json.getString(llave).indexOf("==") == 0 || json.getString(llave).indexOf(">=") == 0 || json.getString(llave).indexOf("<=") == 0 || json.getString(llave).indexOf(">>") == 0 || json.getString(llave).indexOf("<<") == 0 || json.getString(llave).indexOf("!=") == 0){
								query.append(this.TableName+"."+llave+" "+re_operator(json.getString(llave).substring(0, 2))+" "+json.getString(llave).substring(3));
							}
							else if(json.getString(llave).indexOf("BETWEEN") == 0){
								query.append(this.TableName+"."+llave+" "+json.getString(llave));
							}
							else
							{
								query.append(this.TableName+"."+llave+" LIKE "+json.getString(llave));
							}
						}
						query.append(")");
					}
					else
					{
						if(json.getString(llave).indexOf("==") == 0 || json.getString(llave).indexOf(">=") == 0 || json.getString(llave).indexOf("<=") == 0 || json.getString(llave).indexOf(">>") == 0 || json.getString(llave).indexOf("<<") == 0 || json.getString(llave).indexOf("!=") == 0){
							query.append(this.TableName+"."+llave+" "+re_operator(json.getString(llave).substring(0, 2))+" "+json.getString(llave).substring(3));
						}
						else if(json.getString(llave).indexOf("BETWEEN") == 0){
							query.append(this.TableName+"."+llave+" "+json.getString(llave));
						}
						else
						{
							query.append(this.TableName+"."+llave+" LIKE "+json.getString(llave));
						}
					}
				}
				catch(Exception e){
					System.out.println("Campo de busqueda "+llave+" con tipo incorrecto en contraste con modelo definido.");
					return null;
				}
			}
			else if(f.getType() == double.class){
				try{
					if(isarray){
						query.append("(");
						for(int i=0; i< jsona.length(); i++){
							if(i!=0){ 
								query.append(" OR "); 
							}
							if(json.getString(llave).indexOf("==") == 0 || json.getString(llave).indexOf(">=") == 0 || json.getString(llave).indexOf("<=") == 0 || json.getString(llave).indexOf(">>") == 0 || json.getString(llave).indexOf("<<") == 0 || json.getString(llave).indexOf("!=") == 0){
								query.append(this.TableName+"."+llave+" "+re_operator(json.getString(llave).substring(0, 2))+" "+json.getString(llave).substring(3));
							}
							else if(json.getString(llave).indexOf("BETWEEN") == 0){
								query.append(this.TableName+"."+llave+" "+json.getString(llave));
							}
							else
							{
								query.append(this.TableName+"."+llave+" LIKE "+json.getString(llave));
							}
						}
						query.append(")");
					}
					else
					{
						if(json.getString(llave).indexOf("==") == 0 || json.getString(llave).indexOf(">=") == 0 || json.getString(llave).indexOf("<=") == 0 || json.getString(llave).indexOf(">>") == 0 || json.getString(llave).indexOf("<<") == 0 || json.getString(llave).indexOf("!=") == 0){
							query.append(this.TableName+"."+llave+" "+re_operator(json.getString(llave).substring(0, 2))+" "+json.getString(llave).substring(3));
						}
						else if(json.getString(llave).indexOf("BETWEEN") == 0){
							query.append(this.TableName+"."+llave+" "+json.getString(llave));
						}
						else
						{
							query.append(this.TableName+"."+llave+" LIKE "+json.getString(llave));
						}
					}
				}
				catch(Exception e){
					System.out.println("Campo de busqueda "+llave+" con tipo incorrecto en contraste con modelo definido.");
					return null;
				}
			}
			else if(f.getType() == double.class || f.getType() == long.class){
				try{
					if(isarray){
						query.append("(");
						for(int i=0; i< jsona.length(); i++){
							if(i!=0){ 
								query.append(" OR "); 
							}
							if(json.getString(llave).indexOf("==") == 0 || json.getString(llave).indexOf(">=") == 0 || json.getString(llave).indexOf("<=") == 0 || json.getString(llave).indexOf(">>") == 0 || json.getString(llave).indexOf("<<") == 0 || json.getString(llave).indexOf("!=") == 0){
								query.append(this.TableName+"."+llave+" "+re_operator(json.getString(llave).substring(0, 2))+" "+json.getString(llave).substring(3));
							}
							else if(json.getString(llave).indexOf("BETWEEN") == 0){
								query.append(this.TableName+"."+llave+" "+json.getString(llave));
							}
							else
							{
								query.append(this.TableName+"."+llave+" LIKE "+json.getString(llave));
							}
						}
						query.append(")");
					}
					else
					{
						if(json.getString(llave).indexOf("==") == 0 || json.getString(llave).indexOf(">=") == 0 || json.getString(llave).indexOf("<=") == 0 || json.getString(llave).indexOf(">>") == 0 || json.getString(llave).indexOf("<<") == 0 || json.getString(llave).indexOf("!=") == 0){
							query.append(this.TableName+"."+llave+" "+re_operator(json.getString(llave).substring(0, 2))+" "+json.getString(llave).substring(3));
						}
						else if(json.getString(llave).indexOf("BETWEEN") == 0){
							query.append(this.TableName+"."+llave+" "+json.getString(llave));
						}
						else
						{
							query.append(this.TableName+"."+llave+" LIKE "+json.getString(llave));
						}
					}
				}
				catch(Exception e){
					System.out.println("Campo de busqueda "+llave+" con tipo incorrecto en contraste con modelo definido.");
					return null;
				}
			}
			else if(f.getType() == String.class){
				try{
					if(isarray){
						query.append("(");
						for(int i=0; i< jsona.length(); i++){
							if(i!=0){ 
								query.append(" OR "); 
							}
							if(json.getString(llave).indexOf("==") == 0 || json.getString(llave).indexOf(">=") == 0 || json.getString(llave).indexOf("<=") == 0 || json.getString(llave).indexOf(">>") == 0 || json.getString(llave).indexOf("<<") == 0 || json.getString(llave).indexOf("!=") == 0){
								query.append(this.TableName+"."+llave+" "+re_operator(json.getString(llave).substring(0, 2))+" '"+getSqlRealScapeString(json.getString(llave).substring(3))+"'");
							}
							else if(json.getString(llave).indexOf("BETWEEN") == 0){
								query.append(this.TableName+"."+llave+" "+json.getString(llave));
							}
							else
							{
								query.append("UPPER("+this.TableName+"."+llave+") LIKE '%"+getSqlRealScapeString(json.getString(llave).toUpperCase())+"%'");
							}
						}
						query.append(")");
					}
					else
					{
						if(json.getString(llave).indexOf("==") == 0 || json.getString(llave).indexOf(">=") == 0 || json.getString(llave).indexOf("<=") == 0 || json.getString(llave).indexOf(">>") == 0 || json.getString(llave).indexOf("<<") == 0 || json.getString(llave).indexOf("!=") == 0){
							query.append(this.TableName+"."+llave+" "+re_operator(json.getString(llave).substring(0, 2))+" '"+getSqlRealScapeString(json.getString(llave).substring(3))+"'");
						}
						else if(json.getString(llave).indexOf("BETWEEN") == 0){
							query.append(this.TableName+"."+llave+" "+json.getString(llave));
						}
						else
						{
							query.append("UPPER("+this.TableName+"."+llave+") LIKE '%"+getSqlRealScapeString(json.getString(llave).toUpperCase())+"%'");
						}
					}
				}
				catch(Exception e){
					System.out.println("Campo de busqueda "+llave+" con tipo incorrecto en contraste con modelo definido.");
					return null;
				}
			}
		}
		return query.toString();
	}
	// DEFINIMOS EL METODO FINDONE
	public ModelResult<T> findOne(String p) throws InstantiationException, IllegalAccessException, Error403Exception, IOException{
		if(!this.FindOne) throw new Error403Exception("Operacion no permitida en modelo de datos");
		ModelResult<T> retorno = new ModelResult<T>();
		try{
			JSONObject s = new JSONObject(p);
			int limit = -1;
			if(s.has("LIMIT")){
				limit = s.getInt("LIMIT");
				s.remove("LIMIT");
			}
			StringBuilder query = new StringBuilder("SELECT ");
			StringBuilder limite = new StringBuilder("SELECT ");
			for(int i=0; i<fields.size(); i++){
				Field f = attributes.getField(fields.get(i));
				limite.append(fields.get(i)+",");
				if(f.getType().isPrimitive() || f.getType() == String.class)
				{
					query.append(fields.get(i)+",");
				}
				else{
					try{
						Method method = f.getType().getMethod("GetSQL", String.class);
						query.append(method.invoke(null, fields.get(i)));
					}
					catch(Exception e){
						new Error403Exception("Error al convertir al objeto del modelo.");
					}
				}
			}
			query.deleteCharAt(query.length()-1);
			limite.deleteCharAt(limite.length()-1);
			if(limit == -1){
				query.append(" FROM "+this.TableName+" "+this.wheretxt(s));
			}
			else
			{
				
				query.append(" FROM "+this.TableName+" "+this.wheretxt(s));
				limite.append(" FROM ("+query.toString()+") where ROWNUM <= "+limit);
				query = limite;
			}
			OracleConnector ora;
			ora = new OracleConnector();
			ora.connect();
			if(DEBUG) System.out.println(query.toString());
			ResultSet res = ora.query(query.toString());

			if(res != null){
				if(res.next()){
					T aux = (T)attributes.newInstance();
					for(String g:fields){
						Field f = attributes.getField(g);
						if(f.getType() == int.class){
							aux.getClass().getField(g).set(aux, res.getInt(g));
						}
						else if(f.getType() == double.class){
							aux.getClass().getField(g).set(aux, res.getDouble(g));
						}
						else if(f.getType() == long.class){
							aux.getClass().getField(g).set(aux, res.getLong(g));
						}
						else if(f.getType() == String.class){
							aux.getClass().getField(g).set(aux, res.getString(g));
						}
						else{
							try{
								aux.getClass().getField(g).set(aux, f.getType().getConstructor(String.class).newInstance(res.getString(g)));
							}
							catch(Exception e)
							{
								new Error403Exception("Error al convertir al objeto del modelo.");
							}
						}
					}
					retorno.add(aux);
				}
			}
			ora.close();
		}
		catch (SecurityException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (NoSuchFieldException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return retorno;
	}
	//DEFINIMOS EL METODO UPDATE
	public boolean update(String p, String w) throws Error403Exception, IOException{
		
		if(!this.Update) throw new Error403Exception("Operacion no permitida en modelo de datos");
		try{
			JSONObject s = new JSONObject(p);
			JSONObject we = new JSONObject(w);
			StringBuilder query = new StringBuilder("UPDATE "+this.TableName+" SET ");
			Iterator i = s.keys();
			while(i.hasNext()){
				String llave = i.next().toString();
				try
				{
					if(fields.indexOf(llave) >= 0){
						Field f = attributes.getField(llave);
						if(f.getType() == int.class){
							try{
								query.append(this.TableName+"."+llave+"="+s.getInt(llave));
							}
							catch(Exception e){
								System.out.println("Campo de busqueda "+llave+" definido como entero se está tratando de insertar como "+ f.getType()+ " en contraste con modelo definido " + this.TableName);
								return false;
							}
						}
						else if(f.getType() == double.class){
							try{
								query.append(this.TableName+"."+llave+"="+s.getDouble(llave));
							}
							catch(Exception e){
								System.out.println("Campo de busqueda "+llave+" definido como double se está tratando de insertar como "+ f.getType()+" en contraste con modelo definido " + this.TableName);
								return false;
							}
						}
						else if(f.getType() == long.class){
							try{
								query.append(this.TableName+"."+llave+"="+s.getLong(llave));
							}
							catch(Exception e){
								System.out.println("Campo de busqueda "+llave+" definido como long se está tratando de insertar como "+f.getType()+" en contraste con modelo definido " + this.TableName);
								return false;
							}
						}
						else if(f.getType() == String.class){
							try{
								query.append(this.TableName+"."+llave+"='"+s.getString(llave)+"'");
							}
							catch(Exception e){
								System.out.println("Campo de busqueda "+llave+" definido como String se está tratando de insertar como "+f.getType()+" en contraste con modelo definido " + this.TableName);
								return false;
							}
						}
					}
				}
				catch(Exception e){
					return false;
				}
				if(i.hasNext())
				{
					query.append(", ");
				}
			}
			query.append(" "+this.wheretxt(we));
			OracleConnector ora;
			ora = new OracleConnector();
			ora.connect();
			if(DEBUG) System.out.println(query.toString());
			if(ora.update(query.toString()))
			{
				ora.closeOP();
				return true;
			}
			else
			{
				ora.closeOP();
				return false;
			}
		}
		catch (SecurityException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (NoSuchFieldException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return false;
	}
	// DEFINIMOS EL METODO DELETE
	public boolean delete(String p) throws Error403Exception, IOException{
		if(!this.Delete) throw new Error403Exception("Operacion no permitida en modelo de datos");
		try{
			JSONObject s = new JSONObject(p);
			StringBuilder query = new StringBuilder("DELETE FROM "+this.TableName+" "+this.wheretxt(s));
			OracleConnector ora;
			ora = new OracleConnector();
			ora.connect();
			if(ora.delete(query.toString()))
			{
				ora.closeOP();
				return true;
			}
			else
			{
				ora.close();
				return false;
			}			
		}
		catch (SecurityException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (NoSuchFieldException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return false;
	}
	//DEFINIMOS EL METODO INSERT
	public boolean insert(String p) throws Error403Exception, IOException{
		if(!this.Insert) throw new Error403Exception("Operacion no permitida en modelo de datos");
		OracleConnector ora;
		ora = new OracleConnector();
		ora.connect();
		try{
			JSONObject s = new JSONObject(p);
			
			if(s.length() == 0){
				System.out.println("No se puede ejecutar una operación INSERT vacia sobre este modelo");
				return false;
			}
			StringBuilder query = new StringBuilder("INSERT INTO "+this.TableName+" (");
			ArrayList<Lfield> valores = new ArrayList<Lfield>();
			StringBuilder values = new StringBuilder(" VALUES (");
			boolean valid = false;
			boolean first = true;
			int valuepos = 1;
			if(fields.size() >= 0){
				for(int i=0; i<fields.size(); i++){
					boolean data = false;
					try
					{
						Field f = attributes.getField(fields.get(i));
						if(f.getType() == int.class){
							if(s.has(f.getName())){
								try{
									if(i>0 && !first){
										query.append(",");
										values.append(",");
									}
									values.append("?");
									valores.add(new Lfield("INT",valuepos,s.getInt(fields.get(i))));
									query.append(this.TableName+"."+fields.get(i));
									valuepos++;
									data = true;
									first = false;
								}
								catch(Exception e){
									if(f.getAnnotation(FieldDefaultInt.class) != null){
										values.append("?");
										valores.add(new Lfield("INT",valuepos,f.getAnnotation(FieldDefaultInt.class).defaults()));
										query.append(this.TableName+"."+fields.get(i));
										data = true;
										first = false;
										valuepos++;
									}
									else{
										if(f.getAnnotation(ModelFieldRequired.class) != null){
											System.out.println("El campo "+fields.get(i)+" es requerido para hacer uan inserción.");
											return false;
										}
									}
								}
							}
						}
						else if(f.getType() == double.class){
							if(s.has(f.getName())){
								try{
									if(i>0 && !first){
										query.append(",");
										values.append(",");
									}
									values.append("?");
									valores.add(new Lfield("DOUBLE",valuepos,s.getDouble(fields.get(i))));
									query.append(this.TableName+"."+fields.get(i));
									data = true;
									first = false;
									valuepos++;
								}
								catch(Exception e){
									if(f.getAnnotation(FieldDefaultInt.class) != null){
										values.append("?");
										valores.add(new Lfield("DOUBLE",valuepos,f.getAnnotation(FieldDefaultInt.class).defaults()));
										query.append(this.TableName+"."+fields.get(i));
										data = true;
										first = false;
										valuepos++;
									}
									else{
										if(f.getAnnotation(ModelFieldRequired.class) != null){
											System.out.println("El campo "+fields.get(i)+" es requerido para hacer uan inserción.");
											return false;
										}
									}
								}
							}
						}
						else if(f.getType() == long.class){
							if(s.has(f.getName())){
								try{
									if(i>0 && !first){
										query.append(",");
										values.append(",");
									}
									values.append("?");
									valores.add(new Lfield("LONG",valuepos,s.getLong(fields.get(i))));
									query.append(this.TableName+"."+fields.get(i));
									data = true;
									first = false;
									valuepos++;
								}
								catch(Exception e){
									if(f.getAnnotation(FieldDefaultInt.class) != null){
										values.append("?");
										valores.add(new Lfield("LONG",valuepos,f.getAnnotation(FieldDefaultInt.class).defaults()));
										query.append(this.TableName+"."+fields.get(i));
										data = true;
										first = false;
										valuepos++;
									}
									else{
										if(f.getAnnotation(ModelFieldRequired.class) != null){
											System.out.println("El campo "+fields.get(i)+" es requerido para hacer uan inserción.");
											return false;
										}
									}
								}
							}
						}
						else if(f.getType() == String.class){
							if(s.has(f.getName())){
								try{
									if(i>0 && !first){
										query.append(",");
										values.append(",");
									}
									values.append("?");
									valores.add(new Lfield("STRING",valuepos,s.getString(fields.get(i))));
									query.append(this.TableName+"."+fields.get(i));
									data = true;
									first = false;
									valuepos++;
								}
								catch(Exception e){
									if(f.getAnnotation(FieldDefaultString.class) != null){
										values.append("?");
										valores.add(new Lfield("STRING",valuepos,f.getAnnotation(FieldDefaultString.class).defaults()));
										query.append(this.TableName+"."+fields.get(i));
										data = true;
										first = false;
										valuepos++;
									}
									else{
										if(f.getAnnotation(ModelFieldRequired.class) != null){
											System.out.println("El campo "+fields.get(i)+" es requerido para hacer uan inserción.");
											return false;
										}
									}
								}
							}
						}
						else if(f.getType() == SDO_GEOMETRY.class || f.getType() == GEOM.class || f.getType() == SDO_GEOMETRY.class || f.getType() == PRESITIONGEOM.class || f.getType() == OBRA.class){
							if(s.has(f.getName())){
								try{
									if(i>0 && !first){
										query.append(",");
										values.append(",");
									}
									query.append(this.TableName+"."+fields.get(i));
									values.append("?");
									String aux_hash = s.getString(fields.get(i));
									SpatialBase aux_obj = (SpatialBase)req.getSesion().getTempAndClean(aux_hash);
									STRUCT pi = aux_obj.toObject(ora);
									valores.add(new Lfield("OBJECT",valuepos,pi));
									data = true;
									first = false;
									valuepos++;
								}
								catch(Exception e){
									System.out.println("Ocurrio un error: "+e.getMessage());
									if(f.getAnnotation(ModelFieldRequired.class) != null){
										System.out.println("El campo "+fields.get(i)+" es requerido para hacer uan inserción.");
										return false;
									}
								}
							}
						}
						else
						{
							if(s.has(f.getName())){
								try{
									if(i>0 && !first){
										query.append(",");
										values.append(",");
									}
									values.append("?");
									String aux_hash = s.getString(fields.get(i));
									OBJECT aux_obj = (OBJECT)req.getSesion().getTempAndClean(aux_hash);
									valores.add(new Lfield("OBJECT",valuepos,aux_obj.getObject()));
									query.append(this.TableName+"."+fields.get(i));
									data = true;
									first = false;
									valuepos++;
								}
								catch(Exception e){
									if(f.getAnnotation(ModelFieldRequired.class) != null){
										System.out.println("El campo "+fields.get(i)+" es requerido para hacer uan inserción.");
										return false;
									}
								}
							}
						}
					}
					catch(Exception e){
						return false;
					}
				}
			}
			else
			{
				System.out.println("El modelo especificado no contiene campos");
				return false;
			}
			query.append(")");
			values.append(")");
			query.append(values);
			
			if(DEBUG) System.out.println(query.toString());
			OraclePreparedStatement sql = ora.prepare(query.toString());
			//agregamos los valores al statement
			for(int i=0;i<valores.size();i++){
				try{
					if(valores.get(i).type == "STRING"){
						sql.setString((valores.get(i).index), (String)valores.get(i).value);
					}
					else if(valores.get(i).type == "INT"){
						sql.setInt((valores.get(i).index), (Integer)valores.get(i).value);
					}
					else if(valores.get(i).type == "DOUBLE"){
						sql.setDouble((valores.get(i).index), (Double)valores.get(i).value);
					}
					else if(valores.get(i).type == "LONG"){
						sql.setLong((valores.get(i).index), (Long)valores.get(i).value);
					}
					else if(valores.get(i).type == "OBJECT"){
						sql.setObject((valores.get(i).index), valores.get(i).value);
					}
				}
				catch(SQLException e){
					System.out.println("ERROR AL GENERAR EL SQL STATEMENT\n\rError: "+e.getMessage());
				}
			}
			if(ora.update())
			{
				ora.commit();
				ora.closeOP();
				return true;
			}
			else
			{
				ora.closeOP();
				return false;
			}
		}
		catch (SecurityException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return false;
	}
	
	
	// DEFINIMOS EL METODO PARA OBTENER EL NEXTVAL DE UN SEQUENCE
	public int getNextVal(String sequence) throws IllegalAccessException, Error403Exception, IOException{
		int sequencia = -1;
		try{
			
			StringBuilder query = new StringBuilder("SELECT ");
			query.append(sequence);
			query.append(".NEXTVAL FROM DUAL");
			OracleConnector ora;
			ora = new OracleConnector();
			ora.connect();
			ResultSet res = ora.query(query.toString());
			if(res != null){
				res.next();
				sequencia = res.getInt(1);
			}
			ora.close();
		}catch (SecurityException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		return sequencia;
	}
		
	//DEFINIMOS EL METODO DE CONFIGURACION DEL MODELO
	//DESDE ACA PODEMOS CONFIGURAR EXCEPCIONES EN CASO DE NO EXISTIR COINCIDENCIA
	//EN LAS ANOTACIONES DE CONFIGURACIÓN
	private void config(){
		ModelParam m = (ModelParam) attributes.getAnnotation(ModelParam.class);
		//DEFINIMOS LOS PARAMETROS DE CONFIGURACION
		//ESTOS DEBEN SER DEFINIDOS EN EL MODELO
		this.setTableName(m.tableName());
		this.setFind(m.Find());
		this.setFindOne(m.FindOne());
		this.setDelete(m.Delete());
		this.setUpdate(m.Update());
		this.setNextVal(m.NextVal());
		this.setToJSON(m.ToJSON());
	}
	private String re_operator(String ope){
		if(ope.equals(">>")){
			return ">";
		}
		else if(ope.equals("<<")){
			return "<";
		}
		else if(ope.equals("!=")){
			return "!=";
		}
		else if(ope.equals(">=")){
			return ">=";
		}
		else if(ope.equals("<=")){
			return "<=";
		}
		else if(ope.equals("BETWEEN")){
			return "BETWEEN";
		}
		else if(ope.equals("==")){
			return "=";
		}
		return ope;
	}
	public String getSqlRealScapeString(String str) {
		String data = null;
		if (str != null && str.length() > 0) {
			str = str.replace("\\", "\\\\");
		    str = str.replace("'", "''");
		    str = str.replace("\0", "\\0");
		    str = str.replace("\n", "\\n");
		    str = str.replace("\r", "\\r");
		    str = str.replace("\"", "\\\"");
		    str = str.replace("\\x1a", "\\Z");
		    data = str;
		 }
		 return data;
	}
	//DEFINIMOS EL METODO UPDATE
}	
class Lfield{
	public String type;
	public int index;
	public Object value;
	public Lfield(String type, int index, String key) {
		this.type = type;
		this.index = index;
		this.value = (Object)key;
	}
	public Lfield(String type, int index, Integer key) {
		this.type = type;
		this.index = index;
		this.value = (Object)key;
	}
	public Lfield(String type, int index, Double key) {
		this.type = type;
		this.index = index;
		this.value = (Object)key;
	}
	public Lfield(String type, int index, Long key) {
		this.type = type;
		this.index = index;
		this.value = (Object)key;
	}
	public Lfield(String type, int index, Object key) {
		this.type = type;
		this.index = index;
		this.value = key;
	}
}