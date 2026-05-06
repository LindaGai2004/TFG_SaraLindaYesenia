package seguridad.service;


import com.paypal.orders.Order;

import seguridad.model.dto.PaypalPedidoResponseDto;
import seguridad.model.dto.PedidoResponseDto;

import java.io.IOException;

public interface PaypalService {
	
	PaypalPedidoResponseDto crearPedido(Integer idPedido) throws IOException;
	PedidoResponseDto  capturarPedido(String paypalIdPedido) throws IOException;
	void cancelarPedido(String paypalIdPedido);
}
