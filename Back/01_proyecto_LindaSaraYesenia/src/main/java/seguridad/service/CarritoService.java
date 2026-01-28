package seguridad.service;

import seguridad.model.Pedido;
import seguridad.model.Dto.CarritoItemRequest;
import seguridad.model.Dto.PedidoResponse;

public interface CarritoService {
	//crea pedido con estado 'CARRITO'
	Pedido createCarrito(Integer idUsuario);
	Pedido añadirItem(Integer idUsuario, CarritoItemRequest item);
	Pedido updateItem(Integer idUsuario, CarritoItemRequest item);
	Pedido deleteItem(Integer idUsuario, Integer idProducto);
	//checkout
	PedidoResponse confirmarCarrito(Integer idUsuario);
}
