package seguridad.model.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PedidoItemResponse {
	private String nombreProducto;
	private Integer cantidad;
	private Double precioUnidad;
	private Double totalItem;
}
