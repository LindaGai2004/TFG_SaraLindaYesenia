package seguridad.service;

import seguridad.model.Factura;
import seguridad.model.Pedido;

public interface FacturaService {
		Factura generarFactura(Pedido pedido);
}
