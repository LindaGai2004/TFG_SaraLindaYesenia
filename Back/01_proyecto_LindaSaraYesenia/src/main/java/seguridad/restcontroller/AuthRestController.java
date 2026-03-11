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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import seguridad.model.CodigoRecuperacion;
import seguridad.model.Usuario;
import seguridad.repository.CodigoRecuperacionRepository;
import seguridad.repository.UsuarioRepository;
import seguridad.service.EmailService;
import seguridad.service.UsuarioService;
import seguridad.service.VerificacionCuentaService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthRestController {

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private VerificacionCuentaService verificacionService;

    @Autowired
    private CodigoRecuperacionRepository codigoRepo;
    
    @Autowired
    private UsuarioRepository usuarioRepo;

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
        cr.setExpiracion(LocalDateTime.now().plusSeconds(60));
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

    
    @PostMapping("/reenviar-codigo")
    public ResponseEntity<?> reenviarCodigo(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (!usuarioService.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("El email no existe");
        }

        // Borrar códigos anteriores
        codigoRepo.deleteByEmail(email);

        // Generar nuevo código
        String codigo = generarCodigo();

        CodigoRecuperacion cr = new CodigoRecuperacion();
        cr.setEmail(email);
        cr.setCodigo(codigo);
        cr.setExpiracion(LocalDateTime.now().plusSeconds(60));
        cr.setCreadoEn(LocalDateTime.now());
        cr.setUsado(false);

        codigoRepo.save(cr);

        try {
            emailService.enviarCodigoRecuperacion(email, codigo);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error enviando el correo");
        }

        return ResponseEntity.ok("Código reenviado");
    }


    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String codigo = body.get("codigo");

        // Buscar por email
        CodigoRecuperacion cr = codigoRepo.findTopByEmailOrderByExpiracionDesc(email).orElse(null);


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

    @Transactional
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

        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioService.save(usuario);

        codigoRepo.deleteByEmail(email);

        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }
    
    
	 // VERIFICAR TOKEN
	 @PostMapping("/verificar")
	 public ResponseEntity<?> verificarCuenta(@RequestParam String token) {
	
	     var optionalToken = verificacionService.obtenerPorToken(token);
	
	     if (optionalToken.isEmpty()) {
	         return ResponseEntity.badRequest().body("Token inválido");
	     }
	
	     var verificacion = optionalToken.get();
	
	     if (verificacion.getExpiracion().isBefore(LocalDateTime.now())) {
	         return ResponseEntity.badRequest().body("Token expirado");
	     }
	
	     Usuario usuario = verificacion.getUsuario();
	     usuario.setEnabled(1); // activar cuenta
	     usuarioRepo.save(usuario);
	
	     verificacionService.eliminarTokensDeUsuario(usuario);
	
	     return ResponseEntity.ok("Cuenta verificada correctamente");
	 }
	
	 
	 // REENVIAR TOKEN
	 @PostMapping("/reenviar-verificacion")
	 public ResponseEntity<?> reenviarToken(@RequestParam String email) {
	     
	     Usuario usuario = usuarioRepo.findByEmail(email).orElse(null);

	     if (usuario == null) {
	         return ResponseEntity.badRequest().body("El email no existe");
	     }

	     if (usuario.getEnabled() == 1) {
	         return ResponseEntity.badRequest().body("La cuenta ya está verificada");
	     }

	     var nuevoToken = verificacionService.generarNuevoToken(usuario);

	     String link = "http://localhost:5173/verificacion-cuenta?token=" + nuevoToken.getToken();

	     try {
	         emailService.enviarEmailSimple(
	             usuario.getEmail(),
	             "Verifica tu cuenta",
	             "Haz clic en el siguiente enlace para activar tu cuenta:\n" + link
	         );
	     } catch (Exception e) {
	         return ResponseEntity.status(500).body("Error enviando el correo");
	     }

	     return ResponseEntity.ok("Correo de verificación reenviado");
	 }

}