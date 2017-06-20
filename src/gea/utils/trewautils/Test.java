package gea.utils.trewautils;

import cl.cgr.geocgr.chilecompra.access.implementations.UtilsGeocgr;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
    		byte[] documentoKML = new byte[50];
		    byte[] documentoTrActoAdm = new byte[50];
		    byte[] documentoTrOficio = new byte[50];
		    byte[] documentoBasesRefundidas = new byte[50];
		    byte[] documentoOfertaEconomica = new byte[50];
		    
		    try{
		    UtilsGeocgr util = new UtilsGeocgr();

		    String pkExpedienteTrewa = util.createContractAndPhaseChangeAC("CC", "PROYECTO PRB2- CC2", "1854");
		    
		    if(pkExpedienteTrewa != null){
		    
		    
		    String refDocKmlKmzEnTrewa = util.incorporateDocumentKmlKmz(pkExpedienteTrewa, "nombreDelArchivoKMLKMZ.kml", "application/vnd.google-earth.kml+xml", documentoKML);

		    String refDocActoAdministrativo = util.incorporateDocumentTRActoAdministrativo(pkExpedienteTrewa, 
		      "trActoAdministrativo.pdf", "application/pdf", documentoTrActoAdm);

	    
		    String refDocOficio = util.incorporateDocumentTROficio(pkExpedienteTrewa, 
		      "trOficio.pdf", "application/pdf", documentoTrOficio);

		    System.out.println("refDocOficio "+refDocOficio);
		    
		    
		    String pkServicioContratante = util.getPkServiceBySistradocCode("1854");

		    System.out.println("pkServicioContratante "+pkServicioContratante);
		    
		    
		    String refDocBasesRefundidas = util.incorporateDocumentACCCBasesRefundidas(pkExpedienteTrewa, 
		      "basesRefundidas.pdf", "application/pdf", documentoBasesRefundidas);

		    System.out.println("refDocBasesRefundidas "+refDocBasesRefundidas);
		    
		    String refDocOfertaEconomica = util.incorporateDocumentACCCOfertaEconomica(pkExpedienteTrewa, 
		      "ofertaEconomica.pdf", "application/pdf", documentoOfertaEconomica);

		    System.out.println("refDocOfertaEconomica "+refDocOfertaEconomica);
		    }
		    }catch (Exception e){
		    	e.printStackTrace();
		    	
		    } 
	}

}
