package seguridad.restcontroller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import seguridad.model.Producto;
import seguridad.model.Usuario;
import seguridad.service.FavoritosService;

@RestController
@RequestMapping("/usuarios")
//@CrossOrigin(origins = "*")
public class FavoritosRestController {

	@Autowired
	private FavoritosService favoritosService;
	
	@GetMapping("/favoritos")
	public List<Producto> getFavoritos(Authentication authentication) {
	    Usuario usuario = (Usuario) authentication.getPrincipal();
	    return favoritosService.getFavoritos(usuario.getIdUsuario());
	}

	@PostMapping("/favoritos/{idProducto}")
	public ResponseEntity<?> addFavorito(@PathVariable Integer idProducto,
	                                     Authentication authentication) {

	    Usuario usuario = (Usuario) authentication.getPrincipal();

	    favoritosService.añadirFavorito(usuario.getIdUsuario(), idProducto);

	    return ResponseEntity.ok(Map.of("message", "Añadido"));
	}
	
	@DeleteMapping("/favoritos/{idProducto}")
	public ResponseEntity<?> removeFavorito(@PathVariable Integer idProducto,
	                                        Authentication authentication) {
	    Usuario usuario = (Usuario) authentication.getPrincipal();

	    favoritosService.eliminarFavorito(usuario.getIdUsuario(), idProducto);

	    return ResponseEntity.ok(Map.of("message", "Eliminado"));
	}

}
