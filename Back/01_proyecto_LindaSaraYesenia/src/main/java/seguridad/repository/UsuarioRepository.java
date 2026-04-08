package seguridad.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import seguridad.model.Rol;
import seguridad.model.Usuario;
import seguridad.model.dto.UsuarioRecomendadoDto;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
	
	Optional<Usuario> findByEmail(String email);
	Usuario findByEmailAndPassword(String email, String password);
	List<Usuario> findByPerfil_IdPerfil(int  idPerfil);
	
	boolean existsByEmail(String email);
	boolean existsByUsername(String username);
	List<Usuario> findByPerfil_IdPerfilAndEmailContainingIgnoreCase (int idPerfil, String email);
	List<Usuario> findByPerfil_IdPerfilAndNombreContainingIgnoreCase (int idPerfil, String nombre);
	List<Usuario> findByPerfil_IdPerfilAndUsernameContainingIgnoreCase (int idPerfil, String username);
	List<Usuario> findByPerfil_IdPerfilAndApellidosContainingIgnoreCase(int idPerfil, String apellidos);
	
	/* Usuarios recomendados para la Comunidad */
	/* El join es para unir los usarios con su publicacion
	 * Ordena por el nº de publicaciones */
	@Query("""
		    SELECT new seguridad.model.dto.UsuarioRecomendadoDto(
		        u.idUsuario,
		        u.nombre,
		        u.apellidos,
		        COUNT(DISTINCT p.id),
		        COUNT(DISTINCT l.id),
		        COUNT(DISTINCT c.id),
		        u.avatar,
		        (COUNT(DISTINCT p.id) * 2L + COUNT(DISTINCT l.id) + COUNT(DISTINCT c.id))
		    )
		    FROM Usuario u
		    LEFT JOIN Publicacion p ON p.usuario.idUsuario = u.idUsuario
		    LEFT JOIN LikePublicacion l ON l.publicacion.id = p.id
		    LEFT JOIN ComentarioPublicacion c ON c.publicacion.id = p.id
		    GROUP BY u.idUsuario, u.nombre, u.apellidos, u.avatar
		    ORDER BY (COUNT(DISTINCT p.id) * 2L + COUNT(DISTINCT l.id) + COUNT(DISTINCT c.id)) DESC
		""")
		List<UsuarioRecomendadoDto> obtenerUsuariosRecomendados();


}
