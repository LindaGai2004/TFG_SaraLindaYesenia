package seguridad.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import jakarta.transaction.Transactional;
import seguridad.model.CodigoRecuperacion;

public interface CodigoRecuperacionRepository extends JpaRepository<CodigoRecuperacion, Integer> {

	Optional<CodigoRecuperacion> findTopByEmailOrderByExpiracionDesc(String email);

    Optional<CodigoRecuperacion> findByEmailAndCodigo(String email, String codigo);

    @Modifying    // Indica que este método modifica la base de datos 
    @Transactional // Abre una transacción para poder ejecutar el borrado
    void deleteByEmail(String email);
}