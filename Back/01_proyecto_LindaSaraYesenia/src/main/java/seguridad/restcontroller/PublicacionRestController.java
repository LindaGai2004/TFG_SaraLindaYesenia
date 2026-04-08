package seguridad.restcontroller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import seguridad.model.Publicacion;
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
    public ResponseEntity<PublicacionDto> crearPublicacion(
            @RequestParam Integer idUsuario,
            @RequestParam String texto,
            @RequestParam(required = false) MultipartFile imagen
    ){
        try {
            Usuario usuario = usuarioService.findById(idUsuario);
            if (usuario == null) {
                return ResponseEntity.badRequest().build();
            }

            String nombreImagen = null;

            // Guardar imagen si existe
            if (imagen != null && !imagen.isEmpty()) {

                String nombreOriginal = imagen.getOriginalFilename();
                nombreImagen = System.currentTimeMillis() + "_" + nombreOriginal;

                // RUTA ABSOLUTA
                Path ruta = Paths.get(
                    "C:/Users/saray/Documents/TFG_SaraLindaYesenia/Back/01_proyecto_LindaSaraYesenia/upload/publicaciones/" 
                    + nombreImagen
                );

                Files.write(ruta, imagen.getBytes());
            }

            // Crear publicación
            Publicacion nueva = publicacionService.crearPublicacion(
                    usuario,
                    texto,
                    nombreImagen != null ? "/uploads/publicaciones/" + nombreImagen : null
            );

            return ResponseEntity.ok(publicacionService.mapToDto(nueva));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
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