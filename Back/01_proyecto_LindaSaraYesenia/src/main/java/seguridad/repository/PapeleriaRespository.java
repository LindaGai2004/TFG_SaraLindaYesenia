package seguridad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.Papeleria;
import seguridad.model.Producto;

public interface PapeleriaRespository extends JpaRepository<Papeleria, Integer>{
	List<Papeleria> findByNombreProductoContainingIgnoreCase (String nombreProducto);
	List<Papeleria> findByMarcaNombreMarcaContainingIgnoreCase(String marca);
	List<Papeleria> findByCategoriaNombreCategoriaIgnoreCase(String categoria);
	//busca por nombre, descripcion o nombre de categoria
	@EntityGraph(attributePaths = {"imagenes"})
	List<Papeleria> findByNombreProductoContainingIgnoreCaseOrDescripcionContainingIgnoreCaseOrCategoriaNombreCategoriaContainingIgnoreCase(String nombre, String desc, String categoria);
}
