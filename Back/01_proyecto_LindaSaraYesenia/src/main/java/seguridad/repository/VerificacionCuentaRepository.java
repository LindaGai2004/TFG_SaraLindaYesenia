package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import seguridad.model.Usuario;
import seguridad.model.VerificacionCuenta;

@Repository
public interface VerificacionCuentaRepository extends JpaRepository<VerificacionCuenta, Integer> {

    VerificacionCuenta findByToken(String token);

    VerificacionCuenta findByUsuario(Usuario usuario);

    void deleteByUsuario(Usuario usuario);
}
