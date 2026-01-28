package seguridad.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

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
		
		if (carritoExiste!= null) {
			return carritoExiste;
		}else {
			Pedido carritoNuevo = new Pedido();
			carritoNuevo.setUsuario(usuario);
			carritoNuevo.setEstado(EstadoPedido.CARRITO);
			carritoNuevo.setFechaVenta(null);
			carritoNuevo.setTotal(0.0);
			return prepo.save(carritoNuevo);
		}
		
	}

	@Override
	public Pedido añadirItem(Integer idUsuario, CarritoItemRequest item) {
		Pedido carrito = createCarrito(idUsuario);
		Producto producto = porepo.findById(item.getIdProducto())
				.orElseThrow(() -> new RuntimeException("Producto no encontrado"));
		DetallePedido itemExiste = dprepo.findByPedido_IdPedidoAndProducto_IdProducto(
			carrito.getIdPedido(), producto.getIdProducto()).orElse(null);
		if (itemExiste != null) {
			int cambiarQty = itemExiste.getCantidad() + item.getCantidad();
			itemExiste.setCantidad(cambiarQty);
			dprepo.save(itemExiste);
			return carrito;
		}else {
			DetallePedido itemNuevo = new DetallePedido();
			itemNuevo.setPedido(carrito);
			itemNuevo.setProducto(producto);
			itemNuevo.setCantidad(item.getCantidad());
			itemNuevo.setPrecioUnidad(producto.getPrecio());
			return carrito;
		}
		
	}
	//cambiar la cantidad de un detallepedido existente
	@Override
	public Pedido updateItem(Integer idUsuario, CarritoItemRequest item) {
	    Pedido carrito = createCarrito(idUsuario);
	    DetallePedido detalle = dprepo.findByPedido_IdPedidoAndProducto_IdProducto(
	                    carrito.getIdPedido(),item.getIdProducto())
	            .orElseThrow(() -> new RuntimeException("El producto no está en el carrito"));

	    if (item.getCantidad() <= 0) {
	        dprepo.delete(detalle);
	        return carrito;
	    }else {
		    detalle.setCantidad(item.getCantidad());
		    dprepo.save(detalle);
		    return carrito;
	    }
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
	public PedidoResponse confirmarCarrito(Integer idUsuario) {
		Pedido carrito = prepo.findByUsuario_IdUsuarioAndEstado(idUsuario, EstadoPedido.CARRITO)
			.orElseThrow(() -> new RuntimeException ("No hay carrito activo"));
		List<DetallePedido> detalles = dprepo.findByPedido_IdPedido(carrito.getIdPedido());
		if (detalles.isEmpty()) {
	        throw new RuntimeException("El carrito está vacío");
	    }
		double total = 0.0;
		for (DetallePedido d: detalles) {
			
			Producto producto = d.getProducto();
			int cantidad = d.getCantidad();
			if(producto.getStock() < cantidad) {
				 throw new RuntimeException(
		                    "No hay stock para " + producto.getNombreProducto());
			}
			
			producto.setStock(producto.getStock() - cantidad);
			if(producto.getStock() == 0) {
				producto.setEstadoProducto(EstadoProducto.AGOTADO);
			}
			porepo.save(producto);
			total += d.getPrecioUnidad() * cantidad;
			
		}
		
		carrito.setEstado(EstadoPedido.REALIZADO);
		carrito.setFechaVenta(LocalDate.now());
		carrito.setTotal(total);
		
		prepo.save(carrito);
		return pserv.resumenPedido(carrito.getIdPedido());
	}

}
