package seguridad.restcontroller;


import java.util.Map;

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
import seguridad.model.dto.CarritoItemRequestDto;
import seguridad.model.dto.PedidoResponseDto;
import seguridad.repository.UsuarioRepository;
import seguridad.service.CarritoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/carrito")
//Pedido en estado 'CARRITO'
public class CarritoRestController {
	 	@Autowired
	    private CarritoService cserv;
	 	@Autowired
	    private UsuarioRepository urepo;
	//Obtener o sino crear carrito para el usuario
	@GetMapping
	public ResponseEntity<?> fetchCarrito() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Usuario usuario = (Usuario) auth.getPrincipal();
		PedidoResponseDto dto = cserv.getCarritoActivo(usuario.getIdUsuario());
		return ResponseEntity.ok(dto);
	}
	
	//Funcion Añadir (+)
	@PostMapping("/add")
	public ResponseEntity<PedidoResponseDto> addItem(@RequestBody CarritoItemRequestDto item){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Usuario usuario = (Usuario) auth.getPrincipal();
		cserv.addItem(usuario.getIdUsuario(), item);
		PedidoResponseDto dto= cserv.getCarritoActivo(usuario.getIdUsuario());
		return ResponseEntity.ok(dto);
	}
	
	//Reemplazar cantidad (UPDATE)
	@PutMapping("/update")
	public ResponseEntity<?> updateItem(@RequestBody CarritoItemRequestDto item){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Usuario usuario = (Usuario) auth.getPrincipal();
		cserv.updateItem(usuario.getIdUsuario(), item);
        PedidoResponseDto dto = cserv.getCarritoActivo(usuario.getIdUsuario());
		return ResponseEntity.ok(dto);
	}
	@DeleteMapping("/delete/{idProducto}")
	public ResponseEntity<?> deleteItem(@PathVariable Integer idProducto){

	    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    String email = auth.getName();  
	    Usuario usuario = urepo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
	    cserv.deleteItem(usuario.getIdUsuario(), idProducto);
	    PedidoResponseDto dto = cserv.getCarritoActivo(usuario.getIdUsuario());

	    return ResponseEntity.ok(dto);
	}
	@PostMapping("/checkout")
	@PreAuthorize("hasAnyRole('CLIENTE')")
	public ResponseEntity<?> prepararPedido() {
		 Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		    Usuario usuario = (Usuario) auth.getPrincipal();

		    Pedido pedido = cserv.prepararPedido(usuario.getIdUsuario());

		    return ResponseEntity.ok(pedido);
	}
}
