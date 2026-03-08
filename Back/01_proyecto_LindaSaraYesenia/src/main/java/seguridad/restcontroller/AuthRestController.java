package seguridad.restcontroller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.CodigoRecuperacion;
import seguridad.model.Usuario;
import seguridad.repository.CodigoRecuperacionRepository;
import seguridad.service.EmailService;
import seguridad.service.UsuarioService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthRestController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private CodigoRecuperacionRepository codigoRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // Genera un código de 6 dígitos
    private String generarCodigo() {
        int codigo = (int)(Math.random() * 900000) + 100000;
        return String.valueOf(codigo);
    }

    @PostMapping("/recuperar")
    public ResponseEntity<?> recuperar(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (!usuarioService.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("El email no existe");
        }

        // Generar código
        String codigo = generarCodigo();

        // Crear registro (SIN ID)
        CodigoRecuperacion cr = new CodigoRecuperacion();
        cr.setEmail(email);
        cr.setCodigo(codigo);
        cr.setExpiracion(LocalDateTime.now().plusMinutes(10));
        cr.setCreadoEn(LocalDateTime.now());
        cr.setUsado(false);

        codigoRepo.save(cr);

        try {
            emailService.enviarCodigoRecuperacion(email, codigo);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error enviando el correo");
        }

        return ResponseEntity.ok("Código enviado");
    }


    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String codigo = body.get("codigo");

        // Buscar por email
        CodigoRecuperacion cr = codigoRepo.findByEmail(email).orElse(null);

        if (cr == null) {
            return ResponseEntity.badRequest().body("No existe un código para este email");
        }

        if (!cr.getCodigo().equals(codigo)) {
            return ResponseEntity.badRequest().body("Código incorrecto");
        }

        if (cr.getExpiracion().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Código expirado");
        }

        return ResponseEntity.ok("Código válido");
    }


    @PostMapping("/restablecer")
    public ResponseEntity<?> restablecer(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String nuevaPassword = body.get("password");

        if (email == null || nuevaPassword == null || nuevaPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Datos incompletos");
        }

        Usuario usuario = usuarioService.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("El usuario no existe");
        }

        // Actualizar contraseña
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));

        // Guardar cambios en la BD
        usuarioService.updateUsuario(usuario);

        // Eliminar códigos usados
        codigoRepo.deleteByEmail(email);

        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }
}