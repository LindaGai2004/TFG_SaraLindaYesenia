package seguridad.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import seguridad.model.DetallePedido;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer>{
	//Detalles de un pedido
	List<DetallePedido> findByPedido_IdPedido(Integer idPedido);
	Optional<DetallePedido> findByPedido_IdPedidoAndProducto_IdProducto(Integer idPedido, Integer idProducto);
}