package seguridad.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.Producto;
import seguridad.model.ResenaProducto;
import seguridad.model.Usuario;
import seguridad.model.dto.ResenaProductoDto;
import seguridad.service.ProductoService;
import seguridad.service.ResenaProductoService;
import seguridad.service.UsuarioService;


@RestController
@RequestMapping("/resenas")
@CrossOrigin(origins = "*")
public class ResenaProductoRestController {

    @Autowired
    private ResenaProductoService resenaService;
    
    @Autowired
    private ProductoService productoService;
    
    @Autowired
    private UsuarioService usuarioService;
    

    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<List<ResenaProducto>> listarPorProducto(@PathVariable int idProducto) {
        return ResponseEntity.ok(resenaService.getResenasPorProducto(idProducto));
    }

    // Obtener la nota media de reseñas un producto
    @GetMapping("/media/{idProducto}")
    public ResponseEntity<Double> verMedia(@PathVariable int idProducto) {
        return ResponseEntity.ok(resenaService.getMediaCalificacion(idProducto));
    }

    // Guardar una nueva reseña
    @PostMapping("/guardar")
    public ResponseEntity<?> crearResena(@RequestBody ResenaProductoDto dto) {
        Usuario user = usuarioService.findById(dto.getIdUsuario());
        Producto prod = productoService.findOne(dto.getIdProducto());

        ResenaProducto resena = new ResenaProducto();
        resena.setUsuario(user);
        resena.setProducto(prod);
        resena.setCalificacion(dto.getCalificacion());
        resena.setComentario(dto.getComentario());

        return ResponseEntity.ok(resenaService.guardarResena(resena));
    }

    
    @DeleteMapping("/eliminar/{idResena}")
    public ResponseEntity<?> borrar(@PathVariable int idResena) {
        resenaService.deleteById(idResena);
        return ResponseEntity.ok("Reseña eliminada correctamente");
    }
}