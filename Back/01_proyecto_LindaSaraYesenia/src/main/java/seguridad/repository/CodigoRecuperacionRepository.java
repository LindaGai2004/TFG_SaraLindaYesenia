package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import seguridad.model.CodigoRecuperacion;

public interface CodigoRecuperacionRepository extends JpaRepository<CodigoRecuperacion, String> {

}
