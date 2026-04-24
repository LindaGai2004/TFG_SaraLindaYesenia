package seguridad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.Libro;
import seguridad.model.Producto;

public interface LibroRepository  extends JpaRepository<Libro, Integer>{
	List<Libro> findByNombreProductoContainingIgnoreCase (String nombreProducto);
	List<Libro> findByAutorContainingIgnoreCase (String autor);
	List<Libro> findByISBNContaining (String isbn);
	List<Libro> findByEditorialContainingIgnoreCase(String editorial);
	List<Libro> findByGeneroNombreGeneroIgnoreCase(String genero);
	List<Libro> findByGenero_NombreGeneroContainingIgnoreCase(String texto);
	//busca por nombre, descripcion o nombre del genero o autor
	@EntityGraph(attributePaths = {"imagenes"})
	List<Libro> findByNombreProductoContainingIgnoreCaseOrDescripcionContainingIgnoreCaseOrGeneroNombreGeneroContainingIgnoreCaseOrAutorContainingIgnoreCase(
	    String nombre, String desc, String genero, String autor
	);

}
