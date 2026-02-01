package seguridad.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import seguridad.model.DetallePedido;
import seguridad.model.EstadoPedido;
import seguridad.model.EstadoProducto;
import seguridad.model.Pedido;
import seguridad.model.Producto;
import seguridad.model.Usuario;
import seguridad.model.Dto.CarritoItemRequest;
import seguridad.model.Dto.PedidoResponse;
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
	
	// Estado = 'CARRITO'
	// Solo puede haber un carrito por usuario
	@Override
	public Pedido createCarrito(Integer idUsuario) {
		Usuario usuario = urepo.findById(idUsuario)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		Pedido carritoExiste = prepo.findByUsuario_IdUsuarioAndEstado(idUsuario, EstadoPedido.CARRITO)
		.orElse(null);
		//Verificar si ya existe Pedido con estado 'CARRITO' para un usuario
		if (carritoExiste!= null) {
			//Devuelve carrito
			return carritoExiste;
		}else {
			//Crea uno y lo devuelve
			Pedido carritoNuevo = new Pedido();
			carritoNuevo.setUsuario(usuario);
			carritoNuevo.setEstado(EstadoPedido.CARRITO);
			carritoNuevo.setFechaVenta(null);
			carritoNuevo.setTotal(0.0);
			return prepo.save(carritoNuevo);
		}
		
	}
	//Funcionalidad "Add to cart" SOLO ADD (+)
	@Override
	public Pedido addItem(Integer idUsuario, CarritoItemRequest item) {
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

	    return carrito;
		
	}
	//Cambiar la cantidad de un detallePedido existente (+/-) o eliminar si < 0
	@Override
	public Pedido updateItem(Integer idUsuario, CarritoItemRequest item) {
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
	        return carrito;
	    }
	    if (item.getCantidad() > producto.getStock()) {
	        throw new RuntimeException("¡Producto sin stock!");
	    }
	    //Para hacer update de la cantidad
	    detalle.setCantidad(item.getCantidad());
	    dprepo.save(detalle);
	    return carrito;
	    
	}

	@Override
	public Pedido deleteItem(Integer idUsuario, Integer idProducto) {
		Pedido carrito = createCarrito(idUsuario);
		DetallePedido detalle = dprepo.findByPedido_IdPedidoAndProducto_IdProducto(
				carrito.getIdPedido(), idProducto)
				.orElseThrow(() -> new RuntimeException("El producto no está en el carrito"));
		dprepo.delete(detalle);
		return carrito;
	}

	@Override
	@Transactional //Si algun paso falla no se actualiza el stock ni se confirma el pedido
	public PedidoResponse confirmarCarrito(Integer idUsuario) {
		//Get carrito activo (Pedido en estado 'CARRITO')
		Pedido carrito = prepo.findByUsuario_IdUsuarioAndEstado(idUsuario, EstadoPedido.CARRITO)
			.orElseThrow(() -> new RuntimeException ("No hay carrito activo"));
		//Get detalles
		List<DetallePedido> detalles = dprepo.findByPedido_IdPedido(carrito.getIdPedido());
		if (detalles.isEmpty()) {
	        throw new RuntimeException("El carrito está vacío");
	    }
		//Calcular total
		double total = 0.0;
		for (DetallePedido d: detalles) {
			Producto producto = d.getProducto();
			int cantidad = d.getCantidad();
			//Verificar Stock
			if(producto.getStock() < cantidad) {
				 throw new RuntimeException(
		                    "No hay stock para " + producto.getNombreProducto());
			}
			//Actualizar stock
			producto.setStock(producto.getStock() - cantidad);
			//Actualizar estado producto if stock=0
			if(producto.getStock() == 0) {
				producto.setEstadoProducto(EstadoProducto.AGOTADO);
			}
			porepo.save(producto);
			total += d.getPrecioUnidad() * cantidad;
			
		}
		//Pedido realizado con total
		carrito.setEstado(EstadoPedido.REALIZADO);
		carrito.setFechaVenta(LocalDate.now());
		carrito.setTotal(total);
		
		prepo.save(carrito);
		return pserv.resumenPedido(carrito.getIdPedido());
	}
	@Override
	public PedidoResponse getCarritoActivo(Integer idUsuario) {
		 Pedido carrito = prepo.findByUsuario_IdUsuarioAndEstado(idUsuario, EstadoPedido.CARRITO)
			        .orElseThrow(() -> new RuntimeException("No hay carrito activo"));
		  return pserv.resumenPedido(carrito.getIdPedido());
	}

}
