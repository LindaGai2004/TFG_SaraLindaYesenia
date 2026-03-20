package seguridad.restcontroller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
@CrossOrigin(origins = "*")
public class UploadRestController {

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/publicaciones/";

    @PostMapping("/publicacion")
    public String subirImagen(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return "Archivo vacío";
            }

            // Nombre único
            String nombreArchivo = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // Ruta donde se guardará
            Path ruta = Paths.get(UPLOAD_DIR + nombreArchivo);

            // Guardar archivo
            Files.write(ruta, file.getBytes());

            // Devolver nombre del archivo
            return nombreArchivo;

        } catch (Exception e) {
            return "Error al subir la imagen";
        }
    }
}
