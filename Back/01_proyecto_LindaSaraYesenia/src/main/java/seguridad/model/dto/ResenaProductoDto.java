package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResenaProductoDto {

    private Integer idUsuario;
    private Integer idProducto;
    private int calificacion;
    private String comentario;
}