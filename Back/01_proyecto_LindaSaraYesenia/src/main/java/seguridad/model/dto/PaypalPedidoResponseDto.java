package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaypalPedidoResponseDto {
	private String paypalIdPedido;
	private String approveUrl;
}
