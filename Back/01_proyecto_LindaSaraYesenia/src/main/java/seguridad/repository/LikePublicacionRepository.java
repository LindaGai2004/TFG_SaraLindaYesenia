package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import seguridad.model.LikePublicacion;

import java.util.Optional;

public interface LikePublicacionRepository extends JpaRepository<LikePublicacion, Integer> {

	Optional<LikePublicacion> findByPublicacion_IdAndUsuario_IdUsuario(Integer idPublicacion, Integer idUsuario);

    int countByPublicacion_Id(Integer idPublicacion);
    
    void deleteByPublicacion_Id(Integer idPublicacion);
}
