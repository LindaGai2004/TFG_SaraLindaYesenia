package seguridad.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.Producto;


public interface ProductoRepository extends JpaRepository<Producto, Integer>{

	List<Producto> findByNombreProductoContainingIgnoreCase ( String nombreProducto );
	Optional<Producto> libroDestacado();

}
