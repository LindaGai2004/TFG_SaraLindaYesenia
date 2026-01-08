package seguridad.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.Rol;
import seguridad.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
	
	Optional<Usuario> findByEmail(String email);
	Usuario findByEmailAndPassword(String email, String password);
	List<Usuario> findByPerfil_IdPerfil(int  idPerfil);
	
	boolean existsByEmail(String email);
	
	List<Usuario> findByPerfil_IdPerfilAndEmailContainingIgnoreCase (int idPerfil, String email);
	List<Usuario> findByPerfil_IdPerfilAndNombreContainingIgnoreCase (int idPerfil, String nombre);
	List<Usuario> findByPerfil_IdPerfilAndUsernameContainingIgnoreCase (int idPerfil, String username);

	
}
