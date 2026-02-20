package seguridad.model.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@NoArgsConstructor
@Getter
@Setter
public class PedidoItemResponseDto {
	private Integer idProducto;
	private String nombreProducto;
	private String autor;
	private Integer cantidad;
	private Double precioUnidad;
	private Double totalPorItem; //sin iva
	
	public PedidoItemResponseDto(Integer idProducto, String nombreProducto, String autor,Integer cantidad,Double precioUnidad, Double totalPorItem) {
        this.idProducto = idProducto;
        this.nombreProducto = nombreProducto;
        this.autor = autor;
        this.cantidad = cantidad;
        this.precioUnidad = precioUnidad;
        this.totalPorItem = totalPorItem;
    }
}
