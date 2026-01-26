package seguridad.service;

import java.util.List;

import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;
import seguridad.model.Dto.PedidoRequest;
import seguridad.model.Dto.PedidoResponseDto;

public interface PedidoService {
	
	//Para el cliente
	Pedido insertPedido(PedidoRequest request);
	List<Pedido> findByIdUsuario(Integer idUsuario);
	
	//Para admon
	List<Pedido> findAll();
	Pedido findById(Integer idPedido);
	Pedido updateEstado(Integer idPedido, EstadoPedido estado);
	
	//Resumen de pedido
	PedidoResponseDto resumenPedido(Integer idPedido);
}
