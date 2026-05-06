package seguridad.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PublicacionDto {

    private Integer idPublicacion;
    private String usuarioNombre;
    private String usuarioAvatar;
    private String texto;
    private String imagen;
    private String fecha;
    private Integer likes;
    private Integer comentarios;
    
    private Integer idProducto;       // Para el enlace a la tienda
    private String nombreProducto;   // Para el título de la tarjeta
    private Double precioProducto;   // Para mostrar el precio
    private String imagenProducto;   // Para mostrar la portada del libro
    private String tipoProducto;
    
    private boolean likedByUser;
    private List<ComentarioDto> listaComentarios;
}
