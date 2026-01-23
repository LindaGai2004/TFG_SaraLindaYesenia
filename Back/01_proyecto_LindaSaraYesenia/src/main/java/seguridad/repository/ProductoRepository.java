package seguridad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import seguridad.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Integer>{

	List<Producto> findByNombreProductoContainingIgnoreCase ( String nombreProducto );
    
	
}
