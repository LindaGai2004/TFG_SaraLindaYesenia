package seguridad.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {	
	//Ver pedidos de un usuario	
	List<Pedido> findByUsuario_IdUsuario(Integer idUsuario);
	//Ver estado del pedido de un usuario
	Optional<Pedido> findByUsuario_IdUsuarioAndEstado(Integer idUsuario, EstadoPedido estadoPedido);
}