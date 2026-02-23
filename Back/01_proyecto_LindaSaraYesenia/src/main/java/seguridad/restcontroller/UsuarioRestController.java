package seguridad.restcontroller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import seguridad.model.Perfil;
import seguridad.model.Usuario;
import seguridad.model.dto.UsuarioDto;
import seguridad.repository.PerfilRepository;
import seguridad.security.JwtService;
import seguridad.service.UsuarioService;

@RestController
@CrossOrigin(origins = "*")
public class UsuarioRestController {

    @Autowired
    private UsuarioService usuarioService;
   
    @Autowired
    private PerfilRepository perfilRepository;
   
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtService jwtService;
   
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Mostrar todos los usuarios
    @GetMapping("/todos")
    public ResponseEntity<?> todos() {
        List<Usuario> lista = usuarioService.findAll();
        //para mas seguro de contraseña, que muestra "null"
        lista.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(lista);
    }
   
   

    //LOGIN
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            //anterior
            //SecurityContextHolder.getContext().setAuthentication(auth);
            //HttpSession session = request.getSession(true);
            //session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            Usuario usuarioBD = usuarioService.findByEmail(userDetails.getUsername());

         // Genera el token
            String jwt = jwtService.generarToken(usuarioBD.getEmail());


            UsuarioDto usuarioDto = new UsuarioDto();
            usuarioDto.setUsername(usuarioBD.getUsername());
            usuarioDto.setNombre(usuarioBD.getNombre());
            usuarioDto.setApellidos(usuarioBD.getApellidos());
            usuarioDto.setEmail(usuarioBD.getEmail());
            usuarioDto.setDireccion(usuarioBD.getDireccion());
            usuarioDto.setFechaRegistro(usuarioBD.getFechaRegistro());
            usuarioDto.setPerfil(usuarioBD.getPerfil());

            return ResponseEntity.ok(Map.of("token", jwt, "user", usuarioDto)
            		);

        } catch (Exception e) { 
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

   
   
    //REGISTRAR
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        try {
            Usuario nuevo = usuarioService.registrarCliente(usuario);
            UsuarioDto dto = new UsuarioDto(nuevo);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

   
   
    //MOSTRAR TODOS LOS DATOS POR ROL
    @GetMapping("/rol/{idPerfil}")
    public ResponseEntity<?> porRol(@PathVariable("idPerfil") int rol, Authentication auth) {
    // primero hay que loguear, si no, sale error 401
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado");
        }
       
        // ya esta logueado bien
        Usuario rolActual = (Usuario) auth.getPrincipal();
        // saca idPerfil == Rol de usuario
        int rolObjetivo = rolActual.getPerfil().getIdPerfil();
       
        // son los permisos
        boolean permitido = false;
        // 1 -> para todo
        if (rolObjetivo == 1) {          
            permitido = true;
            //4 -> para los de mas pero sin 1
        } else if (rolObjetivo == 4) {      
            if (rol == 4 || rol == 3 || rol == 2)
            permitido = true;
            //3 -> para 3 y 2
        } else if (rolObjetivo == 3) {    
            if (rol == 3 || rol == 2)
            permitido = true;
            //2 -> solo su propio
        } else if (rolObjetivo == 2) {    
            if (rol == 2)
            permitido = true;
        }
        if (!permitido) {
            return ResponseEntity.status(403).body("No tienes permisos");
        }

        //Busacar usuario con este rol
        List<Usuario> lista = usuarioService.findByPerfil(rol);
        lista.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(lista);
    }
   
   
    //MODIFICAR POR ROL, Y CADA UNO SE PUEDE MODIFICAR A SU PROPIO
    @PutMapping("/usuario/{email}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable String email, @RequestBody Usuario usuario, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        Usuario actual = (Usuario) auth.getPrincipal();
        Usuario objetivo = usuarioService.findByEmail(email);

        if (objetivo == null) {
            return ResponseEntity.notFound().build();
        }

        int rolActual = actual.getPerfil().getIdPerfil();
        int rolObjetivo = objetivo.getPerfil().getIdPerfil();
        boolean isSelf = actual.getEmail().equals(email); 	

        boolean permitido = false;

        if (isSelf) permitido = true;

        if (!permitido) {
            switch (rolActual) {
                case 1: // Admin -> puede modificar todos
                    permitido = true;
                    break;
                case 4: // Jefe -> puede modificar Jefe y Trabajador
                    if (rolObjetivo == 4 || rolObjetivo == 3) 
                    	permitido = true;
                    break;
                case 3: // Trabajador -> puede modificar solo su propio
                    if (rolObjetivo == 3) 
                    	permitido = true;
                    break;
                case 2: // Cliente -> solo puede modificar su propio
                    if (rolObjetivo == 2) 
                    	permitido = true;
                    break;
            }
        }

        if (!permitido) {
            return ResponseEntity.status(403)
                    .body("No tienes permisos para modificar a este usuario");
        }

        // Campos a modificar
        if (usuario.getUsername() != null) objetivo.setUsername(usuario.getUsername());

        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            objetivo.setPassword(usuario.getPassword());
        }

        if (usuario.getNombre() != null) objetivo.setNombre(usuario.getNombre());
        if (usuario.getApellidos() != null) objetivo.setApellidos(usuario.getApellidos());
        if (usuario.getFechaNacimiento() != null) objetivo.setFechaNacimiento(usuario.getFechaNacimiento());
        if (usuario.getDireccion() != null) objetivo.setDireccion(usuario.getDireccion());

        if ((isSelf || rolActual == 1) && usuario.getEmail() != null && !usuario.getEmail().isBlank()) {
            objetivo.setEmail(usuario.getEmail());
        }
        
        // solo Admin puede cambiar perfil de otro
        if (!isSelf && usuario.getPerfil() != null && usuario.getPerfil().getIdPerfil() != 0) {
            Perfil perfilDB = perfilRepository.findById(usuario.getPerfil().getIdPerfil())
                    .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
            objetivo.setPerfil(perfilDB);
        }

        // enabled solo 1 o 2
        int en = usuario.getEnabled();
        if (en == 1 || en == 2) objetivo.setEnabled(en);

        Usuario actualizado = usuarioService.updateUsuario(objetivo);
        actualizado.setPassword(null); // no enviar password 	

        return ResponseEntity.ok(actualizado);
    }

   
    
    //ELIMINAR POR ROL
    @DeleteMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer idUsuario, Authentication auth) {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        Usuario actual = (Usuario) auth.getPrincipal();

       
        if (actual.getIdUsuario().equals(idUsuario)) {
            return ResponseEntity.status(400).body("No puedes eliminarte a ti mismo");
        }

        //buscar en sql
        Usuario objetivo = usuarioService.findById(idUsuario);
       
        if (objetivo == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        int rolActual = actual.getPerfil().getIdPerfil();
        int rolObjetivo = objetivo.getPerfil().getIdPerfil();
        
        boolean permitido = false;

            switch (rolActual) {
                case 1: 
                    permitido = true;
                    break;
                case 4:
                    if (rolObjetivo == 3) 
                    	permitido = true;
                    break;
            }


        if (!permitido) {
            return ResponseEntity.status(403)
                    .body("No tienes permisos para eliminar este usuario");
        }

        // unir con sql
        try {
            int filas = usuarioService.deleteById(idUsuario);
            if (filas == 0) {
            return ResponseEntity.status(404).body("Usuario no encontrado (no eliminado)");
            }else
            return ResponseEntity.ok(Map.of("msg", "Eliminado"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar", "message", e.getMessage()));
        }
    }
    
   
   
  // AÑADIR TRABAJADOR Y JEFE POR ROL (PAGINA DASHBOARD DE ADMIN Y JEFE)
    @PostMapping("/admin/crear")
    public ResponseEntity<?> crearUsuarioAdmin(@RequestBody Usuario usuario, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        Usuario actual = (Usuario) auth.getPrincipal();
       
       
        if (actual.getPerfil().getIdPerfil() != 1 && actual.getPerfil().getIdPerfil() != 4) {
            return ResponseEntity.status(403).body("Solo admin y jefe pueden crear usuarios");
        }

       
        Integer idPerfilNuevo = usuario.getPerfil() != null ? usuario.getPerfil().getIdPerfil() : null;
        
        if (idPerfilNuevo == null || (idPerfilNuevo != 3 && idPerfilNuevo != 4)) {
            return ResponseEntity.status(400).body("Solo se pueden crear TRABAJADORES (3) o JEFES (4)");
        }else if (actual.getPerfil().getIdPerfil() == 4) {

            if (idPerfilNuevo == null || idPerfilNuevo != 3) {
                return ResponseEntity.status(400).body("Los jefes solo pueden crear TRABAJADORES (3)");
            }
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email requerido");
        }
        if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password requerida");
        }

        usuario.setFechaRegistro(LocalDate.now());
        
        if (usuario.getEnabled() == 0) usuario.setEnabled(1);


        try {

            Usuario creado = usuarioService.registrarUsuarios(usuario);
            creado.setPassword(null);
            return ResponseEntity.ok(creado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al crear usuario: " + e.getMessage());
        }
    }
    
    
    
    
    //BUSCAR POR NOMBRE, USERMANE, EMAIL DE LOS USUARIOS POR ROL
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarUsuarios(@RequestParam("idPerfil") int rol, @RequestParam String texto, Authentication auth) {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado.");
        }


        Usuario rolActual = (Usuario) auth.getPrincipal();
        int rolObjetivo = rolActual.getPerfil().getIdPerfil();
        
        boolean permitido = false;

        if (rolObjetivo == 1) {          
            permitido = true;
        } else if (rolObjetivo == 4) {      
            if (rol == 4 || rol == 3 || rol == 2)
            permitido = true;
        } else if (rolObjetivo == 3) {    
            if (rol == 3 || rol == 2)
            permitido = true;
        } 
        
        if (!permitido) {
            return ResponseEntity.status(403).body("No tienes permisos.");
        }

        List<Usuario> lista = usuarioService.FindByRolAndTexto(rol, texto);

        lista.forEach(u -> u.setPassword(null));
        
        if (lista.isEmpty()) {
            return ResponseEntity.ok("No hay usuarios que coincidan con la búsqueda.");
        }

        return ResponseEntity.ok(lista);
    }
}