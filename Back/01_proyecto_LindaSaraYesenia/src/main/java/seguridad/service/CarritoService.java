package seguridad.service;

import seguridad.model.Pedido;
import seguridad.model.dto.CarritoItemRequestDto;
import seguridad.model.dto.PedidoResponseDto;

public interface CarritoService {
	//crea pedido con estado 'CARRITO'
	Pedido createCarrito(Integer idUsuario);
	Pedido addItem(Integer idUsuario, CarritoItemRequestDto item);
	Pedido updateItem(Integer idUsuario, CarritoItemRequestDto item);
	Pedido deleteItem(Integer idUsuario, Integer idProducto);
	//ex checkout
	//PedidoResponseDto confirmarCarrito(Integer idUsuario);
	PedidoResponseDto getCarritoActivo(Integer idUsuario);
	Pedido prepararPedido(Integer idUsuario);
}
