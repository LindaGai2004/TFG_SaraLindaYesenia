package seguridad.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;
import seguridad.repository.PedidoRepository;
@Service
public class PedidoServiceImpl implements PedidoService {

	@Autowired
	private PedidoRepository prepo;
	@Override
	public Pedido insertPedido(Pedido pedido) {
		return prepo.save(pedido);
	}
	@Override
	public List<Pedido> findByIdUsuario(Integer idUsuario) {
		return prepo.findByUsuario_IdUsuario(idUsuario);
	}
	@Override
	public List<Pedido> findAll() {
		return prepo.findAll();
	}
	@Override
	public Pedido findById(Integer idPedido) {
		return prepo.findById(idPedido).orElse(null);
	}
	@Override
	public Pedido updateEstado(Integer idPedido, EstadoPedido estado) {
		Pedido pedido = findById(idPedido);
		if (pedido==null)
			return null;
		pedido.setEstado(estado);
		return prepo.save(pedido);
	}

}
