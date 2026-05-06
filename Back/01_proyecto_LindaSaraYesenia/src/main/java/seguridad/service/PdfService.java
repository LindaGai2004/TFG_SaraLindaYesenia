package seguridad.service;

import seguridad.model.Factura;

public interface PdfService {
	byte[] generarPdf (Factura factura) throws Exception;
}
