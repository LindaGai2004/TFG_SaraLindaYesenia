package seguridad.service;

import java.util.List;

import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;
import seguridad.model.dto.CarritoItemRequest;
import seguridad.model.dto.PedidoResponse;

public interface PedidoService {
	
	//Para el cliente
	List<Pedido> findByIdUsuario(Integer idUsuario);
	Pedido updateEstado(Integer idPedido, EstadoPedido estadoPedido, Integer idUsuario);

	//Para admon
	List<Pedido> findAll();
	Pedido findById(Integer idPedido);
	
	//Resumen de pedido. Devuelve DTO
	PedidoResponse resumenPedido(Integer idPedido);
}
