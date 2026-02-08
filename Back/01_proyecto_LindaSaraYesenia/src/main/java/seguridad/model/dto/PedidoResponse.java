package seguridad.model.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
//Lo que envía el back
public class PedidoResponse {
	private Integer idPedido;
	private LocalDate fechaVenta;
	private String metodoPago;
	private EstadoPedido estadoPedido;
	
	private Double subtotal;
	private Double iva;
	private Double total;
	
	private String nombre;
	private String direccion;
	private String email;
	
	private List<PedidoItemResponse> items;

}
