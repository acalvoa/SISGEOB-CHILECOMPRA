package gea.utils.trewautils;

import cl.cgr.geocgr.chilecompra.access.implementations.UtilsGeocgr;

public class TrewaUtil {
	private UtilsGeocgr util = null;
	
	public TrewaUtil(){
		this.util = new UtilsGeocgr();
	}
	
	//Se crea el contrato en Trew@ y se lleva a la etapa de Aprobaci�n del contrato.
	public  String creacionContratoCambioEtapa(String contractType,String contractTittle, String SISTRADOCCodeService){
		String pkExpedienteTrewa = "-1";
		try{
		pkExpedienteTrewa = util.createContractAndPhaseChangeAC(contractType, contractTittle, SISTRADOCCodeService);
		}catch(Exception e){
			e.printStackTrace();
		}
		return pkExpedienteTrewa;
		
	}
	
	//Antes de crear el contrato en GEOCGR, se sube el archivo KML/KMZ a Trew@, para obtener la referencia del documento y usarla en el alta del contrato.
	public String ingresarDocumentoKML(String idExpedienteTrewa,String nombreArchivo,byte[] documentoKML){
		  String refDocKmlKmzEnTrewa = util.incorporateDocumentKmlKmz(idExpedienteTrewa, nombreArchivo, "application/vnd.google-earth.kml+xml", documentoKML);
		  return refDocKmlKmzEnTrewa;
	}
	
	//Documento del Acto Administrativo
	public String ingresarDocumentoTRActoAdministrativo(String idExpedienteTrewa,String nombreArchivo,byte[] documentoTrActoAdm){
		  String refDocActoAdministrativo = util.incorporateDocumentTRActoAdministrativo(idExpedienteTrewa,nombreArchivo, "application/pdf", documentoTrActoAdm);
		  return refDocActoAdministrativo;
	}
	
	//Documento del Oficio
	public String ingresarDocumentTROficio(String idExpedienteTrewa,String nombreArchivo,byte[] documentoTrOficio){
		  String refDocOficio = util.incorporateDocumentTROficio(idExpedienteTrewa,nombreArchivo, "application/pdf", documentoTrOficio);
		  return refDocOficio;
	}
	// obtiene el servicio Mandante/Contratante
	public String obtenerServicioContratante(String codSistradoc){
		String pkServicioContratante = util.getPkServiceBySistradocCode(codSistradoc);
		return pkServicioContratante;
	}
     
	//Se insertan los documentos de la etapa de Adjudicaci�n del contrato. Bases refundidas
	public String ingresarDocumentoBasesRefundidas(String idExpedienteTrewa,String nombreArchivo,byte[] documentoBasesRefundidas){
      String refDocBasesRefundidas = util.incorporateDocumentACCCBasesRefundidas(idExpedienteTrewa,nombreArchivo, "application/pdf", documentoBasesRefundidas);
  	  return refDocBasesRefundidas;
	}
	
	//Se insertan los documentos de la etapa de Adjudicaci�n del contrato. Bases refundidas
		public String ingresarDocumentoOfertaEconomica(String idExpedienteTrewa,String nombreArchivo,byte[] documentoOfertaEconomica){
	       String refDocOfertaEconomica = util.incorporateDocumentACCCOfertaEconomica(idExpedienteTrewa,nombreArchivo, "application/pdf", documentoOfertaEconomica);
	       return refDocOfertaEconomica;
		}
	
	//Se Asigna el servicio contratante al contrato en la bandeja de expediente
		public boolean asignaservicioBandeja(String codSistradoc, String codigoExpeTrewa)
		{
			boolean operacionexitosa= util.asignarServicioContratoBandeja(codSistradoc, codigoExpeTrewa);
			return operacionexitosa;
		}
}
