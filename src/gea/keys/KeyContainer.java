package gea.keys;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class KeyContainer extends Thread{
	int port;
	public KeyContainer(int port){
		this.port = port;
	}
	public void run(){
		ServerSocket server = null;
		try {
			server = new ServerSocket(this.port);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		while(true){
			try {
				Socket client = server.accept();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println("Nuevo Cliente.");
		}
	}
}
