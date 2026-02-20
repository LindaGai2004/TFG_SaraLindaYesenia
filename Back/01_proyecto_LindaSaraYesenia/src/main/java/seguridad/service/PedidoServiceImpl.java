package seguridad.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import seguridad.model.DetallePedido;
import seguridad.model.EstadoPedido;
import seguridad.model.Libro;
import seguridad.model.Papeleria;
import seguridad.model.Pedido;
import seguridad.model.dto.IngresoMensualDto;
import seguridad.model.dto.PedidoItemResponseDto;
import seguridad.model.dto.PedidoResponseDto;
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
		pedido.setEstadoPedido(estadoPedido);
		return prepo.save(pedido);
		
	}
	//total real para el back
	
	public void recalcularTotalPedido(Pedido pedido) {

	    List<DetallePedido> detalles =
	            dprepo.findByPedido_IdPedido(pedido.getIdPedido());

	    if (detalles.isEmpty()) {
	        throw new RuntimeException("El carrito está vacío");
	    }

	    BigDecimal subtotal = BigDecimal.ZERO;
	    BigDecimal ivaTotal = BigDecimal.ZERO;
	    //fijo por ahora
	    BigDecimal delivery = BigDecimal.valueOf(2.00);

	    for (DetallePedido d : detalles) {

	        BigDecimal precioUnidad = BigDecimal.valueOf(d.getPrecioUnidad());
	        BigDecimal cantidad = BigDecimal.valueOf(d.getCantidad());
	        BigDecimal totalPorItem = precioUnidad.multiply(cantidad);

	        subtotal = subtotal.add(totalPorItem);

	        BigDecimal iva = (d.getProducto() instanceof Libro)
	                ? totalPorItem.multiply(IVA_LIBRO)
	                : totalPorItem.multiply(IVA_PAPELERIA);

	        ivaTotal = ivaTotal.add(iva);
	    }

	    subtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
	    ivaTotal = ivaTotal.setScale(2, RoundingMode.HALF_UP);
	    BigDecimal totalFinal = subtotal.add(ivaTotal).add(delivery)
	            .setScale(2, RoundingMode.HALF_UP);

	    pedido.setTotal(totalFinal.doubleValue());
	}
	//muestra subtotal + iva = total final
	//para el ui, solo para mostrar
	@Override
	public PedidoResponseDto resumenPedido(Integer idPedido) {

		Pedido pedido = prepo.findById(idPedido)
	            .orElseThrow(() -> new RuntimeException("No existe este pedido"));

	    List<DetallePedido> detalles =
	            dprepo.findByPedido_IdPedido(idPedido);

	    BigDecimal subtotal = BigDecimal.ZERO;
	    BigDecimal ivaTotal = BigDecimal.ZERO;

	    List<PedidoItemResponseDto> items = new ArrayList<>();

	    for (DetallePedido d : detalles) {

	        BigDecimal precioUnidad = BigDecimal.valueOf(d.getPrecioUnidad());
	        BigDecimal cantidad = BigDecimal.valueOf(d.getCantidad());
	        BigDecimal totalPorItem = precioUnidad.multiply(cantidad);

	        subtotal = subtotal.add(totalPorItem);

	        BigDecimal iva = (d.getProducto() instanceof Libro)
	                ? totalPorItem.multiply(IVA_LIBRO)
	                : totalPorItem.multiply(IVA_PAPELERIA);

	        ivaTotal = ivaTotal.add(iva);

	        items.add(new PedidoItemResponseDto(
	                d.getProducto().getIdProducto(),
	                d.getProducto().getNombreProducto(),
	                (d.getProducto() instanceof Libro libro) ? libro.getAutor() : null,
	                d.getCantidad(),
	                d.getPrecioUnidad(),
	                totalPorItem.doubleValue()
	        ));
	    }

	    subtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
	    ivaTotal = ivaTotal.setScale(2, RoundingMode.HALF_UP);

	    return new PedidoResponseDto(
	            pedido.getIdPedido(),
	            pedido.getFechaVenta(),
	            pedido.getMetodoPago(),         
	            pedido.getEstadoPedido(),              
	            subtotal.doubleValue(),
	            ivaTotal.doubleValue(),
	            pedido.getTotal(),
	            pedido.getUsuario().getNombre(),
	            pedido.getUsuario().getDireccion(),
	            pedido.getUsuario().getEmail(),
	            items
	    );
	}

	
	@Override
	public List<IngresoMensualDto> getIngresosMensuales() {
        List<Pedido> pedidos = prepo.findAll();
        Map<Integer, IngresoMensualDto> map = new HashMap<>();
       
        for (Pedido p : pedidos) {

            if (p.getFechaVenta() != null) {
            	int mes = p.getFechaVenta().getMonthValue();
                IngresoMensualDto dto = map.getOrDefault(mes, new IngresoMensualDto(mes, 0, 0));
                
                List<DetallePedido> detalles = dprepo.findByPedido(p);
                
                for (DetallePedido detalle : detalles) {
                    if (detalle.getProducto() instanceof Libro) {
                        dto.addLibros(detalle.getPrecioUnidad());
                    } else if (detalle.getProducto() instanceof Papeleria) {
                        dto.addPapeleria(detalle.getPrecioUnidad());
                    }
                }

                map.put(mes, dto);
            }}

        return map.values().stream()
                  .sorted(Comparator.comparingInt(IngresoMensualDto::getMes))
                  .collect(Collectors.toList());
	}

	@Override
	public double getTotalIngreso() {
        return getIngresosMensuales().stream()
                .mapToDouble(IngresoMensualDto::getTotal)
                .sum();
	}

}
