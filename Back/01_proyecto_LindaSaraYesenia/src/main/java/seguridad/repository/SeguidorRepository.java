package seguridad.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import seguridad.model.Seguidor;
import seguridad.model.Usuario;

@Repository
public interface SeguidorRepository extends JpaRepository<Seguidor, Integer> {
    
    // Para saber si un usuario ya sigue a otro (importante para el botón Seguir/Siguiendo)
    Optional<Seguidor> findBySeguidorAndSeguido(Usuario seguidor, Usuario seguido);

    // Conteo de seguidores de un usuario
    Long countBySeguido(Usuario seguido);

    // Conteo de a cuántos sigue un usuario
    Long countBySeguidor(Usuario seguidor);
}