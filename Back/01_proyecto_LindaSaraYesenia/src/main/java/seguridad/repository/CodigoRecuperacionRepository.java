package seguridad.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.CodigoRecuperacion;

public interface CodigoRecuperacionRepository extends JpaRepository<CodigoRecuperacion, Integer> {

	Optional<CodigoRecuperacion> findTopByEmailOrderByExpiracionDesc(String email);

    Optional<CodigoRecuperacion> findByEmailAndCodigo(String email, String codigo);

    void deleteByEmail(String email);
}