package seguridad.model.Dto;
import java.util.List;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
//Este es para todo el json completo del pedido que envía el front
public class PedidoRequest {
	private Integer idUsuario;
	private List<PedidoItemRequest> items;
}
