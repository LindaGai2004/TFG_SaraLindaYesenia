package seguridad.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.DetallePedido;
import seguridad.model.EstadoPedido;
import seguridad.model.EstadoProducto;
import seguridad.model.Libro;
import seguridad.model.Pedido;
import seguridad.model.Producto;
import seguridad.model.Usuario;
import seguridad.model.Dto.PedidoItemRequest;
import seguridad.model.Dto.PedidoItemResponseDto;
import seguridad.model.Dto.PedidoRequest;
import seguridad.model.Dto.PedidoResponseDto;
import seguridad.repository.PedidoRepository;
import seguridad.repository.ProductoRepository;
import seguridad.repository.UsuarioRepository;
import seguridad.repository.DetallePedidoRepository;
@Service
public class PedidoServiceImpl implements PedidoService {

	@Autowired
	private PedidoRepository prepo;
	@Autowired
	private ProductoRepository porepo;
	@Autowired
	private UsuarioRepository urepo;
	@Autowired
	private  DetallePedidoRepository dprepo;
	
	private static final double IVA_LIBRO = 0.04;
	private static final double IVA_PAPELERIA = 0.21;

	//guarda el subtotal
	@Override
	public Pedido insertPedido(PedidoRequest request) {
		Usuario usuario = urepo.findById(request.getIdUsuario())
				.orElseThrow(()-> new RuntimeException("Usuario no encontrado"));
		Pedido pedido = new Pedido();
		pedido.setUsuario(usuario);
		pedido.setFechaVenta(LocalDate.now());
		pedido.setEstado(EstadoPedido.REALIZADO);
		pedido.setTotal(0.0);
		//guardar pedido para obtener id
		pedido = prepo.save(pedido);
		
		double total= 0.0;
		
		for (PedidoItemRequest item : request.getItems()) {
			Producto producto = porepo.findById(item.getIdProducto())
				.orElseThrow(()-> new RuntimeException("No existe el producto"));
			
			int cantidad = item.getCantidad();
			
			if (producto.getStock() < cantidad) {
			    throw new RuntimeException("Stock insuficiente para " + producto.getNombreProducto());
			}
			
			DetallePedido detalle = new DetallePedido();
			detalle.setPedido(pedido);
			detalle.setProducto(producto);
			detalle.setCantidad(cantidad);
			detalle.setPrecioUnidad(producto.getPrecio());
			
			dprepo.save(detalle);
			
			producto.setStock(producto.getStock() - cantidad);
			
			if (producto.getStock() == 0) {
				producto.setEstadoProducto(EstadoProducto.AGOTADO);
			}
			porepo.save(producto);
			
			total += producto.getPrecio()*cantidad;
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
	//muestra subtotal + iva = total final
	@Override
	public PedidoResponseDto resumenPedido(Integer idPedido) {
		Pedido pedido = prepo.findById(idPedido)
				.orElseThrow(() -> new RuntimeException("No existe este pedido"));
		List<DetallePedido> detalles = dprepo.findByPedido_IdPedido(idPedido);
		
		double subtotal = 0;
		double ivaTotal = 0;
		List<PedidoItemResponseDto> items = new ArrayList<>();
		
		for (DetallePedido d: detalles) {
			double totalBase = d.getPrecioUnidad()* d.getCantidad();
			subtotal += totalBase;
			double iva;
			
			if(d.getProducto() instanceof Libro) {
				iva = totalBase*0.04;
			}else {
				iva = totalBase*0.21;
			}
			ivaTotal += iva;
			
			PedidoItemResponseDto item = new PedidoItemResponseDto(
					d.getProducto().getIdProducto(),
					d.getProducto().getNombreProducto(),
					d.getPrecioUnidad(),
					d.getCantidad()
					);
			items.add(item);	
		}
		double total = subtotal + ivaTotal;
		
	}

}
