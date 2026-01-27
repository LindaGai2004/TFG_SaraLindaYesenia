package seguridad.model.Dto;
import lombok.AllArgsConstructor;import lombok.Data;import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
//Este es para un linea de la lista de productos que envia el carrito desde el front
//El front envia idProducto y cantidad
public class PedidoItemRequest {
	private Integer idProducto;
	private Integer cantidad;
}
