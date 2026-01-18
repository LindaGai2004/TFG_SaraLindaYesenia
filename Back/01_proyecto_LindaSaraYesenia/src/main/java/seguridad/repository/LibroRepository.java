package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.Libro;

public interface LibroRepository  extends JpaRepository<Libro, Integer>{

}
