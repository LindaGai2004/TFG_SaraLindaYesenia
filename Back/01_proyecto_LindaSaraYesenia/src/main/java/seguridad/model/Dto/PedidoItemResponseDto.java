package seguridad.model.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class PedidoItemResponseDto {
	private String nombreProducto;
    private Integer cantidad;
    private Double precioUnidad;
    private Double subtotalItem;
    private Double ivaItem;
}
