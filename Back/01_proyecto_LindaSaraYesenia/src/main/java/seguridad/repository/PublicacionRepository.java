package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import seguridad.model.Publicacion;

import java.util.List;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Integer> {

    // Obtener publicaciones ordenadas por fecha (más recientes primero)
    List<Publicacion> findAllByOrderByFechaDesc();

    // Obtener publicaciones de un usuario específico
    List<Publicacion> findByUsuarioIdUsuarioOrderByFechaDesc(Integer idUsuario);

}
