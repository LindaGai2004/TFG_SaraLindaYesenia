package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import seguridad.model.ResenaProducto;

import java.util.List;

@Repository
public interface ResenaProductoRepository extends JpaRepository<ResenaProducto, Integer> {


    // Obtener todas las reseñas de un producto especifico
    List<ResenaProducto> findByProducto_IdProductoOrderByFechaDesc(int idProducto);

    // Comprobar si un usuario ya ha reseñado un producto
    boolean existsByUsuario_IdUsuarioAndProducto_IdProducto(int idUsuario, int idProducto);

    // Calcular la nota media de un producto
    @Query("SELECT AVG(r.calificacion) FROM ResenaProducto r WHERE r.producto.idProducto = :idProducto")
    Double obtenerMediaCalificacion(@Param("idProducto") int idProducto);
    
    // Contar cuántas reseñas tiene un producto
    long countByProducto_IdProducto(int idProducto);
}