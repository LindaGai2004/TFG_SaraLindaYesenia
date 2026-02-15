package seguridad.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import seguridad.model.Producto;
import seguridad.service.FavoritosService;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class FavoritosRestController {

    @Autowired
    private FavoritosService favoritosService;

    @GetMapping("/{idUsuario}/favoritos")
    public List<Producto> getFavoritos(@PathVariable Integer idUsuario) {
        return favoritosService.getFavoritos(idUsuario);
    }

    @PostMapping("/{idUsuario}/favoritos/{idProducto}")
    public ResponseEntity<?> addFavorito(@PathVariable Integer idUsuario, @PathVariable Integer idProducto) {
        favoritosService.addFavorito(idUsuario, idProducto);
        return ResponseEntity.ok("Añadido a favoritos");
    }

    @DeleteMapping("/{idUsuario}/favoritos/{idProducto}")
    public ResponseEntity<?> removeFavorito(@PathVariable Integer idUsuario, @PathVariable Integer idProducto) {
        favoritosService.removeFavorito(idUsuario, idProducto);
        return ResponseEntity.ok("Eliminado de favoritos");
    }
}
