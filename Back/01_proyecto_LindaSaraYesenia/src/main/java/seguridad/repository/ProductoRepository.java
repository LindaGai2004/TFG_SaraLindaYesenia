package seguridad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import seguridad.model.Producto;
import seguridad.model.TipoProducto;

public interface ProductoRepository extends JpaRepository<Producto, Integer>{

	List<Producto> findByNombreLibroContainingIgnoreCase ( String nombreLibro );
	
    @Query("SELECT p FROM Producto p WHERE LOWER(p.tipoProducto) = LOWER(:tipo)")
    List<Producto> findByTipoProductoIgnoreCase(@Param("tipo") String tipo);
    
	List<Producto> findByCategoriaPapeleria_NombreContainingIgnoreCase ( String nombre );
	List<Producto> findByCategoriaLibro_GeneroLibroContainingIgnoreCase ( String generoLibro );
	
}
