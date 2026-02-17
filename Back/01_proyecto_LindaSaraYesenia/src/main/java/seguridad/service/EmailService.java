package seguridad.service;

import seguridad.model.Factura;

public interface EmailService {
	void enviarFacturaAdjunto(String to, Factura factura, byte[] pdf) throws Exception;
}
