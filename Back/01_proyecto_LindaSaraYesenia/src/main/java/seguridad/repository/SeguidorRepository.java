package seguridad.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import seguridad.model.Seguidor;
import seguridad.model.Usuario;

@Repository
public interface SeguidorRepository extends JpaRepository<Seguidor, Integer> {
    
    // Para saber si un usuario ya sigue a otro
    Optional<Seguidor> findBySeguidorAndSeguido(Usuario seguidor, Usuario seguido);

    // Seguidores de un usuario
    Long countBySeguido(Usuario seguido);

    // Cuántos sigue un usuario
    Long countBySeguidor(Usuario seguidor);
    
    List<Seguidor> findBySeguido(Usuario seguido);   // mis seguidores
    List<Seguidor> findBySeguidor(Usuario seguidor); // a quién sigo
}