package seguridad.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import seguridad.model.DetallePedido;

@Repository interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer>{
	//Detalles de un pedido
	List<DetallePedido> findByPedido_IdPedido(Integer idPedido);
}