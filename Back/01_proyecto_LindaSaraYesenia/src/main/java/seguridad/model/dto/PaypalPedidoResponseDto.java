package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaypalPedidoResponseDto {
	private String paypalIdPedido;
	//la url de aprobacion que se da cuando el pedido se ha
	private String approveUrl;
}
