package gea.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPConnection;
import javax.xml.soap.SOAPConnectionFactory;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;

import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import gea.framework.*;
import gea.tasklist.Tasklist;

public class ControllerMideso extends ControllerBase {
	JSONObject jObject;
	static String url, servicioidi, serviciofichaidi;
	
	// CONSUME EL WS CONSULTA IDI
	public static void consultaIDI(Request req, Response res) throws Exception {
		String codigo = req.getData().getString("SERVICIO");
		String vcodigo = req.getData().getString("VCODBIP");
		
		JSONObject retorno = validaIDI(codigo.toString(), vcodigo.toString());
		res.SendCallback(retorno);
	}
	
	// CONSTRUYE EL MENSAJE QUE REALIZA LA CONSULTA IDI
	private static SOAPMessage createSOAPRequestConsultaIdi(String codigo, String parte) throws Exception {
		//Constantes
		String CODIGOMENSAJE = "1";
		String DESTINATARIO = "BIP";
		String REMITENTE = "CGR";
		String OPERACION = "consultarIdi";
		String RESULTADOOPERACION = "0";
		
		//Valores calculados
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date date = new Date();
		String fecha = dateFormat.format(date);
		
		//Parámetros
		//String parte = "0";
		
		MessageFactory messageFactory = MessageFactory.newInstance();
		SOAPMessage soapMessage = messageFactory.createMessage();
		SOAPPart soapPart = soapMessage.getSOAPPart();
		
		//SOAP Envelope
		SOAPEnvelope envelope = soapPart.getEnvelope();
		envelope.addNamespaceDeclaration("bip", "http://bip.mds.cl");
		
		//SOAP Body
		SOAPBody soapBody = envelope.getBody();
		SOAPElement soapBodyElem = soapBody.addChildElement("sobreBip", "bip");
		
		SOAPElement header = soapBodyElem.addChildElement("encabezado", "bip");
		header.addChildElement("codigoMensaje", "bip").addTextNode(CODIGOMENSAJE);
		header.addChildElement("fecha", "bip").addTextNode(fecha);
		header.addChildElement("destinatario", "bip").addTextNode(DESTINATARIO);
		header.addChildElement("remitente", "bip").addTextNode(REMITENTE);
		header.addChildElement("operacion", "bip").addTextNode(OPERACION);
		header.addChildElement("resultadoOperacion", "bip").addTextNode(RESULTADOOPERACION);
		
		SOAPElement body = soapBodyElem.addChildElement("cuerpo", "bip");
		SOAPElement consulta = body.addChildElement("ConsultaIDIRequest", "bip");
		SOAPElement codigoBip = consulta.addChildElement("codigoBip", "bip");
		codigoBip.addChildElement("codigo", "bip").addTextNode(codigo);
		codigoBip.addChildElement("parte", "bip").addTextNode(parte);
		
		soapMessage.saveChanges();
		soapMessage.writeTo(System.out);
		System.out.println();
		
		return soapMessage;
	}
	
	// VALIDA EL CODIGO IDI
	public static JSONObject validaIDI(String codigo, String vcodigo) throws Exception {
		JSONObject retorno = new JSONObject();
		
		String respuesta = "";
		String existeIDI = "";
		String[] anio = null;
		String[] codigoEtapa = null;
		String[] nombreEtapa = null;
		Document doc = null;
		int largo = -1;
		
		SOAPConnectionFactory soapConnectionFactory = SOAPConnectionFactory.newInstance();
		SOAPConnection soapConnection = soapConnectionFactory.createConnection();
		
		//Send SOAP Message to SOAP Server
		JSONObject config = Tasklist.getConfig();
		JSONObject ws = config.getJSONObject("WEBSERVICE");
		
		try {
			url = ws.getString("URLMIDESO").trim();
			servicioidi = ws.getString("CONSULTAIDI").trim();
			
			if ( (!url.equals("") || url != null) && (!servicioidi.equals("") && servicioidi != null) ) {
				SOAPMessage soapResponse = soapConnection.call(createSOAPRequestConsultaIdi(codigo, vcodigo), url + servicioidi);
				soapResponse.writeTo(System.out);

				DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
				DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
				
				respuesta = soapResponse.toString();
				respuesta =	respuesta.substring(respuesta.indexOf("<ConsultaIDIResponse>"), respuesta.indexOf("</cuerpo>"));
				
				doc = dBuilder.parse(new InputSource(new StringReader(respuesta)));
				doc.getDocumentElement().normalize();
				
				NodeList nList = doc.getElementsByTagName("ConsultaIDIResponse");
				
				for ( int temp = 0; temp<nList.getLength(); temp++ ) {
					Node nNode = nList.item(temp);
					
					if ( nNode.getNodeType()==Node.ELEMENT_NODE ) {
						Element eElement = (Element) nNode;
						existeIDI = eElement.getElementsByTagName("existeIDI").item(0).getTextContent();
						
						if ( existeIDI.equals("1") ) {
							NodeList nListAux = doc.getElementsByTagName("anios_Etapa");
							largo = nListAux.getLength();
							anio = new String[largo];
							codigoEtapa = new String[largo];
							nombreEtapa = new String[largo];
							
							for ( int tmp = 0; tmp<largo; tmp++ ) {
								Node nNodeAux = nListAux.item(tmp);
								
								if ( nNodeAux.getNodeType()==Node.ELEMENT_NODE ) {
									Element eElementAux = (Element) nNodeAux;
									
									anio[tmp] = eElementAux.getElementsByTagName("anio").item(0).getTextContent();
									codigoEtapa[tmp] = eElementAux.getElementsByTagName("codigoEtapa").item(0).getTextContent();
									nombreEtapa[tmp] = eElementAux.getElementsByTagName("nombreEtapa").item(0).getTextContent();
								}
							}
						} 
					}
				}
				
				soapConnection.close();
			}
		} catch ( Exception e ) {
			System.out.println("WebService MIDESO ...." + e.toString());
		}
		
		retorno.put("EXISTEIDI", existeIDI);
		retorno.put("TAMANIO", largo);
		retorno.put("ANIO", anio);
		retorno.put("C_ETAPA", codigoEtapa);
		retorno.put("N_ETAPA", nombreEtapa);
		retorno.put("status", existeIDI);
		
		return retorno;
	}
	
	// CONSUME EL WS CONSULTA FICHA IDI
	public static void consultaFichaIDI(Request req, Response res) throws Exception {
		JSONObject retorno = traeFichaIDI(req.getData().getString("codigo"), req.getData().getString("parte"), req.getData().getString("anio"), req.getData().getString("codigoEtapa"), req.getData().getString("nombreEtapa"));
		res.SendCallback(retorno);
	}
	
	private static SOAPMessage createSOAPRequestFichaIdi(String codigo, String parte, String anio, String codigoEtapa, String nombreEtapa) throws Exception {
		// Constantes
		String CODIGOMENSAJE = "1";
		String DESTINATARIO = "BIP";
		String REMITENTE = "CGR";
		String OPERACION = "consultarFichaIdi";
		String RESULTADOOPERACION = "00";
		
		// Valores calculados
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date();
		String fecha = dateFormat.format(date);
		
		MessageFactory messageFactory = MessageFactory.newInstance();
		SOAPMessage soapMessage = messageFactory.createMessage();
		SOAPPart soapPart = soapMessage.getSOAPPart();
		
		// SOAP Envelope
		SOAPEnvelope envelope = soapPart.getEnvelope();
		envelope.addNamespaceDeclaration("bip", "http://bip.mds.cl");
		
		// SOAP Body
		SOAPBody soapBody = envelope.getBody();
		SOAPElement soapBodyElem = soapBody.addChildElement("sobreBip", "bip");
		
		SOAPElement header = soapBodyElem.addChildElement("encabezado", "bip");
		header.addChildElement("codigoMensaje", "bip").addTextNode(CODIGOMENSAJE);
		header.addChildElement("fecha", "bip").addTextNode(fecha);
		header.addChildElement("destinatario", "bip").addTextNode(DESTINATARIO);
		header.addChildElement("remitente", "bip").addTextNode(REMITENTE);
		header.addChildElement("operacion", "bip").addTextNode(OPERACION);
		header.addChildElement("resultadoOperacion", "bip").addTextNode(RESULTADOOPERACION);
		
		SOAPElement body = soapBodyElem.addChildElement("cuerpo", "bip");
		SOAPElement consulta = body.addChildElement("ConsultaFichaIDIRequest", "bip");
		SOAPElement codigoBip = consulta.addChildElement("codigoBip", "bip");
		codigoBip.addChildElement("codigo", "bip").addTextNode(codigo);
		codigoBip.addChildElement("parte", "bip").addTextNode(parte);
		SOAPElement anios_Etapa = consulta.addChildElement("anios_Etapa", "bip");
		anios_Etapa.addChildElement("anio", "bip").addTextNode(anio);
		SOAPElement etapa = anios_Etapa.addChildElement("etapa", "bip");
		etapa.addChildElement("codigoEtapa", "bip").addTextNode(codigoEtapa);
		etapa.addChildElement("nombreEtapa", "bip").addTextNode(nombreEtapa);
				
		soapMessage.saveChanges();
		
		/* Print the request message */
		System.out.print("Request SOAP Message:");
		soapMessage.writeTo(System.out);
		System.out.println();
		
		return soapMessage;
	}
	
	// TRAE LA FICHA IDI
	@SuppressWarnings("null")
	public static JSONObject traeFichaIDI(String codigo, String parte, String anio, String codigoEtapa, String nombreEtapa) throws Exception {
		JSONObject retorno = new JSONObject();
		
		SOAPConnectionFactory soapConnectionFactory = SOAPConnectionFactory.newInstance();
		SOAPConnection soapConnection = soapConnectionFactory.createConnection();
		
		//Send SOAP Message to SOAP Server
		JSONObject config = Tasklist.getConfig();
		JSONObject db = config.getJSONObject("DATABASE");
		
		url = db.getString("URLMIDESO");
		serviciofichaidi = db.getString("CONSULTAFICHAIDI");
		
		SOAPMessage soapResponse = soapConnection.call(createSOAPRequestFichaIdi(codigo, parte, anio, codigoEtapa, nombreEtapa), url + serviciofichaidi);
		
		// print SOAP Response
		System.out.print("Response SOAP Message:");
		soapResponse.writeTo(System.out);
		System.out.println();
		
		String respuesta = soapResponse.toString();
		
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		Document doc = dBuilder.parse(respuesta);
		doc.getDocumentElement().normalize();
		
		//NodeList nList = doc.getElementsByTagName("consultaFichaIDIResponse");
		NodeList nList = doc.getElementsByTagName("fichaIDI");
		NodeList nListAux;
		int k = 0;
		
		// GEO_CONSULTA_FICHAIDI
		String anioPresupuestario = "";
		String fechaPostSNI = "";
		String fechaIngresoSNI = "";
		String codigoBIP = "";
		String nombre = "";
		String codigoTipologia = "";
		String nombreTipologia = "";
		String codigoIdiRel = "";
		String parteIdiRel = "";
		String codigoSeia = "";
		String locGeografica = "";
		String competencia = "";
		String distrito = "";
		String circunscripcion = "";
		String prioridad = "";
		String justificacion = "";
		String descActividades = "";
		String situacion = "";
		String conclusiones = "";
		String instFormuladora = "";
		String instTecnica = "";
		String instFinanciera = "";
		String responsable = "";
		
		// GEO_DESC_ININV
		String[] descriptor = null;
		
		// GEO_AREA_DES_INDIGENA
		String[] adiNombre = null;
		String[] adiTipoImpacto = null;
		
		// GEO_GEOREF
		String[] grefTipoElemento = null;
		String[] grefcodigoOCG = null;
		String[] grefcrdOrden = null;
		String[] grefcrdEjeX = null;
		String[] grefcrdEjeY = null;
		String[] grefcrdNombre = null;
		
		// GEO_SOL_FINANC
		String[] solfinFuente = null;
		String[] solfinItem = null;
		String[] solfinMoneda = null;
		String[] solfinPagado = null;
		String[] solfinSolicitado = null;
		String[] solfinSaldoPorInvertir = null;
		String[] solfinCostoTotal = null;
		
		// GEO_PROGRAMACION
		String[] progTipo = null;
		String[] progItemFuente = null;
		String[] progMontoCLP = null;
		String[] progMontoUSD = null;
		
		// GEO_HIST_RECEPCION
		String[] hrepRecepcion = null;
		String[] hrepFecha  = null;
		String[] hrepInstResp = null;
		
		// GEO_HIST_RATE
		String[] hresRate = null;
		String[] hresResultado = null;
		String[] hresFecha  = null;
		String[] hresNombreUsuario = null;
		
		// GEO_RES_PROY
		String[] rproFecha = null;
		String[] rproDuracion = null;
		String[] rproBenefMujer = null;
		String[] rproBenefHombre = null;
		String[] rproTMDA = null;
		String[] rproMagnitud = null;
		String[] rproVidaUtil = null;
		String[] rproIndicador = null;
		
		// GEO_RES_EST_BASICO
		String[] rebaFecha = null;
		String[] rebaDuracion = null;
		String[] rebaInstContraparteTecnica = null;
		String[] rebaInstEntidadUsuaria = null;
		
		// GEO_RES_PROGRAMA
		String[] rprgFecha = null;
		String[] rprgDuracion = null;
		String[] rprgBenefMujer = null;
		String[] rprgBenefHombre = null;
		String[] rprgProposito = null;
		String[] rprgIndicadorProposito = null;
		String[] rprgComponente = null;
		String[] rprgIndicadorComponente = null;
		
		// GEO_HSOL_FINANC
		String[] hsolAnioPres = null;
		String[] hsolRate = null;
		String[] hsolPagado = null;
		String[] hsolSolicitadoAnioCLP = null;
		String[] hsolSolicitadoAnioUSD = null;
		String[] hsolSaldoPorInvertirCLP = null;
		String[] hsolSaldoPorInvertirUSD = null;
		String[] hsolCostoTotalCLP = null;
		String[] hsolCostoTotalUSD = null;
		
		// GEO_HEJECUCION
		String[] ejecAnioAsig = null;
		String[] ejecFuente = null;
		String[] ejecRate = null;
		String[] ejecAsignadoCLP = null;
		String[] ejecPagadoCLP = null;
		
		for ( int j = 0; j < nList.getLength(); j++ ) {
			Node nNode = nList.item(j);
			
			if ( nNode.getNodeType()==Node.ELEMENT_NODE ) {
				Element eElement = (Element) nNode;
				
				anioPresupuestario = eElement.getElementsByTagName("anioPresupuestario").item(0).getTextContent();
				codigoEtapa = eElement.getElementsByTagName("codigoEtapa").item(0).getTextContent();					
				nombreEtapa = eElement.getElementsByTagName("nombreEtapa").item(0).getTextContent();
				fechaPostSNI = eElement.getElementsByTagName("fechaPostSNI").item(0).getTextContent();
				fechaIngresoSNI = eElement.getElementsByTagName("fechaIngresoSNI").item(0).getTextContent();
				codigoBIP = eElement.getElementsByTagName("codigoBIP").item(0).getTextContent();
				nombre = eElement.getElementsByTagName("nombre").item(0).getTextContent();
				codigoTipologia = eElement.getElementsByTagName("codigoTipologia").item(0).getTextContent();
				nombreTipologia = eElement.getElementsByTagName("nombreTipologia").item(0).getTextContent();
				codigoIdiRel = eElement.getElementsByTagName("codigo").item(0).getTextContent();
				parteIdiRel = eElement.getElementsByTagName("parte").item(0).getTextContent();
				codigoSeia = eElement.getElementsByTagName("codigoSeia").item(0).getTextContent();
				locGeografica = eElement.getElementsByTagName("locGeografica").item(0).getTextContent();
				competencia = eElement.getElementsByTagName("competencia").item(0).getTextContent();
				distrito = eElement.getElementsByTagName("distrito").item(0).getTextContent();
				circunscripcion = eElement.getElementsByTagName("circunscripcion").item(0).getTextContent();
				prioridad = eElement.getElementsByTagName("prioridad").item(0).getTextContent();
				justificacion = eElement.getElementsByTagName("justificacion").item(0).getTextContent();
				descActividades = eElement.getElementsByTagName("descActividades").item(0).getTextContent();
				situacion = eElement.getElementsByTagName("situacion").item(0).getTextContent();
				conclusiones = eElement.getElementsByTagName("conclusiones").item(0).getTextContent();
				instFormuladora = eElement.getElementsByTagName("instFormuladora").item(0).getTextContent();
				instTecnica = eElement.getElementsByTagName("instTecnica").item(0).getTextContent();
				instFinanciera = eElement.getElementsByTagName("instFinanciera").item(0).getTextContent();
				responsable = eElement.getElementsByTagName("responsable").item(0).getTextContent();
				
				nListAux = doc.getElementsByTagName("descriptor");
				
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					descriptor[k] = eElement.getElementsByTagName("descriptor").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("adi");
					
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					adiNombre[k] = eElement.getElementsByTagName("nombre").item(0).getTextContent();
					adiTipoImpacto[k] = eElement.getElementsByTagName("tipoImpacto").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("georreferenciacion");
					
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					grefTipoElemento[k] = eElement.getElementsByTagName("tipoElemento").item(0).getTextContent();
					grefcodigoOCG[k] = eElement.getElementsByTagName("codigoOCG").item(0).getTextContent();
					grefcrdOrden[k] = eElement.getElementsByTagName("orden").item(0).getTextContent();
					grefcrdEjeX[k] = eElement.getElementsByTagName("ejeX").item(0).getTextContent();
					grefcrdEjeY[k] = eElement.getElementsByTagName("ejeY").item(0).getTextContent();
					grefcrdNombre[k] = eElement.getElementsByTagName("nombre").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("solicitudFinanciamiento");
					
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					solfinFuente[k] = eElement.getElementsByTagName("fuente").item(0).getTextContent();
					solfinItem[k] = eElement.getElementsByTagName("item").item(0).getTextContent();
					solfinMoneda[k] = eElement.getElementsByTagName("moneda").item(0).getTextContent();
					solfinPagado[k] = eElement.getElementsByTagName("pagado").item(0).getTextContent();
					solfinSolicitado[k] = eElement.getElementsByTagName("solicitado").item(0).getTextContent();
					solfinSaldoPorInvertir[k] = eElement.getElementsByTagName("saldoPorInvertir").item(0).getTextContent();
					solfinCostoTotal[k] = eElement.getElementsByTagName("costoTotal").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("programacion");
				
				//---------------- REVISAR ASIGNACION DE VAORES ----------------
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					progTipo[k] = eElement.getElementsByTagName("fuente").item(0).getTextContent();
					progItemFuente[k] = eElement.getElementsByTagName("item").item(0).getTextContent();
					progMontoCLP[k] = eElement.getElementsByTagName("moneda").item(0).getTextContent();
					progMontoUSD[k] = eElement.getElementsByTagName("pagado").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("histRecepcionSNI");
					
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					hrepRecepcion[k] = eElement.getElementsByTagName("recepcion").item(0).getTextContent();
					hrepFecha[k] = eElement.getElementsByTagName("fecha").item(0).getTextContent();
					hrepInstResp[k] = eElement.getElementsByTagName("instResponsable").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("histResultadoRATE");
					
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					hresRate[k] = eElement.getElementsByTagName("rate").item(0).getTextContent();
					hresResultado[k] = eElement.getElementsByTagName("resultado").item(0).getTextContent();
					hresFecha[k] = eElement.getElementsByTagName("fecha").item(0).getTextContent();
					hresNombreUsuario[k] = eElement.getElementsByTagName("nombreUsuario").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("resultadoProyecto");
				
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					rproFecha[k] = eElement.getElementsByTagName("fecha").item(0).getTextContent();
					rproDuracion[k] = eElement.getElementsByTagName("duracion").item(0).getTextContent();
					rproBenefMujer[k] = eElement.getElementsByTagName("benefMujer").item(0).getTextContent();
					rproBenefHombre[k] = eElement.getElementsByTagName("benefHombre").item(0).getTextContent();
					rproTMDA[k] = eElement.getElementsByTagName("TMDA").item(0).getTextContent();
					rproMagnitud[k] = eElement.getElementsByTagName("magnitud").item(0).getTextContent();
					rproVidaUtil[k] = eElement.getElementsByTagName("vidaUtil").item(0).getTextContent();
					rproIndicador[k] = eElement.getElementsByTagName("indicador").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("resultadoEstBasico");
				
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					rebaFecha[k] = eElement.getElementsByTagName("fecha").item(0).getTextContent();
					rebaDuracion[k] = eElement.getElementsByTagName("duracion").item(0).getTextContent();
					rebaInstContraparteTecnica[k] = eElement.getElementsByTagName("instContraparteTecnica").item(0).getTextContent();
					rebaInstEntidadUsuaria[k] = eElement.getElementsByTagName("instEntidadUsuaria").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("resultadoPrograma");
				
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					rprgFecha[k] = eElement.getElementsByTagName("fecha").item(0).getTextContent();
					rprgDuracion[k] = eElement.getElementsByTagName("duracion").item(0).getTextContent();
					rprgBenefMujer[k] = eElement.getElementsByTagName("benefMujer").item(0).getTextContent();
					rprgBenefHombre[k] = eElement.getElementsByTagName("benefHombre").item(0).getTextContent();
					rprgProposito[k] = eElement.getElementsByTagName("proposito").item(0).getTextContent();
					rprgIndicadorProposito[k] = eElement.getElementsByTagName("indicadorProposito").item(0).getTextContent();
					rprgComponente[k] = eElement.getElementsByTagName("componente").item(0).getTextContent();
					rprgIndicadorComponente[k] = eElement.getElementsByTagName("indicadorComponente").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("histSolicitudFinanc");
				
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					hsolAnioPres[k] = eElement.getElementsByTagName("anioPres").item(0).getTextContent();
					hsolRate[k] = eElement.getElementsByTagName("rate").item(0).getTextContent();
					hsolPagado[k] = eElement.getElementsByTagName("pagado").item(0).getTextContent();
					hsolSolicitadoAnioCLP[k] = eElement.getElementsByTagName("solicitadoAnioCLP").item(0).getTextContent();
					hsolSolicitadoAnioUSD[k] = eElement.getElementsByTagName("solicitadoAnioUSD").item(0).getTextContent();
					hsolSaldoPorInvertirCLP[k] = eElement.getElementsByTagName("saldoPorInvertirCLP").item(0).getTextContent();
					hsolSaldoPorInvertirUSD[k] = eElement.getElementsByTagName("saldoPorInvertirUSD").item(0).getTextContent();
					hsolCostoTotalCLP[k] = eElement.getElementsByTagName("costoTotalCLP").item(0).getTextContent();
					hsolCostoTotalUSD[k] = eElement.getElementsByTagName("costoTotalUSD").item(0).getTextContent();
				}
				
				nListAux = doc.getElementsByTagName("ejecucion");
				
				for ( k = 0; k<nListAux.getLength(); k++ ) {
					ejecAnioAsig[k] = eElement.getElementsByTagName("anioAsig").item(0).getTextContent();
					ejecFuente[k] = eElement.getElementsByTagName("fuente").item(0).getTextContent();
					ejecRate[k] = eElement.getElementsByTagName("rate").item(0).getTextContent();
					ejecAsignadoCLP[k] = eElement.getElementsByTagName("asignadoCLP").item(0).getTextContent();
					ejecPagadoCLP[k] = eElement.getElementsByTagName("pagadoCLP").item(0).getTextContent();
				}
			}
		}
		
		JSONObject datos = new JSONObject();
		
		datos.put("anioPresupuestario", anioPresupuestario);
		datos.put("codigoEtapa", codigoEtapa);
		datos.put("nombreEtapa", nombreEtapa);
		datos.put("fechaPostSNI", fechaPostSNI);
		datos.put("fechaIngresoSNI", fechaIngresoSNI);
		datos.put("codigoBIP", codigoBIP);
		datos.put("nombre", nombre);
		datos.put("codigoTipologia", codigoTipologia);
		datos.put("nombreTipologia", nombreTipologia);
		datos.put("codigoIdiRel", codigoIdiRel);
		datos.put("parteIdiRel", parteIdiRel);
		datos.put("codigoSeia", codigoSeia);
		datos.put("locGeografica", locGeografica);
		datos.put("competencia",competencia);
		datos.put("distrito", distrito);
		datos.put("circunscripcion", circunscripcion);
		datos.put("prioridad", prioridad);
		datos.put("justificacion", justificacion);
		datos.put("descActividades", descActividades);
		datos.put("situacion", situacion);
		datos.put("conclusiones", conclusiones);
		datos.put("instFormuladora",instFormuladora);
		datos.put("instTecnica", instTecnica);
		datos.put("instFinanciera", instFinanciera);
		datos.put("responsable", responsable);
		
		datos.put("descriptor", descriptor);
		datos.put("adiNombre", adiNombre);
		datos.put("adiTipoImpacto", adiTipoImpacto);
		datos.put("grefTipoElemento", grefTipoElemento);
		datos.put("grefcodigoOCG", grefcodigoOCG);
		datos.put("grefcrdOrden", grefcrdOrden);
		datos.put("grefcrdEjeX", grefcrdEjeX);
		datos.put("grefcrdEjeY", grefcrdEjeY);
		datos.put("grefcrdNombre", grefcrdNombre);
		datos.put("solfinFuente", solfinFuente);
		datos.put("solfinItem", solfinItem);
		datos.put("solfinMoneda", solfinMoneda);
		datos.put("solfinPagado", solfinPagado);
		datos.put("solfinSolicitado", solfinSolicitado);
		datos.put("solfinSaldoPorInvertir", solfinSaldoPorInvertir);
		datos.put("solfinCostoTotal", solfinCostoTotal);
		datos.put("progTipo", progTipo);
		datos.put("progItemFuente", progItemFuente);
		datos.put("progMontoCLP", progMontoCLP);
		datos.put("progMontoUSD", progMontoUSD);
		datos.put("hrepRecepcion", hrepRecepcion);
		datos.put("hrepFecha", hrepFecha);
		datos.put("hrepInstResp", hrepInstResp);
		datos.put("hresRate", hresRate);
		datos.put("hresResultado", hresResultado);
		datos.put("hresFecha", hresFecha);
		datos.put("hresNombreUsuario", hresNombreUsuario);
		datos.put("rproFecha", rproFecha);
		datos.put("rproDuracion", rproDuracion);
		datos.put("rproBenefMujer", rproBenefMujer);
		datos.put("rproBenefHombre", rproBenefHombre);
		datos.put("rproTMDA", rproTMDA);
		datos.put("rproMagnitud", rproMagnitud);
		datos.put("rproVidaUtil", rproVidaUtil);
		datos.put("rproIndicador", rproIndicador);
		datos.put("rebaFecha", rebaFecha);
		datos.put("rebaDuracion", rebaDuracion);
		datos.put("rebaInstContraparteTecnica", rebaInstContraparteTecnica);
		datos.put("rebaInstEntidadUsuaria", rebaInstEntidadUsuaria);
		datos.put("rprgFecha", rprgFecha);
		datos.put("rprgDuracion", rprgDuracion);
		datos.put("rprgBenefMujer", rprgBenefMujer);
		datos.put("rprgBenefHombre", rprgBenefHombre);
		datos.put("rprgProposito", rprgProposito);
		datos.put("rprgIndicadorProposito", rprgIndicadorProposito);
		datos.put("rprgComponente", rprgComponente);
		datos.put("rprgIndicadorComponente", rprgIndicadorComponente);
		datos.put("hsolAnioPres", hsolAnioPres);
		datos.put("hsolRate", hsolRate);
		datos.put("hsolPagado", hsolPagado);
		datos.put("hsolSolicitadoAnioCLP", hsolSolicitadoAnioCLP);
		datos.put("hsolSolicitadoAnioUSD", hsolSolicitadoAnioUSD);
		datos.put("hsolSaldoPorInvertirCLP", hsolSaldoPorInvertirCLP);
		datos.put("hsolSaldoPorInvertirUSD", hsolSaldoPorInvertirUSD);
		datos.put("hsolCostoTotalCLP", hsolCostoTotalCLP);
		datos.put("hsolCostoTotalUSD", hsolCostoTotalUSD);
		datos.put("ejecAnioAsig", ejecAnioAsig);
		datos.put("ejecFuente", ejecFuente);
		datos.put("ejecRate", ejecRate);
		datos.put("ejecAsignadoCLP", ejecAsignadoCLP);
		datos.put("ejecPagadoCLP", ejecPagadoCLP);
		
		retorno.putOpt("datos", datos);
		
		soapConnection.close();
		return retorno;
	}
	
	public static JSONObject getConfig() throws IOException {
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		InputStream stream = classLoader.getResourceAsStream("config_cc.json");
		
		//LEEMOS EL ARCHIVO DE CONFIGURACION
		byte[] contents = new byte[4096];
		int bytesRead = 0;
		String config = "";
		
		while ( (bytesRead = stream.read(contents))!=-1 ) {
			String linea = new String(contents, 0, bytesRead);
			
			if ( linea.trim().indexOf("//")==0 ) {
				continue;
			}
			
			config += linea;
		}
		
		//ELIMINAMOS LOS COMENTARIOS
		config = config.replaceAll("//.*[\r\n]", "");
		
		try {
			return new JSONObject(config);
		} catch ( Exception e ) {
			System.out.println("Existe un error en la hoja de configuraciones del portal config.json");
			
			return null;
		}
	}
}
