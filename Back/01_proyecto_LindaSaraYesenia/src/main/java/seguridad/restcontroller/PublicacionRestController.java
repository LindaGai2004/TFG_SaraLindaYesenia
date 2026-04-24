package seguridad.restcontroller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.security.core.Authentication;

import seguridad.model.Publicacion;
import seguridad.model.Usuario;
import seguridad.model.dto.PublicacionDto;
import seguridad.service.PublicacionService;
import seguridad.service.UsuarioService;

@RestController
@RequestMapping("/publicaciones")
@CrossOrigin(origins = "*")
public class PublicacionRestController {
	
	@Value("${app.upload.dir:./upload/}")
	private String uploadDir;
	
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
    /*
    // Crear una nueva publicación
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PublicacionDto> crearPublicacion(
            @RequestParam Integer idUsuario,
            @RequestParam String texto,
            @RequestParam(required = false) Integer idProducto,
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
                    nombreImagen != null ? "/uploads/publicaciones/" + nombreImagen : null,
                    idProducto
            );

            return ResponseEntity.ok(publicacionService.mapToDto(nueva));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }*/

    // Crear una nueva publicacion (Corregido sin ruta hardcodeada)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PublicacionDto> crearPublicacion(
            @RequestParam Integer idUsuario,
            @RequestParam String texto,
            @RequestParam(required = false) Integer idProducto,
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

                // RUTA NO ABSOLUTA
                Path ruta = Paths.get(uploadDir, "publicaciones", nombreImagen);

             // Make sure the directory exists before writing
             Files.createDirectories(ruta.getParent());
             Files.write(ruta, imagen.getBytes());
            }

            // Crear publicación
            Publicacion nueva = publicacionService.crearPublicacion(
                    usuario,
                    texto,
                    nombreImagen != null ? "/uploads/publicaciones/" + nombreImagen : null,
                    idProducto
            );

            return ResponseEntity.ok(publicacionService.mapToDto(nueva));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    // Likes
    /*@PostMapping("/{id}/like")
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
    }*/
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable("id") Integer id,
            @RequestParam("idUsuario") Integer idUsuario // Especificamos el nombre exacto
    ) {
        try {
            boolean liked = publicacionService.toggleLike(id, idUsuario);
            return ResponseEntity.ok(Map.of(
                "liked", liked,
                "mensaje", liked ? "Like añadido" : "Like eliminado"
            ));
        } catch (Exception e) {
            // Esto te dirá en la consola de Eclipse qué ha pasado exactamente
            e.printStackTrace(); 
            return ResponseEntity.status(500).build();
        }
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
    
    
    // Eliminar publicación
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPublicacion(
            @PathVariable Integer id, 
            @RequestParam Integer idUsuario,
            Authentication auth // Para verificar el rol de ADMIN si quieres
    ) {
        try {
            Publicacion pub = publicacionService.obtenerPorId(id);

            if (pub == null) {
                return ResponseEntity.status(404).body("La publicación no existe");
            }

            // Solo el autor o el admin (Rol = 1) pueden eliminar la publicacion
            Usuario usuarioActual = (Usuario) auth.getPrincipal();
            boolean esAutor = pub.getUsuario().getIdUsuario().equals(idUsuario);
            boolean esAdmin = usuarioActual.getPerfil().getIdPerfil() == 1;

            if (!esAutor && !esAdmin) {
                return ResponseEntity.status(403).body("No tienes permiso para eliminar esta publicación");
            }

            publicacionService.eliminarPublicacion(id);
            return ResponseEntity.ok(Map.of("mensaje", "Publicación eliminada correctamente"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al eliminar la publicación: " + e.getMessage());
        }
    }
    
    
}