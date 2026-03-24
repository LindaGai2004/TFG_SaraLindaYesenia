package seguridad.service;

import java.util.List;

import seguridad.model.Publicacion;
import seguridad.model.Usuario;
import seguridad.model.dto.PublicacionDto;

public interface PublicacionService {

    List<PublicacionDto> obtenerPublicaciones();

    List<PublicacionDto> obtenerPublicacionesPorUsuario(Integer idUsuario);

    Publicacion crearPublicacion(Usuario usuario, String texto, String nombreImagen);

    Publicacion obtenerPorId(Integer id);
    
    PublicacionDto mapToDto(Publicacion publicacion);

    void eliminarPublicacion(Integer id);
    
    boolean toggleLike(Integer idPublicacion, Integer idUsuario);

    void agregarComentario(Integer idPublicacion, Integer idUsuario, String texto);
}
