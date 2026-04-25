package seguridad.service;

import seguridad.model.Factura;

public interface EmailService {
	void enviarFacturaAdjunto(String to, Factura factura, byte[] pdf) throws Exception;

	void enviarCodigoRecuperacion(String to, String codigo) throws Exception;
	
	void enviarEmailSimple(String to, String asunto, String mensaje) throws Exception;

	void enviarEmailVerificacion(String to, String nombre, String token) throws Exception;
}
