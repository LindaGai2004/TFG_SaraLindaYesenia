package seguridad.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import seguridad.model.EstadoPedido;
import seguridad.model.Producto;
import seguridad.model.Usuario;

public interface ProductoRepository extends JpaRepository<Producto, Integer>{

	List<Producto> findByNombreProductoContainingIgnoreCase ( String nombreProducto );
	Optional<Producto> libroDestacado();
	
}
