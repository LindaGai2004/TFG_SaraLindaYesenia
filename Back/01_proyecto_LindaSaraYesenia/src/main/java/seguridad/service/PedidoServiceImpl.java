package seguridad.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.DetallePedido;
import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;
import seguridad.model.Producto;
import seguridad.model.Usuario;
import seguridad.model.Dto.PedidoItemRequest;
import seguridad.model.Dto.PedidoRequest;
import seguridad.repository.PedidoRepository;
import seguridad.repository.ProductoRepository;
import seguridad.repository.UsuarioRepository;
import seguridad.repository.DetallePedidoRepository;
@Service
public class PedidoServiceImpl implements PedidoService {

	@Autowired
	private PedidoRepository prepo;
	private ProductoRepository porepo;
	private UsuarioRepository urepo;
	private  DetallePedidoRepository dprepo;
	@Override
	public Pedido insertPedido(PedidoRequest request) {
		Usuario usuario = urepo.findById(request.getIdUsuario())
				.orElseThrow(()-> new RuntimeException("Usuario no encontrado"));
		Pedido pedido = new Pedido();
		pedido.setUsuario(usuario);
		pedido.setFechaVenta(LocalDate.now());
		pedido.setEstado(EstadoPedido.REALIZADO);
		
		double total = 0;
		pedido = prepo.save(pedido);
		
		for (PedidoItemRequest item:request.getItems()) {
			Producto producto = porepo.findById(item.getIdProducto())
				.orElseThrow(()-> new RuntimeException("No existe el producto"));
			double precio = producto.getPrecio();
			int cantidad = item.getCantidad();
			DetallePedido detalle = new DetallePedido();
			detalle.setPedido(pedido);
			detalle.setProducto(producto);
			detalle.setCantidad(cantidad);
			detalle.setPrecioUnidad(precio);
			
			dprepo.save(detalle);
			total += precio * cantidad;
			
			
		}
		pedido.setTotal(total);
		return prepo.save(pedido);
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
	public Pedido findById(Integer idPedido) {
		return prepo.findById(idPedido).orElse(null);
	}
	@Override
	public Pedido updateEstado(Integer idPedido, EstadoPedido estado) {
		Pedido pedido = findById(idPedido);
		if (pedido==null)
			return null;
		pedido.setEstado(estado);
		return prepo.save(pedido);
	}

}
