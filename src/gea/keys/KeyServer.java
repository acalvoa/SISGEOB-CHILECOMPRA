package gea.keys;

import gea.tasklist.Tasklist;
import gea.websocket.GEOWebSocketHandler;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.java_websocket.WebSocketImpl;
import org.java_websocket.drafts.Draft_17;

/**
 * Servlet implementation class KeyContainer
 */
public class KeyServer extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public KeyServer() {
        super();
        // TODO Auto-generated constructor stub
    }

    public void init(ServletConfig config) {
    	/*int port;
		try {
			port = Tasklist.getPort() + 1;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			port = 8756;
		}
		KeyContainer key = new KeyContainer(port);
		System.out.println("Servidor de Llaves. Cargado en el puerto "+port);
		key.start();*/
	}
	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		super.destroy();
	}

}
