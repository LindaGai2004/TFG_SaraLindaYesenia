package seguridad.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import seguridad.model.DetallePedido;
import seguridad.model.EstadoPedido;
import seguridad.model.EstadoProducto;
import seguridad.model.Factura;
import seguridad.model.Pedido;
import seguridad.model.Producto;
import seguridad.model.Usuario;
import seguridad.model.dto.CarritoItemRequestDto;
import seguridad.model.dto.PedidoResponseDto;
import seguridad.repository.DetallePedidoRepository;
import seguridad.repository.PedidoRepository;
import seguridad.repository.ProductoRepository;
import seguridad.repository.UsuarioRepository;
@Service
public class CarritoServiceImpl implements CarritoService {

	@Autowired
	private PedidoRepository  prepo;
	@Autowired
	private UsuarioRepository urepo;
	@Autowired
	private ProductoRepository porepo;
	@Autowired
	private DetallePedidoRepository dprepo;
    @Autowired
    private PedidoService pserv;
	@Autowired
	private FacturaService fserv;
	@Autowired
	private PdfService pdfServ;
	@Autowired
	private EmailService eserv;

	/*	  Flujo actual:
	 * -> EstadoPedido: CARRITO
	 * -> prepararPedido() calcular el total
	 * -> Checkout
	 * -> capturarPedido()  confirmar con PayPal
	 * -> EstadoPedido: REALIZADO
	 * -> Success 
	 * -> EstadoPedido: CARRITO Se crea nuevo carrito va                                    cio
	 * */   
	
	// Estado = 'CARRITO'
	// Se crear un carrito si no existe o devuelve uno si ya existe
	@Override
	public Pedido createCarrito(Integer idUsuario) {
		Usuario usuario = urepo.findById(idUsuario)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
		//Verificar si ya existe Pedido con estado 'CARRITO' para un usuario
		 Optional<Pedido> existente =
		            prepo.findByUsuario_IdUsuarioAndEstadoPedido(idUsuario, EstadoPedido.CARRITO);
		 //Si ya existe devolver
		 if (existente.isPresent()) {
	        return existente.get();
	    }
		//Si no crea uno 
		Pedido carritoNuevo = new Pedido();
		carritoNuevo.setUsuario(usuario);
		carritoNuevo.setEstadoPedido(EstadoPedido.CARRITO);
		carritoNuevo.setFechaVenta(null);
		carritoNuevo.setTotal(0.0);
		return prepo.save(carritoNuevo);
	}
		
	
	//Funcionalidad "Add to cart" SOLO ADD (+)
	@Override
	public Pedido addItem(Integer idUsuario, CarritoItemRequestDto item) {
		//Obtener carrito si existe sino lo crea
		Pedido carrito = createCarrito(idUsuario);
		//Verificar que exista el producto
		Producto producto = porepo.findById(item.getIdProducto())
				.orElseThrow(() -> new RuntimeException("Producto no encontrado"));
		//Verificar disponibilidad
		if(producto.getStock() <= 0) {
			throw new RuntimeException("¡Producto sin stock!");
		}
		//Si el producto existe en el carrito aumentar cantidad sino crear nueva linea detallePedido
		DetallePedido itemExiste = dprepo.findByPedido_IdPedidoAndProducto_IdProducto(
			carrito.getIdPedido(), producto.getIdProducto()).orElse(null);
		
		//La cantidad del producto en el carrito actual
		int qtyEnCarrito = 0;
		if (itemExiste != null) {
			qtyEnCarrito = itemExiste.getCantidad();
		}
		
		//Asegurar q no exceda la cantidad de stock disponible
		int qtyFinal = qtyEnCarrito + item.getCantidad();

	    if (qtyFinal > producto.getStock()) {
	        throw new RuntimeException("¡Producto sin stock!");
	    }

	    if (itemExiste != null) {
	        itemExiste.setCantidad(qtyFinal);
	        dprepo.save(itemExiste);
	    } else {
	        DetallePedido itemNuevo = new DetallePedido();
	        itemNuevo.setPedido(carrito);
	        itemNuevo.setProducto(producto);
	        itemNuevo.setCantidad(item.getCantidad());
	        itemNuevo.setPrecioUnidad(producto.getPrecio());
	        dprepo.save(itemNuevo);
	    }

	    pserv.recalcularTotalPedido(carrito);
	    prepo.save(carrito);

	    return carrito;
		
	}
	//Cambiar la cantidad de un detallePedido existente (+/-) o eliminar si < 0
	@Override
	public Pedido updateItem(Integer idUsuario, CarritoItemRequestDto item) {
		//Obtener carrito
	    Pedido carrito = createCarrito(idUsuario);
	    //Obtener producto
	    Producto producto = porepo.findById(item.getIdProducto())
	    		.orElseThrow(() -> new RuntimeException("Producto no existe"));
	    //Encontrar detallePedido
	    DetallePedido detalle = dprepo.findByPedido_IdPedidoAndProducto_IdProducto(
	                    carrito.getIdPedido(), producto.getIdProducto())
	            .orElseThrow(() -> new RuntimeException("El producto no está en el carrito"));

	    if (item.getCantidad() <= 0) {
	        dprepo.delete(detalle);
	        pserv.recalcularTotalPedido(carrito);
	        prepo.save(carrito);
	        return carrito;
	    }
	    if (item.getCantidad() > producto.getStock()) {
	        throw new RuntimeException("¡Producto sin stock!");
	    }
	    //Para hacer update de la cantidad
	    detalle.setCantidad(item.getCantidad());
	    dprepo.save(detalle);
	    pserv.recalcularTotalPedido(carrito);
	    prepo.save(carrito);

	    return carrito;
	    
	}

	@Override
	public Pedido deleteItem(Integer idUsuario, Integer idProducto) {
	    Pedido carrito = createCarrito(idUsuario);
	    Optional<DetallePedido> detalleOpt =
	        dprepo.findByPedido_IdPedidoAndProducto_IdProducto(
	            carrito.getIdPedido(), idProducto
	        );
	    if (detalleOpt.isPresent()) {
	        dprepo.delete(detalleOpt.get());
	    }
	    return carrito;
	}

//	@Override
//	@Transactional //Si algun paso falla no se actualiza el stock ni se confirma el pedido
//	public PedidoResponseDto confirmarCarrito(Integer idUsuario) {
//		//Get carrito activo (Pedido en estado 'CARRITO')
//		Pedido carrito = prepo.findByUsuario_IdUsuarioAndEstado(idUsuario, EstadoPedido.CARRITO)
//			.orElseThrow(() -> new RuntimeException ("No hay carrito activo"));
//		//Get detalles
//		List<DetallePedido> detalles = dprepo.findByPedido_IdPedido(carrito.getIdPedido());
//		if (detalles.isEmpty()) {
//	        throw new RuntimeException("El carrito está vacío");
//	    }
//		double total = 0.0;
//		//Aca no calculamos total pq eso se hace en ResumenPedido
//		for (DetallePedido d: detalles) {
//			Producto producto = d.getProducto();
//			int cantidad = d.getCantidad();
//			//Verificar Stock
//			if(producto.getStock() < cantidad) {
//				 throw new RuntimeException(
//		                    "¡No hay stock para " + producto.getNombreProducto() + "!");
//			}
//			total += d.getPrecioUnidad() * cantidad;
//			//Actualizar stock
//			producto.setStock(producto.getStock() - cantidad);
//			//Actualizar ESTADO producto if stock=0
//			if(producto.getStock() == 0) {
//				producto.setEstadoProducto(EstadoProducto.AGOTADO);
//			}
//			
//			porepo.save(producto);
//			
//		}
//		//Pedido realizado con total
//		carrito.setTotal(total);
//		carrito.setEstado(EstadoPedido.REALIZADO);
//		carrito.setFechaVenta(LocalDate.now());
//		
//		prepo.save(carrito);
//		//generar factura
//		Factura factura = fserv.generarFactura(carrito);
//		try {
//			// generar pdf
//			byte[] pdf = pdfServ.generarPdf(factura);
//			eserv.enviarFacturaAdjunto(carrito.getUsuario().getEmail(), factura, pdf);
//		} catch (Exception e) {
//			throw new RuntimeException("Error generando o enviando la factura", e);
//		}
//		
//		//crear carrito nuevo vacio
//		Pedido nuevoCarrito = new Pedido();
//		nuevoCarrito.setUsuario(carrito.getUsuario());
//		nuevoCarrito.setEstado(EstadoPedido.CARRITO);
//		nuevoCarrito.setTotal(0.0);
//		nuevoCarrito.setFechaVenta(null);
//		prepo.save(nuevoCarrito);
//		return pserv.resumenPedido(carrito.getIdPedido());
//	}

	//Devuelve 'CARRITO'
	@Override
	public PedidoResponseDto getCarritoActivo(Integer idUsuario) {
		//Devuelve 'CARRITO'
		//Solo 1 carrito activo
	    Optional<Pedido> carritoOpt =
	            prepo.findByUsuario_IdUsuarioAndEstadoPedido(idUsuario, EstadoPedido.CARRITO);

	    // Si existe devolver
	    if (carritoOpt.isPresent()) {
	        Pedido carrito = carritoOpt.get();
	        return pserv.resumenPedido(carrito.getIdPedido());
	    }
	    //Sino crea uno nuevo
	    Pedido nuevo = createCarrito(idUsuario);
	    return pserv.resumenPedido(nuevo.getIdPedido());
	}
	@Override
	@Transactional
	public Pedido prepararPedido(Integer idUsuario) {
			//Mantiene el estado CARRITO, antes cambiaba a a PEDIENTE_PAGO y se perdia el CARRITO
	    	Pedido existe = prepo
	            .findByUsuario_IdUsuarioAndEstadoPedido(idUsuario, EstadoPedido.CARRITO)
	            .orElseThrow(() -> new RuntimeException("No hay carrito activo"));
	    	
	    	pserv.recalcularTotalPedido(existe);


		    return prepo.save(existe);
	}

}
