package seguridad.restcontroller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import seguridad.model.EstadoPedido;
import seguridad.model.Pedido;
import seguridad.model.Usuario;
import seguridad.model.dto.IngresoMensualDto;
import seguridad.model.dto.PedidoResponse;
import seguridad.repository.UsuarioRepository;
import seguridad.service.CarritoService;
import seguridad.service.PedidoService;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
//Asume que la orden ya se ha'REALIZADO'
public class PedidoRestController {
	@Autowired
	private PedidoService pserv;
	@Autowired
	private CarritoService cserv;
	@Autowired
	private UsuarioRepository urepo;
	
	//Para Dashboard -> Solo mostrar id_pedido, id_cliente, fecha, total, estado, metodoPago
	@GetMapping("/todos")
	@PreAuthorize("hasAnyRole('ADMON', 'JEFE','TRABAJADOR')")
	public ResponseEntity<?> todos(){
		List<Pedido> pedidos = pserv.findAll();
		List<PedidoResponse> respuestas = pedidos.stream()
				.map(p ->pserv.resumenPedido(p.getIdPedido()))
				.collect(Collectors.toList());
		return ResponseEntity.ok(respuestas);
	}
	
	
	
	//Historial de pedidos por usuario
	@GetMapping("/usuario/")
	@PreAuthorize("hasRole('CLIENTE')")
	public ResponseEntity<?> pedidosPorUsuario(){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Usuario usuario = (Usuario) auth.getPrincipal();
		List<PedidoResponse> pedidosUsuario = pserv.findByIdUsuario(usuario.getIdUsuario())
				 	.stream()
	                .map(p -> pserv.resumenPedido(p.getIdPedido()))
	                .collect(Collectors.toList());
		return ResponseEntity.ok(pedidosUsuario);
	}
	

	
	 @GetMapping("/mensual")
	@PreAuthorize("hasRole('ADMON')")
	    public List<IngresoMensualDto> getMensual() {
	        return pserv.getIngresosMensuales();
	    }

	 @GetMapping("/mensual/total")
	@PreAuthorize("hasRole('ADMON')")
	 	public double getTotal() {
	       return pserv.getTotalIngreso();
	   }
		//Resumen del pedido
		@GetMapping("/{idPedido:\\d+}")
		public ResponseEntity<?> pedidoPorIdPedido(@PathVariable Integer idPedido){
			PedidoResponse resumen = pserv.resumenPedido(idPedido);
			return ResponseEntity.ok(resumen);
		}
		
	 
	//Cambio de Estado
	@PutMapping("/{idPedido}/estado/{estado}")
	@PreAuthorize("hasAnyRole('CLIENTE')")
	public ResponseEntity<?> modificarEstado(@PathVariable Integer idPedido, @PathVariable EstadoPedido estado){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) auth.getPrincipal();

        Pedido pedido = pserv.updateEstado(idPedido, estado, usuario.getIdUsuario());
        return ResponseEntity.ok(pedido);
	}

	
}
