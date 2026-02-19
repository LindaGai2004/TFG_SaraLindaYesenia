package seguridad.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paypal.core.PayPalHttpClient;
import com.paypal.orders.AmountWithBreakdown;
import com.paypal.orders.ApplicationContext;
import com.paypal.orders.Order;
import com.paypal.orders.OrderRequest;
import com.paypal.orders.OrdersCaptureRequest;
import com.paypal.orders.OrdersCreateRequest;
import com.paypal.orders.PurchaseUnitRequest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import seguridad.model.DetallePedido;
import seguridad.model.EstadoPago;
import seguridad.model.EstadoPedido;
import seguridad.model.EstadoProducto;
import seguridad.model.Factura;
import seguridad.model.MetodoPago;
import seguridad.model.Pedido;
import seguridad.model.Producto;
import seguridad.model.dto.PaypalPedidoResponseDto;
import seguridad.model.dto.PedidoResponseDto;
import seguridad.repository.DetallePedidoRepository;
import seguridad.repository.PedidoRepository;
import seguridad.repository.ProductoRepository;
@Service
@RequiredArgsConstructor
public class PaypalServiceImpl implements PaypalService{
	private final PayPalHttpClient payPalHttpClient;
	@Autowired
	private final PedidoRepository perepo;
	@Autowired
	private final DetallePedidoRepository dprepo;
	@Autowired
	private ProductoRepository porepo;
	@Autowired
	private FacturaService fserv;
	@Autowired
	private PdfService pdfServ;
	@Autowired
	private EmailService eserv;
	@Autowired
	private PedidoRepository  prepo;
	@Autowired
	private PedidoService pserv;
	//cuando el usuario hace click en PayPal llama a este metodo
	//paypal devuelve el order.id
	@Override
	public PaypalPedidoResponseDto crearPedido(Integer idPedido) throws IOException {
		Pedido pedido = perepo.findById(idPedido)
				.orElseThrow();
		
		OrdersCreateRequest request = new OrdersCreateRequest();
		request.prefer("return=representation");
		OrderRequest orderRequest = new OrderRequest()
		.applicationContext(new ApplicationContext()
						      .returnUrl("http://localhost:5173/paypal/success")
						      .cancelUrl("http://localhost:5173/paypal/cancel"))
		.checkoutPaymentIntent("CAPTURE")
        .purchaseUnits(
                java.util.List.of(new PurchaseUnitRequest()
                       .amountWithBreakdown(new AmountWithBreakdown()
                            .currencyCode("EUR")
                            .value(String.format("%.2f", pedido.getTotal()))
             )
           )
        );
		request.requestBody(orderRequest);
		Order order = payPalHttpClient.execute(request).result();
		
		String paypalPedidoId = order.id();
		//Paypal debe devolver approve link
		String approveLink = order.links().stream()
				.filter(l-> "approve".equalsIgnoreCase(l.rel()))
				.map(l -> l.href())
				.findFirst()
				.orElse(null);
		//guardar el order.id como paypalIdPedido en bd
		pedido.setPaypalIdPedido(order.id());
		pedido.setMetodoPago(MetodoPago.PAYPAL);
		pedido.setEstadoPago(EstadoPago.PENDIENTE);
		perepo.save(pedido);
		return new PaypalPedidoResponseDto(paypalPedidoId, approveLink);
	}

	@Override
	@Transactional
	public PedidoResponseDto capturarPedido(String paypalIdPedido) throws IOException {

	    OrdersCaptureRequest request = new OrdersCaptureRequest(paypalIdPedido);
	    request.requestBody(new OrderRequest());
	    payPalHttpClient.execute(request).result();

	    Pedido pedido = perepo.findByPaypalIdPedido(paypalIdPedido);

	    if (pedido == null) {
	        throw new RuntimeException("Pedido no encontrado");
	    }

	    //evitar doble ejecucion
	    if (pedido.getEstadoPedido() == EstadoPedido.REALIZADO) {
	        return pserv.resumenPedido(pedido.getIdPedido());
	    }
	    pserv.recalcularTotalPedido(pedido);
	    //(stock + factura + nuevo carrito)
	    confirmarCarritoInterno(pedido);

	    //Devolver pedido confirmado
	    return pserv.resumenPedido(pedido.getIdPedido());
	}

	private void confirmarCarritoInterno(Pedido pedido) {

	    List<DetallePedido> detalles = dprepo.findByPedido_IdPedido(pedido.getIdPedido());

	    if (detalles.isEmpty()) {
	        throw new RuntimeException("El carrito está vacío");
	    }

	    for (DetallePedido d: detalles) {

	        Producto producto = d.getProducto();
	        int cantidad = d.getCantidad();

	        if(producto.getStock() < cantidad) {
	            throw new RuntimeException(
	                "¡No hay stock para " + producto.getNombreProducto() + "!");
	        }

	        producto.setStock(producto.getStock() - cantidad);

	        if(producto.getStock() == 0) {
	            producto.setEstadoProducto(EstadoProducto.AGOTADO);
	        }

	        porepo.save(producto);
	    }

	    //finalizar pedido 
	    pedido.setEstadoPedido(EstadoPedido.REALIZADO);
	    pedido.setEstadoPago(EstadoPago.PAGADO);
	    pedido.setFechaVenta(LocalDate.now());

	    prepo.save(pedido);

	    //Generar factura
	    Factura factura = fserv.generarFactura(pedido);
	    try {
	        byte[] pdf = pdfServ.generarPdf(factura);
	        eserv.enviarFacturaAdjunto(
	            pedido.getUsuario().getEmail(), factura, pdf);
	    } catch (Exception e) {
	        throw new RuntimeException("Error generando factura", e);
	    }

	    //nuevo carrito vacío
	    Pedido nuevoCarrito = new Pedido();
	    nuevoCarrito.setUsuario(pedido.getUsuario());
	    nuevoCarrito.setEstadoPedido(EstadoPedido.CARRITO);
	    nuevoCarrito.setTotal(0.0);
	    nuevoCarrito.setFechaVenta(null);

	    prepo.save(nuevoCarrito);
	}
	@Transactional
	public void cancelarPedido(String paypalIdPedido) {

	    Pedido pedido = perepo.findByPaypalIdPedido(paypalIdPedido);

	    if (pedido == null) {
	        throw new RuntimeException("Pedido no encontrado");
	    }

	    pedido.setEstadoPedido(EstadoPedido.CARRITO);
	    pedido.setEstadoPago(null);

	    perepo.save(pedido);
	}
}
