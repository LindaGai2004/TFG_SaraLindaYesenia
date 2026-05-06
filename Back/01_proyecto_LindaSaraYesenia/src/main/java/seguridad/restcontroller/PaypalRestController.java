package seguridad.restcontroller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import seguridad.model.dto.PedidoResponseDto;
import seguridad.service.PaypalService;

@RestController
@RequestMapping("/api/paypal")
@CrossOrigin(origins = "*")
// campos final requieren ser inicializados
@RequiredArgsConstructor
public class PaypalRestController {
	private final PaypalService ppService;
	
	@PostMapping("/crear-pedido/{idPedido}")
	public Object crearPedido(@PathVariable Integer idPedido) throws Exception{
		return ppService.crearPedido(idPedido);
	}
	@PostMapping("/capturar-pedido/{paypalIdPedido}")
	public PedidoResponseDto capturePedido(@PathVariable String paypalIdPedido) throws Exception{
		return ppService.capturarPedido(paypalIdPedido);
	}
	@PostMapping("/paypal/cancel/{paypalId}")
	public ResponseEntity<?> cancelar(@PathVariable String paypalId) {
		ppService.cancelarPedido(paypalId);
	    return ResponseEntity.ok("Pedido cancelado");
	}
}
