package seguridad.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.Pedido;
import seguridad.model.Usuario;
import seguridad.model.dto.CarritoItemRequest;
import seguridad.model.dto.PedidoResponse;
import seguridad.repository.ProductoRepository;
import seguridad.repository.UsuarioRepository;
import seguridad.service.CarritoService;
import seguridad.service.ProductoService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/carrito")
//Pedido en estado 'CARRITO'
public class CarritoRestController {
	 	@Autowired
	    private CarritoService cserv;

	    
	//Obtener o sino crear carrito para el usuario
	@GetMapping
	public ResponseEntity<?> fetchCarrito() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Usuario usuario = (Usuario) auth.getPrincipal();
		PedidoResponse dto = cserv.getCarritoActivo(usuario.getIdUsuario());
		return ResponseEntity.ok(dto);
	}
	
	//Funcion Añadir (+)
	@PostMapping("/add")
	public ResponseEntity<PedidoResponse> addItem(@RequestBody CarritoItemRequest item){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Usuario usuario = (Usuario) auth.getPrincipal();
		cserv.addItem(usuario.getIdUsuario(), item);
		PedidoResponse dto= cserv.getCarritoActivo(usuario.getIdUsuario());
		return ResponseEntity.ok(dto);
	}
	
	//Reemplazar cantidad (UPDATE)
	@PutMapping("/update")
	public ResponseEntity<?> updateItem(@RequestBody CarritoItemRequest item){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Usuario usuario = (Usuario) auth.getPrincipal();
		cserv.updateItem(usuario.getIdUsuario(), item);
        PedidoResponse dto = cserv.getCarritoActivo(usuario.getIdUsuario());
		return ResponseEntity.ok(dto);
	}
	@DeleteMapping("/delete/{idProducto}")
	public ResponseEntity<?> deleteItem(@PathVariable Integer idProducto){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Usuario usuario = (Usuario) auth.getPrincipal();
		cserv.deleteItem(usuario.getIdUsuario(), idProducto);
        PedidoResponse dto = cserv.getCarritoActivo(usuario.getIdUsuario());
		return ResponseEntity.ok(dto);
	}
	@PostMapping("/checkout")
	@PreAuthorize("hasAnyRole('CLIENTE')")
	public ResponseEntity<?> confirmarPedido(){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Usuario usuario = (Usuario) auth.getPrincipal();
        PedidoResponse dto = cserv.confirmarCarrito(usuario.getIdUsuario());
        return ResponseEntity.ok(dto);
	}

}
