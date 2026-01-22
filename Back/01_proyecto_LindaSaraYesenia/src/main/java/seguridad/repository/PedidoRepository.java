package seguridad.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import seguridad.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {	
	//Ver pedidos de un usuario	
	List<Pedido> findByUsuario_IdUsuario(Integer idUsuario);
}