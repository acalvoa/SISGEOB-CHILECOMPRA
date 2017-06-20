package gea.ws;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.xml.soap.MessageFactory;
import javax.xml.soap.MimeHeaders;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPConnection;
import javax.xml.soap.SOAPConnectionFactory;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;

import org.json.JSONObject;

public class VideosWs {
	public static JSONObject Video(HttpServletRequest req, HttpServletResponse res) throws Exception {
		JSONObject retorno = new JSONObject();
		String geoIdItem = req.getParameter("GeoIdItem");
		
		SOAPConnectionFactory soapConnectionFactory = SOAPConnectionFactory.newInstance();
        SOAPConnection soapConnection = soapConnectionFactory.createConnection();

        // Send SOAP Message to SOAP Server
        String url = "http://vmcontentwas-1.contraloria.cl:9082/CGRServDocsWar_DMCLV2/services/CMWebService";
        SOAPMessage soapResponse = soapConnection.call(createSOAPRequest(geoIdItem), url);
        
        // print SOAP Response
        System.out.print("Response SOAP Message:");
        soapResponse.writeTo(System.out);
        
        // get url video
        String aux = soapResponse.toString();
        String urlVideo = aux.substring(aux.indexOf("<urls><urls>") + 12, aux.indexOf("</urls></urls>"));
        urlVideo =  urlVideo.replaceAll("&amp;", "&");
        
        
        retorno.putOpt("urlvideo", urlVideo);
        soapConnection.close();
        
		return retorno;
	}
	
	private static SOAPMessage createSOAPRequest(String geoIdItem) throws Exception {
		MessageFactory messageFactory = MessageFactory.newInstance();
		SOAPMessage soapMessage = messageFactory.createMessage();
		SOAPPart soapPart = soapMessage.getSOAPPart();
		
		String serverURI = "http://vmcontentwas-1.contraloria.cl:9080/CGRServDocsWar_DMCLV2/services/CMWebService";
		
		// SOAP Envelope
		SOAPEnvelope envelope = soapPart.getEnvelope();
		envelope.addNamespaceDeclaration("ws", "http://ws.icm.contraloria.cl");
		envelope.addNamespaceDeclaration("ent", "http://entity.icm.contraloria.cl");
		envelope.addNamespaceDeclaration("met", "http://metadata.icm.contraloria.cl");
		
		// SOAP Body
		SOAPBody soapBody = envelope.getBody();
		SOAPElement soapBodyElem = soapBody.addChildElement("getDoc", "ws");
		SOAPElement header = soapBodyElem.addChildElement("header", "ws");
		header.addChildElement("user", "ent").addTextNode("geocgrusr");
		header.addChildElement("password", "ent").addTextNode("geocgrusr");
		soapBodyElem.addChildElement("itemTypeDoc", "ws").addTextNode("GEOCGR");
		SOAPElement idDoc = soapBodyElem.addChildElement("idDoc", "ws");
		idDoc.addChildElement("entity", "met").addTextNode("GEOCGR");
		SOAPElement attributes = idDoc.addChildElement("attributes", "met");
		SOAPElement items = attributes.addChildElement("item", "ws");
		items.addChildElement("name","met").addTextNode("GeoIdItem");
		items.addChildElement("value","met").addTextNode(geoIdItem);
		
		MimeHeaders headers = soapMessage.getMimeHeaders();
		headers.addHeader("SOAPAction", serverURI + "getDoc");
		
		soapMessage.saveChanges();
		
		/* Print the request message */
		System.out.print("Request SOAP Message:");
		soapMessage.writeTo(System.out);
		
		return soapMessage;
	}
}
