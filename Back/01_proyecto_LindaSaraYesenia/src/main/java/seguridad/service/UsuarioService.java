package seguridad.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

import seguridad.model.Rol;
import seguridad.model.Usuario;
import seguridad.model.dto.UsuarioRecomendadoDto;

public interface UsuarioService extends UserDetailsService{
	
	Usuario findById(Integer idUsuario);
	Usuario findByEmail(String email);
	boolean existsByEmail(String email);
	
	List<Usuario> findAll();
	
	Usuario registrarCliente(Usuario usuario);
	Usuario registrarUsuarios(Usuario usuario);
	Usuario updateUsuario(Usuario usuario);
	Usuario save(Usuario usuario);

	List<Usuario> findByPerfil(int idPerfil);
	int deleteById(Integer idUsuario);
	//anterior
	//String normalizePassword(String raw);
	List<Usuario> FindByRolAndTexto(int idPerfil, String texto);

	/* Usuarios recomendados */
	List<UsuarioRecomendadoDto> obtenerUsuariosRecomendados();

}
