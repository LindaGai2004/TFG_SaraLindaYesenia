package seguridad.model.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import seguridad.model.Perfil;
import seguridad.model.Usuario;

@AllArgsConstructor
@NoArgsConstructor
@Data 
@Builder
public class UsuarioDto {
	
	private Integer idUsuario;
	private String username;
	private String nombre;
	private String apellidos;
	private String direccion;
	private String email;
	private LocalDate fechaRegistro;
	private String avatar;
	private Perfil perfil;


	public UsuarioDto(Usuario usuario) {
		this.idUsuario = usuario.getIdUsuario();
		this.username = usuario.getUsername();
		this.nombre = usuario.getNombre();
		this.apellidos = usuario.getApellidos();
		this.direccion = usuario.getDireccion();
		this.email = usuario.getEmail();
		this.fechaRegistro = usuario.getFechaRegistro();
		this.avatar = usuario.getAvatar();
		this.perfil = usuario.getPerfil();
	}
}
