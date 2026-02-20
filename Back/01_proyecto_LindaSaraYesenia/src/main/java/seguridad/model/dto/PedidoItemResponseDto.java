package seguridad.model.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor 
public class PedidoItemResponseDto {
	private Integer idProducto;
	private String nombreProducto;
	private String autor;
	private Integer cantidad;
	private Double precioUnidad;
	private Double totalPorItem; // sin iva
	private List<ImagenDto> imagenes;

}
