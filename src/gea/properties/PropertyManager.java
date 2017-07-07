package gea.properties;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;

import gea.properties.PropertyManagerException;

public class PropertyManager {
	// Aca debe ir las key de los archivos
	public static  String PathProperties; 
	public static  Properties GEOCGR_FILE;	
	public static String AMBIENTE_DESPLIEGUE;
//	******************************************************************************************

	private static PropertyManager instance=null;

    private PropertyManager(){
    	ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		InputStream config_file = classLoader.getResourceAsStream("/properties/config.properties");
		
		Properties prop = new Properties();
		try {
			prop.load(config_file);
		} catch (IOException e) {
			e.printStackTrace();
		}

		this.PathProperties = prop.getProperty("PATH_CONFIG_FILE");
		this.AMBIENTE_DESPLIEGUE = prop.getProperty("ENV");
        this.GEOCGR_FILE = new CargaPropiedades().getFile("GEOCGR");
    }
	public static synchronized PropertyManager getInstance()
	{
		instance = new PropertyManager();
		
		return instance;
	}
	
	public String getProperty(Properties prop,String key) throws PropertyManagerException {
		String value;
		
		if ( prop==null ) {
			throw new PropertyManagerException("Archivo de propiedades no encontrado");
		} else {
			value = prop.getProperty(key);
			
			if( value==null ) {
				throw new PropertyManagerException("La key no fue encontrada en el archivo de propiedades");
			} else {
				return value;
			}
		}
	}
	
	private static class CargaPropiedades {
		public Properties getFile (String file) {
			try {
				FileInputStream propFile = new FileInputStream(PropertyManager.PathProperties);
				Properties fileProperties = new Properties();
				fileProperties.load(propFile);
				propFile.close();
				
				return fileProperties;
			} catch ( Exception e ) {
				return null;
			}
		}
	}
	
	//	Por cada archivo de propiedades se debe definir una clase y registrar sus keys
	public static class GEOCGR {
		public static final String DBHOST="DBHOST";
		public static final String DBPORT="DBPORT";
		public static final String DBUSERNAME="DBUSERNAME";
		public static final String DBPASSWORD="DBPASSWORD";
		public static final String DBDATABASE="DBDATABASE";
		public static final String APPPORT="APPPORT";
		public static final String APPHOST="APPHOST";
		public static final String CLIENTPORT="CLIENTPORT";
		public static final String URLMIDESO="URLMIDESO";
		public static final String CONSULTAIDI="CONSULTAIDI";
		public static final String CONSULTAFICHA="CONSULTAFICHA";
	}
}
