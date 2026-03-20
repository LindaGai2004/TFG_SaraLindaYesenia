package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PublicacionDto {

    private Integer id;
    private String usuarioNombre;
    private String usuarioAvatar;
    private String texto;
    private String imagen;
    private String fecha;
    private Integer likes;
    private Integer comentarios;
}