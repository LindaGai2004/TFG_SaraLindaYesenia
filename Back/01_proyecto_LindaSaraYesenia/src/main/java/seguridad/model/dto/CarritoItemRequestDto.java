package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
//Para operaciones de un item del carrito
public class CarritoItemRequestDto {
	 private Integer idProducto;
	 private Integer cantidad;
}
