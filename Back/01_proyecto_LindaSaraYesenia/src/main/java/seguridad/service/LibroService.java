package seguridad.service;

import java.util.List;

import seguridad.model.Libro;

public interface LibroService {

	List<Libro> findAll();
	Libro findOne (Integer idProducto);
	Libro insertarLibro(Libro libro);
	Libro updateLibro(Libro libro);

	List<Libro> buscadorLibro (String texto);
	/* Para encontrar libros populares para Comunidad*/
	List<Libro> findLibrosPopulares();
}
