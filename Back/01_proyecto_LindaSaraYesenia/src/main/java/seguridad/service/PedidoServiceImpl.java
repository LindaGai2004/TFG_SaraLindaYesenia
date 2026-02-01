package seguridad.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import seguridad.model.DetallePedido;
import seguridad.model.EstadoPedido;
import seguridad.model.Libro;
import seguridad.model.Pedido;
import seguridad.model.Dto.PedidoItemResponse;
import seguridad.model.Dto.PedidoResponse;
import seguridad.repository.PedidoRepository;
import seguridad.repository.DetallePedidoRepository;
@Service
public class PedidoServiceImpl implements PedidoService {

	@Autowired
	private PedidoRepository prepo;

	@Autowired
	private DetallePedidoRepository dprepo;
	
	private static final BigDecimal IVA_LIBRO = BigDecimal.valueOf(0.04);
	private static final BigDecimal IVA_PAPELERIA = BigDecimal.valueOf(0.21);

	@Override
	public Pedido findById(Integer idPedido) {
		return prepo.findById(idPedido).orElse(null);
	}
	
	@Override
	public List<Pedido> findByIdUsuario(Integer idUsuario) {
		return prepo.findByUsuario_IdUsuario(idUsuario);
	}
	@Override
	public List<Pedido> findAll() {
		return prepo.findAll();
	}

	@Override
	public Pedido updateEstado(Integer idPedido, EstadoPedido estadoPedido, Integer idUsuario) {
		Pedido pedido = prepo.findById(idPedido).orElseThrow(()-> new RuntimeException("No existe el pedido"));
		if (estadoPedido == EstadoPedido.CANCELADO) {
			if (!pedido.getUsuario().getIdUsuario().equals(idUsuario)) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el usuario tiene permiso para cancelar");
			}
			LocalDateTime venta = pedido.getFechaVenta().atStartOfDay();
			long hours = ChronoUnit.HOURS.between(venta, LocalDateTime.now());
			if (hours>24) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes cancelar un pedido hasta 24 horas después de haberla realizado");
			}
		}
		pedido.setEstado(estadoPedido);
		return prepo.save(pedido);
		
	}
	//muestra subtotal + iva = total final
	//para el ui
	@Override
	public PedidoResponse resumenPedido(Integer idPedido) {
		Pedido pedido = prepo.findById(idPedido)
				.orElseThrow(() -> new RuntimeException("No existe este pedido"));
		
		List<DetallePedido> detalles = dprepo.findByPedido_IdPedido(idPedido);
		
		BigDecimal subtotal = BigDecimal.ZERO;
		BigDecimal ivaTotal = BigDecimal.ZERO;
		
		List<PedidoItemResponse> items = new ArrayList<>();
		
		for (DetallePedido d: detalles) {
			BigDecimal precioUnidad = BigDecimal.valueOf(d.getPrecioUnidad());
		    BigDecimal cantidad = BigDecimal.valueOf(d.getCantidad());
			BigDecimal totalPorItem = precioUnidad.multiply(cantidad);
			subtotal = subtotal.add(totalPorItem);
			
			BigDecimal iva;
			
			if (d.getProducto() instanceof Libro) {
	            iva = totalPorItem.multiply(IVA_LIBRO);
	        } else {
	            iva = totalPorItem.multiply(IVA_PAPELERIA);
	        }
			
			ivaTotal = ivaTotal.add(iva);
			
			items.add(new PedidoItemResponse(
	                d.getProducto().getNombreProducto(),
	                d.getCantidad(),
	                d.getPrecioUnidad(),
	                totalPorItem.doubleValue()
	        ));
		}
		subtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
	    ivaTotal = ivaTotal.setScale(2, RoundingMode.HALF_UP);
	    BigDecimal total = subtotal.add(ivaTotal);

	    return new PedidoResponse(
	            pedido.getIdPedido(),
	            pedido.getFechaVenta(),
	            "MASTERCARD",
	            pedido.getEstado(),
	            subtotal.doubleValue(),
	            ivaTotal.doubleValue(),
	            total.doubleValue(),
	            pedido.getUsuario().getNombre(),
	            pedido.getUsuario().getDireccion(),
	            pedido.getUsuario().getEmail(),
	            items
	    );
	}

}
