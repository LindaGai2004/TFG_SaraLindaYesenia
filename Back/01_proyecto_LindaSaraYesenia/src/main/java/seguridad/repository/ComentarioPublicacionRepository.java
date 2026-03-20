package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import seguridad.model.ComentarioPublicacion;

import java.util.List;

public interface ComentarioPublicacionRepository extends JpaRepository<ComentarioPublicacion, Integer> {

	List<ComentarioPublicacion> findByPublicacion_IdOrderByFechaDesc(Integer idPublicacion);
	
	int countByPublicacion_Id(Integer idPublicacion);
}
