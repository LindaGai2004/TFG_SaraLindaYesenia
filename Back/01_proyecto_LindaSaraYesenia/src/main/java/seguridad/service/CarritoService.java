package seguridad.service;

import seguridad.model.Pedido;
import seguridad.model.dto.CarritoItemRequest;
import seguridad.model.dto.PedidoResponse;

public interface CarritoService {
	//crea pedido con estado 'CARRITO'
	Pedido createCarrito(Integer idUsuario);
	Pedido addItem(Integer idUsuario, CarritoItemRequest item);
	Pedido updateItem(Integer idUsuario, CarritoItemRequest item);
	Pedido deleteItem(Integer idUsuario, Integer idProducto);
	//checkout
	PedidoResponse confirmarCarrito(Integer idUsuario);
	
	PedidoResponse getCarritoActivo(Integer idUsuario);
	//Faltaría un método para impedir que se modifique el carro despues del checkout
}
