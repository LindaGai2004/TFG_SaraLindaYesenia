package seguridad.service;

import java.util.List;

import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;

public interface PedidoService {
	
	//Para el cliente
	Pedido insertPedido(Pedido pedido);
	List<Pedido> findByIdUsuario(Integer idUsuario);
	
	//Para admon
	List<Pedido> findAll();
	Pedido findById(Integer idPedido);
	Pedido updateEstado(Integer idPedido, EstadoPedido estado);
	
}
