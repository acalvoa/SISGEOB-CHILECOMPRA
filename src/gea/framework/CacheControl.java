package gea.framework;

import gea.websocket.GEOWebSocketHandler;

import java.util.Hashtable;
import java.util.TimerTask;

public class CacheControl extends Thread implements Runnable{
	// VARIABLES DE CACHE
	Cache cache;
	GEOWebSocketHandler Handler;
	int counter;
	//DEFINIMOS EL CONSTRUCTOR
	public CacheControl(Cache cache,GEOWebSocketHandler Handler){
		this.cache = cache;
		this.Handler = Handler; 
		this.counter = 0;
	}
	//TAREAS DE LIMPIEZA
	private void cleanup() throws InterruptedException{
		while(Handler.isRun()){
			if(counter == 14400){
				this.cache.Clean();
				counter = 0;
			}
			Thread.sleep(1000);
			counter++;
		}
		System.out.println("Deteniendo Daemon Control Cache");
	}
	@Override
	public void run() {
		// TODO Auto-generated method stub
		try {
			this.cleanup();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
