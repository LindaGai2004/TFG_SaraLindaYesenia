package seguridad.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;
import seguridad.model.Dto.PedidoRequest;
import seguridad.model.Dto.PedidoResponseDto;
import seguridad.service.PedidoService;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
public class PedidoRestController {
	@Autowired
	private PedidoService pserv;
	
	@PostMapping
	@PreAuthorize("hasAnyRole('CLIENTE')")
	public ResponseEntity<?> crearPedido(@RequestBody PedidoRequest pedido){
		Pedido creado = pserv.insertPedido(pedido);
		return ResponseEntity.ok(creado);
	}
	//Historial de pedidos por usuario
	@GetMapping("usuario/{idUsuario}")
	public ResponseEntity<?> pedidosPorUsuario(@PathVariable Integer idUsuario){
		List<Pedido> pedidosUsuario = pserv.findByIdUsuario(idUsuario);
		return ResponseEntity.ok(pedidosUsuario);
	}
	//Resumen del pedido
	@GetMapping("/{idPedido}")
	public ResponseEntity<?> pedidoPorIdPedido(@PathVariable Integer idPedido){
		Pedido pedido = pserv.findById(idPedido);
		if (pedido == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(new PedidoResponseDto(pedido));
	}
	@GetMapping
	@PreAuthorize("hasAnyRole('ADMON', 'JEFE','TRABAJADOR')")
	public ResponseEntity<?> todos(){
		List<Pedido> pedidos = pserv.findAll();
		return ResponseEntity.ok(pedidos);
	}
	@PutMapping("{idPedido}/estado/{estado}")
	@PreAuthorize("hasAnyRole('ADMON')")
	public ResponseEntity<?> modificarEstado(@PathVariable Integer idPedido, @PathVariable EstadoPedido estado){
		Pedido modificado = pserv.updateEstado(idPedido, estado);
		return ResponseEntity.ok(modificado);
	}
	
}
