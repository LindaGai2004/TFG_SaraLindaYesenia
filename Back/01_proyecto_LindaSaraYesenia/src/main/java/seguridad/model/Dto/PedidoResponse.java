package seguridad.model.Dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
