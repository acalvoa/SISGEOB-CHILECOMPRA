package gea.framework;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.CharSet;

import gea.policies.*;
import gea.controller.*;
import gea.utils.Exception.*;

public class Controller {
	// DEFINIMOS EL CONSTRUCTOR
	public Controller(Request req, Response res) throws Error403Exception, Error500Exception, Error404Exception, ErrorCodeException{
		// TODO Auto-generated constructor stub
		// QUITAMOS LOS PREFIJOS
		if(Router.prefix != ""){
			req.prefix(Router.prefix);
		}
		// RUTEAMOS POR CONTROLADOR Y ACCION
		try{
			Router r = Router.valueOf(req.getController().toUpperCase()+req.getAction().toUpperCase());			
			this.policie(r, req, res);
		}catch(Exception e){
			//RUTEAMOS POR CONTROLADOR
			try{
				System.out.println("En Controller.java: " + req.getController().toUpperCase());
				res.setCallback(req.getCallback());
				Router r = Router.valueOf(req.getController().toUpperCase());
				this.policie(r, req, res);
			}catch(Error500Exception ex){
				throw new Error403Exception(ex.getMessage());
			}
			catch(Exception ex){
				Router r = Router.valueOf("DEFAULT");
				this.policie(r, req, res);
			}
		}
	}
	private void policie(Router r, Request req, Response res) throws Error403Exception, Error500Exception, Error404Exception, ErrorCodeException{
		Method action;
		//DEFINIMOS EL CONTROLADOR Y LA ACCION A UTILIZAR.
		try {
			Class controlador = Class.forName("gea.controller." + r.getClase());
			String metodo = r.getMethod();
			if(metodo == "*"){
				metodo = req.getAction();
			}
			action = controlador.getMethod(metodo, Request.class, Response.class);
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			throw new Error404Exception("Controller or Action not found: "+e.getMessage());
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			throw new Error404Exception("Controller or Action not found: "+e.getMessage());
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			throw new Error404Exception("Controller or Action not found: "+e.getMessage());
		}
		
		//DEFINIMOS LA POLITICA A UTILIZAR
		Policies p;
		try
		{
			p = Policies.valueOf(r.getClase().toUpperCase());
		}
		catch(Exception e)
		{
			p = Policies.valueOf("DEFAULT");
		}
		
		//APLICAMOS LAS POLITICAS
		try {
			Class c = Class.forName("gea.policies." + p.getPolicie());
			PoliciesBase politica = (PoliciesBase) c.newInstance();
			if(politica.policie(req)){
				politica = null;
				if(r.getCache()){
					String hash = DigestUtils.sha1Hex((req.getController()+"/"+req.getAction()+"/"+req.getData()));
					if(res.cache.verifyCache(hash)){
						res.sendCache(hash);
					}
					else
					{
						res.setupCache(hash);
						action.invoke(null,req,res);
					}
				}
				else
				{
					action.invoke(null,req,res);
				}
			}
			else
			{
				throw new Error403Exception("Forbidden Controller");
			}
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			throw new Error500Exception("Policie not found:"+e.getMessage());
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			throw new Error500Exception("Policie not found:"+e.getMessage());
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			throw new Error500Exception("Policie not found:"+e.getMessage());
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			throw new Error500Exception("Policie not found:"+e.getMessage());
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			throw new Error500Exception("Error in action:"+e.getMessage());
		}
		
	}
}
