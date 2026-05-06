package seguridad.service;

import java.util.List;

import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;
import seguridad.model.dto.CarritoItemRequestDto;
import seguridad.model.dto.IngresoMensualDto;
import seguridad.model.dto.PedidoResponseDto;

public interface PedidoService {
	
	//Para el cliente
	List<Pedido> findByIdUsuario(Integer idUsuario);
	Pedido updateEstado(Integer idPedido, EstadoPedido estadoPedido, Integer idUsuario);

	//Para admon
	List<Pedido> findAll();
	Pedido findById(Integer idPedido);
	void recalcularTotalPedido(Pedido pedido);
	//Resumen de pedido. Devuelve DTO
	PedidoResponseDto resumenPedido(Integer idPedido);
    List<IngresoMensualDto> getIngresosMensuales();
    double getTotalIngreso();
}
