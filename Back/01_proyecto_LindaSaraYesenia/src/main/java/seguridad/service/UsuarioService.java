package seguridad.service;

import java.util.List;

import seguridad.model.Rol;
import seguridad.model.Usuario;

public interface UsuarioService {
	
	Usuario findById(Integer idUsuario);
	Usuario findByEmail(String email);
	
	List<Usuario> findAll();
	
	Usuario registrarCliente(Usuario usuario);
	Usuario registrarUsuarios(Usuario usuario);
	
	
	List<Usuario> findByPerfil(int idPerfil);
	
	int deleteById(Integer idUsuario);
	
	Usuario updateUsuario(Usuario usuario);
	
	String normalizePassword(String raw);
	
	 List<Usuario> FindByRolAndTexto(int idPerfil, String texto);

}
