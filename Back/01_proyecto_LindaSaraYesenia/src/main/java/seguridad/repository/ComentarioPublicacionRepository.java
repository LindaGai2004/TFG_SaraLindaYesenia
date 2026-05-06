package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import seguridad.model.ComentarioPublicacion;

import java.util.List;

public interface ComentarioPublicacionRepository extends JpaRepository<ComentarioPublicacion, Integer> {

	List<ComentarioPublicacion> findByPublicacion_IdOrderByFechaDesc(Integer idPublicacion);
	
	int countByPublicacion_Id(Integer idPublicacion);
	
	List<ComentarioPublicacion> findByPublicacion_Id(Integer idPublicacion);

	void deleteByPublicacion_Id(Integer idPublicacion);
	
	 @Modifying
	    @Query("DELETE FROM ComentarioPublicacion c WHERE c.usuario.idUsuario = :idUsuario")
	    void deleteByUsuarioId(int idUsuario);
	    
	    @Modifying
	    @Query("DELETE FROM ComentarioPublicacion c WHERE c.publicacion.id IN :ids")
	    void deleteByPublicacionIds(List<Integer> ids);
	
}
