package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioRecomendadoDto {
    
    private Integer idUsuario;
    private String nombre;
    private String apellidos;

    private Long totalPublicaciones;
    private Long totalLikes;
    private Long totalComentarios;

    private String avatar;

    private Long popularidad;
    private boolean siguiendo;
    
}
