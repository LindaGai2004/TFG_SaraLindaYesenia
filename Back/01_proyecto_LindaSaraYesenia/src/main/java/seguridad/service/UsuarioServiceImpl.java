package seguridad.service;
	
	import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.security.core.userdetails.UserDetails;
	import org.springframework.security.core.userdetails.UserDetailsService;
	import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
	
	import seguridad.model.Perfil;
	import seguridad.model.Usuario;
import seguridad.model.dto.UsuarioRecomendadoDto;
import seguridad.repository.PerfilRepository;
import seguridad.repository.SeguidorRepository;
import seguridad.repository.UsuarioRepository;
	@Service
	public class UsuarioServiceImpl implements UsuarioService, UserDetailsService{
	
	@Autowired
		private UsuarioRepository usuarioRepository;
	
	@Autowired
	    private PerfilRepository perfilRepository;
	
	@Autowired
	private SeguidorRepository seguidorRepository;
	
	@Autowired
		private PasswordEncoder passwordEncoder;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
	
		Usuario usuario = usuarioRepository.findByEmail(email)
	                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
		
		return usuario;
	}
	
	@Override
	public Usuario findById(Integer idUsuario) {
		return usuarioRepository.findById(idUsuario).orElse(null);
	}
	
	@Override
	public Usuario findByEmail(String email) {
		return usuarioRepository.findByEmail(email).orElse(null);
	}
	
	/*
	@Override
	public Usuario findByEmailPassword(String email, String password) {
	        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
	        if (usuario != null && usuario.getPassword().equals("{noop}" + password)) {
	           return usuario;
	        } else {
	        return null;
	        }
	}
	*/
	
	@Override
	public List<Usuario> findAll() {
		return usuarioRepository.findAll();
	}
	
	@Override
	public Usuario registrarCliente(Usuario usuario) {
	
	   if (usuarioRepository.existsByEmail(usuario.getEmail())) {
	       throw new RuntimeException("El email ya está registrado");
	   }
	   if (usuarioRepository.existsByUsername(usuario.getUsername() )) { // 
	       throw new RuntimeException("El usuario ya está registrado");
	   }
	   
	   if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
	       throw new RuntimeException("Password requerida");
	   }
	   //el service se asegura de añadir {noop} si hace falta
	   String password = usuario.getPassword();
	   
	   usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
	   usuario.setFechaRegistro(LocalDate.now());
	
	   if (usuario.getDireccion() == null)
	    usuario.setDireccion("");
	
	   if (usuario.getPerfil() == null || usuario.getPerfil().getIdPerfil() == 0) {
	       Perfil perfilCliente = perfilRepository.findById(2).orElseThrow(()
	        -> new RuntimeException("El perfil cliente no existe"));
	       usuario.setPerfil(perfilCliente);
	   } 
	   return usuarioRepository.save(usuario);
	}
	
	
	
	//añadir jefe y trabajador
	@Override
	public Usuario registrarUsuarios(Usuario usuario) {
		
		if (usuarioRepository.existsByEmail(usuario.getEmail())) {
		       throw new RuntimeException("El email ya está registrado");
		   }
		
		   
		   if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
		       throw new RuntimeException("Password requerida");
		   }
		   //el service se asegura de añadir {noop} si hace falta
		   String password = usuario.getPassword();
		   //anterior
//		   if (!password.startsWith("{noop}")) {
//		       usuario.setPassword("{noop}" + password);
//		   } else {
//		       usuario.setPassword(password);
//		   }
		   usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

		   usuario.setFechaRegistro(LocalDate.now());
		
		   if (usuario.getDireccion() == null)
		    usuario.setDireccion("");
		
		   if (usuario.getEnabled() == 0)
		    usuario.setEnabled(1);

		   if (usuario.getPerfil() == null || usuario.getPerfil().getIdPerfil() == 0) {
			    throw new RuntimeException("Perfil obligatorio");
			}
		   
		   Integer idPerfil = usuario.getPerfil().getIdPerfil();
		   Perfil perfilDB = perfilRepository.findById(idPerfil)
		        .orElseThrow(() -> new RuntimeException("Perfil con ID " + idPerfil + " no existe"));
		   usuario.setPerfil(perfilDB);
		   
		
		   return usuarioRepository.save(usuario);
	}
	
	
	@Override
	public List<Usuario> findByPerfil(int idPerfil) {
		return usuarioRepository.findByPerfil_IdPerfil(idPerfil);
	}
	
	//ELIMINAR
	@Override
	public int deleteById(Integer idUsuario) {

	   boolean exists = usuarioRepository.existsById(idUsuario);
	   if (!exists) {
	       return 0;
	   }else {
	   usuarioRepository.deleteById(idUsuario);
	   return 1;
	   }
	}
	
	
	//MODIFICAR
	@Override
	public Usuario updateUsuario(Usuario usuario) {
		//anterior
	    //return usuarioRepository.save(usuario);
		Usuario existente = usuarioRepository.findById(usuario.getIdUsuario())
				.orElseThrow(()-> new RuntimeException("Usuario no existe"));
		existente.setNombre(usuario.getNombre());
		existente.setApellidos(usuario.getApellidos());
		existente.setDireccion(usuario.getDireccion());
		existente.setEmail(usuario.getEmail());
		//solo encriptar contraseña si hay y no es nulo
		if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
			existente.setPassword(passwordEncoder.encode(usuario.getPassword()));
		}
		return usuarioRepository.save(existente);
	}

//anterior con {noop}
//	public String normalizePassword(String raw) {
//		  if (raw == null)
//		   
//		   return null;
//		String cleaned = raw.replace("{noop}", "").trim();
//		   
//		   return "{noop}" + cleaned;
//		}

	//BUSCAR POR NOMBRE, USERMANE, ETC
	@Override
	public List<Usuario> FindByRolAndTexto(int idPerfil, String texto) {
	    List<Usuario> porEmail = usuarioRepository.findByPerfil_IdPerfilAndEmailContainingIgnoreCase(idPerfil, texto);
	    List<Usuario> porNombre = usuarioRepository.findByPerfil_IdPerfilAndNombreContainingIgnoreCase(idPerfil, texto);
	    List<Usuario> porUsername = usuarioRepository.findByPerfil_IdPerfilAndUsernameContainingIgnoreCase(idPerfil, texto);
	    List<Usuario> porApellido = usuarioRepository.findByPerfil_IdPerfilAndApellidosContainingIgnoreCase(idPerfil, texto);

	    Set<Usuario> resultado = new HashSet<>();
	    resultado.addAll(porEmail);
	    resultado.addAll(porNombre);
	    resultado.addAll(porUsername);
	    resultado.addAll(porApellido);

	    return new ArrayList<>(resultado);
	}
	
	
	@Override
	public boolean existsByEmail(String email) {
	    return usuarioRepository.existsByEmail(email);
	}

	@Override
	public Usuario save(Usuario usuario) {
	    return usuarioRepository.save(usuario);
	}

	
	
	@Override
	public List<UsuarioRecomendadoDto> obtenerUsuariosRecomendados(Integer idUsuarioLogueado) {
	    List<UsuarioRecomendadoDto> recomendados = usuarioRepository.obtenerUsuariosRecomendados();
	    
	    // i no hay usuario logueado, devolvemos la lista tal cual
	    if (idUsuarioLogueado == null) {
	        return recomendados;
	    }

	    Usuario usuarioLogueado = usuarioRepository.findById(idUsuarioLogueado).orElse(null);

	    // Por cada recomendado, comprobamos si el usuario logueado ya lo sigue
	    for (UsuarioRecomendadoDto dto : recomendados) {
	        Usuario usuarioRecomendado = usuarioRepository.findById(dto.getIdUsuario()).orElse(null);
	        
	        if (usuarioLogueado != null && usuarioRecomendado != null) {
	            boolean yaLoSigo = seguidorRepository.findBySeguidorAndSeguido(usuarioLogueado, usuarioRecomendado).isPresent();
	            dto.setSiguiendo(yaLoSigo);
	        }
	    }

	    return recomendados;
	}

	@Override
	public boolean existsByUsername(String username) {
		return usuarioRepository.existsByUsername(username);
	}

}