package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

}
