package seguridad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.Libro;
import seguridad.model.Usuario;

public interface LibroRepository  extends JpaRepository<Libro, Integer>{
	List<Libro> findByNombreProductoContainingIgnoreCase (String nombreProducto);
	List<Libro> findByAutorContainingIgnoreCase (String autor);
	List<Libro> findByISBNContaining (String isbn);
	List<Libro> findByEditorialContainingIgnoreCase(String editorial);

}
