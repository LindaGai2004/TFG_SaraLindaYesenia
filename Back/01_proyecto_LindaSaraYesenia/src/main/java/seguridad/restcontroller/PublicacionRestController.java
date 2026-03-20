package seguridad.restcontroller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import seguridad.model.Usuario;
import seguridad.model.dto.PublicacionDto;
import seguridad.service.PublicacionService;
import seguridad.service.UsuarioService;

@RestController
@RequestMapping("/publicaciones")
@CrossOrigin(origins = "*")
public class PublicacionRestController {

    @Autowired
    private PublicacionService publicacionService;

    @Autowired
    private UsuarioService usuarioService;

    // Obtener todas las publicaciones (feed)
    @GetMapping
    public ResponseEntity<List<PublicacionDto>> obtenerPublicaciones() {
        return ResponseEntity.ok(publicacionService.obtenerPublicaciones());
    }

    // Obtener publicaciones de un usuario concreto
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<PublicacionDto>> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(publicacionService.obtenerPublicacionesPorUsuario(idUsuario));
    }

    // Crear una nueva publicación
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> crearPublicacion(
            @RequestParam Integer idUsuario,
            @RequestParam String texto,
            @RequestPart(required = false) MultipartFile imagen
    ) {
        Usuario usuario = usuarioService.findById(idUsuario);

        if (usuario == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        String nombreImagen = null;

        if (imagen != null && !imagen.isEmpty()) {
            nombreImagen = imagen.getOriginalFilename();
            // Aquí podrías guardar la imagen en disco o S3
        }

        publicacionService.crearPublicacion(usuario, texto, nombreImagen);

        return ResponseEntity.ok(
                Map.of("mensaje", "Publicación creada correctamente")
        );
    }
    
    
    // Likes
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Integer id,
            @RequestParam Integer idUsuario
    ) {
        boolean liked = publicacionService.toggleLike(id, idUsuario);

        return ResponseEntity.ok(
            Map.of(
                "liked", liked,
                "mensaje", liked ? "Like añadido" : "Like eliminado"
            )
        );
    }
    
    
    // Añadir comentario
    @PostMapping("/{id}/comentarios")
    public ResponseEntity<Map<String, String>> comentar(
            @PathVariable Integer id,
            @RequestParam Integer idUsuario,
            @RequestParam String texto
    ) {
        publicacionService.agregarComentario(id, idUsuario, texto);

        return ResponseEntity.ok(
            Map.of("mensaje", "Comentario añadido correctamente")
        );
    }
}