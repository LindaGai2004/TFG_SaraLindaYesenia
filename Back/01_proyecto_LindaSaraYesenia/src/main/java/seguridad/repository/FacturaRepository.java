package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import seguridad.model.Factura;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Integer> {
	Factura findByPedido_IdPedido(Integer idPedido);
}