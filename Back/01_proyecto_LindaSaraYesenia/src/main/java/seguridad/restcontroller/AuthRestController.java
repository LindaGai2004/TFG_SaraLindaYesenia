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

        String codigo = generarCodigo();

        CodigoRecuperacion cr = new CodigoRecuperacion();
        cr.setEmail(email);
        cr.setCodigo(codigo);
        cr.setExpiracion(LocalDateTime.now().plusMinutes(10));
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

        // 1. Buscar el código en la BD
        CodigoRecuperacion cr = codigoRepo.findById(email).orElse(null);

        if (cr == null) {
            return ResponseEntity.badRequest().body("No existe un código para este email");
        }

        // 2. Comprobar si coincide
        if (!cr.getCodigo().equals(codigo)) {
            return ResponseEntity.badRequest().body("Código incorrecto");
        }

        // 3. Comprobar expiración
        if (cr.getExpiracion().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Código expirado");
        }

        // 4. Todo correcto
        return ResponseEntity.ok("Código válido");
    }
    
    
    @PostMapping("/restablecer")
    public ResponseEntity<?> restablecer(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String nuevaPassword = body.get("password");

        // 1. Validar datos
        if (email == null || nuevaPassword == null || nuevaPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Datos incompletos");
        }

        // 2. Buscar usuario
        Usuario usuario = usuarioService.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("El usuario no existe");
        }

        // 3. Cambiar contraseña (encriptada)
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioService.updateUsuario(usuario);

        // 4. Eliminar código de recuperación
        codigoRepo.deleteById(email);

        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }


}
