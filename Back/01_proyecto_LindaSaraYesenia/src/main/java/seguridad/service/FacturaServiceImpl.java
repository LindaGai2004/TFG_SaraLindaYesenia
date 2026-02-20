package seguridad.service;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.Factura;
import seguridad.model.Pedido;
import seguridad.repository.FacturaRepository;
@Service
public class FacturaServiceImpl implements FacturaService{
	
	@Autowired
	private FacturaRepository frepo;
	@Override
	public Factura generarFactura(Pedido pedido) {
		Factura factura = new Factura();
		factura.setPedido(pedido);
		factura.setFechaFactura(LocalDate.now());
		factura.setPrecioTotal(pedido.getTotal());
		//nro de invoice
        String numero = "FAC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        factura.setNumFactura(numero);
        return frepo.save(factura);
	}

}
