package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
//Para operaciones de un item del carrito
public class CarritoItemRequest {
	 private Integer idProducto;
	 private Integer cantidad;
}
