package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsuarioRecomendadoDto {

    private Integer idUsuario;
    private String nombre;
    private String apellidos;
    private Long totalPublicaciones;
}
